<template>
  <div style="height:100%">
    <Courseware :student_course_id="courseId">
      <Button @click="$router.back(-1)" size="small" style="float:right" type="primary" slot="right-btn">
        <Icon type="ios-arrow-back"></Icon>
      </Button>
    </Courseware>
  </div>
</template>
<script>
import Courseware from '@/view/class_common/courseware/courseware_list'
export default {
  components: {
    Courseware
  },
  data () {
    return {

    }
  },
  computed: {
    courseId () {
      return this.$store.state.user.courseData.id
    }
  }
}
</script>
