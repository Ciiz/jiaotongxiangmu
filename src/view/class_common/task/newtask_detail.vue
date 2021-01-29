<template>
  <div class="newtask_detail">
    <Divider orientation="left"><span class="black-b">{{student_task.task.task_name}}</span></Divider>
    <div class="newtask_detail-info">
      <div>所属课程：{{student_task.course_name}}</div>
      <div>授课老师：{{student_task.teacher}}</div>
      <div>任务类型：{{student_task.task_release.release_type===1?'小组':'个人'}}</div>
      <div>接收时间：{{moment(student_task.task_release.start_time * 1000).format('YYYY-MM-DD HH:mm')}}</div>
      <div>截止时间：{{moment(student_task.task_release.end_time * 1000).format('YYYY-MM-DD HH:mm')}}</div>
    </div>
    <Divider orientation="left"><span class="black-b">任务描述</span></Divider>
    <div style="color:#888888;word-break:break-all;overflow-y:scroll;height:410px">
      <div v-html="student_task.task.content"></div>
    </div>
    <Divider orientation="left" v-if="student_task.task_release.release_type===1"><span class="black-b">小组成员</span>
    </Divider>
    <ul class="newtask_detail-ul" v-if="student_task.task_release.release_type===1">
      <li v-for="(item,index) in student_task.team_members_info" :key="index">
        <img :src="item.icon"
          style="width:30px;height:30px;border-radius:50%;vertical-align:middle;margin-right:10px" />
        <span>
          <span>{{item.name}}</span>
          <span :class="item.is_team_leader===1?'blue-c':''">（{{item.is_team_leader===1?'组长':'组员'}}）</span>
        </span>
      </li>
    </ul>
    <div style="clear:both"></div>
    <Spin size="large" v-if="loading" fix></Spin>
  </div>
</template>
<script>

import { student_task_detail } from '@/api/student'
export default {
  props: {
    student_task_id: ''
  },

  data () {
    return {
      student_task: {
        submit_content: ' ',
        task: {},
        task_release: {}
      },
      info: '',
      loading: false
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
      student_task_detail(student_task_id).then(res => {
        _this.loading = false
        let data = res.data
        if (res.code === 200) {
          _this.info = data
          _this.student_task = data.student_task
        }
      })
    }
  },
  created () {
  },
  mounted () {
    this.getTaskInfo(this.student_task_id)
  }
}
</script>
<style lang="less">
</style>
