<template>
    <Row>
        <div class="">
            <h3>课程 {{course_name}} 的考核与评价</h3>
            <p style="padding:10px 0;letter-spacing:2px;">{{student_name}}的成绩：</p>
        </div>
        <Table stripe  size="small"  ref="selection" :columns="columns" :loading="loading" :data="data_list" :height="$store.state.app.tableHeight">
        </Table>
        <div v-if="isshowteameva_watch">
          <Modal v-model="isshowteameva_watch" width="50" title="看评价"  footer-hide >
              <addwatcheva-task :watchEvaluationid="watchEvaluationid"></addwatcheva-task>
          </Modal>
        </div>
        <div v-if="isshoweva_homework">
          <Modal v-model="isshoweva_homework" width="50" title="看评价"  footer-hide >
              <addwatcheva-homework :evaid="watchEvaluationid"></addwatcheva-homework>
          </Modal>
        </div>
        <div v-if="isshoweva_test">
          <Modal v-model="isshoweva_test" width="50" title="看评价"  footer-hide >
              <addwatcheva-test :correctid="watchEvaluationid" isInfo='yes'></addwatcheva-test>
          </Modal>
        </div>
    </Row>
</template>
<script>
import Poptip from '@/view/publiccomponent_teacher/course/sectionpoptip.vue'
import addwatchevaTask from '@/view/publiccomponent_teacher/task/addwatcheva.vue'
import addwatchevaHomework from '@/view/publiccomponent_teacher/homework/addwatchEva_homeworklist.vue'
import addwatchevaTest from '@/view/publiccomponent_teacher/test/addtestcorrect_testscore.vue'
export default {
  props: {
    course_name: { },
    assessData: {}
  },
  components: {
    Poptip,
    addwatchevaTask,
    addwatchevaHomework,
    addwatchevaTest
  },
  data () {
    return {
      // 测试看评价
      isshoweva_test: false,
      // 作业看评价
      isshoweva_homework: false,
      // 任务评价
      isshowteameva_watch: false,
      watchEvaluationid: 0,
      student_name: '',
      data_list: [],
      loading: false,
      columns: [
        {
          title: '课件',
          align: 'left',
          render: (h, params) => {
            return (
              <div>课时{params.row.sort} - {params.row.courseware_name}</div>
            )
          }
        },
        {
          title: '课前',
          align: 'center',
          render: (h, params) => {
            return h(Poptip, {
              props: {
                score: params.row.score.before_score,
                id: params.row.ids.before,
                had_homework: false
              },
              on: {
                task_id: (val) => {
                  this.task_id(val)
                },
                test_id: (val) => {
                  this.test_id(val)
                }
              }
            })
          }
        },
        {
          title: '课中',
          align: 'center',
          render: (h, params) => {
            return h(Poptip, {
              props: {
                score: params.row.score.in_score,
                id: params.row.ids.in,
                had_homework: false
              },
              on: {
                task_id: (val) => {
                  this.task_id(val)
                },
                test_id: (val) => {
                  this.test_id(val)
                }
              }
            })
          }
        },
        {
          title: '课后',
          align: 'center',
          render: (h, params) => {
            return h(Poptip, {
              props: {
                score: params.row.score.after_score,
                id: params.row.ids.after,
                had_homework: true
              },
              on: {
                task_id: (val) => {
                  this.task_id(val)
                },
                test_id: (val) => {
                  this.test_id(val)
                },
                homework_id: (val) => {
                  this.homework_id(val)
                }
              }
            })
          }
        },
        {
          title: '总分',
          align: 'center',
          render: (h, params) => {
            return (
              <div>{params.row.score.total_score.toFixed(2)}</div>
            )
          }
        }
      ]
    }
  },
  created () {
    this.getInfo()
  },
  methods: {
    task_id (val) {
      this.watchEvaluationid = val
      this.isshowteameva_watch = true
    },
    test_id (val) {
      this.watchEvaluationid = val
      this.isshoweva_test = true
    },
    homework_id (val) {
      this.watchEvaluationid = val
      this.isshoweva_homework = true
    },
    getInfo () {
      this.loading = true
      this.axios.request({
        method: 'get',
        url: '/index.php/Teacher/Score/get_score_by_student',
        params: {
          student_id: this.assessData.student_id,
          class_id: this.assessData.class_id,
          teacher_course_id: this.assessData.teacher_course_id
        }
      }).then(res => {
        if (res.code === 200) {
          this.loading = false
          this.student_name = res.data.name
          let courseware = res.data.courseware
          for (let i in courseware) {
            if (isNaN(i) === false) {
              this.data_list.push(courseware[i])
            }
          }
        }
      })
    }
  },
  mounted () {
  }
}
</script>
