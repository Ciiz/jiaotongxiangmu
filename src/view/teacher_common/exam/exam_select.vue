<template>
  <div>
    <Form :label-width="100" :model="exam_release" :rules="rules" ref="exam_release"
      style="border-bottom:1px solid #ccc;">
      <FormItem label="课件上课时间">
        <Input v-model="class_begin_time" readonly disabled style="width: 200px"></Input>
      </FormItem>
      <FormItem label="测试">
        <Select v-model="sel" style="width: 200px" @on-change="changeExam()">
          <Option :value="item.course_id+'!'+item.batch" v-for="item in exam_list" :key="item.course_id">
            {{item.exam_name}}</Option>
        </Select>
      </FormItem>
      <FormItem label="发布时间" prop="start_time">
        <DatePicker :value="exam_release.start_time"
          @on-change="(fmt_date, date) => {exam_release.start_time = fmt_date}" type="datetime" placeholder="开始时间"
          style="width: 200px"></DatePicker>
      </FormItem>
      <FormItem label="结束时间" prop="end_time">
        <DatePicker :value="exam_release.end_time" @on-change="(fmt_date, date) => {exam_release.end_time = fmt_date}"
          type="datetime" placeholder="结束时间" style="width: 200px"></DatePicker>
      </FormItem>
    </Form>
    <div style="padding-top:10px;float:right">
      <Button type="primary" @click="submit">确定</Button>
    </div>
    <div style="clear:both"></div>
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
      sel: '',
      id: '',
      batch: '',
      exam_list: [],
      exam_release: {
        id: '',
        start_time: this.moment().format('YYYY-MM-DD HH:mm:ss'),
        end_time: this.moment().format('YYYY-MM-DD HH:mm:ss')
      },
      rules: {
        id: [
          { required: true, message: '测试不能为空', trigger: 'change' }
        ],
        start_time: [
          { required: true, message: '测试开始时间不能为空', trigger: 'blur' }
        ],
        end_time: [
          { required: true, message: '测试结束不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    courseId (n, o) {
      this.getData()
    },
    class_begin_time (n, o) {
      if (n !== 0) {
        this.exam_release.start_time = this.moment(this.class_begin_time).format('YYYY-MM-DD HH:mm:ss')
        this.exam_release.end_time = this.moment(this.class_begin_time).add(2, 'days').format('YYYY-MM-DD HH:mm:ss')
      }
    }
  },
  computed: {
    courseId () {
      return this.$store.state.user.courseData.id
    }
  },
  methods: {
    changeExam (item) {
      let a = this.sel.split('!')
      this.exam_release.id = a[0]
      this.batch = a[1]
    },
    submit () {
      this.$refs['exam_release'].validate(valid => {
        if (valid) {
          let { id, start_time, end_time } = this.exam_release
          this.axios.request({
            method: 'post',
            url: '/index.php/Teacher/Examination/select_exam_to_class',
            data: {
              id,
              type: this.type,
              courseware_id: this.courseware_id,
              start_time: Date.parse(start_time) / 1000,
              end_time: Date.parse(end_time) / 1000,
              timetable_id: this.timetable_id,
              batch: this.batch,
              exam_select_type: 1
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
        url: '/index.php/teacher/examination/get_exam_list',
        params: {
          page: 1,
          pagesize: 1000,
          course_id: this.courseId
        }
      }).then(res => {
        if (res.code === 200) {
          this.exam_list = res.data.question_list
        }
      })
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
