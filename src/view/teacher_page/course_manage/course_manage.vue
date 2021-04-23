<template>
  <div style="flex:1;flex-direction:column;display:flex">
    <div class="courseManage-btnList">
      <button class="blackBorder-btn" v-if="courdetail==='bd'" @click="back">返回</button>
      <button class="blue-btn" v-if="courdetail==='bd'" @click="handlebind">绑定课程</button>
      <button class="grayBorder-btn" v-if="course.audit_status===1&&course.release_status===0">已审核</button>
      <button class="grayBorder-btn" v-if="course.audit_status===2">审核不通过</button>
      <button class="grayBorder-btn" v-if="course.audit_status===3">待审核</button>
      <button class="grayBorder-btn" v-if="course.release_status===1">已发布</button>
      <button class="grayBorder-btn" v-if="course.release_status===0&&course.audit_status===1">未发布</button>
      <button class="greenBorder-btn" @click="action(course, 'release')"
        v-if="(course.audit_status === 1 || course.create_type === 1 || course.create_type === 4) && course.bind_type !== 0">{{course.release_status ? '撤回' : '发布'}}</button>
      <button class="redBorder-btn" @click="action(course, 'unbind')" v-if="course.bind_type === 2">删除</button>
      <button class="redBorder-btn" @click="action(course, 'remove')" v-if="course.bind_type === 3">删除</button>
      <button class="blue-btn" @click="handleadd(course.id)">修改</button>
      <!-- <button class="blue-btn" v-if="course.bind_type === 3" @click="showAddCourse=true">修改</button> -->
      <button class="orangeBorder-btn" @click="action(course, 'audit')"
        v-if="course.bind_type === 3 && (course.audit_status === 0 || course.audit_status === 2)">提交审核</button>
      <button class="orangeBorder-btn" @click="action(course, 'audit')"
        v-if="course.bind_type === 3 && (course.audit_status === 4 )">重新审核</button>
      <Breadcrumb style="float:right;margin-top:6px">
        <BreadcrumbItem>我的课程</BreadcrumbItem>
        <BreadcrumbItem>课程列表</BreadcrumbItem>
        <BreadcrumbItem>课程详情</BreadcrumbItem>
      </Breadcrumb>
    </div>
    <courseDetail @showAllCourseDetail="showAllCourseDetail" @showCourseDetail="showCourseDetail" ref="courseDetail">
    </courseDetail>
    <!-- <addCourse v-if="showAddCourse===true"></addCourse> -->
  </div>
</template>

<script>
// import addCourse from '@/view/teachingSystem_page/courseware_manage/addCourse.vue'
import courseDetail from '@/view/teacher_common/course/course_detail.vue'
import modal_mixin from '@/view/mixins/modal_mixin'
import log from 'video.js/es5/utils/log'
export default {
  components: {
    courseDetail
  },
  props: ['courdetail'],
  data () {
    return {
      tab: 'level1_1',
      course_ids: [],
      // showAddCourse: false
    }
  },
  mixins: [modal_mixin],
  watch: {

  },
  methods: {
    handleadd (id) {
      console.log(id);
      // this.showAddCourse = true
      this.$emit('showAddCourseModal', id)
    },
    showCourseDetail (i, t) {
      this.$emit('showCourseDetail', i, t)
    },
    showAllCourseDetail (i, t, d, ci) {
      this.$emit('showAllCourseDetail', i, t, d, ci)
    },
    action (item, type) {
      console.log(item);
      let url = ''
      let title = ''
      switch (type) {
        case 'release': {
          url = '/index.php/Teacher/Course/release'
          title = `确定${item.release_status ? '撤回' : '发布'}吗？`
          break
        }
        case 'unbind': {
          url = '/index.php/Teacher/Course/undo'
          title = '确定解绑吗？'
          break
        }
        case 'audit': {
          url = '/index.php/Teacher/Course/submit'
          title = '确定提交审核吗？'
          break
        }
        case 'remove': {
          url = '/index.php/Teacher/Course/delete'
          title = '确定删除吗？'
          break
        }
        default: {
          this.$Message.error('非法操作')
          return
        }
      }
      this.$Modal.confirm({
        title,
        content: '',
        onOk: () => {
          this.axios.request({
            method: 'post',
            url,
            data: { course_id: item.id }
          }).then(res => {
            console.log(res);
            if (res.code === 200) {
              this.$Message.success(res.message)
              if (this.course.release_status === 0) {
                this.course.release_status = 1
              } else {
                this.course.release_status = 0
              }
              if (type === 'remove' || type === 'unbind') {
                this.$emit('refreshData')
              } else if (type === 'audit') {
                this.course.audit_status = 3
              } else {
                this.changeData()
              }
              if (type === 'remove') {
                if (item.release_status === 0 || item.release_status === 1) {
                  this.$store.commit('setcourseData', [])
                  this.$store.state.user.userInfo.course_total--
                }
              }
            }
          })
        }
      })
    },
    changeData () {
      this.$refs.courseDetail.getTeacherCourse()
    },
    handlebind () {
      this.course_ids.push(this.course.id)
      this.axios.request({
        method: 'post',
        url: 'index.php/Teacher/Course/choose',
        data: {
          course_ids: this.course_ids
        }
      }).then(res => {
        if (res.code === 200) {
          this.$Message.success('绑定成功')
          this.course_ids = []
          this.$emit('bind-success')
          this.courdetail = ''
        }
      })
    },
    back () {
      this.courdetail = ''
      this.$emit('reback')
    }
  },
  computed: {
    course () {
      return this.$store.state.user.courseData
    }
  },
  mounted () {

    console.log(this.course);

  }
}
</script>
