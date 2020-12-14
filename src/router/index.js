import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
import iView from 'iview'
import { setToken, getToken, canTurnTo, setTitle } from '@/libs/util'
// import config from '@/config'
// const { portalDomain } = config
Vue.use(Router)
const router = new Router({
  routes,
  linkActiveClass: 'personal_active',
  mode: 'hash'
})
const LOGIN_PAGE_NAME = 'index'

const turnTo = (to, access, next) => {
  if (canTurnTo(to.name, access, routes)) next() // 有权限，可访问
  else next({ replace: true, name: 'error_401' }) // 无权限，重定向到401页面
}

router.beforeEach((to, from, next) => {
  if (to.name === 'news' || to.path === '/news' ||
    to.name === 'schoolyard' || to.path === '/schoolyard' ||
    to.name === 'search_pages' || to.path === '/search_pages' ||
    to.name === 'videojump' || to.path === '/videojump/:id' ||
    to.name === 'teacher_homepage' || to.path === '/teacher_homepage/:id' ||
    to.name === 'partner' || to.path === '/partner' ||
    to.name === 'team' || to.path === '/team' ||
    to.name === 'index' || to.path === '/index' ||
    to.name === 'live_public' || to.path === '/live_public' ||
    to.name === 'live_online' || to.path === '/live_online' ||
    to.name === 'online_qrcode' || to.path === '/online_qrcode' ||
    to.name === 'entry' || to.path === '/entry' ||
    to.name === 'showIndex' || to.path === '/showIndex' ||
    to.name === 'mobileUserCenter' || to.path === '/mobileUserCenter' ||
    to.name === 'usersetting' || to.path === '/usersetting' ||
    to.name === 'mobileabout' || to.path === '/mobileabout' ||
    to.name === 'aboutwe' || to.path === '/aboutwe' ||
    to.name === 'agreement' || to.path === '/agreement' ||
    to.name === 'feedback' || to.path === '/feedback' ||
    to.name === 'studentLogins' || to.path === '/studentLogins' ||
    to.name === 'mobileLogin' || to.path === '/mobileLogin') {
    next()
  } else {
    iView.LoadingBar.start()
    const token = getToken()
    if (to.name === 'bind' || to.name === 'regist' || to.name === 'studentLogins' || to.name === 'sucess_tip') {
      next()
    } else if (!token && to.name !== LOGIN_PAGE_NAME) {
      // 未登录且要跳转的页面不是登录页(如果是正式环境，跳转到授权系统)
      // if (process.env.NODE_ENV === 'production') {
      //   location.href = portalDomain
      // } else {
      next({
        name: LOGIN_PAGE_NAME // 跳转到登录页
      })
      // }
    } else if (!token && to.name === LOGIN_PAGE_NAME) {
      // 未登陆且要跳转的页面是登录页
      next() // 跳转
    } else if (token && to.name === LOGIN_PAGE_NAME) {
      // 已登录且要跳转的页面是登录页
      next()
    } else {
      if (store.state.user.hasGetInfo) {
        turnTo(to, store.state.user.access, next)
      } else {
        store.dispatch('getUserInfo').then(user => {
          // 拉取用户信息，通过用户权限和跳转的页面的name来判断是否有权限访问;access必须是一个数组，如：['super_admin'] ['super_admin', 'admin']
          turnTo(to, user.access, next)
        }).catch(() => {
          setToken('')
          next({
            name: 'index'
          })
        })
      }
    }
  }
})

router.afterEach(to => {
  setTitle(to, router.app)
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

// 重新install后route错误版本导致点击router-link报错处理
// const original = Router.prototype.push
// Router.prototype.push = function push (location) {
//   return original.call(this, location)
//     .catch(err => err)
// }

export default router
