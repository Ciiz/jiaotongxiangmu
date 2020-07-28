<template>
  <Row class="modal-content">
    <!-- 个人 -->
        <Tabs size="small" value="name1" :animated="false">
            <TabPane label="对其他小组的评价" name="name1">
              <Self :student_task_id="student_task_id"></Self>
            </TabPane>
            <TabPane label="对本小组的评价" name="name2">
              <Other :student_task_id="student_task_id"></Other>
            </TabPane>
        </Tabs>
  </Row>
</template>
<script>
import Other from './evaluate_other'
import Self from './evaluate_self'
export default {
  components: {
    Self,
    Other
  },
  props: {
    student_task_id: ''
  },
  data () {
    return {
      student_task: {
        task: {}
      }
    }
  },
  computed: {
  },
  watch: {
    student_task_id (newVal, oldVal) {

    }
  },
  methods: {

  },
  mounted () {

  }
}
</script>
<style type="text/css" lang="less" scoped>

</style>
