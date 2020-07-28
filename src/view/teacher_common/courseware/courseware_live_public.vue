<template>
  <div>
    <Row>
      <Col
        :span="24"
        style="height:100vh;background: #000;padding:10px"
        v-if="['mp4','ogg', 'avi', 'rmvb','swf','mp3'].indexOf(file_stuffix)!==-1"
      >
        <embed :src="courseware.file_url" type width="100%" height="600">
      </Col>
      <Col
        :span="24"
        style="background: #000;padding:10px;display:flex;flex-direction: column"
        v-if="live_type === 'live'"
      >
        <!-- <div>
          <Button type="primary" @click="handleLiveTypeChange('pdf')">切换到课件PDF直播</Button>
        </div> -->
        <video id="myVideo"
        style="display:none;width:100%;height:100%"
         class="video-js vjs-default-skin vjs-big-play-centered"
         controls
         muted
         preload="auto"
        >
          <source src="" type="application/x-mpegURL" >
        </video>
         <video id="videoElement" style="width:100%;height:100%;display:none" controls muted></video>
      </Col>
      <Col
        :span="24"
        id="pdf"
        style="background: #000;padding:10px"
        v-show="['pdf'].indexOf(file_stuffix) !== -1 && live_type === 'pdf'"
      >
        <div class="fix-pdf-option">
          <Button @click="fullScreen('pdf')">全屏</Button>缩放：
          <Select v-model="scale" style="width:80px">
            <Option label="50%" :value="60"></Option>
            <Option label="80%" :value="80"></Option>
            <Option label="100%" :value="100"></Option>
            <Option label="125%" :value="125"></Option>
            <Option label="150%" :value="150"></Option>
          </Select>
          <!-- <Button type="primary" @click="handleLiveTypeChange('live')">切换到视频直播</Button> -->
        </div>
        <div style="height:100%;overflow:auto;background:#000;height:100%;" id="pdf1">
          页码：
          <div
            v-if="loadedRatio > 0 && loadedRatio < 1"
            style="background-color: green; color: white; text-align: center"
            :style="{ width: loadedRatio * 100 + '%' }"
          >{{ Math.floor(loadedRatio * 100) }}%</div>
          <pdf
            ref="pdf"
            :src="courseware.file_url"
            :page="page"
            :style="{width:scale+'%'}"
            style="height:80vh;margin: 0 auto;padding-top:34px;"
            @progress="loadedRatio = $event"
            @error="error"
            @num-pages="numPages = $event"
            @link-clicked="page = $event"
          ></pdf>
        </div>
         <div style="text-align:center; margin-top: 10px;">
            <Button @click="handlePageChange('up')">上一页</Button>
            <Input v-model.number="page" type="number" style="width: 5em"/>
            <Button @click="handlePageChange('down')">下一页</Button>
            /{{numPages}}
            <Button
              @click="()=>{isSync=!isSync;this.getPptOption()}"
              :type="isSync? 'error': 'success'"
            >{{isSync?'取消同屏' : '同屏'}}</Button>
          </div>
      </Col>
      <Col
        :span="24"
        style="height:100vh;background: #000;padding:10px;text-align:center"
        v-if="['mp4','ogg', 'avi', 'rmvb','swf','mp3'].indexOf(file_stuffix)!==-1 && live_type === 'pdf'"
      >
        <h1>课件格式不支持</h1>
        <a :href="courseware.file_url" target="blank">{{courseware.courseware_name}}</a>
      </Col>
    </Row>
      <Row
        :span="24"
        style="padding-right: 10px;padding-left: 10px;"
        >
        <Tabs size="small"  name="live" :animated="true" type="card" >
          <TabPane label="课中讨论" tab="live">
            <Row class="tab-content">
            <div class="chat-container" id="chat-container" :style="{height: `40vh`}">
              <a href="javascript:void(0)" style="margin: 10px;text-align:center;display:block;" @click="getHistoryMessages()" v-if="!loading && noMore===false">加载更多..</a>
              <p v-else style="text-align:center;color: #999;">没有更多了~！</p>
              <div v-for="(item,index) in messageList" :key="index" class="chat-item">
                <div class="chat-user">
                  <Avatar :src="item.msg.extra.userInfo.avator" @on-error="e => { e.target.src = errorImg }"/>
                  <span
                    class="name"
                    :class="{'spec': item.msg.extra.userInfo.type == 'teacher', 'mine': item.msg.extra.userInfo.type == 'student' && item.from == $store.state.user.userInfo.userId}"
                  >{{item.msg.extra.userInfo.name}} :</span>
                  <span class="time">({{item.sendTime | timeFrom}})</span>
                </div>
                <div v-html="item.msg.msg" class="msg"></div>
              </div>
            </div>
            <!-- <Input type="textarea" style="margin-top: 15px;" placeholder="请输入..." v-model="msg"/>
            <Button type="primary" long  @click="send()" style="margin-top:10px;">发送</Button> -->
            </Row>
          </TabPane>
          <TabPane label="课件素材" tab="live">
            <Row class="tab-content">
            <p v-if="courseware.courseware_files.length === 0" style="text-align:center">暂无素材...</p>
            <ul class="ivu-upload-list" >
              <li class="ivu-upload-list-file ivu-upload-list-file-finish" v-for="file in courseware.courseware_files" :key="file.id">
                  <span>
                    <Icon type="ios-document" />
                    <a :href="file.file_url" target="blank">{{file.file_name}}</a>
                  </span>
              </li>
            </ul>
            </Row>
          </TabPane>
        </Tabs>
      </Row>
  <Modal v-model="modal" :width="900" :title="title" footer-hide draggable scrollable >
    <Row v-if="target === 'courseware_file' && modal" >
      新窗口打开：<a :href="target_id.file_url" target="blank">{{target_id.file_name}}</a>
      <iframe :src="target_id.file_url" frameborder="0" width="100%" height="700"></iframe>
    </Row>
  </Modal>
  </div>
</template>
<script>
import pdf from 'vue-pdf'
import { fullScreen, getSuffix } from '@/libs/util'
import live from '@/view/common/live' // 直播群聊相关
import modal_mixin from '@/view/mixins/modal_mixin'
import { get_history_messages_public, get_ppt_option_public } from '@/api/common'
export default {
  components: {
    pdf
  },
  mixins: [live, modal_mixin],
  data () {
    return {
      courseware_id: this.$route.query.courseware_id,
      live_type: 'live', // pdf  live
      isSync: true, // 是否同屏
      scale: 100,
      scroll_init: false,
      is_show: false,
      courseware: { courseware_files: [] },
      ws: '', // websocket
      messageList: [],
      msg: '',
      lastest_msg_id: 0,
      group_chat_id: ``,
      // pdf
      src: '/test.pdf',
      numPages: undefined,
      page: 1,
      loadedRatio: 0,
      uploadList: [],
      loading: false,
      noMore: false,
      flvPlayer: null,
      live_url: ''
    }
  },
  watch: {
    courseware_id (newVal, oldVal) {
      this.getCourseware()
    }
  },
  computed: {
    file_stuffix () {
      return getSuffix(this.courseware.file_url)
    }
  },
  methods: {
    getCourseware () {
      if (!this.courseware_id) {
        return false
      }
      this.axios
        .request({
          method: 'get',
          url: '/index.php/Student/Coursewares/detail_public',
          params: {
            courseware_id: this.courseware_id
          }
        })
        .then(res => {
          if (res.code === 200) {
            this.courseware = res.data.courseware
            let id_str = res.data.live_class_ids.join(',')
            this.group_chat_id = `courseware_${this.courseware.id}_${id_str}`
            this.live_url = res.data.live_url
            var u = navigator.userAgent
            var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
            if (this.live_type === 'live') {
              if (isiOS) {
                let mvdideo = document.getElementById('myVideo')
                mvdideo.src = res.data.live_urls
                mvdideo.style.display = 'block'
                mvdideo.play()
              } else {
                this.handleLiveTypeChange(this.live_type)
                setTimeout(() => {
                  this.live_url = res.data.live_url
                  document.getElementById('videoElement').style.display = 'block'
                }, 1000)
              }
            }
            this.getHistoryMessages()
            this.getPptOption()
            this.initChat()
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
          this.bindUser_public(data.client_id, 'unknow_' + (new Date()).valueOf())
          break
        case 'ppt':
          console.log('ppt')
          if (this.isSync) {
            this.page = parseInt(data.page)
            document.getElementById('pdf1').scrollTop = data.scrollTop
          }
          break
        default: {
          console.log('default')
          if (data.target === this.group_chat_id) {
            this.messageList.push(data)
            this.scrollToBottom()
          } else {
            this.$refs.task_list.$emit('message', data)
          }
        }
      }
    },
    // 获取历史消息
    getHistoryMessages () {
      let _this = this
      this.loading = true
      get_history_messages_public({
        target_type: 'chatgroups',
        target: _this.group_chat_id,
        lastest_msg_id: _this.lastest_msg_id,
        page_size: 20
      }).then(res => {
        if (res.code === 200) {
          let historyMsgs = res.data.list.sort((a, b) => {
            return a.sendTime - b.sendTime
          })
          if (historyMsgs.length < 20) {
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
        let ele = document.getElementById('chat-container')
        if (ele.scrollHeight - ele.scrollTop < 805 || !_this.scroll_init) {
          _this.scroll_init = true
          ele.scrollTop = ele.scrollHeight
        }
      }, 200)
    },
    error: function (err) {
      console.log(err)
    },
    handleChange (html, text) {
      this.student_task.submit_content = html
    },
    handleBeforeUpload () {
      const check = this.uploadList.length < 1
      if (!check) {
        this.$Notice.warning({
          title: '只能上传一个文件'
        })
      }
      return check
    },
    handlePageChange (action) {
      if (action === 'up') {
        if (this.page > 1) {
          this.page--
        }
      } else {
        if (this.page < this.numPages) {
          this.page++
        }
      }
      document.getElementById('pdf1').scrollTop = 0
    },
    fullScreen: id => fullScreen(id),
    getPptOption () {
      if (!this.isSync) return
      let _this = this
      get_ppt_option_public(this.group_chat_id).then(res => {
        let data = res.data
        if (res.code === 200) {
          if (!data.options) {
            return
          }
          _this.page = parseInt(data.options.page)
          document.getElementById('pdf').scrollTop = data.options.scrollTop
        }
      })
    },
    handleLiveTypeChange (type) {
      this.live_type = type
      if (type === 'live') {
        setTimeout(() => {
          if (flvjs.isSupported()) {
            var videoElement = document.getElementById('videoElement')
            this.flvPlayer = flvjs.createPlayer({
              type: 'flv',
              url: this.live_url,
              isLive: true
            })
            this.flvPlayer.attachMediaElement(videoElement)
            this.flvPlayer.load()
            this.flvPlayer.play()
          }
        }, 500)
      } else {
        this.flvPlayer.pause()
        this.flvPlayer.unload()
        this.flvPlayer.detachMediaElement()
        this.flvPlayer.destroy()
        this.flvPlayer = null
      }
    }
  },
  created () {
    this.getCourseware()
  },
  mounted () {
  }
}
</script>
<style type="text/css" lang="less" scoped>
.spec {
  color: blueviolet;
}
.mine{
  color: cadetblue;
}
.member-item {
  margin-bottom: 10px;
}
.team-item {
  display: flex;
  height: 50px;
  background: #fff;
  padding: 12px;
  align-items: center;
  justify-content: space-between;
  position: relative;
  &:after {
    content: "";
    position: absolute;
    height: 1px;
    background: #ccc;
    bottom: 0px;
    transform: translateY(0.5);
    width: 98%;
  }
  .item-right {
    .ivu-btn {
      margin-left: 5px;
    }
  }
}
.chat-container {
  // height: 400px;
  overflow: auto;
  .chat-item {
    margin-bottom: 15px;
    .msg{
      margin-left: 42px;
      padding: 5px;
      background: #ddd;
      border-radius: 5px;
      display: inline-block;

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

.fix-pdf-option {
  position: absolute;
  background: #000;
  top: 0px;
  left: 0px;
  width: 100%;
  z-index: 999;
  // padding-left:20px;
  padding: 15px;
}

::-webkit-scrollbar-track-piece {
  //滚动条凹槽的颜色，还可以设置边框属性
  background-color: #f8f8f8;
}
::-webkit-scrollbar {
  //滚动条的宽度
  width: 5px;
  height: 9px;
}
::-webkit-scrollbar-thumb {
  //滚动条的设置
  background-color: #dddddd;
  background-clip: padding-box;
  min-height: 28px;
}
::-webkit-scrollbar-thumb:hover {
  background-color: #bbb;
}

.tab-content{
  // border:1px solid #ccc;
  border-top: 0px;
  padding: 10px;
}
</style>
