<template>
  <Form ref="formValidate" :model="formValidate"  :label-width="130">
    <FormItem label="课程名称"  required>
      <div>{{teacher_course_name}}</div>
    </FormItem>
    <FormItem label="课件名称"  required>
      <div>{{formValidate.coursewarename}}</div>
    </FormItem>
    <FormItem label="任务名称"  required>
      {{formValidate.name}}
      <!-- <Input v-model="formValidate.name" placeholder="输入任务名称" style="width:20vw;" :maxlength="200" /> -->
    </FormItem>
    <FormItem label="课件上课时间"  required>
      {{class_begin_time}}
    </FormItem>
    <FormItem label="任务持续时间"  v-if="click_type !== 'info' && $route.query.click_type !== 'course' && isinfo !== 'true'"  required>
      <Select v-if="tasktype === 1" v-model="formValidate.release_time" placeholder="选择提前发布天数" class="teacherSelect" style="width:20vw;">
        <Option  value="3">3</Option>
        <Option  value="4">4</Option>
        <Option  value="5">5</Option>
      </Select>
      <!-- <addtime v-else :starttime="class_begin_time" :getData="sendData" @start_time='start_time' @end_time='end_time'></addtime> -->
    </FormItem>
    <FormItem label="任务内容"  required>
      <div v-html="formValidate.name"></div>
      <!-- <Editor v-model="formValidate.desc" is_init='true' :height="400" > </Editor> -->
    </FormItem>
  </Form>
</template>
<script>
export default {
  props: ['rowid', 'tasktype', 'click_type', 'isinfo', 'timetable_id'],
  data () {
    return {
      teacher_course_name: '',
      class_begin_time: 0,
      taskid: 0, // 接收rowid...任务id
      type: 0, // 任务类型，1课前，2课中，3课后
      formValidate: {
        name: '', // 任务名称输入框绑定
        video1: '', // 当前选择的课件名称
        coursewarelist: [], // 课件列表
        desc: '', // 任务内容
        coursewarename: '',
        release_time: ''
      }
    }
  },
  created () {
    if (this.rowid !== 'add') {
      this.taskid = this.rowid
    }
    this.getInfo(this.$route.query.teacher_course_id)
  },
  methods: {
    getInfo (teacher_course_id) {
      this.axios.request({
        method: 'post',
        url: '/index.php/Teacher/TimetableTime/class_begin',
        data: {
          timetable_id: this.$route.query.timetable_id === undefined ? this.timetable_id : this.$route.query.timetable_id
        }
      }).then(res => {
        if (res.code === 200) {
          let time = res.data.time
          this.startTime = time
          this.class_begin_time = this.moment(time * 1000).format('YYYY-MM-DD')
        }
      })
      if (this.rowid === 'add') { // 新增任务
        this.axios.request({
          method: 'get',
          url: '/index.php/Teacher/Task/info',
          params: {
            teacher_course_id,
            action_type: 1,
            timetable_id: this.$route.query.timetable_id
          }
        }).then(res => {
          if (res.code === 200) {
            this.teacher_course_name = res.data.teacher_course_name
            let resdata = res.data.courseware_list
            let id = this.$route.query.courseware_id === undefined ? this.$route.query.course_info_id : this.$route.query.courseware_id
            for (let item in resdata) {
              if (Number(item) === id) {
                this.formValidate.coursewarename = resdata[item]
              }
            }
          }
        })
      } else if (isNaN(this.rowid) !== true) { // 编辑任务
        this.axios.request({
          method: 'get',
          url: '/index.php/Teacher/Task/info',
          params: {
            id: this.rowid,
            teacher_course_id,
            action_type: 2,
            timetable_id: this.$route.query.timetable_id === undefined ? this.timetable_id : this.$route.query.timetable_id
          }
        }).then(res => {
          let resdata = res.data.task_info
          res.data.type = this.tasktype
          if (this.tasktype === 1) {
            this.formValidate.release_time = resdata.days.toString()
          } else {
            this.startTime = resdata.start_time
            this.endTime = resdata.end_time
          }
          this.formValidate.name = resdata.task_name
          this.formValidate.desc = resdata.content
          this.teacher_course_name = res.data.teacher_course_name
          let data = res.data.courseware_list
          for (let item in data) {
            this.formValidate.coursewarelist.push({ value: item, label: data[item] })
            this.formValidate.coursewarename = data[item]
          }
          this.formValidate.video1 = resdata.courseware_id.toString()
        })
      } else {
        this.axios.request({
          method: 'get',
          url: '/index.php/Teacher/Task/info',
          params: {
            id: this.rowid.split('&')[0],
            teacher_course_id,
            action_type: 3,
            timetable_id: this.$route.query.timetable_id === undefined ? this.timetable_id : this.$route.query.timetable_id
          }
        }).then(res => {
          let resdata = res.data.task_info
          res.data.type = this.tasktype
          this.formValidate.name = resdata.task_name
          this.formValidate.desc = resdata.content
          this.teacher_course_name = res.data.teacher_course_name
          if (this.tasktype === 1) {
            this.formValidate.release_time = resdata.days.toString()
          } else {
          }
          let data = res.data.courseware_list
          for (let item in data) {
            this.formValidate.coursewarelist.push({ value: item, label: data[item] })
            this.formValidate.coursewarename = data[item]
          }
          this.formValidate.video1 = resdata.courseware_id.toString()
        })
      }
    }
  }
}
</script>
