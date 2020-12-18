<template>
  <div>
    <Table :loading="loading" :columns="columns" stripe :data="list" :height="$store.state.app.tableHeight-40"></Table>
    <div style="margin-top: 10px;">
      <page :total="count" :current="page" show-sizer show-elevator :page-size="page_size"
        @on-page-size-change="(val) => { this.page_size = val; this.getData()}" size="small"
        @on-change="(page) => {this.page = page , this.getData()}" :placement="'top'"></page>
    </div>
    <Modal v-model="modal" :title="title" :width="modal_width" footer-hide>
      <student-exam-list :targetwork_id="target_id" v-if="target === 'student_task_list'" :target_type='target'
        @on-refresh-parent-list="getData()"></student-exam-list>
    </Modal>
  </div>
</template>
<script>
import { get_task_release_list } from '@/api/data'
import modal_mixin from '@/view/mixins/modal_mixin'
import StudentExamList from '@/view/teacher_common/exam/student_exam_list'

export default {
  mixins: [modal_mixin],
  components: {
    StudentExamList
  },
  props: {
    teacher_course_id: '',
    class_id: '',
    keyword: '',
    correct_status: ''
  },
  data () {
    return {
      list: [],
      count: 0,
      page: 1,
      page_size: 20,
      loading: false,
      modal: false,
      columns: [
        {
          title: '任务名称',
          key: 'task_name',
          width: 150
        },
        {
          title: '批改状态',
          key: '',
          width: 100,
          render: (h, params) => {
            let row = params.row
            return (
              <div>
                <Tag color="green" v-show={row.correct_status} >已批改2</Tag>
                <Tag color="red" v-show={!row.correct_status}>待批改</Tag>
              </div>
            )
          }
        },
        {
          title: '发布时间',
          key: '',
          width: 150,
          render: (h, params) => {
            return (
              <div>
                <p> {this.moment(params.row.start_time * 1000).format('YYYY-MM-DD HH:mm')}</p>
              </div>
            )
          }
        },
        {
          title: '截止时间',
          key: '',
          width: 150,
          render: (h, params) => {
            return (
              <div>
                <p> {this.moment(params.row.end_time * 1000).format('YYYY-MM-DD HH:mm')}</p>
              </div>
            )
          }
        },
        {
          title: '班级',
          key: 'class_name',
          width: 150
        },
        {
          title: '课件名称',
          key: 'courseware_name',
          width: 150
        },
        {
          title: '课程名称',
          key: 'course_name',
          width: 150
        },
        {
          title: '操作',
          key: 'action',
          minWidth: 150,
          align: 'center',
          fixed: 'right',
          render: (h, params) => {
            let row = params.row
            return (
              <div>
                <Button size="small" type="primary" onClick={() => { this.open('student_task_list', row.task_release_id, `${row.class_name}-任务: ${row.task_name}`) }}>批改</Button>
              </div>
            )
          }
        }
      ]
    }
  },
  watch: {
    keyword (n, o) {
      this.page = 1
      this.getData()
      // TODO:做节流
    },
    teacher_course_id (n, o) {
      this.page = 1
      this.getData()
    },
    correct_status (n, o) {
      this.page = 1
      this.getData()
    }
  },
  methods: {
    getData () {
      this.loading = true
      get_task_release_list({
        page: this.page,
        page_size: this.page_size,
        keyword: this.keyword,
        class_id: this.class_id,
        teacher_course_id: this.teacher_course_id,
        correct_status: this.correct_status
      }).then(res => {
        if (res.code === 200) {
          this.list = res.data.list
          this.count = res.data.count
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
