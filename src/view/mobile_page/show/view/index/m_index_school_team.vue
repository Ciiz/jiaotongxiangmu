<template>
  <div class="m_index_school_team">

    <cell class="m_index_school_title" :title="$store.state.user.schoolMesage.school_name">

      <span slot="left"><img src="@/assets/images/mobile_teacher/back.png" alt="" @click="$router.back(-1)"></span>

      <span slot="right" class="m_index_school_search" @click="$router.push({name:'searchpage'})">
        <img src="@/assets/images/mobile_teacher/search2.png" alt=""></span>
    </cell>
    <div class="schoolTeam_tap">
      <mt-navbar v-model="selected">
        <mt-tab-item id="1" class="schoolTeam_tap_size">教师团队({{teacher_list.length}})</mt-tab-item>
        <mt-tab-item id="2" class="schoolTeam_tap_size">院校课程({{teacher_course.length}})</mt-tab-item>
      </mt-navbar>
      <mt-tab-container v-model="selected">
        <mt-tab-container-item id="1" class="hideScroll">
          <schoolTeacher></schoolTeacher>
          <!-- <coursewareList :teacher_course_id="teacher_course_id"></coursewareList> -->
        </mt-tab-container-item>
        <mt-tab-container-item id="2" class="hideScroll">
          <schoolCourse></schoolCourse>
          <!-- <chapterInfo :teacher_course_id="teacher_course_id" :course_id="id" :course_type="course_type"
            :course_name="course_name"></chapterInfo> -->
        </mt-tab-container-item>
      </mt-tab-container>
    </div>
  </div>
</template>

<script>
import { get_taecherList } from '@/api/teacher'
import cell from '@/view/mobile_page/components/public_cell'
import schoolTeacher from '@/view/mobile_page/components/m_index/m_school_teacher.vue'
import schoolCourse from '@/view/mobile_page/components/m_index/m_index_course.vue'
// import log from 'video.js/es5/utils/log'
export default {
  components: {
    cell, schoolTeacher, schoolCourse
  },
  data () {
    return {
      teacher_list: [],
      selected: '1',
      teacher_course: []
    }
  },

  methods: {

  },
  async mounted () {
    console.log(this.$route.params.id)

    let res = await get_taecherList(this.$route.params.id)
    console.log(res)
    this.teacher_list = res.data.teacher_list

    this.axios.request({
      method: 'post',
      url: '/home/course/isShowSchoolCourses',
      params: {
        school_id: this.$route.params.id
      }
    }).then(result => {
      this.teacher_course = result.data.list
    })
  }
}
</script>

<style lang='less' scoped>
.m_index_school_team {
  .m_index_school_title {
    .m_index_school_search {
      width: 0.4rem;
      height: 0.4rem;
      img {
        width: 0.4rem;
        height: 0.4rem;
      }
    }
  }
  .schoolTeam_tap {
    .schoolTeam_tap_size {
      font-size: 2rem;
      font-family: PingFang SC;
      font-weight: bold;
    }
  }
}
</style>
