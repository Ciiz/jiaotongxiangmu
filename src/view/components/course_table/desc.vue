<template>
  <div>
    <div v-if="desc.length !== 0">
      <!-- {{desc}} -->
      <div v-for="(course,index) in desc" :key="index">
        <h4>课程:{{course.course_name}}</h4>
        <p>{{course.class_name}}</p>
        <p>{{course.address}}</p>
        <div v-for="(courseware,index1) in course.coursewares" :key="index1">
          <p>{{courseware.sort}}: {{courseware.courseware_name}}</p>
          <!-- <p v-for="(class_item,index2) in courseware.class_names" :key="index2" >
            {{class_item.class_name}}
          </p> -->
        </div>
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
