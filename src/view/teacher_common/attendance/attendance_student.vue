<template>
  <div style="background:#ffffff;padding:40px 0;flex:1">
    <div style="position:relative;width:100%;height:100%">
      <div class="ab-scroll">
        <div style="margin:0 auto;width:502px">
          <span style="font-size:16px;font-weight:bold" v-if="Object.keys(attendanceInfo).length!==0">
            {{attendanceInfo[0].year}}年&nbsp;{{attendanceInfo[0].semester===2?'上半年':'下半年'}}
          </span>
            <Table :data="attendanceInfo" width='600' :columns="columns" style="position:relative;width:504px"></Table>
        </div>
        <attendance-chart :option_data="option_data" style="margin:20px auto" v-if="Object.keys(attendanceInfo).length!==0"></attendance-chart>
      </div>
    </div>
    <Modal v-model="modal1" footer-hide>
      <attendanceDetail :tid="tid" :status="status" ref="attendanceDetail"></attendanceDetail>
    </Modal>
    <Spin v-show="loading" fix></Spin>
  </div>
</template>
<script>
import attendanceDetail from './attendance_detail'
import AttendanceChart from '../common/attendance/attendance_chart.vue'

export default {
  components: { attendanceDetail, AttendanceChart },
  computed: {
    option_data () {
      return [
        { name: '缺勤', value: (Object.keys(this.attendanceInfo).length !== 0) ? this.attendanceInfo[0].noarrived : 0 },
        { name: '迟到', value: (Object.keys(this.attendanceInfo).length !== 0) ? this.attendanceInfo[0].late : 0 },
        { name: '正常', value: (Object.keys(this.attendanceInfo).length !== 0) ? this.attendanceInfo[0].arrived : 0 },
        { name: '早退', value: (Object.keys(this.attendanceInfo).length !== 0) ? this.attendanceInfo[0].leave_early : 0 }
      ]
    },
    courseId () {
      return this.$store.state.user.courseData.teacher_course_id
    }
  },
  data () {
    return {
      attendanceInfo: [],
      modal1: false,
      loading: false,
      status: 0,
      tid: 0,
      columns: [
        {
          title: '应到',
          key: 'count',
          align: 'center',
          width: 99
        },
        {
          title: '正常',
          align: 'center',
          key: 'arrived',
          width: 99,
          render: (h, params) => {
            let row = params.row
            if (row.arrived === '0') {
              return (
                <span>{row.arrived}</span>
              )
            } else {
              return (
                <span style="color:blue;cursor:pointer" onClick={() => { this.show(1) }}>{row.arrived}</span>
              )
            }
          }
        },
        {
          title: '迟到',
          align: 'center',
          key: 'late',
          width: 99,
          render: (h, params) => {
            let row = params.row
            if (row.late === '0') {
              return (
                <span>{row.late}</span>
              )
            } else {
              return (
                <span style="color:red;cursor:pointer" onClick={() => { this.show(2) }}>{row.late}</span>
              )
            }
          }
        },
        {
          title: '早退',
          align: 'center',
          key: 'leave_early',
          width: 99,
          render: (h, params) => {
            let row = params.row
            if (row.leave_early === '0') {
              return (
                <span>{row.leave_early}</span>
              )
            } else {
              return (
                <span style="color:red;cursor:pointer" onClick={() => { this.show(3) }}>{row.leave_early}</span>
              )
            }
          }
        },
        {
          title: '缺勤',
          align: 'center',
          key: 'noarrived',
          render: (h, params) => {
            let row = params.row
            if (row.noarrived === '0') {
              return (
                <span>{row.noarrived}</span>
              )
            } else {
              return (
                <span style="color:red;cursor:pointer" onClick={() => { this.show(0) }}>{row.noarrived}</span>
              )
            }
          }
        }
      ]
    }
  },
  watch: {
    courseId (n, o) {
      this.getData()
    }
  },
  methods: {
    getData () {
      this.loading = true
      this.axios.request({
        url: '/index.php/Student/Attendance/student_attendance_total',
        method: 'get',
        params: {
          teacher_course_id: this.courseId
        }
      }).then(res => {
        if (res.code === 200) {
          if (res.data.list[0].count === 0) {
            this.attendanceInfo = []
          } else {
            this.attendanceInfo = res.data.list
          }
        }
        this.loading = false
      })
    },
    show (status) {
      this.status = status
      this.tid = this.courseId
      this.modal1 = true
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
