<template>
  <Row>
    <Table
      size="small"
      ref="selection"
      :columns="columns"
      :data="course_list"
      :height="$store.state.app.tableHeight"
    ></Table>
    <Modal v-model="isshowtestcorrect" width="1000" title="考试批改" footer-hide :mask-closable='false' :styles="{top: '20px'}">
      <div v-if="isshowtestcorrect">
        <testcorrect :correctid="correctid" @closetestscore='closetestscore'></testcorrect>
      </div>
    </Modal>
  </Row>
</template>
<script>
import testcorrect from '@/view/publiccomponent_teacher/test/addtestcorrect_testscore.vue'
export default {
  props: ['rowid'],
  components: {
    testcorrect
  },
  data () {
    return {
      correctid: 0,
      course_list: [],
      isshowtestcorrect: false,
      columns: [
        {
          title: '序号',
          width: 100,
          render: (h, params) => {
            return (
              <div>
                <p>{params.row.id}</p>
              </div>
            )
          }
        },
        {
          title: '学生学号',
          width: 200,
          render: (h, params) => {
            return (
              <div>
                <p>{params.row.s_no}</p>
              </div>
            )
          }
        },
        {
          title: '学生姓名',
          width: 200,
          render: (h, params) => {
            return (
              <div>
                {params.row.name}
              </div>
            )
          }
        },
        {
          title: '考试状态',
          render: (h, params) => {
            return h('div', {
              style: {
                color: params.row.exam_status === 0 ? 'red' : params.row.exam_status === 1 ? 'green' : ''
              }
            }, params.row.exam_status === 0 ? '未开始' : params.row.exam_status === 1 ? '考试中' : params.row.exam_status === 2 ? '已交卷' : params.row.exam_status === 3 ? '已批改' : params.row.exam_status === 4 ? '逾期' : '')
          }
        },
        {
          title: '客观题得分',
          render: (h, params) => {
            return (
              <div>
                <p>{params.row.object_score}</p>
              </div>
            )
          }
        },
        {
          title: '主观题得分',
          key: '',
          render: (h, params) => {
            return (
              <div>
                <p>{params.row.subject_score}</p>
              </div>
            )
          }
        },
        {
          title: '总分',
          key: '',
          render: (h, params) => {
            return (
              <div>
                <p>{params.row.object_score + params.row.subject_score}</p>
              </div>
            )
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          fixed: 'right',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: params.row.release_status === 0 ? 'error' : 'primary',
                  size: 'small'
                  // disabled: params.row.exam_status === 3
                },
                style: {
                  width: '50px'
                },
                on: {
                  click: () => {
                    this.correct(params.row)
                  }
                }
              }, params.row.score_status === 0 ? '未批改' : '已批改')
            ])
          }
        }
      ]
    }
  },
  created () {
    this.getInfo()
  },
  methods: {
    closetestscore (val) {
      this.isshowtestcorrect = val
      this.getInfo()
    },
    correct (row) {
      this.correctid = row.id
      this.isshowtestcorrect = true
    },
    getInfo () {
      this.axios.request({
        method: 'post',
        url: '/index.php/Teacher/Examination/student_list',
        data: {
          examination_release_id: this.rowid
        }
      }).then(res => {
        let data = res.data
        this.course_list = []
        for (let item in data) {
          this.course_list.push(data[item])
        }
      })
    }
  }
}
</script>
