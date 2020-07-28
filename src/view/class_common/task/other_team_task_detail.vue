<template>
  <div>
  <h2>任务内容：</h2>
  <div v-html="student_task.task.content"></div>
  <h2>组长答案：</h2>
  <div class="answer-area">
    <div v-html="student_task.submit_content" ></div>
    <div v-if="student_task.file_url">
      文件: <a :href="student_task.file_url" >{{student_task.file_name}}</a>
    </div>
  </div>
  <div class="row-item" >
    <Row>
      <Col span="8" v-for="score_item in evaluation.score_option" :key="score_item.index">
        <span>分数：</span><input type="number" v-model="score_item.score"/>
      </Col>
    </Row>
    <Input type="textarea" v-model="evaluation.evaluation" style="margin-top:10px"></Input>
    <Button type="primary" style="margin-top: 15px;" @click="save" size="small">提交</Button>
  </div>

  <!-- FIXME: 组员答案不显示？ -->
  <!-- <h2>组员答案</h2>
  <div v-for="member in members" :key="member.id" >
    <p>{{member.student_name}}</p>
    <div v-html="member.submit_content"></div>
  </div> -->

  <Spin size="large" v-if="loading" fix></Spin>
  </div>
</template>
<script>
import { student_task_detail } from '@/api/student'
export default {
  props: {
    student_task_id: '',
    my_student_task_id: ''
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
      evaluation: {}
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
          this.members = data.members
          this.getEvaluation()
        }
        _this.loading = false
      })
    },
    getEvaluation () {
      let _this = this
      _this.loading = true
      _this.axios.request({
        url: '/index.php/Student/Task/getStudentTaskEvaluation',
        method: 'get',
        params: {
          my_student_task_id: _this.my_student_task_id, // 本组的student_task_id
          task_id: this.student_task.task.id,
          leader_id: this.student_task.student_id
        }
      }).then(res => {
        let data = res.data
        if (res.code === 200) {
          this.evaluation = data.evaluation
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
