<template>
  <div>
    <Row class="search-bar">
      <Input type="text" v-model="keyword" placeholder="请输入搜索内容" class="new-searchSel"></Input>
      <button @click="getData(true)" class="blue-btn" style="width:80px;transform: translate(-20px,2px);">搜索</button>
      <button @click="open('homework_edit','','添加作业')" class="blueC-btn"  style="margin-left:15px;" v-if="editable">添加作业</button>
      <button @click="open('homework_select','','选择作业', 400)" class="green-btn" style="margin-left:15px;width:104px"  v-if="editable">选择作业</button>
      <slot name="search-bar"></slot>
    </Row>
  <Table :loading="loading" ref="selection" class="homework_release_list_table" :columns="columns" :data="list" :height="$store.state.app.tableHeight" stripe border></Table>
  <Row>
    <page :total="total" :current="page"  :page-size="page_size" size="small" show-elevator @on-change="(page) => {this.page=page;this.getData()}"  :placement="'top'"></page>
  </Row>
    <Modal v-model="modal" :title="title" :width="modal_width" :footer-hide="footerHide" :fullscreen="fullscreen" :mask-closable='false'>
      <HomeworkReleaseDetail :homework_release_id="target_id" v-if="target === 'homework_release_detail'"></HomeworkReleaseDetail>
      <student-exam-list style="height:700px" :targetwork_id="target_id" @closeModal="modal=false" :target_type="'student_homework_list'" v-if="target === 'student_homework_list'"></student-exam-list>
      <HomeworkEvaluationEdit :id="target_id" v-if="target === 'homework_evaluation_edit'" @success="modal = false;"></HomeworkEvaluationEdit>
      <HomeworkEdit :timetable_id="timetable_id"  :type="type" :homework_release_id="target_id" :courseware_id="courseware_id" v-if="target === 'homework_edit'" @success="modal = false; getData(true); target = ''"></HomeworkEdit>
      <HomeworkSelect :timetable_id="timetable_id"  :type="type" :courseware_id="courseware_id" v-if="target === 'homework_select'" @success="modal = false; getData(true); target = ''"></HomeworkSelect>
    </Modal>
  </div>
</template>
<script>
import modal_mixin from '@/view/mixins/modal_mixin'
import HomeworkReleaseDetail from '@/view/teacher_common/homework/homework_release_detail.vue'
import StudentExamList from '@/view/teacher_common/exam/student_exam_list'
import HomeworkEvaluationEdit from '@/view/teacher_common/homework/homework_evaluation_edit.vue'
import HomeworkEdit from '@/view/teacher_common/homework/homework_edit.vue'
import HomeworkSelect from '@/view/teacher_common/homework/homework_select.vue'
import { ReleaseMap, ReleaseColorMap } from '@/view/mixins/str_map'
export default{
  props: {
    type: '',
    courseware_id: '',
    timetable_id: '',
    release_status: '',
    editable: false
  },
  mixins: [modal_mixin],
  components: {
    HomeworkReleaseDetail, StudentExamList, HomeworkEvaluationEdit, HomeworkEdit, HomeworkSelect
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
          title: '作业名称',
          key: 'homework_name',
          align: 'center',
          minWidth: 300
        },
        {
          title: '时间',
          key: '',
          align: 'center',
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
          align: 'center',
          width: 120,
          render: (h, params) => {
            return (
              <div>
                <Tag color={ReleaseColorMap[params.row.release_status]}>{ReleaseMap[params.row.release_status]}</Tag>
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
              <div class="homework_release_list_btnList">
                <button class="blueText-btn" onClick={() => { this.open('homework_edit', row.homework_release_id, '编辑作业') }} v-show={this.editable}>编辑</button>
                <button class="blueText-btn" onClick={() => { this.open('homework_release_detail', row.homework_release_id, '作业-发布详情') }}>查看</button>
                <button class={row.release_status ? 'orangeText-btn' : 'orange-btn'} onClick={() => { this.release(row) }}>{row.release_status === 0 ? '发布' : '撤回'}</button>
                <button class="blueText-btn" v-show={row.release_status === 1} onClick={() => { this.open('student_homework_list', row.homework_release_id, `${row.homework_name}-作业作答列表`) }}>批改</button>
                <button class="redText-btn" onClick={() => { this.del(row.id) }} v-show={this.editable}>删除</button>
              </div>
            // <Button type='warning' size="small" onClick={() => { this.open('homework_evaluation_edit', row.id, '作业-评分维度编辑', 600) }} v-show={this.editable}>评分维度</Button>
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
        url: '/index.php/Teacher/Homework/index',
        method: 'get',
        params: {
          page: this.page,
          keyword: this.keyword,
          courseware_id: this.courseware_id,
          timetable_id: this.timetable_id,
          release: this.release_status
        }
      }).then(res => {
        if (res.code === 200) {
          this.list = res.data.homework_list
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
            this.release_request(item.homework_release_id, 'un_release')
          }
        })
      } else { // 发布
        this.release_request(item.homework_release_id, 'release')
      }
    },
    release_request (homework_release_id, action) {
      this.axios.request({
        method: 'post',
        url: `/index.php/Teacher/Homework/${action}`,
        data: {
          homework_release_id: homework_release_id
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
        title: '确定删除? ',
        content: '.',
        onOk: () => {
          this.axios.request({
            method: 'post',
            url: '/index.php/Teacher/Homework/delete',
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
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
<style lang="less">

</style>
