<template>
  <div class="live_body">
    <div class="live_box">
      <div>
        <div id="qrcode" style="display: flex;justify-content: center;"></div>
          <div class="urlContain">
            <span>
              推流地址：{{publishUrl}}
            </span>
          </div>
      </div>
    </div>
  </div>
</template>
<script>
import QRCode from 'qrcodejs2'
export default {
  data () {
    return {
      qrCode_url: `${window.location.protocol}`,
      live_url: '',
      publishUrl: '',
      teacer_id: ''
    }
  },
  watch: {

  },
  methods: {
    qrcode (url) {
      // eslint-disable-next-line no-new
      new QRCode('qrcode', {
        width: 500,
        height: 500,
        text: url, // 二维码地址
        colorDark: '#000',
        colorLight: '#fff'
      })
    },
    get_live_info () {
      this.axios.request({
        method: 'get',
        url: '/index.php/Student/Coursewares/get_live_userId',
        params: {

        }
      }).then(res => {
        if (res.code === 200) {
          this.teacer_id = res.data.teacher_id
          this.live_url = res.data.live_url
          this.publishUrl = res.data.publishUrl
          let domain = window.location.protocol + '//' + window.location.host
          this.qrcode(`${domain}/#/live_online?teacher_id=` + this.teacer_id)
        }
      })
    }
  },
  mounted () {
    this.get_live_info()
  }
}
</script>
<style lang="less">
  #qrcode{
    margin: 50px auto
  }
  #qrcode>img{
    width: 300px;
  }
  .urlContain{
    margin: 0 auto;
    text-align: center;
    max-width: 700px;
  }
  .showUrl{
    font-size: 12px;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    display: flex!important;
    display: -webkit-box!important;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
</style>
