<template>
  <div>
    <Alert>自己和别人组都提交了才能评分</Alert>
    <div
      class="team-item"
      v-for="(leader,index) in teamList"
      :key="index"
      v-show="leader.id !== student_task_id"
    >
      <span class="item-left">
        小组{{leader.team_id}}：{{leader.student_name}}的小组 &nbsp;&nbsp;&nbsp;&nbsp;
        <span
          style="color:#0084ff"
          v-if="leader.submit_status"
        >已提交</span>
        <span style="color:red" v-else>未提交</span>
      </span>

      <span class="item-right">
        <Button
          type="primary"
          size="small"
          :disabled="leader.submit_status===0 || self_submit_status === 0"
          @click="showDetail(leader.id)"
        >查看与评价</Button>
      </span>
    </div>
    <div>

    <Modal v-model="otherTeamModal" width="800" footer-hide @on-cancel="cancel">
      <TaskShow
        :student_task_id="o_team_student_task_id"
        :my_student_task_id="student_task_id"
        @success="otherTeamModal = false"
      ></TaskShow>
    </Modal>
    </div>
  </div>
</template>

<script>
import TaskShow from './other_team_task_detail'
import { get_task_team_list } from '@/api/student'
export default {
  props: {
    student_task_id: ''
  },
  components: {
    TaskShow
  },
  data () {
    return {
      otherTeamModal: false,
      teamList: [],
      o_team_student_task_id: '',
      self_submit_status: 0
    }
  },
  watch: {
    student_task_id (n, o) {
      this.getTeamTask(n)
    }
  },
  created () {
    this.$nextTick(() => {
      this.getTeamTask(this.student_task_id)
    })
  },
  methods: {
    cancel () {
      this.o_team_student_task_id = ''
    },
    getTeamTask (student_task_id) {
      let _this = this
      get_task_team_list(student_task_id).then(res => {
        if (res.code === 200) {
          _this.teamList = res.data.teamList
          this.teamList.map(item => {
            if (item.id === this.student_task_id) {
              this.self_submit_status = item.submit_status
            }
          })
        }
      })
    },
    showDetail (student_task_id) {
      this.o_team_student_task_id = student_task_id
      this.otherTeamModal = true
    }
  },

  mounted () {
  }
}
</script>
<style lang="less" scoped>
  .team-item {
    display: flex;
    height: 50px;
    background: #fff;
    padding: 12px;
    align-items: center;
    justify-content: space-between;
    position: relative;
    &:hover {
      box-shadow: 1px 2px 5px gray;
      transition: all ease-in-out 0.3s;
    }
    &:after {
      content: "";
      position: absolute;
      height: 1px;
      background: #fcfcfc;
      bottom: 0px;
      transform: translateY(0.5);
      width: 98%;
    }
    .item-right {
      .ivu-btn {
        margin-left: 5px;
      }
    }
  }
</style>
