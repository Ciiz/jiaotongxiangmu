<template>
  <div class="flex-contain">
    <div>
      <div class="m-correct-backBtn">
        <img src="@/assets/images/mobile_teacher/back.png" @click="back()"/>
      </div>
      <div class="m-correct-navbar">
        <mt-navbar v-model="correct_status">
          <mt-tab-item id="0">未批</mt-tab-item>
          <mt-tab-item id="1">已批</mt-tab-item>
        </mt-navbar>
      </div>
    </div>
    <div class="m-correct-contain hideScroll">
      <div v-for="(item,index) in tasklist" :key="index" class="m-correct-list-item" @click="showDetail(item.task_release_id,'task')">
        <div class="m-correct-list-item-title">{{item.task_name}}</div>
        <div>
          <span style="margin-right:0.4rem">{{item.course_name}}</span>
          <span>{{item.courseware_name}}</span>
        </div>
        <div>
          <span style="margin-right:0.4rem">{{item.class_name}}</span>
          <span>{{item.type===1?'课前':(item.type===2?'课中':'课后')}}任务</span>
        </div>
        <div>截止时间：{{moment(item.end_time * 1000).format('YYYY-MM-DD HH:mm:ss')}}</div>
      </div>
      <div v-for="(item,index) in homeworklist" :key="index" class="m-correct-list-item" @click="showDetail(item.homework_release_id,'homework')">
        <div class="m-correct-list-item-title">{{item.homework_name}}</div>
        <div>
          <span style="margin-right:0.4rem">{{item.course_name}}</span>
          <span>{{item.courseware_name}}</span>
        </div>
        <div>
          <span style="margin-right:0.4rem">{{item.class_name}}</span>
          <span>{{item.type===1?'课前':(item.type===2?'课中':'课后')}}作业</span>
        </div>
        <div>截止时间：{{moment(item.end_time * 1000).format('YYYY-MM-DD HH:mm:ss')}}</div>
      </div>
      <div v-for="(item,index) in examlist" :key="index" class="m-correct-list-item" @click="showDetail(item.exam_release_id,'exam')">
        <div class="m-correct-list-item-title">{{item.exam_name}}</div>
        <div>
          <span style="margin-right:0.4rem">{{item.course_name}}</span>
          <span>{{item.courseware_name}}</span>
        </div>
        <div>
          <span style="margin-right:0.4rem">{{item.class_name}}</span>
          <span>{{item.type===1?'课前':(item.type===2?'课中':'课后')}}测试</span>
        </div>
        <div>截止时间：{{moment(item.end_time * 1000).format('YYYY-MM-DD HH:mm:ss')}}</div>
      </div>
    </div>
  </div>
</template>
<script>

import { get_task_release_list, get_exam_release_list, get_homework_release_list } from '@/api/data'

export default {
  data () {
    return {
      correct_status: '0',
      teacher_course_id: '',
      tasklist: [],
      examlist: [],
      homeworklist: []
    }
  },
  computed: {

  },
  watch: {
    correct_status () {
      this.getData()
    }
  },
  methods: {
    getData () {
      get_task_release_list({
        page: 1,
        page_size: 10000,
        keyword: '',
        class_id: '',
        teacher_course_id: this.teacher_course_id,
        correct_status: this.correct_status
      }).then(res => {
        if (res.code === 200) {
          this.tasklist = res.data.list
        }
      })
      get_exam_release_list({
        page: 1,
        page_size: 10000,
        keyword: '',
        class_id: '',
        teacher_course_id: this.teacher_course_id,
        correct_status: this.correct_status
      }).then(res => {
        if (res.code === 200) {
          this.examlist = res.data.list
        }
      })
      get_homework_release_list({
        page: 1,
        page_size: 10000,
        keyword: '',
        class_id: '',
        teacher_course_id: this.teacher_course_id,
        correct_status: this.correct_status
      }).then(res => {
        if (res.code === 200) {
          this.homeworklist = res.data.list
        }
      })
    },
    back () {
      this.$router.push({ name: 'mobileUserCenter' })
    },
    showDetail (id, type) {
      this.$router.push({ name: 'mobileCorrectDetail', query: { id: id, type: type } })
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
