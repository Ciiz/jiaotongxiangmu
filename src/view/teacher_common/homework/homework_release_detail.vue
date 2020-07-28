<template>
<div>
  <Form>
    <FormItem label="作业题目:">
      <div v-html="homework_release.homework.homework_name" ></div>
    </FormItem>
    <FormItem label="作业内容:">
      <div v-html="homework_release.homework.homework_content"  class="content-warp"></div>
    </FormItem>
    <FormItem label="开始时间:">
      <p>{{homework_release.start_time | time}}</p>
    </FormItem>
    <FormItem label="截止时间:">
      <p>{{homework_release.end_time | time}}</p>
    </FormItem>
    <FormItem label="发布状态:">
      <p>{{homework_release.release_status ? '已发布':'未发布'}}</p>
    </FormItem>
    <FormItem label="评分维度:">
        <span v-for="(score_option,index) in homework_release.option" :key="index" style="margin-right: 20px;">
          {{score_option.option_name}}：{{score_option.weight}}
        </span>
    </FormItem>
  </Form>
  <Spin fix v-show="loading"></Spin>
</div>
</template>
<script>
export default{
  props: {
    homework_release_id: ''
  },
  data () {
    return {
      homework_release: { homework: {} },
      loading: false
    }
  },
  watch: {
    homework_id (n, o) {
      this.getInfo()
    }
  },
  methods: {
    getInfo () {
      this.loading = true
      this.axios.request({
        method: 'get',
        url: 'index.php/Teacher/Homework/homework_release_detail',
        params: {
          homework_release_id: this.homework_release_id
        }
      }).then(res => {
        if (res.code === 200) {
          this.homework_release = res.data.homework_release
          this.loading = false
        }
      })
    }
  },
  mounted () {
    this.getInfo()
  }
}
</script>
