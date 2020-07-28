<template>
<div class="pano-container">
  <!-- <div class="pano-content" :id="krpano_id" :style="!editable?{'height': '100%', 'width': '100%'}:{}">
  </div>
  <Row>
    <Col :span="12" :offset='6' style="margin-bottom:50px">
       <BaseInfo :pano_id="pano_id" v-if="editable" @success="handleSuccess"></BaseInfo>
    </Col>
  </Row> -->
  <video :src="pano.video_url" controls autoplay style="width:100%;height:100%;"></video>
</div>
</template>
<script>
import BaseInfo from './base_info.vue'
import { course_pano } from '@/api/common'

export default {
  props: {
    pano_id: '',
    editable: {
      type: Boolean,
      default: true
    }
  },
  components: { BaseInfo },
  data () {
    return {
      pano: {},
      krpano_id: `krpano_${this._uid}`,
      t_id: ''
    }
  },
  watch: {
    pano_id (n, o) {
      this.getInfo()
    }
  },
  methods: {
    getInfo () {
      course_pano(this.pano_id).then(res => {
        if (res.code === 200) {
          this.t_id = res.data.pano.id
          this.pano = res.data.pano
        }
      })
    }
    // getInfo () {   //获取全景视频
    //   let _this = this
    //   course_pano(this.pano_id).then(res => {
    //     if (res.code === 200) {
    //       this.t_id = res.data.pano.id
    //       this.pano = res.data.pano
    //       let head = document.getElementsByTagName('head')[0]
    //       let script = document.createElement('script')
    //       script.setAttribute('type', 'text/javascript')
    //       script.setAttribute('src', `${this.fileDomain}/pano/item/videopano/tour.js`)
    //       head.appendChild(script)
    //       if (this.krpano) {
    //         document.getElementsByClassName('pano-content')[0].removeChild(this.krpano)
    //       }
    //       script.onload = () => {
    //         embedpano({
    //           swf: `${this.fileDomain}/pano/item/videopano/tour.swf`,
    //           xml: `${this.fileDomain}/pano/item/videopano/tour.xml`,
    //           target: _this.krpano_id,
    //           html5: 'auto',
    //           vars: _this.vars,
    //           initvars: _this.initvars,
    //           basepath: _this.baseUrl,
    //           passQueryParameters: false,
    //           onready: function (krpano) {
    //             _this.krpano = krpano
    //             setTimeout(() => {
    //               krpano.set(`contextmenu.item[1].caption`, '')
    //               krpano.set(`contextmenu.item[2].caption`, '反向')
    //               krpano.set(`contextmenu.item[3].caption`, '平面视图')
    //               krpano.set(`contextmenu.item[4].caption`, '正常视图')
    //               krpano.set(`contextmenu.item[5].caption`, '鱼眼视图')
    //               krpano.set(`contextmenu.item[6].caption`, '立体视图')
    //               krpano.set(`contextmenu.item[7].caption`, '建筑视图')
    //               krpano.set(`contextmenu.item[8].caption`, '帕尼尼视图')
    //               krpano.set(`contextmenu.item[9].caption`, '小行星视图')
    //               krpano.set('plugin["video"].loop', 'false')
    //               krpano.set('plugin["video"].onloaded', 'add_video_sources("' + _this.pano.video_url + '")')
    //               krpano.call('add_video_sources("' + _this.pano.video_url + '")')
    //               krpano.set('contextmenu.fullscreen', false)
    //               krpano.set('contextmenu.versioninfo', false)
    //             }, 1000)
    //           },
    //           onerror: function (err) {
    //             console.error(err)
    //           }
    //         })
    //       }
    //     }
    //   })
    // },
    // handleSuccess () {
    //   this.$emit('success')
    // }
  },
  mounted () {
    this.getInfo()
  },
  destroyed () {
    // this.krpano.call('removeplugin("video")')
  }
}
</script>
<style lang="less">
.pano-container {
  width: 100%;
  height: 100%;
  .pano-content {
    width: 1000px;
    height: 562px;
    margin: 0px auto;
  }
}
</style>
