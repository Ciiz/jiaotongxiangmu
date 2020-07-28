import axios from '@/libs/api.request'

// 课程接口
export const course_save = (id, course) => {
  return axios.request({
    url: '/index.php/Teacher/Course/add',
    data: course,
    params: { id },
    method: 'post'
  })
}
export const course_show = (id, action_type = 0) => {
  return axios.request({
    url: '/index.php/Teacher/Course/info',
    params: {
      id, action_type
    },
    method: 'get'
  })
}

export const save_course_table = ({ teacher_course_id, course_table_data, year, semester }) => { // 保存课表
  return axios.request({
    url: '/teacher/timetable/save_course_table',
    data: {
      course_table_data,
      year,
      semester,
      teacher_course_id
    },
    method: 'post'
  })
}
export const save_timetable = ({ timetable_id, timetable_time_list }) => { // 保存课表
  return axios.request({
    url: '/teacher/TimetableTime/add',
    data: {
      timetable_id, timetable_time_list
    },
    method: 'post'
  })
}

export const get_class_by_teacher_course = (teacher_course_id) => { // 根据teacher_course_id获取班级,不传默认获取所有班级
  return axios.request({
    url: '/teacher/class/get_class_by_teacher_course',
    params: {
      teacher_course_id
    },
    method: 'get'
  })
}

export const get_teacher_course_list = () => { // 获取老师的所有课程
  return axios.request({
    url: '/teacher/course/get_teacher_course_list',
    params: {},
    method: 'get'
  })
}

export const course_chapter_class = (course_id, course_type) => {
  return axios.request({
    url: '/Teacher/Course/getChapterClassList',
    params: {
      course_id, course_type
    },
    method: 'get'
  })
}
export const chapter_class_delete = (id) => {
  return axios.request({
    url: '/index.php/Teacher/Course/delete_chapter_class',
    data: {
      id
    },
    method: 'post'
  })
}

export const save_chapter_class = ({ id, title, course_id, content, parent_id, file_type, file_url, sort }) => {
  return axios.request({
    url: '/index.php/Teacher/Course/save_chapter_class',
    data: {
      id, title, course_id, content, parent_id, file_type, file_url, sort
    },
    method: 'post'
  })
}

export const chapter_add = (chapter) => {
  const { chapter_id: id, course_id } = chapter
  return axios.request({
    url: '/index.php/Teacher/Chapter/add',
    params: {
      id, course_id
    },
    data: chapter,
    method: 'post'
  })
}
export const chapter_show = (id, course_id) => {
  return axios.request({
    url: '/index.php/Teacher/Chapter/info',
    params: {
      id, course_id
    },
    method: 'get'
  })
}

export const chapter_detail = (id, course_id) => {
  return axios.request({
    url: '/index.php/Teacher/Chapter/detail',
    params: {
      id, course_id
    },
    method: 'get'
  })
}

export const chapter_delete = (id) => {
  return axios.request({
    url: '/index.php/Teacher/Chapter/delete',
    data: {
      id
    },
    method: 'post'
  })
}

export const class_info = (id, chapter_id, course_id) => {
  return axios.request({
    url: '/index.php/Teacher/Class/info',
    params: {
      id, chapter_id, course_id
    },
    method: 'get'
  })
}
export const class_add = (class_info, course_id) => {
  let { id, chapter_id } = class_info
  return axios.request({
    url: '/index.php/Teacher/Class/add',
    params: {
      id, chapter_id, course_id
    },
    data: class_info,
    method: 'post'
  })
}

export const class_delete = (id) => {
  return axios.request({
    url: '/index.php/Teacher/Class/delete',
    data: {
      id
    },
    method: 'post'
  })
}

export const get_school_students = (data) => { // 获取学校学生
  const { department_id, major_id, class_id, page, page_size, keyword } = data
  return axios.request({
    url: '/teacher/course/get_school_students',
    method: 'get',
    params: {
      department_id, major_id, class_id, page, page_size, keyword
    }
  })
}
export const get_course_students = (data) => { // 获取课程学习的学生
  const { major_id, class_id, page, page_size, keyword, teacher_course_id } = data
  return axios.request({
    url: '/teacher/course/get_course_student',
    method: 'get',
    params: {
      major_id, class_id, page, page_size, keyword, teacher_course_id
    }
  })
}

export const course_bind_students = (student_id, teacher_course_id) => { // 批量绑定学生到课程
  return axios.request({
    url: '/teacher/course/bind_course_by_student',
    method: 'post',
    data: {
      student_id,
      teacher_course_id
    }
  })
}
export const course_unbind_students = (student_id, teacher_course_id) => { // 批量绑定学生到课程
  return axios.request({
    url: '/teacher/course/unbind_course_by_student',
    method: 'post',
    data: {
      student_id,
      teacher_course_id
    }
  })
}

export const student_course_score = (student_course_id) => {
  return axios.request({
    method: 'get',
    url: '/teacher/score/get_score_by_student',
    params: {
      student_course_id
    }
  })
}

// ============任务===================
export const task_release = (task_release_id) => { // 发布任务
  return axios.request({
    url: '/teacher/task/release',
    method: 'post',
    data: {
      task_release_id
    }
  })
}
export const task_un_release = (task_release_id) => { // 撤回任务
  return axios.request({
    url: '/teacher/task/un_release',
    method: 'post',
    data: {
      task_release_id
    }
  })
}
export const get_release_info_by_task = (task_id) => { // 根据任务id获取任务发布信息（选择任务那里用）
  return axios.request({
    url: '/teacher/task/get_release_info_by_task',
    method: 'post',
    data: {
      task_id
    }
  })
}
export const get_student_task_list = (task_release_id) => { // 获取student_task列表（更换组长那里用）
  return axios.request({
    url: '/teacher/task/get_student_task_list',
    method: 'get',
    params: {
      task_release_id
    }
  })
}
export const update_task_team = (student_task_list) => { // 修改分组
  return axios.request({
    url: '/teacher/task/update_task_team',
    method: 'post',
    data: {
      student_task_list
    }
  })
}
export const get_students_by_timetable_id = (timetable_id) => { // 根据timetable_id获取学生
  return axios.request({
    url: '/teacher/task/get_students_by_timetable_id',
    method: 'get',
    params: {
      timetable_id
    }
  })
}

export const get_task_release_list = ({ page, page_size, keyword, teacher_course_id, class_id, correct_status }) => { // 获取任务批改列表
  return axios.request({
    url: '/teacher/task/task_release_list',
    method: 'get',
    params: {
      page, page_size, keyword, teacher_course_id, class_id, correct_status
    }
  })
}

// ======================测试===================
export const get_question_bank_list = (teacher_course_id) => { //
  return axios.request({
    url: '/teacher/QuestionBank/index',
    method: 'get',
    params: {
      tcid: teacher_course_id
    }
  })
}
export const get_question_bank = (id) => { //
  return axios.request({
    url: '/teacher/QuestionBank/get_question_bank',
    method: 'get',
    params: {
      id
    }
  })
}
export const save_question_bank = (question_bank) => { //
  const { id, teacher_course_id, score, content, answer, question_type, option } = question_bank
  return axios.request({
    url: '/teacher/QuestionBank/save',
    method: 'post',
    data: {
      id, teacher_course_id, score, content, answer, question_type, option
    }
  })
}
export const delete_question_bank = (id) => { //
  return axios.request({
    url: '/teacher/QuestionBank/delete',
    method: 'post',
    data: {
      ids: id
    }
  })
}
export const get_release_detail = (exam_release_id) => { // 获取考试发布详情
  return axios.request({
    url: '/teacher/examination/release_detail',
    method: 'get',
    params: {
      exam_release_id
    }
  })
}

export const save_examination_release = ({ id, start_time, end_time, timetable_id, exam, obj, subj, editable, auto_save, is_auto_release }) => { //
  return axios.request({
    url: '/teacher/examination/save',
    method: 'post',
    data: {
      id, start_time, end_time, timetable_id, exam, obj, subj, editable, auto_save, is_auto_release
    }
  })
}

export const get_exam_release_list = ({ page, page_size, keyword, teacher_course_id, class_id, correct_status }) => { // 获取作业批改列表
  return axios.request({
    url: '/teacher/examination/examination_release_list',
    method: 'get',
    params: {
      page, page_size, keyword, teacher_course_id, class_id, correct_status
    }
  })
}

// ====================作业=====================
export const get_homework_release_list = ({ page, page_size, keyword, teacher_course_id, class_id, correct_status }) => { // 获取作业批改列表
  return axios.request({
    url: '/teacher/homework/homework_release_list',
    method: 'get',
    params: {
      page, page_size, keyword, teacher_course_id, class_id, correct_status
    }
  })
}

// ===========task,homework,exam公用=====
export const update_correct_status = ({ type, release_id, correct_status }) => { //
  return axios.request({
    url: '/teacher/common/updateCorrectStatus',
    method: 'post',
    data: {
      type, release_id, correct_status
    }
  })
}

// =======================考勤========================
export const generate_attendance = ({ teacher_course_id, class_ids, year, semester, week, day, class_no }) => { // 生成考勤记录，并获取考勤记录对应的学生考勤信息
  return axios.request({
    url: '/teacher/attendance/generate_attendance',
    method: 'get',
    params: {
      teacher_course_id, class_ids, year, semester, week, day, class_no
    }
  })
}
export const update_attendance = ({ id, update_data }) => { // 生成考勤记录，并获取考勤记录对应的学生考勤信息
  return axios.request({
    url: '/teacher/attendance/update_attendance',
    method: 'post',
    data: {
      id, update_data
    }
  })
}
export const update_attend_record = ({ status, id }) => { // 更新学生考勤记录
  return axios.request({
    url: '/teacher/attendance/update_attendance_record',
    method: 'post',
    data: {
      id, status
    }
  })
}
export const get_attendance_list = ({ page, page_size, teacher_course_id, time, class_id }) => { // 获取考勤列表
  return axios.request({
    url: '/teacher/attendance/get_attendance_list',
    method: 'get',
    params: {
      page, page_size, teacher_course_id, time, class_id
    }
  })
}
export const get_student_attendance_records = ({ teacher_course_id, time, class_id }) => { // 获取班级学生考勤记录（统计）
  return axios.request({
    url: '/teacher/attendance/get_student_attendance_records',
    method: 'get',
    params: {
      teacher_course_id, time, class_id
    }
  })
}

export const get_attendance_records = (attendance_id) => { // 获取班级学生考勤记录
  return axios.request({
    url: '/teacher/attendance/get_attendance_records',
    method: 'get',
    params: {
      attendance_id
    }
  })
}
export const handle_update_early_leave = (attendance_ids) => { // 获取班级学生考勤记录
  return axios.request({
    url: '/teacher/attendance/handle_update_early_leave',
    method: 'post',
    data: {
      attendance_ids
    }
  })
}
export const reset_attendance = (attendance_ids) => { // 重置考勤
  return axios.request({
    url: '/teacher/attendance/reset_attendance',
    method: 'post',
    data: {
      attendance_ids
    }
  })
}
export const get_address_list = () => { // 获取考勤地址列表
  return axios.request({
    url: '/teacher/attendance/get_address_list',
    method: 'get'
  })
}
export const delete_address = (id) => { // 删除
  return axios.request({
    url: '/teacher/attendance/delete_address',
    method: 'post',
    data: { id }
  })
}
export const get_address = (id) => { // 获取考勤地址详情
  return axios.request({
    url: '/teacher/attendance/get_address',
    method: 'get',
    params: { id }
  })
}
export const save_address = ({ id, lng, lat, address }) => { // 获取考勤地址详情
  return axios.request({
    url: '/teacher/attendance/save_address',
    method: 'post',
    data: { id, lng, lat, address }
  })
}
