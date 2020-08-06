<template>
  <div class="m-taskInfo flex-contain">
    <mt-header :title="info.course_name+' '+info.course_type+info.type">
      <router-link :to="listType==='task'?'/taskIndex':'/homeworkExamIndex'" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <div class="m-taskInfo-middle hideScroll flex-contain">
      <div class="m-taskDetail">
        <div style="font-size:0.32rem;font-weight:bold;color:#000000">{{info.title}}</div>
        <div>
          <span>发布者：</span>
          <span>{{info.teacher}}</span>
          <button class="m-b-btn" style="margin-left:0.2rem" @click="question()">提问</button>
        </div>
        <div>
          <span>任务类型：</span>
          <span>{{info.release_type}}{{info.type}}</span>
        </div>
        <div v-if="listType==='task'">
          <span>我的角色：</span>
          <span>{{info.release_type==="个人"?('个人'+info.type):(is_team_leader===1?'组长':'组员')}}</span>
        </div>
        <div>
          <span>接收时间：</span>
          <span>{{moment(info.start_time * 1000).format('YYYY-MM-DD HH:mm')}}</span>
        </div>
        <div>
          <span>截止时间：</span>
          <span>{{moment(info.end_time * 1000).format('YYYY-MM-DD HH:mm')}}</span>
        </div>
        <div style="display:flex" class="m-taskInfo-member" v-if="info.release_type==='小组'&&listType==='task'">
          <div style="margin-right:0.4rem">
            <div style="font-size: 0.3rem;color: #212121">组长</div>
            <div>
              <div>
                <img :src="info.leader.icon"/>
              </div>
              <div>
                {{info.leader.name}}
              </div>
            </div>
          </div>
          <div style="flex:1">
            <div><Divider>组员</Divider></div>
            <div style="display:flex;flex-wrap:wrap">
              <div v-for="(item,index) in info.members" :key="index" style="margin:0 0.24rem">
                <div>
                  <img :src="item.icon"/>
                </div>
                <div>
                  {{item.name}}
                </div>
              </div>
            </div>
            <div><button class="m-g-btn" @click="discuss">小组讨论</button></div>
          </div>
        </div>
      </div>
      <div class="m-taskContent">
        <div style="color:#212121;margin-bottom:0.1rem">{{info.type}}描述：</div>
        <div v-html="info.content" style="word-break:break-all"></div>
      </div>
    </div>
    <div style="display:flex">
      <div style="flex:1" v-if="listType==='task'&&is_team_leader.toString()=='1'">
        <button class="m-w-btn-b" @click="showMembersAnwser">组员答案</button>
      </div>
      <div style="flex:1" v-if="info.release_type==='个人'">
        <button class="m-b-btn-b" v-if="info.submit_status===0" @click="toLink()">{{info.type}}作答</button>
        <button class="m-b-btn-b" v-if="info.submit_status===1" @click="toLink2()">查看评价及成绩</button>
      </div>
      <div style="flex:1" v-if="info.release_type==='小组'">
        <button class="m-b-btn-b" v-if="info.score_status===0||info.submit_status===0" @click="toLink()">{{info.type}}作答</button>
        <button class="m-b-btn-b" v-if="info.score_status===1&&is_team_leader===0" @click="toLink()">评组长</button>
        <button class="m-b-btn-b" v-if="info.score_status===1&&info.submit_status===1" @click="toLink2()">查看评价及成绩</button>
      </div>
    </div>
  </div>
</template>
<script>

import { Indicator } from 'mint-ui'
import { student_task_detail } from '@/api/student'
export default {
  data () {
    return {
      info: {
        score_status: '',
        submit_status: '',
        course_name: '',
        type: '',
        title: '',
        course_type: '',
        teacher: '',
        release_type: '',
        start_time: '',
        end_time: '',
        content: '',
        leader: {},
        members: [],
        is_team_leader: '',
        finish: ''
      },
      members: []
    }
  },
  computed: {
    listType () {
      return this.$route.query.type
    },
    id () {
      return this.$route.query.id
    },
    is_team_leader () {
      return this.$route.query.is_team_leader
    },
    teacher_id () {
      return this.$route.query.teacher_id
    }
  },
  methods: {
    getTaskInfo () { // 任务
      if (!this.id) return
      Indicator.open({
        text: '加载中...',
        spinnerType: 'fading-circle'
      })
      student_task_detail(this.id).then(res => {
        if (res.code === 200) {
          this.members = res.data.members
          let item = res.data.student_task
          this.getInfo(
            item.score_status,
            item.submit_status,
            item.course_name,
            '任务',
            item.task.task_name,
            item.task.type,
            item.teacher,
            item.task_release.start_time,
            item.task_release.end_time,
            item.task.content,
            item.task_release.release_type,
            item.team_members_info,
            item.task.id,
            item.task_release.id,
            item.team_id,
            item.courseware_name
          )
        }
      })
    },
    getStudentHomework () { // 作业
      if (!this.id) return
      Indicator.open({
        text: '加载中...',
        spinnerType: 'fading-circle'
      })
      this.axios
        .request({
          method: 'get',
          url: `/index.php/Student/Homework/getStudentHomework`,
          params: {
            student_homework_id: this.id
          }
        })
        .then(res => {
          if (res.code === 200) {
            let item = res.data.student_homework
            this.getInfo(
              item.score_status,
              item.submit_status,
              item.homework.course_name,
              '作业',
              item.homework.homework_name,
              item.homework.type,
              item.homework.teacher,
              item.homework.start_time,
              item.homework.end_time,
              item.homework.homework_content
            )
          }
        })
    },
    getInfo (score_status, submit_status, course_name, type, title, course_type, teacher, start_time, end_time, content, release_type, team_members_info, task_id, task_release_id, team_id, courseware_name) {
      this.info.score_status = score_status
      this.info.submit_status = submit_status
      this.info.course_name = course_name
      this.info.type = type
      this.info.title = title
      this.info.course_type = course_type === 1 ? '课前' : (course_type === 2 ? '课中' : '课后')
      this.info.teacher = teacher
      this.info.start_time = start_time
      this.info.end_time = end_time
      this.info.content = content
      this.info.release_type = release_type === 1 ? '小组' : '个人'
      if (release_type === 1) {
        for (let i = 0; i < team_members_info.length; i++) {
          if (team_members_info[i].is_team_leader === 1) {
            this.info.leader = team_members_info[i]
          } else {
            this.info.members.push(team_members_info[i])
          }
        }
      }
      this.info.task_id = task_id
      this.info.task_release_id = task_release_id
      this.info.team_id = team_id
      this.info.courseware_name = courseware_name
      Indicator.close()
    },
    toLink () {
      if (this.info.type === '任务') {
        this.$router.push({ name: 'taskAnswer', query: { id: this.id, is_team_leader: this.is_team_leader } })
      }
    },
    toLink2 () {
      if (this.info.type === '任务') {
        this.$router.push({ name: 'taskEvaluate', query: { id: this.id, is_team_leader: this.is_team_leader } })
      }
    },
    showMembersAnwser () {
      this.$router.push({ name: 'membersAnswer', query: { members: this.members } })
    },
    question () { // 提问
      let a = 'task_' + this.teacher_id + '_' + this.$store.state.user.userInfo.userId
      this.axios.request({
        method: 'post',
        url: '/index.php/Student/Task/question_send',
        data: {
          target_id: this.teacher_id,
          content: this.info.teacher + '老师你好',
          statustype: 1
        }
      }).then(res => {
        if (res.code === 200) {
          let item = {
            userInfo: { name: this.info.teacher },
            taskgroup: a,
            table_type: 2
          }
          this.$router.push({ name: 'discuss', query: { chatList: item } })
        }
      })
    },
    discuss () { // 小组讨论
      let tg = 'task' + this.info.task_id + '_tr_' + this.info.task_release_id + '_team' + this.info.team_id
      this.axios.request({
        url: '/index.php/Student/StudentTask/task_send',
        method: 'post',
        data: {
          taskgroup: tg,
          student_task_id: this.id,
          content: '发起讨论，相关课件：' + this.info.courseware_name
        }
      }).then(res => {
        if (res.code === 200) {
          let item = {
            taskgroup: tg,
            table_type: 1,
            task_name: this.info.title,
            student_task_id: this.id
          }
          this.$router.push({ name: 'discuss', query: { chatList: item } })
        }
      })
    }
  },
  mounted () {
    if (this.listType === 'task') {
      this.getTaskInfo()
    } else if (this.listType === 'homework') {
      this.getStudentHomework()
    }
  }
}
</script>
