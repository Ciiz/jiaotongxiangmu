<template>
  <Row style="padding-top:20px">
    <Row>
      <Col>
      类型：
      <Select v-model="course_type" filterable style="width:120px">
        <Option :value="0">全部</Option>
        <Option :value="1">普通课程</Option>
        <Option :value="2">全景课程</Option>
      </Select>
      &nbsp;&nbsp;院系：
      <Select v-model="department" filterable style="width:120px">
        <Option :value="0">全部</Option>
        <Option v-for="item in departmentList" :value="item.major_id" :key="item.major_id">{{ item.major_name }}</Option>
      </Select>
      &nbsp;&nbsp;专业：
      <Select v-model="major" filterable style="width:120px">
        <Option :value="0">全部</Option>
        <Option v-for="item in majorList" :value="item.major_id" :key="item.major_id">{{ item.major_name }}</Option>
      </Select>
      <Input v-model="keyword" @on-change="page_no = 1; getData()" style="width: 120px; margin-left: 15px;" placeholder="请输入关键词搜索"></Input>
      <Table :data='list' :columns="columns" style="margin-top: 30px;" :loading="loading" :height="$store.state.app.tableHeight"></Table>
      <Page :total="total" :page-size="page_size" @on-change="(page) => {this.page_no = page; this.getData()}" @on-page-size-change="(page_size) => {this.page_size = page_size; this.getData()}" size="small" show-elevator show-sizer style="margin-top:30px; margin-bottom: 10px;"/>
      </Col>
    </Row>
  <Modal v-model="modal" :title="title" width="1200" :mask-closable='false'>
    <!-- <ChapterClass :teacher_course_id="teacher_course_id"></ChapterClass> -->
    <CourseDetail style="height:600px"></CourseDetail>
  </Modal>
  </Row>
</template>
<script>
import CourseDetail from '@/view/class_common/course/course_detail'
import { get_school_course, get_departments, get_majors } from '@/api/common'
export default {
  components: {
    CourseDetail
  },
  data () {
    return {
      modal: false,
      title: '',
      loading: false,
      list: [],
      majorList: [],
      departmentList: [],
      course_type: 0,
      major: 0,
      total: 0,
      page_no: 1,
      page_size: 10,
      keyword: '',
      department: 0,
      columns: [
        {
          title: '课程封面',
          key: 'img',
          width: 200,
          align: 'left',
          render: (h, params) => {
            return (
              <div style={{ width: '100px', height: '100px', margin: '10px', overflow: 'hidden' }}>
                <img src={params.row.img} style={{ width: '100%' }}/>
              </div>
            )
          }
        },
        {
          key: 'course_name',
          title: '课程名称',
          width: 150
        },
        {
          key: 'teacher_name',
          title: '教师名称',
          width: 100
        },
        {
          key: 'selected',
          title: '状态',
          width: 100,
          render: (h, params) => {
            return (
              <div>
                <Tag size="small" color="green" v-show={params.row.selected}>已选</Tag>
                <Tag size="small" color="blue" v-show={!params.row.selected}>未选</Tag>
              </div>
            )
          }
        },
        {
          key: 'course_type',
          title: '课程类型',
          minWidth: 500,
          render: (h, params) => {
            return (
              <div>
                <Tag type="border" color="primary" size="small" v-show={params.row.course_type === 1}>普通</Tag>
                <Tag type="border" color="success" size="small" v-show={params.row.course_type === 2}>全景</Tag>
              </div>
            )
          }
        },
        {
          key: 'option',
          title: '操作',
          fixed: 'right',
          align: 'center',
          width: 200,
          render: (h, params) => {
            return (
              <div>
                <Button type="primary" size="small" onClick={() => { this.detail(params.row) }}>详情</Button>
                <Button type="success" size="small" onClick={() => { this.bindCourse(params.row) }} v-show={!params.row.selected}>选课</Button>
              </div>
            )
          }
        }
      ]
    }
  },
  watch: {
    department (newVal, oldVal) {
      this.major = 0
      this.getData()
      this.getMajor()
    },
    major (newVal, oldVal) {
      this.getData()
    },
    course_type (newVal, oldVal) {
      this.getData()
    }
  },
  methods: {
    getData () {
      this.loading = true
      get_school_course({
        major: this.major,
        department: this.department,
        course_type: this.course_type,
        page_no: this.page_no,
        page_size: this.page_size,
        keyword: this.keyword,
        school_id: this.$store.state.user.userInfo['schoolId']
      }).then(res => {
        if (res.code === 200) {
          this.list = res.data.list
          this.total = res.data.count
        }
        this.loading = false
      })
    },
    detail (item) {
      this.modal = true
      this.title = `${item.course_name}详情`
      this.$store.commit('setcourseData', item)
    },
    getDepartment () {
      get_departments().then(res => {
        if (res.code === 200) {
          this.departmentList = res.data.list
        }
      })
    },
    getMajor () {
      get_majors(this.department).then(res => {
        if (res.code === 200) {
          this.majorList = res.data.list
        }
      })
    },
    bindCourse (item) {
      this.axios
        .request({
          method: 'post',
          url: 'index.php/Student/Course/bindCourse',
          data: {
            teacher_course_id: item.teacher_course_id
          }
        })
        .then(res => {
          if (res.code === 200) {
            item.selected = true
            this.$Message.success(res.message)
            this.$emit('bind-course')
          }
        })
    }
  },
  mounted () {
    this.getData()
    this.getDepartment()
    this.getMajor()
  }
}
</script>
<style>
</style>
