<template>
  <Row class="modal-content">
    <h2 class="label">作业内容:</h2>
    <div v-html="student_homework.homework.homework_content"></div>
    <h2 class="label">我的作答：</h2>
    <div class="text-container" >
       <div v-html="student_homework.content"></div>
       <div v-if="student_homework.file_url">
          文件:<a :href="student_homework.file_url" target="blank">----附件----</a>
       </div>
    </div>

    <h2 class="label">教师的评价：</h2>
    <div class="text-container">{{teacher_evaluation.evaluation}}</div>
    <Col span="8" v-for="score_item in teacher_evaluation.score_option" :key="score_item.index">
        <Score
        :label="score_item.option_name"
        :disabled="true"
        v-model="score_item.score"
        >
        </Score>
    </Col>
  <Spin size="large" v-if="loading" fix></Spin>
  </Row>
</template>
<script>
export default {
  props: {
    student_homework_id: ''
  },
  data () {
    return {
      student_homework: {
        homework: {}
      },
      loading: false,
      evaluations: [],
      teacher_evaluation: {}
    }
  },
  computed: {
  },
  watch: {
    student_homework_id (newVal, oldVal) {
      this.getHomeworkInfo()
      this.getHomeworkEvaluate()
    }
  },
  methods: {
    getHomeworkInfo () { // 本组对其他小组的评价
      let _this = this
      _this.loading = true
      _this.axios
        .request({
          method: 'get',
          url: `/index.php/Student/Homework/getStudentHomework`,
          params: {
            student_homework_id: _this.student_homework_id
          }
        })
        .then(res => {
          _this.loading = false
          let data = res.data
          if (res.code === 200) {
            this.student_homework = data.student_homework
          }
        })
    },
    getHomeworkEvaluate () {
      let _this = this
      _this.axios
        .request({
          method: 'get',
          url: `/index.php/Student/Homework/getHomeworkEvaluate`,
          params: {
            student_homework_id: _this.student_homework_id
          }
        })
        .then(res => {
          let data = res.data
          if (res.code === 200) {
            this.teacher_evaluation = data.evaluation
          }
        })
    }
  },
  mounted () {
    this.getHomeworkInfo()
    this.getHomeworkEvaluate()
  }
}
</script>
<style type="text/css" lang="less" scoped>
.text-container{
  background: #f0f0f0;
  padding: 10px;
  border: 1px solid #ccc;
}
.label{
  margin-bottom: 10px;
  margin-top: 20px;
}
.comment-item{
  margin-bottom: 15px;
}
</style>
