<template>
  <div>
    <div v-if="desc.length !== 0">
      <div v-for="(course,index) in desc" :key="index" @click="changeTimetable(course)">
        <h4 >课程:{{course.course_name}}</h4>
        <p>{{course.address}}</p>
        <p>{{course.class_name}}</p>
        <div v-for="(courseware,index1) in course.coursewares" :key="index1">
          <p>{{courseware.sort}}: {{courseware.courseware_name}}</p>
        </div>
        <Tag v-if="course.cur_timetable">当前课时安排</Tag>
      </div>
    </div>
    <div v-else>
      <p>&nbsp;<br>&nbsp;</p>
    </div>
  </div>
</template>
<script>
import { save_timetable } from '@/api/data'
export default {
  name: 'describe',
  props: {
    teacher_course_id: '',
    timetable_id: '',
    desc: {
      type: Array,
      default: () => {
        return []
      }
    },
    cur_timetable_list: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {

    }
  },
  methods: {
    changeTimetable (course) {
      // if(){
      // TODO:取消操作
      // }
      let data = []
      let index = this.cur_timetable_list.findIndex((val) => {
        return (val.week === course.week && val.day === course.day && val.class === course.class_no)
      })
      if (index !== -1) { // 取消

      } else { // 新增

      }
      console.log(data)
      save_timetable({
        timetable_id: this.timetable_id,
        class_no: course.class_no,
        year: course.year,
        semester: course.semester,
        week: course.week,
        day: course.day
      }).then(res => {
        if (res.code === 200) {
          this.$Message.success(res.message)
          this.$emit('success')
        }
      })
    }
  }
}

</script>
