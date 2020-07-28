<template>
  <Row class="modal-content">
          <Row style="text-align:center;">
            <h1 style="color:#52c41a; display:inline-block" > {{total_score}}</h1>分
          </Row>
      <Col span="24">
          <Row>
            <h3> <Divider orientation="left"><span style="font-weight:bold">主观题：</span><span style="font-size: 12px;">得分: <Tag color="green">{{student_exam.subject_score}}</Tag> 分</span></Divider> </h3>
              <div v-for="subject in student_exam.subject" :key="subject.id" class=" margin-b-15 row-item">
                <b>第{{subject.sort}}题 （{{subject.score}}分）：</b>
                <div v-html="subject.content"></div>
                <h3>回答内容：</h3>
                <div v-html="subject.student_answer.content" class="text-container"></div>
                <a :href="subject.student_answer.video_url" target="blank" v-show="subject.student_answer.video_url">{{subject.student_answer.video_url | dealFileUrl}}</a>
                <h3>评分：</h3>
                <p>评价:{{subject.evaluation}} <span v-if="!subject.evaluation">无</span></p>
                  <Row>
                    <Col :span='8' v-for="option in subject.score_option" :key="option.id">
                      <Score
                      :label="option.option_name"
                      :disabled="true"
                      v-model="option.score"
                      >
                      </Score>
                    </Col>
                  </Row>
                <!-- <h3>参考答案：<span v-if="!subject.answer">无</span></h3> -->
                <div v-html="subject.answer"></div>
              </div>
          </Row>

          <Row>
            <h3> <Divider orientation="left"><span style="font-weight:bold">客观题：</span><span style="font-size: 12px;">得分: <Tag color="green">{{student_exam.object_score}}</Tag> 分</span></Divider> </h3>
                  <table class="my-table">
                    <thead>
                        <th width="60%" style="text-align:left">题目</th>
                        <th width="20%">我的答案</th>
                        <th width="20%">正确答案</th>
                    </thead>
                    <tbody>
                      <tr v-for="object in student_exam.object" :key="object.id" class="item-row row-item">
                        <td width="60%" style="text-align:left">
                          <div v-html="'第'+object.sort+'题  &nbsp;&nbsp;('+object.score+'分)：'+object.content" class="subject"></div>
                          <div class="option" v-html="object.option"></div>
                        </td>
                        <td width="20%">
                            <span :class="{ 'wrong': !object.is_right, 'right': object.is_right}" class="answer-item">{{object.student_answer.content.join(',')}}</span>
                        </td>
                        <td width="20%">
                            <span class="answer-item">{{object.answer.join(',')}}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
          </Row>

      </Col>
      <Spin size="large" v-if="loading" fix></Spin>
  </Row>
</template>
<script>
export default {
  props: {
    student_exam_id: ''
  },
  components: {
  },
  data () {
    return {
      loading: false,
      student_exam: {
        exam: { exam_name: '' }
      },
      exam_status: {},
      answerList: ['A', 'B', 'C', 'D']
    }
  },
  filters: {
    visit (val) {
      return val === false ? '显示' : '隐藏'
    },
    dealFileUrl (val) {
      return (val.substr(val.lastIndexOf('/') + 1)).toLowerCase()
    }
  },
  computed: {
    total_score () {
      return this.student_exam.object_score + this.student_exam.subject_score
    }
  },
  watch: {
    student_exam_id (newVal, oldVal) {
      this.getExam()
    }
  },
  methods: {
    getExam () {
      if (!this.student_exam_id) return
      let _this = this
      _this.loading = true
      _this.axios.request({
        method: 'get',
        url: `/index.php/Student/Exam/detail`,
        params: {
          student_exam_id: _this.student_exam_id,
          hasAnswer: 1
        }
      }).then(res => {
        _this.loading = false
        let data = res.data
        if (res.code === 200) {
          _this.student_exam = data.student_exam
          _this.exam_status = data.exam_status_data
          _this.dealObjectOptions(_this.student_exam.object)// 处理客观题答案
        }
      })
    },
    dealObjectOptions (objArr) {
      objArr.forEach(item => {
        item.student_answer.content = item.student_answer.content.toUpperCase().split(',').sort()
        item.answer = item.answer.toUpperCase().split(',').sort()
        if (item.student_answer.content.toString() === item.answer.toString()) {
          item.is_right = true
        } else {
          item.is_right = false
        }
      })
    }
  },
  mounted () {
    this.getExam()
  },
  beforeDestroy () {
  }
}
</script>
<style type="text/css" lang="less" scoped>
.p-text{
  margin-top: 5px;
}
.p-title{
  font-weight: bold;
}
.row-item{
  margin-top: 15px;
}

.content{
  color:#666
}
.answer-content{
  padding: 10px 15px;
  background: #f6f6f6;
  color: #666;
  border: 1px solid #ccc;
  margin-top: 5px;
}

.score{
    border: 1px solid #ccc;
    padding: 2px 10px;
}
.score-right{
  float: right;
}
.tip{
  color: #0084FF
}
.item-label{
}
.answer-item{
  margin: 3px 5px;
  background: #f0f0f0;
  padding: 2px 5px;
  border-radius: 3px;
  width:80px;
  display: inline-block;
}
 .wrong{
   color:red
 }
 .right{
   color: #20c420
 }

  .my-table{
    border-collapse: collapse;
    width: 100%;
    margin-top: 10px;
    tr{
      border-bottom: 1px solid #ccc;
      &:hover{
        background: #ccc
      }
      .subject{
        font-weight: bold
      }
      .option{
        margin-top:8px;
        font-size: 12px;
      }
    }
    td{
      text-align:center;
      vertical-align:middle;
      height: 40px;
      padding: 5px;
    }
  }

  .margin-b-15{
    margin-bottom:15px;
  }
</style>
