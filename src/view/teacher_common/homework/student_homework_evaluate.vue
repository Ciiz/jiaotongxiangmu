<template>
  <div class="modal-content" style="color:#666666">
    <div class="homework-evaluate-title">作业内容：</div>
    <p style="padding:10px 6px" v-html="student_homework.homework_content"></p>
    <div class="blue-c" style="margin:10px 6px">TA的答案</div>
    <div class="homework-evaluate-anwser" v-if="!student_homework.submit_status">未提交</div>
    <div class="homework-evaluate-anwser" v-if="student_homework.submit_status" v-html="student_homework.student_homework_content"></div>
    <div v-if="student_homework.file_url" style="font-size:14px;margin-bottom:10px">
    文件:<a
      :href="student_homework.file_url"
      target="blank"
    >{{student_homework.file_name || '————附件————'}}</a>
    </div>
    <div v-for="score_item in student_homework.score_option" :key="score_item.index">
      <span class="blue-c" style="margin-right:10px">得分</span>
      <Input type="text" :label="score_item.option_name" v-model="score_item.score" style="width:106px" class="evaluate-main-score-input"/>
    </div>
    <Input type="textarea" class="homework-evaluate-textarea" :rows="4" v-model="student_homework.evaluation" placeholder="对学生的评价："></Input>
    <!-- 选择常用语 -->
      <div class="modal-footer evaluate-modal-footer">
        <button class="blue-btn" @click="lastHomework">上一位</button>
        <button @click="submit">{{student_homework.score_status?'修改':'提交'}}</button>
        <button class="blue-btn" @click="nextHomework">下一位</button>
      </div>
      <Spin fix v-if="loading"></Spin>
  </div>
</template>
<script>
export default{
  props: {
    student_homework_id: '',
    homeworkIndex: ''
  },

  data () {
    return {
      student_homework: {
        score_option: []
      },
      loading: false
    }
  },
  watch: {
    student_homework_id (n, o) {
      this.getInfo()
    }
  },
  methods: {
    getInfo () {
      this.loading = true
      this.axios.request({
        method: 'post',
        url: '/index.php/Teacher/Homework/score',
        data: {
          student_homework_id: this.student_homework_id
        }
      }).then(res => {
        if (res.code === 200) {
          this.student_homework = res.data
          this.evaluation = res.data.evaluation
          // 处理分数
          res.data.score_option = Object.values(res.data.score_option)
          let score_list = res.data.score_list
          res.data.score_option.map((item, key) => {
            item.score = score_list[item.id] ? score_list[item.id] : 0
            return item
          })
          this.student_homework.score_option = res.data.score_option
        }
        this.loading = false
      })
    },
    submit () {
      let _this = this
      let scores = {}
      this.student_homework.score_option.forEach(item => { // 处理获取后台需要的分数格式
        scores[item.id] = item.score
      })
      this.axios.request({
        method: 'post',
        url: '/index.php/Teacher/Homework/score_update',
        data: {
          student_homework_id: this.student_homework_id,
          evaluation: this.student_homework.evaluation,
          scores: scores
        }
      }).then(res => {
        if (res.code === 200) {
          _this.$Message.success(res.message)
          _this.$emit('success')
        }
      })
    },
    nextHomework () {
      let i = this.homeworkIndex + 1
      this.$emit('changeHomwork', i)
    },
    lastHomework () {
      let i = this.homeworkIndex - 1
      this.$emit('changeHomwork', i)
    }
  },
  mounted () {
    this.getInfo()
  }
}
</script>
