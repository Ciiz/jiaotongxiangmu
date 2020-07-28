import {
  login,
  logout,
  getUserInfo,
  getUnreadCount,
  getUnreadCount_teacher
} from '@/api/user'
import { setToken, getToken } from '@/libs/util'

export default {
  state: {
    userName: '',
    userId: '',
    avatarImgPath: '',
    token: getToken(),
    access: '',
    hasGetInfo: false,
    unreadCount: 0,
    unreadCount_teacher: 0, // 教师未读消息
    coursework_step: true, // 教师->课件管理新手引导 true：首次进入显示, false：不显示
    userInfo: {},
    messageList: [],
    courseData: [],
    bindType: 0,
    currentTab: ''
  },
  mutations: {
    setAvatar (state, avatarPath) {
      state.avatarImgPath = avatarPath
    },
    setUserId (state, id) {
      state.userId = id
    },
    setUserName (state, name) {
      state.userName = name
    },
    setUserInfo (state, userInfo) {
      state.userInfo = userInfo
    },
    setAccess (state, access) {
      state.access = access
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    },
    setHasGetInfo (state, status) {
      state.hasGetInfo = status
    },
    setMessageCount (state, count) {
      state.unreadCount = count
    },
    setUnreadMessage_Teacher (state, count) {
      state.unreadCount_teacher = count
    },
    setcourseware_step (state, count) {
      state.coursework_step = count
    },
    setcourseData (state, count) {
      state.courseData = count
    },
    setbindType (state, count) {
      state.bindType = count
    },
    setcurrentTab (state, count) {
      state.currentTab = count
    }
  },
  getters: {
  },
  actions: {
    // 登录
    handleLogin ({ commit }, { userName, password, user_type, school }) {
      userName = userName.trim()
      return new Promise((resolve, reject) => {
        login({
          userName,
          password,
          user_type,
          school
        }).then(res => {
          if (res.code === 200) {
            const data = res.data
            commit('setToken', data.token)
            resolve()
          } else {
            reject(res.message)
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('setToken', '')
          commit('setAccess', [])
          resolve()
        }).catch(err => {
          reject(err)
        })
        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
      })
    },
    // 获取用户相关信息
    getUserInfo ({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          getUserInfo(state.token).then(res => {
            let data = res.data.userInfo
            data.access = data.userType === 1 ? ['teacher'] : ['student']
            commit('setAvatar', data.icon)
            commit('setUserName', data.name)
            commit('setUserInfo', data)
            commit('setUserId', data.userId)
            commit('setAccess', data.access)
            commit('setHasGetInfo', true)
            resolve(data)
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    },
    // 此方法用来获取未读消息条数，接口只返回数值，不返回消息列表
    getUnreadMessageCount ({ state, commit }) {
      getUnreadCount().then(res => {
        const { data } = res
        commit('setMessageCount', data.num)
      })
    },
    // 教师unread
    sendunread ({ state, commit }) {
      getUnreadCount_teacher().then(res => {
        const num = res.data.notice_list.length
        commit('setUnreadMessage_Teacher', num)
      })
    },
    resetgetInfo ({ state, commit }) {
      getUserInfo().then(res => {
        commit('setUserInfo', res.data.userInfo)
      })
    }
  }
}
