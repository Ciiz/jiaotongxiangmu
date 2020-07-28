<template>
  <div class="modal-content">
    <div class="floatbox" ref="floatbox">
      <div
        v-for="(item,index) in answer"
        :key="item.id"
        style="width:100%;margin:10px 0;"
        :class="item.type === 2 ? '' :item.type === 3? 'turnright':'' "
      >
        <Tag :color="item.type === 3 ? 'success' : 'default'" style="width:30%;height:auto;" :class="item.type === 3 ? 'tagthree' : 'tagtwo'">
          <div style="display:inline-block;width:20%;text-align:center;overflow:hidden;padding-top:7px;">
            <Avatar style="background-color: #87d068" icon="ios-person"/>
          </div>
          <div style="display:inline-block;width:70%;overflow:hidden;text-align:center;">
            <span style>
             <b>{{item.name}}</b>
           </span>
            <span style="margin-left:10px;">{{new Date(item.created_at * 1000).toLocaleString()}}</span>
          </div>
          <div style="padding-left:20px;word-wrap: break-word;word-break: break-all;overflow:hidden;text-align:left;">{{item.content}}</div>
          <div>
            <Button
              v-if="item.type === 3"
              size="small"
              type="error"
              @click="remove(item.id,index)"
              style="margin-bottom:10px;"
            >删除</Button>
          </div>
        </Tag>
      </div>
    </div>

    <Row style="margin-top:20px;padding:10px;">
      <Input type="textarea" :rows="5" placeholder="请输入回答内容" v-model="answervalue" size="large" />
    </Row>
    <div class="modal-footer">
      <Button type="primary" @click="submitanswer">提交回答</Button>
    </div>
  </div>
</template>
<script>
export default {
  props: ['student_task_id'],
  data () {
    return {
      studentanswer: [],
      teacheranswer: [],
      answervalue: '',
      answer: [],
      resdata: []
    }
  },
  created () {
    this.getInfo()
  },
  methods: {
    remove (id, index) {
      this.axios.request({
        method: 'post',
        url: '/index.php/Teacher/TaskQuestion/delete',
        data: {
          id: id
        }
      }).then(res => {
        if (res.code === 200) {
          this.$Message.success('回复删除成功')
          this.answer.splice(index, 1)
        }
      })
    },
    submitanswer () {
      if (this.answervalue === '') {
        this.$Message.error('请输入回答内容')
      } else {
        this.axios.request({
          method: 'post',
          url: '/index.php/Teacher/TaskQuestion/answer',
          data: {
            student_task_id: this.student_task_id,
            content: this.answervalue
          }
        }).then(res => {
          if (res.code === 200) {
            this.$Message.success('回复提交成功')
            this.answervalue = ''
            this.teacheranswer.splice(0, this.teacheranswer.length)
            this.studentanswer.splice(0, this.studentanswer.length)
            this.getInfo()
          }
        })
      }
    },
    getInfo () {
      this.axios.request({
        method: 'post',
        url: '/index.php/Teacher/TaskQuestion/detail',
        data: {
          student_task_id: this.student_task_id
        }
      }).then(res => {
        if (res.code === 200) {
          this.resdata = res.data.question_detail
          for (let item in this.resdata) {
            if (this.resdata[item].type === 1 || this.resdata[item].type === 2) {
              this.studentanswer.push(this.resdata[item])
            } else if (this.resdata[item].type === 3) {
              this.teacheranswer.push(this.resdata[item])
            }
          }
          this.answer = []
          this.answer.push(...this.studentanswer)
          this.answer.push(...this.teacheranswer)
          this.answer.sort((a, b) => {
            return a.created_at > b.created_at ? 1 : -1
          })
        }
      })
    }
  },
  beforeUpdate () {
    this.$el.querySelector('.floatbox').scrollTop = this.$el.querySelector('.floatbox').scrollHeight
  }
}
</script>
