<template>
  <Row>
    <Table
      size="small"
      :loading="loading"
      :columns="columns"
      :data="list"
      :height="$store.state.app.tableHeight"
    ></Table>
    <Modal v-model="modal" :title="title" width="800" footer-hide :mask-closable='false'>
      <Evaluate :student_courseware_id="student_courseware_id" v-if="target === 'evaluate'"></Evaluate>
    </Modal>
  </Row>
</template>

<script>
import Evaluate from '@/view/class_common/courseware/evaluate'

export default {
  props: {
    student_course_id: ''
  },
  components: {
    Evaluate
  },
  data () {
    return {
      modal: false,
      student_courseware_id: '',
      title: '',
      target: '',
      loading: false,
      keyword: '',
      list: [],
      count: 0,
      columns: [

      ]
    }
  },
  watch: {
    student_course_id (n, o) {
      this.getData()
    }
  },
  methods: {
    getData () {
      if (!this.student_course_id) return
      let _this = this
      _this.loading = true
      _this.axios
        .request({
          url: '/index.php/Student/Courseware/getStudentCoursewareByCourse',
          method: 'get',
          params: {
            student_course_id: _this.student_course_id
          }
        })
        .then(res => {
          if (res.code === 200 && res.data.list) {
            this.list = res.data.list
          }
          _this.loading = false
        })
    },
    open (target, target_id, title) {
      this.modal = true
      this.target = target
      this.title = title
      this.student_courseware_id = target_id
    }
  },
  mounted () {
    this.getData()
  }
}
</script>

<style lang="less" scoped>
</style>
