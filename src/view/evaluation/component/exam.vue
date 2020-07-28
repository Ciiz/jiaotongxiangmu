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
    <Modal v-model="modal" :title="title" width="1200" footer-hide :mask-closable='false' class="new-modal">
      <Exam :student_exam_id="student_exam_id" :sty="3" v-if="target === 'evaluate'" @closeModal="closeModal"></Exam>
    </Modal>
  </Row>
</template>

<script>
import Exam from '@/view/class_common/exam/exam'
export default {
  computed: {
    courseId () {
      return this.$store.state.user.courseData.student_course_id
    }
  },
  components: {
    Exam
  },
  data () {
    return {
      modal: false,
      student_exam_id: '',
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
          title: '测试名称',
          align: 'center',
          key: 'exam_name',
          minWidth: 200
        },
        {
          title: '类型',
          align: 'center',
          key: 'type',
          minWidth: 200,
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
          align: 'center',
          key: '',
          minWidth: 200,
          render: (h, params) => {
            let row = params.row
            return (
              <div>
                <Tag color="default" v-show={row.score_status === 0}>
                  未评
                </Tag>
                <button
                  class="blueC-btn"
                  style="width:80px"
                  onClick={() => {
                    this.evaluateDetail(params.row)
                  }}
                  v-show={row.score_status === 1}
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
          width: 230,
          align: 'center'
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
          url: '/index.php/Student/Exam/getStudentExamByCourse',
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
    evaluateDetail (student_exam) {
      this.open('evaluate', student_exam.student_exam_id, '批改详情 ')
    },
    closeModal () {
      this.modal = false
      this.target = ''
    },
    open (target, target_id, title) {
      this.modal = true
      this.target = target
      this.title = title
      this.student_exam_id = target_id
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
