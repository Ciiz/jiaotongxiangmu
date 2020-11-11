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
// 老师的班级
export const get_mycalss = (teacher_course_id) => {
  return axios.request({
    url: '/teacher/Class/get_class_by_teacher_course',
    method: 'post',
    data: {
      teacher_course_id
    }
  })
}
// 老师获取学生详情
export const get_student = (student_id) => {
  return axios.request({
    url: '/Teacher/User/student_message',
    method: 'post',
    data: {
      student_id
    }
  })
}