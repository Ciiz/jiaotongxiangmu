<template>
  <div style="height:100%;padding-bottom:20px;display:flex;flex-direction: column;">
    <Row style="padding-bottom:10px" type="flex" justify="space-between">
      <Col>
      <button class="blue-btn" v-if="sty===2||sty===3||sty===4" @click="ok">返回</button>
      </Col>
      <Col>
      <span class="student-exam-remainTime" v-if="exam_status.status === 1">
        剩余时间: <span style="color:#EE3333">{{remainTime}}分钟</span>
      </span>
      <span class="student-exam-remainTime">{{exam_status.status_str}}</span>
      <button class="blue-btn" @click="submit(2)" v-show="canSubmit" style="margin-left:20px">交卷</button>
      </Col>
    </Row>
    <Row class="studentExam">
      <Col style="width:52%;margin-right:20px;display:flex;flex-direction:column">
      <div class="studentExam-l-t">
        <div class="studentExam-l-t-h">
          <div>
            <span class="studentHomework-black-font">{{student_exam.exam.exam_name}}</span>
          </div>
          <div>
            <span>满分：{{student_exam.total_score}}分</span>
            <span style="margin-left:20px">考试时长：{{student_exam.exam.exam_time}}分钟</span>
          </div>
        </div>
        <div>所属课程：{{student_exam.exam.course_name}}
          {{student_exam.exam.type===1?'课前':(student_exam.exam.type===2?'课中':'课后')}}测试</div>
        <div>授课老师：{{student_exam.exam.teacher}}</div>
        <div>截止时间：{{moment(student_exam.exam_release.end_time * 1000).format('YYYY-MM-DD HH:mm:ss')}}</div>
        <div class="studentExam-t-score" v-if="sty===3">{{student_exam.user_total_score}}分</div>
      </div>
      <div class="studentExam-l-b">
        <div class="studentExam-l-b-title">客观题</div>
        <div class="studentExam-l-b-contain" v-if="objectList.length>0">
          <div class="black-c">
            {{selectquestionIndex+1}}、[{{objectList[selectquestionIndex].object_type===1?'单选题':'多选题'}}]（{{objectList[selectquestionIndex].score}}分）
          </div>
          <p style="line-height:24px" class="black-c">{{objectList[selectquestionIndex].content}}</p>
          <!-- 0：未开始，1：考试中，2：已交卷，3：已批改 4:逾期 -->
          <CheckboxGroup class="studentExam-select-itemList" v-model="seletIn" v-if="sty===1||sty===0">
            <Checkbox v-for="(item,index) in changeOption(objectList[selectquestionIndex].option)" :key="index"
              :label="changeSel(index)">{{changeSel(index)+'.'+item}}</Checkbox>
          </CheckboxGroup>
          <CheckboxGroup class="studentExam-select-itemList" v-model="seletIn" v-if="sty===2||sty===4">
            <Checkbox v-for="(item,index) in changeOption(objectList[selectquestionIndex].option)" disabled :key="index"
              :label="changeSel(index)">{{changeSel(index)+'.'+item}}</Checkbox>
          </CheckboxGroup>
          <CheckboxGroup
            :class="changeAnwser(seletIn)===objectList[selectquestionIndex].answer?'right-checkbox':'error-checkbox'"
            class="studentExam-select-itemList" v-model="seletIn" v-if="sty===3">
            <Checkbox v-for="(item,index) in changeOption(objectList[selectquestionIndex].option)" disabled :key="index"
              :label="changeSel(index)">{{changeSel(index)+'.'+item}}</Checkbox>
          </CheckboxGroup>
          <div class="blue-c" v-if="sty===3" style="font-size:18px;margin-left:20px">
            正确答案：{{objectList[selectquestionIndex].answer}}</div>
          <div class="studentExam-l-b-contain-button">
            <button class="blueC-btn" @click="changeSelectQuestion(selectquestionIndex+1)">下一题</button>
            <button class="blue-btn" @click="changeSelectQuestion(selectquestionIndex-1)">上一题</button>
          </div>
        </div>
        <div class="studentExam-l-b-footer">
          <ul class="question-index">
            <li v-if="sty!==3"
              :class="objectList[index].student_answer.content===''?(selectquestionIndex===index?'inpage':'unpage'):'ispage'"
              v-for="(item,index) in objectList" :key="index" @click="changeSelectQuestion(index,$event)">{{index+1}}
            </li>
            <li v-if="sty===3" :class="objectList[index].student_answer.score!==0?'ispage':'errpage'"
              v-for="(item,index) in objectList" :key="index" @click="changeSelectQuestion(index,$event)">{{index+1}}
            </li>
          </ul>
        </div>
      </div>
      </Col>
      <Col class="studentExam-r" style="flex:1">
      <div class="studentExam-l-b-title">主观题</div>
      <div>
        <div style="margin-bottom:20px" v-for="(item,index) in subjectList" :key="index">
          <div class="black-c">{{index+1}}、[{{getMainQuestionType(item.subject_type)}}]（{{item.score}}分）</div>
          <p style="line-height:24px;margin-bottom:10px" class="black-c">{{item.content}}</p>
          <b>作答：</b>
          <Input v-if="sty===2||sty===3||sty===4" type="textarea" :rows="4" v-model="item.student_answer.content"
            disabled />
          <Input v-if="sty===1||sty===0" type="textarea" :rows="4" v-model="item.student_answer.content" />
          <div class="main-scroe" v-if="sty===3">本题得分：{{item.student_answer.score}}</div>
          <div style="clear:both"></div>
        </div>
      </div>
      </Col>
    </Row>
    <Spin size="large" v-if="loading" fix></Spin>
  </div>
</template>
<script>
import { setTimeout } from 'timers'
export default {
  components: {
  },
  props: {
    student_exam_id: '',
    examId: {},
    sty: ''
  },
  data () {
    return {
      seletIn: [], // 选择的选项
      selectquestionIndex: 0, // 当前选择题为第几题
      objectList: [],
      subjectList: [],
      loading: false,
      student_exam: {
        sub_content: '',
        exam: { exam_name: '' }
      },
      editor_init: true,
      exam_status: {},
      objArr: [],
      answerList: ['A', 'B', 'C', 'D'],
      canSave: false,
      canSubmit: false,
      nowtimgstamp: Math.ceil((new Date()).getTime() / 1000),
      interval: ''
    }
  },
  computed: {
    remainTime () {
      return Math.floor((this.student_exam.exam_begin_time + this.student_exam.exam.exam_time * 60 - this.nowtimgstamp) / 60)
    }
  },
  watch: {
    student_exam_id (newVal, oldVal) {
      this.getExam()
    },
    subjectList: {
      handler (newValue, oldValue) {
        this.changeSelectQuestion(this.selectquestionIndex, '', 1)
      },
      deep: true
    }
  },
  filters: {
    dealFileUrl (val) {
      let arr = val.split('/')
      return arr[arr.length - 1]
    }
  },
  methods: {
    changeAnwser (item) {
      let a = ''
      for (let i = 0; i < item.length - 1; i++) {
        a = a + item[i] + ','
      }
      a = a + item[this.seletIn.length - 1]
      return a
    },
    getExam () {
      console.log(this.student_exam_id);
      this.objectList = []
      this.subjectList = []
      if (!this.student_exam_id) return
      let hs
      if (this.sty === 3 || this.sty === 2) {
        hs = 1
      } else {
        hs = 0
      }
      let _this = this
      _this.loading = true
      _this.editor_init = true
      // console.log(_this.examId.exam_release_id);

      if (_this.examId.exam_release_id) {
        // console.log(_this.examId);
        _this.axios.request({
          method: 'post',
          url: `/index.php/Student/Exam/live_exam_detail`,
          data: {
            student_id: _this.examId.student_id,
            exam_release_id: _this.examId.exam_release_id,
            hasAnswer: hs
          }
        }).then(res => {
          console.log(res);
          // this.student_exam_id = _this.examId.exam_release_id
          _this.loading = false
          let data = res.data
          if (res.code === 200) {
            _this.student_exam = data.student_exam
            _this.exam_status = data.exam_status_data
            this.sty = data.exam_status_data.status
            _this.getObjectList(data.student_exam.object)
            _this.getSubjectList(data.student_exam.subject)
            // // 状态是未开始就发送开始考试请求
            // // 先判断考试进行状态,可以提交状态就显示交卷按钮，考试中就显示保存
            _this.dealExamStatus(_this.exam_status.status)
            _this.timeInterval()
            _this.$emit("name", data.student_exam.exam.exam_name)
          }
        })
      } else {
        _this.axios.request({
          method: 'get',
          url: `/index.php/Student/Exam/detail`,
          params: {
            student_exam_id: _this.student_exam_id,
            hasAnswer: hs
          }
        }).then(res => {
          _this.loading = false
          let data = res.data

          if (res.code === 200) {
            _this.student_exam = data.student_exam
            _this.exam_status = data.exam_status_data
            _this.getObjectList(data.student_exam.object)
            _this.getSubjectList(data.student_exam.subject)
            // // 状态是未开始就发送开始考试请求
            // // 先判断考试进行状态,可以提交状态就显示交卷按钮，考试中就显示保存
            _this.dealExamStatus(_this.exam_status.status)
            _this.timeInterval()
          }
        })
      }

    },
    getObjectList (item) { // 处理客观题
      if (item.single.length !== 0) {
        for (let i = 0; i < item.single.length; i++) {
          this.objectList.push(item.single[i])
        }
      }
      if (item.multiple_choice.length !== 0) {
        for (let i = 0; i < item.multiple_choice.length; i++) {
          this.objectList.push(item.multiple_choice[i])
        }
      }
      if (this.objectList.length !== 0) {
        if (this.objectList[this.selectquestionIndex].student_answer.content !== '') {
          this.seletIn = this.objectList[this.selectquestionIndex].student_answer.content.split(',')
        } else {
          this.seletIn = []
        }
      }
    },
    getSubjectList (item) { // 处理主观题
      if (item.argumentation.length !== 0) {
        for (let i = 0; i < item.argumentation.length; i++) {
          this.subjectList.push(item.argumentation[i])
        }
      }
      if (item.composition_questions.length !== 0) {
        for (let i = 0; i < item.composition_questions.length; i++) {
          this.subjectList.push(item.composition_questions[i])
        }
      }
      if (item.practical_questions.length !== 0) {
        for (let i = 0; i < item.practical_questions.length; i++) {
          this.subjectList.push(item.practical_questions[i])
        }
      }
      if (item.short_answer_questions.length !== 0) {
        for (let i = 0; i < item.short_answer_questions.length; i++) {
          this.subjectList.push(item.short_answer_questions[i])
        }
      }
    },
    changeSelectQuestion (index, e, l) { // 切换选择题
      if (index < 0) {
        if (l !== 1) {
          this.$Message.error('前面没有题目了')
        }
      } else if (index >= this.objectList.length) {
        if (l !== 1) {
          this.$Message.error('后面没有题目了')
        }
      } else {
        let a = ''
        if (this.seletIn.length > 0) {
          for (let i = 0; i < this.seletIn.length - 1; i++) {
            a = a + this.seletIn[i] + ','
          }
          a = a + this.seletIn[this.seletIn.length - 1]
          this.objectList[this.selectquestionIndex].student_answer.content = a
        } else {
          // this.objectList[this.selectquestionIndex].student_answer.content = ''
        }
        this.selectquestionIndex = index
        if (this.objectList[this.selectquestionIndex].student_answer.content !== '') {
          this.seletIn = this.objectList[this.selectquestionIndex].student_answer.content.split(',')
        } else {
          this.seletIn = []
        }
      }
    },
    changeOption (a) {
      let b = a.split(',')
      return b
    },
    getMainQuestionType (i) {
      if (i === 1) {
        return '论述题'
      } else if (i === 2) {
        return '简答题'
      } else if (i === 3) {
        return '应用题'
      } else {
        return '作文题'
      }
    },
    changeSel (i) {
      if (i === 0) {
        return 'A'
      } else if (i === 1) {
        return 'B'
      } else if (i === 2) {
        return 'C'
      } else if (i === 3) {
        return 'D'
      } else if (i === 4) {
        return 'E'
      } else if (i === 5) {
        return 'F'
      }
    },
    timeInterval () {
      let _this = this
      if (_this.exam_status.status !== 1) {
        return
      }
      setTimeout(() => {
        this.interval = setInterval(() => {
          if (this.remainTime > 0) {
            _this.nowtimgstamp = Math.ceil((new Date()).getTime() / 1000)
          } else {
            _this.$Notice.warning({
              title: '考试时间到',
              desc: '自动交卷',
              druation: 0
            })
            _this.submit(1)
          }
        }, 1000)
      }, 2000)
    },
    dealExamStatus (status) {
      if (status === 1) { // 考试中才能操作
        this.canSave = true
        this.canSubmit = true
      }
    },
    // exam_status: 1:考试中，2：交卷
    submit (exam_status) {
      clearInterval(this.interval)
      if (this.objectList.length !== 0) {
        let a = ''
        if (this.seletIn.length > 0) {
          for (let i = 0; i < this.seletIn.length - 1; i++) {
            a = a + this.seletIn[i] + ','
          }
          a = a + this.seletIn[this.seletIn.length - 1]
          this.objectList[this.selectquestionIndex].student_answer.content = a
        } else {
          this.objectList[this.selectquestionIndex].student_answer.content = ''
        }
      }
      let _this = this
      let answer_arr = this.getAnswerArr(this.student_exam)
      _this.axios.request({
        method: 'post',
        url: '/index.php/Student/Exam/submitExam',
        data: {
          student_exam_id: this.student_exam_id,
          exam_status,
          answer_arr
        }
      }).then(res => {
        if (res.code === 200) {
          _this.$Message.success('提交成功!')
          _this.$emit('success')
        }
      })
    },
    getAnswerArr (student_exam) {
      let answer_arr = []
      if (this.objectList.length !== 0) {
        this.objectList.forEach(item => {
          let { content, examination_detail_id, student_examination_id, video_url } = item.student_answer
          answer_arr.push({
            content,
            examination_detail_id,
            student_examination_id,
            video_url,
            type: 'obj'
          })
        })
      }
      this.subjectList.forEach(item => {
        item.student_answer.type = 'subj'
        answer_arr.push(item.student_answer)
      })
      return answer_arr
    },
    ok () {
      this.$emit('closeModal')


    }
  },
  mounted () {


    this.getExam()
  },
  beforeDestroy () {
    clearInterval(this.interval)
  }
}
</script>
<style>
</style>
