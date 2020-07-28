<template>
<div class="modal-content">
  <div>
      <Row span="24">
          <Row>
            <h3> <Divider orientation="center"><span style="font-weight:bold">主观题：</span></Divider> </h3>
              <div v-for="subject in student_exam.subject" :key="subject.id" class=" margin-b-15 row-item">
                <h3>第{{subject.sort}}题 （{{subject.score}}分）：</h3>
                <div v-html="subject.content"></div>
                <b>回答内容：</b>
                <div v-html="subject.student_answer.content === '' ? '暂未作答' : subject.student_answer.content" class="evainput"></div>
                <a :href="subject.student_answer.video_url" target="blank" v-show="subject.student_answer.video_url">{{subject.student_answer.video_url | dealFileUrl}}</a>
                <p><b>评价:</b></p>
                <div v-html="subject.evaluation === '' ? '暂未评价' : subject.evaluation" class="evainput"></div>
                  <Row>
                    <Col :span='8' v-for="option in subject.score_option" :key="option.id">
                      <Score
                      :label="option.option_name"
                      v-model="option.score"
                      >
                      </Score>
                    </Col>
                  </Row>
                <div v-html="subject.answer"></div>
              </div>
          </Row>

          <Row>
            <h3> <Divider orientation="center"><span style="font-weight:bold">客观题：</span></Divider> </h3>
                  <table class="my-table">
                    <thead>
                        <th width="60%" style="text-align:left">题目</th>
                        <th width="20%">学生答案</th>
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
      </Row>
      <Spin size="large" v-if="loading" fix></Spin>
  </div>
</div>
</template>
<script>
export default{
  props: {
    correctid: ''
  },
  data () {
    return {
      student_exam: {
        object: [],
        subject: []
      },
      loading: false
    }
  },
  watch: {
    correctid (n, o) {
      this.getInfo()
    }
  },
  filters: {
    dealFileUrl (val) {
      return (val.substr(val.lastIndexOf('/') + 1)).toLowerCase()
    }
  },
  created () {
    this.getInfo()
  },
  methods: {
    getInfo () {
      this.loading = true
      this.student_exam.subject = []
      this.axios.request({
        method: 'post',
        url: '/index.php/Teacher/Examination/score',
        data: {
          student_exam_id: this.correctid
        }
      }).then(res => {
        this.loading = false
        if (res.code === 200) {
          this.dealResData(res.data)
        }
      })
    },
    dealResData (data) {
      let objective_question = data.exam_info.objective_question
      let subjective_question = data.exam_info.subjective_question
      // 处理客观题
      for (let index in objective_question) {
        if (data.student_exam_answer.objective_question && data.student_exam_answer.objective_question[index]) {
          objective_question[index].student_answer = data.student_exam_answer.objective_question[index]
        } else {
          objective_question[index].student_answer = { id: '', sort: index, content: '' }
        }
        objective_question[index].answer = objective_question[index].answer.toUpperCase().split(',').sort()
        objective_question[index].student_answer.content = objective_question[index].student_answer.content.toUpperCase().split(',').sort()
        if (objective_question[index].answer.toString() === objective_question[index].student_answer.content.toString()) {
          objective_question[index].is_right = true
        } else {
          objective_question[index].is_right = false
        }
      }
      objective_question = Object.values(objective_question)
      // 处理主观题
      for (let index in subjective_question) {
        let id = subjective_question[index].id
        if (data.student_exam_answer.subjective_question && data.student_exam_answer.subjective_question[index]) {
          subjective_question[index].student_answer = data.student_exam_answer.subjective_question[index]
        } else {
          subjective_question[index].student_answer = { id: '', sort: index, content: '', video_url: '' }
        }
        subjective_question[index].evaluation = data.evaluation_list[id] || ''
        subjective_question[index].score_option = data.score_option_list[id] || []
        for (let index1 in subjective_question[index].score_option) {
          if (data.score_list[id] && data.score_list[id][index1]) {
            subjective_question[index].score_option[index1].score = data.score_list[id][index1]
          } else {
            subjective_question[index].score_option[index1].score = 0
          }
        }
        subjective_question[index].score_option = Object.values(subjective_question[index].score_option)
      }
      subjective_question = Object.values(subjective_question)
      this.student_exam.object = objective_question
      this.student_exam.subject = subjective_question
    }
  }
}
</script>
