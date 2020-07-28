<template>
<div>
  <Tabs size="small" value="name1" :animated="false">
      <TabPane label="作业列表" name="name1">
        <Homework></Homework>
      </TabPane>
      <TabPane label="任务列表" name="name2">
        <Task :type="3"></Task>
      </TabPane>
      <TabPane label="考试列表" name="name3">
        <Exam :type="3"></Exam>
      </TabPane>
  </Tabs>
</div>
</template>
<script>
import Homework from '@/view/class_common/homework/homework_list.vue'
import Task from '@/view/class_common/task/task_list.vue'
import Exam from '@/view/class_common/exam/exam_list.vue'
export default {
  components: {
    Homework,
    Task,
    Exam
  },
  data () {
    return {

    }
  }
}
</script>
<style>

</style>
