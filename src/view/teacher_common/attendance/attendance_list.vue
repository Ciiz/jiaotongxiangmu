<template>
  <div style="background:#ffffff;height:100%;display:flex;flex-direction:column">
    <Row type="flex" justify="space-between" style="padding:12px 20px">
      <Col class="attendance-fl">
      <Col>
      班级：
      <Select v-model="class_id" class="new-searchSel" @on-change="handleClassChange" placeholder="班级" clearable
        style="margin-right:20px">
        <Option v-for="(item,index) in class_list" :key="index" :value="item.id">{{item.class_name}}</Option>
      </Select>
      学年：
      <Select v-model="showTime" class="new-searchSel" @on-change="handleSemesterChange" clearable>
        <Option v-for="(item,index) in TimeList" :key="index" :value="item.value">{{item.info}}</Option>
      </Select>
      </Col>
      </Col>
      <Col>
      <button class="greenImage-btn" @click="open('attendance_preview','','导出班级学生考勤记录',1100)">考勤总览</button>
      </Col>
    </Row>
    <div style="padding:10px;width:100%;height:100%;overflow:hidden">
      <div class="courseware_list_table_parent">
        <Table :data="list" :columns="columns" class="courseware_list_table" :loading="loading"></Table>
      </div>
    </div>
    <!-- <div>
      <page :total="count" :current="page" :page-size="page_size"  size="small" show-elevator show-total show-sizer @on-change="handlePageChange" @on-page-size-change="handleSizeChange" :placement="'top'"></page>
    </div> -->

    <Modal v-model="modal" :title="title" :width="1100" footer-hide>
      <attendance-preview style="height:700px" v-if="target === 'attendance_preview' && modal"
        :teacher_course_id="courseId" :class_id="class_id" :showTime="showTime"></attendance-preview>
      <attendance-record-list v-if="target === 'attendance_record_list'" :attendance_id="target_id">
      </attendance-record-list>
    </Modal>
    <Modal v-model="modal1" title="删除考勤记录" @on-ok="del">
      <p>确定删除当前考勤记录？</p>
    </Modal>
  </div>
</template>
<script>
import { get_attendance_list, get_class_by_teacher_course } from '@/api/data'
import modal_mixin from '@/view/mixins/modal_mixin'
import AttendancePreview from '@/view/teacher_common/attendance/attendance_preview'
import AttendanceRecordList from '@/view/teacher_common/attendance/attendance_record_list'
export default {
  mixins: [modal_mixin],
  components: {
    AttendancePreview, AttendanceRecordList
  },
  data () {
    return {
      showTime: '',
      TimeList: [],
      list: [],
      count: 0,
      page: 1,
      page_size: 20,
      delId: '',
      loading: false,
      modal1: false,
      class_list: [],
      class_id: '',
      columns: [
        {
          title: '序号',
          align: 'center',
          width: 150,
          render: (h, params) => {
            let row = params.row
            return <span>{row._index + 1}</span>
          }
        },
        {
          title: '上课时间',
          align: 'center',
          key: 'courseware_begin_time',
          width: 150
        },
        {
          title: '课时安排',
          align: 'center',
          width: 200,
          render: (h, params) => {
            let row = params.row
            return <span>第{row.week}周 星期{row.day} <span>第{row.class_no}节</span></span>
          }
        },
        {
          title: '应到',
          align: 'center',
          key: 'expected',
          width: 70
        },
        {
          title: '已到',
          align: 'center',
          key: 'arrived',
          width: 70
        },
        {
          title: '正常',
          align: 'center',
          key: 'normal',
          width: 70
        },
        {
          title: '迟到',
          align: 'center',
          key: 'late',
          width: 70
        },
        {
          title: '早退',
          align: 'center',
          key: 'leave_early',
          width: 70
        },
        {
          title: '缺勤',
          align: 'center',
          key: 'obsent',
          width: 70
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, params) => {
            return (
              <div>
                <Icon type="md-close" style="font-size:22px;color:#FE452D;cursor:pointer" onClick={() => { this.delId = params.row.id; this.modal1 = true }} />
              </div>
            )
          }
        }
      ]
    }
  },
  computed: {
    courseId () {
      return this.$store.state.user.courseData.teacher_course_id
    }
  },
  watch: {
    courseId (n, o) {
      this.page = 1
      this.getData()
      this.get_class_by_teacher_course()
    },
    class_id (n, o) {
      this.getTimeList()
    }
  },
  methods: {
    getData () {
      this.loading = true
      get_attendance_list({
        teacher_course_id: this.courseId,
        page: this.page,
        page_size: this.page_size,
        class_id: this.class_id,
        time: this.showTime
      }).then(res => {
        console.log(res);
        if (res.code === 200) {
          this.list = res.data.list
          this.count = res.data.count
        }
        this.loading = false
      })
    },
    getTimeList () {
      this.axios.request({
        method: 'post',
        url: '/index.php/teacher/attendance/get_year_semester',
        data: {
          teacher_course_id: this.courseId,
          class_id: this.class_id
        }
      }).then(res => {
        console.log(res);
        if (res.code === 200) {
          this.TimeList = res.data
        }
      })
    },
    del () {
      this.loading = true
      this.axios.request({
        method: 'get',
        url: '/index.php/Teacher/attendance/del_attendance',
        params: {
          id: this.delId
        }
      }).then(res => {
        if (res.code === 200) {
          this.$Message.info('删除成功')
        } else {
          this.$Message.error('删除失败')
        }
        this.loading = false
        this.getData()
      })
    },
    get_class_by_teacher_course () {
      get_class_by_teacher_course(this.courseId).then(res => {
        this.class_list = res.data
      })
    },
    handlePageChange: function (val) {
      this.page = val
      this.getData()
    },
    handleSizeChange: function (val) {
      this.page_size = val
      this.getData(true)
    },
    handleSemesterChange (val) {
      this.page = 1
      this.getData()
    },
    handleClassChange () {
      this.page = 1
      this.getData()
    }
  },
  mounted () {
    console.log(this.courseId);

    this.getData()
    this.get_class_by_teacher_course()
  }
}
</script>
