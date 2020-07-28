<template>
  <div>
    <Table :loading="loading" ref="selection" :columns="columns" :data="list" :height="$store.state.app.tableHeight" stripe></Table>
    <Row>
      <page :total="total" :current="page"  :page-size="page_size" size="small" show-elevator @on-change="(page) => {this.page = page , this.getData()}"  :placement="'top'"></page>
    </Row>
    <Modal v-model="modal" :title="title" :width="modal_width" :footer-hide="footerHide" :fullscreen="fullscreen">
      <StudentTaskEvaluate :student_task_id="target_id" v-if="target === 'student_task_evaluate'" @success="modal = false ; getData()"></StudentTaskEvaluate>
    </Modal>
  </div>
</template>
<script>
import modal_mixin from '@/view/mixins/modal_mixin'
import StudentTaskEvaluate from '@/view/teacher_common/task/student_task_evaluate'
export default{
  props: {
    task_release_id: ''
  },
  mixins: [modal_mixin],
  components: {
    StudentTaskEvaluate
  },
  data () {
    return {
      page: 1,
      page_size: 7,
      total: 0,
      list: [],
      keyword: '',
      loading: false,
      release_type: '',
      columns: [
        {
          title: this.release_type === 1 ? '小组' : '学生',
          key: 'name',
          width: 200,
          render: (h, params) => {
            return (
              <div >
                <div v-show={this.release_type === 2}>{params.row.name}</div>
                <div v-show={this.release_type === 1}>小组{params.row.team_id} （组长：{params.row.name} ）</div>
              </div>
            )
          }
        },
        {
          title: '学号',
          key: 's_no',
          minWidth: 450
        },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          align: 'center',
          width: 300,
          render: (h, params) => {
            let row = params.row
            return (
              <div>
                <Button type='info' size="small" onClick={() => { this.open('student_task_evaluate', row.id, '评价') }}>评价</Button>
              </div>
            )
          }
        }
      ]
    }
  },
  watch: {
    task_release_id (n, o) {
      this.getData(true)
    }
  },
  methods: {
    getData (isSearch) {
      if (isSearch) this.page = 1
      this.loading = true
      this.axios.request({
        method: 'post',
        url: '/index.php/Teacher/Task/team_list_v2',
        data: {
          task_release_id: this.task_release_id
        }
      }).then(res => {
        if (res.code === 200) {
          this.list = res.data.list
          this.release_type = res.data.release_type
        }
        this.loading = false
      })
    }
  },
  mounted () {
    this.getData(true)
  }
}
</script>
