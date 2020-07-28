<template>
  <div class="m-noteDetail flex-contain">
    <mt-header title="笔记详情" style="border-bottom:1px solid #EEEEEE">
      <router-link to slot="left">
        <mt-button icon="back" @click="routerGO()"></mt-button>
      </router-link>
    </mt-header>
    <div class="m-noteDetail-contain hideScroll flex-contain">
      <div class="m-noteDetail-h">
         <div class="m-noteDetail-header">
           <div class="m-noteDetail-header-title" :contenteditable="editor" v-html="title"></div>
           <div class="m-noteDetail-header-time">创建时间{{time}}</div>
          </div>
         <div style="line-height:1rem">
            <img src="@/assets/images/mobile_student/m-note-des.png" @click="showBottom=!showBottom" />
         </div>
      </div>
      <div class="m-noteDetail-content">
        <p style="word-break:break-all;outline:none" class="noteP" v-html="content" :contenteditable="editor"></p>
        <!-- <mt-field placeholder="笔记内容" type="textarea" v-model="content" v-if="editor===true"></mt-field> -->
      </div>
    </div>
    <div class="m-noteDetail-bottom" v-if="showBottom===true">
      <button @click="editor=true" v-if="editor===false">编辑</button>
      <button @click="saveNote()" v-if="editor===true">保存</button>
      <button @click="deleteNote()">删除</button>
    </div>
  </div>
</template>
<script>
import { Toast, MessageBox } from 'mint-ui'
export default {
  data () {
    return {
      title: '',
      content: '',
      time: '',
      editor: false,
      showBottom: false
    }
  },
  computed: {
    courseware_id () {
      return this.$route.query.courseware_id
    },
    id () {
      return this.$route.query.id
    }
  },
  methods: {
    routerGO () {
      this.$router.go(-1)
    },
    getData () {
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
        }
      })
    },
    saveNote () {
      this.title = document.getElementsByClassName('m-noteDetail-header-title')[0].innerHTML
      this.content = document.getElementsByClassName('noteP')[0].innerHTML
      if (this.title === '') {
        Toast({
          message: '笔记标题不能为空',
          duration: 2000
        })
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
            Toast({
              message: '保存成功',
              duration: 2000
            })
            this.editor = false
          }
        })
      }
    },
    deleteNote () {
      MessageBox.confirm('确定执行此操作?').then(action => {
        this.axios.request({
          url: '/index.php/student/studentNotes/delete',
          method: 'post',
          data: {
            id: this.id
          }
        }).then(res => {
          if (res.code === 200) {
            Toast({
              message: '删除成功'
            })
            this.routerGO()
          }
        })
      })
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
