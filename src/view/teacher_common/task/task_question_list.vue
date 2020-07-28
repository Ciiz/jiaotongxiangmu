<template>
  <div>
    <Table :loading="loading" ref="selection" :columns="columns" :data="list" :height="$store.state.app.tableHeight" stripe border></Table>
    <Row>
      <page :total="total" :current="page"  :page-size="page_size" size="small" show-elevator @on-change="(page) => {this.getData()}"  :placement="'top'"></page>
    </Row>
    <Modal v-model="modal" :title="title" :width="modal_width" :footer-hide="footerHide" :fullscreen="fullscreen">
      <TaskQuestioDetail :student_task_id="target_id" v-if="target === 'task_question_detail'"></TaskQuestioDetail>
    </Modal>
  </div>
</template>
<script>
import modal_mixin from '@/view/mixins/modal_mixin'
import TaskQuestioDetail from '@/view/teacher_common/task/task_question_detail.vue'
export default{
  props: {
    task_release_id: ''
  },
  mixins: [modal_mixin],
  components: {
    TaskQuestioDetail
  },
  watch: {
    task_release_id (n, o) {
      this.getData(true)
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
          title: '姓名',
          key: 'student_name',
          width: 100
        },
        {
          title: '提问内容',
          key: 'content',
          width: 200,
          tooltips: true
        },
        {
          title: '提问时间',
          key: 'created_at',
          minWidth: 400,
          render: (h, params) => {
            return (
              <div>
                <p>{this.moment(params.row.created_at * 1000).format('YYYY-MM-DD HH:mm')}</p>
              </div>
            )
          }
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
                <Button type='info' size="small" onClick={() => { this.open('task_question_detail', row.id, '问题回复') }}>回复</Button>
              </div>
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
        url: '/index.php/Teacher/TaskQuestion/index',
        method: 'post',
        data: {
          task_release_id: this.task_release_id
        }
      }).then(res => {
        if (res.code === 200) {
          this.list = res.data.question_list
          this.total = res.data.pages * this.page_size
        }
        this.loading = false
      })
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
<style lang="less">

</style>
