<template>
  <div class="m-attendanceDetail flex-contain">
    <mt-header title="考勤统计" style="border-bottom: 1px solid #E5E5E5">
      <router-link to="/attendance" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <div class="m-attendanceDetail-contain">
      <div class="m-attendanceDetail-contain-header flex-contain">
        <div class="m-attendanceDetail-name">{{course_name}}</div>
        <div class="m-attendanceDetail-info">
          <div>考勤次数：{{attendanceInfo.count}}</div>
          <div>应到次数：{{attendanceInfo.count}}</div>
        </div>
      </div>
      <div class="m-attendanceDetail-d">
        <div>
          <div>迟到次数</div>
          <div style="color:#49D056">{{attendanceInfo.late}}</div>
        </div>
        <div>
          <div>早退次数</div>
          <div style="color:#E77F23">{{attendanceInfo.leave_early}}</div>
        </div>
        <div>
          <div>缺勤次数</div>
          <div style="color:#8E8379">{{attendanceInfo.noarrived}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  data () {
    return {
      attendanceInfo: {}
    }
  },

  computed: {
    teacher_course_id () {
      return this.$route.query.teacher_course_id
    },
    course_name () {
      return this.$route.query.course_name
    }
  },
  methods: {
    getData () {
      this.axios.request({
        url: '/index.php/Student/Attendance/student_attendance_total',
        method: 'get',
        params: {
          teacher_course_id: this.teacher_course_id
        }
      }).then(res => {
        if (res.code === 200) {
          // console.log(res.data)
          // if (res.data.list[0].count === 0) {
          //   this.attendanceInfo = []
          // } else {
          this.attendanceInfo = res.data.list[0]
          // }
        }
      })
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
<style>
</style>
