<template>
  <div class="modal-content">
  <!-- <div class="row-item" > -->
  <h2>任务内容：</h2>
  <div v-html="student_task.task.content"></div>
  <h2>组长的提交内容：</h2>
  <div class="answer-area">
    <div v-html="evaluation.submit_content" ></div>
    <div v-if="student_task.file_url">
      文件: <a :href="student_task.file_url" target="blank" >----附件----</a>
    </div>
  </div>
  <!-- </div> -->
  <div class="row-item" >
    <h2>评价：</h2>
    <Input type="textarea" v-model="evaluation.evaluation" placeholder="对组长的评价..."></Input>
    <Row>
      <Col span="8" v-for="score_item in evaluation.score_option" :key="score_item.index">
        <Score
        :label="score_item.option_name"
        v-model="score_item.score"
        >
        </Score>
      </Col>
    </Row>
  </div>
  <div slot="footer">
    <Button type="primary" style="margin-top: 15px;" @click="save" size="small">提交</Button>
  </div>

  <Spin size="large" v-if="loading" fix></Spin>
  </div>
</template>
<script>
import { student_task_detail } from '@/api/student'
export default {
  props: {
    student_task_id: ''
  },
  watch: {
    student_task_id (new_id, old_id) {
      this.getData()
    }
  },
  data () {
    return {
      show_value: this.is_show,
      student_task: {
        submit_content: '',
        task: {}
      },
      members: [],
      loading: false,
      evaluation: {},
      member_to_leader: {}// 我对组长的评价
    }
  },
  computed: {
  },
  methods: {
    getData () {
      if (!this.student_task_id) {
        return
      }
      let _this = this
      _this.loading = true
      student_task_detail(_this.student_task_id).then(res => {
        let data = res.data
        if (res.code === 200) {
          this.student_task = data.student_task
          this.evaluation = data.member_to_leader
          // this.getEvaluation()
        }
        _this.loading = false
      })
    },
    save () {
      let arr = this.getScoreEvaluate([this.evaluation])
      this.axios.request({
        method: 'post',
        url: 'index.php/Student/Task/saveSingleEvaluation',
        data: {
          member_score_evaluate: arr,
          task_id: this.student_task.task.id
        }
      }).then(res => {
        if (res.code === 200) {
          this.$Message.success(res.message)
          this.$emit('success')
        }
      })
    },
    getScoreEvaluate (members) {
      let arr = []
      members.forEach(member => {
        let score_arr = []
        member.score_option.forEach(score_item => {
          score_arr.push({
            evaluated_id: member.student_id,
            score: score_item.score,
            score_option_id: score_item.id
          })
        })
        arr.push({
          evaluated_id: member.student_id,
          score_arr: score_arr,
          evaluation: member.evaluation,
          student_obj_id: member.id
        })
      })
      return arr
    }
  },
  created () {
    this.getData()
  }
}
</script>
<style>
</style>
