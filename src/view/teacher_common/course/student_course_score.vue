<template>
<div>
  <Table size="small" :loading="loading" ref="selection" :columns="columns" :data="list" :height="$store.state.app.tableHeight"></Table>
  <Modal v-model="modal" :title="title" :width="modal_width" footer-hide>
    <StudentTaskEvaluate :student_task_id="target_id" v-if="target === 'student_task'"></StudentTaskEvaluate>
    <StudentHomeworkEvaluate :student_homework_id="target_id" v-if="target === 'student_homework'"></StudentHomeworkEvaluate>
    <StudentExamEvaluate :student_exam_id="target_id" v-if="target === 'student_exam'"></StudentExamEvaluate>
  </Modal>
</div>
</template>

<script>
import { student_course_score } from '@/api/data'
import modal_mixin from '@/view/mixins/modal_mixin'
import StudentTaskEvaluate from '@/view/teacher_common/task/student_task_evaluate'
import StudentHomeworkEvaluate from '@/view/teacher_common/homework/student_homework_evaluate'
import StudentExamEvaluate from '@/view/teacher_common/exam/student_exam_evaluate'

export default{
  props: ['student_course_id'],
  mixins: [modal_mixin],
  components: {
    StudentTaskEvaluate, StudentExamEvaluate, StudentHomeworkEvaluate
  },
  data () {
    return {
      list: [],
      loading: false,
      columns: [
        {
          key: 'sort',
          title: '课件名称',
          width: 180,
          render: (h, params) => {
            return (
              <div>
                {params.row.courseware_name}
              </div>
            )
          }
        },
        {
          key: 'before',
          title: '课前',
          width: 200,
          className: 'align-top',
          render: (h, params) => {
            let row = params.row
            let data = row.ids.before
            return (
              <div class="align-top">
                <Tag color="green">{row.score.before_score}</Tag>
                <div>
                  <b>任务:</b>
                  {
                    data.task_ids.map((student_task_id, index) => {
                      return (<span class="obj-item" onClick={() => { this.open('student_task', student_task_id, `学生任务${data.task_name[index]}`) }}>{data.task_name[index]}</span>)
                    })
                  }
                </div>
                <div>
                  <b>作业:</b>
                  {
                    data.work_ids.map((student_homework_id, index) => {
                      return (<span class="obj-item" onClick={() => { this.open('student_homework', student_homework_id, `学生作业${data.work_name[index]}`) }}>{data.work_name[index]}</span>)
                    })
                  }
                </div>
                <div>
                  <b>测试:</b>
                  {
                    data.exam_ids.map((student_exam_id, index) => {
                      return (<span class="obj-item" onClick={() => { this.open('student_exam', student_exam_id, `学生测试${data.exam_name[index]}`) }}>{data.exam_name[index]}</span>)
                    })
                  }
                </div>

              </div>
            )
          }
        },
        {
          key: 'in',
          title: '课中',
          width: 200,
          className: 'align-top',
          render: (h, params) => {
            let row = params.row
            let data = row.ids.in
            return (
              <div class="align-top">
                <Tag color="green">{row.score.in_score}</Tag>
                <div>
                  <b>任务:</b>
                  {
                    data.task_ids.map((student_task_id, index) => {
                      return (<span class="obj-item" onClick={() => { this.open('student_task', student_task_id, `学生任务${data.task_name[index]}`) }}>{data.task_name[index]}</span>)
                    })
                  }
                </div>
                <div>
                  <b>作业:</b>
                  {
                    data.work_ids.map((student_homework_id, index) => {
                      return (<span class="obj-item" onClick={() => { this.open('student_homework', student_homework_id, `学生作业${data.work_name[index]}`) }}>{data.work_name[index]}</span>)
                    })
                  }
                </div>
                <div>
                  <b>测试:</b>
                  {
                    data.exam_ids.map((student_exam_id, index) => {
                      return (<span class="obj-item" onClick={() => { this.open('student_exam', student_exam_id, `学生测试${data.exam_name[index]}`) }}>{data.exam_name[index]}</span>)
                    })
                  }
                </div>

              </div>
            )
          }
        },
        {
          key: 'after',
          title: '课后',
          width: 200,
          className: 'align-top',
          render: (h, params) => {
            let row = params.row
            let data = row.ids.after
            return (
              <div class="align-top">
                <Tag color="green">{row.score.after_score}</Tag>
                <div>
                  <b>任务:</b>
                  {
                    data.task_ids.map((student_task_id, index) => {
                      return (<span class="obj-item" onClick={() => { this.open('student_task', student_task_id, `学生任务${data.task_name[index]}`) }}>{data.task_name[index]}</span>)
                    })
                  }
                </div>
                <div>
                  <b>作业:</b>
                  {
                    data.work_ids.map((student_homework_id, index) => {
                      return (<span class="obj-item" onClick={() => { this.open('student_homework', student_homework_id, `学生作业${data.work_name[index]}`) }}>{data.work_name[index]}</span>)
                    })
                  }
                </div>
                <div>
                  <b>测试:</b>
                  {
                    data.exam_ids.map((student_exam_id, index) => {
                      return (<span class="obj-item" onClick={() => { this.open('student_exam', student_exam_id, `学生测试${data.exam_name[index]}`) }}>{data.exam_name[index]}</span>)
                    })
                  }
                </div>

              </div>
            )
          }
        },
        {
          key: 'total_score',
          title: '总分',
          minWidth: 200,
          render (h, params) {
            return <Tag color="magenta">{params.row.score.total_score}</Tag>
          }
        }
      ]
    }
  },
  watch: {
    student_course_id (n, o) {
      this.getData()
    }
  },
  methods: {
    getData () {
      this.loading = true
      student_course_score(this.student_course_id).then(res => {
        if (res.code === 200) {
          this.list = Object.values(res.data.courseware)
        }
        this.loading = false
      })
    }
  },
  mounted () {
    this.getData()
  }
}
</script>

<style lang="less">
.obj-item{
  cursor:pointer;
  color: #666;
  margin: 0px 5px;
  border: 1px dotted #000;
  &:hover{
    color: green;
  }
}
.ivu-table  {
  .align-top{
    .ivu-table-cell{
        height: 100%!important;
      }
  }
}
</style>
