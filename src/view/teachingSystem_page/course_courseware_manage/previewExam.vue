<template>
  <div style="height:100%;padding-bottom:20px;display:flex;flex-direction: column;">
    <Row class="studentExam">
      <Col style="width:52%;margin-right:20px;display:flex;flex-direction:column">
        <div class="studentExam-l-t">
          <div class="studentExam-l-t-h">
            <div>
              <span class="studentHomework-black-font">{{exam_info.exam.exam_name}}</span>
            </div>
            <div>
              <span>满分：{{exam_info.maxScore}}分</span>
              <span style="margin-left:20px">考试时长：{{exam_info.exam.exam_time}}分钟</span>
            </div>
          </div>
          <div>所属课程：{{exam_info.courseware_name}} {{exam_info.exam.type===1?'课前':(exam_info.exam.type===2?'课中':'课后')}}测试</div>
          <div>授课老师：{{$store.state.user.userInfo.name}}</div>
          <div>截止时间：{{moment(exam_info.end_time * 1000).format('YYYY-MM-DD HH:mm:ss')}}</div>
        </div>
        <div class="studentExam-l-b" style="margin-top:0">
          <div class="studentExam-l-b-title">客观题</div>
          <div class="studentExam-l-b-contain" v-if="exam_info.obj.length>0">
            <div class="black-c">{{selectquestionIndex+1}}、[{{exam_info.obj[selectquestionIndex].object_type===1?'单选题':'多选题'}}]（{{exam_info.obj[selectquestionIndex].score}}分）</div>
            <p style="line-height:24px" class="black-c">{{exam_info.obj[selectquestionIndex].content}}</p>
            <CheckboxGroup class="studentExam-select-itemList" v-model="seletIn">
              <Checkbox v-for="(item,index) in changeOption(exam_info.obj[selectquestionIndex].option)" :key="index" :label="changeSel(index)">{{changeSel(index)+'.'+item}}</Checkbox>
            </CheckboxGroup>
            <div class="blue-c" style="font-size:18px;margin-left:20px">正确答案：{{exam_info.obj[selectquestionIndex].answer}}</div>
            <div class="studentExam-l-b-contain-button">
              <button class="blueC-btn" @click="changeSelectQuestion(selectquestionIndex+1)">下一题</button>
              <button class="blue-btn"  @click="changeSelectQuestion(selectquestionIndex-1)">上一题</button>
            </div>
          </div>
          <div class="studentExam-l-b-footer">
            <ul class="question-index">
              <li :class="selectquestionIndex===index?'inpage':'unpage'" v-for="(item,index) in exam_info.obj" :key="index" @click="changeSelectQuestion(index,$event)">{{index+1}}</li>
            </ul>
          </div>
        </div>
      </Col>
      <Col class="studentExam-r" style="flex:1">
        <div class="studentExam-l-b-title">主观题</div>
        <div>
          <div style="margin-bottom:20px" v-for="(item,index) in exam_info.subj" :key="index">
            <div class="black-c">{{index+1}}、[{{getMainQuestionType(item.subject_type)}}]（{{item.score}}分）</div>
            <p style="line-height:24px;margin-bottom:10px" class="black-c">{{item.content}}</p>
            <b>作答：</b>
            <Input type="textarea" :rows="4"/>
            <div style="clear:both"></div>
          </div>
        </div>
      </Col>
    </Row>
  </div>
</template>
<script>
export default {
  components: {
  },
  props: {
    exam_info: {}
  },
  data () {
    return {
      selectquestionIndex: 0
    }
  },
  computed: {
  },
  watch: {

  },

  methods: {
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
    changeOption (a) {
      let b = a.split(',')
      return b
    },
    changeSelectQuestion (index, e, l) { // 切换选择题
      console.log(index)
      if (index < 0) {
        if (l !== 1) {
          this.$Message.error('前面没有题目了')
        }
      } else if (index >= this.exam_info.obj.length) {
        if (l !== 1) {
          this.$Message.error('后面没有题目了')
        }
      } else {
        this.selectquestionIndex = index
        // let a = ''
        // if (this.seletIn.length > 0) {
        //   for (let i = 0; i < this.seletIn.length - 1; i++) {
        //     a = a + this.seletIn[i] + ','
        //   }
        //   a = a + this.seletIn[this.seletIn.length - 1]
        //   this.objectList[this.selectquestionIndex].student_answer.content = a
        // } else {
        //   // this.objectList[this.selectquestionIndex].student_answer.content = ''
        // }
        // this.selectquestionIndex = index
        // if (this.objectList[this.selectquestionIndex].student_answer.content !== '') {
        //   this.seletIn = this.objectList[this.selectquestionIndex].student_answer.content.split(',')
        // } else {
        //   this.seletIn = []
        // }
      }
    }
  },
  mounted () {
  }
}
</script>
<style>
</style>
