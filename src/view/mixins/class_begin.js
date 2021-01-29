export default {
  data () {
    return {
      class_begin_time: 0
    }
  },
  methods: {
    getClassBeginTime (timetable_id) {
      this.axios.request({
        method: 'post',
        url: '/index.php/Teacher/TimetableTime/class_begin',
        data: {
          timetable_id
        }
      }).then(res => {
        console.log(res);
        if (res.code === 200) {
          let time = res.data.time
          this.class_begin_time = this.moment(time * 1000).format('YYYY-MM-DD')
        }
      })
    }
  },
  mounted () {
    this.timetable_id && this.getClassBeginTime(this.timetable_id)
  }
}
// 打开窗口的公用方法
