import axios from '@/libs/api.request'

export const login = ({ userName, password, user_type, school }) => {
  const data = {
    userName,
    password,
    user_type,
    school
  }
  return axios.request({
    url: '/home/login/user_login',
    data,
    method: 'post'
  })
}

export const getUserInfo = (token) => {
  return axios.request({
    url: '/index.php/Home/Login/getInfo',
    params: {
      token
    },
    method: 'get'
  })
}

export const logout = (token) => {
  return axios.request({
    url: '/home/login/logout',
    method: 'post'
  })
}

export const getUnreadCount = () => {
  return axios.request({
    url: '/index.php/Student/User/getUnreadNoticeNum',
    method: 'get'
  })
}

export const getUnreadCount_teacher = () => {
  return axios.request({
    url: '/index.php/Teacher/notice/index',
    method: 'post',
    data: {
      read: 0
    }
  })
}

export const getMessage = () => {
  return axios.request({
    url: 'message/init',
    method: 'get'
  })
}
