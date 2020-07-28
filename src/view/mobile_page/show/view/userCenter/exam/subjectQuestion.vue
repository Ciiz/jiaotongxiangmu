<template>
<div class="m-subjectQuetion flex-contain">
  <mt-header :title="getMainQuestionType(subjectInfo.subject_type)" style="border-bottom:1px solid #CCCCCC">
    <router-link to slot="left">
      <mt-button icon="back" @click="back"></mt-button>
    </router-link>
    <span slot="right">{{questionIndex+1}}/{{subjectNum}}</span>
  </mt-header>
  <div class="m-subject-contain hideScroll flex-contain">
    <div class="m-subject-title">
      <span>{{questionIndex+1}} {{subjectInfo.content}}</span>
      <span style="font-weight:400">（{{subjectInfo.score}}分）</span>
    </div>
    <div :contenteditable="contenteditable" v-html="subjectInfo.student_answer.content" class="m-subject-answer"></div>
  </div>
  <div>
    <button class="m-b-btn-b" @click="submit">提交</button>
  </div>
</div>
</template>
<script>

import { Toast } from 'mint-ui'

export default {
  data () {
    return {
      contenteditable:true
    }
  },
  computed: {
    questionIndex () {
      return this.$route.query.questionIndex
    },
    subjectInfo () {
      return this.$route.query.subjectInfo
    },
    subjectNum () {
      return this.$route.query.subjectNum
    }
  },
  methods: {
    back(){
      window.history.go(-1)
    },
    getMainQuestionType (i) {
      if (i === 1) {
        return '论述题'
      } else if (i === 2) {
        return '简答题'
      } else if (i === 3) {
        return '应用题'
      } else {
        return '作文题'
      }
    },
    submit(){
      this.subjectInfo.student_answer.content = document.getElementsByClassName('m-subject-answer')[0].innerHTML
      this.axios.request({
        method: 'post',
        url: '/index.php/Student/Exam/singleSave',
        data: {
          student_examination_id:this.subjectInfo.student_answer.student_examination_id,
          examination_detail_id:this.subjectInfo.student_answer.examination_detail_id,
          content:this.subjectInfo.student_answer.content,
          video_url:this.subjectInfo.student_answer.video_url
        }
      }).then(res => {
        if (res.code === 200) {
          Toast({
            message: '保存成功',
            duration: 2000
          })
        }
        this.back()
      })
    }
  },
  mounted () {
   
  }
}
</script>

