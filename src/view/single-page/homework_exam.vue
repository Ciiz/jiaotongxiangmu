<template>
  <div style="height:100%;background:#f2f2f2;padding:20px 20px 0 20px;overflow-y:scroll;">
    <div style="width:100%;height:100%;position:relative;display:flex;">
      <div style="width:100%;height:100%" class="homework-exam-modal">
        <Homework @closeModal='closeModal' :submit_status="submit_status" :student_homework_id="student_homework_id"
          v-if="target === 'homework'" @success="handleSuccess"></Homework>
        <Exam @closeModal='closeModal' :student_exam_id="student_exam_id" :sty="sty" v-if="target === 'exam'"
          @success="handleSuccess"></Exam>
      </div>
      <div class="correct_newLeftStudent">
        <ul>
          <li v-for="(v,i) in my_course_list" :key="i" @click="handle_click(v,i)"
            :class="{active_color_index:active_index==i}">
            {{v.course_name}}
          </li>
        </ul>
      </div>
      <div style="width:100%;height:100%;display:flex;flex-direction:column">
        <div class="correct-iscorrect">
          <span style="background:#1170FF;color:#FFFFFF" v-if="submit_status===0">未作答</span>
          <span style="background:#ffffff" v-if="submit_status===0" @click="submit_status=1;getData()">已完成</span>
          <span style="background:#ffffff" v-if="submit_status===1" @click="submit_status=0;getData()">未作答</span>
          <span style="background:#1170FF;color:#FFFFFF" v-if="submit_status===1">已完成</span>
        </div>
        <div style="width:100%;height:100%;position:relative">
          <div class="correct-list">
            <Spin v-show="loading" fix></Spin>
            <div v-show="submit_status===0" style="height:100%;display:flex;flex-direction:column">
              <Tabs size="small" @on-click="getData" class="correct-tab" style="flex:1" v-model="tabS" value="task"
                v-if="submit_status===0">
                <TabPane label="作业" name="homework">
                  <div v-if="Object.keys(homeworkList).length===0" style="padding:10px;font-size:16px">暂无内容！</div>
                  <ul class="correct-list">
                    <li v-for="(item,index) in homeworkList" :key="index" style="width:20%;margin:10px 0">
                      <div class="showdetail" @click="openHomework(item.id)">
                        <div class="correct-sjx" style="border-top:40px solid #33CCCC"></div>
                        <div class="correct-sjx-xz">作业</div>
                        <div class="cname" v-if="item.homework_name===''">&nbsp</div>
                        <div class="cname" v-else>{{item.homework_name}}</div>
                        <div class="ccourse">课程：{{item.course_name}}</div>
                        <div class="cclass">
                          <span v-if="item.score_status===0" style="color: #FF3230">老师正在批改中...</span>
                          <span v-if="item.score_status===1" style="color: green">已评分</span>
                        </div>
                      </div>
                      <span
                        style="margin-left:20px">截止时间：{{moment(item.end_time * 1000).format('YYYY-MM-DD HH:mm')}}</span>
                    </li>
                  </ul>
                </TabPane>
                <TabPane label="测试" name="exam">
                  <div v-if="Object.keys(examlist).length===0" style="padding:10px;font-size:16px">暂无内容！</div>
                  <ul class="correct-list">
                    <li v-for="(item,index) in examlist" :key="index" style="width:20%;margin:10px 0">
                      <div class="showdetail" @click="showE(item)">
                        <div class="correct-sjx" style="border-top:40px solid #FF3333"></div>
                        <div class="correct-sjx-xz">测试</div>
                        <div class="cname" v-if="item.exam_name===''">&nbsp</div>
                        <div class="cname" v-else>{{item.exam_name}}</div>
                        <div class="ccourse">课程：{{item.course_name}}</div>
                        <div class="cclass">
                          <span v-if="item.score_status===0" style="color: #FF3230">老师正在批改中...</span>
                          <span v-if="item.score_status===1" style="color: green">已评分</span>
                        </div>
                      </div>
                      <span
                        style="margin-left:20px">截止时间：{{moment(item.end_time * 1000).format('YYYY-MM-DD HH:mm')}}</span>
                    </li>
                  </ul>
                </TabPane>
                <Spin fix v-show="loading"></Spin>
              </Tabs>
            </div>
            <div v-show="submit_status===1" style="height:100%;display:flex;flex-direction:column">
              <Row type="flex" justify="space-between" class="correct-select">
                <Col>
                <Input class="new-searchSel" v-model="keyword" placeholder="请输入课业关键词" style="width:240px;" />
                <button class="orangeRBorder-btn" style="transform:translate(-20px,2px)" @click="getData()">搜索</button>
                </Col>
              </Row>
              <Tabs size="small" @on-click="getData" class="correct-tab" style="flex:1" v-model="tabS" value="task"
                v-if="submit_status===1">
                <TabPane label="作业" name="homework">
                  <div v-if="Object.keys(homeworkList).length===0" style="padding:10px;font-size:16px">暂无内容！</div>
                  <ul class="correct-list">
                    <li v-for="(item,index) in homeworkList" :key="index" style="width:20%;margin:10px 0">
                      <div class="showdetail" @click="openHomework(item.id)">
                        <div class="correct-sjx" style="border-top:40px solid #33CCCC"></div>
                        <div class="correct-sjx-xz">作业</div>
                        <div class="cname" v-if="item.homework_name===''">&nbsp</div>
                        <div class="cname" v-else>{{item.homework_name}}</div>
                        <div class="ccourse">课程：{{item.course_name}}</div>
                        <div class="cclass">
                          <span v-if="item.score_status===0" style="color: #FF3230">老师正在批改中...</span>
                          <span v-if="item.score_status===1" style="color: green">已评分</span>
                        </div>
                      </div>
                      <span
                        style="margin-left:20px">截止时间：{{moment(item.end_time * 1000).format('YYYY-MM-DD HH:mm')}}</span>
                    </li>
                  </ul>
                </TabPane>
                <TabPane label="测试" name="exam">
                  <div v-if="Object.keys(examlist).length===0" style="padding:10px;font-size:16px">暂无内容！</div>
                  <ul class="correct-list">
                    <li v-for="(item,index) in examlist" :key="index" style="width:20%;margin:10px 0">
                      <div class="showdetail" @click="showE(item)">
                        <div class="correct-sjx" style="border-top:40px solid #FF3333"></div>
                        <div class="correct-sjx-xz">测试</div>
                        <div class="cname" v-if="item.exam_name===''">&nbsp</div>
                        <div class="cname" v-else>{{item.exam_name}}</div>
                        <div class="ccourse">课程：{{item.course_name}}</div>
                        <div class="cclass">
                          <span v-if="item.score_status===0" style="color: #FF3230">老师正在批改中...</span>
                          <span v-if="item.score_status===1" style="color: green">已评分</span>
                        </div>
                      </div>
                      <span
                        style="margin-left:20px">截止时间：{{moment(item.end_time * 1000).format('YYYY-MM-DD HH:mm')}}</span>
                    </li>
                  </ul>
                </TabPane>
                <Spin fix v-show="loading"> </Spin>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

    </div>
    <Modal v-model="modal1" width="400" title="提示" ok-text="我知道了，开始考试" cancel-text="好的，先等等"
      @on-ok="showExam(exam_item)">
      <div style="text-align:center;font-size:14px">测试需知：</div>
      <div style="text-align:center;font-size:14px">“本次测试时长为90分钟，倒计时结束后将会自动交卷；请确保在时间充足和网络稳定的环境下完成”</div>
      <div style="text-align:center;font-size:14px;margin-top:10px">若中途因意外退出，请尽快重连！</div>
    </Modal>
  </div>
</template>
<script>
import { my_course } from '@/api/student'
import Exam from '@/view/class_common/exam/exam'
// import ExamEvaluate from '@/view/class_common/exam/evaluate'
import Homework from '@/view/class_common/homework/homework'
export default {
  components: {
    Exam,
    Homework
  },
  data () {
    return {
      loading: false,
      tabS: 'homework',
      keyword: '',
      exam_item: '',
      modal1: false,
      tab_target: 'before',
      tab_target1: 'homework',
      student_course_list: '',
      submit_status: 0,
      score_status: 0,
      homeworkList: [],
      target: '',
      title: '',
      student_exam_id: '',
      student_homework_id: '',
      examlist: [],
      sty: '',
      my_course_list: [],
      active_index: null

    }
  },
  props: {
    toCorrectType: '',
    toCorrectId: ''
  },
  methods: {
    async handle_click (v, i) {
      this.active_index = i
      let res = await this.axios.request({
        url: '/index.php/Student/Homework/page',
        method: 'get',
        params: {
          keyword: this.keyword,
          page_size: 100000,
          page_no: 1,
          score_status: -1,
          submit_status: this.submit_status,
          teacher_course_id: v.teacher_course_id
        }
      })
      this.homeworkList = res.data.list
      let res2 = await this.axios.request({
        url: '/index.php/Student/Exam/page',
        method: 'get',
        params: {
          keyword: this.keyword,
          page_size: 10000,
          page_no: 1,
          submit_status: this.submit_status,
          teacher_course_id: v.teacher_course_id
        }
      })
      this.examlist = res2.data.list
    },
    async get_my_course () {
      let res = await my_course({
        page_size: 1000,
        page_no: 1
      })
      this.my_course_list = res.data.list

    },
    getData () {
      console.log(this.tabS);
      if (this.tabS === 'homework') {
        this.getHomework()
      } else if (this.tabS === 'exam') {
        this.getExam()
      }
    },
    getHomework () {
      this.loading = true
      this.axios.request({
        url: '/index.php/Student/Homework/page',
        method: 'get',
        params: {
          // keyword: this.keyword,
          page_size: 100000,
          page_no: 1,
          score_status: -1,
          submit_status: this.submit_status
        }
      }).then(res => {
        console.log(res);
        if (res.code === 200) {
          this.homeworkList = res.data.list
        }
        this.loading = false
      })
    },
    getExam () {
      this.loading = true
      this.axios.request({
        url: '/index.php/Student/Exam/page',
        method: 'get',
        params: {
          keyword: this.keyword,
          page_size: 10000,
          page_no: 1,
          submit_status: this.submit_status
        }
      }).then(res => {
        console.log(res);
        if (res.code === 200) {
          let data = res.data
          this.examlist = data.list
        }
        this.loading = false
      })
    },
    showE (item) {
      if (item.submit_status === 0) {
        this.modal1 = true
        this.exam_item = item
      } else {
        this.showExam(item)
      }
    },
    openExam (target_id) {
      document.getElementsByClassName('homework-exam-modal')[0].style.display = 'block'
      this.target = 'exam'
      this.student_exam_id = target_id
      this.$emit('unshowTab', 'none')
    },
    openHomework (i) {
      this.student_homework_id = i
      document.getElementsByClassName('homework-exam-modal')[0].style.display = 'block'
      this.target = 'homework'
      this.$emit('unshowTab', 'none')
    },
    handleSuccess () {
      document.getElementsByClassName('homework-exam-modal')[0].style.display = 'none'
      this.$emit('unshowTab', 'block')
      this.getHomework()
      this.getExam()
    },
    showExam (exam) {
      document.getElementsByClassName('homework-exam-modal')[0].style.display = 'block'
      if (exam.status === 0) { // 未考试的话。进去考试详情之前要发请求修改考试状态
        this.axios.request({
          method: 'post',
          url: '/index.php/Student/Exam/start_exam',
          data: {
            student_exam_id: exam.id
          }
        }).then(res => {
          if (res.code === 200) {
            exam.status = 1
            this.sty = 0
            this.openExam(exam.id)
          }
        })
      } else if (exam.status === 3) {
        this.openExam(exam.id)
        this.sty = 3
      } else {
        this.sty = exam.status
        this.openExam(exam.id)
      }
    },
    closeModal () {
      document.getElementsByClassName('homework-exam-modal')[0].style.display = 'none'
      this.$emit('unshowTab', 'block')
    }
  },
  mounted () {
    this.getHomework()
    this.getExam()
    this.get_my_course()
    this.$nextTick(() => {
      if (this.toCorrectType && this.toCorrectId) {
        if (this.toCorrectType === 'homework') {
          this.openHomework(this.toCorrectId)
        } else if (this.toCorrectType === 'exam') {
          this.axios.request({
            method: 'get',
            url: `/index.php/Student/Exam/detail`,
            params: {
              student_exam_id: this.toCorrectId
            }
          }).then(res => {
            let data = res.data
            if (res.code === 200) {
              let a = data.student_exam.exam_status
              let item = { status: data.exam_status_data.status, id: data.student_exam.id }
              if (a < 2) {
                this.modal1 = true
                this.exam_item = item
              } else {
                this.showExam(item)
              }
            }
          })
        }
      }
    })
  }
}
</script>
<style>
.homework-exam-modal {
  display: none;
  z-index: 100;
  position: absolute;
  background: #f2f2f2;
}
.active_color_index {
  background-color: #1170ff;
  color: #fff !important;
  border-radius: 5px;
}
</style>
