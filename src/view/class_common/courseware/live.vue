<template>
  <!-- //原courseware_play -->
  <div>
    <Row ref="conT" style="margin:10px auto;display:flex" class="live-container">
      <Col
        :span="18"
        style="flex:1;background: #000;padding:10px;padding-top:12px"
        v-if="['mp4','ogg', 'avi', 'rmvb','swf','mp3'].indexOf(file_stuffix)!==-1"
      >
        <embed :src="student_courseware.courseware.file_url" type width="100%" height="600">
      </Col>
      <Col
        :span="18"
        style="flex:1;background: #000;padding:0 10px;padding-top:12px"
        v-if="live_type === 'live'"
      >
        <div>
        </div>
        <div style="display:flex;height:100%;">
          <video id="videoElement" style="width:100%;" controls muted></video>
        </div>
      </Col>
      <Col id="pdf"
        style="flex:1;background: #000;padding:10px"
        v-if="['pdf'].indexOf(file_stuffix) !== -1 && live_type === 'pdf'">
      <!-- 弹幕组件：vue-baberrage -->
        <vue-baberrage
          class="baberrage"
          style="z-index:99999;height:100px;padding-top:10px;margin-top:60px"
          :isShow= "barrageIsShow"
          :barrageList = "barrageList"
          :loop = "barrageLoop"
          :boxHeight="100"
        >
        </vue-baberrage>
        <div class="switch_input switch_input_style" style="height:60px" ref="switch_input" @mousedown="move($event)">
          <div style="display:flex;justify-content: space-around;height:66px;line-height:66px;align-items: center;">
            <Tooltip content="上一页" placement="top">
              <span class="page_style" @click="handlePageChange('up')"><Icon type="ios-arrow-back" /></span>
            </Tooltip>
            <Tooltip content="下一页" placement="top">
              <span class="page_style" @click="handlePageChange('down')"><Icon type="ios-arrow-forward" /></span>
            </Tooltip>
            <Tooltip content="退出全屏" placement="top">
              <span class="page_style" @click="end_full"><Icon type="md-contract" /></span>
            </Tooltip>
            <Tooltip :content="isSync ? '取消同屏' : '同屏'" placement="top">
              <div class="page_style" :style="{background: isSync ? 'red' : `#fff`, cursor: 'pointer'}"  @click="()=>{isSync=!isSync;this.getPptOption()}"> <Icon type="md-wifi" /></div>
            </Tooltip>
            <Tooltip content="弹幕" placement="top">
              <span class="page_style" :style="{background: barrageIsShow ? 'red' : `#fff`, cursor: 'pointer'}" @click="barrageIsShow = !barrageIsShow"><Icon type="ios-outlet-outline" /></span>
            </Tooltip>
            <Tooltip content="移动" placement="top">
              <span class="page_style" style="cursor: move;"><Icon type="md-move"/></span>
            </Tooltip>
          </div>
        </div>
        <div style="height:100%;overflow:auto;background:#000;display:flex;width:100%" id="pdf1" ref="pdf1">
          <div
            v-if="loadedRatio > 0 && loadedRatio < 1"
            style="background-color: green; color: white; text-align: center"
            :style="{ width: loadedRatio * 100 + '%' }"
          >{{ Math.floor(loadedRatio * 100) }}%</div>
          <pdf
            ref="pdf"
            :src="student_courseware.courseware.file_url"
            :page="page"
            :style="{width:'100%'}"
            style="margin: 0 auto;"
            @progress="loadedRatio = $event"
            @error="error"
            @num-pages="numPages = $event"
            @link-clicked="page = $event"
          ></pdf>
        </div>
      </Col>
      <Col v-else-if="['pdf'].indexOf(file_stuffix) === -1 && live_type === 'pdf'" style="flex:1;background: #000;padding:10px">
         <Spin v-show="true" fix></Spin>
      </Col>
      <!-- <div  style="height:900px;background: #000;padding:10px;text-align:center"> -->
        <!-- v-else -->
      <Col
        :span="16"
        style="height:82vh;background: #000;padding:10px;text-align:center"
        v-if="['mp4','ogg', 'avi', 'rmvb','swf','mp3'].indexOf(file_stuffix)!==-1 && live_type === 'pdf'"
      >
        <h1>课件格式不支持</h1>
        <a :href="student_courseware.courseware.file_url" target="blank">{{student_courseware.courseware.courseware_name}}</a>
      </Col>
      <div class="live-footer" style="margin:0 auto;position:absolute;bottom:-43px;background:#000;padding:10px">
        <span style="color:#ffffff;line-height:28px">教师状态：</span>
        <span v-if="teacher_staus==='在线'" style="color:green">{{teacher_staus}}</span>
        <span v-if="teacher_staus==='离线'" style="color:red">{{teacher_staus}}</span>
        <span v-if="mode==='pdf'" @click="handlePageChange('up')" class="live-fz-20"><Icon type="ios-arrow-dropleft" color="#ffffff" style="cursor:pointer;margin-left:30px"/></span>
        <span style="margin:0 10px" v-if="mode==='pdf'">
          <InputNumber v-model.number="page" :min='1' size="small" style="width: 50px;margin-bottom:3px"/>
          <span style="color:#ffffff;display:inline-block">页码：/{{numPages}}</span>
        </span>
        <span v-if="mode==='pdf'" @click="handlePageChange('down')" class="live-fz-20"><Icon type="ios-arrow-dropright" color="#ffffff" style="cursor:pointer"/></span>
        <span class="showR">
          <span>
            <span @click="barrageIsShow = false" style="display:inline-block;cursor:pointer" class="danmushow" v-show="barrageIsShow"></span>
            <span @click="barrageIsShow = true" style="display:inline-block;cursor:pointer" class="danmuopen" v-show='!barrageIsShow'></span>
          </span>
          <!-- <span>
            <span v-show="fullBtnShow">
              <Icon type="ios-desktop" size="24" color="#8a8a8a" class="inWH" @click="handleLiveTypeChange('live')"/>
            </span>
            <span v-show="!fullBtnShow">
              <Icon type="md-document" size="24" color="#8a8a8a" class="inWH" @click="handleLiveTypeChange('pdf')"/>
            </span>
          </span> -->
          <span @click="fullScreen('pdf')" class="fScreen" v-show="fullBtnShow"></span>
        </span>
      </div>
      <Col
        class="chatL"
        style="width:335px;margin-left:20px;background:rgb(255, 255, 255);border-radius:12px"
        >
        <Row style="text-align:center;height:37px;background:rgb(95, 95, 95);color:#ffffff;line-height:37px;margin-bottom:18px;font-weight:bold">课中讨论</Row>
          <Row class="tab-content">
          <div class="chat-container" id="chat-container" >
            <p style="text-align:center;color: #999;">没有更多了~！</p>
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
          <Input :maxlength="30" type="text"  v-model="msg" class="chatinput" placeholder="请输入..." @on-enter='send' style="position:static;width:256px"></Input>
          <Button type="primary" @click="send()" class="sendbtn" style="position:static">发送</Button>
          </Row>
      </Col>
      <!-- <Button type="primary" @click="navigator" style="margin-left:15px;">地理考勤</Button> -->
    </Row>
    <div class="live-bottom" style="margin:50px auto 200px auto;display:flex">
      <div style="float:left;margin-right:20px;width:240px">
        <Menu theme="light" @on-select="changeSelect" active-name="1">
           <MenuItem name="1">课件素材</MenuItem>
           <MenuItem name="2">课中任务</MenuItem>
           <MenuItem name="3">笔记</MenuItem>
           <MenuItem name="4">教师提问</MenuItem>
        </Menu>
      </div>
      <div style="float:left;flex:1">
        <div v-if="selectType==1">
          <p v-if="student_courseware.courseware.courseware_files.length === 0" style="text-align:center">暂无素材...</p>
            <ul class="ivu-upload-list" >
              <li class="ivu-upload-list-file ivu-upload-list-file-finish" v-for="file in student_courseware.courseware.courseware_files" :key="file.id">
                  <span>
                    <Icon type="ios-document" />
                    <a :href="file.file_url" target="blank">{{file.file_name}}</a>
                  </span>
              </li>
            </ul>
        </div>
        <div v-else-if="selectType==2">
          <Row class="tab-content">
            <TaskList ref='task_list' :student_courseware_id="this.student_courseware_id"></TaskList>
          </Row>
        </div>
        <div v-else-if="selectType==4">
          <studentQuestionlist></studentQuestionlist>
        </div>
      </div>
    </div>
    <!-- <div class="random_box" v-if="show_random_box" :style="{top:random_box_top,left:random_box_left,color:random_box_color}" @click="stop_timer">
      {{sub_number}}
    </div> -->

  <Modal v-model="modal" :width="530" :title="title" footer-hide draggable scrollable >
    <Row v-if="target === 'courseware_file' && modal" >
      新窗口打开：<a :href="target_id.file_url" target="blank">{{target_id.file_name}}</a>
      <iframe :src="target_id.file_url" frameborder="0" width="100%" height="700"></iframe>
    </Row>
  </Modal>
  <Modal v-model="modal2" :width="520" :title="answertitle" footer-hide draggable scrollable >
    <p>问题：{{problemContent}}</p>
    <Input type = "textarea" v-model="answer" :rows="4"  placeholder="请输入问题答案..."/>
    <div style="margin-top:10px;text-align:right">
      <Button type="success" @click="submitAnswer">确定</Button>
    </div>
  </Modal>
  </div>
</template>
<script>
import pdf from 'vue-pdf'
import { fullScreen, getSuffix } from '@/libs/util'
import live from '@/view/common/live' // 直播群聊相关
import TaskList from '@/view/class_common/task/task_list_m'
import modal_mixin from '@/view/mixins/modal_mixin'
import studentQuestionlist from '@/view/teacher_common/question/student_questionlist'
import { MESSAGE_TYPE } from 'vue-baberrage'
import { get_ppt_option } from '@/api/common'
export default {
  components: {
    pdf,
    TaskList,
    studentQuestionlist
  },
  props: {
    student_courseware_id: '',
    mode: ''
  },
  mixins: [live, modal_mixin],
  data () {
    return {
      selectType: 1,
      answer: '',
      problemContent: '',
      student_id: '',
      teacher_id: '',
      quiz_id: '',
      modal2: false,
      fullBtnShow: true,
      teacher_staus: '离线',
      random_box_timer: null,
      sub_number: 10,
      show_random_box: false,
      random_box_color: 'rgb(256,256,256)',
      random_box_top: '70vh',
      random_box_left: '80vw',
      live_type: 'pdf', // pdf  live
      barrageIsShow: true,
      isSync: true, // 是否同屏
      barrageList: [], // 弹幕数据
      barrageLoop: false,
      scroll_init: false,
      is_show: false,
      o_team_student_task_id: '', // 别的小组的student_task_id
      student_courseware: { courseware: { courseware_files: [] } },
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
      live_url: '',
      modal1: false,
      score: '',
      uid: '',
      user_type: '',
      rob: 0,
      answertitle: '',
      courseware_id: ''
    }
  },
  watch: {
    student_courseware_id (newVal, oldVal) {
      this.getStudentCourseware()
    },
    problemContent (n, o) {
      this.showProblem()
    },
    score (n, o) {
      this.getScore(n)
    }
  },
  computed: {
    file_stuffix () {
      return getSuffix(this.student_courseware.courseware.file_url)
    }
  },
  created () {
    this.getStudentCourseware()
    this.handleLiveTypeChange(this.mode)
  },
  methods: {
    // 地理定位
    navigator () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success => {
          // console.log(`纬度：${success.coords.latitude}+经度：${success.coords.longitude}`)
          alert(`纬度：${success.coords.latitude}+经度：${success.coords.longitude}`)
        }, err => {
          console.log(err.code + ':' + err.message)
          alert('当前浏览器不支持定位考勤')
        })
      } else {
        alert('您的浏览器不支持定位！')
      }
    },
    // 验证成功
    stop_timer () {
      clearInterval(this.random_box_timer)
      this.show_random_box = false
      this.$Message.success('验证成功')
    },
    // 发起验证
    test_ramdom () {
      this.random_box_top = `${Math.floor(Math.random() * 70)}vh`
      this.random_box_left = `${Math.floor(Math.random() * 80)}vw`
      this.random_box_timer = setInterval(() => {
        if (this.sub_number !== 0) {
          this.sub_number--
          this.random_box_color = `rgb(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)})`
        } else {
          clearInterval(this.random_box_timer)
          this.$Message.error('请认真听课')
          this.show_random_box = false
        }
      }, 1000)
      this.show_random_box = true
    },
    addToList (getdata) { // 弹幕信息设置
      let data = getdata.msg
      this.barrageList.push({
        id: ++this.currentId, // 弹幕id
        avatar: data.extra.userInfo.avator !== '' ? data.extra.userInfo.avator : '../../../assets/images/default.jpg', // 头像
        msg: data.msg, // 弹幕信息
        time: data.msg.length > 5 ? 7 : data.msg.length > 10 ? 5 : 10, // 弹幕显示时长
        type: MESSAGE_TYPE.NORMAL // 弹幕样式
      })
    },
    getStudentCourseware () {
      if (!this.student_courseware_id) {
        return false
      }
      this.axios.request({
        method: 'get',
        url: '/index.php/Student/Courseware/detail',
        params: {
          student_courseware_id: this.student_courseware_id
        }
      }).then(res => {
        if (res.code === 200) {
          this.student_courseware = res.data.student_courseware
          this.courseware_id = res.data.student_courseware.courseware.id
          let id_str = res.data.live_class_ids.join(',')
          this.group_chat_id = `courseware_${this.student_courseware.courseware.id}_${id_str}`
          this.live_url = res.data.live_url
          this.getPptOption()
          this.initChat()
          setTimeout(() => {
            this.ws.send(JSON.stringify({
              group: this.group_chat_id,
              uid: `${this.$store.state.user.userInfo.userType}_${this.$store.state.user.userId}`,
              user_type: this.$store.state.user.userInfo.userType,
              action: 'init'
            }))
          }, 1000)
        }
      })
    },
    move (e) {
      var va = this.$refs.switch_input
      var inx = null
      var iny = null
      inx = e.clientX - va.offsetLeft
      iny = e.clientY - va.offsetTop
      document.onmousemove = function (e) {
        if (e.clientX - inx >= 0 && e.clientX - inx <= document.body.clientWidth - va.offsetWidth) {
          va.style.left = e.clientX - inx + 'px'
        }
        if (e.clientY - iny >= 0 && e.clientY - iny <= document.body.clientHeight - va.offsetHeight) {
          va.style.top = e.clientY - iny + 'px'
        }
        va.style.margin = 0
      }
      document.onmouseup = function () {
        document.onmousemove = null
        document.onmouseup = null
      }
      return false
    },
    // 关闭全屏
    end_full () {
      // 各浏览器兼容处理
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      }
    },
    submitAnswer () {
      if (this.answer === '') {
        this.$Message.error('请输入答案')
      } else {
        this.axios.request({
          method: 'post',
          url: 'index.php/Student/Quiz/submit_answer',
          data: {
            answer_content: this.answer,
            student_id: this.$store.state.user.userId,
            teacher_id: this.teacher_id,
            quiz_id: this.quiz_id
          }
        }).then(res => {
          if (res.code === 200) {
            this.$Message.success(res.message)
            this.modal2 = false
            this.answer = ''
          } else {
            this.$Message.success(res.message)
          }
        })
      }
    },
    send () {
      if (!this.msg.trim()) return
      this.sendMsg(this.msg)
    },
    handleOnMessage (data) {
      if (data.content !== undefined) {
        this.problemContent = data.content
        this.teacher_id = data.teacher_id
        this.quiz_id = data.quiz_id
        this.rob = data.rob
        if (this.rob === 1) {
          this.answertitle = '抢答'
        } else {
          this.answertitle = '提问'
        }
      } else if (data.score !== undefined) {
        this.score = data.score
      }
      // this.problem = data.data
      // let _this = this
      // 监听websocket消息
      let type = data.type || ''
      switch (type) {
        // Events.php中返回的init类型的消息，将client_id发给后台进行uid绑定
        case 'init':
          this.bindUser(data.client_id)
          break
        case 'ppt':
          if (this.isSync) {
            this.page = parseInt(data.page)
            document.getElementById('pdf1').scrollTop = data.scrollTop
          }
          break
        case 'online':
          this.teacher_staus = '在线'
          break
        case 'offline':
          this.teacher_staus = '离线'
          break
        default: {
          this.addToList(data)
          if (data.target === this.group_chat_id) {
            this.messageList.push(data)
            this.scrollToBottom()
          } else {
            // _this.$refs.task_list && _this.$refs.task_list.$emit('message', data)
          }
        }
      }
    },
    scrollToBottom () {
      setTimeout(() => {
        let ele = document.getElementById('chat-container')
        if (ele.scrollHeight > ele.offsetHeight) {
          this.scroll_init = true
          ele.scrollTop = ele.scrollHeight - ele.offsetHeight
        }
      }, 200)
    },
    error: function (err) {
      console.log(err)
    },
    handleChange (html, text) {
      this.student_task.submit_content = html
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
      get_ppt_option(this.group_chat_id).then(res => {
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
        this.fullBtnShow = false
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
        this.fullBtnShow = true
        this.flvPlayer.pause()
        this.flvPlayer.unload()
        this.flvPlayer.detachMediaElement()
        this.flvPlayer.destroy()
        this.flvPlayer = null
      }
    },
    unshowModal () {
      this.modal = false
    },
    showProblem () {
      this.modal2 = true
    },
    getScore (n) {
      this.$Message.info({
        content: '问题得分：' + n,
        duration: 60,
        closable: true
      })
    },
    changeSelect (val) {
      this.selectType = val
    }
  },
  mounted () {

  },
  beforeDestroy () {
    clearInterval(this.random_box_timer)
    this.random_box_timer = null
  }
}
</script>
<style type="text/css" lang="less">

.random_box{
  font-size: 30px;
  padding: 50px;
  position: absolute;
  z-index: 6666;
  background: #000;
  color: #fff;
  cursor: pointer;
}

.random_box::after{
  content: '倒计时结束前点我';
  position: absolute;
  bottom: 0;
  left: 0;
  font-size: 14px;
}

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
  overflow: auto;
  .chat-item {
    margin-bottom: 15px;
    .msg{
      margin-top: 2px;
      margin-left:10px;
      padding: 5px;
      // background: #ddd;
      border-radius: 5px;
      display: inline-block;
      flex: 1;
      word-break: break-all
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

.live-container{

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
}
.showR{
  display:inline-block;
  padding-right:20px;
  float:right;
  transform: translateY(2px)
}
.inWH{
  cursor: pointer;
  vertical-align: top;
  margin-right: 20px
}
span.fScreen{
  display:inline-block;
  cursor: pointer;
  height: 23px;
  width: 23px;
  background: url('../../../assets/images/live_fullscreen.png') no-repeat;
}
.tab-content{
  // border:1px solid #ccc;
  border-top: 0px;
  padding-left: 10px;
}
.fRight>div.ivu-tabs-bar{
    background-color: #eeeeee;
}
.fRight .ivu-tabs-nav{
  width: 100%
}
.fRight .ivu-tabs-nav .ivu-tabs-tab{
  width: 33.33333%;
  text-align: center;
  padding: 10px 16px;
}
#pdf1 span canvas{
  // height: 100%!important
}
  @media screen and (min-width:0px){
    .live-container{
      width:1024px;
      height: 395px;
    }
    .live-bottom{
      width:1024px;
    }
    .live-footer{
      width:669px;
    }
    #chat-container{
      height: 353px;
    }
  }
  @media screen and (min-width:1256px){
    .live-container{
      width:1220px;
      height: 504px;
    }
    .live-bottom{
      width:1220px;
    }
    .live-footer{
      width:865px;
    }
    #chat-container{
      height: 461px;
    }
  }
  @media screen and (min-width:1500px){
    .live-container{
      width:1480px;
      height: 651px;
    }
    .live-bottom{
      width:1480px;
    }
    .live-footer{
      width:1125px;
    }
    #chat-container{
      height: 607px;
    }
  }
  @media screen and (min-width:1700px){
    .live-container{
      width:1665px;
      height: 754px;
    }
    .live-bottom{
      width:1665px;
    }
    .live-footer{
      width:1310px;
    }
    #chat-container{
      height: 709px;
    }
  }
  @media screen and (min-width:1900px){
    .live-container{
      width:1844px;
      height: 855px;
    }
    .live-bottom{
      width:1844px;
    }
    .live-footer{
      width:1489px;
    }
    #chat-container{
      height: 811px;
    }
  }
</style>
