<template>
  <div class="m-courseware flex-contain">
    <mt-header title="课件列表">
      <router-link to="/mobile/mobileCourse" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
      <img slot="right" src="@/assets/images/mobile_student/setting.png">
    </mt-header>
    <div class="m-mycourseware-list">
      <div v-for="(item,index) in list" :key="index" class="m-mycourseware-item" @click="toLink(item)">
        <div :class="(item.live_status===1||item.live_status===3)?'m-color-red':'m-color-blue'">{{index+1}}</div>
        <div class="m-mycourseware-info">
          <div :class="item.live_status===0?'m-color-black':(item.live_status===2?'m-color-gray':'m-color-red')">{{item.courseware_name}}</div>
          <div :class="(item.live_status===1||item.live_status===3)?'m-color-red':'m-color-gray9'">上课时间：{{item.class_time}}</div>
        </div>
        <div v-if="item.live_status===2" class="m-color-gray87">课堂回顾</div>
        <div v-if="item.live_status===1||item.live_status===3" class="m-color-red">正在上课...</div>
        <div v-if="item.live_status===0" class="m-color-blue">未上课</div>
      </div>
    </div>
    <div class="m-mycourseware-bottom">
      <div>
        <button class="m-b-btn-b">课件列表</button>
      </div>
      <div>
        <button class="m-w-btn-b" @click="toLinkChapter()">章节信息</button>
      </div>
    </div>
  </div>
</template>
<script>

import { Indicator } from 'mint-ui'
export default {
  data () {
    return {
      list: []
    }
  },
  watch: {
    student_course_id (n, o) {
      this.getData()
    }
  },
  computed: {
    student_course_id () {
      return this.$route.query.student_course_id
    },
    id () {
      return this.$route.query.id
    },
    teacher_course_id () {
      return this.$route.query.teacher_course_id
    },
    course_type () {
      return this.$route.query.course_type
    }
  },
  methods: {
    getData () {
      Indicator.open({
        text: '加载中...',
        spinnerType: 'fading-circle'
      })
      this.axios.request({
        url: '/index.php/Student/Courseware/page',
        method: 'get',
        params: {
          page_size: 10000,
          page_no: 1,
          student_course_id: this.student_course_id
        }
      }).then(res => {
        if (res.code === 200) {
          let data = res.data
          this.list = data.list
        }
        Indicator.close()
      })
    },
    toLink (item) {
      this.$router.push({ name: 'mobileCoursewareInfo', query: { id: item.id,student_courseware_id:item.student_courseware_id, courseware_name: item.courseware_name, class_time: item.class_time, live_status: item.live_status } })
    },
    toLinkChapter () {
      this.$router.push({ name: 'mobileChapterInfo', query: { course_id: this.id, teacher_course_id: this.teacher_course_id, course_type: this.course_type } })
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
<style>

</style>
