<template>
  <div class="modal-content-default">
    <Row type="flex" justify="space-between" class="gray-c8" style="margin:20px">
      <Col class="student-manage-col" style="flex:1">
        <Input v-model="keyword" class="course-detail-searchInp" placeholder="请输入学生姓名或学号" @keyup.enter.native="getData()"></Input>
        <button class="course-detail-searchBtn" @click="page = 1;getData()">搜索</button>
        <span style="margin-left:20px">专业：</span>
        <Select v-model="major_id" filterable class="new-searchSel">
          <Option :value="0">全部</Option>
          <Option v-for="item in majorList" :value="item.major_id" :key="item.major_id">{{ item.major_name }}</Option>
        </Select>
        <span  style="margin-left:40px">班级：</span>
        <Select v-model="class_id" class="new-searchSel" filterable>
          <Option :value="0">全部</Option>
          <Option v-for="item in classList" :value="item.id" :key="item.id">{{ item.class_name }}</Option>
        </Select>
      </Col>
      <Col>
        <button class="greenImage-btn" @click="open('school_students','','学校-学生')">添加学生</button>
      </Col>
    </Row>
    <div style="padding:10px;width:100%;height:100%;overflow:hidden">
      <div class="courseware_list_table_parent">
        <Table size="small" class="courseware_list_table" @on-selection-change="handleSelectChange" border  stripe :loading="loading"  ref="selection" :columns="columns" :data="list"/>
      </div>
    </div>
    <Row style="margin:14px 20px" type="flex" justify="space-between" >
      <Col>
        <button class="blue-btn" @click="unbind">解绑</button>
      </Col>
      <Col>
        <span class="gray-c">班级：{{showclassTotal}}</span>
        <span class="gray-c" style="margin:0 30px">学生：{{stuNum}}</span>
      </Col>
    </Row>
    <!-- <div style="border: 1px solid #DCDEE2;border-top-width: 0;padding: 10px;background: #fff;">
      <Page size="small" :total="total" :page-size="page_size"
        @on-change="(page) => {this.page = page; this.getData()}"
        @on-page-size-change="(page_size) => {this.page_size = page_size; this.getData()}"
        :page-size-opts="[20,40,60,80,100]"
        show-elevator show-sizer show-total/>
    </div> -->
    <!-- <div class="modal-footer">
      <Button @click="$emit('close')" type="default">关闭</Button>
      <Button @click="unbind" type="error">解绑</Button>
    </div> -->
    <Modal v-model="modal" :title="title" :width="1063" :footer-hide="footerHide" :fullscreen="fullscreen" :mask-closable='false'>
      <SchoolStudents :teacher_course_id="courseId" v-if="modal && target==='school_students'" @close="modal=false" @bind-success="getData()"> </SchoolStudents>
    </Modal>
  </div>
</template>

<script>
import { get_course_students, course_unbind_students } from '@/api/data'
import { get_majors, get_classes } from '@/api/common'
import modal_mixin from '@/view/mixins/modal_mixin'
import SchoolStudents from '@/view/teacher_common/common/school_students'
export default {
  components: {
    SchoolStudents
  },
  mixins: [modal_mixin],
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
          align: 'center',
          key: 'name'
        },
        {
          title: '学号',
          align: 'center',
          key: 's_no'
        },
        {
          title: '专业',
          align: 'center',
          key: 'major_name'
        },
        {
          title: '班级',
          align: 'center',
          key: 'class_name'
        },
        {
          key: 'option',
          title: '操作',
          align: 'center',
          width: 200,
          render: (h, params) => {
            return (
              <div>
                <span class="blue-c" style="cursor: pointer;" onClick={() => { this.studentIds = params.row.id; this.unbind() }}>解绑</span>
              </div>
            )
          }
        }
      ],
      major_id: 0,
      class_id: 0,
      keyword: '',
      total: 0,
      majorList: [],
      classList: [],
      stuNum: 0,
      classTotal: 0,
      showclassTotal: 0
    }
  },
  computed: {
    courseId () {
      return this.$store.state.user.courseData.teacher_course_id
    }
  },
  watch: {
    major_id (newVal, oldVal) {
      this.class_id = 0
      this.getData()
      this.getClasses()
    },
    class_id (newVal, oldVal) {
      if (newVal === 0) {
        this.showclassTotal = this.classTotal
      } else {
        this.showclassTotal = 1
      }
      this.getData()
    },
    courseId (n, o) {
      this.getData()
    }
  },
  methods: {
    getData () {
      this.loading = true
      get_course_students({
        major_id: this.major_id,
        class_id: this.class_id,
        page: this.page,
        page_size: 1000,
        keyword: this.keyword,
        teacher_course_id: this.courseId
      }).then(res => {
        if (res.code === 200) {
          this.list = res.data.student_list
          this.stuNum = res.data.student_list.length
          this.total = res.data.count
        }
        this.loading = false
      })
    },
    unbind () {
      this.$Modal.confirm({
        title: '提示',
        content: '确定解绑吗？',
        onOk: () => {
          course_unbind_students(this.studentIds, this.courseId).then(res => {
            if (res.code === 200) {
              this.$Message.success(res.message)
              this.getData()
            }
          })
        }
      })
    },
    getMajor () {
      get_majors(this.department_id).then(res => {
        if (res.code === 200) {
          this.majorList = res.data.list
          this.classTotal = res.data.list.length
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
    // this.teacher_course_id = this.$store.state.user.courseData.teacher_course_id
    this.getData()
    this.getMajor()
    this.getClasses()
  }
}
</script>
<style lang="less">
</style>
