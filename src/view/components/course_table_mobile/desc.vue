<template>
  <div>
    <div v-if="desc.length !== 0">
      <!-- {{desc}} -->
      <div v-for="(course,index) in desc" :key="index">
        <h4 >{{course.course_name}}</h4>
      </div>
    </div>
    <div v-else>
      <p>&nbsp;<br>&nbsp;</p>
    </div>
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
        return []
      }
    }
  }
}

</script>
