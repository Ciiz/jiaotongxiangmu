<template>

  <Row style="padding:20px;background:#F2F2F2;height:100%">
    <Answer :student_task_id="student_task_id" @back="back" @success="handleSuccess"
      v-if="showAnswer&&target === 'answer'"></Answer>
    <AnswerTeam :student_task_id="student_task_id" @back="back" @success="handleSuccess"
      v-if="showAnswer&&target === 'answer_team'"></AnswerTeam>
    <div class="mytask_list" style="height:100%">
      <div class="correct_newLeftStudent">
        <ul>
          <li v-for="(v,i) in my_course_list" :key="i" @click="handle_click(v,i)"
            :class="{active_color_index:active_index==i}">
            {{v.course_name}}
          </li>
        </ul>
      </div>
      <div style="display:flex;flex-direction:column;flex:1;">
        <div class="correct-iscorrect" v-show="!showAnswer">
          <span style="background:#1170FF;color:#FFFFFF" v-if="finish===0">未完成({{count}})</span>
          <span style="background:#ffffff" v-if="finish===0" @click="finish=1;getData()">已完成</span>
          <span style="background:#ffffff" v-if="finish===1" @click="finish=0;getData()">未完成({{count}})</span>
          <span style="background:#1170FF;color:#FFFFFF" v-if="finish===1">已完成</span>
        </div>
        <div style="padding:10px;background:#ffffff;flex:1;height:100%;" v-show="!showAnswer">
          <div class="courseware_list_table_parent">
            <Table class="courseware_list_table task-table" :loading="loading" ref="selection" :columns="columns"
              :data="list" @on-sort-change="handleSortChange">
            </Table>
          </div>
        </div>
      </div>
    </div>
    <Modal v-model="modal" :title="title" width="800" footer-hide :mask-closable="false">
      <Evaluate :student_task_id="student_task_id" v-if="target === 'evaluate'"></Evaluate>
      <newtaskDetail :student_task_id="student_task_id" v-if="target === 'newtaskDetail'"></newtaskDetail>
      <EvaluateM :student_task_id="student_task_id" v-if="target === 'evaluate_m'"></EvaluateM>
      <EvaluateTeamLeader :student_task_id="student_task_id" v-if="target === 'evaluate_team_leader'"
        @success="handleSuccess"></EvaluateTeamLeader>
      <TeamListM :student_task_id="student_task_id" v-if="target === 'team_list_m'" @success="handleSuccess">
      </TeamListM>
    </Modal>
  </Row>

</template>

<script>
import { my_course } from '@/api/student'
import AnswerTeam from '@/view/class_common/task/answer_team'
import Answer from '@/view/class_common/task/answer'
import newtaskDetail from '@/view/class_common/task/newtask_detail'
import Evaluate from '@/view/class_common/task/evaluate'
import EvaluateM from '@/view/class_common/task/evaluate_m'
import EvaluateTeamLeader from '@/view/class_common/task/evaluate_team_leader'
import TeamListM from '@/view/class_common/task/team_list_m'
import { BMATypeMap } from '@/view/mixins/str_map'
export default {
  props: {
    type: 0,
    student_course_id: '',
    courseware_id: '',
    teacher_course_id: '',
    show_filter_option: {
      type: Boolean,
      default: false
    },
    toTasktId: '',
    toIsLeader: ''
  },
  components: {
    AnswerTeam,
    Answer,
    Evaluate,
    EvaluateM,
    EvaluateTeamLeader,
    TeamListM,
    newtaskDetail
  },
  data () {
    return {
      active_index: null,
      my_course_list: [],
      showAnswer: false,
      modal: false,
      title: '',
      target: '',
      loading: false,
      keyword: '',
      searchType: 0,
      sortType: ' qcreate_at',
      sortOrder: 'desc',
      student_task_id: '',
      list: [],
      count: 0,
      page_no: 1,
      page_size: 20,
      submit_status: -1,
      finish: 0,
      columns: [
        {
          title: '任务名称',
          align: 'center',
          key: 'task_name',
          minWidth: 200
        },
        {
          title: '截至时间',
          align: 'center',
          key: '',
          width: 200,
          render: (h, params) => {
            return (
              <div>
                <p>{this.moment(params.row.end_time * 1000).format('YYYY-MM-DD HH:mm')}</p>
              </div>
            )
          }
        },
        {
          title: '角色类型',
          align: 'center',
          key: '',
          width: 150,
          render: (h, params) => {
            let type = params.row.release_type
            if (type === 1) {
              let is_leader = params.row.is_team_leader === 1 ? '组长' : '组员'
              var stuList = params.row.team_members_info.members_list
              var team_leader = params.row.team_members_info.team_leader[0]
              return h('Poptip', {
                props: {
                  placement: 'bottom-start',
                  trigger: 'hover'
                }
              }, [
                h('div', {
                  style: {
                    cursor: 'pointer'
                  }
                }, '第' + params.row.team_id + '组' + ' ' + is_leader),
                h('div', {
                  slot: 'content',
                  class: 'groupList'
                }, [
                  h('div', {}, '组长：'),
                  h('div', {}, [
                    h('img', {                      style: {
                        width: '22px',
                        borderRadius: '50%',
                        verticalAlign: 'middle',
                        marginRight: '6px'
                      },
                      attrs: {
                        src: team_leader.icon
                      }
                    }),
                    h('span', {}, team_leader.name)
                  ]),
                  h('div', {}, '组员：'),
                  stuList.map((item, index) => {
                    return h('div', {}, [
                      h('img', {                        style: {
                          width: '20px',
                          borderRadius: '50%',
                          verticalAlign: 'middle',
                          marginRight: '6px'
                        },
                        attrs: {
                          src: item.icon
                        }
                      }),
                      h('span', {}, item.name)
                    ]
                    )
                  })
                ]
                )
              ])
            } else {
              return h('div', [
                <div v-show={type === 2} class="blut-tag">个人</div>
              ])
            }
          }
        },
        {
          title: '任务类型',
          align: 'center',
          key: 'type',
          width: 150,
          render: (h, params) => {
            let type = params.row.type
            return (
              <div>
                <span>{BMATypeMap[type]}</span>
              </div>
            )
          }
        },
        {
          title: '授课老师',
          align: 'center',
          key: '',
          width: 160,
          render: (h, params) => {
            return (
              <div>
                <span style="margin-right:20px">{params.row.teacher}</span>
                <button class="blueText-btn" onClick={() => { this.question(params.row) }}>提问</button>
              </div>
            )
          }
        },
        {
          title: '任务详情',
          align: 'center',
          key: '',
          width: 150,
          render: (h, params) => {
            return (
              <div>
                <button class="blackBorder-btn" style="width:60px;height:30px" onClick={() => { this.open('newtaskDetail', params.row.id, '任务详情 ') }}>查看</button>
              </div>
            )
          }
        },
        {
          title: '讨论',
          align: 'center',
          key: '',
          width: 150,
          render: (h, params) => {
            return (
              <div>
                <button class="blackBorder-btn" onClick={() => { this.discussion(params.row) }} v-show={params.row.release_type === 1} style="width:80px;height:30px">小组讨论</button>
              </div>
            )
          }
        },
        {
          title: '作答',
          align: 'center',
          key: '',
          width: 150,
          render: (h, params) => {
            let row = params.row
            let respondenceText = (row.submit_status === 0) ? '作答' : '查看'
            return (
              <div>
                <button class="blueC-btn" onClick={() => { this.taskDetail(params.row) }} v-show={!row.score_status} style="width:60px;height:30px">{respondenceText}</button>
              </div>
            )
          }
        },
        // {
        //   title: '查看回答',
        //   align: 'center',
        //   key: '',
        //   width: 150,
        //   render: (h, params) => {
        //     let row = params.row
        //     return (
        //       <div>
        //         <span v-show={row.submit_status === 0}>任务未提交</span>
        //         <button v-show={row.submit_status === 1} class="blueText-btn">查看</button>
        //       </div>
        //     )
        //   }
        // },
        {
          title: '评价',
          key: '',
          width: 300,
          align: 'center',
          render: (h, params) => {
            let row = params.row
            return (
              // 先用有没提交判断有没评价， 个人任务：可以查看评价，任务详情/提交只能在课件播放里面看，小组任务：组长查看任务评价（其他小组对本小组的评价）
              <div>
                <button class="blueC-btn" onClick={() => { this.evaluateDetail(params.row) }} v-show={row.score_status}>看评价</button>
                <button class="blueC-btn" onClick={() => { this.evaluateTeamLeader(params.row) }} v-show={row.score_status && !row.is_team_leader && row.release_type === 1}>评价组长</button>
                <button style="margin-left:10px" class="blueC-btn" onClick={() => { this.evaluateTeamList(params.row) }} v-show={row.submit_status && row.is_team_leader && row.type === 2}>评价其他小组</button>
              </div>
            )
          }
        }
      ]
    }
  },
  watch: {
    teacher_course_id (n, o) {
      this.getData(true)
    }
  },
  methods: {
    async handle_click (v, i) {
      let _this = this
      _this.active_index = i
      _this.loading = true
      let res = await _this.axios.request({
        url: '/index.php/Student/Task/page',
        method: 'get',
        params: {
          page_size: 100000,
          page_no: 1,
          sortType: _this.sortType,
          sortOrder: _this.sortOrder,
          type: _this.type, // 0:全部，1：课前，2：课中，3课后
          student_course_id: _this.student_course_id,
          courseware_id: _this.courseware_id,
          teacher_course_id: _this.teacher_course_id,
          score_status: -1,
          finish: _this.finish,
          submit_status: _this.submit_status,
          teacher_course_id: v.teacher_course_id
        }
      })

      this.list = res.data.list
      _this.loading = false
    },
    async get_my_course () {
      let res = await my_course({
        page_size: 1000,
        page_no: 1
      })
      this.my_course_list = res.data.list
    },
    getData (isSearch) {
      let _this = this
      if (isSearch) {
        _this.page_no = 1
      }
      _this.loading = true
      _this.axios.request({
        url: '/index.php/Student/Task/page',
        method: 'get',
        params: {
          page_size: 100000,
          page_no: 1,
          sortType: _this.sortType,
          sortOrder: _this.sortOrder,
          keyword: _this.keyword,
          type: _this.type, // 0:全部，1：课前，2：课中，3课后
          student_course_id: _this.student_course_id,
          courseware_id: _this.courseware_id,
          teacher_course_id: _this.teacher_course_id,
          score_status: -1,
          finish: _this.finish,
          submit_status: _this.submit_status
        }
      }).then(res => {
        console.log(res);
        if (res.code === 200) {
          this.list = res.data.list
          if (this.finish === 0) {
            this.count = res.data.count
          }
        }
        _this.loading = false
      })
    },
    taskDetail (student_task) { // 作答
      if (student_task.is_team_leader === 1) {
        this.open2('answer_team', student_task.id, '任务详情 ')
      } else {
        this.open2('answer', student_task.id, '任务详情 ')
      }
    },
    evaluateDetail (student_task) {
      switch (student_task.type) {
        case 1:
          this.open('evaluate', student_task.id, '课前任务评价详情 ')
          break
        case 2:
          if (student_task.release_type === 1) {
            this.open('evaluate_m', student_task.id, '课中任务评价详情 ')
          } else {
            this.open('evaluate', student_task.id, '课后任务评价详情 ')
          }
          break
        case 3:
          this.open('evaluate', student_task.id, '课后任务评价详情 ')
          break
      }
    },
    evaluateTeamList (student_task) {
      this.open('team_list_m', student_task.id, '组间互评')
    },
    evaluateTeamLeader (student_task) {
      this.open('evaluate_team_leader', student_task.id, '评价组长')
    },
    discussion (student_task) { // 小组讨论
      let tg = 'task' + student_task.task_id + '_tr_' + student_task.task_release_id + '_team' + student_task.team_id
      this.axios.request({
        url: '/index.php/Student/StudentTask/task_send',
        method: 'post',
        data: {
          taskgroup: tg,
          student_task_id: student_task.id,
          content: '发起讨论，相关课件：' + student_task.courseware_name
        }
      }).then(res => {
        if (res.code === 200) {
          this.$emit('showUserDiscuss')
        }
      })
    },
    question (student_task) {
      let a = 'task_' + student_task.teacher_id + '_' + this.$store.state.user.userInfo.userId
      this.$emit('sendInfoStudent', student_task.teacher_id, '提问内容：' + student_task.task_name, 1, a)
      setTimeout(() => {
        this.$emit('showUserDiscuss')
      }, 500)
    },
    open (target, target_id, title) {
      this.modal = true
      this.target = target
      this.title = title
      this.student_task_id = target_id
    },
    open2 (target, target_id, title) {
      this.showAnswer = true
      this.target = target
      this.title = title
      this.student_task_id = target_id
    },
    handleSortChange (sort) { // 排序
      this.sortType = sort.key
      this.sortOrder = sort.order
      this.getData()
    },
    handleSuccess () {
      this.showAnswer = false
      this.target = ''
      this.getData()
    },
    back () {
      this.showAnswer = false
    }
  },
  mounted () {
    this.get_my_course()
    this.getData()
    if (this.toTasktId) {
      this.$nextTick(() => {
        let item = { is_team_leader: this.toIsLeader, id: this.toTasktId }
        this.taskDetail(item)
      })
    }
  }

}
</script>

<style lang="less">
.mytask_list {
  display: flex;
}
.active_color_index {
  background-color: #1170ff;
  color: #fff !important;
  border-radius: 5px;
}
.btn-margin {
  margin-right: 10px;
}
.task-table .ivu-table-cell {
  overflow: inherit;
}
.task-table .ivu-table-cell > div {
  position: relative;
}
.groupList > div {
  margin: 6px 0;
  color: #666666;
  text-align: left;
}
</style>
