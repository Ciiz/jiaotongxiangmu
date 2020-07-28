<template>
        <Poptip placement="bottom" v-model="visible">
                <span style="cursor:pointer;color:#2D8CF0;">{{score}}</span>
                <div class="mark-poptip" slot="content">
                  <h3 style="margin:10px 0;">查看评价详情</h3>
                  <div style="margin:10px 0;">任务选择：
                    <span class="span_style" v-for="(taskitem,index) in id.task_ids" :key="taskitem + 'taskitem'" @click="taskclick(taskitem)">{{id.task_name[index]}}</span></div>
                  <div style="margin:10px 0;">测试选择：
                    <span class="span_style" v-for="(testitem,index) in id.exam_ids" :key="testitem + 'testitem'" @click="testclick(testitem)">{{id.exam_name[index]}}</span></div>
                  <div v-if="had_homework">作业选择：
                    <span class="span_style" v-for="(workitem,index) in id.work_ids" :key="workitem + 'workitem'" @click="homeworkclick(workitem)">{{id.work_name[index]}}</span></div>
                </div>
        </Poptip>
</template>

<script>
export default {
  props: ['score', 'id', 'had_homework'],
  data () {
    return {
      visible: false
    }
  },
  created () {
    this.distribution(this.id)
  },
  methods: {
    distribution (id) {

    },
    taskclick (val) {
      this.$emit('task_id', val)
      this.visible = false
    },
    testclick (val) {
      this.$emit('test_id', val)
      this.visible = false
    },
    homeworkclick (val) {
      this.$emit('homework_id', val)
      this.visible = false
    }
  }
}
</script>
