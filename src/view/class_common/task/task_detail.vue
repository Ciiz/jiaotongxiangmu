<template>
  <div class="modal-content">
    <Tabs size="small" name="task_detail" v-model="tab">
      <TabPane label="课中任务" v-if="student_task" tab="task_detail" name="task">
        <div class="row-item">
          <h2>任务内容:</h2>
          <div></div>

          <div v-html="student_task.task.content" style="margin-bottom: 15px;"></div>
          <h2>答题区:</h2>
          <Alert show-icon closable>小组任务由组长自己整理组员的回答并提交</Alert>
          <Row>
            <Editor v-model="student_task.submit_content" :is_init.sync="editor_init">
            </Editor>
            <FileUpload :fileObj="{url: student_task.file_url, name: student_task.file_name}"
              @on-change="(file)=>{student_task.file_url = file.url; student_task.file_name= file.name}"
              :extra="{type: 'task',token:$store.state.user.token}">
            </FileUpload>
            <Button style="float:right;margin-top:15px;" size="small" type="primary" @click="submitTask"
              :disabled="student_task.score_status === 1">{{submitTxt}}</Button>
          </Row>
        </div>
        <Row v-if="student_task.is_team_leader">
          <h2 style="margin-top:20px;">组员完成情况:</h2>
          <div class="row-item" v-for="member in members" :key="member.id">
            <h4>{{member.student_name}}:</h4>
            <div class="answer-area">
              <span v-if="!member.submit_status">未提交</span>
              <div v-html="member.submit_content"></div>
              <div v-if="member.file_url">
                文件:<a :href="member.file_url" target="blank">{{member.file_url}}</a>
              </div>
            </div>
          </div>
        </Row>
      </TabPane>
      <TabPane label="其他小组任务完成情况" tab="task_detail" v-if="show_team_list" name="other_team">
        <TeamList :student_task_id="student_task_id" :self_submit_status="student_task.submit_status"
          v-if="show_team_list"></TeamList>
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import TeamList from './team_list_m'
export default {
  props: {
    student_task_id: '',
    // task_release_id: ''
  },
  components: {
    TeamList
  },
  data () {
    return {
      tab: 'task',
      members: [],
      is_show: false,
      show_team_list: false,
      o_team_student_task_id: '',
      student_task: {
        id: '',
        task: { content: '' }
      },
      editor_init: true
    }
  },
  computed: {
    submitTxt () {
      let txt = '提交'
      if (this.student_task.submit_status === 1 && this.student_task.score_status === 0) {
        txt = '修改'
      }
      if (this.student_task.submit_status === 1 && this.student_task.score_status === 1) {
        txt = '已评分了,不能修改'
      }
      return txt
    }
  },
  watch: {
    student_task_id (newVal, oldVal) {
      this.getStudentTask()
    },
  },
  methods: {
    getStudentTask () {
      if (!this.student_task_id) {
        return false
      }
      let _this = this
      _this.editor_init = true
      this.axios
        .request({
          method: 'get',
          url: '/index.php/Student/Task/getClassMiddleStudentTaskDetail',
          params: {
            student_task_id: _this.student_task_id
          }
        })
        .then(res => {
          // console.log(res);
          let data = res.data
          if (res.code === 200) {
            _this.student_task = data.student_task
            console.log(_this.student_task);

            if (!data.student_task) { // 没有课中任务
              _this.student_task = ''
              return false
            }
            if (_this.student_task.release_type === 1 && this.student_task.is_team_leader) { // 小组任务，并且是组长才能查看其它 小组的情况
              // 小组
              this.members = data.members
              _this.tab = 'task'
              _this.show_team_list = true
            } else if (_this.student_task.release_type === 2) {
              // 个人
              _this.tab = 'task'
              _this.show_team_list = false
            }
          }
        })
    },
    submitTask () {
      let _this = this
      _this.axios.request({
        method: 'post',
        url: '/index.php/Student/Task/save',
        data: {
          is_team_leader: 0,
          submit_type: this.student_task.submit_type, // 在线编辑
          submit_content: this.student_task.submit_content,
          id: this.student_task.id,
          task_id: this.student_task.task_id,
          file_url: this.student_task.file_url,
          file_name: this.student_task.file_name,
          live_type: 1
        }
      }).then(res => {
        if (res.code === 200) {
          _this.$Message.success(res.message)
        }
      })
    }
  },
  created () {
    this.getStudentTask()
  },
  mounted () {
  }
}
</script>
<style lang="less" scoped>
.member-item {
  margin-bottom: 10px;
}
.chat-container {
  height: 200px;
  overflow: auto;
  .chat-item {
    margin-bottom: 15px;
    .name {
      font-weight: bold;
    }
    .time {
      color: #999;
    }
  }
}

.fix-pdf-option {
  position: absolute;
  background: #000;
  top: 0px;
  left: 0px;
  width: 100%;
  z-index: 999;
  padding: 15px;
}

.demo-tabs-style2 > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab {
  border-radius: 0;
  background: #fff;
}
.demo-tabs-style2
  > .ivu-tabs.ivu-tabs-card
  > .ivu-tabs-bar
  .ivu-tabs-tab-active {
  border-top: 1px solid #3399ff;
}
.demo-tabs-style2
  > .ivu-tabs.ivu-tabs-card
  > .ivu-tabs-bar
  .ivu-tabs-tab-active:before {
  content: "";
  display: block;
  width: 100%;
  height: 1px;
  background: #3399ff;
  position: absolute;
  top: 0;
  left: 0;
}
.ivu-tabs-tabpane {
  padding: 10px;
}
.demo-tabs-style2 {
  margin-top: 15px;
}
.ivu-tabs-nav-scroll {
  background: #fff;
}
.ivu-tabs-bar {
  margin-bottom: 0px;
}
</style>
