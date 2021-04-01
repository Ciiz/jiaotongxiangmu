<template>
  <div>
    <Row class="search-bar">
      <Input type="text" v-model="keyword" placeholder="请输入搜索内容" class="new-searchSel"></Input>
      <button @click="getData(true)" class="blue-btn" style="width:80px;transform: translate(-20px,2px);">搜索</button>
      <button @click="open('task_edit','','添加任务')" class="blueC-btn" style="margin-left:15px;"
        v-if="editable">添加任务</button>
      <!-- <button @click="open('task_select','','选择任务')" class="green-btn" style="margin-left:15px;width:104px"
        v-if="editable">选择任务</button> -->
      <slot name="search-bar"></slot>
    </Row>
    <Table :loading="loading" ref="selection" class="task_release_list_table" :columns="columns" :data="list"
      :height="$store.state.app.tableHeight" stripe border></Table>
    <Row>
      <page :total="total" :current="page" :page-size="page_size" size="small" show-elevator
        @on-change="(page) => {this.page = page , this.getData(false)}" :placement="'top'"></page>
    </Row>
    <Modal v-model="modal" :title="title" width="1200" :footer-hide="footerHide" :fullscreen="fullscreen"
      :mask-closable='false'>
      <TaskReleaseDetail :task_release_id="target_id" v-if="target === 'task_release_detail'"></TaskReleaseDetail>
      <Student-exam-list style="height:700px" @closeModal="closeModal" :targetwork_id="target_id" :target_type='target'
        v-if="target === 'student_task_list' && modal"></Student-exam-list>
      <TaskTeamLeaderChange :task_release_id="target_id" v-if="target === 'task_team_leader_change' && modal">
      </TaskTeamLeaderChange>
      <TaskEdit :timetable_id="timetable_id" :type="type" :task_release_id="target_id" :courseware_id="courseware_id"
        v-if="target === 'task_edit' && modal" @success="modal = false; getData(); target = ''"></TaskEdit>
      <TaskSelect :timetable_id="timetable_id" :type="type" :courseware_id="courseware_id"
        v-if="target === 'task_select'" @success="modal = false; getData(); target = ''"></TaskSelect>
      <TaskEvaluationEdit :id="target_id" v-if="target === 'task_evaluation_edit'" @success="modal = false;">
      </TaskEvaluationEdit>
    </Modal>
  </div>
</template>
<script>
import modal_mixin from '@/view/mixins/modal_mixin'
import TaskReleaseDetail from '@/view/teacher_common/task/task_release_detail.vue'
import StudentExamList from '@/view/teacher_common/exam/student_exam_list'
import TaskTeamLeaderChange from '@/view/teacher_common/task/task_team_leader_change.vue'
import TaskEdit from '@/view/teacher_common/task/task_edit.vue'
import TaskSelect from '@/view/teacher_common/task/task_select.vue'
import TaskEvaluationEdit from '@/view/teacher_common/task/task_evaluation_edit.vue'
import { ReleaseMap } from '@/view/mixins/str_map'
import { task_release, task_un_release } from '@/api/data'
export default {
  props: {
    type: '',
    courseware_id: '',
    timetable_id: '',
    release_status: '',
    editable: false
  },
  mixins: [modal_mixin],
  components: {
    TaskReleaseDetail, StudentExamList, TaskTeamLeaderChange, TaskEdit, TaskSelect, TaskEvaluationEdit
  },
  watch: {
    refreshFlag (n, o) {
      this.getData(true)
    }
  },
  computed: {
    refreshFlag () {
      return this.type + this.courseware_id + this.timetable_id + this.release_status
    }
  },
  data () {
    return {
      page: 1,
      page_size: 7,
      total: 0,
      list: [],
      keyword: '',
      loading: false,
      columns: [
        {
          title: '任务名称',
          align: 'center',
          key: 'task_name',
          minWidth: 250
        },
        {
          title: '时间',
          align: 'center',
          key: '',
          width: 240,
          render: (h, params) => {
            return (
              <div>
                <p>开始时间: {this.moment(params.row.start_time * 1000).format('YYYY-MM-DD HH:mm')}</p>
                <p>结束时间: {this.moment(params.row.end_time * 1000).format('YYYY-MM-DD HH:mm')}</p>
              </div>
            )
          }
        },
        {
          title: '发布状态',
          key: 'release_status',
          width: 120,
          align: 'center',
          render: (h, params) => {
            return (
              <div>
                {ReleaseMap[params.row.release_status]}
              </div>
            )
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width: 420,
          render: (h, params) => {
            let row = params.row
            return (
              <div class="task_release_list_btnList">
                <button class={row.release_status ? 'orangeText-btn' : 'orange-btn'} style="width:43px" onClick={() => { this.release(row) }}>{row.release_status === 0 ? '发布' : '撤回'}</button>
                <button class="blueText-btn" onClick={() => { this.open('task_release_detail', row.task_release_id, '任务-发布详情') }}>查看</button>
                <button class="blueText-btn" onClick={() => { this.open('task_edit', row.task_release_id, '任务-编辑') }} v-show={this.editable}>编辑</button>
                <button class="blueText-btn" v-show={row.release_status === 1} onClick={() => { this.open('student_task_list', row.task_release_id, `${row.task_name}-任务作答列表`) }} >批改</button>
                <button class="blueText-btn" v-show={row.release_type === 1} onClick={() => { this.open('task_team_leader_change', row.task_release_id, '更换小组组长') }}>更换组长</button>
                <button class="redText-btn" onClick={() => { this.del(row.id) }} v-show={this.editable}>删除</button>
              </div>
              // <Button type='warning' size="small" onClick={() => { this.open('task_evaluation_edit', row.id, `任务-${row.task_name}-评分维度编辑`, 600) }} v-show={this.editable}>评分维度</Button>
            )
          }
        }
      ]
    }
  },
  methods: {
    getData (isSearch) {
      if (isSearch) this.page = 1
      this.loading = true
      this.axios.request({
        url: '/index.php/Teacher/Task/index',
        method: 'get',
        params: {
          type: this.type, // 1:课前, 2课中 课后  任务
          page: this.page,
          keyword: this.keyword,
          courseware_id: this.courseware_id,
          timetable_id: this.timetable_id,
          release: this.release_status
        }
      }).then(res => {
        if (res.code === 200) {
          this.list = res.data.task_list
          this.total = res.data.pages * this.page_size
        }
        this.loading = false
      })
    },
    release (item) {
      if (item.release_status === 0) { // 发布
        this.axios.request({
          method: 'post',
          url: '/index.php/Teacher/Task/release',
          data: {
            task_release_id: item.task_release_id
          }
        }).then(res => {
          console.log(res);
          this.$Message.success(res.message)
          this.getData()
        })
        // task_release(item.task_release_id).then(res => {
        //   console.log(res);
        //   if (res.code === 200) {
        //     this.$Message.success(res.message)
        //     this.getData()
        //   }
        // })
      } else {
        this.$Modal.confirm({
          title: '确定要撤回任务吗？',
          onOk: () => {
            task_un_release(item.task_release_id).then(res => {
              if (res.code === 200) {
                this.$Message.success(res.message)
                this.getData()
              }
            })
          }
        })
      }
    },
    del (ids) {
      if (!(ids instanceof Array)) {
        ids = [ids]
      }
      this.$Modal.confirm({
        title: '确定删除? ',
        content: '',
        onOk: () => {
          this.axios.request({
            method: 'post',
            url: '/index.php/Teacher/Task/delete',
            data: {
              id: ids,
              timetable_id: this.timetable_id
            }
          }).then(res => {
            if (res.code === 200) {
              this.$Message.success('删除成功')
              this.getData()
            }
          })
        }
      })
    },
    closeModal () {
      this.modal = false
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
<style lang="less">
</style>
