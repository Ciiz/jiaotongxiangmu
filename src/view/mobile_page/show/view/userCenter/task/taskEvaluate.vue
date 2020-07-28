<template>
  <div class="m-taskEvaluate flex-contain">
    <mt-header title="答案和成绩" style="border-bottom: 1px solid #E5E5E5">
      <router-link to slot="left">
        <mt-button icon="back" @click="back"></mt-button>
      </router-link>
    </mt-header>
    <div class="m-taskEvaluate-sub hideScroll flex-contain">
      <div v-html="student_task.submit_content" class="m-taskEvaluate-content"></div>
      <div class="m-taskEvaluate-file">
        <span>附件：</span>
        <a :href="student_task.file_url" target="_Blank">{{student_task.file_url}}</a>
      </div>
    </div>
    <div class="m-taskEvaluate-eva hideScroll" v-if="!(is_team_leader===1&&student_task.task.type===2)">
      <div>
        <span>成绩：</span>
        <span v-if="info.score_option[0].score!==null"><span style="color:#EE3333;font-size:0.5rem">{{info.score_option[0].score}} </span>分</span>
        <span v-if="info.score_option[0].score===null">尚未评分</span>
      </div>
      <div>
        <span>评语：</span>
        {{info.evaluation===''?'尚无评语':info.evaluation}}
      </div>
    </div>
    <div class="m-taskEvaluate-eva hideScroll" v-if="is_team_leader===1&&student_task.task.type===2">
      <!-- <div>
        <span>成绩：</span>
        <span v-if="info.score_option[0].score!==null"><span style="color:#EE3333;font-size:5rem">{{info.score_option[0].score}} </span>分</span>
        <span v-if="info.score_option[0].score===null">尚未评分</span>
      </div>
      <div>
        <span>评语：</span>
        {{info.evaluation===''?'尚无评语':info.evaluation}}
      </div> -->
    </div>
  </div>
</template>
<script>

import { student_task_detail } from '@/api/student'
export default {
  data () {
    return {
      info: [],
      student_task: []
    }
  },
  computed: {
    id () {
      return this.$route.query.id
    },
    is_team_leader () {
      return this.$route.query.is_team_leader
    }
  },
  methods: {
    back () {
      window.history.go(-1)
    },
    getTaskInfo () {
      if (!this.id) return
      student_task_detail(this.id).then(res => {
        if (res.code === 200) {
          this.info = res.data.teacherEvaluation
          this.student_task = res.data.student_task
        }
      })
    }
  },
  mounted () {
    this.getTaskInfo()
  }
}
</script>
