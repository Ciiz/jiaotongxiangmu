<template>
  <div>
    <course-list :bind_type="0" :editable="false">
      <span slot="search-bar">
        <Button type="primary" style="margin-left: 20px;" @click="open('course_table','','课程表编辑', 1100)" >课程表</Button>
      </span>
    </course-list>
    <!-- <Modal v-model="modal" :title="title" :width="modal_width" :styles="{top: '0px'}" footer-hide> -->
    <Modal v-model="modal" :title="title" width="1100px" :styles="{top: '0px'}" footer-hide>
      <courseTimetable :teacher_course_id="target_id" v-if="target === 'course_timetable' && modal" @error="modal = false"></courseTimetable>
      <CourseTable :teacher_course_id="target_id" v-if="target === 'course_table' && modal" ></CourseTable>
    </Modal>
  </div>
</template>
<script>
import courseList from '@/view/teacher_common/course/course_list.vue'
import modal_mixin from '@/view/mixins/modal_mixin'
import CourseTable from '@/view/teacher_common/common/course_table'
export default{
  components: {
    courseList,
    CourseTable
  },
  mixins: [modal_mixin],
  data () {
    return {

    }
  }
}
</script>
