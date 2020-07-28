<template>
  <Row>
    <Table
      size="small"
      ref="selection"
      :columns="columns"
      :data="course_list"
      :height="$store.state.app.tableHeight"
    ></Table>
    <Modal
        title="问题回复"
        v-model="isshowanswer"
        :styles="{top: '20px'}"
         mask-closable  footer-hide width="1000">
        <div v-if="isshowanswer">
            <answer :task_id='task_id'></answer>
        </div>
    </Modal>
  </Row>
</template>

<script>
import answer from '@/view/publiccomponent_teacher/answer.vue'
export default {
  components: {
    answer
  },
  props: ['replyid'],
  data () {
    return {
      isshowanswer: false,
      testdata: [],
      task_id: 0,
      rowid: '',
      course_list: [],
      columns: [
        {
          title: '小组id',
          key: 'course_name',
          width: 250,
          render: (h, params) => {
            return (
              <div>
                <p>{params.row.student_id}</p>
              </div>
            )
          }
        },
        {
          title: '提问内容',
          key: '',
          render: (h, params) => {
            return (
              <div>
                <p>{params.row.content}</p>
              </div>
            )
          }
        },
        {
          title: '提问时间',
          width: 200,
          key: '',
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
          width: 100,
          align: 'center',
          fixed: 'right',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginLeft: '5px',
                    width: '50px'
                  },
                  on: {
                    click: () => {
                      this.task_id = params.row.id
                      this.isshowanswer = true
                    }
                  }
                },
                '回复'
              )
            ])
          }
        }
      ],
      evadatalist: [],
      evadatacontent: ''
    }
  },
  created () {
    this.getInfo()
  },
  methods: {
    getInfo () {
      this.axios
        .request({
          method: 'post',
          url: '/index.php/Teacher/TaskQuestion/index',
          data: {
            task_release_id: this.replyid
          }
        }).then(res => {
          if (res.code === 200) {
            this.testdata = res
            this.course_list = res.data.question_list
          }
        })
    }
  }
}
</script>
