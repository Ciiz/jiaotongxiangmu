<template>
  <div style="width:100%;height:100%;position:relative">
    <div style="width:100%;height:100%;position:absolute;display:flex;flex-direction:column">
      <div>
        <button class="homework-back" @click="$emit('back')">返回</button>
      </div>
      <Row type="flex" class="anwser-task">
        <Col style="margin-right:20px;flex:1">
        <newtaskDetail :student_task_id="student_task_id"></newtaskDetail>
        </Col>
        <Col style="width:800px;display:flex;flex-direction:column;padding-bottom:90px">
        <Divider orientation="left"><span class="black-b">作答区</span></Divider>
        <div v-if="student_task.submit_status===1" style="color:red;margin-bottom:10px">（已提交）</div>
        <Editor class="new-editor" v-model="student_task.submit_content" :is_init.sync="editor_init"
          v-if="student_task.submit_status === 0">
        </Editor>
        <div v-html="student_task.submit_content" v-if="student_task.submit_status === 1"
          style="flex:1;word-break:break-all"></div>

        <FileUpload :fileObj="{url: student_task.file_url, name: student_task.file_name}"
          @on-change="(file)=>{student_task.file_url = file.url;student_task.file_name= file.name}"
          :extra="{type: 'task',token:$store.state.user.token}" v-if="student_task.submit_status === 0">
        </FileUpload>
        <div v-if="student_task.submit_status === 1">
          附件：<a :href="student_task.file_url" target="_blank">{{student_task.file_url}}</a>
        </div>
        <div class="studentHomework-bottom" style="margin-bottom:10px" v-if="student_task.submit_status === 0">
          <button @click="submit">提交</button>
        </div>
        </Col>
      </Row>
      <Spin size="large" v-if="loading" fix></Spin>
    </div>
  </div>
</template>
<script>
import { student_task_detail } from '@/api/student'
import newtaskDetail from '@/view/class_common/task/newtask_detail'

export default {
  components: {
    newtaskDetail
  },
  props: {
    student_task_id: ''
  },
  data () {
    return {
      student_task: {
        submit_content: ' ',
        task: {}
      },
      loading: false,
      editor_init: true
    }
  },
  watch: {
    student_task_id (newVal, oldVal) {
      this.getTaskInfo(newVal)
    }
  },
  methods: {
    getTaskInfo (student_task_id) {
      if (!student_task_id) return
      let _this = this
      _this.loading = true
      _this.editor_init = true
      student_task_detail(student_task_id).then(res => {
        console.log(res);

        _this.loading = false
        let data = res.data
        if (res.code === 200) {
          _this.student_task = data.student_task
        }
      })
    },
    submit () {
      let { id, submit_content, file_url, file_name, submit_type, task_id } = this.student_task
      this.axios.request({
        method: 'post',
        url: '/index.php/Student/Task/save',
        data: {
          id,
          submit_content,
          file_url,
          file_name,
          submit_type,
          task_id
        }
      }).then(res => {
        if (res.code === 200) {
          this.$Message.success(res.message)
          this.$emit('success')
        }
      })
    },

    reset () {
      this.student_task.submit_content = ''
    }
  },
  mounted () {
    this.getTaskInfo(this.student_task_id)
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
/deep/.ql-container {
  box-sizing: border-box;
  font-family: Helvetica, Arial, sans-serif;
  font-size: 16px;
  height: 60%;
  margin: 0px;
  overflow-y: hidden;
  position: relative;
}

/deep/.ql-editor {
  box-sizing: border-box;
  line-height: 1.42;
  height: 95%;
  outline: none;
  overflow-y: scroll;
  padding: 0px 15px;
  tab-size: 4;
  -moz-tab-size: 4;
  text-align: left;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
