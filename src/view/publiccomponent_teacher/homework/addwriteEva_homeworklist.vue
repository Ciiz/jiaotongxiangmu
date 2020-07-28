<template>
  <Row>
    <h3>课后作业题目内容：</h3>
    <Row style="padding:8px;">
           <div class="evainput" v-html="taskcontent"></div>
    </Row>
    <h3 style="margin-top:10px;">作业完成情况：</h3>
    <Row >
        <div v-html="student_homework_content" class="evainput"></div>
        <embed :src="file_url"  >
        <iframe :src="file_url" height="0" frameborder="0" v-if="unimgorvideo"></iframe>
        <Button @click="unimgorvideo =true" v-if="!unimgorvideo && file_url !== ''" type="primary" class="addbtn">学生上传了其它文件，是否需要下载到本地预览</Button>
    </Row>
    <h3>对作业完成进行评价：</h3>
    <Input
      style="display:block;padding:8px;"
      v-model="teacherevaluation"
      type="textarea"
      :rows="4"
      placeholder="请输入评价（200字以内）"
      :clearable="true"
      :maxlength="200"
    />
    <h3>对作业完成进行评分：</h3>
    <div style="padding:8px;" v-if="score_option.length > 0">
      <div class="homelist_radio" v-for="teacheritem in score_option" :key="teacheritem.id">
      <span style="display:inline-block;width:200px;text-align:right;font-size:14px;">
      <b> {{teacheritem.option_name}}：</b>
      </span>
      <span>{{teacheritem.teamevascore}}</span>
      <!-- <Input type="text" number v-model="teacheritem.teamevascore" style="width:100px;"></Input> -->
      </div>
    </div>
    <div style="padding:8px;" v-else>
        暂未编辑评分维度
    </div>
    <p style="padding:10px 0;">
      <Button @click="submit()" type="primary">提交</Button>
      <Button @click="reset()" style="margin-left:5px;">重置</Button>
    </p>
  </Row>
</template>
<script>
export default {
  props: ['release_type', 'writeEvaluationid'],
  components: {
  },
  data () {
    return {
      unimgorvideo: true,
      file_url: '',
      file_name: '',
      scoresubmit: [],
      score_option: [],
      student_homework_content: '',
      student_info: [],
      teacherevadata: [],
      datatest: [],
      taskcontent: '',
      teamevascore: { },
      teamevascoreto: [],
      teamtask: [], // xxx完成情况数据
      teacherevaluation: '', // 绑定评价输入框
      data_list: [] // 准备接收数据入口
    }
  },
  created () {
    this.getInfo()
  },
  methods: {
    reset () {
      this.teacherevaluation = this.teamevascore1 = this.teamevascore2 = this.teamevascore3 = ''
      this.teamevascore = { 4: 0, 5: 0, 6: 0 }
    },
    submit () {
      if (this.teacherevaluation === '') {
        this.$Message.error('请进行评价')
        return false
      } else {
        let submitscore = {}
        for (let item in this.score_option) {
          submitscore[this.score_option[item].id] = this.score_option[item].teamevascore
        }
        this.axios.request({
          method: 'post',
          url: '/index.php/Teacher/Homework/score_update',
          data: {
            student_homework_id: this.writeEvaluationid,
            evaluation: this.teacherevaluation,
            scores: submitscore
          }
        }).then(res => {
          if (res.code === 200) {
            this.$Message.success(res.message)
            this.$emit('closewrite', false)
          }
        })
      }
    },
    getInfo () {
      this.axios.request({
        method: 'post',
        url: '/index.php/Teacher/Homework/score',
        data: {
          student_homework_id: this.writeEvaluationid
        }
      }).then(res => {
        if (res.code === 200) {
          this.datatest = res
          if (res.data.evaluation !== null || res.data.evaluation !== '') {
            this.teacherevaluation = res.data.evaluation
          }
          this.student_info = res.data.student_info
          this.student_homework_content = res.data.student_homework_content
          if (res.data.file_url !== null && res.data.file_url !== '' && res.data.file_name !== null && res.data.file_name !== '') {
            this.file_url = res.data.file_url
            this.file_name = res.data.file_name
          }
          if (this.file_url.match(/(.zip)|(.doc)|(.docx)|(.xlxs)|(.rar)$/gi) !== 'null') {
            this.unimgorvideo = false
          }
          this.taskcontent = res.data.homework_content
          let option = res.data.score_option
          for (let item in option) {
            this.score_option.push({ option_name: option[item].option_name, id: option[item].id, teamevascore: 0 })
            this.scoresubmit.push(item)
          }
          for (let item in this.score_option) {
            for (let i in res.data.score_list) {
              if (this.score_option[item].id.toString() === i.toString()) {
                this.score_option[item].teamevascore = res.data.score_list[i].toString()
                break
              }
            }
          }
        }
      })
    }
  }
}
</script>
