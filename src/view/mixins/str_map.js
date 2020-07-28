// 考试状态：0：未开始，1：考试中，2：已交卷，3：已批改 4:逾期
export const examStatusMap = {
  0: '未开始',
  1: '考试中',
  2: '已交卷',
  3: '已批改',
  4: '已逾期'
}
// 课前,课中,课后
export const BMATypeMap = {
  1: '课前',
  2: '课中',
  3: '课后'
}
export const BMAColorMap = {
  1: 'green',
  2: 'cyan',
  3: 'blue'
}
export const ReleaseMap = {
  0: '未发布',
  1: '已发布'
}
export const AuditMap = {
  0: '未提交审核',
  1: '已审核',
  2: '审核不通过',
  3: '待审核'
}

export const ReleaseColorMap = {
  0: 'red',
  1: 'green'
}
export const AuditColorMap = {
  0: 'warning',
  1: 'success',
  2: 'error',
  3: 'primary'
}

export const ExamStatusColorMap = {
  0: 'default',
  1: 'warning',
  2: 'success',
  3: 'primary',
  4: 'error'
}

export const submitStatusMap = {
  0: '未提交',
  1: '已提交'
}
export const submitStatusColorMap = {
  0: 'red',
  1: 'green'
}

export const scoreStatusMap = {
  0: '未评分',
  1: '已评分'
}
export const scoreStatusColorMap = {
  0: 'red',
  1: 'green'
}
// 评分人 1教师评，2组长评，3，学生评老师， 4组员评组长
export const evaluateTypeMap = {
  1: '教师评',
  2: '组长评组员',
  3: '学生评老师',
  4: '组员评组长'
}
