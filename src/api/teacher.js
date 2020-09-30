import axios from '@/libs/api.request'
// 教师列表
export const get_taecherList = (school_id) => {
  return axios.request({
    url: '/Teacher/User/teacher_list',
    method: 'post',
    data: {
      school_id
    }

  })
}
// 教师的个人信息
export const get_taechermassge = (teacher_id) => {
  return axios.request({
    url: '/Teacher/User/teacher_message',
    method: 'get',
    params: {
      teacher_id
    }

  })
}
