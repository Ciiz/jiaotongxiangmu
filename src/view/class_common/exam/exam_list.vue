<template>
<Row>
  <div style="margin-bottom:15px">
    搜索字段：
    <Select v-model="searchType" style="width:100px">
        <Option v-for="item in searchTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
    <span v-show="show_filter_option">
      评分状态:
      <Select v-model="score_status" style="width:100px" @on-change="(val) => {this.getData(true)}">
          <Option :value="-1" >所有</Option>
          <Option :value="0" >未评分</Option>
          <Option :value="1" >已评分</Option>
      </Select>
    </span>
    <Input type="text" v-model="keyword" placeholder="请输入搜索内容" style="width:150px"/>
    <Button type="primary" @click="getData(true)" style="margin-left:15px;">搜索</Button>
  </div>
  <Table :loading="loading" ref="selection" :columns="columns" :data="list" @on-sort-change="handleSortChange" :height="$store.state.app.tableHeight-50">
  </Table>
  <Row>
    <page :total="count" :current="page_no" :page-size="page_size"  size="small" show-elevator show-total show-sizer @on-change="handlePageChange" @on-page-size-change="handleSizeChange" :placement="'top'"></page>
  </Row>
  <Modal v-model="modal" :title="title" width="800" footer-hide :mask-closable="false" @on-cancel="handleModalCancel" >
      <Exam :student_exam_id="student_exam_id" :sty="sty" v-if="target === 'exam'" @success="handleSuccess"></Exam>
      <Evaluate :student_exam_id="student_exam_id" v-if="target === 'evaluate'"></Evaluate>
  </Modal>
</Row>
</template>

<script>
import Exam from '@/view/class_common/exam/exam'
import Evaluate from '@/view/class_common/exam/evaluate'
import { BMATypeMap, BMAColorMap } from '@/view/mixins/str_map'
export default {
  props: {
    type: '', // 1:课前 2:课中 3:课后
    exam_status: '', // 考试的状态
    student_course_id: '',
    sty: '',
    courseware_id: '',
    teacher_course_id: '',
    show_filter_option: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Exam,
    Evaluate
  },
  computed: {
  },
  data () {
    return {
      modal: false,
      title: '',
      target: '',
      student_exam_id: '',
      loading: false,
      keyword: '',
      searchType: 0,
      sortType: ' released_at',
      sortOrder: 'desc',
      list: [],
      count: 0,
      page_no: 1,
      page_size: 20,
      score_status: -1,
      searchTypeList: [
        {
          value: 0,
          label: '试卷标题'
        }
      ],
      columns: [
        {
          title: '试卷标题',
          key: 'exam_name',
          width: 150
        },
        {
          title: '类型',
          key: 'type',
          width: 100,
          render: (h, params) => {
            let type = params.row.type
            return (
              <div>
                <Tag color={BMAColorMap[type]} >{BMATypeMap[type]}</Tag>
              </div>
            )
          }
        },
        {
          title: '考试时间',
          key: '',
          width: 200,
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
          title: '状态',
          key: 'type',
          render: (h, params) => {
            let status = params.row.status
            let arr = ['default', 'warning', 'success', 'primary', 'error']

            return (
              <div>
                <Tag color={arr[status]} >{params.row.status_str}</Tag>
              </div>
            )
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 230,
          align: 'center',
          fixed: 'right',
          render: (h, params) => {
            let row = params.row
            let arr = ['考试', '继续', '查看答题', '查看结果', '-']
            let btnText = arr[row.status]
            // 这里点击要判断
            return (
              <div>
                <Button style={{ marginRight: '10px' }} size="small" type="info"
                  onClick={() => { this.detail(params.row) }}>
                  {btnText}
                </Button>
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
    getData (isSearch) {
      let _this = this
      if (isSearch) {
        _this.page_no = 1
      }
      _this.loading = true
      _this.axios.request({
        url: '/index.php/Student/Exam/page',
        method: 'get',
        params: {
          page_size: _this.page_size,
          page_no: _this.page_no,
          searchType: parseInt(_this.searchType),
          sortType: _this.sortType,
          sortOrder: _this.sortOrder,
          keyword: _this.keyword,
          type: _this.type,
          exam_status: _this.exam_status,
          student_course_id: _this.student_course_id,
          teacher_course_id: _this.teacher_course_id,
          courseware_id: _this.courseware_id,
          score_status: _this.score_status
        }
      }).then(res => {
        if (res.code === 200) {
          let data = res.data
          this.list = data.list
          this.count = data.count
        }
        _this.loading = false
      })
    },
    detail (exam) {
      if (exam.status === 0) { // 未考试的话。进去考试详情之前要发请求修改考试状态
        this.axios.request({
          method: 'post',
          url: '/index.php/Student/Exam/start_exam',
          data: {
            student_exam_id: exam.id
          }
        }).then(res => {
          if (res.code === 200) {
            exam.status = 1
            this.sty = 0
            this.open('exam', exam.id, `测试 > ${exam.exam_name}`)
          }
        })
      } else if (exam.status === 3) {
        this.open('evaluate', exam.id, `测试 > 评分结果 > ${exam.exam_name}`)
      } else {
        this.sty = exam.status
        this.open('exam', exam.id, `测试 > ${exam.exam_name}`)
      }
    },
    open (target, target_id, title) {
      this.modal = true
      this.target = target
      this.title = title
      this.student_exam_id = target_id
    },
    handleModalCancel () {
      // this.target = ''
      // this.student_exam_id = ''
    },
    handleSortChange (sort) { // 排序
      this.sortType = sort.key
      this.sortOrder = sort.order
      this.getData()
    },
    handlePageChange: function (val) {
      this.page_no = val
      this.getData()
    },
    handleSizeChange: function (val) {
      this.page_size = val
      this.getData(true)
    },
    handleSuccess () {
      this.modal = false
      this.target = ''
      this.getData()
    }
  },
  mounted () {
    this.getData()
  }

}
</script>

<style lang="less" scoped>
.btn-margin{
  margin-right: 10px;
}
</style>
