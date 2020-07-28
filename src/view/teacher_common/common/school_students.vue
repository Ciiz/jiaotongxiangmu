<template>
  <div class="modal-content-default">
    <div>
      <Input v-model="keyword" class="new-searchSel" placeholder="请输入学生姓名或学号" @keyup.enter.native="getData()"></Input>
      <button class="blue-btn" style="width:80px;transform: translateX(-20px);" @click="page = 1;getData()">搜索</button>
      &nbsp;&nbsp;院系：
      <Select v-model="department_id" filterable class="new-searchSel">
        <Option :value="0">全部</Option>
        <Option v-for="item in departmentList" :value="item.major_id" :key="item.major_id">{{ item.major_name }}</Option>
      </Select>
      <!-- &nbsp;&nbsp;专业：
      <Select v-model="major_id" filterable style="width:120px">
        <Option :value="0">全部</Option>
        <Option v-for="item in majorList" :value="item.major_id" :key="item.major_id">{{ item.major_name }}</Option>
      </Select> -->
      &nbsp;&nbsp;班级：
      <Select v-model="class_id" filterable class="new-searchSel">
        <Option :value="0">全部</Option>
        <Option v-for="item in classList" :value="item.id" :key="item.id">{{ item.class_name }}</Option>
      </Select>
    </div>
    <Table size="small" class="school_student_table" @on-selection-change="handleSelectChange" border  stripe :loading="loading" :height="480"  ref="selection" :columns="columns" :data="list">
    </Table>
    <div style="border: 1px solid #DCDEE2;border-top-width: 0;padding: 10px;background: #fff;">
      <Page size="small" :total="total"
        @on-change="(page) => {this.page = page; this.getData()}" :page-size="page_size"
        @on-page-size-change="(page_size) => {this.page_size = page_size; this.getData()}"
        :page-size-opts="[20,40,60,80,100]"
        show-elevator show-sizer show-total/>
    </div>
    <div style="margin-top:10px">
      <button @click="bind" class="blue-btn">绑定</button>
    </div>
  </div>
</template>

<script>
import { get_school_students, course_bind_students } from '@/api/data'
import { get_departments, get_majors, get_classes } from '@/api/common'
export default {
  props: {
    teacher_course_id: ''
  },
  data () {
    return {
      loading: false,
      list: [],
      page: 1,
      page_size: 60,
      studentIds: [],
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '姓名',
          key: 'name'
        },
        {
          title: '学号',
          key: 's_no'
        },
        {
          title: '专业',
          key: 'major_name'
        },
        {
          title: '班级',
          key: 'class_name'
        }
      ],
      department_id: 0,
      major_id: 0,
      class_id: 0,
      keyword: '',
      total: 0,
      departmentList: [],
      majorList: [],
      classList: []
    }
  },
  watch: {
    department_id (newVal, oldVal) {
      this.major_id = 0
      this.getData()
      this.getMajor()
    },
    major_id (newVal, oldVal) {
      this.class_id = 0
      this.getData()
      this.getClasses()
    },
    class_id (newVal, oldVal) {
      this.getData()
    }
  },
  methods: {
    getData () {
      this.loading = true
      get_school_students({
        department_id: this.department_id,
        major_id: this.major_id,
        class_id: this.class_id,
        page: this.page,
        page_size: this.page_size,
        keyword: this.keyword
      }).then(res => {
        if (res.code === 200) {
          this.list = res.data.list
          this.total = res.data.count
        }
        this.loading = false
      })
    },
    bind () {
      course_bind_students(this.studentIds, this.teacher_course_id).then(res => {
        if (res.code === 200) {
          this.$Message.success(res.message)
          this.$emit('bind-success')
        }
      })
    },
    getDepartment () {
      get_departments().then(res => {
        if (res.code === 200) {
          this.departmentList = res.data.list
        }
      })
    },
    getMajor () {
      get_majors(this.department_id).then(res => {
        if (res.code === 200) {
          this.majorList = res.data.list
        }
      })
    },
    getClasses () {
      get_classes(this.major_id).then(res => {
        if (res.code === 200) {
          this.classList = res.data.list
        }
      })
    },
    handleSelectAll (status) {
      this.$refs.selection.selectAll(status)
    },
    handleSelectChange (selection) {
      this.studentIds = selection.map(item => {
        return item.id
      })
    }
  },
  mounted () {
    this.getData()
    this.getDepartment()
    this.getMajor()
    this.getClasses()
  }
}
</script>
<style lang="less">
</style>
