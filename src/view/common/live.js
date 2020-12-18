// handleOnMessage websocket消息监听，必须实现
export default {
  data () {
    return {
      group_chat_id: '',
      ws: '',
      intervalId: ''
    }
  },
  methods: {
    initChat () {
      var _this = this
      _this.ws = new WebSocket(this.$config.gatewayWrokerHost)
      _this.ws.onopen = () => {
        this.intervalId = setInterval(() => { // 心跳检测
          _this.ws.send('heart beat\n')
        }, 10000)
      }
      _this.ws.onmessage = e => {
        // json数据转换成js对象
        let data = JSON.parse(e.data)
        console.log(data);

        this.handleOnMessage(data)
        this.getHistory = false
      }
      _this.ws.onerror = e => {
        // console.error(e)
      }
    },
    joinDisucussStudent (client_id) { // 学生端连接soket
      this.axios.request({
        method: 'get',
        url: '/Student/Topic/group_chat',
        params: {
        }
      }).then(res => {
        if (res.code === 200) {
          // console.log(res)
        }
      })
    },
    joinDisucussTeacher (client_id) { // 教师端连接soket
      this.axios.request({
        method: 'get',
        url: '/Teacher/Topic/group_chat',
        params: {
        }
      }).then(res => {
        if (res.code === 200) {
          // console.log(res)
        }
      })
    },
    bindUser (client_id, uid = false) {
      let _this = this
      let userType = this.$store.state.user.userInfo.userType
      let user_id = uid || `${userType}_${_this.$store.state.user.userId}`
      _this.axios.request({
        method: 'post',
        url: '/home/websocket/bind',
        data: {
          client_id,
          uid: user_id
        }
      }).then(res => {
        if (res.code === 200) {
          // console.log(res.message)
          _this.group_chat_id && _this.joinGroup(_this.group_chat_id, user_id)// 加入群聊
        }
      })
    },
    bindUser_public (client_id, uid = false) {
      let _this = this
      let userType = this.$store.state.user.userInfo.userType
      let user_id = uid || `${userType}_${_this.$store.state.user.userId}`
      _this.axios.request({
        method: 'post',
        url: '/home/websockets/bind',
        data: {
          client_id,
          uid: user_id
        }
      }).then(res => {
        if (res.code === 200) {
          // console.log(res.message)
          _this.group_chat_id && _this.joinGroup_public(_this.group_chat_id, user_id)// 加入群聊
        }
      })
    },
    joinGroup (group_chat_id, uid) {
      let _this = this
      _this.axios.request({
        method: 'post',
        url: '/home/websocket/joinGroup',
        data: {
          group: group_chat_id,
          uid
        }
      }).then(res => {
        if (res.code === 200) {
          // console.log(res.message)
        }
      })
    },
    joinGroup_public (group_chat_id, uid) {
      let _this = this
      _this.axios.request({
        method: 'post',
        url: '/home/websockets/joinGroup',
        data: {
          group: group_chat_id,
          uid
        }
      }).then(res => {
        if (res.code === 200) {
          // console.log(res.message)
        }
      })
    },
    sendMsg (msg, extra = {}, type = 'txt', target_type = 'chatgroups') { // 发送消息
      let _this = this
      const userInfo = {
        id: this.$store.state.user.userId,
        name: this.$store.state.user.userName,
        avator: this.$store.state.user.avatarImgPath,
        type: this.$store.state.user.userInfo.userType === 1 ? 'teacher' : 'student'
      }
      Object.assign(extra, { userInfo })
      let message = {
        target_type: target_type, // 发送类型
        target: this.group_chat_id, // 发送群组
        from: this.$store.state.user.userId, // 发送者
        sendTime: parseInt((new Date()).getTime() / 1000), // 发送时间
        msg: {
          type: type,
          msg: msg,
          extra: extra
        }
      }
      if (this.$store.state.user.userInfo.userType === 1) {
        _this.axios.request({
          method: 'post',
          url: '/home/websocket/sendToGroup',
          data: {
            group: _this.group_chat_id,
            message: message,
            type: 1
          }
        }).then(res => {
          if (res.code === 200) {
            _this.msg = ''
          }
        })
      } else {
        _this.axios.request({
          method: 'post',
          url: '/home/websocket/sendToGroup',
          data: {
            group: _this.group_chat_id,
            message: message
          }
        }).then(res => {
          if (res.code === 200) {
            _this.msg = ''
          }
        })
      }

    }
  },
  beforeDestroy () {
    // 页面销毁时关闭长连接
    clearInterval(this.intervalId)
    // console.log('close')
    this.ws.close()
  },
  created () {
  },
  computed: {
    userType () {
      return this.$store.state.user.userInfo.userType
    }
  },
  mounted () {
    console.log(this.userType);

  }

}
