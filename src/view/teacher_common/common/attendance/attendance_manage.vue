<template>
<div>
  <Row v-if="hasAttendance">
    <Col :span="12">
        <div>
          <div style="margin-bottom: 10px;">
            <h2>{{course_name}}</h2>
            <Button :type="attend_status ? 'error' : 'success'"  @click="update_attendance_status(attend_status ? 0 : 1)">{{attend_status ? '关闭考勤' : '打开考勤'}}</Button>
            <Button  type="primary" icon="md-qr-scanner" @click="generate_qrcode">二维码</Button>
            <Button  type="primary" icon="ios-navigate-outline" @click="set_location">设置位置</Button>
          </div>
          <div>
            <RadioGroup v-model="leave_early_status" @on-change="handleLeaveEarlyStatusChange">
              <Radio :label="0">正常考勤</Radio>
              <Radio :label="1">早退考勤</Radio>
            </RadioGroup>
            <Button v-show="leave_early_status === 1" type="primary" size="small" @click="handleUpdateLeaveEarly">处理早退考勤数据</Button>
            <Alert style="margin-top: 10px;">早退考勤：必须先进行正常考勤，在下课或课中的时候再切换早退考勤。考勤完之后，点击 -处理考勤数据 - 按钮完成早退考勤。</Alert>
          </div>
          <div style="margin:10px 0px;">
            <span v-for="(item,index) in attendance_list" :key="index" class="record-list">
              {{item.class_name}}
              <Tag :color="item.status? 'green' : 'red'">{{item.status ? '考勤中':'未开启'}}</Tag>
            </span>
          </div>
        <div>
          <span class="attent-count">应到: {{expected}}</span>
          <span class="attent-count">实到: {{arrived}}</span>
          <span class="attent-count attend-success">正常: {{normal}}</span>
          <span class="attent-count attend-late">迟到: {{late}}</span>
          <span class="attent-count attend-obsent">缺勤: {{obsent}}</span>
          <span class="attent-count attend-leave-early">早退: {{leave_early}}</span>
        </div>
        <Button type="warning" size="small" @click="resetAttendance">重置考勤数据</Button>
        </div>
      </Col>

      <Col :span="12">
        <attendance-chart :option_data="option_data"></attendance-chart>
      </Col>

    </Row>

    <div class="attend-record-container">
      <h3>考勤记录</h3>
      <div v-for="record in attendance_records" :key="record.student_id" class="record-item">
        <Poptip title="" content="content" trigger="hover">
          <Avatar :src="record.icon" />
          <p :class="{'attend-success': record.status === 1, 'attend-late': record.status ===2, 'attend-leave-early': record.status === 3 ,'attend-obsent': record.status === 0 }">{{record.name}}</p>
          <div slot="content">
            <RadioGroup v-model="record.status" @on-change="(val) => {handleRecordStatusChange(val,record.id)}">
              <Radio :label="0">缺勤</Radio>
              <Radio :label="1">已到</Radio>
              <Radio :label="2">迟到</Radio>
              <Radio :label="3">早退</Radio>
            </RadioGroup>
          </div>
        </Poptip>
      </div>
    </div>
    <Spin size="large" v-if="loading" fix></Spin>
  <Modal v-model="modal" footer-hide :title="title" :width="modal_width" @on-visible-change="handleVisiableChange">
    <Position  :lng.sync="lng" :lat.sync="lat" :distance_range.sync="distance_range" v-if="target === 'position'" @position-change="handlePositionChange"></Position>
    <div id="qrcode3" style="display: flex;justify-content: center;" v-show="target === 'qrcode3'"></div>
  </Modal>

</div>
</template>
<script>
import { generate_attendance, update_attendance, update_attend_record, handle_update_early_leave, reset_attendance } from '@/api/data'
import QRCode from 'qrcodejs2'
import live from '@/view/common/live'
import modal_mixin from '@/view/mixins/modal_mixin'
import Position from './position.vue'
import AttendanceChart from './attendance_chart.vue'
export default {
  mixins: [live, modal_mixin],
  components: {
    Position, AttendanceChart
  },
  props: {
    year: '',
    semester: '',
    week: '',
    day: '',
    class_no: '',
    teacher_course_id: '',
    course_name: '',
    class_ids: {
      type: Array,
      default: () => { return [] }
    }
  },
  data () {
    return {
      loading: false,
      cur_teacher_course_id: '',
      attendance_str: '', // 当前开启考勤的考勤记录： 格式： attendance_id1,id2
      attendance_list: [],
      attendance_records: [],
      interval_id: null,
      lng: '',
      lat: '',
      leave_early_status: false, // 是否是早退考勤
      distance_range: 0
    }
  },
  watch: {
    teacher_course_id (n, o) {
      this.teacher_course_id && this.gererateAttendance()
    }
  },
  computed: {
    expected () {
      return this.attendance_records.length
    },
    arrived () {
      return this.attendance_records.filter(item => {
        return (item.status === 1 || item.status === 2)
      }).length
    },
    leave_early () {
      return this.attendance_records.filter(item => {
        return item.status === 3
      }).length
    },
    late () {
      return this.attendance_records.filter(item => {
        return item.status === 2
      }).length
    },
    obsent () {
      return this.expected - this.normal - this.late - this.leave_early
    },
    normal () {
      return this.attendance_records.filter(item => {
        return item.status === 1
      }).length
    },
    attendance_ids () {
      return this.attendance_list.map(item => { return item.id })
    },
    hasAttendance () {
      return this.attendance_list.length > 0
    },
    attend_status () {
      let index = this.attendance_list.findIndex(item => { return item.status === 1 })
      return index !== -1
    },
    option_data () {
      return [
        { name: '缺勤', value: this.obsent },
        { name: '迟到', value: this.late },
        { name: '正常', value: this.normal },
        { name: '早退', value: this.leave_early }
      ]
    }
  },
  methods: {
    gererateAttendance () {
      this.loading = true
      generate_attendance({
        teacher_course_id: this.teacher_course_id,
        class_ids: this.class_ids,
        year: this.year,
        semester: this.semester,
        week: this.week,
        day: this.day,
        class_no: this.class_no
      }).then(res => {
        if (res.code === 200) {
          this.attendance_list = res.data.attendance_list
          this.lng = this.attendance_list[0].lng
          this.lat = this.attendance_list[0].lat
          this.distance_range = this.attendance_list[0].distance_range
          this.attendance_records = res.data.attendance_records.sort((a, b) => { return b.status - a.status })
          this.leave_early_status = res.data.leave_early_status
          this.loading = false
        }
      })
    },
    generate_qrcode () {
      // 生成二维码,  5秒刷新一次
      this.open('qrcode3', '', '考勤码', 650)
      this.get_qr_code()
      // this.interval_id = setInterval(() => {
      //   this.get_qr_code()
      // }, 5000)
    },
    get_qr_code () {
      let domain = window.location.protocol + '//' + window.location.host
      let attendance_ids = this.attendance_ids.sort().join(',')
      let expired_at = parseInt(((new Date()).getTime() + 10000) / 1000)
      let url = `${domain}${this.baseUrl}/student/attendance/qrcode_attend?attendance_ids=${attendance_ids}&expired_at=${expired_at}`
      document.getElementById('qrcode').innerHTML = ''
      this.qrcode(url)
    },
    qrcode (url) {
      // eslint-disable-next-line no-new
      new QRCode('qrcode3', {
        width: 600,
        height: 600,
        text: url, // 二维码地址
        colorDark: '#000',
        colorLight: '#fff'
      })
    },
    update_attendance_status (status) {
      let attendance_ids = this.attendance_list.map(item => { return item.id })
      update_attendance({ id: attendance_ids, update_data: { status: status, leave_early_status: this.leave_early_status } }).then(res => {
        if (res.code === 200) {
          this.$Message.success('操作成功！')
          this.attendance_list.forEach(item => {
            item.status = status
          })
        }
      })
    },
    update_attend_record (data) {
      if (this.attendance_ids.indexOf(data.attendance_id) !== -1) {
        let index = this.attendance_records.findIndex(item => {
          return item.student_id === data.student_id
        })
        this.attendance_records[index].status = data.status
      }
    },
    handleOnMessage (data) {
      let type = data.type || ''
      switch (type) {
        case 'init':
          this.bindUser(data.client_id)
          break
        case 'attendance':
          this.update_attend_record(data)
          break
        default: {
        }
      }
    },
    handleVisiableChange (visiable) {
      if (!visiable && this.target === 'qrcode3') {
        clearInterval(this.interval_id)
      }
    },
    handleRecordStatusChange (status, record_id) {
      update_attend_record({ status, id: record_id }).then(res => {
        if (res.code === 200) {
          this.$Message.success(res.message)
        }
      })
    },
    set_location () {
      this.open('position', '', '上课地点')
    },
    handlePositionChange (lng, lat, distance_range) {
      update_attendance({ id: this.attendance_ids, update_data: { lng, lat, distance_range } }).then(res => {
        if (res.code === 200) {
          // this.$Message.success('设置成功!')
        }
      })
    },
    handleLeaveEarlyStatusChange (status) {
      update_attendance({ id: this.attendance_ids, update_data: { leave_early_status: status } }).then(res => {
        if (res.code === 200) {
          this.$Message.success('设置成功!')
        }
      })
    },
    handleUpdateLeaveEarly () {
      let _this = this
      this.$Modal.confirm({
        title: '提示',
        content: '注意： 请确定在座学生考勤完毕，再处理早退考勤数据！',
        onOk: function () {
          handle_update_early_leave(_this.attendance_ids).then(res => {
            if (res.code === 200) {
              _this.$Message.success(res.message)
              _this.gererateAttendance()
            }
          })
        }
      })
    },
    resetAttendance () {
      let _this = this
      this.$Modal.confirm({
        title: '警告',
        content: '将当前考勤重置为正常考勤, 学生考勤记录重置为缺勤!',
        onOk: function () {
          reset_attendance(_this.attendance_ids).then(res => {
            if (res.code === 200) {
              _this.$Message.success(res.message)
              _this.gererateAttendance()
            }
          })
        }
      })
    }
  },
  mounted () {
    setTimeout(() => {
      this.teacher_course_id && this.gererateAttendance()
    }, 200)
    this.initChat()
  },
  beforeDestroy () {
    clearInterval(this.interval_id)
  }
}
</script>
<style lang="less" scoped>
.record-list{
  margin: 10px;
}
.attent-count{
  margin: 10px;
  font-size: 16px;
  font-weight: bold;
}

</style>
