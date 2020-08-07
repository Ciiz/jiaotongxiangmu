<template>
<Row class="watcheva" style="flex:1;display:flex;flex-direction:column">
    <!-- <div class="searchtemplete">
      <Input type="text" @on-enter='selectbtn' v-model="keyword" style="width:200px;"  placeholder="按照课程名称查询"  />
      <Button type="primary" @click="selectbtn" class="searchbtn"><Icon type="ios-search"  /></Button>
    </div> -->
  <Row type="flex" justify="space-between" class="watcheva-header">
    <Col>
      <span class="gray-c8">班级：</span>
      <Select class="new-searchSel" v-model="class_choose" placeholder="全部" clearable style="margin-right:30px">
        <Option v-for="classitem in class_list" :value="classitem.value" :key="classitem.value">{{ classitem.label }}</Option>
      </Select>
      <span class="gray-c8">课时：</span>
      <Select class="new-searchSel" v-model="section_choose" placeholder="全部" clearable style="margin-right:30px">
        <Option v-for="(sectionitem,index) in section_list" :value="sectionitem.id" :key="sectionitem.id">{{index !== 0 ? '第' + sectionitem.sort + '课时' : sectionitem.sort}}</Option>
      </Select>
      <button class="blueg-btn" style="width:122px" @click="exportData(1)">导出表格数据</button>
    </Col>
    <Col>
      <Breadcrumb style="float:right;margin-top:6px">
        <BreadcrumbItem>考核评价</BreadcrumbItem>
        <BreadcrumbItem>课程列表</BreadcrumbItem>
        <BreadcrumbItem>考核详情</BreadcrumbItem>
      </Breadcrumb>
    </Col>
  </Row>
  <Row type="flex" justify="space-between" style="flex:1;padding-bottom:10px">
    <Col class="watcheva-l" style="height:100%;display:flex;flex-direction:column">
      <div>
        <span style="width:106px;border-right:1px solid #FFFFFF">序号</span>
        <span style="width:166px;border-right:1px solid #FFFFFF">学生（）</span>
        <span style="width:144px">综合成绩</span>
      </div>
      <div style="flex:1;position:relative">
        <ul>
          <li v-for="(item,index) in course_list" class="watcheva-l-li" :key="index" @click="selectStudent($event,item)">
            <span style="width:106px">{{index}}</span>
            <span style="width:166px">
              <img :src="item.icon" />{{item.name}}</span>
            <span style="width:144px">{{item.total_score}}分</span>
          </li>
        </ul>
      </div>
    </Col>
    <Col style="flex:1;margin-right:10px;height:100%">
      <div class="courseware_list_table_parent">
        <Table size="small" class="courseware_list_table" style="width:100%;height:100%" ref="selection" :columns="columns" :data="list"></Table>
      </div>
    </Col>
    <Modal v-model="modal" :title="title" :width="modal_width" footer-hide>
      <StudentTaskEvaluate :student_task_id="target_id" v-if="target === 'student_task'"></StudentTaskEvaluate>
      <StudentHomeworkEvaluate :student_homework_id="target_id" v-if="target === 'student_homework'"></StudentHomeworkEvaluate>
      <StudentExamEvaluate :student_exam_id="target_id" v-if="target === 'student_exam'"></StudentExamEvaluate>
    </Modal>
  </Row>
  <Spin fix v-show="loading"> </Spin>
    <!-- <Modal v-model="modal" :title="title" :width="1000" :footer-hide="footerHide" :fullscreen="fullscreen">
      <watcheva :teacher_course_id="target_id.teacher_course_id" :course_name="target_id.course_name" v-if="target === 'watcheva' && modal" ></watcheva>
    </Modal> -->
</Row>
</template>
<script>
import { student_course_score } from '@/api/data'
import watcheva from './components/watcheva_assess.vue'
import modal_mixin from '@/view/mixins/modal_mixin'
import StudentTaskEvaluate from '@/view/teacher_common/task/student_task_evaluate'
import StudentHomeworkEvaluate from '@/view/teacher_common/homework/student_homework_evaluate'
import StudentExamEvaluate from '@/view/teacher_common/exam/student_exam_evaluate'
export default {
  components: {
    watcheva, StudentTaskEvaluate, StudentExamEvaluate, StudentHomeworkEvaluate
  },
  computed: {
    courseId () {
      return this.$store.state.user.courseData.teacher_course_id
    }
  },
  watch: {
    courseId () {
      this.refreshData()
      this.getInfo()
      this.get_list_info(this.class_choose, '', this.keyword)
    },
    class_choose (newval) {
      this.section_choose = ''
      this.section_list = []
      this.refreshData()
      this.get_list_info(this.class_choose, '', this.keyword)
      for (let i in this.axios_data) {
        if (this.axios_data[i].id === newval) {
          this.section_list = this.axios_data[i].coursewares
          break
        }
      }
      this.section_list.unshift({
        id: 0,
        sort: '课程总成绩'
      })
      // 数组去重
      let allArr = []
      for (let i = 0; i < this.section_list.length; i++) {
        let flag = true
        for (let j = 0; j < allArr.length; j++) {
          if (this.section_list[i].id === allArr[j].id) {
            flag = false
          }
        }
        if (flag) {
          allArr.push(this.section_list[i])
        }
      }
      this.section_list = allArr
      this.section_choose = ''
    },
    section_choose (newval) {
      if (newval !== '' && newval !== undefined) {
        this.refreshData()
        this.get_list_info(this.class_choose, newval)
      }
    },
    student_course_id () {
      this.getData()
    }
  },
  mixins: [modal_mixin],
  data () {
    return {
      currentStudent: '',
      modal: false,
      list: [],
      student_course_id: '',
      class_list: [],
      section_list: [],
      keyword: '',
      class_choose: '',
      loading1: false,
      section_choose: '',

      loading: false,
      course_list: [],
      columns: [
        {
          key: 'sort',
          title: '课时',
          align: 'center',
          minWidth: 250,
          render: (h, params) => {
            return (
              <div>

              </div>
            )
          }
        },
        {
          key: 'before_score',
          title: '课前',
          align: 'center',
          width: 150,
          render: (h, params) => {
            let row = params.row
            return (
              <div class="align-top">
                <span class="blue-cg">{row.score.before_score}</span>
              </div>
            )
          }
        },
        {
          key: 'in_score',
          title: '课中',
          align: 'center',
          width: 150,
          render: (h, params) => {
            let row = params.row
            return (
              <div class="align-top">
                <span class="blue-cg">{row.score.in_score}</span>
              </div>
            )
          }
        },
        {
          key: 'after_score',
          title: '课后',
          width: 150,
          align: 'center',
          render: (h, params) => {
            let row = params.row
            return (
              <div class="align-top">
                <span class="blue-cg">{row.score.after_score}</span>
              </div>
            )
          }
        },
        {
          key: 'total_score',
          title: '总分',
          align: 'center',
          width: 150,
          render (h, params) {
            return <span class="blue-cg">{params.row.score.total_score}</span>
          }
        }
      ]
    }
  },
  created () {
    if (this.courseId) {
      this.getInfo()
      this.get_list_info(this.class_choose, '', this.keyword)
    }
  },
  methods: {
    refreshData () {
      for (let i = 0; i < document.getElementsByClassName('watcheva-l-li').length; i++) {
        document.getElementsByClassName('watcheva-l-li')[i].style.background = '#CCCCCC'
      }
      this.list = []
    },
    exportData () {
      this.$refs.selection.exportCsv({
        filename: `${this.currentStudent}`
      })
    },
    getInfo () {
      this.loading = true
      this.axios.request({
        method: 'get',
        url: '/index.php/Teacher/Class/get_class_by_course',
        params: {
          teacher_course_id: this.courseId
        }
      }).then(res => {
        if (res.code === 200) {
          if (res.data.length > 0) {
            let data = res.data
            this.axios_data = data
            this.class_list = []
            for (let i in data) {
              this.class_list.push({
                value: data[i].id,
                label: data[i].class_name
              })
            }
            this.class_choose = this.class_list[0].value
          }
        }
        this.loading = false
      })
    },
    get_list_info (class_id, coursware_id, keyword) {
      this.loading = true
      this.axios.request({
        method: 'get',
        url: '/index.php/Teacher/Score/get_student_by_class_score',
        params: {
          class_id,
          coursware_id,
          teacher_course_id: this.courseId,
          keyword
        }
      }).then(res => {
        if (res.code === 200) {
          this.course_list = []
          let data = res.data
          for (let i in data) {
            this.course_list.push(data[i])
          }
        }
        this.loading = false
      })
    },
    selectStudent (e, item) {
      for (let i = 0; i < document.getElementsByClassName('watcheva-l-li').length; i++) {
        document.getElementsByClassName('watcheva-l-li')[i].style.background = '#CCCCCC'
      }
      e.currentTarget.style.background = '#ffffff'
      this.currentStudent = item.name
      console.log(item)
      this.student_course_id = item.student_course_id
    },
    getData () {
      this.loading = true
      student_course_score(this.student_course_id).then(res => {
        if (res.code === 200) {
          this.list = Object.values(res.data.courseware)
        }
        this.loading = false
      })
    }
  },
  mounted () {
    // this.section_choose = this.section_list[0].id
  }
}
</script>
