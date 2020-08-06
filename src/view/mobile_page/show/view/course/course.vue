<template>
  <div class="m-course flex-contain">
    <mt-header title="我的课程" v-if="userType===1">
      <img slot="right" src="@/assets/images/mobile_student/courseShow.png" @click="openTimetable">
    </mt-header>
    <mt-header title="我的课程" v-if="userType===2">
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
        <div class="m-mycourse-list-info-t">
          <div>{{item.course_name}}</div>
          <div v-html="item.description"></div>
          <div style="display:flex;justify-content:space-between" v-if="userType===1">
            <div>已绑定学生：xxx</div>
            <div>{{item.major_name}}</div>
          </div>
          <div style="display:flex;justify-content:space-between" v-if="userType===2">
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
import { course_detail } from '@/api/common'

export default {
  data () {
    return {
      list: [],
      userType: this.$store.state.user.userInfo.userType
    }
  },
  watch: {

  },
  methods: {
    getCourse () {
      if (this.userType === 1) {
        Indicator.open({
          text: '加载中...',
          spinnerType: 'fading-circle'
        })
        this.axios.request({
          url: '/index.php/Teacher/Course/index',
          method: 'get',
          params: {
            page: 1,
            keyword: '',
            type: 0
            // type: 4
          }
        }).then(res => {
          if (res.code === 200) {
            this.list = res.data.course_list
            // for (let i in this.list) {
            //   this.list[i]['style'] = 'width'
            //   this.list[i].img += '?nocache=' + new Date().getTime()
            // }
          }
          Indicator.close()
        })
      }
      if (this.userType === 2) {
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
      }
    },
    toLink (item) {
      if (this.userType === 1) {
        let course_type = ''
        course_detail(item.id).then(res => {
          this.loading = false
          if (res.code === 200) {
            course_type = res.data.course_type
            this.$router.push({ name: 'mobileCoursewareT', query: { teacher_course_id: item.teacher_course_id, id: item.id, course_type: course_type, course_name: item.course_name } })
          }
        })
      } else if (this.userType === 2) {
        this.$router.push({ name: 'mobileCoursewareS', query: { student_course_id: item.student_course_id, id: item.id, teacher_course_id: item.teacher_course_id, course_type: item.course_type } })
      }
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
