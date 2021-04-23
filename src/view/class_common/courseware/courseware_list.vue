<template>
  <Row style="padding:20px 10px;background:#ffffff;height:100%">
    <div class="courseware_list_table_parent">
      <Table class="courseware_list_table c_list" size="large" :loading="loading" ref="selection" :columns="columns"
        :data="list">
        >
      </Table>
    </div>
    <Modal v-model="livemodel" width='230' footer-hide @on-cancel="cancel">
      <div style="height:100px;display: flex;font-size: 14px;">
        <span>
          <Spin fix v-if="loading_live">
            <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
            <div style="margin-top:5px">加载直播工具中...</div>
          </Spin>
        </span>
      </div>

    </Modal>
    <!-- <Modal class="liveT" v-model="modal" :title="title" :fullscreen="fullscreen" footer-hide :mask-closable='false'>
    <Evaluate :student_courseware_id="target_id" :mode="mode" v-if="target==='evaluate'" @success="handleSuccess"></Evaluate>
  </Modal> -->
    <Modal v-model="modal2" width='1000' class="homeworkModal" :title="title" :fullscreen="fullscreen" footer-hide
      :mask-closable='false'>
      <Homework @closeModal='closeModal' :exam_score_status="exam_score_status"
        :student_homework_id="student_homework_id" v-if="target === 'homework'" @success="handleSuccess"></Homework>
    </Modal>
    <Modal v-model="modal3" title="视频录制" :width="1100" footer-hide :mask-closable='false' fullscreen>
      <coursewareVedio :vedioSrc="vedioSrc" :vedioName="vedioName" :upload_courseware_id="upload_courseware_id"
        v-if="modal3">
      </coursewareVedio>
    </Modal>
  </Row>
</template>
<script>
// import Evaluate from '@/view/class_common/courseware/evaluate'
import modal_mixin from '@/view/mixins/modal_mixin'
import Homework from '@/view/class_common/homework/homework'
import coursewareVedio from '@/view/teacher_common/courseware/courseware_vedio.vue'
import { getLoginExe } from '@/api/user'
export default {
  components: {
    // Evaluate,
    Homework,
    coursewareVedio
  },
  props: {
    type: '' // '':全部 1:未开始 2:直播中,已结束
  },
  computed: {
    courseId () {
      return this.$store.state.user.courseData.student_course_id
    }
  },
  mixins: [modal_mixin],
  data () {
    return {
      // title: '',
      // target: '',
      timer: null,
      upload_courseware_id: '',
      vedioName: '',
      vedioSrc: '',
      modal3: false,
      modal2: false,
      livemodel: false,
      imgName: '', // 预览媒体的name
      mediaType: '', // 预览媒体的类型
      loading: false,
      loading_live: false,
      keyword: '',
      homeworkList: [],
      exam_score_status: '',
      student_homework_id: '',
      target: '',
      sortType: 'create_at',
      sortOrder: 'desc',
      list: [],
      mode: 'pdf',
      // modal: false,
      student_courseware_id: '',
      searchTypeList: [
        {
          value: 0,
          label: '课件名称'
        }
      ],
      columns: [
        {
          title: '课件',
          key: 'courseware_name',
          align: 'center',
          width: 450,
          render: (h, params) => {
            return (
              <div>
                <p>第{params.row.sort}课时：{params.row.courseware_name}</p>
              </div>
            )
          }
        },
        {
          title: '上课时间',
          key: '',
          align: 'center',

          minWidth: 250,
          render: (h, params) => {
            return (
              <div>
                <span>{params.row.class_time}</span>
              </div>
            )
          }
        },
        {
          title: '状态',
          width: 150,
          align: 'center',
          key: '',
          render: (h, params) => {
            let status = params.row.live_status
            if (status === 0) {
              return h('span', { class: 'gray-cA' }, '未开启')
            } else if (status === 1) {
              return h('span', { class: 'red-c' }, '上课中')
            } else if (status === 3) {
              return h('span', { class: 'red-c' }, '直播中')
            } else if (status === 2) {
              return h('Poptip', {
                props: {
                  placement: 'bottom'
                }
              }, [
                h('button', {
                  class: 'blackBorderA-btn',
                  on: {
                    click: () => {
                      this.upload_courseware_id = params.row.id
                    }
                  }
                }, '课堂回顾'),
                h('div', {
                  slot: 'content'
                }, [
                  params.row.video_list.map((item, index) => {
                    return h('div', {}, [
                      h('div', {
                        class: 'homeWorkItem',
                        on: {
                          click: () => {
                            this.vedioSrc = item.url
                            this.vedioName = item.file_name
                            this.modal3 = true
                          }
                        }
                      }, item.file_name)
                    ]
                    )
                  })
                ]
                )
              ])
            }
          }
        },
        {
          title: '任务',
          width: 150,
          align: 'center',
          key: '',
          render: (h, params) => {
            return h('Poptip', {
              props: {
                placement: 'bottom-start'
              }
            }, [
              h('button', {
                class: 'blackBorderA-btn',
                on: {
                  click: () => {
                    this.getHomework(params.row.id)
                  }
                }
              }, '我的作业'),
              h('div', {
                slot: 'content'
              }, [
                this.homeworkList.map((item, index) => {
                  return h('div', {}, [
                    h('div', {
                      class: 'homeWorkItem',
                      on: {
                        click: () => {
                          this.showHomework(item)
                        }
                      }
                    }, item.homework_name)
                  ]
                  )
                })
              ]
              )
            ])
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 290,
          align: 'center',
          render: (h, params) => {
            let status = params.row.live_status
            console.log(status);

            if (status === 1) {
              return (
                <div>
                  <button class="blueText-btn"

                    onClick={() => { this.$router.push({ path: '/live_student', query: { student_courseware_id: params.row.student_courseware_id, mode: params.row.live_status === 3 ? 'live' : 'pdf' } }) }}
                  >
                    {'进入'}
                  </button>
                </div>
              )
            } else if (status == 0 || status == 2) {
              return (
                <div>
                  <button style="margin-right:10px" class="blueText-btn"
                    onClick={() => { this.$router.push({ path: '/live_student', query: { student_courseware_id: params.row.student_courseware_id, mode: 'pdf' } }) }}
                  >
                    {'pdf课件'}
                  </button>
                </div>
                // <Button size="small" type="default"
                //     onClick={() => { this.open('evaluate', params.row.student_courseware_id, `课件评价 > ${params.row.courseware_name}`, 600) }}
                //     v-show={status === 2}
                //   >
                // 评价
                // </Button>
              )
            } else if (status === 3) {
              return (
                <div>
                  <button class="blueText-btn"
                    onClick={() => { this.getloginexe(params) }}
                  >
                    {'进入'}
                  </button>
                </div>
              )
            }

          }
        }
      ]
    }
  },
  watch: {
    courseId (n, o) {
      this.getData(true)
    }
  },
  methods: {
    cancel () {
      clearInterval(this.timer)
    },
    getloginexe (params) {
      let id = this.$store.state.user.userInfo.schoolId
      let userType = this.$store.state.user.userInfo.userType
      let account = this.$store.state.user.userInfo.account
      let data = {
        class_type: '1',
        is_class: account + '_' + userType + '_' + id
      }
      getLoginExe(data).then(res => {
        console.log(res);
        this.loading_live = true
        if (res.data.login_status === false) {
          this.$Message.success('需要开启直播工具才能进直播间！');
          this.livemodel = true
          this.timer = setInterval(() => {
            getLoginExe(data).then(res => {
              if (res.data.login_status === false) {
              } else {
                console.log(77);
                this.$router.push({ path: '/live_student', query: { student_courseware_id: params.row.student_courseware_id, mode: params.row.live_status === 3 ? 'live' : 'pdf' } })
                this.loading_live = false
                clearInterval(this.timer)
                // this.$router.push({ path: '/live_teacher', query: { courseware_id: this.courseware_id, class_id: this.class_id, live_status: this.live_status, course_status: this.course_status } })
              }
            })
          }, 5000)
        } else {
          this.loading_live = false
          clearInterval(this.timer)
          this.$router.push({ path: '/live_student', query: { student_courseware_id: params.row.student_courseware_id, mode: params.row.live_status === 3 ? 'live' : 'pdf' } })
        }
      })

    },
    getData (isSearch) {
      let _this = this
      _this.loading = true
      _this.axios.request({
        url: '/index.php/Student/Courseware/page',
        method: 'get',
        params: {
          page_size: 10000,
          page_no: 1,
          student_course_id: _this.courseId
        }
      }).then(res => {
        if (res.code === 200) {
          let data = res.data
          this.list = data.list
        }
        _this.loading = false
      })
    },
    getHomework (r) {
      this.axios.request({
        url: '/index.php/Student/Homework/page',
        method: 'get',
        params: {
          page_size: 100000,
          page_no: 1,
          courseware_id: r,
          score_status: -1
        }
      }).then(res => {
        if (res.code === 200) {
          let data = res.data
          this.homeworkList = data.list
        }
      })
    },
    showHomework (item) {
      this.exam_score_status = item.score_status
      this.student_homework_id = item.id
      this.target = 'homework'
      this.modal2 = true
    },
    closeModal () {
      this.modal2 = false
    },
    // open (target, target_id, title) {
    //   this.modal = true
    //   this.target = target
    //   this.title = title
    //   this.student_courseware_id = target_id
    // },
    handleSuccess () {
      this.modal = false
      this.target = ''
    }
  },
  mounted () {
    this.getData()
  },
  destroyed () {
    clearInterval(this.timer)
  }
}
</script>

<style lang="less">
.demo-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}
// .ivu-modal-body{
//   border:15px solid rgb(255, 255, 255);
//   background:  rgb(244, 245, 249)
// }
.liveT .ivu-modal-header {
  background-color: #242424;
}
.liveT .ivu-modal-header .ivu-modal-header-inner {
  color: #ffffff;
}
.c_list .ivu-table-cell > div {
  position: relative;
  margin: 0 auto;
}
.c_list .ivu-table-cell {
  overflow: initial;
}
.c_list .ivu-table-cell p {
  padding-left: 140px;
  text-align: left;
}
.homeWorkItem {
  text-align: left;
  padding: 4px 0;
  width: 120px;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.homeWorkItem:hover {
  color: #3b9bff;
}
.homeworkModal .ivu-modal-body {
  height: 700px;
}
</style>
