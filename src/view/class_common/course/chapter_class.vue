<template>
<Row>
  <!-- 添加的时候请求 -->
  <Tree :data="chapter_class_list" class="course-tree2" :render="renderContent" children-key="child" style="width:100%"></Tree>
  <Modal v-model="modal"
      :title="title"
      :width="modal_width"
      :mask-closable="false"
      footer-hide
      :fullscreen="true"
  >
    <inCourseDetail @closeCourseDetail="closeCourseDetail" :type="type" :id="courseId" :teacher_course_id="teacher_course_id" :course_id="coursedetail_id" :showAllCourseDetailType="showAllCourseDetailType" v-if="modal" ></inCourseDetail>
  </Modal>
  <Spin fix v-show="loading"> </Spin>
</Row>
</template>

<script>
import inCourseDetail from '@/view/teachingSystem_page/inCourseDetail.vue'
import modal_mixin from '@/view/mixins/modal_mixin'
import { course_chapter_class } from '@/api/common'
export default {
  mixins: [modal_mixin],
  components: {
    inCourseDetail
  },
  props: {
    course_id: '',
    editable: true,
    type: '',
    teacher_course_id: ''
  },
  data () {
    return {
      showAllCourseDetailType: '',
      courseId: '',
      coursedetail_id: '',
      loading: false,
      chapter_class_list: [],
      cur_item: {},
      userType: this.$store.state.user.userInfo.userType
    }
  },
  watch: {
    course_id (newVla, oldVal) {
      this.getData()
    }
  },
  methods: {
    getData () {
      if (!this.course_id) return false
      this.loading = true
      course_chapter_class(this.course_id, this.teacher_course_id).then(res => {
        let data = res.data
        if (res.code === 200) {
          this.chapter_class_list = data.chapter_list
        }
        this.loading = false
      })
    },
    renderContent (h, {
      root,
      node,
      data
    }) {
      return (
        <div class="chapter-class-item2" style={{ width: '96%' }} onClick={() => { this.cur_item = data; if (data.child === undefined || data.child.length === 0) { this.showModal(data) } }}>
          <div class="item2-title">{ `${data.sort}：${data.title}` }</div>
          <Progress class="newprogress" v-show={this.userType === 2 && (data.child === undefined || data.child.length === 0)} percent={data.percent} strokeWidth={20} style={{ marginTop: '10px' }}/>
        </div>
      )
    },
    handleUpdateProgress (percent) {
      if (this.cur_item.percent < percent) {
        this.cur_item.percent = percent
      }
    },
    showModal (data) {
      this.modal = true
      this.courseId = data.id
      this.coursedetail_id = data.course_id
      this.showAllCourseDetailType = ''
    },
    closeCourseDetail () {
      this.modal = false
    }
  },
  mounted () {
    this.getData()
  }

}
</script>

<style lang="less">
.chapter-class-item2{
  padding: 10px;
  display: block;
  width: 90%;
  cursor:pointer;
  &:hover{
    box-shadow: 1px 2px 3px #ccc;
  }
  .option-item{
    float:right;
  }
}
.course-tree2 ul li{
  position: relative;
}
.course-tree2 .ivu-tree-arrow{
  position: absolute;
  top: 8px;
  left: 8px;
}
.item2-title{
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
  margin-left: 20px;
}
.newprogress .ivu-progress-bg{
  height: 6px!important;
}
.newprogress .ivu-progress-outer{
  margin-left: 26px;
}
</style>
