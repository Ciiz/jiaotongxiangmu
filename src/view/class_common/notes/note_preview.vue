<template>
  <div class="notePreview">
    <Row type="flex" justify="space-between" style="padding:0 10px">
      <Col>
      <button class="homework-back" @click="$emit('unshowPreviewNote')">返回</button>
      </Col>
      <Col>
      <span class="blue-c" style="font-size:16px;margin-right:10px" v-show="!editor">{{title}}</span>
      <Input type="text" v-model="title" v-show="editor" class="noteTitleInput" />
      <span style="color:#BBBBBB;font-size:12px">创建时间：{{time}}</span>
      </Col>
      <Col>
      <span class="black-c" style="font-size:16px">{{courseware_name}}</span>
      </Col>
    </Row>
    <div class="note-content" v-html="content" v-show="!editor"></div>
    <div v-show="editor" style="flex:1;display:flex;flex-dirction:column">
      <editor v-model="content" class="new-editor" ref="editor" is_init='true'></editor>
    </div>
    <Row v-show="!editor" type="flex" justify="space-between" class="note-preview-bottom" style="margin-top:20px">
      <Col>
      <span class="note-contentBtn">
        <img src="@/assets/images/teachingSystem/note-edit.png" />
        <span style="color:#3B9BFF" class="note-contentBtn-text" @click="changeInfo">编辑</span>
      </span>
      <span class="note-contentBtn">
        <span style="color:#FF3333" class="note-contentBtn-text" @click="modal1=true">删除</span>
        <img src="@/assets/images/teachingSystem/note-delete.png" />
      </span>
      </Col>
      <Col class="notepageBtn-list" v-if="currentIdIndex!==''">
      <button @click="changeNoteP(-1)">上一篇</button>
      <button @click="changeNoteP(1)">下一篇</button>
      </Col>
    </Row>
    <div style="margin-top:20px" v-show="editor">
      <button class="homework-back" @click="submit">保存</button>
    </div>
    <Spin v-show="loading" fix></Spin>
    <Modal class="noteDeleteModal" v-model="modal1" title="删除笔记" @on-ok="deleteNote">
      <p>是否确定删除当前笔记？</p>
    </Modal>
  </div>
</template>
<script>
import modal_mixin from '@/view/mixins/modal_mixin'
export default {
  props: { id: '', courseware_id: '', currentIdIndex: '' },
  mixins: [modal_mixin],
  data () {
    return {
      modal1: false,
      editor: false,
      title: '',
      content: '',
      time: '',
      courseware_name: '',
      loading: false,
      modal: false
    }
  },
  watch: {
    id (n, o) {
      this.getData(true)
    }
  },
  methods: {
    getData () {
      this.loading = true
      this.axios.request({
        url: '/index.php/student/studentNotes/show',
        method: 'get',
        params: {
          id: this.id
        }
      }).then(res => {
        if (res.code === 200) {
          this.title = res.data.student_notes.title
          this.content = res.data.student_notes.content
          this.time = this.moment(res.data.student_notes.created_at * 1000).format('YYYY-MM-DD')
          this.courseware_name = res.data.student_notes.courseware_name
        }
        this.loading = false
      })
    },
    deleteNote () {
      this.axios.request({
        url: '/index.php/student/studentNotes/delete',
        method: 'post',
        data: {
          id: this.id
        }
      }).then(res => {
        if (res.code === 200) {
          this.$emit('unshowPreviewNote')
          this.$Message.success('删除成功')
        }
      })
    },
    changeNoteP (i) {
      if (i > 0) {
        let o = this.currentIdIndex + 1
        this.$emit('changeNote', o)
      } else if (i < 0) {
        let o = this.currentIdIndex - 1
        this.$emit('changeNote', o)
      }
    },
    changeInfo () {
      this.editor = true
    },
    submit () {
      if (this.title === '') {
        this.$Message.error('标题不能为空')
      } else {
        this.axios.request({
          method: 'post',
          url: '/index.php/student/studentNotes/save',
          data: {
            id: this.id,
            title: this.title,
            content: this.content,
            courseware_id: this.courseware_id
          }
        }).then(res => {
          if (res.code === 200) {
            this.$Message.info('保存成功')
            this.editor = false
          }
        })
      }
    }
  },
  mounted () {
  }
}
</script>
<style>
.notePreview {
  z-index: 10;
  padding: 20px 10px;
  background: #ffffff;
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.note-content {
  border: 1px solid #dcdcdc;
  background: #f8f8f8;
  width: 100%;
  flex: 1;
  padding: 10px 20px;
  font-size: 14px;
  word-break: break-all;
}
.note-preview-bottom img {
  margin: 0 4px;
  vertical-align: middle;
}
.note-contentBtn {
  margin-right: 20px;
  cursor: pointer;
}
.note-contentBtn-text {
  display: inline-block;
  transform: translateY(1px);
}
.notepageBtn-list > button {
  width: 84px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-radius: 10px;
  outline: none;
}
.notepageBtn-list > button:nth-of-type(1) {
  border: 1px solid #3b9bff;
  background: #ffffff;
  color: #3b9bff;
  cursor: pointer;
}
.notepageBtn-list > button:nth-of-type(2) {
  border: 1px solid #3b9bff;
  background: #3b9bff;
  color: #ffffff;
  margin-left: 20px;
  cursor: pointer;
}
.noteTitleInput {
  width: initial;
  margin-right: 20px;
}
.noteDeleteModal .ivu-modal-wrap {
  z-index: 3011 !important;
}
</style>
