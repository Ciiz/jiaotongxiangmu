<template>
  <div style="background:#ffffff;height:100%;width:100%;position:relative">
    <div style="height:100%;width:100%;padding:10px;position:absolute">
      <Row class="search-bar">
        <!-- <Button type="primary" size="small" @click="getData(true)" style="margin-left:15px;">搜索</Button> -->
        <slot name="search-bar"></slot>
      </Row>
    <div class="courseware_list_table_parent">
      <Table :loading="loading" ref="selection" class="courseware_list_table" :columns="columns" :data="list" stripe border></Table>
    </div>
    </div>

    <Modal v-model="modal" class="courseware_list_modal" :title="title" :width="modal_width" :footer-hide="footerHide" :fullscreen="fullscreen" >
      <TaskReleaseList v-if="target === 'task_release_list' && modal" :type="target_id.type" :courseware_id="target_id.courseware_id" :timetable_id="target_id.timetable_id" :release_status="target_id.release_status" :editable="editable"></TaskReleaseList>
      <HomeworkReleaseList v-if="target === 'homework_release_list' && modal" :type="target_id.type" :courseware_id="target_id.courseware_id" :timetable_id="target_id.timetable_id" :release_status="target_id.release_status" :editable="editable"></HomeworkReleaseList>
      <ExamReleaseList v-if="target === 'exam_release_list' && modal" @showAddCourseware='showAddCourseware' :type="target_id.type" :teacher_course_id="teacher_course_id" :courseware_id="target_id.courseware_id" :timetable_id="target_id.timetable_id" :release_status="target_id.release_status" :courseware_name="target_id.courseware_name" :editable="editable"></ExamReleaseList>
      <CoursewareLiveClassChoose v-if="target === 'courseware_live_class_choose' && modal" :course_status="course_status" :classList="target_id.classList" :courseware_id="target_id.courseware_id" :live_status="target_id.live_status" @finished="modal = false"></CoursewareLiveClassChoose>
      <courseware-add v-if="target === 'courseware_editor' && modal" isneworeditor="编辑课件" :rowid='target_id' :send_course_id='teacher_course_id'  @success="getData(true),modal = false"></courseware-add>
      <coursewarePreview v-if="target === 'coursewarePreview'&& modal" isneworeditor="预览课件" :rowid='target_id' :send_course_id='teacher_course_id'  @success="getData(true),modal = false"></coursewarePreview>
      <CoursewareTimetable v-if="target === 'courseware_timetable' && modal" :timetable_id="target_id.timetable_id" :class_id="target_id.class_id" :teacher_course_id="teacher_course_id" @success="modal = false" @error="modal = false"></CoursewareTimetable>
    </Modal>
    <Modal v-model="showQuestion" title="问题列表" :width="700" footer-hide class="courseware_list_modal2">
      <showQuestion :courseware_id='courseware_id'></showQuestion>
    </Modal>
    <Modal v-model="modal3" title="视频录制" :width="1100" footer-hide>
       <coursewareVedio @closeVedioModal="closeVedioModal" :vedioClass_id="vedioClass_id" :vedioSrc="vedioSrc" :vedioName="vedioName" :upload_courseware_id="upload_courseware_id"></coursewareVedio>
    </Modal>
  </div>
</template>
<script>
import modal_mixin from '@/view/mixins/modal_mixin'
import TaskReleaseList from '@/view/teacher_common/task/task_release_list.vue'
import HomeworkReleaseList from '@/view/teacher_common/homework/homework_release_list.vue'
import ExamReleaseList from '@/view/teacher_common/exam/exam_release_list.vue'
import CoursewareLiveClassChoose from '@/view/teacher_common/courseware/courseware_live_class_choose.vue'
import coursewareAdd from '@/view/teacher_common/courseware/courseware_edit.vue'
import CoursewareTimetable from '@/view/teacher_common/courseware/courseware_timetable'
import coursewarePreview from '@/view/teacher_common/courseware/courseware_Preview.vue'
import coursewareVedio from '@/view/teacher_common/courseware/courseware_vedio.vue'
import showQuestion from '@/view/teacher_common/question/show_question.vue'
import upload_mixin from '_c/mixins/upload_mixin'

export default{
  props: {
    release_status: '',
    teacher_course_id: '',
    editable: false
  },
  mixins: [modal_mixin, upload_mixin],
  components: {
    TaskReleaseList,
    HomeworkReleaseList,
    ExamReleaseList,
    CoursewareLiveClassChoose,
    CoursewareTimetable,
    coursewareAdd,
    coursewarePreview,
    showQuestion,
    coursewareVedio
  },
  data () {
    return {
      modal3: false,
      vedioSrc: '',
      vedioName: '',
      upload_courseware_id: '',
      vedioClass_id: '',
      course_status: 0,
      showQuestion: false,
      page: 1,
      page_size: 7,
      total: 0,
      list: [],
      keyword: '',
      courseware_id: '',
      loading: false,
      class_list: [],
      columns: [
        {
          title: '排序',
          key: 'sort',
          minWidth: 70,
          align: 'center'
        },
        {
          key: 'courseware_name',
          title: '课件名称',
          minWidth: 150,
          render: (h, params) => {
            return (
              <div onClick={() => { this.open('coursewarePreview', params.row.id, '预览课件') }} style={{ color: '#', cursor: 'pointer' }}>{params.row.courseware_name}</div>
            )
          }
        },
        {
          title: '班级',
          key: 'class',
          align: 'center',
          minWidth: 150,
          className: 'my-table-cell',
          render: (h, params) => {
            let row = params.row
            return (
              <div class="table-item">
                {
                  row.class_list.map(item => {
                    return <div class="item" style={{ cursor: 'text' }}>
                      <span>{item.class_name}</span>
                    </div>
                  })
                }
                <Poptip placement="bottom" transfer width="200" v-show={this.editable} style={{ borderTop: '1px solid #E8EAEC', width: '100%' }}>
                  <div onClick={() => {}} class="item" style={{ color: '#2d8cf0', hover: 'color:' }}>添加班级</div>
                  <div class="api" slot="content">{
                    this.class_list.map(item => {
                      let flag = row.class_list.some((el) => { return el.class_id === item.id })
                      return <div><Checkbox value={flag} on-on-change={(status) => { this.handleBindClass(status, item.id, item.class_name, row) }}><span>{item.class_name}</span></Checkbox></div>
                    })}
                  </div>
                </Poptip>
              </div>
            )
          }
        },
        {
          title: '课时安排',
          key: 'timetable',
          className: 'my-table-cell',
          align: 'center',
          minWidth: 100,
          render: (h, params) => {
            let row = params.row
            return (
              <div class="table-item">
                {
                  row.class_list.map(item => {
                    return <div class="item table-item-option">
                      <span style="color:#3B9BFF" onClick={() => { this.open('courseware_timetable', { timetable_id: item.timetable_id, class_id: item.class_id }, `${row.courseware_name} - ${item.class_name} - 课时安排`, 1000, true, false, '0px') }}>查看</span>
                    </div>
                  })
                }
                <div v-show={this.editable} class="item">&nbsp;...</div>
              </div>
            )
          }
        },
        {
          title: '课前',
          key: 'class_before',
          className: 'my-table-cell',
          align: 'center',
          minWidth: 100,
          render: (h, params) => {
            let row = params.row
            return (
              <div class="table-item">
                {
                  row.class_list.map(item => {
                    return <div class="item table-item-option">
                      <span onClick={() => { this.open('task_release_list', { type: 1, courseware_id: row.id, timetable_id: item.timetable_id, release_status: 2 }, `${row.courseware_name} - ${item.class_name} - 课前任务`) }}>任务</span>
                      <span onClick={() => { this.open('exam_release_list', { type: 1, courseware_id: row.id, timetable_id: item.timetable_id, release_status: 2, courseware_name: row.courseware_name }, `${row.courseware_name} - ${item.class_name} - 课前测试`) }}>测试</span>
                    </div>
                  })
                }
                <div v-show={this.editable} class="item">&nbsp;...</div>
              </div>
            )
          }
        },
        {
          title: '课中',
          key: 'class_in',
          align: 'center',
          minWidth: 100,
          className: 'my-table-cell',
          render: (h, params) => {
            let row = params.row
            return (
              <div class="table-item">
                {
                  row.class_list.map(item => {
                    return <div class="item table-item-option">
                      <span onClick={() => { this.open('task_release_list', { type: 2, courseware_id: row.id, timetable_id: item.timetable_id, release_status: 2 }, `${row.courseware_name} - ${item.class_name} - 课中任务`) }}>任务</span>
                      <span onClick={() => { this.open('exam_release_list', { type: 2, courseware_id: row.id, timetable_id: item.timetable_id, release_status: 2, courseware_name: row.courseware_name }, `${row.courseware_name} - ${item.class_name} - 课中测试`) }}>测试</span>
                    </div>
                  })
                }
                <div v-show={this.editable} class="item">&nbsp;...</div>
              </div>
            )
          }
        },
        {
          title: '课后',
          key: 'class_after',
          align: 'center',
          minWidth: 150,
          className: 'my-table-cell',
          render: (h, params) => {
            let row = params.row
            return (
              <div class="table-item">
                {
                  row.class_list.map(item => {
                    return <div class="item table-item-option">
                      <span onClick={() => { this.open('task_release_list', { type: 3, courseware_id: row.id, timetable_id: item.timetable_id, release_status: 2 }, `${row.courseware_name} - ${item.class_name} - 课后任务`) }}>任务</span>
                      <span onClick={() => { this.open('exam_release_list', { type: 3, courseware_id: row.id, timetable_id: item.timetable_id, release_status: 2, courseware_name: row.courseware_name }, `${row.courseware_name} - ${item.class_name} - 课后测试`) }}>测试</span>
                      <span onClick={() => { this.open('homework_release_list', { type: 3, courseware_id: row.id, timetable_id: item.timetable_id, release_status: 2 }, `${row.courseware_name} - ${item.class_name} - 课后作业`) }}>作业</span>
                    </div>
                  })
                }
                <div v-show={this.editable} class="item">&nbsp;...</div>
              </div>
            )
          }
        },
        {
          title: '课中提问',
          key: 'add_question',
          align: 'center',
          minWidth: 120,
          className: 'my-table-cell',
          render: (h, params) => {
            let row = params.row
            return (
              <div class="table-item">
                <div class="item table-item-option">
                  <span style="color:#3B9BFF" onClick={() => { this.showQuestion = true; this.courseware_id = row.id }}>提问设置</span>
                </div>
              </div>
            )
          }
        },
        {
          title: '视频录制',
          key: '',
          align: 'center',
          minWidth: 120,
          className: 'my-table-cell',
          render: (h, params) => {
            let row = params.row
            return h('div', {
              class: 'table-item'
            }, [
              row.class_list.map(item => {
                return h('div', {
                  class: 'item table-item-option'
                }, [
                  h('Poptip', {
                    props: {
                      placement: 'bottom'
                    }
                  }, [
                    h('div', {
                      style: { color: '#2d8cf0', cursor: 'pointer' },
                      on: {
                        click: () => {
                          this.upload_courseware_id = row.id
                          this.vedioClass_id = item.class_id
                        }
                      }
                    }, '查看'),
                    h('div', {
                      slot: 'content'
                    }, [
                      item.video_list.map((item2, index) => {
                        return h('div', {}, [
                          h('div', {
                            class: 'homeWorkItem',
                            on: {
                              click: () => {
                                this.vedioSrc = item2.url
                                this.vedioName = item2.file_name
                                this.modal3 = true
                              }
                            }
                          }, item2.file_name)
                        ]
                        )
                      }),
                      h('Upload', {
                        on: {
                          click: () => {
                          }
                        },
                        props: {
                          action: this.action_url,
                          onSuccess: this.uploadVideo,
                          onFormatError: this.formatError,
                          showUploadList: false,
                          format: ['mp4', 'avi', 'rmvb', 'swf', 'Ogg'],
                          data: { token: this.$store.state.user.token, type: 'classlive', courseware_id: this.upload_courseware_id, class_id: item.class_id }
                        }
                      },
                      [
                        h('span', {
                          style: { color: '#2d8cf0', cursor: 'pointer' }
                        }, '上传')
                      ])
                    ]
                    )
                  ])
                ])
              }),
              <div v-show={this.editable} class="item">&nbsp;...</div>
            ])
          }
        },
        {
          title: '操作',
          key: 'release_withdraw',
          align: 'center',
          minWidth: 80,
          className: 'my-table-cell',
          showInEdit: true,
          render: (h, params) => {
            let row = params.row
            return (
              <div class="table-item">
                {
                  row.class_list.map(item => {
                    return <div class="item table-item-option">
                      <span style="color:#FE7443" onClick={() => { this.release(item.timetable_id, item.release_status === 1 ? 0 : 1) }}>{item.release_status === 1 ? '撤回' : '发布'}</span>
                    </div>
                  })
                }
              </div>
            )
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          minWidth: 240,
          className: 'my-table-cell',
          render: (h, params) => {
            let row = params.row
            let classList = row.class_list
            return (
              <div class='action-item'>
                <Button type='info' size="small" onClick={() => { this.open('courseware_live_class_choose', { classList: classList, courseware_id: row.id, live_status: 1 }, '班级选择', 300) }} v-show={!this.editable}>课室上课</Button>
                <Button type='info' size="small" onClick={() => { this.open('courseware_live_class_choose', { classList: classList, courseware_id: row.id, live_status: 3 }, '班级选择', 300) }} v-show={!this.editable}>直播上课</Button>
                <button class="orange-btn" onClick={() => { this.multipleRelease(row, 1) }} v-show={this.editable && row.class_list.length !== 0}>发布</button>
                <button class="blueText-btn" onClick={() => { this.multipleRelease(row, 0) }} v-show={this.editable && row.class_list.length !== 0}>撤回</button>
                <span v-show={this.editable}>
                  <button class="blueText-btn" onClick={() => { this.open('courseware_editor', row.id, '编辑课件') }} v-show={this.editable}>编辑</button>
                  <button class="redText-btn" onClick={() => { this.isremove(row) }} v-show={this.editable}>删除</button>
                </span>
              </div>
            )
          }
        }
      ]
    }
  },
  watch: {
    teacher_course_id (n, o) {
      this.getData(true)
    }
  },
  methods: {
    uploadVideo (res) { // 上传录制视频
      if (res.code === 200) {
        this.$Message.success(res.message)
        this.getData()
      } else {
        this.$Message.error(res.message)
      }
    },
    formatError () {
      this.$Notice.warning({
        title: '格式错误',
        desc: '文件格式错误，仅支持mp4，avi，rmvb，swf，Ogg',
        druation: 0
      })
    },
    closeVedioModal () {
      this.modal3 = false
      this.getData()
    },
    getData (isSearch) {
      if (!this.teacher_course_id) return
      if (isSearch) this.page = 1
      this.loading = true
      this.axios.request({
        url: '/index.php/Teacher/Courseware/index',
        method: 'get',
        params: {
          page: this.page,
          keyword: this.keyword,
          teacher_course_id: this.teacher_course_id,
          release_status: this.release_status
        }
      }).then(res => {
        if (res.code === 200) {
          this.list = res.data.courseware_list
          this.total = res.data.pages * this.page_size
          this.class_list = res.data.class_list ? res.data.class_list : []
          this.course_status = res.data.course_status
        }
        this.loading = false
      })
    },
    handleBindClass (status, class_id, class_name, row) {
      if (status) { // 绑定
        this.axios.request({
          method: 'post',
          url: '/index.php/Teacher/Timetable/bind_class',
          data: {
            courseware_id: row.id,
            class_id: class_id
          }
        }).then(res => {
          if (res.code === 200) {
            row.class_list.push({
              class_id,
              class_name,
              courseware_id: row.id,
              timetable_id: res.data.timetable_id
            })
            this.$Message.success(res.message)
          }
        })
      } else { // 解绑
        let timetable = row.class_list.find((element) => (element.class_id === class_id))
        let index = row.class_list.findIndex((element) => (element.class_id === class_id))
        this.axios.request({
          method: 'post',
          url: '/index.php/Teacher/Timetable/undo_class',
          data: {
            timetable_id: timetable.timetable_id
          }
        }).then(res => {
          if (res.code === 200) {
            row.class_list.splice(index, 1)
            this.$Message.success(res.message)
          }
        })
      }
    },
    multipleRelease (item, type) { // 批量发布撤回 1:发布， 0:撤回
      let timetable_ids = item.class_list.map(el => { return el.timetable_id })
      if (type === 0) {
        this.$Modal.confirm({
          title: '确定全部撤回吗？',
          onOk: () => {
            this.release(timetable_ids, type)
          }
        })
      } else {
        this.release(timetable_ids, type)
      }
    },
    release (timetable_ids, type) { // 发布撤回  1:发布， 0:撤回
      this.axios.request({
        method: 'post',
        url: '/index.php/Teacher/Timetable/release',
        data: {
          timetable_ids,
          release_status: type,
          teacher_course_id: this.teacher_course_id
        }
      }).then(res => {
        if (res.code === 200) {
          this.$Message.success(res.message)
          this.getData()
        }
      })
    },
    showAddCourseware (timetable_id, target_id, action_type, courseware_id, teacher_course_id, type, courseware_name) {
      this.$emit('showAddCourseware', timetable_id, target_id, action_type, courseware_id, teacher_course_id, type, courseware_name)
    },
    isremove (row) {
      let remove_list = []
      remove_list.push(row.id)
      this.$Modal.confirm({
        title: '确定全部删除吗？',
        onOk: () => {
          this.remove(remove_list)
        }
      })
    },
    remove (remove_list) {
      this.axios.request({
        method: 'post',
        url: '/index.php/Teacher/Courseware/delete',
        data: {
          id: remove_list
        }
      }).then(res => {
        if (res.code === 200) {
          this.$Message.success('删除成功')
          this.getData(true)
        }
      })
    }
  },
  mounted () {
    this.getData(true)
    this.columns = this.editable ? this.columns.filter((item) => { return (typeof item.showInEdit === 'undefined' || item.showInEdit === true) })
      : this.columns.filter((item) => { return (typeof item.showInEdit === 'undefined' || item.showInEdit === false) })
    if (this.editable === false) this.columns.splice(3, 1)
  }
}
</script>
<style lang="less">
.table-item{
  .item{
    padding: 5px;
    cursor: pointer;
    &:hover{
      background: #f5f5f5
    }
    span{
      white-space:nowrap;
      text-overflow: ellipsis;
    }
  }
  .item+.item{
    border-top: 1px solid #E8EAEC;
  }
  .disable{
    cursor: default;
  }
  :last-child{
    border-bottom: none;
  }
  .table-item-option{
    span{
      padding: 5px;
      color: #666666;
    }
  }
}
.action-item button{
  margin: 0 10px;
}
td+.my-table-cell{
   padding: 0px!important;
  .ivu-table-cell{
    padding: 0px!important;
  }
}
.courseware_list_modal .ivu-modal-wrap{
  z-index: 3000!important;
}
.courseware_list_modal2 .ivu-modal-mask{
  z-index: 3000!important;
}
</style>
