<template>
  <div>
    <Row v-for="(team,index) in teamList" :key="index" class="row-item">
      <div>
        <b>组长: </b>
        <Select :value="team.team_leader.student_id" style="width: 150px;" size="small" :filterable="true" @on-change="(val) =>{handleLeaderChange(val,team.team_leader.student_id)}">
          <Option :value="item.student_id" v-for="item in team.studentList" :key="item.id">{{item.name}}</Option>
        </Select>
      </div>
      <p><b>组员: </b><span v-for="member in team.members" :key="member.student_id">{{member.name}} 、 </span></p>
    </Row>
    <Spin fix v-show="loading"></Spin>
  </div>
</template>
<script>
export default{
  props: {
    task_release_id: ''
  },
  data () {
    return {
      teamList: [{
        team_leader: {}
      }],
      loading: false
    }
  },
  watch: {
    task_release_id (n, o) {
      this.getInfo()
    }
  },
  methods: {
    getInfo () {
      this.loadingText = ''
      this.loading = true
      this.axios.request({
        method: 'post',
        url: '/index.php/Teacher/Task/team_list',
        data: {
          task_release_id: this.task_release_id
        }
      }).then(res => {
        if (res.code === 200) {
          this.dealTeamData(res.data.list)
        }
        this.loading = false
      })
    },
    dealTeamData (data) {
      let arr = []
      let team_ids = Object.keys(data)
      team_ids.forEach(team => {
        team = parseInt(team)
        let team_data = Object.values(data[team])
        let obj = {}
        let members = []

        team_data.forEach(item => {
          if (item.team_id === team) {
            if (item.is_team_leader) {
              obj.team_leader = item
            } else {
              members.push(item)
            }
          }
        })
        obj.members = members
        obj.studentList = team_data
        arr.push(obj)
      })
      this.teamList = arr
    },
    handleLeaderChange (newVal, oldVal) {
      this.loading = true
      this.loadingText = '更换中...'
      this.axios.request({
        method: 'post',
        url: '/index.php/Teacher/Task/change_leader',
        data: {
          task_release_id: this.task_release_id,
          new_leader_student_id: newVal,
          old_leader_student_id: oldVal
        }
      }).then(res => {
        if (res.code === 200) {
          this.$Message.success(res.message)
          this.getInfo()
          this.ischangeleader = false
        }
        this.loading = false
      })
    }
  },
  mounted () {
    this.getInfo()
  }
}

</script>
