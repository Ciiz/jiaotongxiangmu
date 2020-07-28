<template>
<div>
  <Tabs size="small" value="name1" :animated="false">
      <TabPane label="课件列表" name="name1">
        <Courseware :type="2"></Courseware>
      </TabPane>
      <TabPane label="任务列表" name="name2">
        <Task :type="2"></Task>
      </TabPane>
  </Tabs>
</div>
</template>
<script>
import Courseware from '@/view/class_common/courseware/courseware_list.vue'
import Task from '@/view/class_common/task/task_list.vue'
export default {
  components: {
    Courseware,
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
