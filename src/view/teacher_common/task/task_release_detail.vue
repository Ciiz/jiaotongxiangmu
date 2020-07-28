<template>
<div>
  <Form>
    <FormItem label="任务名称:">
      <p>{{task_release.task.task_name}}</p>
    </FormItem>
    <FormItem label="任务内容:">
      <div v-html="task_release.task.content" class="content-warp" ></div>
    </FormItem>
    <FormItem label="开始时间:">
      <p>{{task_release.start_time | time}}</p>
    </FormItem>
    <FormItem label="截止时间:">
      <p>{{task_release.end_time | time}}</p>
    </FormItem>
    <FormItem label="发布状态:">
      <p>{{task_release.release_status ? '已发布':'未发布'}}</p>
    </FormItem>
    <FormItem label="发布方式:">
      <p>{{task_release.is_auto_release ===1? '自动发布':'在课堂中手动发布'}}</p>
    </FormItem>
    <FormItem label="发布类型:">
      <p>{{task_release.release_type === 1 ? '小组任务': '个人任务'}}</p>
    </FormItem>
    <!-- <FormItem label="每组人数:" v-if="task_release.release_type === 1">
      <p>{{task_release.team_size}}</p>
    </FormItem> -->
    <FormItem label="评分维度:">
        <span v-for="(score_option,index) in task_release.option" :key="index" style="margin-right: 20px;">
          {{score_option.option_name}}：{{score_option.weight}}
        </span>
    </FormItem>
    <FormItem label="评分人权重:">
      <div v-if="task_release.release_type === 1">
        <span v-for="(item, index) in task_release.evaluate_weight" :key="index">{{evaluateTypeMap[item.evaluate_type]}}: {{item.evaluate_weight}} &nbsp;</span>
      </div>
      <div v-else> 教师评：100 </div>
    </FormItem>
    <FormItem label="小组信息:" v-if="task_release.release_type === 1">
      <br>
      <div>
        <div v-for="(team,index) in task_release.teamList" :key="index">
          小组{{index+1}}:
          <span v-for="student in team" :key="student.id">
            {{student.name}}&nbsp;&nbsp;
          </span>
        </div>
      </div>
    </FormItem>
  </Form>
  <Spin fix v-show="loading"></Spin>
</div>
</template>
<script>
import { evaluateTypeMap } from '@/view/mixins/str_map'
export default{
  props: {
    task_release_id: ''
  },
  data () {
    return {
      task_release: { task: {}, option: [] },
      loading: false,
      evaluateTypeMap: evaluateTypeMap
    }
  },
  watch: {
    task_release_id (n, o) {
      this.getInfo()
    }
  },
  methods: {
    getInfo () {
      this.loading = true
      this.axios.request({
        method: 'get',
        url: 'index.php/Teacher/Task/task_release_detail',
        params: {
          task_release_id: this.task_release_id
        }
      }).then(res => {
        if (res.code === 200) {
          this.task_release = res.data.task_release
          this.task_release.teamList = this.dealTeamList(this.task_release.students)
          this.loading = false
        }
      })
    },
    dealTeamList (students) {
      let obj = {}
      students.forEach(item => {
        typeof obj[item.team_id] === 'undefined'
          ? (obj[item.team_id] = [item])
          : obj[item.team_id].push(item)
      })
      return Object.values(obj)
    }
  },
  mounted () {
    this.getInfo()
  }
}
</script>
