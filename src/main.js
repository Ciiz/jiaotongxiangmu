// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import i18n from '@/locale'
import config from '@/config'
import importDirective from '@/directive'
import { directive as clickOutside } from 'v-click-outside-x'
import installPlugin from '@/plugin'
import './index.less'
import '@/assets/icons/style.css'
import TreeTable from 'tree-table-vue'
import VOrgTree from 'v-org-tree'
import 'v-org-tree/dist/v-org-tree.css'
import axios from '@/libs/api.request'
import myComponents from '_c/my-components'// 自定义全局组件
import vuescroll from 'vuescroll'// 引入vuescroll
import 'vuescroll/dist/vuescroll.css'// 引入vuescroll样式
import 'babel-polyfill'
// const theme = localStorage.getItem('etoTheme') || 'default'
require(`@/assets/theme/default.less`)
// import VueDND from 'awe-dnd'
// Vue.use(VueDND)

// 实际打包时应该不引入mock
/* eslint-disable */
// if (process.env.NODE_ENV !== 'production') require('@/mock')
import { dateFormat, dealResourceUrl, dealFileUrl, img_width_or_height } from '@/libs/tools';
import errorImg from '@/assets/images/default.jpg'
import moment from 'moment'
import echarts from 'echarts'
import VueTour from 'vue-tour' // 新手引导插件
import { vueBaberrage } from 'vue-baberrage' // 弹幕插件
// import Video from 'video.js'
// import 'videojs-contrib-hls'
// import 'video.js/dist/video-js.css'
import Router from 'vue-router'

const routerPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return routerPush.call(this, location).catch(error => error)
}
Vue.use(vueBaberrage)
require('vue-tour/dist/vue-tour.css')
//注册全局
Vue.prototype.echarts = echarts;
Vue.prototype.imgtest = img_width_or_height;  // 图片显示处理
Vue.prototype.dateFormat = dateFormat;
Vue.prototype.imgUrl = dealResourceUrl;
Vue.prototype.fileUrl = dealFileUrl;
Vue.prototype.fileDomain = config.fileDomain;
Vue.prototype.axios = axios;
Vue.prototype.baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
Vue.prototype.errorImg = errorImg
Vue.prototype.errorImg01 = 'this.src="' + require('@/assets/images/u=3730772664,138405132&fm=26&gp=0.jpg') + '"'//处理文件的url
moment.locale('zh-cn');
Vue.prototype.moment = moment;
// Vue.prototype.$video = Video
Vue.filter('time', function (value, formatString) {
  if (!value) return
  formatString = formatString || 'YYYY-MM-DD HH:mm';
  return moment(value * 1000).format(formatString);
})

Vue.filter('timeFrom', function (value) {
  return moment(value * 1000).fromNow();
})
Vue.use(iView, {
  i18n: (key, value) => i18n.t(key, value)
})
// Vue.use(MintUI)
Vue.use(VueTour)
Vue.use(TreeTable)
Vue.use(VOrgTree)
Vue.use(myComponents)
Vue.use(vuescroll);//使用
/**
 * @description 注册admin内置插件
 */
installPlugin(Vue)
/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config
/**
 * 注册指令
 */
importDirective(Vue)
Vue.directive('clickOutside', clickOutside)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  render: h => h(App)
})
