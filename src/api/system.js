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
// 培训班列表
export const get_Traininglist = () => {
  return axios.request({
    url: '/teacher/class/myClass',
    params: {

    },
    method: 'get'
  })
}
// 培训班安排
export const get_arrange = ({ class_id, class_task_id }) => {
  return axios.request({
    url: '/teacher/class/task_list',
    data: {
      class_id,
      class_task_id
    },
    method: 'post'
  })
}
