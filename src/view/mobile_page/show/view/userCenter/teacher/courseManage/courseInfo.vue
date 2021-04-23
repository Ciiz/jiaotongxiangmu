<template>
  <div class="flex-contain" style="position:relative;height:100%">
    <mt-header title="课程信息">
      <router-link to="/mobileCourseManageT" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <div class="m-courseInfo-contain hideScroll">
      <div class="m-courseInfo-contain-h">
        <div class="m-courseInfo-contain-h-info">
          <div>
            <img :src="course.img" />
          </div>
          <div>
            <div class="m-courseInfo-title">{{course.course_name}}</div>
            <div class="m-courseInfo-status">
              <span v-if="audit_statusB.toString()==='1'&&release_statusB.toString()==='0'">未发布</span>
              <span v-if="audit_statusB.toString()==='1'&&release_statusB.toString()==='1'">已发布</span>
              <span v-if="audit_statusB.toString()==='2'">审核不通过</span>
              <span v-if="audit_statusB.toString()==='3'">待审核</span>
            </div>
            <div>标签：{{course.course_label}}</div>
            <div>类型：{{course.course_type === 1?'普通':'全景'}}</div>
          </div>
        </div>
        <div v-html="course.description" class="m-courseInfo-description"></div>
      </div>
      <div class="m-courseInfo-contain-b">
        <div style="color:#666666;font-size:0.32rem">章节列表</div>
        <chapterInfo :course_id="course.course_id" :course_type="course.course_type" :course_name="course.course_name"
          :showProgress="showProgress"></chapterInfo>
      </div>
    </div>
    <div class="m-courseInfo-btn"
      v-if="(audit_statusB.toString() === '1' || course.create_type === 1 || course.create_type === 4) && bind_type.toString() !== '0'"
      @click="action('release')">
      <div class="m-courseInfo-btn-blue" v-if="release_statusB.toString()==='0'">发布</div>
      <div class="m-courseInfo-btn-red" v-if="release_statusB.toString()==='1'">撤回</div>
    </div>
    <div class="m-courseInfo-btn" v-if="bind_type.toString() === '3'">
      <div class="m-courseInfo-btn-green" v-if="audit_statusB.toString() === '0' || audit_statusB.toString() === '2'"
        @click="action('audit')">提交审核</div>
      <div class="m-courseInfo-btn-gray" v-if="audit_statusB.toString() === '3'">待审核</div>
    </div>
  </div>
</template>
<script>

import { Toast } from 'mint-ui'
import { course_detail } from '@/api/common'
import chapterInfo from '@/view/mobile_page/show/view/course/teacher/chapterInfo'

export default {
  components: { chapterInfo },
  data () {
    return {
      course: {},
      showProgress: false,
      release_statusB: '',
      audit_statusB: ''
    }
  },

  computed: {
    id () {
      return this.$route.query.id
    },
    audit_status () {
      return this.$route.query.audit_status
    },
    release_status () {
      return this.$route.query.release_status
    },
    teacher_course_id () {
      return this.$route.query.teacher_course_id
    },
    bind_type () {
      return this.$route.query.bind_type
    }
  },
  methods: {
    getTeacherCourse () {
      if (!this.id) return
      course_detail(this.id).then(res => {
        this.loading = false
        if (res.code === 200) {
          this.course = res.data
        }
      })
    },
    action (type) {
      let url = ''
      switch (type) {
        case 'release': {
          url = '/index.php/Teacher/Course/release'
          break
        }
        case 'audit': {
          url = '/index.php/Teacher/Course/submit'
          break
        }
      }
      this.axios.request({
        method: 'post',
        url,
        data: { course_id: this.course.course_id }
      }).then(res => {
        if (res.code === 200) {
          Toast({
            message: res.message,
            duration: 2000
          })
          if (this.release_statusB.toString() === '0') {
            this.release_statusB = 1
          } else {
            this.release_statusB = 0
          }
          if (type === 'audit') {
            this.audit_statusB = 3
          } else {
          }
        }
      })
    }
  },
  mounted () {
    this.release_statusB = this.release_status
    this.audit_statusB = this.audit_status
    this.getTeacherCourse()
  }
}
</script>
