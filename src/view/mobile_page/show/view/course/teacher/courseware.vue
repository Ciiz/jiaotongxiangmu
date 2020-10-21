<template>
  <div class="m-coursewareT flex-contain">
    <div class="m-coursewareT-header">
      <img src="@/assets/images/mobile_teacher/back.png" @click="back()" />
      <mt-navbar v-model="selected">
        <mt-tab-item id="1">课件列表</mt-tab-item>
        <mt-tab-item id="2">章节列表</mt-tab-item>
      </mt-navbar>
      <!-- <img src="@/assets/images/mobile_teacher/setting.png"/> -->
    </div>
    <mt-tab-container v-model="selected">
      <mt-tab-container-item id="1" class="hideScroll">
        <coursewareList :teacher_course_id="teacher_course_id"></coursewareList>
      </mt-tab-container-item>
      <mt-tab-container-item id="2" class="hideScroll">
        <chapterInfo :teacher_course_id="teacher_course_id" :course_id="id" :course_type="course_type"
          :course_name="course_name"></chapterInfo>
      </mt-tab-container-item>
    </mt-tab-container>
  </div>
</template>
<script>

import coursewareList from '@/view/mobile_page/show/view/course/teacher/coursewareList'
import chapterInfo from '@/view/mobile_page/show/view/course/teacher/chapterInfo'
export default {
  components: { coursewareList, chapterInfo },
  data () {
    return {
      list: [],
      selected: '1'
    }
  },
  watch: {

  },
  computed: {
    course_name () {
      return this.$route.query.course_name
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
    back () {
      this.$router.push({ name: 'mobileCourse' })
    }
  },
  mounted () {
  }
}
</script>
<style>
</style>
