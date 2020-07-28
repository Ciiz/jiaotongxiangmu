<template>
    <Form ref="formValidate" :model="formValidate"  :label-width="120" class="max-height">
      <FormItem label="课程名称"  required >
        <div>{{teacher_course_name}}</div>
    </FormItem>
    <FormItem label="课件名称"  required>
      {{coursewarename}}
    </FormItem>
    <FormItem label="作业标题"  required>
      <!-- <Input v-model="formValidate.name" placeholder="输入作业名称" style="width:200px;" :maxlength="200"></Input> -->
      {{formValidate.name}}
    </FormItem>
    <FormItem label="课件上课时间" required>
      {{class_begin_time}}
    </FormItem>
    <!-- <FormItem label="作业起止时间"  v-if="$route.query.click_type !== 'course'"  required>
    </FormItem> -->
    <FormItem label="作业内容"  required>
        <!-- <editor v-model="formValidate.desc" :value="formValidate.desc" is_init='true'></editor> -->
        <div v-html="formValidate.desc"></div>
    </FormItem>
    </Form>
</template>
<script>
import editor from '@/components/editor'
export default {
  props: ['evaid', 'click_type', 'isinfo', 'timetable_id'],
  components: { editor },
  data () {
    return {
      class_begin_time: 0, // 课表时间
      teacher_course_name: '',
      formValidate: {
        desc: '',
        name: ''
      },
      coursewarename: ''
    }
  },
  created () {
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
      if (this.evaid === 'add') {
        this.axios.request({
          method: 'post',
          url: '/index.php/Teacher/Homework/info',
          params: {
            teacher_course_id,
            action_type: 1,
            timetable_id: this.$route.query.timetable_id
          }
        }).then(res => {
          let resdata = res.data.courseware_list
          let id = this.$route.query.courseware_id === undefined ? this.$route.query.course_info_id : this.$route.query.courseware_id
          for (let item in resdata) {
            if (Number(item) === id) {
              this.coursewarename = resdata[item]
            }
          }
          this.teacher_course_name = res.data.teacher_course_name
        })
      } else if (isNaN(this.evaid) !== true) {
        this.axios.request({
          method: 'post',
          url: '/index.php/Teacher/Homework/info',
          params: {
            id: this.evaid,
            teacher_course_id,
            action_type: 2,
            timetable_id: this.$route.query.timetable_id === undefined ? this.timetable_id : this.$route.query.timetable_id
          }
        }).then(res => {
          let resdata = res.data.courseware_list
          for (let item in resdata) {
            this.coursewarename = resdata[item]
          }
          this.teacher_course_name = res.data.teacher_course_name
          this.formValidate.name = res.data.homework_info.homework_name
          this.formValidate.desc = res.data.homework_info.homework_content
        })
      } else {
        this.axios.request({
          method: 'post',
          url: '/index.php/Teacher/Homework/info',
          params: {
            id: this.evaid.split('&')[0],
            teacher_course_id,
            action_type: 3,
            timetable_id: this.$route.query.timetable_id === undefined ? this.timetable_id : this.$route.query.timetable_id
          }
        }).then(res => {
          let resdata = res.data.courseware_list
          for (let item in resdata) {
            this.coursewarename = resdata[item]
          }
          this.teacher_course_name = res.data.teacher_course_name
          this.formValidate.name = res.data.homework_info.homework_name
          this.formValidate.desc = res.data.homework_info.homework_content
        })
      }
    }
  }
}

</script>
