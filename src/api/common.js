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
      id,
    },
    method: 'post'
  })
}
export const playVideoTime = (id, study_time) => {
  return axios.request({
    url: 'home/index/playVideoTime',
    data: {
      id,
      study_time
    },
    method: 'post'
  })
}
// 首页的本校课程
export const myCourseList = (school_id) => {
  return axios.request({
    method: 'get',
    url: '/index.php/home/course/isShowSchoolCourses',
    params: {
      school_id
    }
  })
}
// 不同学校的课程
export const schoolCourseList = ({ schoolId, major_id }) => {
  return axios.request({
    method: 'get',
    url: '/home/index/isCheckSchoolCourses',
    params: {
      schoolId,
      major_id
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
// 获取推荐教师
export const teacher_recommend = () => {
  return axios.request({
    method: 'get',
    url: '/index.php/home/index/recommendTeacher',
    params: {}
  })
}
// 合作院校
export const getSchoolList = ({ page, page_size }) => {
  return axios.request({
    method: 'get',
    url: '/index.php/Home/Index/getSchoolList',
    params: {
      page,
      page_size
    }
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

// 关注教师
export const get_follow = (teacher_id) => {
  return axios.request({
    method: 'get',
    url: '/Teacher/TeacherAttention/follow',
    params: {
      teacher_id
    }
  })
}
// 取消关注
export const get_unfollow = (teacher_id) => {
  return axios.request({
    method: 'get',
    url: '/Teacher/TeacherAttention/unfollow',
    params: {
      teacher_id
    }
  })
}
// 观看记录
export const get_lookHistory = () => {
  return axios.request({
    method: 'post',
    url: '/home/course/showMyViewRecord',
    data: {
    }
  })
}
// 查看教师信息
export const getTearher_Massgess = (teacher_id) => {
  return axios.request({
    method: 'get',
    url: '/Teacher/User/teacher_message',
    params: {
      teacher_id
    }
  })
}
// 首页搜索
export const get_search = (keyword) => {
  return axios.request({
    method: 'get',
    url: '/index.php/home/index/getSearch',
    params: {
      keyword
    }
  })
}
// 未登录的教师列表
export const taecherList_nologin = (school_id) => {
  return axios.request({
    url: 'home/index/teacher_list',
    method: 'post',
    data: {
      school_id
    }

  })
}
// 未读通知数
export const teacher_unread = () => {
  return axios.request({
    url: '/index.php/Teacher/Notice/unread',
    method: 'get',
    params: {
    }
  })
}
// 游客注册
export const tourist_register = ({ account, password, user_type, email }) => {
  return axios.request({
    url: '/home/index/register/',
    method: 'get',
    params: {
      account,
      password,
      user_type,
      email
    }
  })
}
