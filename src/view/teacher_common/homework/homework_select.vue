<template>
  <div class="modal-content-default">
    <Form :label-width="100" :model="homework_release" :rules="rules" ref="homework_release">
      <FormItem label="课件上课时间">
        <Input v-model="class_begin_time" readonly disabled style="width: 200px"></Input>
      </FormItem>
      <FormItem label="作业">
        <Select v-model="homework_release.id" style="width: 200px">
          <Option :value="item.id" v-for="item in homework_list" :key="item.id">{{item.homework_name}}</Option>
        </Select>
      </FormItem>
      <FormItem label="发布时间" prop="start_time">
        <DatePicker :value="homework_release.start_time" transfer
          @on-change="(fmt_date, date) => {homework_release.start_time = fmt_date}" type="datetime" placeholder="开始时间"
          style="width: 200px"></DatePicker>
      </FormItem>
      <FormItem label="结束时间" prop="end_time">
        <DatePicker :value="homework_release.end_time" transfer
          @on-change="(fmt_date, date) => {homework_release.end_time = fmt_date}" type="datetime" placeholder="结束时间"
          style="width: 200px"></DatePicker>
      </FormItem>
    </Form>
    <div class="modal-footer">
      <Button type="primary" @click="submit">确定</Button>
    </div>
  </div>
</template>
<script>
import class_begin from '@/view/mixins/class_begin'
export default {
  props: {
    courseware_id: '',
    timetable_id: '',
    type: ''
  },
  mixins: [class_begin],
  data () {
    return {
      id: '',
      homework_list: [],
      homework_release: {
        id: '',
        start_time: this.moment().format('YYYY-MM-DD HH:mm:ss'),
        end_time: this.moment().format('YYYY-MM-DD HH:mm:ss')
      },
      rules: {
        id: [
          { required: true, message: '作业不能为空', trigger: 'change' }
        ],
        start_time: [
          { required: true, message: '作业开始时间不能为空', trigger: 'blur' }
        ],
        end_time: [
          { required: true, message: '作业结束不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    refreshFlag (n, o) {
      this.getData()
    },
    class_begin_time (n, o) {
      if (n !== 0) {
        this.homework_release.start_time = this.moment(this.class_begin_time).format('YYYY-MM-DD HH:mm:ss')
        this.homework_release.end_time = this.moment(this.class_begin_time).add(2, 'days').format('YYYY-MM-DD HH:mm:ss')
      }
    }
  },
  computed: {
    refreshFlag () {
      return this.courseware_id + this.timetable_id + this.type
    }
  },
  methods: {
    submit () {
      this.$refs['homework_release'].validate(valid => {
        if (valid) {
          let { id, start_time, end_time } = this.homework_release
          this.axios.request({
            method: 'post',
            url: '/index.php/Teacher/Homework/select_homework_to_class',
            data: {
              id,
              type: this.type,
              days: '',
              start_time: Date.parse(start_time) / 1000,
              end_time: Date.parse(end_time) / 1000,
              timetable_id: this.timetable_id
            }
          }).then(res => {
            if (res.code === 200) {
              this.$emit('success')
            }
          })
        } else {
          this.$Message.error('请检查填写信息')
        }
      })
    },
    getData () {
      this.axios.request({
        method: 'get',
        url: '/index.php/Teacher/Homework/index',
        params: {
          type: this.type,
          courseware_id: this.courseware_id,
          release: 1,
          timetable_id: this.timetable_id,
          page: 0
        }
      }).then(res => {
        if (res.code === 200) {
          this.homework_list = res.data.homework_list
        }
      })
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
