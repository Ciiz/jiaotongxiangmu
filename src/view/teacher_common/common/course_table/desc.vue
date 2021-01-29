<template>
  <div>
    <div v-if="desc.length !== 0" @click="attend(desc)">
      <div v-for="(course,index) in desc" :key="index">
        <h4>{{course.course_name}}</h4>
        <p>{{course.class_name}}</p>
        <p>{{course.address}}</p>
        <div v-for="(courseware,index1) in course.coursewares" :key="index1">
          <p>{{courseware.sort}}: {{courseware.courseware_name}}</p>
        </div>
      </div>
    </div>
    <div v-else>
      <p>&nbsp;<br>&nbsp;</p>
    </div>
    <Modal></Modal>
  </div>
</template>
<script>

export default {
  name: 'describe',
  props: {
    teacher_course_id: '',
    desc: {
      type: Array,
      default: () => {
        return {}
      }
    }
  },
  methods: {
    attend (desc) {
      let teacher_course_ids = new Set()
      desc.forEach(item => {
        teacher_course_ids.add(item.teacher_course_id)
      })
      teacher_course_ids = Array.from(teacher_course_ids) // 获取去重后的teacher_course_id数组
      let arr = []
      teacher_course_ids.forEach(tc_id => {
        let tmp_arr = desc.filter(e => { return e.teacher_course_id === tc_id })
        arr.push({
          course_name: tmp_arr[0].course_name,
          teacher_course_id: tmp_arr[0].teacher_course_id,
          class_no: tmp_arr[0].class_no,
          day: tmp_arr[0].day,
          week: tmp_arr[0].week,
          classes: tmp_arr
        })
      })
      this.$emit('attend', arr)
    }
  }
}

</script>
