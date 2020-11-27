<template>
  <div style="height:100%;padding-bottom:20px;display:flex;flex-direction:column">
    <button @click="back" class="homework-back">返回</button>
    <Row class="studentHomework">
      <Col style="width:52%;margin-right:20px">
      <Divider orientation="left">
        <span class="studentHomework-black-font">{{student_homework.homework.homework_name}}</span>
      </Divider>
      <div>
        <span>所属课程：{{student_homework.homework.course_name}} </span>
        <span>课后作业</span>
      </div>
      <div>授课老师：{{student_homework.homework.teacher}}</div>
      <div style="margin-bottom:30px">
        截止时间：{{moment(student_homework.homework.end_time * 1000).format('YYYY-MM-DD HH:mm:ss')}}</div>
      <Divider orientation="left">
        <span class="studentHomework-black-font">任务描述</span>
      </Divider>
      <div v-html="student_homework.homework.homework_content" style="flex:1;word-break:break-all;overflow-y:scroll">
      </div>
      </Col>
      <Col v-if="student_homework.submit_status===0"
        style="flex:1;position:relative;padding-bottom:60px;display:flex;flex-direction:column">
      <Divider orientation="left">
        <span class="studentHomework-black-font">作答区</span>
      </Divider>
      <Editor class="new-editor" v-model="student_homework.content" :is_init.sync="editor_init"></Editor>
      <FileUpload :fileObj="{url: student_homework.file_url, name: student_homework.file_name}"
        @on-change="(file)=>{student_homework.file_url = file.url;student_homework.file_name= file.name}"
        :extra="{type: 'homework',token:$store.state.user.token}"></FileUpload>
      <div class="studentHomework-bottom">
        <!-- <button>保存(不提交)</button> -->
        <button @click="submit">提交</button>
      </div>
      </Col>
      <Col v-if="student_homework.submit_status===1" class="homework-evalute">
      <div>
        <div style="height:100%;display:flex;flex-direction:column">
          <div class="studentHomework-black-font" style="margin-bottom:10px">我的回答</div>
          <div style="word-break:break-all;flex:1;overflow-y:scroll">
            <p v-html="student_homework.content"></p>
          </div>
        </div>
        <div class="homework-evalute-file" v-if="student_homework.file_url">
          <a :href="student_homework.file_url" target="blank">附件</a>
        </div>
      </div>
      <div>
        <div class="studentHomework-black-font" v-for="score_item in teacher_evaluation.score_option"
          :key="score_item.index" style="margin-bottom:10px">
          老师评价：<span
            style="color:#FF3333;font-weight:bold;font-size:16px;">{{score_item.score===null?'未评':score_item.score}}分</span>
        </div>
        <div style="overflow-y:scroll;word-break:break-all;flex:1">{{teacher_evaluation.evaluation}}</div>
      </div>
      </Col>
    </Row>
    <Modal v-model="modal1" title="跳转" @on-ok="ok">
      <p>是否离开当前页面</p>
    </Modal>
    <Spin size="large" v-if="loading" fix></Spin>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    student_homework_id: ''
  },
  data () {
    return {
      student_homework: {
        homework: {}
      },
      loading: false,
      editor_init: true,
      modal1: false,
      teacher_evaluation: {}
    }
  },
  watch: {
    student_homework_id (newVal, oldVal) {
      this.getData(newVal)
    }
  },
  methods: {
    back () {
      if (this.student_homework.submit_status === 0) {
        this.modal1 = true
      } else {
        this.$emit('closeModal')
      }
    },
    getData (student_homework_id) {
      if (this.student_homework.submit_status === 0) { // 未完成时作业答题
        this.getStudentHomework(student_homework_id)
      } else { // 完成时作业评价
        this.getHomeworkInfo()
        this.getHomeworkEvaluate()
      }
    },
    getStudentHomework (student_homework_id) {
      if (!student_homework_id) return
      let _this = this
      _this.loading = true
      _this.editor_init = true
      _this.axios
        .request({
          method: 'get',
          url: `/index.php/Student/Homework/getStudentHomework`,
          params: {
            student_homework_id: student_homework_id
          }
        })
        .then(res => {
          _this.loading = false
          let data = res.data
          if (res.code === 200) {
            _this.student_homework = data.student_homework
          }
        })
    },
    getHomeworkInfo () {
      let _this = this
      _this.loading = true
      _this.axios
        .request({
          method: 'get',
          url: `/index.php/Student/Homework/getStudentHomework`,
          params: {
            student_homework_id: _this.student_homework_id
          }
        })
        .then(res => {
          _this.loading = false
          let data = res.data
          if (res.code === 200) {
            this.student_homework = data.student_homework
          }
        })
    },
    getHomeworkEvaluate () {
      let _this = this
      _this.axios
        .request({
          method: 'get',
          url: `/index.php/Student/Homework/getHomeworkEvaluate`,
          params: {
            student_homework_id: _this.student_homework_id
          }
        })
        .then(res => {
          let data = res.data
          if (res.code === 200) {
            this.teacher_evaluation = data.evaluation
          }
        })
    },
    submit () {
      if (this.content === '') {
        this.$Message.error('作答内容不能为空')
      } else {
        let _this = this
        let {
          id,
          content,
          file_url,
          file_name,
          submit_type,
          homework_id
        } = _this.student_homework
        _this.axios
          .request({
            method: 'post',
            url: '/index.php/Student/Homework/submitHomework',
            data: {
              id,
              content,
              file_url,
              file_name,
              submit_type,
              homework_id
            }
          })
          .then(res => {
            if (res.code === 200) {
              _this.$emit('success')
              _this.$Message.success(res.message)
            } else {
              this.$Message.error(res.message)
            }
          })
      }
    },
    ok () {
      this.$emit('closeModal')
    }
  },
  mounted () {
    this.getData(this.student_homework_id)
  }
}
</script>
<style type="text/css" lang="less" scoped>
.p-text {
  margin-top: 5px;
}
.p-title {
  font-weight: bold;
}
.row-item {
  margin-top: 15px;
  margin-bottom: 15px;
}
.center {
  text-align: right;
  margin-top: 15px;
}
.ivu-btn {
  margin-right: 10px;
}
</style>
