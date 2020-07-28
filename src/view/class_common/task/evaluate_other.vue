<template>
  <Row class="tab-panel">
    <p v-if="evaluations.length === 0" class="no-data-tips">暂时没有数据....</p>
    <h2>教师的评价：</h2>
    <div class="row-item">
    <div class="text-container">{{teacher_evaluation.evaluation}}</div>
    <Row>
      <Col span="8" v-for="score_item in teacher_evaluation.score_option" :key="score_item.index">
          <Score
          :label="score_item.option_name"
          :disabled="true"
          v-model="score_item.score"
          >
          </Score>
      </Col>
    </Row>
    </div>

    <h2>对本小组的评价:</h2>
    <div class="comment-item row-item" v-for="item in evaluations" :key="item.id">
      <h4>小组{{item.team_id}}:</h4>
      <Row>
        <Col span="8" v-for="score_item in item.score_option" :key="score_item.index">
          <Score
          :label="score_item.option_name"
          :disabled="true"
          :value="score_item.score"
          @on-change="(value)=>{score_item.score=value;}"
          >
          </Score>
        </Col>
      </Row>
      <div class="text-container">{{item.evaluation}}</div>
    </div>
  <Spin size="large" v-if="loading" fix></Spin>
  </Row>
</template>
<script>
export default {
  props: {
    student_task_id: {
      required: true
    }
  },
  data () {
    return {
      student_task: {
        task: {}
      },
      data: {},
      loading: false,
      evaluations: [],
      teacher_evaluation: {}
    }
  },
  computed: {
  },
  watch: {
    student_task_id (newVal, oldVal) {
      this.getTaskInfo(newVal)
    }
  },
  methods: {
    getTaskInfo (student_task_id) { // 本组对其他小组的评价
      if (!student_task_id) {
        return
      }
      let _this = this
      _this.loading = true
      _this.axios
        .request({
          method: 'get',
          url: `/index.php/Student/Task/getClassMiddleTaskEvaluation`,
          params: {
            student_task_id: _this.student_task_id,
            type: 'oteam_to_team'
          }
        })
        .then(res => {
          _this.loading = false
          let data = res.data
          if (res.code === 200) {
            this.student_task = data.student_task
            this.evaluations = data.evaluations
            this.teacher_evaluation = data.teacher_evaluation
            this.data = data
          }
        })
    }
  },
  mounted () {
    this.getTaskInfo(this.student_task_id)
  }
}
</script>
<style type="text/css" lang="less" scoped>
.text-container{
  background: #f0f0f0;
  padding: 10px;
  border: 1px solid #ccc;
}
.comment-item{
  margin-bottom: 15px;
}
.tab-panel{
  padding: 10px;
}
</style>
