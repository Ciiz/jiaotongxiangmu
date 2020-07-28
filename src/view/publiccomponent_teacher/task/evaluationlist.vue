<template>
  <Row>
    <Table
      size="small"
      ref="selection"
      :columns="columns"
      :data="course_list"
      @on-sort-change="handleSortChange"
      :height="$store.state.app.tableHeight"
    ></Table>
        <Modal v-model="isshowteameva_write" width="50" title="写评价"  footer-hide  :mask-closable='false' :styles="{top: '20px'}">
          <div v-if="isshowteameva_write">
              <addwriteeva @writeend='writeend' :writeEvaluationid="writeEvaluationid" :release_type="release_type" ></addwriteeva>
          </div>
        </Modal>
        <Modal v-model="isshowteameva_watch" width="50" title="看评价"  footer-hide  :mask-closable='false' :styles="{top: '20px'}">
          <div v-if="isshowteameva_watch">
            <addwatcheva :watchEvaluationid="watchEvaluationid" :release_type="release_type"></addwatcheva>
          </div>
        </Modal>
  </Row>
</template>
<script>
import addwriteeva from '@/view/publiccomponent_teacher/task/addwriteeva.vue'
import addwatcheva from '@/view/publiccomponent_teacher/task/addwatcheva.vue'
export default {
  props: ['rowid'],
  components: {
    addwriteeva,
    addwatcheva
  },
  data () {
    return {
      watchEvaluationid: 0,
      writeEvaluationid: 0,
      release_type: 0,
      data_list: [],
      newrowid: '',
      isshowteameva_watch: false,
      isshowteameva_write: false,
      course_list: [],
      columns: [
        {
          title: '序号',
          render: (h, params) => {
            return (
              <div>
                <p style="padding-left:8px;">
                  { this.release_type === 1 ? params.row.team_id : params.row.student_id}
                </p>
              </div>
            )
          }
        },
        {
          title: '名称',
          render: (h, params) => {
            return (
              <div>
                <p style="padding:10px 0;">
                  { this.release_type === 1 ? '小组' : params.row.is_team_leader === 0 ? null : null }
                  { this.release_type === 2 ? params.row.name : params.row.team_id}
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
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.writeEvaluation(params.row, params.index)
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
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.watchEvaluation(params.row)
                    this.isshowteameva_watch = true
                  }
                }
              }, '看评价')
            ])
          }
        }
      ]
    }
  },
  created () {
    this.newrowid = this.rowid
    this.getInfo()
  },
  methods: {
    watchEvaluation (row) {
      if (this.release_type === 1) {
        this.watchEvaluationid = row.leader_task_id
      } else if (this.release_type === 2) {
        this.watchEvaluationid = row.id
      }
    },
    writeEvaluation (row, index) {
      if (this.release_type === 1) {
        this.writeEvaluationid = row.leader_task_id
      } else if (this.release_type === 2) {
        this.writeEvaluationid = row.id
      }
    },
    writeend (value) {
      this.isshowteameva_write = value
    },
    handleSortChange (sort) {
      this.sortType = sort.key
      this.sortOrder = sort.order
      this.getData()
    },
    handlePageChange: function (val) {
      this.page_no = val
      this.getData()
    },
    getInfo () {
      this.axios.request({
        method: 'post',
        url: '/index.php/Teacher/Task/team_list',
        data: {
          task_release_id: this.rowid
        }
      }).then(res => {
        if (res.code === 200) {
          if (res.data.release_type === 2) {
            this.release_type = res.data.release_type
            let clonelist = res.data.list
            this.course_list.splice(0, this.course_list.length)
            for (let item in clonelist) {
              this.course_list.push(clonelist[item])
            }
          } else if (res.data.release_type === 1) {
            this.release_type = res.data.release_type
            let clonelist = res.data.list
            for (let item in clonelist) {
              if (clonelist[item].is_team_leader === 1) {
                this.course_list.push({ team_id: item, leader_task_id: clonelist[item].id })
              }
            }
          }
        }
      })
    }
  },
  mounted () {
  }
}
</script>
<style scoped>
</style>
