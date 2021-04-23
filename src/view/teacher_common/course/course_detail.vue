<template>
  <div class="courseware-detail">
    <div style="width:100%;height:100%" v-if="showCourse===true">
      <studentCourseShow :c_id="c_id" @closeModal="closeModal"></studentCourseShow>
    </div>
    <Spin size="large" v-if="loading" fix></Spin>

    <!-- <span v-if="course==={}" class="black-c bold-w">请选择一门课程！</span> -->
    <Row class="courseware-detail-content">
      <Col :span='12' class="courseware-detail-content-l">

      <div>
        <span class="black-c bold-w">课程名称：</span>
        <span class="gray-c">{{course.course_name}}</span>
      </div>
      <div>
        <span class="black-c bold-w">课程封面：</span>
        <img :src="course.img" alt="" style="width:120px;height:120px;vertical-align:top;border-radius:10px;">
      </div>
      <div>
        <span class="black-c bold-w">课程标签：</span>
        <span class="blue-c">{{course.course_label}}</span>
      </div>
      <div>
        <span class="black-c bold-w">课程类型：</span>
        <span class="blue-c" v-show="course.course_type === 1">普通</span>
        <span class="blue-c" v-show="course.course_type === 2">全景</span>
      </div>
      <div>
        <span class="black-c bold-w">课程简介：</span>
        <span class="gray-c" v-html="course.description" style="display:inline-block"></span>
      </div>
      </Col>
      <Col :span='12'>
      <div class="black-c bold-w" style="margin-top:22px">课程章节：</div>
      <!-- 普通课程 -->
      <div shadow v-if="course.course_type === 1">
        <ChapterClass :course_id="courseId" :isteacherShow="true" :editable="false" @getCId="getCId"
          @showCourseDetail="showCourseDetail"></ChapterClass>
      </div>
      <!-- 全景课程 -->
      <Row v-else>
        <h2>全景列表</h2>
        <PanoChapter :course_id="courseId" :editable="false" @showAllCourseDetail="showAllCourseDetail"></PanoChapter>
      </Row>
      </Col>
    </Row>
    <!-- 普通课程MOdal -->
    <Modal v-model="modal" width="1200" :title="cur_content.name" :mask-closable="false" fullscreen footer-hide>
    </Modal>
  </div>
</template>

<script>
import PanoChapter from '@/view/components/pano_chapter'
import ChapterClass from './chapter_class'
import studentCourseShow from './student_course_show'
import { course_detail } from '@/api/common'
export default {
  components: {
    PanoChapter, ChapterClass, studentCourseShow
  },
  name: 'course_detail',
  data () {
    return {
      showCourse: false,
      loading: false,
      modal: false,
      target: '',
      video_timer: '', // 定时器
      cur_content: { name: '' },
      video: '',
      data: [],
      course: {},
      c_id: ''
    }
  },
  watch: {
    modal (n) {
      if (!n && this.target === 'pano_video') {
        let krpano = document.getElementById('krpanoSWFObject')
        krpano.call('removeplugin("video")')
      }
    },
    courseId () {
      this.getTeacherCourse()
    }
  },
  computed: {
    courseId () {
      return this.$store.state.user.courseData.id
    }
  },
  methods: {
    getCId (i) { // 获取章节id
      this.c_id = i
      this.showCourse = true
    },
    closeModal () {
      this.showCourse = false
    },
    showCourseDetail (i, t) {
      this.$emit('showCourseDetail', i, t)
    },
    showAllCourseDetail (i, t, d, ci) {
      this.$emit('showAllCourseDetail', i, t, d, ci)
    },
    getTeacherCourse () {

      if (this.showCourse === true) {
        this.showCourse = false
      }
      if (!this.courseId) return
      this.loading = true
      course_detail(this.courseId).then(res => {
        this.loading = false
        console.log(res);
        if (res.code === 200) {

          this.course = res.data
          console.log(this.course.course_type);

        }
      })
    }
  },

  activated () {

    // console.log('出发了');


  },
  mounted () {
    this.getTeacherCourse()

  }
}
</script>

<style lang="less" scoped>
.embed-tips {
  color: #fff;
  font-size: 18px;
  margin-top: 80px;
}
.course-cover {
  width: 100px;
  height: 100px;
  overflow: hidden;
  img {
    width: 100%;
  }
}
.chapter-item {
  cursor: pointer;
  width: 200px;
  overflow: hidden;
  margin: 10px;
  display: inline-block;
  .img {
    overflow: hidden;
    width: 100%;
    height: 120px;
    background: #000;
    img {
      width: 100%;
    }
  }
  .content {
    margin-top: 10px;
    height: 42px;
    p {
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
}
</style>
