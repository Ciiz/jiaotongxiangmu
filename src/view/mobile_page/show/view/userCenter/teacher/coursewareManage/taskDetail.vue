<template>
  <div class="flex-contain">
    <mt-header title="任务详情" style="border-bottom:1px solid #EEEEEE">
      <router-link to slot="left">
        <mt-button icon="back" @click="back"></mt-button>
      </router-link>
    </mt-header>
    <div class="m-taskDetail-contain hideScroll">
      <div class="m-taskDetail-contain-h">
        <div class="m-taskDetail-taskname">{{task_release.task.task_name}}</div>
        <div v-html="task_release.task.content" class="m-taskDetail-taskcontent"></div>
      </div>
      <div class="m-taskDetail-contain-b">
        <div>
          <div>开始时间</div>
          <div>{{task_release.start_time | time}}</div>
        </div>
        <div>
          <div>截止时间</div>
          <div>{{task_release.end_time | time}}</div>
        </div>
        <div>
          <div>发布类型</div>
          <div>{{task_release.release_type === 1 ? '小组任务': '个人任务'}}</div>
        </div>
      </div>
      <div class="m-taskDetail-contain-b">
        <div>
          <div>评分维度</div>
          <div>
            <span v-for="(score_option,index) in task_release.option" :key="index">
              {{score_option.option_name}}：{{score_option.weight}}
            </span>
          </div>
        </div>
        <div>
          <div>评分权重</div>
          <div v-if="task_release.release_type === 1">
            <span v-for="(item, index) in task_release.evaluate_weight" :key="index">{{evaluateTypeMap[item.evaluate_type]}}: {{item.evaluate_weight}} &nbsp;</span>
          </div>
          <div v-else> 教师评：100 </div>
        </div>
      </div>
      <div class="m-task-group" v-if="task_release.release_type === 1">
        <div style="margin-right:0.8rem">
          <div style="font-size:0.3rem;color:#222222">组长</div>
          <div style="margin-top:0.42rem">
            <div>
              <img :src="teamLeader.icon"/>
            </div>
            <div>{{teamLeader.name}}</div>
          </div>
        </div>
        <div style="flex:1">
          <Divider style="margin:0;font-size:0.3rem;color:#222222">组员</Divider>
          <div style="display:flex;flex-wrap:wrap">
            <div v-for="(item,index) in teamMember" :key="index" style="width:1.3rem;margin-top:0.42rem">
              <div>
                <img :src="item.icon"/>
              </div>
              <div>{{item.name}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import { evaluateTypeMap } from '@/view/mixins/str_map'

export default {
  data () {
    return {
      task_release: {},
      evaluateTypeMap: evaluateTypeMap,
      teamMember: [],
      teamLeader: ''
    }
  },
  watch: {

  },
  computed: {
    task_release_id () {
      return this.$route.query.task_release_id
    }
  },
  methods: {
    back () {
      window.history.go(-1)
    },
    getInfo () {
      this.axios.request({
        method: 'get',
        url: 'index.php/Teacher/Task/task_release_detail',
        params: {
          task_release_id: this.task_release_id
        }
      }).then(res => {
        if (res.code === 200) {
          this.task_release = res.data.task_release
          if (res.data.task_release.release_type === 1) {
            this.teamMember = []
            this.teamLeader = ''
            for (let i = 0; i < res.data.task_release.students.length; i++) {
              if (res.data.task_release.students[i].is_team_leader === 0) {
                this.teamMember.push(res.data.task_release.students[i])
              } else {
                this.teamLeader = res.data.task_release.students[i]
              }
            }
          }

          // this.task_release.teamList = this.dealTeamList(this.task_release.students)
        }
      })
    }
  },
  mounted () {
    this.getInfo()
  }
}
</script>
