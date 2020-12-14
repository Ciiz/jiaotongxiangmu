<template>
  <div style="flex:1;display:flex;flex-direction:column">
    <button class="blueC-btn" v-if="courseId !== ''" style="width:116px;margin-bottom:10px"
      @click="open('courseware_add', 'add', '新建课件')">
      新增课件
    </button>
    <courseware-list @showAddCourseware='showAddCourseware' :release_status="release_status"
      :teacher_course_id="courseId" :editable="true" ref="courseware_list">
    </courseware-list>
    <Modal v-model="modal" :title="title" :width="modal_width" :footer-hide="footerHide" :fullscreen="fullscreen"
      :mask-closable="false">
      <courseware-add v-if="target === 'courseware_add' && modal" isneworeditor="新增课件" :send_course_id='courseId'
        @success="$refs.courseware_list.getData(true);modal = false"></courseware-add>
    </Modal>
  </div>
</template>
<script>
import coursewareList from '@/view/teacher_common/courseware/courseware_list.vue'
import coursewareAdd from '@/view/teacher_common/courseware/courseware_edit.vue'
import modal_mixin from '@/view/mixins/modal_mixin'
export default {
  components: {
    coursewareList,
    coursewareAdd
  },
  data () {
    return {
      release_status: '',
      teacher_course_list: []
    }
  },
  computed: {
    courseId () {
      return this.$store.state.user.courseData.teacher_course_id
    }
  },
  mixins: [modal_mixin],
  methods: {
    showAddCourseware (timetable_id, target_id, action_type, courseware_id, teacher_course_id, type, courseware_name) {
      this.$emit('showAddCourseware', timetable_id, target_id, action_type, courseware_id, teacher_course_id, type, courseware_name)
    }
    // getTeacherCourseList () {
    //   this.axios.request({
    //     method: 'get',
    //     url: '/index.php/Teacher/Courseware/index',
    //     params: {
    //     }
    //   }).then(res => {
    //     if (res.code === 200) {
    //       this.teacher_course_list = res.data.course_list
    //       if (this.teacher_course_list.length > 0) {
    //         this.courseId = this.teacher_course_list[0].teacher_course_id
    //       }
    //     }
    //   })
    // }
  },
  mounted () {
    // this.getTeacherCourseList()
  }
}
</script>
