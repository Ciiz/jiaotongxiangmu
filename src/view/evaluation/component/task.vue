<template>
  <Row style="background:#ffffff;display:flex;flex:1;padding:10px">
    <div class="courseware_list_table_parent">
      <Table
        class="courseware_list_table"
        size="large"
        :loading="loading"
        ref="selection"
        :columns="columns"
        :data="list"
      ></Table>
    </div>
    <Modal v-model="modal" :title="title" width="800" footer-hide :mask-closable='false'>
      <Evaluate :student_task_id="student_task_id" v-if="target === 'evaluate'"></Evaluate>
      <EvaluateM :student_task_id="student_task_id" v-if="target === 'evaluate_m'"></EvaluateM>
    </Modal>
  </Row>
</template>

<script>
import Evaluate from '@/view/class_common/task/evaluate'
import EvaluateM from '@/view/class_common/task/evaluate_m'
export default {
  components: {
    Evaluate,
    EvaluateM
  },
  data () {
    return {
      modal: false,
      student_task_id: '',
      title: '',
      target: '',
      loading: false,
      keyword: '',
      list: [],
      count: 0,
      columns: [
        {
          title: '课件',
          align: 'center',
          key: 'courseware_name',
          width: 180
        },
        {
          title: '任务名称',
          key: 'task_name',
          align: 'center',
          minWidth: 200
        },
        {
          title: '角色',
          key: 'type',
          align: 'center',
          width: 180,
          render: (h, params) => {
            let type = params.row.release_type
            let is_leader = params.row.is_team_leader
            return (
              <div>
                <span v-show={type === 1}>
                  <span class="blue-c" v-show={is_leader === 1}>组长</span>
                  <span v-show={is_leader === 0}>组员</span>
                </span>
                <span v-show={type === 2}>
                  个人
                </span>
              </div>
            )
          }
        },
        {
          title: '类型',
          key: 'type',
          align: 'center',
          width: 180,
          render: (h, params) => {
            let type = params.row.type
            return (
              <div>
                <span class="blut-tag" v-show={type === 1}>
                  课前
                </span>
                <span class="gereen-tag" v-show={type === 2}>
                  课中
                </span>
                <span class="orange-tag" v-show={type === 3}>
                  课后
                </span>
              </div>
            )
          }
        },
        {
          title: '评价',
          key: 'action',
          width: 230,
          align: 'center',
          render: (h, params) => {
            let row = params.row
            return (
              <div>
                <button
                  class="blueC-btn"
                  style="width:80px"
                  onClick={() => {
                    this.evaluateDetail(params.row)
                  }}
                  v-show={row.score_status === 1}
                >
                  查看
                </button>
                <span v-show={row.score_status === 0}>尚未评价</span>
              </div>
            )
          }
        },
        {
          title: '成绩',
          key: 'user_score',
          align: 'center',
          width: 180
        }
      ]
    }
  },
  watch: {
    courseId (n, o) {
      this.getData()
    }
  },
  computed: {
    courseId () {
      return this.$store.state.user.courseData.student_course_id
    }
  },
  methods: {
    getData () {
      if (!this.courseId) {
        return
      }
      let _this = this
      _this.loading = true
      _this.axios
        .request({
          url: '/index.php/Student/Task/getStudentTaskByCourse',
          method: 'get',
          params: {
            student_course_id: _this.courseId, // 课中
            keyword: this.keyword
          }
        })
        .then(res => {
          if (res.code === 200) {
            let data = res.data
            this.list = data.list
            this.count = data.count
          }
          _this.loading = false
        })
    },
    evaluateDetail (student_task) {
      switch (student_task.type) {
        case 2:
          this.open('evaluate_m', student_task.student_task_id, '任务评价详情 ')
          break
        default:
          this.open('evaluate', student_task.student_task_id, '任务评价详情 ')
      }
    },
    open (target, target_id, title) {
      this.modal = true
      this.target = target
      this.title = title
      this.student_task_id = target_id
    }
  },
  mounted () {
    this.getData()
  }
}
</script>

<style lang="less" scoped>
.btn-margin {
  margin-right: 10px;
}
</style>
