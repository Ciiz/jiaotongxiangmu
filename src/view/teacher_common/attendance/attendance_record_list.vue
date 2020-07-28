<template>
<div class="modal-content">
    <div class="attend-record-container">
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
    <Spin fix v-if="loading"></Spin>
</div>
</template>

<script>
import { get_attendance_records, update_attend_record } from '@/api/data'
export default {
  props: {
    attendance_id: ''
  },
  data () {
    return {
      attendance_records: [],
      loading: false
    }
  },
  watch: {
    attendance_id (n, o) {
      this.getData()
    }
  },
  methods: {
    getData () {
      this.loading = true
      get_attendance_records(this.attendance_id).then(res => {
        if (res.code === 200) {
          this.attendance_records = res.data.list
        }
        this.loading = false
      })
    },
    handleRecordStatusChange (status, record_id) {
      update_attend_record({ status, id: record_id }).then(res => {
        if (res.code === 200) {
          this.$Message.success(res.message)
        }
      })
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
<style lang="less" scoped>
</style>
