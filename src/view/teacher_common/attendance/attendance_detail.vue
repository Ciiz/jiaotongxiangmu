<template>
  <div>
    <h2>
      <span v-if="status===0">缺勤</span>
      <span v-if="status===1">正常</span>
      <span v-if="status===2">迟到</span>
      <span v-if="status===3">早退</span>
      <Span>记录</Span>
    </h2>
    <div class="contain">
      <div v-for="(item,index) in detailList" :key="index" style="margin:5px 0;font-size:14px">
        {{item.year}}年&nbsp;{{item.semester===2?'上半年':'下半年'}}&nbsp;第{{item.week}}周&nbsp;星期{{item.day}}
      </div>
    </div>
    <Spin v-show="loading" fix></Spin>
  </div>
</template>
<script>
export default {
  props: ['tid', 'status'],
  watch: {
    tid (n) {
      this.t_id = n
      this.getData()
    },
    status (n) {
      this.status = n
      this.getData()
    }
  },
  data () {
    return {
      detailList: [],
      loading: false
    }
  },
  methods: {
    getData () {
      this.loading = true
      this.axios.request({
        url: '/index.php/Student/Attendance/student_attendance_record_total',
        method: 'get',
        params: {
          teacher_course_id: this.t_id,
          record_status: this.status
        }
      }).then(res => {
        if (res.code === 200) {
          this.detailList = res.data.list
        }
        this.loading = false
      })
    }
  },
  mounted () {
  }
}
</script>
<style>
  .contain{
    margin-top: 10px;
    border: 1px solid rgb(153, 153, 153);
    padding: 10px 20px;
    border-radius: 10px;
    min-height: 200px
  }
</style>
