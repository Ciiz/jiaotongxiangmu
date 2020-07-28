<template>
  <div style="height:100%">
    <courseware-list :release_status="release_status" :teacher_course_id="t_id" :editable="false" ref="courseware_list">
      <!-- <div slot="search-bar" style="float:left; margin-right: 15px;">
        课程：<Select v-model="teacher_course_id" style="width: 200px;"  placeholder="请选择课程">
          <Option :value="item.teacher_course_id" v-for="item in teacher_course_list" :key="item.teacher_course_id">{{item.course_name}}</Option>
        </Select>
      </div> -->
      <!-- <Button slot="add-button" v-if="teacher_course_id !== ''" type="success" icon="md-add" style="margin-left: 15px;" @click="open('courseware_add', 'add', '新建课件')">
        新增课件
      </Button> -->
    </courseware-list>
    <Spin size="large" v-if="loading" fix></Spin>
    <!-- <Modal v-model="modal" :title="title" :width="modal_width" :footer-hide="footerHide" :fullscreen="fullscreen" :mask-closable="false">
      <courseware-add v-if="target === 'courseware_add' && modal" isneworeditor="新增课件" :send_course_id='teacher_course_id'  @success="$refs.courseware_list.getData(true);modal = false"></courseware-add>
    </Modal> -->
  </div>
</template>
<script>
import coursewareList from '@/view/teacher_common/courseware/courseware_list.vue'
// import coursewareAdd from '@/view/teacher_common/courseware/courseware_edit.vue'
import modal_mixin from '@/view/mixins/modal_mixin'
export default{
  components: {
    coursewareList
    // coursewareAdd
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
