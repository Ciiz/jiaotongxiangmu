<template>
  <div>
    <!-- 课中任务列表 -->
    <Table :data="list" size="small" :columns="columns"></Table>
    <Modal v-model="modal" :title="title" width="800" footer-hide :mask-closable="false">
      <Task :student_task_id="target_id" v-if="target === 'task'"></Task>
      <TeamDiscussion :student_task_id="target_id" ref="team_discussion" v-if="target === 'team_discussion'">
      </TeamDiscussion>
    </Modal>
  </div>
</template>
<script>
import Task from './task_detail.vue'
import TeamDiscussion from '@/view/class_common/task/team_discussion.vue'
import modal_mixin from '@/view/mixins/modal_mixin'
import log from 'video.js/es5/utils/log'
export default {
  props: {
    student_courseware_id: '',
    listask: {}

  },
  mixins: [modal_mixin],
  components: {
    Task,
    TeamDiscussion
  },
  data () {
    return {
      list: [],
      modal: false,
      columns: [
        {
          key: 'task.task_name',
          title: '任务名称',
          align: 'center',
          render: (h, params) => {
            return <p>{params.row.task.task_name}</p>
          }
        },
        {
          title: '任务类型',
          key: 'type',
          align: 'center',
          render: (h, params) => {
            let type = params.row.release_type
            let is_leader = params.row.is_team_leader
            return (
              <div>
                <Tag color="success" v-show={type === 1}>小组-{is_leader ? '  组长' : '  组员'}</Tag>
                <Tag color="primary" v-show={type === 2}>个人</Tag>
              </div>
            )
          }
        },
        {
          key: 'option',
          title: '操作',
          align: 'center',
          render: (h, params) => {
            console.log(params);
            return (
              <div style="text-align:center">
                <Button size="small" type="primary" style="margin:2px 0" onClick={() => { this.open('task', params.row.id, '任务详情') }}>查看</Button>
              </div>
            )
          }
          // <Button size="small" type="warning" style="margin:2px 0" onClick={() => { this.open('team_discussion', params.row.id, '小组讨论') }} v-show={params.row.release_type === 1}>小组讨论</Button>
        }
      ]
    }
  },
  watch: {
    student_courseware_id (newVal, oldVal) {
      this.getData()
    },
    listask () {
      this.list = this.listask
    }
  },

  methods: {

    getData () {
      if (!this.student_courseware_id) {
        return false
      }
      this.axios.request({
        method: 'get',
        url: 'index.php/Student/Task/getClassMiddleTask',
        params: {
          student_courseware_id: this.student_courseware_id
        }
      }).then(res => {

        if (res.code === 200) {
          this.list = res.data.list.filter(v => {
            return v.release_status === 1
          });
        }
      })
    }
  },
  created () {

    this.getData()
    let _this = this
    this.$on('message', msg => {
      _this.$refs.team_discussion.$emit('message', msg)
    })
  }
}
</script>
