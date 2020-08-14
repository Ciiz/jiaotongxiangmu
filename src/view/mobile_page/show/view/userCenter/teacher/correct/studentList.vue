<template>
  <div class="m-correct-student flex-contain">
    <mt-header title="批改">
      <router-link to slot="left">
        <mt-button icon="back" @click="back"></mt-button>
      </router-link>
    </mt-header>
    <mt-navbar v-model="rank" v-show="correct_status===1">
      <mt-tab-item id="">全部</mt-tab-item>
      <mt-tab-item id="A">优秀</mt-tab-item>
      <mt-tab-item id="B">良好</mt-tab-item>
      <mt-tab-item id="C">及格</mt-tab-item>
      <mt-tab-item id="D">不及格</mt-tab-item>
    </mt-navbar>
    <div class="m-correct-student-contain hideScroll">
      <div v-for="(item,index) in studentList" :key="index" class="m-correct-student-item">
        <div>
          <img :src="item.icon" />
        </div>
        <div>
          <div class="m-correct-student-name">{{item.name}}</div>
          <div v-if="type==='exam'">{{getexamstatus(item.exam_status)}}</div>
          <div v-else>{{item.submit_status===1?'已提交':'未提交'}}</div>
        </div>
        <div style="flex:1;margin-top:0.04rem">
          <div>学号：{{item.s_no}}</div>
          <div v-if="type==='exam'">{{item.total_score===''?'未评分':item.total_score+"分"}}</div>
          <div v-else>{{item.user_score===''?'未评分':item.user_score+"分"}}</div>
        </div>
      </div>
    </div>
    <div style="display:flex" v-if="correct_status===0">
      <button class="m-b-btn-b" v-if="no_correct===0" @click="updateCorrectStatus">批改完成(发布)</button>
      <button class="m-greenGray-btn" v-else>{{has_correct}}/{{studentList.length}}</button>
    </div>
  </div>
</template>
<script>

import { update_correct_status } from '@/api/data'
import { Toast, Indicator } from 'mint-ui'

export default {
  data () {
    return {
      rank: '',
      studentList: [],
      correct_status: '',
      has_correct: '',
      no_correct: ''
    }
  },
  watch: {
    rank (n, o) {
      this.getData()
    }
  },
  computed: {
    type () {
      return this.$route.query.type
    },
    id () {
      return this.$route.query.id
    }
  },
  methods: {
    back () {
      window.history.go(-1)
    },
    getData () {
      if (this.type === 'exam') {
        Indicator.open()
        this.axios.request({
          method: 'get',
          url: '/index.php/Teacher/Examination/student_exam_list',
          params: {
            exam_release_id: this.id,
            score_rank: this.rank
          }
        }).then(res => {
          if (res.code === 200) {
            this.studentList = res.data.list
            this.correct_status = res.data.correct_status
            this.has_correct = res.data.exam_info.has_correct
            this.no_correct = res.data.exam_info.no_correct
          }
          Indicator.close()
        })
      } else if (this.type === 'task') {
        Indicator.open()
        this.axios.request({
          method: 'post',
          url: '/index.php/Teacher/Task/team_list_v2',
          data: {
            task_release_id: this.id,
            score_rank: this.rank
          }
        }).then(res => {
          if (res.code === 200) {
            this.studentList = res.data.list
            this.correct_status = res.data.correct_status
            this.has_correct = res.data.task_info.has_correct
            this.no_correct = res.data.task_info.no_correct
          }
          Indicator.close()
        })
      } else if (this.type === 'homework') {
        Indicator.open()
        this.axios.request({
          method: 'get',
          url: '/index.php/Teacher/Homework/student_homework_list',
          params: {
            homework_release_id: this.id,
            score_rank: this.rank
          }
        }).then(res => {
          if (res.code === 200) {
            this.studentList = res.data.list
            this.correct_status = res.data.correct_status
            this.has_correct = res.data.homework_info.has_correct
            this.no_correct = res.data.homework_info.no_correct
          }
          Indicator.close()
        })
      }
    },
    updateCorrectStatus () {
      update_correct_status({ type: this.type, release_id: this.id, correct_status: 1 }).then(res => {
        if (res.code === 200) {
          Toast({
            message: res.message,
            duration: 2000
          })
          this.$router.push({ name: 'mobileCorrectIndex' })
        }
      })
    },
    getexamstatus (i) {
      if (i === 0) {
        return '未开始'
      }
      if (i === 1) {
        return '考试中'
      }
      if (i === 2) {
        return '已交卷'
      }
      if (i === 3) {
        return '已批改'
      }
      if (i === 4) {
        return '已逾期'
      }
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
