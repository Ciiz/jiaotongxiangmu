import axios from '@/libs/api.request'
export const get_task_team_list = (student_task_id) => {
  return axios.request({
    url: '/student/task/getTaskTeamList',
    params: { student_task_id },
    method: 'get'
  })
}
// export const course_chapter_class = (course_id) => {
//   return axios.request({
//     url: '/student/course/getChapterClassList',
//     params: { course_id },
//     method: 'get'
//   })
// }

export const course_show = (teacher_course_id) => {
  return axios.request({
    url: '/home/course/detail',
    params: { teacher_course_id },
    method: 'get'
  })
}

// ==================课程=========================
export const my_course = ({ page_no, page_size, searchType, sortType, sortOrder, keyword }) => { // 我的课程
  return axios.request({
    url: '/student/course/page',
    params: { page_no, page_size, searchType, sortType, sortOrder, keyword },
    method: 'get'
  })
}

export const get_course_notes = ({ page, page_size, search_type, keyword, sort_type, sort_order, teacher_course_id }) => {
  return axios.request({
    url: '/student/studentNotes/get_course_notes',
    params: { page, page_size, search_type, keyword, sort_type, sort_order, teacher_course_id },
    method: 'get'
  })
}

export const student_task_detail = (student_task_id) => {
  return axios.request({
    url: '/student/task/detail',
    params: { student_task_id },
    method: 'get'
  })
}
// 关注教师
export const student_follow = (teacher_id) => {
  return axios.request({
    method: 'get',
    url: '/Student/TeacherAttention/follow',
    params: {
      teacher_id
    }
  })
}
// 取消关注
export const student_unfollow = (id) => {
  return axios.request({
    url: '/Student/TeacherAttention/unfollow',
    params: { id },
    method: 'get'
  })
}
// 获取单个学生信息
export const student_message = () => {
  return axios.request({
    url: 'Student/User/getUserInfo',
    method: 'get',
    params: {
    }
  })
}
// 关注列表
export const student_attention = () => {
  return axios.request({
    url: '/Student/TeacherAttention/index',
    method: 'get',
    params: {
    }
  })
}
// 学生端获取单个教师信息
export const student_massges = (teacher_id) => {
  return axios.request({
    url: '/Student/User/teacher_message',
    method: 'get',
    params: {
      teacher_id
    }
  })
}
// 头部未读信息

export const student_unread = () => {
  return axios.request({
    url: '/index.php/Student/User/unread',
    method: 'get',
    params: {

    }

  })
}
// 教师列表
export const get_student_taecherList = (school_id) => {
  return axios.request({
    url: '/Student/User/teacher_list',
    method: 'get',
    params: {
      school_id
    }

  })
}