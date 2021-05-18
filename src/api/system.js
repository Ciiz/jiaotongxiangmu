import axios from '@/libs/api.request'
// 课程列表
export const getCourse = ({ search_word, page, pagesize }) => {
  return axios.request({
    url: '/index.php/Teacher/Course/index',
    data: {
      search_word, page, pagesize
    },
    method: 'post'
  })
}
// 获取指定的课程详情
export const getCourseDetial = (course_id) => {
  return axios.request({
    url: '/Teacher/Course/get_course',
    data: {
      course_id
    },
    method: 'post'
  })
}
// 查看课程内容
export const get_Coursedetails = (course_id) => {
  return axios.request({
    url: '/Teacher/Course/detail',
    data: {
      course_id
    },
    method: 'post'
  })
}