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
// 获取单个教师信息
export const teacher_message = (teacher_id) => {
  return axios.request({
    url: '/Teacher/User/teacher_message',
    method: 'get',
    params: {
      teacher_id
    }
  })
}
// 获取教师个人信息
export const teacher_userinfo = () => {
  return axios.request({
    url: '/index.php/Teacher/User/info',
    method: 'get'

  })
}
// 修改个人信息
export const update_info = ({ mobile, alipay_account, sex, email, icon }) => {
  return axios.request({
    url: '/index.php/Teacher/User/update_info',
    method: 'post',
    data: {
      mobile,
      alipay_account,
      sex,
      email,
      icon
    }
  })
}
// 获取购买记录
export const get_record = ({ status, page, pagesize }) => {
  return axios.request({
    url: '/home/order/index',
    method: 'post',
    data: {
      status,
      page,
      pagesize
    }

  })
}
// 获取关注教师列表
export const get_TeacherAttention = () => {
  return axios.request({
    url: '/Teacher/TeacherAttention/index',
    method: 'get'
  })
}
// 取消教师关注  移除粉丝
export const unfollow_Attention = (id) => {
  return axios.request({
    url: '/Teacher/TeacherAttention/unfollow',
    method: 'get',
    params: {
      id
    }
  })
}
// 获取我关注的课程（教师、学生、校外人员通用）(喜欢)
export const getMyCourseAttention = ({ page, pagesize }) => {
  return axios.request({
    url: '/home/course/getMyCourseAttention',
    method: 'post',
    data: {
      page,
      pagesize
    }
  })
}
// 解除微信绑定
export const updateUserWechatId = (wx_id) => {
  return axios.request({
    url: '/home/wechat/updateUserWechatId',
    method: 'post',
    data: {
      wx_id
    }
  })
}
// 我的粉丝
export const loveMe = () => {
  return axios.request({
    url: '/teacher/TeacherAttention/loveMe',
    method: 'post'
  })
}
