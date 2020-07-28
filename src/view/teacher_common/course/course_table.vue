<template>
<div>
<pre>
{{course_table}}

{{table_data}}

{{teacher_course_id}}
</pre>

</div>
</template>
<script>
import { get_course_table } from '@/api/data'
export default{
  props: ['teacher_course_id'],
  data () {
    return {
      course_table: []
    }
  },
  watch: {
    teacher_course_id (n, o) {
      this.getCourseTable()
    }
  },
  computed: {
    table_data () {
      let arr = []
      this.course_table.forEach(item => {
        for (let week_start = item.week_start; week_start <= item.week_end; week_start++) {
          switch (item.week_type) {
            case 0: { // 连续
              arr.push({
                week: week_start,
                day: item.day,
                class: item.class_no.split(',')
              })
              break
            }
            case 1: {
              if (week_start % 2 === 1) {
                arr.push({
                  week: week_start,
                  day: item.day,
                  class: item.class_no.split(',')
                })
              }
              break
            }
            case 2: {
              if (week_start % 2 === 0) {
                arr.push({
                  week: week_start,
                  day: item.day,
                  class: item.class_no.split(',')
                })
              }
              break
            }
          }
        }
      })
      return arr
    }
  },
  methods: {
    getCourseTable () {
      get_course_table(this.teacher_course_id).then(res => {
        if (res.code === 200) {
          this.course_table = res.data.course_table
        }
      })
    }
  },
  mounted () {
    this.getCourseTable()
  }
}
</script>
