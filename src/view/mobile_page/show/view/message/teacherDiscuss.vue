<template>
  <div>
    <div>创建话题</div>
    <div class="question-item" v-for="(item,index) in chatList" :key="index" @click="toDiscuss(item)">
      <div style="position:relative">
        <img :src="item.icon" class="question-item-icon">
        <mt-badge type="error" size="small" style="position:absolute;top:0.08rem;right:0.08rem" class="m-badge-num" v-if="item.unread!==0">{{item.unread}}</mt-badge>
      </div>
      <div class="question-item-l">
        <div class="question-item-info">
          <div>
            <span class="question-item-name">{{item.title}}</span>
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
    showDiscussAbout () { // 话题列表获取
      this.axios.request({
        url: '/index.php/Teacher/Topic/topic_list',
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
    toDiscuss (item) {
      this.$router.push({ name: 'discuss', query: { chatList: item } })
    },
    getData () {
      this.chatList = []
      this.showDiscussAbout()
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
