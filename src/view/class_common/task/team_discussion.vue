<template>
  <div>
    <div>
      <h2>任务内容：</h2>
      <div v-html="student_task.task.content"></div>
      <h2>组员：</h2>
      <p><span v-for="(item, index) in members" :key="item.id" :class="{'leader': item.is_team_leader}">{{item.name}}{{item.is_team_leader === 1 ? '(组长)' : ''}} {{index === members.length-1? '' : '、'}}</span></p>
    </div>
    <div style="padding: 10px; border: 1px solid #ccc; */">
      <div class="chat-container-disc" id="chat-container-disc">
        <a href="javascript:void(0)" style="margin: 10px;text-align:center;display:block;" @click="getHistoryMessages()" v-if="!loading && noMore===false">{{!loading ? '加载更多..' : '加载中'}}</a>
        <p v-if="noMore" style="text-align:center;color: #999;">没有更多了~！</p>
        <!-- <transition-group name="list"> -->
        <div v-for="(item,index) in messageList" :key="index" class="chat-item">
          <div class="chat-user">
            <Avatar :src="item.msg.extra.userInfo.avator" />
            <span
              class="name"
              :class="{'spec': item.msg.extra.userInfo.type == 'teacher', 'mine': item.msg.extra.userInfo.type == 'student' && item.from == $store.state.user.userInfo.userId, 'leader': item.msg.extra.userInfo.id ==  leader.id}"
            >{{(item.msg.extra.userInfo.type == 'student' && item.from == $store.state.user.userInfo.userId) ? '我' : item.msg.extra.userInfo.name}} {{item.msg.extra.userInfo.name ===  leader.name ? '(组长)' : ''}}:</span>
            <span class="time">({{item.sendTime | timeFrom}})</span>
          </div>
          <div v-html="item.msg.msg" class="msg"></div>
        </div>
        <!-- </transition-group> -->
      </div>
    </div>
    <Input type="textarea" style="margin-top:15px;" placeholder="请输入...." v-model="msg"/>
    <Button type="primary" size="small" @click="send()" style="margin-top:10px;">发送</Button>
  </div>
</template>
<script>
import live from '@/view/common/live' // 群聊相关
import { student_task_detail } from '@/api/student'
import { get_history_messages } from '@/api/common'
export default {
  props: {
    student_task_id: ''
  },
  mixins: [live],
  data () {
    return {
      group_chat_id: '',
      student_task: { task: '' },
      members: [{ id: '' }], // 所有组员
      msg: '',
      messageList: [],
      lastest_msg_id: 0,
      scroll_init: false,
      loading: false,
      noMore: false
    }
  },
  watch: {
    student_task_id (n, o) {
      this.getInfo()
    }
  },
  computed: {
    leader () {
      return this.members.find(item => {
        return item.is_team_leader
      })
    }
  },
  methods: {
    getInfo () {
      student_task_detail(this.student_task_id).then(res => {
        if (res.code === 200) {
          this.student_task = res.data.student_task
          this.group_chat_id = `task${this.student_task.task.id}_tr_${this.student_task.task_release_id}_team${this.student_task.team_id}`
          this.getMembers(this.student_task_id)
          this.initChat()
          this.messageList = []
          this.lastest_msg_id = 0
          this.getHistoryMessages()
        }
      })
    },
    getMembers (student_task_id) {
      this.axios.request({
        method: 'get',
        url: '/index.php/Student/Task/getMembers',
        params: {
          student_task_id
        }
      }).then(res => {
        if (res.code === 200) {
          this.members = res.data.members
        }
      })
    },
    send () {
      if (!this.msg.trim()) return
      this.sendMsg(this.msg)
    },
    handleOnMessage (data) {
      // 监听websocket消息
      let type = data.type || ''
      switch (type) {
        // Events.php中返回的init类型的消息，将client_id发给后台进行uid绑定
        case 'init':
          this.bindUser(data.client_id)
          break
        case 'ppt':
          break
        default: {
          this.pushMessage(data)
        }
      }
    },
    pushMessage (msg) {
      if (msg.target === this.group_chat_id) {
        this.messageList.push(msg)
        this.scrollToBottom()
      }
    },
    // 获取历史消息
    getHistoryMessages () {
      let _this = this
      if (this.loading) return
      this.loading = true
      get_history_messages({
        target_type: 'chatgroups',
        target: _this.group_chat_id,
        lastest_msg_id: _this.lastest_msg_id,
        page_size: 10
      }).then(res => {
        if (res.code === 200) {
          let historyMsgs = res.data.list.sort((a, b) => {
            return a.sendTime - b.sendTime
          })
          if (historyMsgs.length < 10) {
            this.noMore = true
          }
          _this.messageList = historyMsgs.concat(_this.messageList)
          if (_this.messageList.length > 0) {
            if (_this.lastest_msg_id === 0) {
              _this.scrollToBottom()
            }
            _this.lastest_msg_id = _this.messageList[0].id
          }
        }
        this.loading = false
      })
    },
    scrollToBottom () {
      let _this = this
      setTimeout(() => {
        let ele = document.getElementById('chat-container-disc')
        if (ele.scrollHeight - ele.scrollTop < 805 || !_this.scroll_init) {
          _this.scroll_init = true
          ele.scrollTop = ele.scrollHeight
        }
      }, 200)
    }
  },
  mounted () {
    let _this = this
    _this.getInfo()
    _this.$on('message', (msg) => { // 防止实例化两次websocket后，小组群聊接收不到推送消息， FIXME:待优化
      _this.pushMessage(msg)
    })
  }
}
</script>
<style lang="less">
.chat-container-disc {
  height: 400px;
  overflow: auto;
  padding: 10px;
  .chat-item {
    margin-bottom: 15px;
    display: flex;
    word-break: break-all;
    .msg{
      margin-left: 42px;
      padding: 5px;
      background: #ddd;
      border-radius: 5px;
      display: inline;
      flex:1
    }
    .chat-user{
      display: flex;
      align-items: center;
      .ivu-avatar{
        margin-right: 10px;
      }
      .name {
        font-weight: bold;
      }
      .time {
        color: #999;
      }
    }
  }
}
.leader{
  color: blueviolet!important;
}
.spec{
  color:cadetblue;
}

.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active, .list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to
/* .list-leave-active for below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
.mine{
  color:cadetblue;
}
</style>
