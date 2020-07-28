<template>
  <div style="flex:1;display:flex;flex-direction:column;height:100%">
    <Row type="flex" class="addCourseware-contain">
      <Col style="width:300px" class="gray-c4 addCourseware-contain-l">
        <div style="font-size:16px;font-weight:bold">添加测试</div>
        <p v-if="!editable" style="color:red">*该任务有其他班级使用 或者 当前班级已发布，以下信息不可编辑</p>
        <div style="font-weight:bold">{{courseware_name}} {{type===1?'课前':(type===2?'课中':'课后')}}测试</div>
        <div>上课时间：<span class="blue-c">{{class_begin_time}}</span></div>
        <div>试卷标题：<Input type="text" v-model="exam.exam_name" :disabled="!editable" style="width:188px"/></div>
        <div>考试时长：<Input type="number" v-model="exam.exam_time" :disabled="!editable" style="width:92px"/> 分钟</div>
        <div>满&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;分：<Input type="number" :disabled="!editable" v-model="maxScore" style="width:92px"/> 分</div>
        <div>发布方式：
          <RadioGroup v-model="is_auto_release">
            <Radio :label="1" :disabled="!editable">自动发布</Radio>
            <Radio :label="0" :disabled="!editable">在课堂中手动发布</Radio>
          </RadioGroup>
        </div>
        <div style="margin-left:74px">
          <DatePicker
            transfer
            :disabled="!editable"
            @on-change="(fmt_date, date) => {start_time = fmt_date}"
            :value="start_time"
            type="datetime"
          ></DatePicker>
        </div>
        <div>
          截至时间：
           <DatePicker
          transfer
            :value="end_time"
            :disabled="!editable"
            @on-change="(fmt_date, date) => {end_time = fmt_date}"
            type="datetime"
          ></DatePicker>
        </div>
        <div class="addCourseware-contain-l-bottom">
          <div class="gray-c8">已设置分数</div>
          <div><span>{{totalScore}}</span><span>/{{maxScore}}</span></div>
        </div>
      </Col>
      <Col :span="8" class="addCourseware-contain-m">
        <Row type="flex" justify="space-between" class="addCourseware-contain-m-header">
          <Col>添加客观题</Col>
          <Col>已添加{{selectQuestionList.length}}题/{{selectquestionTotalscore}}分</Col>
        </Row>
        <div class="addCourseware-contain-m-contain">
          <Row type="flex" justify="space-between" style="margin-bottom:20px">
            <Col style="flex:1">
              <Row type="flex">
                <Col style="margin-right:20px">
                  <Select v-model="selectQuestionType" :disabled="!editable">
                    <Option v-for="item in selectQuestionTypeAll" :value="item.value" :key="item.item">{{item.item}}</Option>
                  </Select>
                </Col>
                <Col>
                  <Select v-model="selectQuestionScore" :disabled="!editable">
                    <Option v-for="item in score" :value="item.num" :key="item.num">{{item.num}}分</Option>
                  </Select>
                </Col>
              </Row>
            </Col>
            <Col>
              <button class="addCourseware-contain-m-contain-delete" v-show="editable" @click="deleteSelectQuestion()">删除</button>
            </Col>
          </Row>
          <Row type="flex">
            <Col style="margin-right:10px">{{selectquestionIndex+1}}</Col>
            <Col style="flex:1">
              <Input v-model="selectQuestionContain" :disabled="!editable" type="textarea" placeholder="在这里输入题目..." :rows="4"/>
            </Col>
          </Row>
          <Row type="flex" v-for="(item,index) in selectItem" :key="index">
            <Col style="line-height:26px;margin:0 10px 0 16px">{{item.item}}</Col>
            <Col style="flex:1" class="addCourseware-contain-m-selectItem">
              <Input type="text" :disabled="!editable" v-model="item.itemContain"/>
            </Col>
          </Row>
          <Row type="flex" justify="space-between">
            <Col>
              <span class="blue-c" style="margin-right:6px;line-height:28px;font-weight:bold;float:left">正确答案</span>
              <ul class="selectRight" v-if="editable">
                <li class="unselect" v-for="(item,index) in selectItem" :key="index" v-if="selectItem[index].itemContain!==''" @click="selectRightAnwser">{{item.item}}</li>
              </ul>
              <ul class="selectRight" v-if="!editable">
                <li class="unselect" v-for="(item,index) in selectItem" :key="index" v-if="selectItem[index].itemContain!==''">{{item.item}}</li>
              </ul>
            </Col>
            <Col><button class="addCourseware-contain-m-save-btn" v-show="editable" @click="addSelectQuestion">保存题目</button></Col>
          </Row>
        </div>
        <div class="addCourseware-contain-m-bottom">
          <!-- <div><button class="addCourseware-contain-m-select-btn">从题库选择</button></div> -->
          <div>
            <ul class="question-index">
              <li v-for="(item,index) in selectQuestionList.length+1" :key="index" :class="selectquestionIndex===index?'ispage':'unpage'" @click="changeSelectQuestion(index)">{{index+1}}</li>
            </ul>
          </div>
        </div>
      </Col>
      <Col class="addCourseware-contain-r">
        <Row type="flex" justify="space-between" class="addCourseware-contain-r-header">
          <Col>添加主观题</Col>
          <Col>已添加{{mainQuestionList.length}}题/{{mainquestionTotalscore}}分</Col>
        </Row>
        <div style="flex:1;display: flex;flex-direction: column;">
          <div style="flex:1;position:relative">
            <div class="ab-scroll">
              <Row class="mainquestion-div" type="flex" justify="space-between" v-for="(item,index) in mainQuestionList" :key="index">
                <Col>
                  <div class="black-c" style="font-weight:bold;margin-bottom:6px">{{index+1}}.{{getMainQuestionType(item.subject_type)}}（{{item.score}}分）</div>
                  <div class="black-c">{{item.content}}</div>
                </Col>
                <Col>
                  <button class="blueText-btn" style="margin-top:13px" v-show="editable" @click="changeMainQuestion(index)">编辑</button>
                  <button class="redText-btn" style="margin-top:13px;margin-left:20px" v-show="editable" @click="deleteMainQuestion(index)">删除</button>
                </Col>
              </Row>
            </div>
          </div>
          <div style="background:#F5F5F5;padding:20px 10px;margin:10px" v-show="isAddMainQuestion">
            <Row type="flex" justify="space-between" style="margin-bottom:20px">
              <Col style="flex:1">
                <Row type="flex">
                  <Col style="margin-right:20px">
                    <Select v-model="selectMainType">
                      <Option v-for="item in selectMainTypeAll" :value="item.value" :key="item.item">{{item.item}}</Option>
                    </Select>
                  </Col>
                  <Col>
                    <Select v-model="selectMainScore">
                      <Option v-for="item in score" :value="item.num" :key="item.num">{{item.num}}分</Option>
                    </Select>
                  </Col>
                </Row>
              </Col>
              <Col>
                <button class="addCourseware-contain-m-save-btn" @click="addMainQuestion">保存题目</button>
              </Col>
            </Row>
              <Input v-model="selectMainContain" type="textarea" placeholder="在这里输入题目..." :rows="4"/>
          </div>
          <button class="addCourseware-contain-r-add-btn" v-show="!isAddMainQuestion&&editable"  @click="isAddMainQuestion = true">添加</button>
        </div>
        <Row type="flex" justify="space-between" class="addCourseware-contain-r-bottom">
          <Col>
            <button class="homework-back" @click="openPreview()">预览</button>
          </Col>
          <Col>
            <button @click="$emit('closeAddCourseware')">退出</button>
            <button style="background:#3B9BFF;color:#ffffff;margin-left:20px" @click="saveCoursewareExam">保存</button>
          </Col>
        </Row>
      </Col>
    </Row>
    <Modal class="new-modal" v-model="modal" :title="title" width="1200" footer-hide :mask-closable="false" >
      <!-- <Evaluate :student_task_id="student_task_id" v-if="target === 'evaluate'" ></Evaluate> -->
      <previewExam v-if="target === 'previewExam'" :exam_info="exam_info"></previewExam>
    </Modal>
  </div>
</template>
<script>

import { get_release_detail, save_examination_release } from '@/api/data'
import previewExam from './previewExam'
export default{
  props: {
    timet_id: '',
    action_type: '', // 1 新增 2编辑 3详情 4复制
    type: '',
    courseware_id: '',
    teacher_course_id: '',
    exam_release_id: '',
    courseware_name: ''
  },
  components: {
    previewExam
  },
  data () {
    return {
      exam_info: {},
      target: '',
      modal: false,
      title: '',
      id: '',
      editable: false,
      start_time: '', // 考试开始时间
      end_time: '', // 考试结束时间
      maxScore: 0,
      is_auto_release: 1, // 是否自动发布
      exam: {
        exam_name: '',
        exam_time: 90,
        type: this.type,
        courseware_id: this.courseware_id
      },
      class_begin_time: '',
      isAddMainQuestion: false,
      questionIndex: '',
      selectquestionIndex: 0,
      selectQuestionTypeAll: [
        { item: '单选题', value: 1 },
        { item: '多选题', value: 2 }
      ],
      selectItem: [
        { item: 'A', itemContain: '' },
        { item: 'B', itemContain: '' },
        { item: 'C', itemContain: '' },
        { item: 'D', itemContain: '' },
        { item: 'E', itemContain: '' },
        { item: 'F', itemContain: '' }
      ],
      selectMainType: '',
      selectMainScore: '',
      selectMainContain: '',
      selectQuestionType: '',
      selectQuestionScore: '',
      selectQuestionContain: '',
      selectMainTypeAll: [
        { item: '论述题', value: 1 },
        { item: '简答题', value: 2 },
        { item: '应用题', value: 3 },
        { item: '作文题', value: 4 }
      ],
      score: [
        { num: 1 },
        { num: 2 },
        { num: 3 },
        { num: 4 },
        { num: 5 },
        { num: 6 },
        { num: 7 },
        { num: 8 },
        { num: 9 },
        { num: 10 },
        { num: 20 },
        { num: 30 },
        { num: 40 },
        { num: 50 }
      ],
      mainQuestionList: [], // 主观题列表
      selectQuestionList: [], // 客观题列表
      mainquestionTotalscore: 0,
      selectquestionTotalscore: 0
    }
  },
  computed: {
    totalScore () {
      return this.selectquestionTotalscore + this.mainquestionTotalscore
    }
  },
  watch: {
    selectQuestionType () {
      for (let i = 0; i < document.getElementsByClassName('selectRight')[0].childNodes.length; i++) {
        document.getElementsByClassName('selectRight')[0].childNodes[i].className = 'unselect'
      }
    }
  },
  methods: {
    openPreview () {
      this.exam_info = {
        maxScore: this.maxScore,
        courseware_name: this.courseware_name,
        id: this.id,
        timetable_id: this.timet_id,
        start_time: Date.parse(this.start_time) / 1000,
        end_time: Date.parse(this.end_time) / 1000,
        exam: this.exam,
        obj: this.selectQuestionList,
        subj: this.mainQuestionList,
        editable: this.editable,
        auto_save: false,
        is_auto_release: this.is_auto_release
      }
      console.log(this.exam_info)
      this.modal = true
      this.title = '预览'
      this.target = 'previewExam'
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
    getMainQuestionScore () { // 计算主观题总分
      this.mainquestionTotalscore = 0
      for (let i = 0; i < this.mainQuestionList.length; i++) {
        this.mainquestionTotalscore += this.mainQuestionList[i].score
      }
    },
    getSelectQuestionScore () { // 计算客观题总分
      this.selectquestionTotalscore = 0
      for (let i = 0; i < this.selectQuestionList.length; i++) {
        this.selectquestionTotalscore += this.selectQuestionList[i].score
      }
    },
    addMainQuestion () { // 增加主观题
      if (this.selectMainType === '' || this.selectMainScore === '' || this.selectMainContain === '') {
        this.$Message.error('请输入完整的信息')
      } else {
        let a = { type: 2, subject_type: this.selectMainType, score: this.selectMainScore, content: this.selectMainContain }
        if (this.questionIndex !== '') {
          this.mainQuestionList[this.questionIndex] = a
          this.$Message.success('修改成功')

          this.questionIndex = ''
        } else {
          this.mainQuestionList.push(a)
          this.$Message.success('添加成功')
        }
        this.getMainQuestionScore()
        this.isAddMainQuestion = false
        this.selectMainContain = ''
      }
    },
    deleteMainQuestion (i) { // 删除主观题
      this.mainQuestionList.splice(i, 1)
      this.getMainQuestionScore()
    },
    changeMainQuestion (i) { // 编辑主观题
      this.selectMainType = this.mainQuestionList[i].subject_type
      this.selectMainScore = this.mainQuestionList[i].score
      this.selectMainContain = this.mainQuestionList[i].content
      this.questionIndex = i
      this.isAddMainQuestion = true
    },
    addSelectQuestion () { // 添加客观题
      if (this.selectQuestionScore === '' || this.selectQuestionType === '' || this.selectQuestionContain === '') {
        this.$Message.error('请输入完整的信息')
      } else if (document.getElementsByClassName('selectRight')[0].children.length < 2) {
        this.$Message.error('至少要设置两个选项')
      } else if (document.getElementsByClassName('isselect').length < 1) {
        this.$Message.error('请选择正确答案')
      } else {
        let sel = ''
        for (let i = this.selectItem.length - 1; i >= 0; i--) {
          if (this.selectItem[i].itemContain !== '') {
            sel = i
            break
          }
        }
        let tag = 0
        for (let i = 0; i < sel; i++) {
          if (this.selectItem[i].itemContain !== '') {
            tag++
          }
        }
        if (tag !== sel) {
          this.$Message.error('请按顺序填写选项')
        } else {
          let anwserList = ''
          for (let i = 0; i < document.getElementsByClassName('isselect').length; i++) {
            anwserList = anwserList + document.getElementsByClassName('isselect')[i].innerText + ','
          }
          anwserList = anwserList.substr(0, anwserList.length - 1)
          let option = ''
          for (let i = 0; i < this.selectItem.length; i++) {
            if (this.selectItem[i].itemContain !== '') {
              option = option + this.selectItem[i].itemContain + ','
            }
          }
          option = option.substr(0, option.length - 1)
          let a = {
            type: 1,
            object_type: this.selectQuestionType,
            score: this.selectQuestionScore,
            content: this.selectQuestionContain,
            option: option,
            answer: anwserList
          }
          if (this.selectquestionIndex !== this.selectQuestionList.length) {
            this.selectQuestionList[this.selectquestionIndex] = a
            this.$Message.success('修改成功')
            this.changeSelectQuestion(this.selectQuestionList.length)
          } else {
            this.selectQuestionList.push(a)
            this.$Message.success('添加成功')
            this.selectquestionIndex++
          }
          this.getSelectQuestionScore()
          this.selectQuestionContain = ''
          for (let i = 0; i < this.selectItem.length; i++) {
            this.selectItem[i].itemContain = ''
          }
        }
      }
    },
    selectRightAnwser (e) { // 选择正确答案
      if (this.selectQuestionType === 1) {
        for (let i = 0; i < e.target.parentNode.childNodes.length; i++) {
          e.target.parentNode.childNodes[i].className = 'unselect'
        }
        e.target.className = 'isselect'
      } else {
        if (e.target.className === 'unselect') {
          e.target.className = 'isselect'
        } else {
          e.target.className = 'unselect'
        }
      }
    },
    changeSelectQuestion (i) { // 编辑客观题
      this.selectquestionIndex = i
      if (i === this.selectQuestionList.length) {
        this.selectQuestionContain = ''
        for (let i = 0; i < this.selectItem.length; i++) {
          this.selectItem[i].itemContain = ''
        }
      } else {
        this.selectQuestionType = this.selectQuestionList[i].object_type
        this.selectQuestionScore = this.selectQuestionList[i].score
        this.selectQuestionContain = this.selectQuestionList[i].content
        for (let i = 0; i < this.selectItem.length; i++) {
          this.selectItem[i].itemContain = ''
        }
        let a = this.selectQuestionList[i].option.split(',')
        for (let i = 0; i < a.length; i++) {
          this.selectItem[i].itemContain = a[i]
        }
        let b = this.selectQuestionList[i].answer.split(',')
        this.$nextTick(() => {
          for (let i = 0; i < a.length; i++) {
            document.getElementsByClassName('selectRight')[0].children[i].className = 'unselect'
          }
          for (let i = 0; i < b.length; i++) {
            for (let j = 0; j < document.getElementsByClassName('unselect').length; j++) {
              if (b[i] === document.getElementsByClassName('unselect')[j].innerText) {
                document.getElementsByClassName('unselect')[j].className = 'isselect'
              }
            }
          }
        })
      }
    },
    deleteSelectQuestion () { // 删除客观题
      this.selectQuestionList.splice(this.selectquestionIndex, 1)
      this.changeSelectQuestion(this.selectQuestionList.length)
      this.getSelectQuestionScore()
    },
    getClassBeginTime (timetable_id) { // 获取课件上课时间
      this.axios.request({
        method: 'post',
        url: '/index.php/Teacher/TimetableTime/class_begin',
        data: {
          timetable_id: this.timet_id
        }
      }).then(res => {
        if (res.code === 200) {
          let time = res.data.time
          this.class_begin_time = this.moment(time * 1000).format('YYYY-MM-DD')
        }
      })
    },
    getInfo () {
      if (this.exam_release_id) {
        get_release_detail(this.exam_release_id).then(res => {
          if (res.code === 200) {
            let exam_release = res.data.exam_release
            exam_release.start_time = this.moment(exam_release.start_time * 1000).format('YYYY-MM-DD HH:mm:ss')
            exam_release.end_time = this.moment(exam_release.end_time * 1000).format('YYYY-MM-DD HH:mm:ss')
            // exam_release.obj = exam_release.obj.map(item => { item.answer = item.answer.split(','); return item })// 处理客观题answer
            this.id = exam_release.id
            this.start_time = exam_release.start_time
            this.end_time = exam_release.end_time
            this.editable = res.data.editable
            this.is_auto_release = exam_release.is_auto_release
            this.exam = exam_release.exam
            this.selectQuestionList = exam_release.obj
            this.mainQuestionList = exam_release.subj
            this.$nextTick(() => {
              this.getMainQuestionScore()
              this.getSelectQuestionScore()
              this.maxScore = this.totalScore
              this.changeSelectQuestion(0)
            })
          }
        })
      } else {
        this.id = ''
        this.start_time = this.moment().format('YYYY-MM-DD HH:mm:ss')
        this.end_time = this.moment().format('YYYY-MM-DD HH:mm:ss')
        this.exam = {
          id: '',
          exam_name: '',
          exam_time: 90,
          type: this.type,
          courseware_id: this.courseware_id
        }
        this.mainQuestionList = []
        this.selectQuestionList = []
        this.editable = true
      }
    },
    saveCoursewareExam () {
      if (this.exam.exam_name === '' || this.exam.exam_time === '' || this.maxScore === '' || this.is_auto_release === '' || this.start_time === '' || this.end_time === '') {
        this.$Message.error('请补充完整信息')
      } else if (this.maxScore <= 0) {
        this.$Message.error('总分必须大于0')
      } else if (this.totalScore.toString() !== this.maxScore.toString()) {
        this.$Message.error('题目总分未达到标准')
      } else {
        this.mainQuestionList = this.mainQuestionList.map((item, index) => {
          item.sort = index + 1
          return item
        })
        this.selectQuestionList = this.selectQuestionList.map((item, index) => {
          item.sort = index + 1
          return item
        })
        let data = {
          id: this.id,
          timetable_id: this.timet_id,
          start_time: Date.parse(this.start_time) / 1000,
          end_time: Date.parse(this.end_time) / 1000,
          exam: this.exam,
          obj: this.selectQuestionList,
          subj: this.mainQuestionList,
          editable: this.editable,
          auto_save: false,
          is_auto_release: this.is_auto_release
        }
        save_examination_release(data).then(res => {
          if (res.code === 200) {
            this.$Message.success(res.message)
            this.id = res.data.release_id
            this.exam.id = res.data.exam_id
          }
        })
      }
    }
  },
  mounted () {
    this.getClassBeginTime()
    this.getInfo()
  }
}
</script>
