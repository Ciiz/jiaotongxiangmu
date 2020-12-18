<template>
  <div class="modal-content">
    <div>
      <AttendanceManage v-if="teacher_course_id" :teacher_course_id="teacher_course_id" :class_ids="class_ids"
        :course_name="course_name" :year="year" :semester="semester" :week="week" :day="day" :class_no="class_no"
        :group='group'>
      </AttendanceManage>
    </div>
  </div>
</template>
<script>
import AttendanceManage from './attendance_manage.vue'
export default {
  components: {
    AttendanceManage
  },
  props: {
    group: "",
    year: '',
    semester: {
      type: Number,
      default: 1
    },
    teacher_course_list: '',
    class_ids: '',
    teacher_course_id: ''
  },
  data () {
    return {
      week: '',
      day: '',
      class_no: '',
      course_name: ''
    }
  },
  methods: {
    start_attend (item) {
      console.log(this.teacher_course_list);
      this.week = this.teacher_course_list.week
      this.day = this.teacher_course_list.day
      this.class_no = this.teacher_course_list.class
      this.course_name = this.teacher_course_list.course_name
    }
  },
  mounted () {
    this.start_attend()
  },
  beforeDestroy () {
  }
}
</script>
<style lang="less" >
.record-list {
  margin: 10px;
}
.attent-count {
  margin: 10px;
}
</style>
