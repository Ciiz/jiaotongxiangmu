<template>
  <Row>
    <h3>课后作业题目内容：</h3>
      <div class="evainput" v-html="taskcontent"></div>
    <h3 style="margin-top:10px;">作业完成情况</h3>
      <div v-html=" homeworkcontent === null ? '暂未提交' : homeworkcontent" class="evainput"></div>
    <div>
      <Row>
        <h3>教师对小组的评价：</h3>
        <!-- <Input  style="display:block;padding:8px;" v-model="teachereva" disabled type="textarea" :rows="5"/> -->
        <div class="evainput" v-html="teachereva === null ? '暂未评价' : teachereva"></div>
     </Row>
    </div>
    <h3>教师对小组的评分：</h3>
    <div v-if="teacherlist.length !== 0" >
      <div v-for="scoreitem in score_option" :key="scoreitem.id" style="padding:8px;">
        <span style="display:inline-block;text-align:right;width:100px;"><b>{{scoreitem.option_name}}</b></span> :
        <span class="evascore">{{ scoreitem.teascore}}</span></div>
    </div>
    <div v-else>
      &nbsp;&nbsp;&nbsp;&nbsp;<span>暂未评分</span>
    </div>
  </Row>
</template>

<script>
export default {
  props: ['evaid'],
  data () {
    return {
      homeworkcontent: '',
      leaderlist: [],
      teacherlist: [],
      score_option: [],
      hadleader: false,
      nothadleaderevaluation: '',
      leaderscore: [],
      teacherscore: [],
      course_list: [],
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
        url: '/index.php/Teacher/Homework/score',
        data: {
          student_homework_id: this.evaid
        }
      }).then(res => {
        if (res.code === 200) {
          this.teachereva = res.data.evaluation
          let score_optionclone = res.data.score_option
          this.course_list = res
          for (let scoreitem in score_optionclone) {
            this.score_option.push(
              {
                id: score_optionclone[scoreitem].id,
                teascore: '0',
                leascore: '0',
                description: score_optionclone[scoreitem].description,
                option_name: score_optionclone[scoreitem].option_name,
                weight: score_optionclone[scoreitem].weight
              }
            )
          }
          if (res.data.score_list) {
            let tealist = res.data.score_list
            for (let item in tealist) {
              this.teacherlist.push(tealist[item])
            }
          }
          for (let item in this.score_option) {
            this.score_option[item].teascore = this.teacherlist[item]
          }
          for (let item in this.score_option) {
            this.score_option[item].leascore = this.leaderlist[item]
          }
          this.taskcontent = res.data.homework_content
          this.homeworkcontent = res.data.student_homework_content
        }
      })
    }
  }
}
</script>
