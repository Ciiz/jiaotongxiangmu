<template>
<div>
  <Tabs size="small" v-model="tab_target1" name="after_1" :animated="false">
      <TabPane label="任务" name="task" tab="after_1">
        <Task :type="0" :courseware_id="courseware_id" v-if="tab_target1==='task'"></Task>
      </TabPane>
      <TabPane label="作业" name="homework" tab="after_1">
        <Homework :type="0" :courseware_id="courseware_id" v-if="tab_target1==='homework'"></Homework>
      </TabPane>
      <TabPane label="测试" name="exam" tab="after_1">
        <Exam :type="0" :courseware_id="courseware_id" v-if="tab_target1==='exam'"></Exam>
      </TabPane>
      <!-- <Button @click="handleTabsAdd" size="small" slot="extra">增加</Button> -->
      <Button @click="$router.back(-1)" size="small" slot="extra" style="float:right" type="primary">
        <Icon type="ios-arrow-back"></Icon>
      </Button>
  </Tabs>
</div>
</template>
<script>
import Courseware from '@/view/class_common/courseware/courseware_list.vue'
import Exam from '@/view/class_common/exam/exam_list.vue'
import Task from '@/view/class_common/task/task_list.vue'
import Homework from '@/view/class_common/homework/homework_list.vue'
export default {
  components: {
    Courseware,
    Exam,
    Task,
    Homework
  },
  data () {
    return {
      tab_target: 'before',
      tab_target1: 'task'
    }
  },
  computed: {
    courseware_id () {
      return this.$route.params.courseware_id
    }
  },
  methods: {
  },
  created () {
  }
}
</script>
<style>

</style>
