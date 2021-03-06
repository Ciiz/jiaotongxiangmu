import {
  login,
  logout,
  getUserInfo,


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
    userInfo: {

    },
    wx_id: '',
    userInfo_icon: '',
    messageList: [],
    courseData: {},
    bindType: 0,
    currentTab: '',
    schoolMesage: '',
    loginstatus: '', //登录状态
    userMessagess: false, //信息中心的状态
    searchResult: '', //搜索结果
    passwordUserId: '', //游客登陆的id

  },
  // 同步操作
  mutations: {

    setsearchResult (state, key) {
      state.searchResult = key
    },
    setpasswordUserId (state, id) {
      console.log(id);
      state.passwordUserId = id
    },
    setuserMessagess (state, status) {
      state.userMessagess = status
    },
    setLoginstatus (state, status) {
      state.loginstatus = status
    },
    setSschoolMesage (state, schoolMesage) {
      state.schoolMesage = schoolMesage
    },
    setAvatar (state, avatarPath) {
      state.avatarImgPath = avatarPath
    },
    setwxId (state, wx_id) {
      state.wx_id = wx_id
    },
    userInfo_icon (state, userInfo_icon) {
      console.log(userInfo_icon)
      state.userInfo.icon = userInfo_icon
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
  // 异步操作
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
          console.log(res);
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


    resetgetInfo ({ state, commit }) {
      getUserInfo().then(res => {
        commit('setUserInfo', res.data.userInfo)
      })
    }
  }
}
