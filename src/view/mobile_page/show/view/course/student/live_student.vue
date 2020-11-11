<template>
  <div class="m-liveStudent flex-contain">
    <Icon type="ios-arrow-back" @click="back" />
    <div class="m-live-box">
      <div style="height:100%;width:100%;background: #000" v-if="mode === 'live'">
        <video id="myVideo" style="display:none;width:100%;height:100%"
          class="video-js vjs-default-skin vjs-big-play-centered" controls muted preload="auto">
          <source src="" type="application/x-mpegURL">
        </video>
        <video id="videoElement" style="width:100%;height:100%;display:none;outline:none" controls muted></video>
      </div>
      <!-- pdf -->
      <div class="m-pdfcard" ref="pdfcard" v-if="mode === 'pdf'">
        <div id="pdf" v-if="unpdf" style="align-self:center">
          <!-- 弹幕组件：vue-baberrage -->
          <!-- <vue-baberrage
            class="baberrage"
            style="z-index:1;height:100px;padding-top:10px;"
            :isShow= "barrageIsShow"
            :barrageList = "barrageList"
            :loop = "barrageLoop"
            :boxHeight="100"
          >
          </vue-baberrage> -->
          <div style="height:100%;overflow:auto;background:#000;display:flex;width:100%;align-items:center" id="pdf1"
            ref="pdf1" v-if="['pdf'].indexOf(file_stuffix) !== -1 && mode === 'pdf'">
            <pdf ref="pdf" :src="student_courseware.courseware.file_url" :page="page" :style="{width:'100%'}"
              style="margin: 0 auto;" @progress="loadedRatio = $event" @error="error" @num-pages="numPages = $event"
              @link-clicked="page = $event"></pdf>

          </div>
        </div>
        <div v-else style="width:100%;height:444px;overflow-y:auto;">
          <!-- <embed :src="src" width="100%" height="440px" autostart="false"> -->
        </div>
        <div class="m-pdf-control">
          <img src="@/assets/images/mobile_student/lastpage.png" @click="handlePageChange('up')" />
          <span>{{page}}/{{numPages}}</span>
          <img src="@/assets/images/mobile_student/nextpage.png" @click="handlePageChange('down')" />
          <!-- <img src="@/assets/images/mobile_student/fullscreen.png" class="m-pdf-control-r" @click="fullScreen()"/> -->
        </div>
      </div>
    </div>

    <mt-navbar v-model="selected">
      <mt-tab-item id="1">弹幕讨论</mt-tab-item>
      <mt-tab-item id="2">课堂笔记</mt-tab-item>
      <mt-tab-item id="3">老师提问</mt-tab-item>
      <mt-tab-item id="4">任务测试</mt-tab-item>
    </mt-navbar>

    <!-- tab-container -->
    <mt-tab-container v-model="selected">
      <mt-tab-container-item id="1">
        <mt-cell v-for="n in 10" :key="n" :title="'内容 ' + n" />
      </mt-tab-container-item>
      <mt-tab-container-item id="2">
        <note :courseware_id="courseware_id"></note>
      </mt-tab-container-item>
      <mt-tab-container-item id="3">
        <mt-cell v-for="n in 6" :key="n" :title="'选项 ' + n" />
      </mt-tab-container-item>
      <mt-tab-container-item id="4">
        <mt-cell v-for="n in 6" :key="n" :title="'选项 ' + n" />
      </mt-tab-container-item>
    </mt-tab-container>
  </div>
  <!-- <div class="m-chapterDetail-bottom">
      <input type="text" placeholder="留个言 分享下你的收获..." v-model="writeDiscuss"/>
      <img src="@/assets/images/mobile_student/sendcommand.png" @click="addDiscuss"/>
    </div> -->

</template>
<script>

import { getSuffix } from '@/libs/util'
import pdf from 'vue-pdf'
import { Toast } from 'mint-ui'
import note from '@/view/mobile_page/show/view/course/note'

export default {
  data () {
    return {
      unpdf: true, // 判断src是否为pdf，true：是
      isSync: true, // 是否同屏
      student_courseware: { courseware: { courseware_files: [] } },
      live_url: '',
      courseware_id: '',
      selected: 1,
      page: 1,
      loadedRatio: 0,
      numPages: undefined,
    }
  },
  components: {
    pdf,
    note
  },
  watch: {

  },
  computed: {
    student_courseware_id () {
      return this.$route.query.student_courseware_id
    },
    mode () {
      return this.$route.query.mode
    },
    file_stuffix () {
      return getSuffix(this.student_courseware.courseware.file_url)
    },
  },
  methods: {
    back () {
      history.go(-1)
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
          var u = navigator.userAgent
          var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
          if (this.mode === 'live') {
            if (isiOS) {
              let mvdideo = document.getElementById('myVideo')
              mvdideo.src = res.data.live_urls
              mvdideo.style.display = 'block'
              mvdideo.play()
            } else {
              this.handleLiveTypeChange(this.mode)
              setTimeout(() => {
                this.live_url = res.data.live_url
                document.getElementById('videoElement').style.display = 'block'
              }, 1000)
            }
          }

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
    // fullScreen(){   //横屏放大
    //   document.getElementsByClassName('m-pdfcard')[0].style.transform = "rotate(90deg)"
    //   document.getElementsByClassName('m-pdfcard')[0].style.position = "absolute"
    // },
    handlePageChange (action) {   //切换pdf页码
      if (action === 'up') {
        if (this.page > 1) {
          this.page--
        } else {
          Toast({
            message: '前面没有了',
            duration: 2000
          })
        }
      } else {
        if (this.page < this.numPages) {
          this.page++
        } else {
          Toast({
            message: '已经是最后一页了',
            duration: 2000
          })
        }
      }
      document.getElementById('pdf1').scrollTop = 0
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
        this.flvPlayer = null
      }
    },
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
    error: function (err) {
      console.log(err)
    },
  },
  mounted () {
    this.getStudentCourseware()
  }
}
</script>
<style>
</style>
