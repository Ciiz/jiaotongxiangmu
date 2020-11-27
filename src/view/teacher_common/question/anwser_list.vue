<template>
  <div class="answer_list">
    <Tabs v-model="t" @on-click='changeType'>
      <TabPane label="提问内容" name="name2">
        <div class="questionContain" style="background:#E7E7E7;min-height:340px">
          <p>{{mainQuestion.content}}</p>
        </div>
        <div style="margin-top:16px;font-size:14px;color:#26282F;float:right">提问时间：{{getDate(mainQuestion.created_at)}}
        </div>
      </TabPane>
      <TabPane label="学生答案" name="name1">
        <Row>
          <Col :span="3">回复时间</Col>
          <Col :span="3">姓名</Col>
          <Col :span="15">回答内容</Col>
          <Col :span="3">评分</Col>
        </Row>
        <div class="answer_ul" style="margin-bottom:20px">
          <Row class="answer_l" v-for="(item) in answerList" :key="item.id">
            <Col :span="3">{{getDate(item.created_at)}}</Col>
            <Col :span="3">{{item.name}}</Col>
            <Col :span="15">
            <Tooltip :content='item.answer_content?item.answer_content:"该学生尚未作答"'>
              <span class="answer_content">{{item.answer_content?item.answer_content:"该学生尚未作答"}}</span>
            </Tooltip>
            </Col>
            <Col :span="3">
            <span style="display:inline-block;text-align:center;width:36px">{{item.score?item.score:"未评分"}}</span>
            <Button type="primary" size="small" style="float:right;transform:translateY(-3px)"
              @click="change(item.id,item.score)">修改</Button>
            </Col>
          </Row>
        </div>
      </TabPane>
    </Tabs>
    <Modal v-model="isshowscore" :width="300" title="请输入评分" footer-hide class="cimfrommodal">
      <InputNumber v-model="answerScore" />
      <Button type="success" @click="submitScore">确定</Button>
    </Modal>
  </div>
</template>
<script>
export default {
  props: ['mainQuestion'],
  watch: {
    mainQuestion: {
      handler (newValue, oldValue) {
        this.id = newValue.id
        this.t = 'name2'
      },
      deep: true
    }
  },
  data () {
    return {
      answerList: '',
      isshowscore: false,
      answerScore: 0,
      id: '',
      total: 0,
      answerId: '',
      t: 'name2'
    }
  },
  methods: {
    changeType (i) {
      if (i === 'name1') {
        this.getAnswerList()
      }
    },
    getDate (i) {
      return this.moment(i * 1000).format('YYYY-MM-DD')
    },
    getAnswerList () {
      this.axios
        .request({
          method: 'get',
          url: '/index.php/Teacher/Quiz/get_answer_list',
          params: {
            quiz_id: this.id,
            topic_type: 2
          }
        })
        .then(res => {
          console.log(res);
          this.answerList = res.data.list
          this.total = res.data.total
        })
    },
    change (id, val) {
      this.$emit('amendclose', false)
      this.answerId = id
      this.answerScore = val
      this.isshowscore = true
    },
    submitScore () {
      this.axios
        .request({
          method: 'post',
          url: '/index.php/Teacher/Quiz/answer_save',
          data: {
            id: this.answerId,
            score: this.answerScore
          }
        })
        .then(res => {
          if (res.code === 200) {
            this.isshowscore = false
            this.$Message.success(res.message)
            this.getAnswerList()
          } else {
            this.$Message.error(res.message)
          }
        })
    }
  },
  mounted () {
  }
}
</script>

<style>
.answer_list .ivu-tabs-tabpane {
  max-height: 378px;
  overflow-y: scroll;
}
.answer_header {
  font-size: 16px;
  font-weight: bold;
  padding: 15px 0;
  border-bottom: 1px solid rgb(232, 234, 236);
}
.answer_l {
  padding: 10px 5px;
  border-bottom: 1px solid rgb(232, 234, 236);
}
.answer_content {
  padding-right: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  word-wrap: break-word;
  word-break: break-all;
  cursor: pointer;
}

.answer_list .ivu-tabs-tabpane::-webkit-scrollbar {
  width: 0 !important;
}
</style>
