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
