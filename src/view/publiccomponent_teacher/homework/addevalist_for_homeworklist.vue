<template>
  <Row>
    <Table size="small" ref="selection" :columns="columns" :data="course_list" :height="$store.state.app.tableHeight"></Table>
      <div v-if="isshowteameva_write">
        <Modal v-model="isshowteameva_write" width="1000" title="写评价"  footer-hide  :mask-closable='false' :styles="{top: '20px'}">
            <addwriteeva @closewrite='closewrite' :writeEvaluationid="writeEvaluationid" :release_type="release_type" ></addwriteeva>
        </Modal>
      </div>
      <div v-if="isshowteameva_watch">
        <Modal v-model="isshowteameva_watch" width="1000" title="看评价"  footer-hide  :mask-closable='false' :styles="{top: '20px'}">
            <addwatcheva :evaid="watchEvaluationid" :release_type="release_type"></addwatcheva>
        </Modal>
      </div>
  </Row>
</template>
<script>
import addwriteeva from '@/view/publiccomponent_teacher/homework/addwriteEva_homeworklist.vue'
import addwatcheva from '@/view/publiccomponent_teacher/homework/addwatchEva_homeworklist.vue'
export default {
  props: ['evaid'],
  components: {
    addwriteeva,
    addwatcheva
  },
  data () {
    return {
      writeEvaluationid: 0,
      watchEvaluationid: 0,
      release_type: 0,
      isshowteameva_watch: false,
      isshowteameva_write: false,
      course_list: [],
      columns: [
        {
          title: '学号',
          key: '',
          width: 250,
          render: (h, params) => {
            return (
              <div>
                <p style="padding-left:8px;">
                  { params.row.s_no}
                </p>
              </div>
            )
          }
        },
        {
          title: '姓名',
          key: '',
          render: (h, params) => {
            return (
              <div>
                <p style="padding:10px 0;">
                  {params.row.name}
                </p>
              </div>
            )
          }
        },
        {
          title: '是否提交',
          key: '',
          render: (h, params) => {
            return (
              <div>
                <p style="padding:10px 0;">
                  {params.row.submit_status === 0 ? '未提交' : '已提交'}
                </p>
              </div>
            )
          }
        },
        {
          title: '是否评价',
          key: '',
          render: (h, params) => {
            return (
              <div>
                <p style="padding:10px 0;">
                  {params.row.score_status === 0 ? '未评价' : '已评价'}
                </p>
              </div>
            )
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          fixed: 'right',
          minWidth: 100,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px',
                  display: params.row.submit_status === 0 ? 'none' : 'inline-block'
                },
                on: {
                  click: () => {
                    this.writeEvaluation(params.row)
                    this.isshowteameva_write = true
                  }
                }
              }, '写评价'),
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small',
                  ghost: true
                },
                style: {
                  marginRight: '5px',
                  display: params.row.submit_status === 0 ? 'none' : 'inline-block'
                },
                on: {
                  click: () => {
                    this.watchEvaluation(params.row)
                    this.isshowteameva_watch = true
                  }
                }
              }, '看评价'),
              h('Button', {
                props: {
                  type: 'warning',
                  size: 'small'
                },
                style: {
                  display: params.row.submit_status === 0 ? 'inline-block' : 'none'
                }
              }, '该学生暂未提交，无法进行其它操作')
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
    closewrite (val) {
      this.isshowteameva_write = val
    },
    watchEvaluation (row) {
      this.watchEvaluationid = row.id
    },
    writeEvaluation (row) {
      this.writeEvaluationid = row.id
    },
    getInfo () {
      this.axios.request({
        method: 'post',
        url: '/index.php/Teacher/Homework/student_list',
        data: {
          homework_release_id: this.evaid
        }
      }).then(res => {
        for (let item in res.data) {
          this.course_list.push(res.data[item])
        }
      })
    }
  },
  mounted () {
  }
}
</script>
