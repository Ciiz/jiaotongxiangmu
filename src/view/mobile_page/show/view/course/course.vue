<template>
  <div class="m-course flex-contain">
    <mt-header title="我的课程">
      <router-link to="/mobileSelectcourse" slot="right">
        <span>选课</span>
      </router-link>
      <img slot="left" src="@/assets/images/mobile_student/courseShow.png" @click="openTimetable">
    </mt-header>
    <div class="m-mycourse-list hideScroll">
      <div v-for="(item,index) in list" :key="index" class="m-mycourse-item" @click="toLink(item)">
        <div>
          <img :src="item.img"/>
        </div>
        <div class="m-mycourse-list-info">
          <div>{{item.course_name}}</div>
          <div v-html="item.description"></div>
          <div style="display:flex;justify-content:space-between">
            <div>xx老师</div>
            <div>x章节</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Indicator } from 'mint-ui'
import { my_course } from '@/api/student'
export default {
  data () {
    return {
      list: []
    }
  },
  watch: {

  },
  methods: {
    getCourse () {
      Indicator.open({
        text: '加载中...',
        spinnerType: 'fading-circle'
      })
      my_course({
        page_size: 10000,
        page_no: 1
      }).then(res => {
        if (res.code === 200) {
          let data = res.data
          this.list = data.list
        }
        Indicator.close()
      })
    },
    toLink (item) {
      this.$router.push({ name: 'mobileCourseware', query: { student_course_id: item.student_course_id, id: item.id, teacher_course_id: item.teacher_course_id, course_type: item.course_type } })
    },
    openTimetable () {
      this.$router.push({ name: 'mobileCourseTimetable' })
    }
  },
  mounted () {
    this.getCourse()
  }
}
</script>
<style>

</style>
