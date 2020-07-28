<template>
  <div class="modal-content">
    <div class="homework-evaluate-title">任务内容：</div>
    <p style="padding:10px 6px" v-html="task.content"></p>
    <div class="blue-c" style="margin:10px 6px">学生提交内容：</div>
      <div class="answer-area" >
        <span v-if="student_task.submit_status === 0">未提交</span>
        <div v-html="student_task.submit_content"></div>
        <div v-if="student_task.file_url"  style="font-size:14px;margin-bottom:10px">
        文件:<a
          :href="student_task.file_url"
          target="blank"
        >----附件----</a>
        </div>
      </div>
      <div v-for="score_item in score_option" :key="score_item.index">
        <span class="blue-c" style="margin-right:10px">得分</span>
        <Input type="text" :label="score_item.option_name" v-model="score_item.score" style="width:106px" class="evaluate-main-score-input"/>
      </div>
      <Input type="textarea" class="homework-evaluate-textarea"  placeholder="对学生的评价：" :rows="4" v-model="evaluation"></Input>
      <div class="modal-footer evaluate-modal-footer">
        <button class="blue-btn" @click="lastTask">上一位</button>
        <button @click="submit">提交</button>
        <button class="blue-btn" @click="nextTask">下一位</button>
      </div>
      <Spin fix v-if="loading"></Spin>
  </div>
</template>
<script>
export default{
  props: {
    student_task_id: '',
    taskIndex: ''
  },
  data () {
    return {
      task: {},
      student_task: {},
      score_option: [],
      evaluation: '',
      loading: false
    }
  },
  watch: {
    student_task_id (n, o) {
      this.getInfo()
    }
  },
  methods: {
    getInfo () {
      this.loading = true
      this.score_option = []
      this.axios.request({
        method: 'post',
        url: '/index.php/Teacher/Task/score',
        data: {
          student_task_id: this.student_task_id
        }
      }).then(res => {
        if (res.code === 200) {
          this.task = res.data.task_info
          this.evaluation = res.data.evaluation
          this.student_task = res.data.student_submit[0] // FIXME:  这里应该返回单个
          res.data.score_option = Object.values(res.data.score_option)
          let score_list = res.data.score_list
          res.data.score_option.map((item, key) => {
            item.score = score_list[item.id] ? score_list[item.id] : 0
            return item
          })
          this.score_option = res.data.score_option
        }
        this.loading = false
      })
    },
    submit () {
      let _this = this
      let scores = {}
      this.score_option.forEach(item => { // 处理获取后台需要的分数格式
        scores[item.id] = item.score
      })
      this.axios.request({
        method: 'post',
        url: '/index.php/Teacher/Task/score_update',
        data: {
          student_task_id: this.student_task_id,
          evaluation: this.evaluation,
          scores: scores
        }
      }).then(res => {
        if (res.code === 200) {
          _this.$Message.success(res.message)
          _this.$emit('success')
        }
      })
    },
    nextTask () {
      let i = this.taskIndex + 1
      this.$emit('changeTask', i)
    },
    lastTask () {
      let i = this.taskIndex - 1
      this.$emit('changeTask', i)
    }
  },
  mounted () {
    this.getInfo()
  }
}
</script>
