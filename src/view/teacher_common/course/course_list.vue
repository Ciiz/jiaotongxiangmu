<template>
  <div>
    <Row class="search-bar">
      搜索课程：
      <Input type="text" v-model="keyword" placeholder="请输入搜索内容" style="width:200px">
      <Icon type="ios-search" slot="suffix" @click="getData(true)" />
      </Input>
      <slot name="search-bar"></slot>
      <div style="display:inline-block;margin-left: 10px;margin-right:10px">
        <RadioGroup v-model="bind_type" type="button" v-if="editable">
          <Radio :label="4">所有</Radio>
          <Radio :label="1">被分配</Radio>
          <Radio :label="2">自选</Radio>
          <Radio :label="3">自建</Radio>
        </RadioGroup>
      </div>
      <Button type="success" icon="md-hand" @click="open('course_choose_list', '', '选择课程')"
        v-show="bind_type === 2">选择课程</Button>
      <Button type="success" icon="md-add" @click="open('course_detail_edit', '', '新建课程')"
        v-show="bind_type === 3">新增课程</Button>
    </Row>
    <Table :loading="loading" ref="selection" :columns="columns" :data="list" :height="$store.state.app.tableHeight">
    </Table>
    <Row class="table-bottom-teacher">
      <page :total="total" :current="page" style="text-align:center;" :page-size="page_size" size="small"
        @on-change="(page) => {this.page =  page , this.getData()}" :placement="'top'"></page>
    </Row>
    <Modal v-model="modal" :title="title" :width="modal_width" :footer-hide="footerHide" :fullscreen="fullscreen"
      :mask-closable='false'>
      <courseDetailEdit :course_id="target_id" v-if="target === 'course_detail_edit' && modal" @success="getData()">
      </courseDetailEdit>
      <courseDetail :course_id="target_id" v-if="target === 'course_detail'"></courseDetail>
      <courseStudents :teacher_course_id="target_id" v-if="target === 'course_students' && modal"
        @close="modal = false"></courseStudents>
      <courseChooseList :course_id="target_id" v-if="target === 'course_choose_list' && modal"
        @bind-success="getData()"></courseChooseList>
      <attendance-list :teacher_course_id="target_id" v-if="target === 'attendance_list' && modal"
        @bind-success="getData()"></attendance-list>
    </Modal>
  </div>
</template>
<script>
import modal_mixin from '@/view/mixins/modal_mixin'
import { ReleaseMap, AuditMap, ReleaseColorMap, AuditColorMap } from '@/view/mixins/str_map'
import courseDetailEdit from '@/view/teacher_common/course/course_detail_edit.vue'
import courseDetail from '@/view/teacher_common/course/course_detail.vue'
import courseStudents from '@/view/teacher_common/course/course_students.vue'
import courseChooseList from '@/view/teacher_common/course/course_choose_list.vue'
import AttendanceList from '@/view/teacher_common/attendance/attendance_list.vue'
export default {
  props: {
    bind_type: '',
    editable: Boolean
  },
  mixins: [modal_mixin],
  components: {
    courseDetailEdit, courseDetail, courseStudents, courseChooseList, AttendanceList
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
          title: '课程封面',
          key: 'img',
          width: 200,
          align: 'left',
          render: (h, params) => {
            return (
              <div style={{ width: '80px', height: '60px', margin: '10px', overflow: 'hidden' }}>
                <img src={params.row.img} onLoad={(e) => {
                  setTimeout(() => {
                    params.row.style = this.imgtest(e.path[0].width, e.path[0].height)
                  }, 0)
                }} class={`img_${params.row.style}`} />
              </div>
            )
          }
        },
        {
          key: 'course_name',
          title: '课程名称',
          minWidth: 150
        },
        {
          key: 'major_name',
          title: '专业',
          minWidth: 120
        },
        // {
        //   key: 'type_info',
        //   title: '类型',
        //   minWidth: 120
        // },
        {
          title: '状态',
          key: 'status',
          minWidth: 120,
          render: (h, params) => {
            let item = params.row
            return (
              <div>
                <Tag color={ReleaseColorMap[item.release_status]} v-show={item.release_status}>{ReleaseMap[item.release_status]}</Tag>
                <Tag color={AuditColorMap[item.audit_status]} v-show={item.audit_status}>{AuditMap[item.audit_status]}</Tag>
              </div>
            )
          }
        },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          align: 'center',
          width: 250,
          render: (h, params) => {
            let item = params.row
            return (
              <div>
                <Button type={item.release_status ? 'error' : 'success'} size="small" onClick={() => { this.action(item, 'release') }} v-show={(item.audit_status === 1 || item.create_type === 1 || item.create_type === 4) && this.editable && this.bind_type !== 0}>{item.release_status ? '撤回' : '发布'}</Button>
                <Button type='warning' size="small" v-show={this.bind_type === 2} onClick={() => { this.action(item, 'unbind') }}>解绑</Button>
                <Button type='primary' size="small" v-show={this.bind_type === 3} onClick={() => { this.open('course_detail_edit', params.row.id, '编辑') }}>编辑</Button>
                <Button type='warning' size="small" v-show={this.bind_type === 3 && (item.audit_status === 0 || item.audit_status === 2)} onClick={() => { this.action(item, 'audit') }}>提交审核</Button>
                <Button type='info' size="small" onClick={() => { this.open('course_detail', item.id, '课程详情') }}>查看</Button>
                <Button type='error' size="small" onClick={() => { this.action(item, 'remove') }} v-show={this.bind_type === 3}>删除</Button>
                <Button type='warning' size="small" onClick={() => { this.open('course_students', item.teacher_course_id, '课程学习人数') }} v-show={this.bind_type === 0}>学生</Button>
                <Button type='info' size="small" onClick={() => { this.open('attendance_list', item.teacher_course_id, '考勤', 1200) }} v-show={this.bind_type === 0}>查看考勤</Button>
                <Button type='success' size="small" onClick={() => { this.$router.push({ name: 'course_courseware', query: { release_status: '', teacher_course_id: item.teacher_course_id } }) }} v-show={this.bind_type === 0}>进入</Button>
              </div>
            )
          }
        }
      ]
    }
  },
  watch: {
    bind_type (n, o) {
      this.getData(true)
    }
  },
  methods: {
    getData (isSearch) {
      if (isSearch) this.page = 1
      this.loading = true
      this.axios.request({
        url: '/index.php/Teacher/Course/index',
        method: 'get',
        params: {
          page: this.page,
          keyword: this.keyword,
          type: this.bind_type
        }
      }).then(res => {
        if (res.code === 200) {
          this.list = res.data.course_list
          for (let i in this.list) {
            this.list[i]['style'] = 'width'
            this.list[i].img += '?nocache=' + new Date().getTime()
          }
          this.total = res.data.pages * this.page_size
        }
        this.loading = false
      })
    },
    action (item, type) {
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
            if (res.code === 200) {
              this.$Message.success(res.message)
              this.getData()
              if (type === 'remove') {
                console.log(item.release_status)
                if (item.release_status === 0 || item.release_status === 1) { this.$store.state.user.userInfo.course_total-- }
              }
            }
          })
        }
      })
    }
  },
  mounted () {
    this.getData(true)
    // if (this.bind_type === 0) { // 我的课程不显示状态列
    //   this.columns.splice(2, 1)
    // } else { // 非我的课程不显示课时
    //   this.columns.splice(3, 1)
    // }
  }
}
</script>
