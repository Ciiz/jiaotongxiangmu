<template>
  <div class="m-evaluateMembers flex-contain">
    <mt-header title="评价组员" style="border-bottom: 1px solid #E5E5E5">
      <router-link to slot="left">
        <mt-button icon="back" @click="back"></mt-button>
      </router-link>
    </mt-header>
    <div class="m-evaluateMembers-contain hideScroll">
      <div v-for="member in members" :key="member.id" class="m-evaluateMembers-item">
        <div class="m-evaluateMembers-item-h">
          <img :src="member.icon"/>
          <span style="flex:1">
            {{member.student_name}}
            <span v-if="member.submit_status === 0" style="color:red">（还未提交）</span>
          </span>
          <span v-for="score_item in member.score_option" :key="score_item.index">
            <span>评分</span>
            <input type="number" v-model="score_item.score"/>
          </span>
        </div>
        <div>
          <textarea  v-model="member.evaluation" rows="3" placeholder="对组员的评价..."/>
        </div>
      </div>
    </div>
    <div>
      <button class="m-b-btn-b" @click="submit">提交任务</button>
    </div>
  </div>
</template>
<script>

import { Toast } from 'mint-ui'

export default {
  data () {
    return {

    }
  },
  computed: {
    members () {
      return this.$route.query.members
    },
    student_task () {
      return this.$route.query.student_task
    }
  },
  methods: {
    back () {
      history.go(-1)
    },
    submit () {
      let member_score_evaluate = this.getScoreEvaluate(this.members)
      let { id, submit_content, file_url, file_name, submit_type } = this.student_task
      let task_id = this.student_task.task.id
      this.axios.request({
        method: 'post',
        url: '/index.php/Student/Task/save',
        data: {
          id,
          task_id,
          submit_content,
          file_url,
          file_name,
          submit_type,
          is_team_leader: 1,
          member_score_evaluate
        }
      }).then(res => {
        if (res.code === 200) {
          Toast({
            message: res.message,
            duration: 2000
          })
          this.$router.push({ name: 'taskIndex' })
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
  mounted () {

  }
}
</script>
