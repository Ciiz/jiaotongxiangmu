<template>
  <div>
    <!-- <h2>课件评价</h2> -->
    <p class="no-data-tips" v-if="score_options.length === 0">还没设置评分选项...</p>
    <Row>
      <Col :span="8" v-for="item in score_options" :key="item.score_option_id">
        <Score
          :label="item.option_name"
          v-model="item.score"
        ></Score>
      </Col>
    </Row>
    <Button type="primary" @click="submit" :disabled="score_options.length === 0">提交</Button>
  </div>
</template>
<script>
export default {
  props: {
    student_courseware_id: ''
  },
  data () {
    return {
      score_options: []
    }
  },
  methods: {
    getData () {
      this.axios
        .request({
          method: 'get',
          url: 'index.php/Student/Courseware/getCoursewareEvaluation',
          params: {
            student_courseware_id: this.student_courseware_id
          }
        })
        .then(res => {
          if (res.code === 200) {
            this.score_options = res.data.evaluation.score_option
          }
        })
    },
    submit () {
      this.axios.request({
        method: 'post',
        url: 'index.php/Student/Courseware/saveEvaluation',
        data: {
          student_courseware_id: this.student_courseware_id,
          score_options: this.score_options
        }
      }).then(res => {
        if (res.code === 200) {
          this.$Message.success(res.message)
          this.$emit('success')
        }
      })
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
<style>
</style>
