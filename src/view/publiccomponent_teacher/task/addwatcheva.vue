<template>
  <Row class="max-height">
    <h3>任务内容：</h3>
    <div class="evainput" v-html="taskcontent"></div>
    <div v-if="hadleader">
      <h3 style="margin-top:10px;">组长对组员评价：</h3>
        <Row style="margin:10px 0;padding:8px;" v-for="(leaderevalistitem,index) in leaderevalist"  :key="index + '001'">
          <h4>组长对组员{{leaderevalistitem.evaluated_name}}的的评价：</h4>
          <div class="evainput" v-html="leaderevalistitem.evaluation"></div>
        </Row>
    </div>
    <div v-if="hadleader">
      <Row>
        <h3>教师对小组的评价：</h3>
        <div class="evainput" v-html="teachereva"></div>
      </Row>
    </div>
    <div v-else>
      <h3>教师的评价：</h3>
      <div class="evainput" v-html="nothadleaderevaluation"></div>
    </div>
    <div v-if="hadleader">
        <h3>教师对小组的评分：</h3>
          <div v-if="teacherscore.length !== 0" >
          <div v-for="scoreitem in score_option" :key="scoreitem.id" style="padding:10px;">
            <span style="display:inline-block;text-align:right;width:100px;font-size:14px;"><b>{{scoreitem.option_name}}</b></span>
            <span class="evascore">{{ scoreitem.teascore }}</span>
            </div>
        </div>
        <div v-else>
          <h3>无</h3>
        </div>
    </div>
    <div v-else>
        <h3>教师的评分：</h3>
        <div v-if="teacherscore.length !== 0" >
          <div v-for="scoreitem in score_option" :key="scoreitem.id" style="padding:10px;">
            <span style="display:inline-block;text-align:right;width:100px;font-size:14px;"><b>{{scoreitem.option_name}}</b></span>
            <span class="evascore">{{ scoreitem.teascore}}</span>
          </div>
        </div>
        <div v-else>
          <h3>无</h3>
        </div>
    </div>
  </Row>
</template>

<script>
export default {
  props: ['watchEvaluationid'],
  data () {
    return {
      teacherlist: [],
      score_option: [],
      hadleader: false,
      nothadleaderevaluation: '',
      leaderscore: [],
      teacherscore: [],
      taskcontent: '',
      leaderevalist: [],
      teachereva: ''
    }
  },
  created () {
    this.getInfo()
  },
  methods: {
    getInfo () {
      this.axios.request({
        method: 'post',
        url: '/index.php/Teacher/Task/all_score',
        data: {
          student_task_id: this.watchEvaluationid
        }
      }).then(res => {
        if (res.code === 200) {
          let score_optionclone = res.data.score_option
          for (let scoreitem in score_optionclone) {
            this.score_option.push(
              {
                id: score_optionclone[scoreitem].id,
                option_name: score_optionclone[scoreitem].option_name,
                description: score_optionclone[scoreitem].description,
                weight: score_optionclone[scoreitem].weight,
                teacherscore: '0'
              }
            )
          }
          if (res.data.score_list.teacher) {
            let tealist = res.data.score_list.teacher
            for (let item in tealist) {
              for (let i in tealist[item]) {
                this.teacherlist.push(tealist[item][i])
              }
            }
          }
          for (let item in this.score_option) {
            this.score_option[item].teascore = this.teacherlist[item]
          }
          this.taskcontent = res.data.task_info.content === '' ? '暂无任务内容' : res.data.task_info.content
          let teacherclone = res.data.score_list.teacher
          let data = res.data.student_task_info
          for (let i in teacherclone) {
            for (let item in data) {
              if (data[item].id === Number(this.watchEvaluationid)) {
                if (i === data[item].student_id.toString()) {
                  this.teacherscore = teacherclone[i]
                }
                break
              }
            }
          }
          if (res.data.score_list.leader) {
            this.hadleader = true
            let leaderclone = res.data.score_list.leader
            for (let i in leaderclone) {
              for (let item in data) {
                if (data[item].id !== Number(this.watchEvaluationid)) {
                  if (i !== data[item].student_id.toString()) {
                    this.leaderscore.push(leaderclone[i])
                  }
                }
              }
            }
            if (res.data.evaluation_list.leader) {
              this.leaderevalist = res.data.evaluation_list.leader
            } else {
              for (let item in data) {
                if (data[item].id !== Number(this.watchEvaluationid)) {
                  this.leaderevalist.push({ evaluated_id: data[item].id, evaluation: '暂无评价' })
                }
              }
            }
            this.teachereva = res.data.evaluation_list.teacher[0].evaluation
            // eslint-disable-next-line no-unused-vars
            for (let leaderitem in this.leaderevalist) {
              for (let item in this.leaderscore) {
                this.leaderevalist[item]['leader'] = this.leaderscore[item]
              }
            }
          } else {
            if (res.data.evaluation_list.teacher) {
              this.nothadleaderevaluation = res.data.evaluation_list.teacher[0].evaluation
            } else {
              this.nothadleaderevaluation = '暂无评价'
            }
          }
        }
      })
    }
  },
  mounted () {
  }
}
</script>
<style>
</style>
