// 公用Api
import axios from '@/libs/api.request'

// 教师端话题发送信息
export const sendDiscussTeacher = (topic_id, content) => {
  return axios.request({
    url: '/index.php/Teacher/Topic/topic_send',
    data: { topic_id, content },
    method: 'post'
  })
}

// 教师端个人发送信息
export const sendInfoTeacher = (target_id, content) => {
  return axios.request({
    url: '/index.php/Teacher/TaskQuestion/question_send',
    data: { target_id, content },
    method: 'post'
  })
}

// 学生端发送信息
export const sendInfoStudent = (target_id, content, statustype) => {
  return axios.request({
    url: '/index.php/Student/Task/question_send',
    data: { target_id, content, statustype },
    method: 'post'
  })
}

// 学生端多人讨论发送信息
export const sendInfoGroup = (taskgroup, content, student_task_id) => {
  return axios.request({
    url: '/index.php/Student/StudentTask/task_send',
    data: { taskgroup, content, student_task_id },
    method: 'post'
  })
}

// 学生端话题发送信息
export const sendDiscussStudent = (topic_id, content) => {
  return axios.request({
    url: '/index.php/Student/Topic/topic_send',
    data: { topic_id, content },
    method: 'post'
  })
}
