<template>
  <Row class="">
    <div class="search-bar">
       搜索学生：
      <Input type="text" v-model="keyword" placeholder="请输入搜索内容"  style="width:200px">
        <Icon type="ios-search" slot="suffix" @click="selectbtn"/>
      </Input>
      <div style="float:right;">
          班级：
        <Select v-model="class_choose" not-found-text="该课程暂未绑定班级" style="width:200px; margin-right:5px;" class="courseSelect tour_select" placeholder="请选择班级">
          <Option v-for="classitem in class_list" :value="classitem.value" :key="classitem.value">{{ classitem.label }}</Option>
        </Select>
        <Select v-model="section_choose" not-found-text="该班级暂未创建课时" style="width:120px; margin-right:5px;" class="courseSelect tour_select" placeholder="请选择课时">
          <Option v-for="(sectionitem,index) in section_list" :value="sectionitem.id" :key="sectionitem.id">{{index !== 0 ? '第' + sectionitem.sort + '课时' : sectionitem.sort}}</Option>
        </Select>
        <Button style="float:right;" type="primary" @click="exportData(1)"><Icon type="ios-download-outline"></Icon> 导出表格数据</Button>
      </div>
    </div>

    <Table size="small"  ref="selection" :columns="columns" :data="course_list" :loading="loading1" :height="$store.state.app.tableHeight">
    </Table>
    <Modal v-model="isshowassess"  title="考核与评价" footer-hide :mask-closable='false' width="1000">
      <assess v-if="isshowassess" :course_name='course_name' :assessData='assessData'></assess>
    </Modal>
    <Modal v-model="modal" :title="title" :width="modal_width">
      <student-course-score :student_course_id="target_id" v-if="target === 'student_course_score'"></student-course-score>
    </Modal>
  </Row>
</template>

<script>
import assess from '@/view/teacherassess/components/assess_for_student.vue'
import studentCourseScore from '@/view/teacher_common/course/student_course_score'
import modal_mixin from '@/view/mixins/modal_mixin'
export default {
  components: { assess, studentCourseScore },
  mixins: [modal_mixin],
  props: ['teacher_course_id', 'course_name'],
  data () {
    return {
      timer_class: null,
      timer: null,
      isshowassess: false,
      assessData: {},
      // 存储data数据
      axios_data: [],
      // 选择课时
      section_choose: '',
      section_list: [],
      // 选择班级
      class_choose: '',
      loading1: false,
      class_list: [],
      keyword: '',
      loading: false,
      course_list: [],
      columns: [
        {
          title: '序号',
          type: 'index',
          key: 'index',
          align: 'center',
          maxWidth: 100
        },
        {
          title: '姓名',
          key: 'name',
          align: 'center',
          render: (h, params) => {
            return (
              <div>{params.row.name}</div>
            )
          }
        },
        {
          title: '总分',
          key: 'total_score',
          align: 'center',
          sortable: true,
          render: (h, params) => {
            return h('div', {
              style: {
                marginTop: '5px',
                fontWeight: 'bold'
              }
            }, params.row.total_score)
          }
        },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          align: 'center',
          width: 200,
          render: (h, params) => {
            return (
              <div>
                <Button type="primary" size="small" onClick={() => {
                  // this.assessData['student_id'] = params.row.student_id
                  // this.assessData['class_id'] = params.row.class
                  // this.assessData['teacher_course_id'] = this.teacher_course_id
                  // this.isshowassess = true
                  this.open('student_course_score', params.row.student_course_id, '考核评价')
                }}>详情</Button>
              </div>
            )
          }
        }
      ]
    }
  },
  watch: {
    class_choose (newval) {
      this.section_choose = ''
      this.section_list = []
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
      // this.section_list.reverse()
    },
    section_choose (newval) {
      if (newval !== '' && newval !== undefined) {
        this.get_list_info(this.class_choose, newval)
      }
    }
  },
  created () {
    this.getInfo()
    this.timer_class = setInterval(() => { // 班级设置默认选中 （开启定时器消除网速对操作的影响）
      if (this.class_list.length > 0) {
        clearInterval(this.timer_class)
        this.class_choose = this.class_list[0].value
      }
    }, 200)
    new Promise((resolve) => { // 默认选中班级后设置课时默认选中
      this.timer = setInterval(() => {
        if (this.section_list.length > 0) {
          clearInterval(this.timer)
          resolve()
        }
      }, 200)
    }).then(() => {
      this.section_choose = this.section_list[0].id
    })
    window.localStorage.setItem('search', new Date().getTime().toString().slice(8) - 50000) // 设置查询间隔
  },
  methods: {
    exportData () {
      this.$refs.selection.exportCsv({
        filename: `${this.course_name}`
      })
    },
    selectbtn () {
      let local = window.localStorage.getItem('search')
      let num = Number(new Date().getTime().toString().slice(8))
      this.sendloading = false
      if (num - local < 5000 && num - local > 0) {
        this.$Message.error('搜索太频繁，请稍后再试')
        return false
      }
      if (num - local < -95000 && num - local < 0) {
        this.$Message.error('搜索太频繁，请稍后再试')
        return false
      }
      if (this.loading === false) {
        this.course_list = []
        this.loading = true
        this.get_list_info(this.class_choose, this.section_choose, this.keyword)
        window.localStorage.setItem('search', new Date().getTime().toString().slice(8))
      }
    },
    getInfo () {
      this.axios.request({
        method: 'get',
        url: '/index.php/Teacher/Class/get_class_by_course',
        params: {
          teacher_course_id: this.teacher_course_id
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
          }
          this.loading = false
        }
      })
    },
    get_list_info (class_id, coursware_id, keyword) {
      this.loading1 = true
      this.axios.request({
        method: 'get',
        url: '/index.php/Teacher/Score/get_student_by_class_score',
        params: {
          class_id,
          coursware_id,
          teacher_course_id: this.teacher_course_id,
          keyword
        }
      }).then(res => {
        if (res.code === 200) {
          this.loading1 = false
          this.course_list = []
          let data = res.data
          for (let i in data) {
            this.course_list.push(data[i])
          }
          this.loading = false
        }
      })
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
    this.timer = null
  }
}
</script>
