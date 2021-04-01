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
        <Option v-for="classitem in class_list" :value="classitem.value" :key="classitem.value"
          @click.native="handle_choose(classitem.label)">{{ classitem.label }}
        </Option>
      </Select>
      <span class="gray-c8">课件：</span>
      <Select class="new-searchSel" v-model="section_choose" placeholder="全部" clearable style="margin-right:30px">
        <Option v-for="(sectionitem,index) in section_list" :value="sectionitem.id" :key="sectionitem.id">
          {{sectionitem.courseware_name}}</Option>
        <!-- <Option v-for="(sectionitem,index) in section_list" :value="sectionitem.id" :key="sectionitem.id">
          {{index !== 0 ? '第' + sectionitem.sort + '课时' : sectionitem.sort}}</Option> -->
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
        <span style="width:166px;border-right:1px solid #FFFFFF">学生（{{course_list.length}}）</span>
        <span style="width:144px">综合成绩</span>
      </div>
      <div style="flex:1;position:relative">
        <ul>
          <li v-for="(item,index) in course_list" class="watcheva-l-li" :key="index"
            @click="selectStudent($event,item)">
            <span style="width:106px">{{index+1}}</span>
            <span style="width:166px">
              <img :src="item.icon==='' ? default_icon : item.icon" />
              {{item.name}}
            </span>
            <span style="width:144px">{{item.total_score}}分</span>
          </li>
        </ul>
      </div>
      </Col>
      <Col style="flex:1;margin-right:10px;height:100%">
      <div class="courseware_list_table_parent">
        <Table size="small" class="courseware_list_table" v-if="courswareID" style="width:100%;height:100%"
          ref="selection" :columns="columns3" :data="list"></Table>
        <Table size="small" class="courseware_list_table" v-else style="width:100%;height:100%" ref="selection"
          :columns="iscourse===true? columns : columns2" :data="list"></Table>
      </div>
      </Col>
    </Row>
    <Spin fix v-show="loading"> </Spin>
  </Row>
</template>
<script>
import { student_course_score } from '@/api/data'
import modal_mixin from '@/view/mixins/modal_mixin'
import log from 'video.js/es5/utils/log'
export default {
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
        // sort: '课程总成绩',
        courseware_name: '课程总成绩'
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
      this.currentStudent = ''
      this.courswareID = newval
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
      courswareID: '',
      classitem_num: '',
      iscourse: false,
      student_score: '',
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
      default_icon: require('@/assets/images/new_img/default.jpg'),
      loading: false,
      course_list: [],
      columns: [
        {
          key: 'sort',
          title: '序号',
          align: 'center',
          minWidth: 200,
          render: (h, params) => {
            let row = params.row
            return (
              <div class="align-top" >
                <span class="blue-cg" >{row.sort}</span>
              </div >
            )
          }
        },
        {
          key: 'name',
          title: '学生',
          align: 'center',
          minWidth: 200,
          render: (h, params) => {
            let row = params.row
            return (
              <div class="align-top" >
                <span class="blue-cg">{row.name}</span>
              </div>
            )
          }
        },
        {
          key: 'student_score',
          title: '综合成绩',
          align: 'center',
          minWidth: 200,
          render: (h, params) => {
            let row = params.row
            // console.log(row);
            return (
              <div class="align-top" >
                <span class="blue-cg">{row.student_score}</span>
              </div>
            )
          }
        },
        {
          key: 'courseware_name',
          title: '课件',
          align: 'center',
          minWidth: 250,
          render: (h, params) => {
            let row = params.row
            return (
              <div class="align-top">
                <span class="blue-cg">{row.courseware_name}</span>
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
                <span class="blue-cg">{row.before_score}</span>
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
                <span class="blue-cg">{row.in_score}</span>
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
                <span class="blue-cg">{row.after_score}</span>
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
            return <span class="blue-cg">{params.row.total_score}</span>
          }
        }
      ],
      columns2: [
        {
          key: 'sort',
          title: '序号',
          align: 'center',
          minWidth: 200,
          render: (h, params) => {
            let row = params.row
            return (
              <div class="align-top" >
                <span class="blue-cg" >{row.sort}</span>
              </div >
            )
          }
        },
        {
          key: 'name',
          title: '学生',
          align: 'center',
          minWidth: 200,
          render: (h, params) => {
            let row = params.row
            // console.log(row);
            return (
              <div class="align-top" >
                <span class="blue-cg">{row.name}</span>
              </div>
            )
          }
        },
        {
          key: 'student_score',
          title: '综合成绩',
          align: 'center',
          minWidth: 200,
          render: (h, params) => {
            let row = params.row
            return (
              <div class="align-top" >
                <span class="blue-cg">{row.student_score}</span>
              </div>
            )
          }
        },
        {
          key: 'course_name',
          title: '课程',
          align: 'center',
          minWidth: 250,
          render: (h, params) => {
            let row = params.row
            return (
              <div class="align-top">
                <span class="blue-cg">{row.course_name}</span>
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
                <span class="blue-cg">{row.before_score}</span>
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
                <span class="blue-cg">{row.in_score}</span>
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
                <span class="blue-cg">{row.after_score}</span>
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
            return <span class="blue-cg">{params.row.total_score}</span>
          }
        }
      ],
      columns3: [
        {
          key: 'sort',
          title: '序号',
          align: 'center',
          minWidth: 200,
          render: (h, params) => {
            let row = params.row
            return (
              <div class="align-top" >
                <span class="blue-cg" >{row.sort}</span>
              </div >
            )
          }
        },
        {
          key: 'name',
          title: '学生',
          align: 'center',
          minWidth: 200,
          render: (h, params) => {
            let row = params.row
            return (
              <div class="align-top" >
                <span class="blue-cg">{row.name}</span>
              </div>
            )
          }
        },
        {
          key: 'student_score',
          title: '综合成绩',
          align: 'center',
          minWidth: 150,
          render: (h, params) => {
            let row = params.row
            return (
              <div class="align-top" >
                <span class="blue-cg">{row.student_score}</span>
              </div>
            )
          }
        },
        {
          key: 'course_name',
          title: '课程',
          align: 'center',
          minWidth: 150,
          render: (h, params) => {
            let row = params.row
            return (
              <div class="align-top">
                <span class="blue-cg">{row.course_name}</span>
              </div>
            )

          }
        },
        {
          key: 'courseware_name',
          title: '课件',
          align: 'center',
          minWidth: 150,
          render: (h, params) => {
            let row = params.row
            return (
              <div class="align-top">
                <span class="blue-cg">{row.courseware_name}</span>
              </div>
            )

          }
        },
        {
          key: 'before_score',
          title: '课前',
          align: 'center',
          minWidth: 150,
          render: (h, params) => {
            let row = params.row
            return (
              <div class="align-top">
                <span class="blue-cg">{row.before_score}</span>
              </div>
            )
          }
        },
        {
          key: 'in_score',
          title: '课中',
          align: 'center',
          minWidth: 150,
          render: (h, params) => {
            let row = params.row
            return (
              <div class="align-top">
                <span class="blue-cg">{row.in_score}</span>
              </div>
            )
          }
        },
        {
          key: 'after_score',
          title: '课后',
          minWidth: 150,
          align: 'center',
          render: (h, params) => {
            let row = params.row
            return (
              <div class="align-top">
                <span class="blue-cg">{row.after_score}</span>
              </div>
            )
          }
        },
        {
          key: 'total_score',
          title: '总分',
          align: 'center',
          minWidth: 150,
          render (h, params) {
            return <span class="blue-cg">{params.row.total_score}</span>
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
    handle_choose (classitem) {

      this.classitem_num = classitem
    },
    refreshData () {
      for (let i = 0; i < document.getElementsByClassName('watcheva-l-li').length; i++) {
        document.getElementsByClassName('watcheva-l-li')[i].style.background = '#CCCCCC'
      }
      this.list = []
    },
    exportData () {
      this.$refs.selection.exportCsv({
        filename: `${this.currentStudent}` + ' ' + `${this.classitem_num}`,
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
            this.handle_choose(this.class_list[0].label)
            this.class_choose = this.class_list[0].value
          }
        }
        this.loading = false
      })
    },
    get_list_info (class_id, coursware_id, keyword) {
      this.iscourse = false
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
          this.list = data
          for (let i in data) {
            this.course_list.push(data[i])
          }
        }
        this.loading = false
      })
    },
    selectStudent (e, item) {
      this.courswareID = ''
      this.iscourse = true
      for (let i = 0; i < document.getElementsByClassName('watcheva-l-li').length; i++) {
        document.getElementsByClassName('watcheva-l-li')[i].style.background = '#CCCCCC'
      }
      e.currentTarget.style.background = '#ffffff'
      this.currentStudent = item.name
      this.student_course_id = item.student_course_id
      this.student_score = item.total_score
    },
    getData () {
      this.loading = true
      this.axios.request({
        method: 'get',
        url: '/teacher/score/get_score_by_student',
        params: {
          student_score: this.student_score,
          student_course_id: this.student_course_id
        }
      }).then(res => {
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
<style lang="less" scoped>
/deep/.ivu-table-column-center:nth-child(1),
/deep/.ivu-table-column-center:nth-child(2),
/deep/.ivu-table-column-center:nth-child(3) {
  display: none;
}
</style>