<template>
  <div>
    <Row class="search-bar">
      <Input type="text" v-model="keyword" placeholder="请输入搜索内容" class="new-searchSel"></Input>
      <button @click="getData(true)" class="blue-btn" style="width:80px;transform: translate(-20px,2px);">搜索</button>
      <button class="blueC-btn" style="margin-left:15px;"
        @click="$emit('showAddCourseware',timetable_id,target_id,1,courseware_id,teacher_course_id,type,courseware_name)"
        v-if="editable">添加测试</button>
      <button class="green-btn" style="margin-left:15px;width:104px" @click="open('exam_select','','选择测试', 400)"
        v-if="editable">选择测试</button>
      <slot name="search-bar"></slot>
    </Row>
    <Table :loading="loading" ref="selection" class="exam_release_list_table" :columns="columns" :data="list"
      :height="$store.state.app.tableHeight" stripe border></Table>
    <Row>
      <page :total="total" :current="page" :page-size="page_size" size="small" show-elevator
        @on-change="(page) => {this.page =  page , this.getData()}" :placement="'top'"></page>
    </Row>
    <Modal v-model="modal" :title="title" :width="modal_width" :footer-hide="footerHide" :fullscreen="fullscreen"
      @on-visible-change="handleVisibleChange" :mask-closable='false'>
      <ExamReleaseDetail :exam_release_id="target_id" v-if="target === 'exam_release_detail'"></ExamReleaseDetail>
      <StudentExamList style="height:700px" @closeModal="modal=false" @on-refresh-parent-list="modal=false"
        :targetwork_id="target_id" :target_type="'student_exam_list'" v-if="target === 'student_exam_list'">
      </StudentExamList>
      <ExamEdit :timetable_id="timetable_id" :exam_release_id="target_id" :action_type="1"
        :courseware_id="courseware_id" :teacher_course_id="teacher_course_id" :type="type"
        v-if="target === 'exam_edit' && modal" @success="getData();modal=false"></ExamEdit>
      <ExamSelect :timetable_id="timetable_id" :type="type" :courseware_id="courseware_id"
        v-if="target === 'exam_select'" @success="modal = false; getData(true); target = ''"></ExamSelect>
    </Modal>
  </div>
</template>
<script>
import modal_mixin from '@/view/mixins/modal_mixin'
import ExamReleaseDetail from '@/view/teacher_common/exam/exam_release_detail.vue'
import StudentExamList from '@/view/teacher_common/exam/student_exam_list.vue'
import ExamEdit from '@/view/teacher_common/exam/exam_edit.vue'
import ExamSelect from '@/view/teacher_common/exam/exam_select.vue'
import { ReleaseMap } from '@/view/mixins/str_map'
export default {
  props: {
    type: '',
    courseware_id: '',
    timetable_id: '',
    release_status: '',
    editable: false,
    teacher_course_id: '',
    courseware_name: ''
  },
  mixins: [modal_mixin],
  components: {
    ExamReleaseDetail, StudentExamList, ExamEdit, ExamSelect
  },
  watch: {
    timetable_id (n, o) {
      this.getData(true)
    }
  },
  data () {
    return {
      page: 1,
      page_size: 7,
      total: 0,
      list: [],
      keyword: '',
      loading: false,
      columns: [
        {
          title: '测试名称',
          key: 'exam_name',
          align: 'center',
          minWidth: 300
        },
        {
          title: '时间',
          align: 'center',
          key: '',
          width: 240,
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
          title: '发布状态',
          key: 'release_status',
          width: 120,
          align: 'center',
          render: (h, params) => {
            return (
              <div>
                {ReleaseMap[params.row.release_status]}
              </div>
            )
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width: 330,
          render: (h, params) => {
            let row = params.row
            return (
              <div class="exam_release_list_btnList">
                <button class={row.release_status ? 'orangeText-btn' : 'orange-btn'} style="width:43px" onClick={() => { this.release(row) }}>{row.release_status === 0 ? '发布' : '撤回'}</button>
                <button class="blueText-btn" onClick={() => { this.$emit('showAddCourseware', this.timetable_id, row.exam_release_id, 1, this.courseware_id, this.teacher_course_id, this.type, this.courseware_name) }} v-show={this.editable}>编辑</button>
                <button class="blueText-btn" v-show={row.release_status === 1} onClick={() => { this.open('student_exam_list', row.exam_release_id, `${row.exam_name}-试题作答列表`, 1200) }}>批改</button>
                <button class="redText-btn" onClick={() => { this.del(row.id) }} v-show={this.editable}>删除</button>
              </div>
            )
          }
        }
      ]
    }
  },
  methods: {
    getData (isSearch) {
      if (isSearch) this.page = 1
      this.loading = true
      this.axios.request({
        url: '/index.php/Teacher/Examination/index',
        method: 'get',
        params: {
          type: this.type, // 1:课前, 2课中, 3课后
          page: this.page,
          keyword: this.keyword,
          courseware_id: this.courseware_id,
          timetable_id: this.timetable_id,
          release: this.release_status
        }
      }).then(res => {
        if (res.code === 200) {
          this.list = res.data.exam_list
          this.total = res.data.pages * this.page_size
        }
        this.loading = false
      })
    },
    release (item) {
      if (item.release_status === 1) { // 撤回
        this.$Modal.confirm({
          title: '确定要撤回吗？',
          onOk: () => {
            this.release_request(item.exam_release_id, 'un_release')
          }
        })
      } else { // 发布
        this.release_request(item.exam_release_id, 'release')
      }
    },
    release_request (exam_release_id, action) {
      this.axios.request({
        method: 'post',
        url: `/index.php/Teacher/Examination/${action}`,
        data: {
          exam_release_id: exam_release_id
        }
      }).then(res => {
        if (res.code === 200) {
          this.$Message.success(res.message)
          this.getData()
        }
      })
    },
    del (ids) {
      if (!(ids instanceof Array)) {
        ids = [ids]
      }
      this.$Modal.confirm({
        title: '确定删除吗? ',
        content: '',
        onOk: () => {
          this.axios.request({
            method: 'post',
            url: '/index.php/Teacher/Examination/delete',
            data: {
              id: ids,
              timetable_id: this.timetable_id
            }
          }).then(res => {
            if (res.code === 200) {
              this.$Message.success('删除成功')
              this.getData()
            }
          })
        }
      })
    },
    handleVisibleChange (visiable) {
      // if (!visiable && this.target === 'exam_detail_edit') { // TODO:临时用
      //   this.target = ''
      // }
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
<style lang="less">
.hei-modal .ivu-modal-body {
  height: 700px;
}
</style>
