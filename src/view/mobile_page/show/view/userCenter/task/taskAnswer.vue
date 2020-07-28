<template>
  <div class="m-taskAnswer flex-contain">
    <mt-header title="任务作答" style="border-bottom: 1px solid #E5E5E5">
      <router-link to slot="left">
        <mt-button icon="back" @click="back"></mt-button>
      </router-link>
    </mt-header>
    <div class="m-taskAnswer-contain hideScroll flex-contain">
      <div v-html="student_task.task.content" class="m-task-title"></div>
      <div class="m-task-content" :contenteditable="student_task.submit_status!==1?true:false" v-html="student_task.submit_content"></div>
    </div>
    <mobileUpload :fileObj="{url: student_task.file_url, name: student_task.file_name}"  v-if="student_task.submit_status!==1"
            @on-change="(file)=>{student_task.file_url = file.url;student_task.file_name= file.name}"
            :extra="{type: 'task',token:$store.state.user.token}">
    </mobileUpload>
    <div class="m-taskEvaluate-file"  v-if="student_task.submit_status===1">
      <span>附件：</span>
      <a :href="student_task.file_url" target="_Blank">{{student_task.file_url}}</a>
    </div>
    <div style="display:flex" v-if="student_task.submit_status!==1">
      <div style="flex:1">
        <button class="m-w-btn-b">保存（不提交）</button>
      </div>
      <div style="flex:1">
        <button class="m-b-btn-b" @click="submit" v-if="student_task.task_release.release_type===2||is_team_leader.toString()==='1'">提交任务</button>
        <button class="m-b-btn-b" @click="submit" v-if="student_task.task_release.release_type===1&&is_team_leader.toString()!=='1'">提交给组长</button>
      </div>
    </div>
    <div v-if="student_task.submit_status===1">
      <div style="flex:1">
        <button class="m-gray-btn-b">已提交</button>
      </div>
    </div>
  </div>
</template>
<script>

import { student_task_detail } from '@/api/student'
import { Toast } from 'mint-ui'
import mobileUpload from '@/view/mobile_page/components/mobile-upload'

export default {
  components: {
    mobileUpload
  },
  data () {
    return {
      student_task: [],
      release_type: '',
      members: []
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
          this.student_task = res.data.student_task
          this.members = res.data.members
        }
      })
    },
    submit () {
      this.student_task.submit_content = document.getElementsByClassName('m-task-content')[0].innerHTML
      if (this.is_team_leader.toString() !== '1') {
        this.axios.request({
          method: 'post',
          url: '/index.php/Student/Task/save',
          data: {
            id: this.student_task.id,
            submit_content: this.student_task.submit_content,
            file_url: this.student_task.file_url,
            file_name: this.student_task.file_name,
            submit_type: this.student_task.submit_type,
            task_id: ''
          }
        }).then(res => {
          if (res.code === 200) {
            Toast({
              message: res.message,
              duration: 2000
            })
            this.$router.push({ name: 'taskIndex' })
          }
        })
      } else {
        this.$router.push({ name: 'evaluateMembers', query: { members: this.members, student_task: this.student_task } })
      }
    }
  },
  mounted () {
    this.getTaskInfo()
  }
}
</script>
