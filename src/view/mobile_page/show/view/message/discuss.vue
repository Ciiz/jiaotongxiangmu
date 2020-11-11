<template>
  <!-- to="/mobile/mobileMessage" -->
  <div class="m-discuss flex-contain">
    <mt-header :title="infoTitle">
      <div slot="left" @click="$router.back(-1)">
        <mt-button icon="back"></mt-button>
      </div>
    </mt-header>
    <div class="infoModal-r-content" style="height:100%;background:#ffffff;border-top:1px solid #DDDDDD">
      <div>
        <div class="ab-scroll">
          <!-- <div class="userinfo-info-showhistory" @click="getAnwserNum++,getAnwser(getAnwserNum)">查看历史消息>></div> -->
          <!-- <div class="infoModal-t">2020-4-21 10:20</div> -->
          <!-- table_type 1：小组讨论，2：任务提问，3：话题 -->
          <div v-for="(item,index) in answerList" :key="index">
            <div v-if="userType===1&&chatList.table_type===2"
              :class="item.type === 1&&userType===1 ? 'userinfo-right' : 'userinfo-left'">
              <div>
                <img :src="item.userInfo.icon" />
              </div>
              <div>
                <div></div>
                {{item.content}}
              </div>
            </div>
            <div v-if="userType===1&&chatList.table_type===3"
              :class="item.type === 1&&userType===1 ? 'userinfo-right' : 'userinfo-left'">
              <div v-if="item.content">
                <img :src="item.object.icon" />
              </div>
              <div v-if="item.content">
                <div></div>
                {{item.content}}
              </div>
            </div>
            <div v-if="userType===2&&chatList.table_type===2"
              :class="item.type === 2&&userType===2 ? 'userinfo-right' : 'userinfo-left'">
              <div>
                <img :src="item.userInfo.icon" />
              </div>
              <div>
                <div></div>
                {{item.content}}
              </div>
            </div>
            <div v-if="userType===2&&chatList.table_type===1"
              :class="item.object_id===userId&&userType===2 ? 'userinfo-right' : 'userinfo-left'">
              <div>
                <img :src="item.userInfo.icon" />
              </div>
              <div>
                <div></div>
                {{item.content}}
              </div>
            </div>
            <div v-if="userType===2&&chatList.table_type===3"
              :class="item.type === 2&&userType===2&&item.object_id===userId ? 'userinfo-right' : 'userinfo-left'">
              <div v-if="item.content">
                <img :src="item.object.icon" />
              </div>
              <div v-if="item.content">
                <div></div>
                {{item.content}}
              </div>
            </div>
            <div style="clear:both"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="m-discuss-bottom">
      <div style="flex:1">
        <input type="text" class="m-discuss-input" v-model="discussinfo" />
      </div>
      <img src="@/assets/images/mobile_student/sendcommand.png"
        style="width:0.54rem;height:0.49rem;margin: auto 0 auto 0.32rem;" @click="sendInfo" />
    </div>
  </div>
</template>
<script>
import { Toast } from 'mint-ui'
import live from '@/view/common/live'
import { sendDiscussTeacher, sendInfoTeacher, sendInfoStudent, sendInfoGroup, sendDiscussStudent } from '@/api/chat'

export default {
  data () {
    return {
      studentanswer: [],
      teacheranswer: [],
      getAnwserNum: '',
      resdata: [],
      answer: [],
      answerList: [],
      userType: this.$store.state.user.userInfo.userType,
      userId: this.$store.state.user.userId,
      infoTitle: '',
      discussinfo: ''
    }
  },
  mixins: [live],
  computed: {
    chatList () {
      return this.$route.query.chatList
    }

  },
  watch: {

  },
  methods: {
    getInfo () { // 获取聊天记录
      if (this.chatList.table_type === 2) {
        this.infoTitle = this.chatList.userInfo.name
      } else if (this.chatList.table_type === 1) {
        this.infoTitle = '小组讨论：' + this.chatList.task_name
      } else {
        this.infoTitle = '话题：' + this.chatList.title
      }
      if (this.userType === 1) {
        if (this.chatList.table_type === 3) {
          this.getDiscussCreate()
        } else if (this.chatList.table_type === 2) {
          this.getProblemDiscuss()
        }
      } else {
        if (this.chatList.table_type === 1) {
          this.getDiscussStudent()
        } else if (this.chatList.table_type === 3) {
          this.getDiscussCreateStudent()
        } else {
          this.getProblemDiscussStudent()
        }
      }
    },
    getDiscussCreateStudent () { // 学生端获取话题内容
      this.studentanswer = []
      this.teacheranswer = []
      this.getAnwserNum = 1
      this.axios.request({
        method: 'post',
        url: '/index.php/Student/Topic/topic_detail',
        data: {
          page: 1,
          topic_id: this.chatList.id,
          page_size: 1000
        }
      }).then(res => {
        if (res.code === 200) {
          this.resdata = res.data.list
          for (let item in this.resdata) {
            if (this.resdata[item].object_id === this.userId) {
              this.studentanswer.push(this.resdata[item])
            } else {
              this.teacheranswer.push(this.resdata[item])
            }
          }
          this.answer = []
          this.answer.push(...this.studentanswer)
          this.answer.push(...this.teacheranswer)
          this.answer.sort((a, b) => {
            return a.created_at > b.created_at ? 1 : -1
          })
          this.getAnwser(this.getAnwserNum)
        }
      })
    },
    getDiscussStudent () { // 学生端获取多人讨论内容
      this.studentanswer = []
      this.teacheranswer = []
      this.getAnwserNum = 1
      this.axios.request({
        method: 'post',
        url: '/index.php/Student/StudentTask/task_detail',
        data: {
          taskgroup: this.chatList.taskgroup,
          page_size: 1000,
          student_task_id: this.chatList.student_task_id
        }
      }).then(res => {
        if (res.code === 200) {
          this.resdata = res.data.list
          for (let item in this.resdata) {
            if (this.resdata[item].object_id === this.userId) {
              this.studentanswer.push(this.resdata[item])
            } else {
              this.teacheranswer.push(this.resdata[item])
            }
          }
          this.answer = []
          this.answer.push(...this.studentanswer)
          this.answer.push(...this.teacheranswer)
          this.answer.sort((a, b) => {
            return a.created_at > b.created_at ? 1 : -1
          })
          this.getAnwser(this.getAnwserNum)
        }
      })
    },
    getProblemDiscussStudent () { // 学生端获取问题聊天记录
      this.studentanswer = []
      this.teacheranswer = []
      this.getAnwserNum = 1
      this.axios.request({
        method: 'post',
        url: '/index.php/Student/Task/question_detail',
        data: {
          taskgroup: this.chatList.taskgroup,
          page_size: 1000
        }
      }).then(res => {
        if (res.code === 200) {
          this.resdata = res.data.list
          for (let item in this.resdata) {
            if (this.resdata[item].type === 2) {
              this.studentanswer.push(this.resdata[item])
            } else if (this.resdata[item].type === 1) {
              this.teacheranswer.push(this.resdata[item])
            }
          }
          this.answer = []
          this.answer.push(...this.studentanswer)
          this.answer.push(...this.teacheranswer)
          this.answer.sort((a, b) => {
            return a.created_at > b.created_at ? 1 : -1
          })
          this.getAnwser(this.getAnwserNum)
        }
      })
    },
    getProblemDiscuss () { // 教师端获取问题聊天记录
      this.studentanswer = []
      this.teacheranswer = []
      this.getAnwserNum = 1
      this.axios.request({
        method: 'post',
        url: '/index.php/Teacher/TaskQuestion/question_detail',
        data: {
          taskgroup: this.chatList.taskgroup,
          page_size: 1000
        }
      }).then(res => {
        if (res.code === 200) {
          this.resdata = res.data.list
          for (let item in this.resdata) {
            if (this.resdata[item].type === 2) {
              this.studentanswer.push(this.resdata[item])
            } else if (this.resdata[item].type === 1) {
              this.teacheranswer.push(this.resdata[item])
            }
          }
          this.answer = []
          this.answer.push(...this.studentanswer)
          this.answer.push(...this.teacheranswer)
          this.answer.sort((a, b) => {
            return a.created_at > b.created_at ? 1 : -1
          })
          this.getAnwser(this.getAnwserNum)
        }
      })
    },
    getDiscussCreate () { // 教师端获取话题聊天记录
      this.studentanswer = []
      this.teacheranswer = []
      this.getAnwserNum = 1
      this.axios.request({
        method: 'post',
        url: '/index.php/Teacher/Topic/topic_detail',
        data: {
          page: 1,
          page_size: 1000,
          topic_id: this.chatList.id
        }
      }).then(res => {
        this.resdata = res.message.list
        for (let item in this.resdata) {
          if (this.resdata[item].object_id === this.userId) {
            this.studentanswer.push(this.resdata[item])
          } else {
            this.teacheranswer.push(this.resdata[item])
          }
        }
        this.answer = []
        this.answer.push(...this.studentanswer)
        this.answer.push(...this.teacheranswer)
        this.answer.sort((a, b) => {
          return a.created_at > b.created_at ? 1 : -1
        })
        this.getAnwser(this.getAnwserNum)
      })
    },
    getAnwser (i) { // 获取聊天记录
      this.answerList = []
      if (i > 1 && i * 10 > this.answer.length) {
        this.$Message.error('没有更多的聊天内容了')
        i--
      }
      this.answerList = this.answer.slice(-(i * 10))
      this.$nextTick(function () {
        document.getElementsByClassName('ab-scroll')[0].scrollTop = 10 / this.answerList.length * document.getElementsByClassName('ab-scroll')[0].scrollHeight
      })
    },
    sendDiscussTeacher () { // 教师端话题发送信息
      sendDiscussTeacher(this.chatList.id, this.discussinfo).then(res => {
        if (res.code === 200) {
          this.resetDiscussInfo()
        }
      })
    },
    sendInfoTeacher () { // 教师端个人发送信息
      sendInfoTeacher(this.chatList.userInfo.id, this.discussinfo).then(res => {
        if (res.code === 200) {
          this.resetDiscussInfo()
          this.getProblemDiscuss()
        }
      })
    },
    sendInfoStudent (i, c, t, a) { // 学生端发送信息
      if (t === 1) {
        this.chatList.taskgroup = a
        // setTimeout(() => {
        //   document.getElementsByClassName('infoModal-l-list-l')[0].style.background = '#D7D7D7'
        //   document.getElementsByClassName('infoModal-content-md-close')[0].style.display = 'block'
        // }, 500)
      }
      sendInfoStudent(i, c, t).then(res => {
        if (res.code === 200) {
          this.resetDiscussInfo()
          this.getProblemDiscussStudent()
        }
      })
    },
    sendInfoGroup () { // 学生端多人讨论发送信息
      sendInfoGroup(this.chatList.taskgroup, this.discussinfo, this.chatList.student_task_id).then(res => {
        if (res.code === 200) {
          this.resetDiscussInfo()
        }
      })
    },
    sendDiscussStudent () { // 学生端话题发送信息
      sendDiscussStudent(this.chatList.id, this.discussinfo).then(res => {
        if (res.code === 200) {
          this.resetDiscussInfo()
          // this.getDiscussCreateStudent()
        }
      })
    },
    resetDiscussInfo () {
      this.discussinfo = ''
      this.teacheranswer.splice(0, this.teacheranswer.length)
      this.studentanswer.splice(0, this.studentanswer.length)
    },
    sendInfo () {
      if (this.discussinfo === '') {
        Toast({
          message: '请输入内容',
          duration: 2000
        })
      } else {
        if (this.userType === 1) {
          if (this.chatList.table_type === 3) {
            this.sendDiscussTeacher()
          } else {
            this.sendInfoTeacher()
          }
        } else {
          console.log(this.chatList);
          if (this.chatList.table_type === 2) {
            // console.log(this.chatList)
            this.sendInfoStudent(this.chatList.userInfo.id, this.discussinfo, '')
          } else if (this.chatList.table_type === 1) {
            this.sendInfoGroup()
          } else {
            this.sendDiscussStudent()
          }
        }
      }
    },
    handleOnMessage (data) {
      this.updataInfo(data.notice_type, data.taskgroup)
      let type = data.type || ''
      switch (type) {
        // Events.php中返回的init类型的消息，将client_id发给后台进行uid绑定
        case 'init':
          this.bindUser(data.client_id)
          if (this.userType === 1) {
            this.joinDisucussTeacher()
          } else {
            this.joinDisucussStudent()
          }
          break
        case 'ppt':
          break
        case 'online':
          break
        case 'offline':
          break
        default: {

        }
      }
    },
    updataInfo (type, tgroup) {
      if (type === 43) {
        if (this.chatList.taskgroup === tgroup) {
          this.getDiscussStudent()
        }
      } else if (type === 31) { // 教师接收学生信息
        if (this.chatList.taskgroup === tgroup) {
          this.getProblemDiscuss()
        }
      } else if (type === 32) { // 学生接收教师信息
        if (this.chatList.taskgroup === tgroup) {
          this.getProblemDiscussStudent()
        }
      } else if (type === 44) {
        if (this.chatList.id.toString() === tgroup) {
          if (this.userType === 1) {
            this.getDiscussCreate()
          } else {
            this.getDiscussCreateStudent()
          }
        }
      }
    }
  },
  mounted () {
    console.log(this.$route);

    this.initChat()
    this.getInfo()
  }
}
</script>
