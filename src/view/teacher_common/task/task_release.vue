<template>
  <div>
    <Form :modal="task_release" :label-width="120">
      <FormItem label="发布类型：">
        <RadioGroup v-model="task_release.release_type">
          <Radio :label="2" v-if="release_type !== 2">个人</Radio>
          <Radio :label="1">小组</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="小组人数：" v-if="task_release.release_type === 1">
        <InputNumber v-model="task_release.team_size"></InputNumber>
      </FormItem>
      <FormItem label="评分人权重：" v-if="task_release.release_type === 1">
        <Row v-for="item in task_release.evaluate_weight" :key="item.evaluate_type">
          {{item.label}}: <InputNumber style="width: 100px;" v-model="item.evaluate_weight"></InputNumber>
        </Row>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="submit">发布</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
export default {
  props: {
    task_release_id: '',
    release_type: 0
  },
  data () {
    return {
      task_release: {
        release_type: 1,
        team_size: 5,
        evaluate_weight: [
          { label: '教师评', evaluate_type: 1, evaluate_weight: 80 },
          { label: '组长评', evaluate_type: 2, evaluate_weight: 10 },
          { label: '组员评', evaluate_type: 4, evaluate_weight: 10 }
        ]
      }
    }
  },
  watch: {
    task_release_id (n, o) {
      this.task_release = {
        release_type: 1,
        team_size: 5,
        evaluate_weight: [
          { label: '教师评', evaluate_type: 1, evaluate_weight: 80 },
          { label: '组长评', evaluate_type: 2, evaluate_weight: 10 },
          { label: '组员评', evaluate_type: 4, evaluate_weight: 10 }
        ]
      }
    }
  },
  methods: {
    submit () {
      this.axios.request({
        method: 'post',
        url: '/index.php/Teacher/Task/release',
        data: {
          task_release_id: this.task_release_id,
          release_type: this.task_release.release_type,
          team_size: this.task_release.team_size,
          group_weight: this.task_release.release_type === 1 ? this.task_release.evaluate_weight : ''
        }
      }).then(res => {
        if (res.code === 200) {
          this.$Message.success(res.message)
          this.$emit('success')
        }
      })
    }
  },
  mounted () {

  }
}
</script>
