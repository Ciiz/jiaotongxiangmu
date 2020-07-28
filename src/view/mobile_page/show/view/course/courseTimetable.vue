<template>
  <div class="m-courseTimetable flex-contain">
    <mt-header title="课程表">
      <router-link to="/mobile/mobileCourse" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <div class="courseTablemobileContain hideScroll">
      <courseTablemobile></courseTablemobile>
    </div>
  </div>
</template>
<script>
import courseTablemobile from '@/view/components/course_table_mobile'

export default {
  components: { courseTablemobile },
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
