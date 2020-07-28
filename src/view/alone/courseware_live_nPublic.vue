<template>
  <div>
    <Row>
      <Col
        :span="24"
        style="background: #000;padding:10px;display:flex;flex-direction: column"
        v-if="live_type === 'live'"
      >
        <div>
        </div>
        <video id="videoElement" style="width:100%;" controls muted></video>
      </Col>
    </Row>
  </div>
</template>
<script>
import { fullScreen } from '@/libs/util'
export default {
  data () {
    return {
      live_type: 'live', // pdf  live
      flvPlayer: null,
      live_url: '',
      teacher_id: ''
    }
  },
  methods: {
    get_live_info () {
      var reg = window.location.hash
      this.teacher_id = reg.split('=')[1]
      this.axios.request({
        method: 'post',
        url: '/index.php/Student/Coursewares/detail_public_live',
        data: {
          teacher_id: this.teacher_id
        }
      }).then(res => {
        if (res.code === 200) {
          this.live_url = res.data.live_url
          this.handleLiveTypeChange(this.live_type)
        }
      })
    },
    fullScreen: id => fullScreen(id),
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
    this.get_live_info()
  },
  mounted () {
  }
}
</script>
<style type="text/css" lang="less" scoped>
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
</style>
