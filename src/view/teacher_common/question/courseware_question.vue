<template>
  <div class="student-box">
    <div style="width:100%">
      <Tabs value="name1">
        <TabPane label="添加主观题" name="name1">
          <Input type="textarea" v-model="questionContent" :rows="12" placeholder="请输入问题内容" />
          <div class="addmainquestion-footer" v-if="add_type==='call'">
            <span style="margin-top:20px;margin-right:20px;line-height:20px">在线人数：{{online_data.online_count}}</span>
            回答人数：<input type="number" v-model="studentNumber" class="new-inputnumber" />
            <button @click="submitQuestion" style="background:#3B88E8">随机发布</button>
            <button @click="submitQuestion" style="background:#15B5A8">指定学生</button>
            <button @click="submitQuestion" style="background:#49951B">抢答</button>
          </div>
          <div class="addmainquestion-footer" v-if="add_type==='save'">
            回答人数：<input type="number" v-model="studentNumber" class="new-inputnumber" />
            <button @click="submitQuestion" style="background:#15B5A8">保存</button>
          </div>
        </TabPane>
        <TabPane label="添加客观题" name="name2">
          <Input type="textarea" :rows="4" v-model="questionContent2" placeholder="请输入问题内容" />
          <div class="choose-question" v-for="(item,index) in topic" :key="index">
            <div>{{item.choose}}：</div>
            <div style="flex:1">
              <Input type="text" placeholder="请输入答案" v-model="item.choose_content" />
            </div>
          </div>
          <div class="showtime" v-if="add_type==='call'">
            作答时间：<input type="number" v-model="questionTime" class="new-inputnumber" />秒
            <button style="background:#15B5A8" @click="submitQuestion2">全体作答</button>
          </div>
          <div class="showtime" v-if="add_type==='save'">
            作答时间：<input type="number" v-model="questionTime" class="new-inputnumber" />秒
            <button style="background:#15B5A8" @click="submitQuestion2">保存</button>
          </div>
        </TabPane>
      </Tabs>
    </div>
    <Modal class="racemodal" v-if="add_type==='call'" v-model="modal1" title="抢答" @on-ok="ok">
      <p>是否确定进行抢答？</p>
    </Modal>
    <Modal v-if="add_type==='call'" v-model="modal2" title="选择学生" @on-ok="submit">
      <div style="font-size:14px;margin-bottom:8px;color:black;font-weight:bold">请选择（{{total}}/{{studentNumber}}）位学生:
      </div>
      <div class="student">
        <div v-for="(item,index) in online_data.students" class="className" ref="className" :key="index">
          <h3>{{item.class_name}}</h3>
          <ul>
            <li v-for="(item2,index2) in item.student" class="studentName" ref="studentName"
              @click="select(item2,$event)" :key="index2">
              {{item2.name}}
            </li>
            <div style="clear:both"></div>
          </ul>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  props: ['online_data', 'courseware_id', 'group_chat_id', 'add_type', 'showTime'],
  data () {
    return {
      students: [],
      total: 0,
      modal1: false,
      modal2: false,
      onlineStudent: [],
      studentNumber: 1,
      questionContent: '',
      questionTime: 180,
      questionContent2: '',
      selectA: '',
      selectB: '',
      selectC: '',
      selectD: '',
      topic: [{ choose: 'A', choose_content: '' },
      { choose: 'B', choose_content: '' },
      { choose: 'C', choose_content: '' },
      { choose: 'D', choose_content: '' }
      ]
    }
  },
  watch: {

  },
  methods: {
    select (val, event) {
      if (event.currentTarget.style.borderColor !== 'red') {
        if (this.total >= this.studentNumber) {
          this.$Message.error('最多只能选择' + this.studentNumber + '名学生')
        } else {
          event.currentTarget.style.borderColor = 'red'
          this.students.push(val.id)
          this.total++
        }
      } else {
        event.currentTarget.style.borderColor = 'black'
        this.students.map((v, i) => {
          if (v === val.id) {
            this.students.splice(i, 1)
          }
        })
        this.total--
      }
    },
    submitQuestion (e) {
      this.$emit('closemodal', false)
      if (this.questionContent === '') {
        this.$Message.error('请输入问题')
      } else if (this.studentNumber <= 0) {
        this.$Message.error('提问人数不能小于1')
      } else {
        if (this.add_type === 'call') {
          if (this.showTime !== '') {
            this.$Message.error('正在全体作答中')
          } else {
            if (this.studentNumber > this.online_data.online_count) {
              this.$Message.error('提问人数不能大于在线人数')
            } else {
              if (e.target.innerText === '抢答') {
                this.issure()
              } else if (e.target.innerText === '指定学生') {
                this.showStudent()
              } else if (e.target.innerText === '随机发布') {
                this.random()
              }
            }
          }
        } else if (this.add_type === 'save') {
          this.axios.request({
            method: 'post',
            url: 'index.php/Teacher/Quiz/save',
            data: {
              topic_type: 2,
              reply_time: '',
              quiz_id: '',
              courseware_id: this.courseware_id,
              content: this.questionContent,
              answer_num: this.studentNumber,
              type: 1
            }
          }).then(res => {
            this.$Message.success('添加成功')
            this.$emit('closeModal')
            this.questionContent = ""
            this.studentNumber = 0

          })
        }
      }
    },
    submitQuestion2 () {
      if (this.questionContent2 === '') {
        this.$Message.error('请输入问题')
      } else if (this.topic[0].chooseA === '' || this.topic[1].choose === '' || this.topic[2].choose === '' || this.topic[3].choose === '') {
        this.$Message.error('请输入选项答案')
      } else {
        if (this.add_type === 'call') {
          if (this.showTime !== '') {
            this.$Message.error('正在全体作答中')
          } else {
            this.axios.request({
              method: 'post',
              url: 'index.php/Teacher/Quiz/save',
              data: {
                topic_type: 1,
                reply_time: this.questionTime,
                quiz_id: '',
                topic: this.topic,
                courseware_id: this.courseware_id,
                group: this.group_chat_id,
                content: this.questionContent2,
                answer_num: 1,
                type: 0
              }
            }).then(res => {
              if (res.code === 200) {
                this.questionContent2 = ''
                this.topic = [{ choose: 'A', choose_content: '' },
                { choose: 'B', choose_content: '' },
                { choose: 'C', choose_content: '' },
                { choose: 'D', choose_content: '' }
                ]
                this.$Message.success('提问成功')
                this.$emit('changeTime', this.questionTime)
                this.$emit('closeQList')
              }
            })
          }
        } else if (this.add_type === 'save') {
          this.axios.request({
            method: 'post',
            url: 'index.php/Teacher/Quiz/save',
            data: {
              topic_type: 1,
              reply_time: this.questionTime,
              quiz_id: '',
              topic: this.topic,
              courseware_id: this.courseware_id,
              content: this.questionContent2,
              answer_num: 1,
              type: 1
            }
          }).then(res => {
            if (res.code === 200) {
              this.$Message.success('添加成功')
              this.$emit('closeModal')
              this.reply_time = 0
              this.questionContent2 = ''
              this.topic = [{ choose: 'A', choose_content: '' },
              { choose: 'B', choose_content: '' },
              { choose: 'C', choose_content: '' },
              { choose: 'D', choose_content: '' }
              ]
            }
          })
        }
      }
    },
    showStudent () {
      this.clear()
      this.modal2 = true
    },
    random () {
      this.modal2 = true
      this.clear()
      this.total = this.studentNumber
      let o = 0
      while (o < this.studentNumber) {
        var a = 0
        var num1 = Math.floor(Math.random() * this.online_data.students.length)
        var num2 = Math.floor(Math.random() * this.online_data.students[num1].student.length)
        if (this.students.length === 0) {
          this.students.push(this.online_data.students[num1].student[num2].id)
          this.$refs.className[num1].childNodes[1].childNodes[num2].style.borderColor = 'red'
          o = 1
        } else {
          for (var i = 0; i < this.students.length; i++) {
            if (this.online_data.students[num1].student[num2].id !== this.students[i]) {
              a++
            }
          }
          if (a === this.students.length) {
            o++
            this.$refs.className[num1].childNodes[1].childNodes[num2].style.borderColor = 'red'
            this.students.push(this.online_data.students[num1].student[num2].id)
          }
        }
      }
    },
    submit () {
      if (parseInt(this.total) === parseInt(this.studentNumber)) {
        this.axios.request({
          method: 'post',
          url: 'index.php/Teacher/Quiz/save',
          data: {
            student_ids: this.students,
            rob: 0,
            topic_type: 2,
            reply_time: '',
            quiz_id: '',
            courseware_id: this.courseware_id,
            group: this.group_chat_id,
            content: this.questionContent,
            answer_num: this.studentNumber,
            type: 0
          }
        }).then(res => {
          if (res.code === 200) {
            this.$emit('closeQList')
            this.$Message.success('提问成功')
          } else {
            this.$Message.error(res.message)
          }
        })
      } else {
        this.$Message.error('请选择' + this.studentNumber + '位学生')
      }
    },
    issure () {
      this.modal1 = true
    },
    ok () {
      this.axios.request({
        method: 'post',
        url: 'index.php/Teacher/Quiz/save',
        data: {
          rob: 1,
          topic_type: 2,
          reply_time: '',
          quiz_id: '',
          courseware_id: this.courseware_id,
          group: this.group_chat_id,
          content: this.questionContent,
          answer_num: this.studentNumber,
          type: 0
        }
      }).then(res => {
        if (res.code === 200) {
          this.$emit('closeQList')
          this.$Message.success('提问成功')
          this.questionContent = ''
        } else {
          this.$Message.error(res.message)
        }
      })
    },
    clear () {
      if (this.$refs.studentName !== undefined) {
        for (let i = 0; i < this.$refs.studentName.length; i++) {
          this.$refs.studentName[i].style.borderColor = 'black'
        }
      }
      this.students = []
      this.total = 0
    }
  },
  mounted () {
  }
}
</script>

<style>
.racemodal .ivu-modal-content {
  z-index: 99999 !important;
}
.student-box {
  overflow-x: hidden;
  overflow-y: auto;
  width: 100%;
  max-height: 80vh;
  display: flex;
  flex-wrap: wrap;
}
.student-list {
  margin: 5px 0;
  height: 50px;
  line-height: 50px;
  float: left;
}
.student-name {
  display: inline-block;
  width: 80px;
  text-align: center;
  height: 30px;
  line-height: 30px;
  border-radius: 6px;
  border: 1px solid green;
  cursor: pointer;
  margin-right: 20px;
}
.student ul {
  width: 100%;
}
.student ul li {
  float: left;
  margin: 5px 0;
  display: inline-block;
  width: 64px;
  text-align: center;
  height: 24px;
  line-height: 24px;
  border-radius: 6px;
  border: 1px solid black;
  cursor: pointer;
  margin-right: 20px;
}

.addmainquestion-footer {
  float: right;
  margin-top: 16px;
  height: 31px;
  color: #000000;
}
.addmainquestion-footer button,
.showtime button {
  cursor: pointer;
  padding: 5px 0;
  width: 84px;
  border-radius: 4px;
  outline: none;
  border: none;
  margin-left: 30px;
  color: #ffffff;
}
.choose-question {
  font-size: 14px;
  display: flex;
  margin-top: 10px;
}
.choose-question div:nth-of-type(1) {
  margin: auto;
}
.showtime {
  float: right;
  margin-top: 20px;
  height: 32px;
  color: #000000;
}
.new-inputnumber {
  width: 84px;
  height: 26px;
  text-align: center;
  border: 1px solid #000000;
  border-radius: 4px;
  margin-right: 6px;
  vertical-align: middle;
}
.student-box input {
  font-size: 14px;
}
</style>
