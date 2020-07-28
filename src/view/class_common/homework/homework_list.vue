<template>
<Row>
  <div style="margin-bottom:15px">
    搜索字段:
    <Select v-model="searchType" style="width:100px">
        <Option v-for="item in searchTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
    <span v-show="show_filter_option">
      提交状态:
      <Select v-model="submit_status" style="width:100px" @on-change="(val) => {this.getData(true)}">
          <Option :value="-1" >所有</Option>
          <Option :value="0" >未提交</Option>
          <Option :value="1" >已提交</Option>
      </Select>
      评分状态:
      <Select v-model="score_status" style="width:100px" @on-change="(val) => {this.getData(true)}">
          <Option :value="-1" >所有</Option>
          <Option :value="0" >未评分</Option>
          <Option :value="1" >已评分</Option>
      </Select>
    </span>
    <Input type="text" v-model="keyword" placeholder="请输入搜索内容" style="width:150px"></Input>
    <Button type="primary" @click="getData(true)" style="margin-left:15px;">搜索</Button>
  </div>
  <Table :loading="loading" ref="selection" :columns="columns" :data="list" @on-sort-change="handleSortChange" :height="$store.state.app.tableHeight-50"
   >
  </Table>
  <Row>
    <page :total="count" :current="page_no" :page-size="page_size"  size="small" show-elevator show-total show-sizer @on-change="handlePageChange" @on-page-size-change="handleSizeChange" :placement="'top'"></page>
  </Row>
  <Modal v-model="modal" :title="title" width="1100" footer-hide :mask-closable="false">
      <Homework :student_homework_id="student_homework_id" v-if="target === 'homework'" @success="handleSuccess"></Homework>
      <Evaluate :student_homework_id="student_homework_id" v-if="target === 'evaluate'"></Evaluate>
  </Modal>
</Row>
</template>

<script>
import Homework from '@/view/class_common/homework/homework'
import Evaluate from '@/view/class_common/homework/evaluate'
import { BMATypeMap, BMAColorMap } from '@/view/mixins/str_map'
export default {
  components: {
    Homework,
    Evaluate
  },
  props: {
    type: '',
    student_course_id: '',
    courseware_id: '',
    teacher_course_id: '',
    show_filter_option: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      modal: false,
      title: '',
      target: '',
      student_homework_id: '',
      loading: false,
      keyword: '',
      searchType: 0,
      sortType: ' homework_release_at',
      sortOrder: 'desc',
      list: [],
      count: 0,
      page_no: 1,
      page_size: 20,
      submit_status: -1,
      score_status: -1,
      searchTypeList: [
        {
          value: 0,
          label: '任务名称'
        }
      ],
      columns: [
        {
          title: '作业名称',
          key: 'homework_name',
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
          title: '状态',
          key: 'submit_status',
          width: 100,
          render: (h, params) => {
            let submit_status = params.row.submit_status
            return (
              <div>
                <Tag color="default" v-show={submit_status === 0}>未提交</Tag>
                <Tag color="success" v-show={submit_status === 1}>已提交</Tag>
              </div>
            )
          }
        },
        {
          title: '评分状态',
          key: 'score_status',
          width: 100,
          render: (h, params) => {
            let score_status = params.row.score_status
            return (
              <div>
                <Tag color="primary" v-show={score_status === 1}>已评分</Tag>
                <Tag color="default" v-show={score_status === 0}>未评分</Tag>
              </div>
            )
          }
        },
        {
          title: '时间',
          key: '',
          minWidth: 600,
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
          title: '操作',
          key: 'action',
          width: 230,
          align: 'center',
          fixed: 'right',
          render: (h, params) => {
            let row = params.row
            let respondenceText = (row.submitted_at) ? '查看' : '作答'
            return (
              <div>
                <Button style={{ marginRight: '10px' }} size="small" type="primary" onClick={() => { this.open('evaluate', params.row.id, '作业评价详情') }} v-show={row.score_status}>看评价</Button>
                <Button style={{ marginRight: '10px' }} size="small" type="info" ghost onClick={() => { this.open('homework', params.row.id, '作业详情') }} v-show={!row.score_status}>{ respondenceText }</Button>
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
        url: '/index.php/Student/Homework/page',
        method: 'get',
        params: {
          page_size: _this.page_size,
          page_no: _this.page_no,
          searchType: parseInt(_this.searchType),
          sortType: _this.sortType,
          sortOrder: _this.sortOrder,
          keyword: _this.keyword,
          student_course_id: _this.student_course_id,
          teacher_course_id: _this.teacher_course_id,
          courseware_id: _this.courseware_id,
          score_status: _this.score_status,
          submit_status: _this.submit_status
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
    open (target, target_id, title) {
      this.modal = true
      this.target = target
      this.title = title
      this.student_homework_id = target_id
    },
    handleSuccess () {
      this.modal = false
      this.target = ''
      this.getData()
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
