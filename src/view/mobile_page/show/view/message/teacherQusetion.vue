<template>
  <div>
    <div class="question-item" v-for="(item,index) in chatList" :key="index" @click="toDiscuss(item)">
      <div style="position:relative">
        <img :src="item.userInfo.icon" class="question-item-icon">
        <mt-badge type="error" size="small" style="position:absolute;top:0.08rem;right:0.08rem" class="m-badge-num"
          v-if="item.unread!==0">{{item.unread}}</mt-badge>
      </div>
      <div class="question-item-l">
        <div class="question-item-info">
          <div>
            <span class="question-item-name">{{item.userInfo.name}}</span>
            <span style="font-size:0.24rem" v-if="item.title===undefined">（{{item.userInfo.class_name}}）</span>
          </div>
          <div class="question-item-time">{{moment(item.created_at * 1000).format('YYYY-MM-DD HH:mm')}}</div>
        </div>
        <div class="student-item-content">{{item.content}}</div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  data () {
    return {
      list: [],
      chatList: []
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
      this.axios.request({
        url: '/index.php/Teacher/TaskQuestion/question_list',
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
      })
    },
    toDiscuss (item) {
      this.$router.push({ name: 'discuss', query: { chatList: item } })
    },
    getData () {
      this.chatList = []
      this.showProblem()
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
