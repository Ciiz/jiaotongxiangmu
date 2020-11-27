<template>
  <div style="width:100%;height:100%;position:relative;font-size:14px">
    <div style="width:100%;height:100%;position:absolute;display:flex;flex-direction:column">
      <div>
        <button class="homework-back" @click="$emit('back')">返回</button>
      </div>
      <Row type="flex" style="flex:1;overflow:hidden">
        <Col style="margin-right:20px;flex:1;height:100%;overflow-y:scroll">
        <div v-for="member in members" :key="member.id" style="margin-bottom:10px;padding:20px;background:#ffffff">
          <Row type="flex" justify="space-between">
            <Col>
            <img style="width:30px;height:30px;border-radius:50%;vertical-align:middle;margin-right:10px"
              :src="member.icon" />
            <span class="gray-c">{{member.student_name}}</span>
            </Col>
            <Col v-if="member.submit_status === 1&&member.file_url">
            文件：<a class="new-file" :href="member.file_url"
              target="blank">{{member.file_name===''?'附件':member.file_name}}</a>
            </Col>
          </Row>
          <p style="padding:10px 0" v-if="member.submit_status === 0">
            <Tag color="red">还没提交....</Tag>
          </p>
          <div v-if="member.submit_status === 1" style="padding:10px 0">
            <div v-html="member.submit_content" class="gray-c8 anwsercontent" style="word-break:break-all"></div>
            <!-- <span class="blue-c" style="float:right;margin-top:4px;cursor:pointer" >展开</span> -->
            <div style="clear:both"></div>
          </div>
          <Row type="flex" class="answer-team-evaluation">
            <Col :span="7" v-for="score_item in member.score_option" :key="score_item.index" style="margin-right:40px">
            <span class="gray-c8">评分：</span>
            <Input type="text" v-model="score_item.score" />
            </Col>
            <Col style="flex:1">
            <span class="gray-c8">评语：</span>
            <Input v-model="member.evaluation" type="text" />
            </Col>
          </Row>
        </div>
        </Col>
        <Col class="answer-team-anwser">
        <Divider orientation="left"><span class="black-b">组长任务答题区：</span></Divider>
        <Alert show-icon closable>小组任务由组长自己整理组员的回答并提交</Alert>
        <Editor class="new-editor" v-model="student_task.submit_content" :is_init.sync="editor_init">
        </Editor>
        <FileUpload :fileObj="{url: student_task.file_url, name: student_task.file_name}"
          @on-change="(file)=>{student_task.file_url = file.url;student_task.file_name= file.name}"
          :extra="{type: 'task',token:$store.state.user.token}">
        </FileUpload>
        <div class="studentHomework-bottom" style="margin-bottom:10px">
          <!-- <button>保存(不提交)</button> -->
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
export default {
  components: {
  },
  props: {
    student_task_id: ''
  },
  data () {
    return {
      student_task: {
        task: {},
        submit_content: ''
      },
      members: [],
      loading: false,
      editor_init: true
    }
  },
  computed: {
    member_name_list () {
      return this.members.map(item => { return item.student_name }).join(',')
    }
  },
  watch: {
    student_task_id (newVal, oldVal) {
      this.getTaskInfo(newVal)
    }
  },
  methods: {
    getTaskInfo (student_task_id) {
      if (!student_task_id) {
        return
      }
      let _this = this
      _this.loading = true
      _this.editor_init = true
      student_task_detail(student_task_id).then(res => {
        _this.loading = false
        let data = res.data
        if (res.code === 200) {
          _this.student_task = data.student_task
          _this.members = data.members
        }
      })
    },
    submit () {
      let _this = this
      let { id, submit_content, file_url, file_name, submit_type } = _this.student_task
      let task_id = this.student_task.task.id
      let member_score_evaluate = this.getScoreEvaluate(this.members)
      _this.axios.request({
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
          member_score_evaluate: member_score_evaluate
        }
      }).then(res => {
        if (res.code === 200) {
          _this.$Message.success(res.message)
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
  mounted () {
    this.getTaskInfo(this.student_task_id)
  }
}
</script>
<style type="text/css" lang="less" scoped>
.p-text {
  margin-top: 5px;
}
.p-label {
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
.comment-area {
  background: #fcfcfc;
}
.p-title {
  margin: 15px 0px;
  font-weight: bold;
}
</style>
