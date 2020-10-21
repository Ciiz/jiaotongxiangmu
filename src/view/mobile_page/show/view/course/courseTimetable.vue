<template>
  <div class="m-courseTimetable flex-contain">
    <cell title="课程表">
      <span slot="left"><img src="@/assets/images/mobile_teacher/back.png" alt="" @click="$router.back(-1)"></span>
      <span slot="right"></span>
    </cell>
    <!-- <mt-header title="课程表">
      <router-link to="/mobile/mobileCourse" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header> -->
    <div class="courseTablemobileContain hideScroll">
      <courseTablemobile></courseTablemobile>
    </div>
  </div>
</template>
<script>
import courseTablemobile from '@/view/mobile_page/components/course_table_mobile'
import cell from '@/view/mobile_page/components/public_cell'
export default {
  components: { courseTablemobile, cell },
  data () {
    return {
      list: []
    }
  },
  watch: {

  },
  methods: {

  },
  mounted () {
  }
}
</script>
<style>
</style>
