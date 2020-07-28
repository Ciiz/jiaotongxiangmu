<template>
  <Row style="background:#ffffff;display:flex;flex:1;padding:10px">
    <div class="courseware_list_table_parent">
      <Table
        size="large"
        class="courseware_list_table"
        :loading="loading"
        ref="selection"
        :columns="columns"
        :data="list"
      ></Table>
    </div>
    <Modal v-model="modal" :title="title" width="800" footer-hide :mask-closable='false'>
      <Evaluate :student_homework_id="student_homework_id" v-if="target === 'evaluate'"></Evaluate>
    </Modal>
  </Row>
</template>

<script>
import Evaluate from '@/view/class_common/homework/evaluate'
export default {
  computed: {
    courseId () {
      return this.$store.state.user.courseData.student_course_id
    }
  },
  components: {
    Evaluate
  },
  data () {
    return {
      modal: false,
      student_homework_id: '',
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
          width: 150
        },
        {
          title: '作业标题',
          align: 'center',
          key: 'homework_name',
          minWidth: 200
        },
        {
          title: '状态',
          align: 'center',
          key: 'submit_status',
          minWidth: 150,
          render: (h, params) => {
            let score_status = params.row.score_status
            return (
              <div>
                <span class="gereen-tag" v-show={score_status === 1}>
                  已评
                </span>
                <span class="orange-tag" v-show={score_status === 0}>
                  未评
                </span>
              </div>
            )
          }
        },
        {
          title: '操作',
          key: 'action',
          minWidth: 230,
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
                  v-show={row.score_status}
                >
                  看评价
                </button>
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
  methods: {
    getData () {
      if (!this.courseId) {
        return
      }
      let _this = this
      _this.loading = true
      _this.axios
        .request({
          url: '/index.php/Student/Homework/getStudentHomeworkByCourse',
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
      switch (student_task.task_type) {
        case 2:
          this.open('evaluate_m', student_task.student_homework_id, '评价详情 ')
          break
        default:
          this.open('evaluate', student_task.student_homework_id, '评价详情 ')
      }
    },
    open (target, target_id, title) {
      this.modal = true
      this.target = target
      this.title = title
      this.student_homework_id = target_id
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
