<template>
  <div>
    <h1>测试发布详情:先不做，接口需要修改TODO:</h1>
  </div>
</template>
<script>
export default {
  props: {
    exam_release_id: ''
  },
  data () {
    return {
      student_exam: {}
    }
  },
  watch: {
    exam_release_id (n, o) {
      this.getInfo()
    }
  },
  methods: {
    getInfo () {

    }
  },
  mounted () {
    this.getInfo()
  }
}
</script>
