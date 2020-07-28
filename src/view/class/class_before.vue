<template>
<div>
  <Tabs size="small" value="name1" name="top"  :animated="false">
      <TabPane label="课件列表" name="name1" tab="top">
        <Courseware :type="1"></Courseware>
      </TabPane>
      <TabPane label="课前任务" name="name2" tab="top">
        <Task :type="1"></Task>
      </TabPane>
      <TabPane label="课前测试" name="name3" tab="top">
        <Exam :type="1"></Exam>
      </TabPane>
  </Tabs>
</div>
</template>
<script>
import Courseware from '@/view/class_common/courseware/courseware_list.vue'
import Exam from '@/view/class_common/exam/exam_list.vue'
import Task from '@/view/class_common/task/task_list.vue'
export default {
  components: {
    Courseware,
    Exam,
    Task
  },
  data () {
    return {

    }
  }
}
</script>
<style>

</style>
