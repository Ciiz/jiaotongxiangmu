<template>
  <Row style="height:100%;display:flex;flex-direction:column">
    <div class="myCourse-contain-header">
      <ul>
        <router-link active-class="mycourse-tab" :to="{path: '/teachingSystem/examine/course_score'}"
          @click.native="getName">课程成绩</router-link>
        <router-link active-class="mycourse-tab" :to="{path: '/teachingSystem/examine/attendance_student'}"
          @click.native="getName">查看考勤</router-link>
        <router-link active-class="mycourse-tab" :to="{path: '/teachingSystem/examine/task'}" @click.native="getName">任务
        </router-link>
        <router-link active-class="mycourse-tab" :to="{path: '/teachingSystem/examine/homework'}"
          @click.native="getName">作业</router-link>
        <router-link active-class="mycourse-tab" :to="{path: '/teachingSystem/examine/exam'}" @click.native="getName">测试
        </router-link>
      </ul>
      <div style="clear:both"></div>
    </div>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>

    <!-- <Modal v-model="modal" footer-hide full-screen :title="title" width="1000">
    <Task :student_course_id="student_course_id" v-if="target==='task'"></Task>
    <Homework :student_course_id="student_course_id" v-if="target==='homework'"></Homework>
    <Exam :student_course_id="student_course_id" v-if="target==='exam'"></Exam>
    <CourseScore  :student_course_id="student_course_id" v-if="target==='course_score'"></CourseScore>
  </Modal> -->
    <!-- <Modal v-model="modal1" footer-hide full-screen :title="title" width="554">
    <attendanceStudent :teacher_course_id="student_course_id" v-if="target==='attendanceStudent'"></attendanceStudent>
  </Modal> -->
  </Row>
</template>

<script>
// import Task from './component/task'
// import Homework from './component/homework'
// import Exam from './component/exam'
// import CourseScore from './component/course_score'
// import attendanceStudent from '@/view/teacher_common/attendance/attendance_student'
export default {
  components: {
    // Task,
    // Homework,
    // Exam,
    // CourseScore,
    // attendanceStudent
  },
  props: {
    type: ''
  },
  data () {
    return {
      keyword: ''
    }
  },
  watch: {
    '$route' (to, from) {
    }
  },
  methods: {
    getName (e) {
      this.$emit('openSlider')
    }
  },
  created () {
  }

}
</script>

<style lang="less">
</style>
