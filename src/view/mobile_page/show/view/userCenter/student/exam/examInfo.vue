<template>
  <div class="m-examInfo flex-contain">
    <mt-header
      :title="student_exam.exam.course_name+' '+(student_exam.exam.type===1?'课前':(student_exam.exam.type===2?'课中':'课后'))+'测试'"
      style="border-bottom:1px solid #CCCCCC">
      <router-link to="/homeworkExamIndex" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
      <img slot="right" src="@/assets/images/mobile_student/setting.png" style="width:0.33rem"
        @click="popupVisible=true">
    </mt-header>
    <mt-popup class="m-popup" v-model="popupVisible" position="top">
      <div class="m-popup-contain">
        <div><span>{{student_exam.exam.course_name}}
            {{student_exam.exam.type===1?'课前':(student_exam.exam.type===2?'课中':'课后')}}测试</span></div>
        <div><span>发布者：</span>{{student_exam.exam.teacher}}</div>
        <div><span>考试时长：</span>{{student_exam.exam.exam_time}}分钟</div>
        <div><span>满分：</span>{{student_exam.total_score}}分</div>
        <div><span>接收时间：</span>{{moment(student_exam.exam_release.released_at * 1000).format('YYYY-MM-DD HH:mm:ss')}}
        </div>
        <div><span>截止时间：</span>{{moment(student_exam.exam_release.end_time * 1000).format('YYYY-MM-DD HH:mm:ss')}}</div>
      </div>
    </mt-popup>
    <div class="m-examInfo-contain hideScroll flex-contain">
      <div class="m-examInfo-obj">
        <div style="color:#888888;font-size:0.26rem;margin-bottom:0.12rem">答题卡</div>
        <div class="m-examInfo-obj-list">
          <!-- {{student_exam.exam_status!==3}} -->
          <div v-for="(item,index) in objectList" :key="index" class="m-examInfo-obj-item"
            :class="item.student_answer.content!==''?'m-examInfo-obj-item-active':'m-examInfo-obj-item-normal'"
            @click="showObject(index)">
            {{index+1}}
          </div>
        </div>
      </div>
      <div class="m-examInfo-subj">
        <div v-for="(item,index) in subjectList" :key="index" class="m-examInfo-subj-item">
          <div style="margin-bottom:0.28rem">
            <span>{{index+1}}【{{getMainQuestionType(item.subject_type)}}】{{item.content}}</span>
            <span style="color:#666666">（{{item.score}}分）</span>
            <img src="@/assets/images/mobile_student/writeExam.png"
              style="width:0.4rem;float:right;margin:0.1rem 0.2rem 0 0" @click="showSubject(index,item)">
          </div>
          <div style="position:relative">
            <div class="content-shadow"></div>
            <div class="m-examInfo-subj-item-answer"
              v-html="item.student_answer.content===''?'未作答':item.student_answer.content"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="m-examInfo-bottom">
      <button class="m-b-btn-b" @click="submit()">交卷</button>
    </div>
  </div>
</template>
<script>

import { Popup, Toast } from 'mint-ui';

export default {
  data () {
    return {
      objectList: [],
      subjectList: [],
      popupVisible: false,
      student_exam: {}
    }
  },
  watch: {

  },
  computed: {
    examInfoId () {
      return this.$route.query.examInfoId
    }
  },
  methods: {
    getExam () {
      this.axios.request({
        method: 'get',
        url: `/index.php/Student/Exam/detail`,
        params: {
          student_exam_id: this.examInfoId
          // hasAnswer: hs
        }
      }).then(res => {
        let data = res.data
        if (res.code === 200) {
          this.student_exam = data.student_exam
          this.getObjectList(data.student_exam.object)
          this.getSubjectList(data.student_exam.subject)
        }
      })
    },
    getObjectList (item) { // 处理客观题
      if (item.single.length !== 0) {
        for (let i = 0; i < item.single.length; i++) {
          this.objectList.push(item.single[i])
        }
      }
      if (item.multiple_choice.length !== 0) {
        for (let i = 0; i < item.multiple_choice.length; i++) {
          this.objectList.push(item.multiple_choice[i])
        }
      }
    },
    getSubjectList (item) { // 处理主观题
      if (item.argumentation.length !== 0) {
        for (let i = 0; i < item.argumentation.length; i++) {
          this.subjectList.push(item.argumentation[i])
        }
      }
      if (item.composition_questions.length !== 0) {
        for (let i = 0; i < item.composition_questions.length; i++) {
          this.subjectList.push(item.composition_questions[i])
        }
      }
      if (item.practical_questions.length !== 0) {
        for (let i = 0; i < item.practical_questions.length; i++) {
          this.subjectList.push(item.practical_questions[i])
        }
      }
      if (item.short_answer_questions.length !== 0) {
        for (let i = 0; i < item.short_answer_questions.length; i++) {
          this.subjectList.push(item.short_answer_questions[i])
        }
      }
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
    showObject (i) {   //显示客观题
      this.$router.push({ name: 'objectQuestion', query: { questionIndex: i, objectList: this.objectList, exam_status: this.student_exam.exam_status } })
    },
    showSubject (i, item) {   //显示主观题
      this.$router.push({ name: 'subjectQuestion', query: { questionIndex: i, subjectInfo: item, subjectNum: this.subjectList.length, exam_status: this.student_exam.exam_status } })
    },
    getAnswerArr () {
      let answer_arr = []
      this.objectList.forEach(item => {
        let { content, examination_detail_id, student_examination_id, video_url } = item.student_answer
        answer_arr.push({
          content,
          examination_detail_id,
          student_examination_id,
          video_url,
          type: 'obj'
        })
      })
      this.subjectList.forEach(item => {
        item.student_answer.type = 'subj'
        answer_arr.push(item.student_answer)
      })
      return answer_arr
    },
    submit () {
      let answer_arr = this.getAnswerArr()
      this.axios.request({
        method: 'post',
        url: '/index.php/Student/Exam/submitExam',
        data: {
          student_exam_id: this.examInfoId,
          exam_status: 2,
          answer_arr
        }
      }).then(res => {
        if (res.code === 200) {
          Toast({
            message: res.message,
            duration: 2000
          })
          this.$router.push({ name: 'homeworkExamIndex' })
        }
      })
    }
  },
  mounted () {
    this.getExam()
  }
}
</script>
<style>
</style>
