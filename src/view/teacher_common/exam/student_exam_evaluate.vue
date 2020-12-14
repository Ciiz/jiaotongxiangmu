<template>
  <div style="background:#ffffff;height:600px;overflow-y:scroll">
    <div>
      <Collapse class="evaluate-Collapse" v-model="collapseVal">
        <!-- 选择题 -->
        <Panel v-for="(item,index) in student_exam.object" v-if="item.length!==0" :key="index">
          <span>
            {{item[0].object_type===1?'单选题':'多选题'}}
          </span>
          <span>正确：{{item[0].user_type_true_num}}/{{item.length}}</span>
          <span>得分：{{item[0].user_type_score}}/{{item[0].total_score}}</span>
          <p slot="content">
            <Row class="evaluate-Collapse-Row" v-for="(item2,index2) in item" :key="index2">
              <Col :span="18">
              <span class="evaluate-Collapse-span-title">{{item2.content}}（{{item2.score}}分）</span>
              <ul class="evaluate-Collapse-ul-list">
                <li v-for="(item3,index3) in item2.option" :key="index3">{{changeSel(index3)}}{{item3}}</li>
              </ul>
              </Col>
              <Col :span="6" class="evaluate-select-anwser">
              <div>
                <span>正确答案&nbsp;</span>
                <span class="evaluate-select-anwser-normalBoreder">{{item2.answer}}</span>
              </div>
              <div>
                <span>TA的答案</span>
                <span
                  :class="item2.user_answer===item2.answer?'evaluate-select-anwser-rightBoreder':'evaluate-select-anwser-errorBoreder'">{{item2.user_answer===''?'未作答':item2.user_answer}}</span>
              </div>
              </Col>
            </Row>
          </p>
        </Panel>
        <!-- 其他答题 -->
        <Panel v-for="(item,index) in student_exam.subject" v-if="item.length!==0" :key="index">
          <span>
            {{changeQusetionType(item[0].subject_type)}}
          </span>
          <span>共{{item.length}}题</span>
          <span>得分：{{item[0].user_type_score}}/{{item[0].total_score}}</span>
          <p slot="content">
            <Row v-for="(item2,index2) in item" :key="index2" style="padding:16px 0">
              <p class="evaluate-main-question">{{index2+1}}.{{item2.content}}（{{item2.score}}分）</p>
              <Row type="flex" justify="space-between" class="evaluate-main-evaluate">
                <Col><span>TA的答案</span></Col>
                <Col>
                <span>本题得分</span>
                <Input type="text" v-model="score_option_list[item2.id][item2.score_option_list_id]" style="width:106px"
                  class="evaluate-main-score-input" />
                </Col>
              </Row>
              <p class="evaluate-main-anwser" v-html="item2.user_answer===''?'未作答':item2.user_answer">
              </p>
            </Row>
          </p>
        </Panel>
      </Collapse>
      <Spin size="large" v-if="loading" fix></Spin>
      <div class="modal-footer evaluate-modal-footer">
        <button class="blue-btn" @click="lastExam">上一位</button>
        <button @click="submit">&nbsp;&nbsp;&nbsp;保存（查看分数）</button>
        <button class="blue-btn" @click="nextExam">下一位</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    student_exam_id: '',
    examIndex: '',
    targetwork_id: '',
  },
  data () {
    return {
      collapseVal: null,
      exam_name: '',
      student_exam: {
        object: [],
        subject: []
      },
      loading: false,
      score_option_list: [],

    }
  },
  watch: {
    student_exam_id (n, o) {
      this.getInfo()
    }
  },
  filters: {
    dealFileUrl (val) {
      return (val.substr(val.lastIndexOf('/') + 1)).toLowerCase()
    }
  },
  methods: {
    getInfo () {
      this.loading = true
      this.student_exam.subject = []
      this.axios.request({
        method: 'post',
        url: '/index.php/Teacher/Examination/score',
        data: {
          student_exam_id: this.student_exam_id
        }
      }).then(res => {
        console.log(res);
        this.loading = false
        if (res.code === 200) {
          this.student_exam.object = res.data.exam_info.objective_question
          this.student_exam.subject = res.data.exam_info.subjective_question
          this.score_option_list = res.data.score_option_list
          for (let key in this.score_option_list) {
            this.score_option_list[key][this.score_option_list[key].option_id] = this.score_option_list[key].user_this_score
          }
        }
      })
    },
    submit () {
      this.axios.request({
        method: 'post',
        url: '/index.php/Teacher/Examination/score_update',
        data: {
          student_exam_id: this.student_exam_id,
          evaluation_list: '',
          score_list: this.score_option_list
        }
      }).then(res => {
        console.log(res);
        if (res.code === 200) {
          this.$Message.success(res.message)
          this.$emit('success', false)
          this.axios.request({
            method: 'get',
            url: '/index.php/Teacher/Examination/student_exam_list',
            params: {
              exam_release_id: this.targetwork_id,
              score_rank: ""
            }
          }).then(res => {
            console.log(res);

          })
        }
      })
    },
    nextExam () {
      let i = this.examIndex + 1
      this.$emit('changeExam', i)
    },
    lastExam () {
      let i = this.examIndex - 1
      this.$emit('changeExam', i)
    },
    changeSel (i) {
      if (i === 0) {
        return 'A.'
      } else if (i === 1) {
        return 'B.'
      } else if (i === 2) {
        return 'C.'
      } else if (i === 3) {
        return 'D.'
      } else if (i === 4) {
        return 'E.'
      } else if (i === 5) {
        return 'F.'
      }
    },
    changeQusetionType (i) {
      if (i === 1) {
        return '论述题'
      } else if (i === 2) {
        return '简答题'
      } else if (i === 3) {
        return '应用题'
      } else if (i === 4) {
        return '作文题'
      }
    }
  },
  mounted () {
    setTimeout(() => {
      this.collapseVal = ["0", "1", "2", "3", "4", "5", "6", '7'];
    }, 700)

    this.getInfo()
  }
}
</script>
<style type="text/css" lang="less" scoped>
.content {
  color: #666;
}
.answer-content {
  padding: 10px 15px;
  background: #f6f6f6;
  color: #666;
  border: 1px solid #ccc;
  margin-top: 5px;
}

.score {
  border: 1px solid #ccc;
  padding: 2px 10px;
}
.score-right {
  float: right;
}
.tip {
  color: #0084ff;
}

.answer-item {
  margin: 3px 5px;
  background: #f0f0f0;
  padding: 2px 5px;
  border-radius: 3px;
  width: 80px;
  display: inline-block;
}
.wrong {
  color: red;
}
.right {
  color: #20c420;
}

.my-table {
  border-collapse: collapse;
  width: 100%;
  margin-top: 10px;
  tr {
    border-bottom: 1px solid #ccc;
    &:hover {
      background: #ccc;
    }
    .subject {
      font-weight: bold;
    }
    .option {
      margin-top: 8px;
      font-size: 12px;
    }
  }
  td {
    text-align: center;
    vertical-align: middle;
    height: 40px;
    padding: 5px;
  }
}

.margin-b-15 {
  margin-bottom: 15px;
}
</style>
