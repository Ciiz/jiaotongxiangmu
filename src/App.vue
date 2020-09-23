<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
// ios的禁止屏幕缩放
import { mapMutations } from 'vuex'
window.onload = function () {
  document.addEventListener('touchstart', function (event) {
    if (event.touches.length > 1) {
      event.preventDefault()
    }
  })
  document.addEventListener('gesturestart', function (event) {
    event.preventDefault()
  })
}
export default {
  name: 'App',
  methods: {
    ...mapMutations([
      'setTableHeight'
    ]),
    gethtmlfontsize () {
      // 三个步骤:
      // 1.获取html的宽,
      let htmlwidth = document.documentElement.clientWidth || document.body.clientWidth// 有些浏览器documentElement获取不到,那就使用后面的body

      // 2.htmlDom
      let htmlDom = document.getElementsByTagName('html')[0]

      // 3.设置根元素样式
      htmlDom.style.fontSize = htmlwidth / 7.5 + 'px'
    },
    isMobile () {
      let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
      return flag
    }
  },
  created () {
    let tableHeight = document.body.clientHeight - 300
    // let tableHeight = document.body.clientHeight > 768 ? document.body.clientHeight - 300 : 500
    this.setTableHeight(tableHeight)
    let _this = this
    window.onresize = function () {
      _this.setTableHeight(document.body.clientHeight - 300)
    }
    //   在页面加载时读取sessionStorage里的状态信息

    if (sessionStorage.getItem('state')) {
      this.$store.replaceState(Object.assign({}, this.$store.state,
        JSON.parse(sessionStorage.getItem('state'))))
    }

    //   页面刷新时将state数据存储到sessionStorage中

    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('state', JSON.stringify(this.$store.state))
    })
    if (this.isMobile()) {
      // alert('手机端')
      // 调用一次
      this.gethtmlfontsize()
      // 添加监听事件(resize是监听的意思)
      window.addEventListener('resize', this.gethtmlfontsize)
      // this.$router.replace('/entry')
    } else {
      // alert('pc端')
      // this.$router.replace('/')
    }
  }
}
</script>
