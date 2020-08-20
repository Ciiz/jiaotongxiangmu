<template>
  <div class="flex-contain">
    <mt-header :title="title">
      <router-link to slot="left">
        <mt-button icon="back" @click="back"></mt-button>
      </router-link>
    </mt-header>
    <div class="m-answerDetail-contain hideScroll">
      <div v-html="student_homework.homework_content" class="m-answerDetail-content">未提交</div>
      <div class="m-answerDetail-student">
        <div class="m-answerDetail-student-content">
          <div>学生答案：</div>
          <div v-if="!student_homework.submit_status" class="">未提交</div>
          <div v-if="student_homework.submit_status" class="" v-html="student_homework.student_homework_content"></div>
        </div>
      </div>
      <div class="m-answerDetail-evaluate">
        <div v-for="score_item in student_homework.score_option" :key="score_item.index">
          <span class="m-answerDetail-evaluate-t">评分：</span>
          <input type="number" placeholder="请输入分数" :label="score_item.option_name" v-model="score_item.score"/>
        </div>
        <div class="m-answerDetail-evaluate-t" style="margin:0.1rem 0">评语：</div>
        <Input type="textarea" class="homework-evaluate-textarea" :rows="4" v-model="student_homework.evaluation" placeholder="对学生的评价："></Input>
      </div>
    </div>
    <div class="m-answerDetail-bottom">
      <div class="m-answerDetail-bottom-icon" @click="changeStudent(-1)">
        <Icon type="ios-arrow-back" />
      </div>
      <div class="m-answerDetail-bottom-btn" @click="submit">{{student_homework.score_status?'修改':'提交'}}</div>
      <div class="m-answerDetail-bottom-icon" @click="changeStudent(1)">
        <Icon type="ios-arrow-forward" />
      </div>
    </div>
  </div>
</template>
<script>

import { Toast, Indicator } from 'mint-ui'
export default {
  data () {
    return {
      student_homework: {
        score_option: []
      },
      title: '',
      currentIndex: ''
    }
  },
  watch: {

  },
  computed: {
    listIndex () {
      return this.$route.query.listIndex
    },
    ids () {
      return this.$route.query.ids
    }
  },
  methods: {
    getData (id) {
      Indicator.open({
        text: '加载中...',
        spinnerType: 'fading-circle'
      })
      this.axios.request({
        method: 'post',
        url: '/index.php/Teacher/Homework/score',
        data: {
          student_homework_id: id
        }
      }).then(res => {
        if (res.code === 200) {
          this.title = res.data.student_info.name + '的作业'
          this.student_homework = res.data
          // 处理分数
          res.data.score_option = Object.values(res.data.score_option)
          let score_list = res.data.score_list
          res.data.score_option.map((item, key) => {
            item.score = score_list[item.id] ? score_list[item.id] : 0
            return item
          })
          this.student_homework.score_option = res.data.score_option
        }
        Indicator.close()
      })
    },
    submit () {
      let scores = {}
      this.student_homework.score_option.forEach(item => { // 处理获取后台需要的分数格式
        scores[item.id] = item.score
      })
      this.axios.request({
        method: 'post',
        url: '/index.php/Teacher/Homework/score_update',
        data: {
          student_homework_id: this.ids[this.currentIndex],
          evaluation: this.student_homework.evaluation,
          scores: scores
        }
      }).then(res => {
        if (res.code === 200) {
          Toast({
            message: res.message,
            iconClass: 'icon icon-success'
          })
        }
      })
    },
    changeStudent (i) {
      this.currentIndex += i
      if (this.currentIndex >= this.ids.length) {
        Toast({
          message: '已经是最后一位了',
          iconClass: 'icon icon-error'
        })
        this.currentIndex -= i
      } else if (this.currentIndex < 0) {
        Toast({
          message: '已经是第一位了',
          iconClass: 'icon icon-error'
        })
        this.currentIndex -= i
      } else {
        this.getData(this.ids[this.currentIndex])
      }
    },
    back () {
      window.history.go(-1)
    }
  },
  mounted () {
    this.currentIndex = this.listIndex
    this.getData(this.ids[this.currentIndex])
  }
}
</script>
