<template>
  <div>
    <div class="question-item" v-for="(item,index) in chatList" :key="index" @click="toDiscuss(item)">
      <div style="position:relative">
        <img v-if="item.table_type===2" :src="item.userInfo.icon" class="question-item-icon">
        <img v-if="item.table_type===1||item.table_type===3" :src="item.icon" class="question-item-icon">
        <mt-badge type="error" size="small" style="position:absolute;top:0.08rem;right:0.08rem" class="m-badge-num" v-if="item.unread!==0">{{item.unread}}</mt-badge>
      </div>
      <div class="question-item-l">
        <div class="question-item-info">
          <div v-if="item.table_type===2">
            <span class="question-item-name">{{item.userInfo.name}}</span>
            <span style="font-size:0.24rem" v-if="userType===1&&item.title===undefined">（{{item.userInfo.class_name}}）</span>
          </div>
          <div v-if="item.table_type===3">
            <span class="question-item-name">{{item.title}}</span>
          </div>
          <div v-if="item.table_type===1">
            <span class="question-item-name">{{item.task_name}}</span>
          </div>
          <div class="question-item-time">{{moment(item.created_at * 1000).format('YYYY-MM-DD HH:mm')}}</div>
        </div>
        <div class="student-item-content">{{item.content}}</div>
      </div>
    </div>
  </div>
</template>
<script>

import { Indicator } from 'mint-ui'
export default {
  data () {
    return {
      list: [],
      chatList: [],
      userType: this.$store.state.user.userInfo.userType
    }
  },
  watch: {
    chatList: {
      handler (newValue, oldValue) {
        let o
        for (let i = 0; i < this.chatList.length - 1; i++) {
          for (let j = i + 1; j < this.chatList.length; j++) {
            if (this.chatList[j].created_at > this.chatList[i].created_at) {
              o = this.chatList[i]
              this.chatList[i] = this.chatList[j]
              this.chatList[j] = o
            }
          }
        }
      },
      deep: true
    }
  },
  methods: {
    showProblem () { // 获取单独对话内容
      Indicator.open({
        text: '加载中...',
        spinnerType: 'fading-circle'
      })
      let uRl = ''
      if (this.userType === 1) {
        uRl = '/index.php/Teacher/TaskQuestion/question_list'
      } else {
        uRl = '/index.php/Student/Task/question_list'
      }
      this.axios.request({
        url: uRl,
        method: 'get',
        params: {
          page: 1,
          rows: 10000
        }
      }).then(res => {
        if (res.code === 200) {
          for (let i = 0; i < res.data.question_list.length; i++) {
            this.chatList.push(res.data.question_list[i])
          }
        }
        Indicator.close()
      })
    },
    showDiscussAbout () { // 话题列表获取
      let uRl = ''
      if (this.userType === 1) {
        uRl = '/index.php/Teacher/Topic/topic_list'
      } else {
        uRl = '/index.php/Student/Topic/topic_list'
      }
      this.axios.request({
        url: uRl,
        method: 'get',
        params: {
          page: 1,
          page_size: 10000
        }
      }).then(res => {
        if (res.code === 200) {
          for (let i = 0; i < res.data.list.length; i++) {
            this.chatList.push(res.data.list[i])
          }
        }
      })
    },
    showDiscussStudent () { // 学生端消息中心学生讨论列表
      this.axios.request({
        url: '/index.php/Student/StudentTask/task_list',
        method: 'get',
        params: {
          page_no: 1,
          page_size: 10000
        }
      }).then(res => {
        if (res.code === 200) {
          for (let i = 0; i < res.data.list.length; i++) {
            this.chatList.push(res.data.list[i])
          }
        }
      })
    },
    toDiscuss (item) {
      this.$router.push({ name: 'discuss', query: { chatList: item } })
    },
    getData () {
      this.chatList = []
      this.showProblem()
      this.showDiscussAbout()
      if (this.userType !== 1) {
        this.showDiscussStudent()
      }
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
