<template>
  <div style="height:100%">
    <courseware-list :release_status="release_status" :teacher_course_id="t_id" :editable="false" ref="courseware_list">
    </courseware-list>
    <Spin size="large" v-if="loading" fix></Spin>
  </div>
</template>
<script>
import coursewareList from '@/view/teacher_common/courseware/courseware_list.vue'
import modal_mixin from '@/view/mixins/modal_mixin'
export default{
  components: {
    coursewareList
  },
  data () {
    return {
      release_status: '',
      teacher_course_list: [],
      loading: false
    }
  },
  watch: {
    t_id (n, o) {
      this.getTeacherCourseList()
    }
  },
  computed: {
    t_id () {
      return this.$store.state.user.courseData.teacher_course_id
    }
  },
  mixins: [modal_mixin],
  methods: {
    getTeacherCourseList () {
      this.loading = true
      this.axios.request({
        method: 'get',
        url: '/index.php/Teacher/Courseware/index',
        params: {
          teacher_course_id: this.t_id
          // release_status: 1
        }
      }).then(res => {
        if (res.code === 200) {
          this.loading = false
          this.teacher_course_list = res.data.course_list
          if (this.teacher_course_list.length > 0) {
            this.t_id = this.teacher_course_list[0].teacher_course_id
          }
        }
      })
    }
  },
  mounted () {
    this.getTeacherCourseList()
  }
}
</script>
