// 公用Api
import axios from '@/libs/api.request'

// 获取学期开始时间
export const get_term_begin = (teacher_course_id, year, semester) => {
  return axios.request({
    url: '/home/course/getTermBegin',
    params: { teacher_course_id, semester, year },
    method: 'get'
  })
}
// 获取课时表
export const get_timetable = (teacher_course_id, year, semester) => {
  return axios.request({
    url: '/home/course/getTimetable',
    params: { teacher_course_id, semester, year },
    method: 'get'
  })
}

// 获取课时表
export const get_course_table = (teacher_course_id, year, semester, class_id = '') => {
  return axios.request({
    url: '/home/course/getCourseTable',
    params: { teacher_course_id, semester, year, class_id },
    method: 'get'
  })
}
// 教师推荐
export const get_recommend = () => {
  return axios.request({
    url: '/home/index/recommendTeacher',
    method: 'get'
    // params: {}
  })
}

// 课程推荐

export const get_Course = () => {
  return axios.request({
    url: '/home/index/recommendCourse',
    method: 'get'
    // params: {}
  })
}

export const get_banners = ({ path }) => {
  return axios.request({
    url: '/home/banner/page',
    params: { path },
    method: 'get'
  })
}
// 这个是没有登陆的时候
export const get_bannersIndex = ({ path }) => {
  return axios.request({
    url: '/home/index/getBanner',
    params: { path },
    method: 'get'
  })
}

export const get_school_course = ({ major, department, course_type, keyword, page_no, page_size, search_type, school_id }) => {
  return axios.request({
    url: '/home/course/getSchoolCourses',
    params: {
      major,
      department,
      course_type,
      keyword,
      page_no,
      page_size,
      search_type,
      school_id
    },
    method: 'get'
  })
}

export const get_departments = () => { // 获取院系
  return axios.request({
    url: '/home/course/getDepartment',
    method: 'get'
  })
}
export const get_majors = (department_id) => { // 本校的课程信息
  return axios.request({
    url: '/home/course/getMajor',
    method: 'get',
    params: {
      department_id
    }
  })
}

export const get_classes = (major_id) => { // 获取院系
  return axios.request({
    url: '/home/course/getClasses',
    method: 'get',
    params: {
      major_id
    }
  })
}

export const course_pano = (id) => {
  return axios.request({
    url: '/home/course/pano',
    params: {
      id
    },
    method: 'get'
  })
}

export const course_detail = (id) => {
  return axios.request({
    url: '/teacher/Course/detail',
    params: {
      id
    },
    method: 'get'
  })
}

export const update_study_progress = ({ chapter_class_id, study_time, video_time, status, teacher_course_id }) => {
  return axios.request({
    url: '/Student/Course/updateProgress',
    data: { chapter_class_id, study_time, video_time, status, teacher_course_id },
    method: 'post'
  })
}

export const saveErrorLogger = info => {
  return axios.request({
    url: '/home/other/save_error_logger',
    data: info,
    method: 'post'
  })
}

export const get_history_messages = ({ target_type, target, lastest_msg_id, page_size }) => {
  return axios.request({
    url: '/home/websocket/getHistoryMessages',
    params: {
      target_type,
      target,
      lastest_msg_id,
      page_size
    },
    method: 'get'
  })
}
export const get_history_messages_public = ({ target_type, target, lastest_msg_id, page_size }) => {
  return axios.request({
    url: '/home/websockets/getHistoryMessages',
    params: {
      target_type,
      target,
      lastest_msg_id,
      page_size
    },
    method: 'get'
  })
}

export const get_ppt_option = (group) => {
  return axios.request({
    url: '/home/websocket/getPptOption',
    params: {
      group
    },
    method: 'get'
  })
}
export const get_ppt_option_public = (group) => {
  return axios.request({
    url: '/home/websockets/getPptOption',
    params: {
      group
    },
    method: 'get'
  })
}
export const handle_ppt_option = ({ group, option_obj }) => {
  return axios.request({
    url: '/home/websocket/handlePptOption',
    data: {
      group, option_obj
    },
    method: 'post'
  })
}

export const course_chapter_class = (course_id, teacher_course_id) => {
  return axios.request({
    url: '/home/course/getChapterClassList',
    params: { course_id, teacher_course_id },
    method: 'get'
  })
}

export const chapter_class_show = (id) => {
  return axios.request({
    url: '/home/course/show_chapter_class',
    params: {
      id
    },
    method: 'get'
  })
}

// 首页视频播放
export const video_index = (id) => {
  return axios.request({
    url: '/home/index/playVideo',
    data: {
      id
    },
    method: 'post'
  })
}
// 首页的本校课程
export const myCourseList = ({ page, page_size, school_id }) => {
  return axios.request({
    method: 'get',
    url: '/index.php/home/course/isShowSchoolCourses',
    params: {
      page,
      page_size,
      school_id
    }
  })
}
// 首页的推荐课程
export const courselist = () => {
  return axios.request({
    method: 'get',
    url: '/index.php/home/index/recommendCourse',
    params: {}
  })
}
// 合作院校
export const getSchoolList = () => {
  return axios.request({
    method: 'get',
    url: '/index.php/Home/Index/getSchoolList',
    params: {}
  })
}
// 热门搜索
export const hotsearch = ({ page, page_size }) => {
  return axios.request({
    method: 'post',
    url: '/home/index/getHotSearch',
    data: {
      page,
      page_size
    }
  })
}
