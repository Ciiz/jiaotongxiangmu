<template>
  <div style="height:100%;display:flex;flex-direction:column">
    <!-- <Layout style="padding:4px;background:#2E3640;height:100%">
      <Content style="background:#DEDEDE;overflow:hidden;position:relative"> -->
    <div class="myCourse-contain-header" v-if="userType===1">
      <ul>
        <router-link active-class="mycourse-tab" :to="{path: '/teachingSystem/MyCourse/course_courseware'}" @click.native="getName">课件列表</router-link>
        <router-link active-class="mycourse-tab" :to="{path: '/teachingSystem/MyCourse/course_courseware_detail'}" @click.native="getName">课程详情</router-link>
        <router-link active-class="mycourse-tab" :to="{path: '/teachingSystem/MyCourse/course_students_manage'}" @click.native="getName">学生管理</router-link>
        <router-link active-class="mycourse-tab" :to="{path: '/teachingSystem/MyCourse/show_attendance'}" @click.native="getName">查看考勤</router-link>
      </ul>
      <Breadcrumb style="float:right;margin:16px 10px 0 0">
        <BreadcrumbItem>我的课程</BreadcrumbItem>
        <BreadcrumbItem>课程列表</BreadcrumbItem>
        <BreadcrumbItem>{{titleName}}</BreadcrumbItem>
      </Breadcrumb>
      <div style="clear:both"></div>
    </div>
    <div class="myCourse-contain-header" v-if="userType===2">
      <ul>
        <router-link active-class="mycourse-tab" :to="{path: '/teachingSystem/StudentCourse/course_coursewares'}" @click.native="getName">课件列表</router-link>
        <router-link active-class="mycourse-tab" :to="{path: '/teachingSystem/StudentCourse/student_courseware_detail'}" @click.native="getName">课程详情</router-link>
      </ul>
      <button v-if="titleName==='课件列表'" @click="modal1=true" class="redBorder-btn" style="float:right;margin:10px">退选</button>
      <Breadcrumb v-if="titleName==='课程详情'" style="float:right;margin:16px 10px 0 0">
        <BreadcrumbItem>我的课程</BreadcrumbItem>
        <BreadcrumbItem>课程列表</BreadcrumbItem>
        <BreadcrumbItem>{{titleName}}</BreadcrumbItem>
      </Breadcrumb>
      <div style="clear:both"></div>
    </div>
    <keep-alive >
        <router-view style="position:relative;overflow:hidden" @showCourseDetail="showCourseDetail" @showAllCourseDetail="showAllCourseDetail" v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
      <!-- </Content>
    </Layout> -->
     <Modal
        v-model="modal1"
        title="退选"
        @on-ok="unbind(courseId)">
        <p>确定退选此门课程？</p>
    </Modal>
  </div>
</template>
<script>

import modal_mixin from '@/view/mixins/modal_mixin'

export default {
  mixins: [modal_mixin],
  data () {
    return {
      userType: this.$store.state.user.userInfo.userType,
      list: '',
      modal1: false,
      titleName: '课件列表'
    }
  },
  computed: {
    courseId () {
      return this.$store.state.user.courseData.student_course_id
    }
  },
  watch: {

  },
  methods: {
    showAllCourseDetail (i, t, d, ci) {
      this.$emit('showAllCourseDetail', i, t, d, ci)
    },
    showCourseDetail (i, t) {
      this.$emit('showCourseDetail', i, t)
    },
    getName (e) {
      this.titleName = e.target.innerText
      this.$emit('openSlider')
    },
    openSlider () {
      document.getElementsByClassName('openSlider')[0].style.display = 'none'
      document.getElementsByClassName('myCourse-slider')[0].style.width = 400 + 'px'
      document.getElementsByClassName('myCourse-slider')[0].style.transform = 'translateX(0px)'
    },
    unbind (student_course_id) {
      this.$emit('getDataStudent')
      this.axios.request({
        method: 'post',
        url: 'index.php/Student/Course/unbindCourse',
        data: {
          student_course_id
        }
      }).then(res => {
        if (res.code === 200) {
          this.$Message.success(res.message)
          this.$emit('refreshData')
        } else {
          this.$Message.error(res.message)
        }
      })
    }
  },
  mounted () {
    // setTimeout(() => {
    //   this.selectCourse(0)
    // }, 500)
  }
}
</script>
<style lang="less">

</style>
