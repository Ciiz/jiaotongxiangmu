<template>
<Row>
  <!-- 添加的时候请求 -->
  <Button type="success" @click="addRoot" size="small" style="margin-right:30px" v-show="editable"> + 添加章</Button>
  <Tree :data="chapter_class_list" :render="renderContent" children-key="child" class="course-tree"></Tree>
  <Modal v-model="modal"
      :title="title"
      :width="modal_width"
      :mask-closable="false"
      footer-hide
      :fullscreen="fullscreen"
  >
    <ChapterClassEdit :id="target_id" :course_id="course_id" v-if="target === 'chapter_class_edit' && modal" @success="modal = false;getData()"></ChapterClassEdit>
    <ChapterClassDetail :id="target_id" :course_id="course_id" v-if="target === 'chapter_class_detail' && modal" ></ChapterClassDetail>
    <ClassList :chapter_id="target_id" :course_id="course_id" v-if="target === 'class_list' && modal"></ClassList>
  </Modal>
  <Modal v-model="modal2" title="修改章节名" :mask-closable="false" @on-ok="changename">
    <span>请输入要修改的名称：</span><Input type="text" v-model="info.title"/>
  </Modal>
  <Spin fix v-show="loading"> </Spin>
</Row>
</template>

<script>
import ChapterClassDetail from '@/view/components/chapter_class_detail.vue'
import ChapterClassEdit from './chapter_class_edit.vue'
import modal_mixin from '@/view/mixins/modal_mixin'
import { chapter_class_delete, course_chapter_class, save_chapter_class } from '@/api/data'
import { chapter_class_show } from '@/api/common'

export default {
  mixins: [modal_mixin],
  components: {
    ChapterClassDetail,
    ChapterClassEdit
  },
  props: {
    course_id: '',
    editable: true,
    type: '',
    isteacherShow: ''
  },
  data () {
    return {
      info: [],
      modal2: false,
      loading: false,
      chapter_class_list: []
    }
  },
  watch: {
    course_id (newVla, oldVal) {
      this.getData()
    }
  },
  computed: {
    currentTab () {
      return this.$store.state.user.currentTab
    }
  },
  methods: {
    getData () {
      if (!this.course_id) return false
      this.loading = true
      course_chapter_class(this.course_id).then(res => {
        let data = res.data
        if (res.code === 200) {
          this.chapter_class_list = data.chapter_list
        }
        this.loading = false
      })
    },
    addRoot: function () {
      if (this.course_id) {
        let chapter_class = {
          expand: true,
          file_url: '',
          id: '',
          parent_id: 0,
          power_url: '',
          content: '',
          title: '未命名',
          course_id: this.course_id,
          sort: this.chapter_class_list.length + 1,
          child: []
        }
        save_chapter_class(chapter_class).then(res => {
          if (res.code === 200) {
            chapter_class.id = res.data.id
            this.chapter_class_list.push(chapter_class)
          }
        })
      } else {
        this.$Message.warning('请先保存基础信息')
      }
    },
    del (root, node, data) {
      this.$Modal.confirm({
        title: '确认删除吗！',
        onOk: () => {
          chapter_class_delete(data.id).then(res => {
            if (res.code === 200) {
              this.$Message.success(res.message)
              this.getData()
            }
          })
        }
      })
    },
    renderContent (h, {
      root,
      node,
      data
    }) {
      return (
        <div class="chapter-class-item" onClick={() => { if (data.child === undefined || data.child.length === 0) { this.showDetail(data) } }}>
          <span class="chapter-class-item-name">{ `${data.sort}：${data.title}` }</span>
          <span class="option-item" v-show={this.editable}>
            <Button type="text" size="small" onClick={(e) => { e.stopPropagation(); this.changeInfo(data) }}>编辑</Button>
            <Button type="text" size="small" onClick={(e) => { e.stopPropagation(); this.del(root, node, data) }}>删除</Button>
            <Button type="text" size="small" v-show={data.id && !(node.parent >= 0)} icon="md-add" onClick={(e) => { e.stopPropagation(); this.append(data) }}></Button>
          </span>
          <span class="option-item" v-show={this.isteacherShow}>
            <button class="blueText-btn" v-show={(data.child === undefined || data.child.length === 0) && this.currentTab === '我的课程'} style="font-size:12px" onClick={(e) => { e.stopPropagation(); this.$emit('getCId', data.id) }}>学生进度</button>
          </span>
        </div>
      )
    },
    changeInfo (data) {
      if (data.child === undefined || data.child.length === 0) {
        this.open('chapter_class_edit', data.id, '编辑')
      } else {
        this.modal2 = true
        chapter_class_show(data.id).then(res => {
          if (res.code === 200) {
            this.info = res.data.chapter_class
          }
        })
      }
    },
    changename () {
      this.info.content = ''
      save_chapter_class(this.info).then(res => {
        if (res.code === 200) {
          this.$Message.success(res.message)
          this.getData()
        }
      })
    },
    showDetail (data) {
      chapter_class_show(data.id).then(res => {
        if (res.code === 200) {
          if (res.data.chapter_class.file_url === '') {
            this.open('chapter_class_edit', data.id, '编辑')
          } else {
            if (this.type === undefined) {
              this.$emit('showCourseDetail', this.course_id, data.id)
            } else {
              this.open('chapter_class_detail', data.id, '详情')
            }
          }
        }
      })
    },
    append (data) {
      const child = data.child || []
      let chapter_class = {
        expand: true,
        file_url: '',
        id: '',
        parent_id: data.id,
        power_url: '',
        content: '',
        title: '未命名',
        course_id: this.course_id,
        sort: child.length + 1,
        child: []
      }
      save_chapter_class(chapter_class).then(res => {
        if (res.code === 200) {
          chapter_class.id = res.data.id
          child.push(chapter_class)
          this.$set(data, 'child', child)
        }
      })
    }
  },
  mounted () {
    this.getData()
  }

}
</script>

<style lang="less">
.chapter-class-item{
  padding: 10px;
  display: flex;
  width: 90%;
  cursor:pointer;
  &:hover{
    box-shadow: 1px 2px 3px #ccc;
  }
  .option-item{
    float:right;
  }
}
.chapter-class-item-name{
  line-height: 24px;
  flex: 1;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
  display: inline-block;
}
</style>
