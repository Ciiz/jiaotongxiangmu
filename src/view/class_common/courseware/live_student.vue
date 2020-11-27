<template>
  <div style="height:100%">
    <Layout style="height:100%">
      <Header class="live-header">
        <Row type="flex" justify="space-between" class="code-row-bg">
          <Col span="4">
          <img src="@/assets/images/new_img/live-logo.png" style="margin-left:20px;vertical-align:middle" />
          </Col>
          <Col style="color:#ACABAB;">
          <span class="lvie-coursewarename">{{student_courseware.courseware.courseware_name}}</span>
          <!-- <span style="font-size:18px;font-weight:bold;margin-right:30px">第一学时</span> -->
          <span v-if="teacher_staus==='在线'" style="font-size:14px">正在上课...</span>
          <span v-if="teacher_staus==='离线'" style="font-size:14px">教师离线...</span>
          </Col>
          <Col span="7" style="color:#888888;padding-right:30px">
          <div style="float:right">
            <img :src="$store.state.user.userInfo.icon"
              style="width:34px;vertical-align:middle;border-radius:20px;margin-right:14px" />
            <span style="margin-right:60px">{{$store.state.user.userInfo.name}}</span>
            <span>{{currentdate}}&nbsp;&nbsp;&nbsp;星期{{currentweek}}</span>
          </div>
          </Col>
        </Row>
      </Header>
      <Layout class="live-layout">
        <Content style="background:#111113">
          <Row style="background:#373737;height:100%;min-height:700px">
            <Col :span="3" class="live-l">
            <ul class="live-btnList">
              <li class="live-btnList-li" @click="showFilesList">
                课件素材({{student_courseware.courseware.courseware_files.length}})</li>
              <li class="live-btnList-li" @click="showQuestionList">教师提问({{questionList.length}})</li>
              <li class="live-btnList-li" @click="showTaskIn">
                <Badge dot :offset=[0,-4] :count="badgetask" class="question-badge">
                  课中任务 ({{taskinList.length}})
                </Badge>
              </li>

              <li class="live-btnList-li" @click="showTestIn">
                <Badge dot :offset=[0,-4] :count="badge" class="question-badge">
                  课中测试 ({{testinList.length}})
                </Badge>

              </li>
            </ul>
            <div
              style="background:#DE5959;color:#FFFFFF;font-size:16px;text-align:center;border-radius:4px;padding:20px 0;margin-top:50%;cursor:pointer"
              @click="checkNote">退出直播</div>
            </Col>
            <Col :span="21" class="live-r">
            <div class="allscreen" @click="closeList($event)">
              <div class="show-list">
                <div class="show-list-header">
                  <span class="show-list-title">课件素材</span>
                  <span style="float:right;cursor:pointer" @click="closeDetailList">
                    <Icon type="ios-close" size="46" color="#FFFFFF" />
                  </span>
                </div>
                <div style="color:#ffffff">
                  <p v-if="student_courseware.courseware.courseware_files.length === 0" style="color:#D1D1D1">暂无课件素材</p>
                  <div v-else>
                    <Row style="font-size:16px;font-weight:bold">
                      <Col :span="7">对应页码</Col>
                      <Col :span="17">附件名</Col>
                    </Row>
                    <ul class="ivu-upload-list">
                      <li v-for="file in student_courseware.courseware.courseware_files" :key="file.id">
                        <Row style="margin:6px 0">
                          <Col :span="6" :offset="1">{{file.page}}</Col>
                          <Col :span="17">
                          <a :href="file.file_url" target="blank" class="maitem_name"
                            style="color:#ffffff;cursor:pointer">{{file.file_name}}</a>
                          </Col>
                        </Row>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div class="allscreen" @click="closeList($event)">
              <div class="show-list">
                <div class="show-list-header">
                  <span class="show-list-title">教师提问</span>
                  <span style="float:right;cursor:pointer" @click="closeDetailList">
                    <Icon type="ios-close" size="46" color="#FFFFFF" />
                  </span>
                </div>
                <div>
                  <p v-if="questionList.length === 0" style="color:#D1D1D1">暂无教师提问</p>
                  <Collapse class="live-student-collapse">
                    <Panel v-for="(item,index) in questionList" :key="index">
                      <span style="font-size:14px;color:#787A81;margin-right:20px;font-weight:bold">{{index+1}}</span>
                      <span class="ques-contain">{{item.content}}</span>
                      <span style="color:#DADADB;float:right;margin-right:16px">{{getDate(item.created_at)}}</span>
                      <!-- <p slot="content">{{item.answer_content}}</p> -->
                      <p slot="content">
                        <span style="margin-bottom:10px;display:inline-block">问题：</span>
                        <span style="word-break:break-all">{{item.content}}</span></br>
                        <ul v-show="item.topic_type===1" style="margin:0 0 10px 40px">
                          <li v-for="(item2,index2) in item.detail" :key="index2">
                            {{item2.choose}}、{{item2.choose_content}}
                          </li>
                        </ul>
                        <span
                          style="margin-bottom:10px;display:inline-block;font-weight:bold;color:#C9CCD9">我的回答：</span></br>
                        <span style="margin-left:20px;word-break:break-all;font-weight:bold"
                          v-if="item.answer_content===''">尚未回答</br></span>
                        <span style="margin-left:20px;word-break:break-all;font-weight:bold"
                          v-if="item.answer_content!==''">{{item.answer_content}}</br></span></br>
                        <span
                          style="margin-bottom:10px;display:inline-block;font-weight:bold;color:#C9CCD9">教师评分：</span>
                        <span style="word-break:break-all;font-weight:bold" v-if="item.score===''">未评分</span>
                        <span style="word-break:break-all;font-weight:bold" v-if="item.score!==''">{{item.score}}</span>
                      </p>
                    </Panel>
                  </Collapse>
                </div>
              </div>
            </div>
            <div class="allscreen" @click="closeList($event)">
              <div class="show-list">
                <div class="show-list-header">
                  <span class="show-list-title">课中任务</span>
                  <span style="float:right;cursor:pointer" @click="closeDetailList">
                    <Icon type="ios-close" size="46" color="#FFFFFF" />
                  </span>
                </div>
                <div>

                  <p v-if="taskinList.length === 0" style="color:#D1D1D1">暂无课中任务</p>
                  <Row class="tab-content">
                    <TaskList ref='task_list' :student_courseware_id="this.student_courseware_id"></TaskList>
                  </Row>
                </div>
              </div>
            </div>
            <div class="allscreen" @click="closeList($event)">
              <div class="show-list">
                <div class="show-list-header">
                  <span class="show-list-title">课中测试</span>
                  <span style="float:right;cursor:pointer" @click="closeDetailList">
                    <Icon type="ios-close" size="46" color="#FFFFFF" />
                  </span>
                </div>
                <div>
                  <p v-if="testinList.length === 0" style="color:#D1D1D1">暂无课中测试</p>
                  <Table ref="selection" class="testinTable" :columns="columns" :data="testinList">
                  </Table>
                </div>
              </div>
            </div>
            <div class="live-box">
              <div style="flex:1;background: #000;padding:0 10px;padding-top:12px" v-if="mode === 'live'">
                <video id="myVideo" style="display:none;width:100%;height:100%"
                  class="video-js vjs-default-skin vjs-big-play-centered" controls muted preload="auto">
                  <source src="" type="application/x-mpegURL">
                </video>
                <video id="videoElement" style="width:100%;height:100%;display:none;outline:none" controls
                  muted></video>
              </div>
              <!-- pdf -->
              <div class="live-box-contain" v-if="mode === 'pdf'">
                <div class="pdfcard" ref="pdfcard" @dblclick="fullScreen('pdf')">
                  <div id="pdf" v-if="unpdf" style="align-self:center">
                    <!-- 弹幕组件：vue-baberrage -->
                    <vue-baberrage class="baberrage" style="z-index:1;height:100px;padding-top:10px;"
                      :isShow="barrageIsShow" :barrageList="barrageList" :loop="barrageLoop" :boxHeight="100">
                    </vue-baberrage>
                    <div class="switch_input switch_input_style" style="height:60px" ref="switch_input"
                      @mousedown="move($event)">
                      <div
                        style="display:flex;justify-content: space-around;height:66px;line-height:66px;align-items: center;">
                        <Tooltip content="上一页" placement="top">
                          <span class="page_style" @click="handlePageChange('up')">
                            <Icon type="ios-arrow-back" /></span>
                        </Tooltip>
                        <Tooltip content="下一页" placement="top">
                          <span class="page_style" @click="handlePageChange('down')">
                            <Icon type="ios-arrow-forward" /></span>
                        </Tooltip>
                        <Tooltip content="退出全屏" placement="top">
                          <span class="page_style" @click="end_full">
                            <Icon type="md-contract" /></span>
                        </Tooltip>
                        <Tooltip :content="isSync ? '取消同屏' : '同屏'" placement="top">
                          <div class="page_style" :style="{background: isSync ? 'red' : `#fff`, cursor: 'pointer'}"
                            @click="()=>{isSync=!isSync;this.getPptOption()}">
                            <Icon type="md-wifi" />
                          </div>
                        </Tooltip>
                        <Tooltip content="弹幕" placement="top">
                          <span class="page_style"
                            :style="{background: barrageIsShow ? 'red' : `#fff`, cursor: 'pointer'}"
                            @click="barrageIsShow = !barrageIsShow">
                            <Icon type="ios-outlet-outline" /></span>
                        </Tooltip>
                        <Tooltip content="移动" placement="top">
                          <span class="page_style" style="cursor: move;">
                            <Icon type="md-move" /></span>
                        </Tooltip>
                      </div>
                    </div>
                    <!-- <div v-if="live_type === 'live'">
                        <div style="display:flex;height:100%;">
                          <video id="videoElement" style="width:100%;" controls muted></video>
                        </div>
                      </div> -->
                    <div style="height:100%;overflow:auto;background:#000;display:flex;width:100%;align-items:center"
                      id="pdf1" ref="pdf1" v-if="['pdf'].indexOf(file_stuffix) !== -1 && mode === 'pdf'">
                      <pdf ref="pdf" :src="student_courseware.courseware.file_url" :page="page" :style="{width:'100%'}"
                        style="margin: 0 auto;" @progress="loadedRatio = $event" @error="error"
                        @num-pages="numPages = $event" @link-clicked="page = $event"></pdf>
                    </div>
                  </div>
                  <div v-else style="width:100%;height:444px;overflow-y:auto;margin: 10px auto">
                    <embed :src="src" width="100%" height="440px" autostart="false">
                  </div>
                </div>
                <Row class="pdfcard-bottom-student" type="flex" justify="space-between">
                  <Col>
                  <span>教师状态：</span>
                  <span v-if="teacher_staus==='在线'" style="color:#449BE6">{{teacher_staus}}</span>
                  <span v-if="teacher_staus==='离线'" style="color:red">{{teacher_staus}}</span>
                  </span>
                  </Col>
                  <Col>
                  <div style="float:left">
                    <img src="@/assets/images/new_img/beforePage.png" @click="handlePageChange('up')"
                      style="margin-right:20px" />
                    <InputNumber v-model.number="page" type="number" :max="numPages" :min="1" style="width:50px"
                      size="small" @on-change="handlePageChange" class="showcurrentpage"></InputNumber>
                    &nbsp;
                    <span style="vertical-align:middle">/{{numPages}}</span>
                    <img src="@/assets/images/new_img/nextPage.png" @click="handlePageChange('down')"
                      style="margin-left:3px" />
                  </div>
                  </Col>
                  <Col>
                  <div style="float:right" class="live-student-bottom-r">
                    <img src="@/assets/images/new_img/open-barrage.png" @click="barrageIsShow = true"
                      v-show="!barrageIsShow" style="width:23px;padding:0 4px" />
                    <img src="@/assets/images/new_img/close-barrage.png" @click="barrageIsShow = false"
                      v-show="barrageIsShow" />
                    <img src="@/assets/images/new_img/ergeType.png" @click="ergeTypeChange()" />
                    <img src="@/assets/images/new_img/enlarge.png" @click="fullScreen('pdf')" />
                  </div>
                  </Col>
                </Row>
              </div>
            </div>
            <div class="discuss">
              <div class="discuss-top">
                <span class="selectChangActive" @click="changeType(0,$event)">弹幕讨论</span>
                <span @click="changeType(1,$event)">课堂笔记</span>
              </div>
              <Card class="chatcard" v-if="showdiscuss===true">
                <div id="chat">
                  <div v-for="item in messageList" :key="item.id" class="chat-item">
                    <div class="userInfo" style=" word-break: break-all">
                      <Avatar :src="item.msg.extra.userInfo.avator" style="margin-right:8px;margin-bottom:4px"
                        @on-error="e => { e.target.src = errorImg }" />
                      <span class="name mine">{{item.msg.extra.userInfo.name}}:</span>
                      <span v-html="item.msg.msg" class="msg"></span>
                    </div>
                  </div>
                </div>
                <div class="cb">
                </div>
                <div class="chat_box_bottom2">
                  <div class="input-s">
                    <input :maxlength="30" type="text" @keyup.enter="send" v-model="msg" class="chat-input"></input>
                    <Button type="primary" @click="send" class="send-btn">发送</Button>
                  </div>
                </div>
              </Card>
              <Card class="chatcard" v-if="showdiscuss===false">
                <div id="chat">
                  <div style="margin-bottom:10px" class="addNote-contain">
                    <div class="addNote">
                      <div>
                        <input style="text" class="addNote-input" placeholder="未命名标题" v-model="noteTitle" />
                      </div>
                      <div style="padding-top:10px">
                        <textarea rows="3" cols="20" class="addNote-textarea" placeholder="输入内容"
                          v-model="noteContent" />
                        </textarea>
                      </div>
                    </div>
                    <div class="addNote-btn">
                      <button style="background:#434445;color:#A6A6A6;border-radius: 0 0 0 4px;"
                        @click="clear()">清空</button>
                      <button style="background:#3977C4;color:#D9D9D9;border-radius: 0 0 4px 0;"
                        @click="saveNote()">保存</button>
                    </div>
                  </div>
                  <div v-for="(item,index) in noteList" :key="item.id">
                    <div class="chat-item" style="border-bottom:1px solid #454545;padding:10px 0">
                      <span style="margin-right:10px">{{index+1}}</span>
                      <span class="noteTitle">{{item.title}}</span>
                      <span class="notebtnList">
                        <span @click="showSaveNoteModer(item.id)">修改</span>
                        <span @click="showDelete(item.id)">删除</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div class="changeNote">
                  <div>
                    <span style="font-size:14px;color:#ACACAC;float:left">修改笔记</span>
                    <span style="float:right;cursor:pointer;" @click="closeChangeNote">
                      <Icon type="ios-close" size="48" color="#FFFFFF" style="margin-top:-13px" />
                    </span>
                  </div>
                  <div style="clear:both"></div>
                  <div class="changeNote2">
                    <div style="border-bottom: 1px solid #656565">
                      <input style="text" class="changeNote-input" placeholder="未命名标题" v-model="noteTitle" />
                    </div>
                    <div style="flex:1;display:flex;flex-direction:column">
                      <textarea class="changeNote-textarea" placeholder="输入内容" v-model="noteContent" />
                      </textarea>
                    </div>
                  </div>
                  <div class="addNote-btn">
                    <button style="background:#DF595A;color:#FFFFFF;margin-right:20px"
                      @click="closeChangeNote">取消</button>
                    <button style="background:#3C88E8;color:#FFFFFF" @click="saveNote(noteId)">保存</button>
                  </div>
                </div>
              </Card>
            </div>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>

    <Modal v-model="modal1" title="删除笔记" @on-ok="deleteNote">
      <p>你确定要删除该笔记吗？</p>
    </Modal>
    <Modal v-model="savenoteModel" title="保存笔记" @on-ok="savecurrentNote" @on-cancel="unsavecurrentNote">
      <p>当前日记尚未保存，是否保存当前笔记？</p>
    </Modal>
    <Modal v-model="saveChangeNoteModel" title="保存笔记" @on-ok="saveChangeNote" @on-cancel="unsaveChangeNote">
      <p>是否保存当前笔记？</p>
    </Modal>
    <Modal v-model="modal" :title="title" width="800" footer-hide :mask-closable="false">
      <Exam :student_exam_id="student_exam_id" :sty="sty" @closeModal='closeModal' v-if="target === 'exam'"
        @success="handleSuccess" @name="name"></Exam>
      <Evaluate :student_exam_id="student_exam_id" v-if="target === 'evaluate'"></Evaluate>
    </Modal>
    <Modal v-model="issureSaveNote" title="保存笔记" @on-ok="issurecloseLive=true,saveNote(noteId)">
      <p>是否保存当前笔记？</p>
    </Modal>
    <Modal v-model="issurecloseLive" title="退出直播" @on-ok="closeLive">
      <p>你是否确定退出直播间？</p>
    </Modal>
    <Modal v-model="modal2" :width="600" :title="answertitle" footer-hide draggable scrollable>
      <p class="questionContain" style="margin-bottom:10px;overflow-y:scroll;max-height:200px;font-size:14px">
        问题：{{problemContent}}</p>
      <Input type="textarea" v-model="answer" :rows="4" placeholder="请输入问题答案..." />
      <div style="margin-top:10px;text-align:right">
        <Button type="success" @click="submitAnswer">确定</Button>
      </div>
    </Modal>
    <Modal v-model="modal3" :width="600" :title="answertitle" footer-hide draggable scrollable>
      <p class="questionContain" style="margin-bottom:10px;overflow-y:scroll;max-height:200px;font-size:14px">
        问题：{{problemContent}}</p>
      <RadioGroup vertical @on-change="selectAnwser" class="selectContain">
        <Radio v-for="(item,index) in topic" :key="index" :label='item.choose+"_"+"choose_content"'>
          <Icon type="social-apple"></Icon>
          <span>{{item.choose}}、</span>
          <span>{{item.choose_content}}</span>
        </Radio>
      </RadioGroup>
      <div class="showtime">
        作答时间：{{reply_time}}秒
        <button style="background:#15B5A8" @click="submitAnswer2()">提交111</button>
      </div>
    </Modal>

  </div>
</template>
<script>
import pdf from 'vue-pdf'
import { fullScreen, getSuffix } from '@/libs/util'
import live from '@/view/common/live' // 直播群聊相关
import TaskList from '@/view/class_common/task/task_list_m'
import modal_mixin from '@/view/mixins/modal_mixin'
import { MESSAGE_TYPE } from 'vue-baberrage'
import { get_ppt_option } from '@/api/common'
import Exam from '@/view/class_common/exam/exam'
import Evaluate from '@/view/class_common/exam/evaluate'
export default {
  components: {
    pdf,
    TaskList,
    Exam,
    Evaluate,
  },
  data () {
    return {
      student_courseware_id: this.$route.query.student_courseware_id,
      mode: this.$route.query.mode,
      unpdf: true, // 判断src是否为pdf，true：是
      barrageIsShow: true,
      savenoteModel: false,
      modal2: false,
      modal: false,
      saveChangeNoteModel: false,
      barrageList: [], // 弹幕数据
      barrageLoop: false,
      issurecloseLive: false,
      issureSaveNote: false,
      newNoteId: '',
      reply_time: '',

      quiz_id: '',
      sty: '',
      badge: 0,
      badgetask: 0,
      modal3: false,

      answertitle: '',
      answer: '',
      rob: 0,
      topic_type: '',
      topic: [],
      problemContent: '',
      selectChoose: '',
      // selectChooseContent: '',
      taskinList: [],
      loadedRatio: 0,
      exam_name: '',
      flvPlayer: null,
      messageList: [],
      testinList: [],
      msg: '',
      isSync: true, // 是否同屏
      student_courseware: { courseware: { courseware_files: [] } },
      courseware_id: '',
      group_chat_id: '',
      live_url: '',
      teacher_id: '',
      page: 1,
      numPages: undefined,
      showdiscuss: true,
      teacher_staus: '离线',
      live_type: '',
      noteList: [],
      noteTitle: '',
      noteContent: '',
      inNoteTitle: '',
      inNoteContent: '',
      delId: '',
      modal1: false,
      questionList: [],
      taskList: {},
      // exam_release_id: '',
      columns: [
        {
          title: '试卷标题',
          key: 'exam_name',
          width: 150
        },
        {
          title: '操作',
          key: 'action',
          width: 60,
          align: 'center',
          render: (h, params) => {
            console.log(params);

            let row = params.row
            let arr = ['考试', '继续', '查看答题', '查看结果', '-']
            let btnText = arr[row.status]
            // 这里点击要判断
            return (
              <div>
                <Button style={{ marginRight: '10px' }} size="small" type="info"
                  onClick={() => { this.detail(params.row) }}>
                  {btnText}
                </Button>
              </div>
            )
          }
        }
      ]
    }
  },
  computed: {
    file_stuffix () {
      return getSuffix(this.student_courseware.courseware.file_url)
    },
    currentdate () {
      var myDate = new Date()
      let yy = myDate.getFullYear()
      let mm = myDate.getMonth() + 1
      let dd = myDate.getDate()
      return yy + '年' + mm + '月' + dd + '日'
    },
    currentweek () {
      var myDate = new Date()
      let l = myDate.getDay()
      if (l === 1) {
        l = '一'
      } else if (l === 2) {
        l = '二'
      } else if (l === 3) {
        l = '三'
      } else if (l === 4) {
        l = '四'
      } else if (l === 5) {
        l = '五'
      } else if (l === 6) {
        l = '六'
      } else if (l === 7) {
        l = '天'
      }
      return l
    }
  },
  mixins: [live, modal_mixin],
  watch: {
    reply_time (n, o) {
      setTimeout(() => {
        if (n === 0) {
          this.reply_time = 0
          this.modal3 = false
        } else {
          this.reply_time = n - 1
        }
      }, 1000)
    },
    student_courseware_id (newVal, oldVal) {
      this.getStudentCourseware()
    },
    // quiz_id变化触发弹框
    quiz_id (n, o) {
      this.showProblem()

    },
    // task_release_id () {
    //   this.showTask()
    // },
    score (n, o) {
      this.getScore(n)
    }
  },
  methods: {
    name (data) {
      this.exam_name = data

    },
    closeModal () {
      this.modal = false
    },
    getDate (i) {
      return this.moment(i * 1000).format('YYYY-MM-DD')
    },
    returnTime (i) {
      setInterval(() => {
        return this.i--
      }, 1000)
    },
    selectAnwser (i) {
      let arr = i.split('_')

      console.log(arr[0]);
      this.selectChoose = arr[0]
      // this.selectChooseContent = arr[1]
    },
    showFilesList () {
      for (let i = 0; i < document.getElementsByClassName('allscreen').length; i++) {
        document.getElementsByClassName('allscreen')[i].style.display = 'none'
        document.getElementsByClassName('live-btnList-li')[i].style.background = '#161616'
        document.getElementsByClassName('live-btnList-li')[i].style.color = '#B6B6B6'
      }
      document.getElementsByClassName('live-btnList-li')[0].style.background = '#282A30'
      document.getElementsByClassName('live-btnList-li')[0].style.color = '#397ED6'
      document.getElementsByClassName('allscreen')[0].style.display = 'block'
    },
    showQuestionList () {
      for (let i = 0; i < document.getElementsByClassName('allscreen').length; i++) {
        document.getElementsByClassName('allscreen')[i].style.display = 'none'
        document.getElementsByClassName('live-btnList-li')[i].style.background = '#161616'
        document.getElementsByClassName('live-btnList-li')[i].style.color = '#B6B6B6'
      }
      document.getElementsByClassName('live-btnList-li')[1].style.background = '#282A30'
      document.getElementsByClassName('live-btnList-li')[1].style.color = '#397ED6'
      document.getElementsByClassName('allscreen')[1].style.display = 'block'
      this.axios.request({
        method: 'get',
        url: '/index.php/Student/Quiz/get_list',
        params: {
          student_courseware_id: this.student_courseware_id
        }
      }).then(res => {
        if (res.code === 200) {
          this.questionList = res.data.list
        }
      })
    },
    showTaskIn () {
      // this.tasklistShow = true
      for (let i = 0; i < document.getElementsByClassName('allscreen').length; i++) {
        document.getElementsByClassName('live-btnList-li')[i].style.background = '#161616'
        document.getElementsByClassName('live-btnList-li')[i].style.color = '#B6B6B6'
        document.getElementsByClassName('allscreen')[i].style.display = 'none'
      }
      document.getElementsByClassName('live-btnList-li')[2].style.background = '#282A30'
      document.getElementsByClassName('live-btnList-li')[2].style.color = '#397ED6'
      document.getElementsByClassName('allscreen')[2].style.display = 'block'
      this.badgetask = 0

    },
    checkNote () {
      if (this.noteTitle !== this.inNoteTitle || this.noteContent !== this.inNoteContent) {
        this.issureSaveNote = true
      } else {
        this.issurecloseLive = true
      }
    },
    savecurrentNote () {
      this.saveNote(this.noteId)
      this.showNote(this.newNoteId)
    },
    unsavecurrentNote () {
      this.showNote(this.newNoteId)
    },
    saveNote (i) {
      if (i === undefined) {
        i = ''
      }
      if (this.noteTitle !== '') {
        this.axios.request({
          method: 'post',
          url: '/index.php/student/studentNotes/save',
          data: {
            id: i,
            title: this.noteTitle,
            content: this.noteContent,
            courseware_id: this.courseware_id
          }
        }).then(res => {
          if (res.code === 200) {
            this.$Message.info('保存成功')
            this.inNoteContent = this.noteContent
            this.inNoteTitle = this.noteTitle
            this.getNotesData()
          }
        })
      } else {
        this.$Message.error('标记标题不能为空')
      }
    },
    showDelete (i) {
      this.modal1 = true
      this.delId = i
    },
    deleteNote () {
      this.axios.request({
        url: '/index.php/student/studentNotes/delete',
        method: 'post',
        data: {
          id: this.delId
        }
      }).then(res => {
        if (res.code === 200) {
          this.$Message.success('删除成功')
          this.getNotesData()
        }
      })
    },
    clear () {
      this.noteTitle = ''
      this.noteContent = ''
    },
    showSaveNoteModer (i) {
      if (this.noteTitle !== this.inNoteTitle || this.noteContent !== this.inNoteContent) {
        this.savenoteModel = true
        this.newNoteId = i
      } else {
        this.showNote(i)
      }
    },
    showNote (id) {
      this.axios.request({
        method: 'get',
        url: '/index.php/student/studentNotes/show',
        params: {
          id: id
        }
      }).then(res => {
        if (res.code === 200) {
          this.noteTitle = res.data.student_notes.title
          this.inNoteTitle = res.data.student_notes.title
          this.noteId = res.data.student_notes.id
          this.inNoteContent = res.data.student_notes.content
          this.noteContent = res.data.student_notes.content
          document.getElementsByClassName('changeNote')[0].style.display = 'flex'
        }
      })
    },
    changeType (i, e) {
      for (let i = 0; i < e.target.parentNode.children.length; i++) {
        e.target.parentNode.children[i].className = ''
      }
      e.target.className = 'selectChangActive'
      if (i === 1) {
        this.showdiscuss = false
        this.getNotesData()
      } else {
        this.showdiscuss = true
      }
    },
    getNotesData () {
      if (this.courseware_id === '') {
        return
      }
      this.axios.request({
        url: '/index.php/student/studentNotes/get_courseware_notes',
        method: 'get',
        params: {
          courseware_id: this.courseware_id
        }
      }).then(res => {
        if (res.code === 200) {
          this.noteList = res.message.student_notes_list
        }
      })
    },
    closeChangeNote () {
      if (this.noteTitle !== this.inNoteTitle || this.noteContent !== this.inNoteContent) {
        this.saveChangeNoteModel = true
      } else {
        this.unsaveChangeNote()
      }
    },
    saveChangeNote () {
      this.saveNote(this.noteId)
      this.noteId = ''
      this.noteContent = ''
      this.noteTitle = ''
      document.getElementsByClassName('changeNote')[0].style.display = 'none'
      this.inNoteContent = ''
      this.inNoteTitle = ''
    },
    unsaveChangeNote () {
      this.noteId = ''
      this.noteContent = ''
      this.noteTitle = ''
      document.getElementsByClassName('changeNote')[0].style.display = 'none'
      this.inNoteContent = ''
      this.inNoteTitle = ''
    },
    closeLive () {
      history.go(-1)
    },



    showProblem () {
      if (this.topic_type === 2) {
        this.modal2 = true
      } else {
        this.modal3 = true
      }
    },
    // showTask () {
    //   this.modalTask = ture
    // },
    submitAnswer () {
      if (this.answer === '') {
        this.$Message.error('请输入答案')
      } else {
        this.axios.request({
          method: 'post',
          url: 'index.php/Student/Quiz/submit_answer',
          data: {
            answer_content: this.answer,
            student_id: this.$store.state.user.userId,
            teacher_id: this.teacher_id,
            quiz_id: this.quiz_id,
            rob: this.rob,
            topic: this.topic_type
          }
        }).then(res => {
          console.log(res);

          if (res.code === 200) {
            this.$Message.success(res.message)
            this.modal2 = false
            this.answer = ''
          } else {
            this.$Message.success(res.message)
          }
        })
      }
    },
    submitAnswer2 () {
      if (this.selectChoose === '') {
        this.$Message.error('请选择答案')
      } else {
        this.axios.request({
          method: 'post',
          url: 'index.php/Student/Quiz/submit_answer',
          data: {
            answer_content: this.selectChoose,
            student_id: this.$store.state.user.userId,
            teacher_id: this.teacher_id,
            quiz_id: this.quiz_id,
            topic: this.topic_type
          }
        }).then(res => {
          console.log(res);
          if (res.code === 200) {
            this.$Message.success(res.message)
            this.modal3 = false
            this.selectChoose = ''
            this.reply_time = 0
          } else {
            this.$Message.success(res.message)
          }
        })
      }
    },
    detail (exam) {
      if (exam.exam_status === 0) { // 未考试的话。进去考试详情之前要发请求修改考试状态
        this.axios.request({
          method: 'post',
          url: '/index.php/Student/Exam/start_exam',
          data: {
            student_exam_id: exam.id
          }
        }).then(res => {
          if (res.code === 200) {
            exam.exam_status = 1
            this.sty = 0
            this.open('exam', exam.id, `测试 > ${exam.exam_name}`)
          }
        })
      } else if (exam.exam_status === 3) {
        this.open('evaluate', exam.id, `测试 > 评分结果 > ${exam.exam_name}`)
      } else {
        this.sty = exam.status
        this.open('exam', exam.id, `测试 > ${exam.exam_name}`)
      }
    },
    open (target, target_id, title) {
      this.modal = true
      this.target = target
      this.title = title
      this.student_exam_id = target_id
    },
    addToList (getdata) { // 弹幕信息设置
      let data = getdata.msg
      this.barrageList.push({
        id: ++this.currentId, // 弹幕id
        avatar: data.extra.userInfo.avator !== '' ? data.extra.userInfo.avator : '../../../assets/images/default.jpg', // 头像
        msg: data.msg, // 弹幕信息
        time: data.msg.length > 5 ? 7 : data.msg.length > 10 ? 5 : 10, // 弹幕显示时长
        type: MESSAGE_TYPE.NORMAL // 弹幕样式
      })
    },
    send () {
      if (!this.msg.trim()) return
      this.sendMsg(this.msg)
    },
    move (e) {
      var va = this.$refs.switch_input
      var inx = null
      var iny = null
      inx = e.clientX - va.offsetLeft
      iny = e.clientY - va.offsetTop
      document.onmousemove = function (e) {
        if (e.clientX - inx >= 0 && e.clientX - inx <= document.body.clientWidth - va.offsetWidth) {
          va.style.left = e.clientX - inx + 'px'
        }
        if (e.clientY - iny >= 0 && e.clientY - iny <= document.body.clientHeight - va.offsetHeight) {
          va.style.top = e.clientY - iny + 'px'
        }
        va.style.margin = 0
      }
      document.onmouseup = function () {
        document.onmousemove = null
        document.onmouseup = null
      }
      return false
    },
    ergeTypeChange () {
      if (document.getElementsByClassName('live-l')[0].style.display === 'none') {
        document.getElementsByClassName('live-l')[0].style.display = 'block'
        document.getElementsByClassName('live-r')[0].style.width = '87.5%'
        document.getElementsByClassName('live-header')[0].style.display = 'block'
      } else {
        document.getElementsByClassName('live-l')[0].style.display = 'none'
        document.getElementsByClassName('live-r')[0].style.width = '100%'
        document.getElementsByClassName('live-header')[0].style.display = 'none'
      }
    },
    handleLiveTypeChange (type) {
      this.live_type = type
      if (type === 'live') {
        setTimeout(() => {
          if (flvjs.isSupported()) {
            var videoElement = document.getElementById('videoElement')
            this.flvPlayer = flvjs.createPlayer({
              type: 'flv',
              url: this.live_url,
              isLive: true
            })
            this.flvPlayer.attachMediaElement(videoElement)
            this.flvPlayer.load()
            this.flvPlayer.play()
          }
        }, 500)
      } else {
        // this.flvPlayer.pause()
        // this.flvPlayer.unload()
        // this.flvPlayer.detachMediaElement()
        // this.flvPlayer.destroy()
        this.flvPlayer = null
      }
    },
    handlePageChange (action) { // 切换pdf页码
      if (action === 'up') {
        if (this.page > 1) {
          this.page--
        } else {
          this.$Message.error('前面没有了')
        }
      } else {
        if (this.page < this.numPages) {
          this.page++
        } else {
          this.$Message.error('已经是最后一页了')
        }
      }
      document.getElementById('pdf1').scrollTop = 0
    },
    error: function (err) {
      console.log(err)
    },
    // 关闭全屏
    end_full () {
      // 各浏览器兼容处理
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      }
    },

    handleOnMessage (data) {
      if (data.status !== undefined) {
        if (data.status === 'ture') {
          this.$Message.success({
            content: '教师已关闭禁言',
            duration: 4
          })
        } else if (data.status === 'flase') {
          this.$Message.error({
            content: '教师已开启禁言',
            duration: 4
          })
        }
      }
      if (data.content !== undefined) {
        this.problemContent = data.content
        this.teacher_id = data.teacher_id
        this.quiz_id = data.quiz_id
        this.topic_type = data.topic_type
        if (data.topic_type === 2) {
          this.rob = data.rob
          if (this.rob === 1) {
            this.answertitle = '抢答'
          } else {
            this.answertitle = '提问'
          }
        } else if (data.topic_type === 1) {
          this.answertitle = '请在规定时间内作答'
          this.reply_time = data.reply_time
          this.topic = data.topic
        }
      } else if (data.score !== undefined) {
        this.score = data.score
      } else if (data.exam_release_id !== undefined) {
        this.badge = 1
        this.$store.commit('setteacher_id_exam', data.teacher_id)
      }
      else if (data.task_release_id !== undefined) {
        this.badgetask = 1
        this.$store.commit('setteacher_id_task', data.teacher_id)
      }
      // this.problem = data.data
      // let _this = this
      // 监听websocket消息
      let type = data.type || ''
      switch (type) {
        // Events.php中返回的init类型的消息，将client_id发给后台进行uid绑定
        case 'init':
          this.bindUser(data.client_id)
          break
        case 'ppt':
          if (this.isSync) {
            this.page = parseInt(data.page)
            document.getElementById('pdf1').scrollTop = data.scrollTop
          }
          break
        case 'online':
          this.teacher_staus = '在线'
          break
        case 'offline':
          this.teacher_staus = '离线'
          break
        default: {
          this.addToList(data)
          if (data.target === this.group_chat_id) {
            this.messageList.push(data)
            this.scrollToBottom()
          } else {
            // _this.$refs.task_list && _this.$refs.task_list.$emit('message', data)
          }
        }
      }
    },
    fullScreen: id => fullScreen(id),
    getPptOption () {
      if (!this.isSync) return
      let _this = this
      get_ppt_option(this.group_chat_id).then(res => {
        let data = res.data
        if (res.code === 200) {
          if (!data.options) {
            return
          }
          _this.page = parseInt(data.options.page)
          document.getElementById('pdf').scrollTop = data.options.scrollTop
        }
      })
    },
    showTestIn () {
      this.axios.request({
        url: '/index.php/Student/Exam/page',
        method: 'post',
        data: {
          page_size: 20,
          page_no: 1,
          // searchType: 0,
          type: 2,
          // score_status: -1,
          courseware_id: this.courseware_id
        }
      }).then(res => {
        if (res.code === 200) {
          this.testinList = res.data.list
          this.badge = 0
        }
      })
      for (let i = 0; i < document.getElementsByClassName('allscreen').length; i++) {
        document.getElementsByClassName('allscreen')[i].style.display = 'none'
        document.getElementsByClassName('live-btnList-li')[i].style.background = '#161616'
        document.getElementsByClassName('live-btnList-li')[i].style.color = '#B6B6B6'
      }
      document.getElementsByClassName('live-btnList-li')[3].style.background = '#282A30'
      document.getElementsByClassName('live-btnList-li')[3].style.color = '#397ED6'
      document.getElementsByClassName('allscreen')[3].style.display = 'block'
    },
    handleSuccess () {
      this.modal = false
      this.target = ''
      this.showTestIn()
    },
    getStudentCourseware () {
      if (!this.student_courseware_id) {
        return false
      }
      this.axios.request({
        method: 'get',
        url: '/index.php/Student/Courseware/detail',
        params: {
          student_courseware_id: this.student_courseware_id
        }
      }).then(res => {
        console.log(res);
        if (res.code === 200) {
          this.student_courseware = res.data.student_courseware
          this.courseware_id = res.data.student_courseware.courseware.id
          let id_str = res.data.live_class_ids.join(',')
          this.group_chat_id = `courseware_${this.student_courseware.courseware.id}_${id_str}`
          this.live_url = res.data.live_url
          var u = navigator.userAgent
          var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
          if (this.mode === 'live') {
            if (isiOS) {
              let mvdideo = document.getElementById('myVideo')
              mvdideo.src = res.data.live_urls
              mvdideo.style.display = 'block'
              mvdideo.play()
            } else {
              this.handleLiveTypeChange(this.mode)
              setTimeout(() => {
                this.live_url = res.data.live_url
                document.getElementById('videoElement').style.display = 'block'
              }, 1000)
            }
          }

          this.axios.request({
            method: 'get',
            url: '/index.php/Student/Quiz/get_list',
            params: {
              student_courseware_id: this.student_courseware_id
            }
          }).then(res => {
            console.log(res);

            if (res.code === 200) {
              this.questionList = res.data.list
            }
          })
          this.axios.request({
            method: 'get',
            url: 'index.php/Student/Task/getClassMiddleTask',
            params: {
              student_courseware_id: this.student_courseware_id
            }
          }).then(res => {
            if (res.code === 200) {
              this.taskinList = res.data.list.filter(v => {
                return v.release_status === 1
              });
              console.log(res);
              // this.taskinList = res.data.list
            }
          })
          this.axios.request({
            url: '/index.php/Student/Exam/page',
            method: 'post',
            data: {
              page_size: 20,
              page_no: 1,
              // searchType: 0,
              type: 2,
              // score_status: -1,
              courseware_id: this.courseware_id
            }
          }).then(res => {
            if (res.code === 200) {
              this.testinList = res.data.list
            }
          })
          this.getPptOption()
          this.initChat()
          setTimeout(() => {
            this.ws.send(JSON.stringify({
              group: this.group_chat_id,
              uid: `${this.$store.state.user.userInfo.userType}_${this.$store.state.user.userId}`,
              user_type: this.$store.state.user.userInfo.userType,
              action: 'init'
            }))
          }, 1000)
        }
      })
    },
    closeDetailList (e) {
      e.target.parentNode.parentNode.parentNode.parentNode.style.display = 'none'
    },
    closeList (e) {
      if (e.target.className === 'allscreen') {
        e.target.style.display = 'none'
      } else {
        return false
      }
    },
    getLiveHeight () {
      for (let i = 0; i < document.getElementsByClassName('live-btnList-li').length; i++) {
        document.getElementsByClassName('live-btnList-li')[i].style.lineHeight = document.getElementsByClassName('live-btnList-li')[i].offsetHeight + 'px'
      }
    }
  },
  created () {
    this.getStudentCourseware()
  },
  mounted () {
    const that = this
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth
        that.screenWidth = window.screenWidth
      })()
    }
    setTimeout(() => {
      this.getLiveHeight()
    }, 1500)
  }
}
</script>
<style>
.live-student-bottom-r img {
  margin-left: 20px;
}
.mine {
  color: #3b88d0;
}
.msg {
  padding: 5px;
  color: #a4a4a4;
}
.noteTitle {
  flex: 1;
  padding-right: 5px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.notebtnList {
  float: right;
}
.notebtnList span {
  padding: 2px 6px;
  border: 1px solid #858585;
  margin: 0 4px;
  border-radius: 4px;
  cursor: pointer;
}
.addNote {
  background: #545454;
  padding: 0 14px;
}
.changeNote2 {
  margin-bottom: 14px;
  background: #494949;
  flex: 1;
  display: flex;
  flex-direction: column;
}
.addNote-input {
  width: 100%;
  background: #545454;
  outline: none;
  border: none;
  border-bottom: 1px solid #656565;
  padding: 8px 0;
  color: #e2e2e2;
}
.changeNote-input {
  width: 100%;
  background: #494949;
  outline: none;
  border: none;
  padding: 10px 14px;
  color: #ffffff;
}
.addNote-textarea {
  width: 100%;
  color: #e2e2e2;
  height: 150px;
  background: #545454;
  outline: none;
  border: none;
}
.changeNote-textarea {
  height: 100%;
  width: 100%;
  padding: 10px 14px;
  color: #d1d1d1;
  height: 150px;
  background: #494949;
  outline: none;
  border: none;
  flex: 1;
}
.addNote-btn {
  width: 100%;
  display: flex;
}
.addNote-btn > button {
  display: inline-block;
  flex: 1;
  height: 50px;
  outline: none;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}
.addNoteList-btn {
  cursor: pointer;
  outline: none;
  background: #323232;
  border: 1px solid #858585;
  color: #8e8e8e;
  padding: 5px 10px;
  border-radius: 6px;
  margin-bottom: 10px;
}
.live-student-collapse {
  background: #3f4149;
  border: none;
  font-size: 14px;
}
.live-student-collapse > .ivu-collapse-item {
  border: none;
  border-bottom: 1px solid #272930;
}
.live-student-collapse .ivu-collapse-header {
  color: #ffffff;
}
.live-student-collapse
  > .ivu-collapse-item.ivu-collapse-item-active
  > .ivu-collapse-header {
  border-bottom: 1px solid #64666f;
  color: #ffffff;
}
.live-student-collapse > .ivu-collapse-item > .ivu-collapse-header > i {
  color: #767678;
}
.live-student-collapse > .ivu-collapse-item > .ivu-collapse-header {
  color: #ffffff;
}
.live-student-collapse .ivu-collapse-content {
  background: #3f4149;
  color: #d1d1d1;
  max-height: 250px;
  overflow-y: scroll;
}
.allscreen {
  width: 100%;
  height: 100%;
  display: none;
  position: absolute;
  left: 0;
  z-index: 5;
  background: rgb(0, 0, 0, 0.7);
}
.show-list {
  background: #2a2832;
  width: 500px;
  position: absolute;
  height: 100%;
  z-index: 10;
  padding: 0 20px;
  display: block;
  color: #ffffff;
  left: 0;
  overflow-y: scroll;
  padding-bottom: 20px;
}
.show-list-title {
  margin: 16px 0;
  display: inline-block;
  font-size: 14px;
  color: #ffffff;
}
.changeNote {
  width: 100%;
  height: 100%;
  background: #545454;
  position: absolute;
  width: 94.5%;
  height: 97%;
  border-radius: 4px;
  top: 10px;
  left: 10px;
  padding: 12px 20px;
  flex-direction: column;
  display: none;
}
.ques-contain {
  display: inline-block;
  max-width: 300px;
  overflow: hidden;
  vertical-align: bottom;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.testinTable .ivu-table table {
  width: 100% !important;
}
.selectContain {
  width: 100%;
}
.showtime {
  float: right;
  margin: 10px 0;
  height: 32px;
  color: #000000;
}
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
.addNote-textarea::-webkit-scrollbar {
  width: 0 !important;
}
#pdf1::-webkit-scrollbar {
  width: 0 !important;
}
.changeNote-textarea::-webkit-scrollbar {
  width: 0 !important;
}
.show-list::-webkit-scrollbar {
  width: 0 !important;
}
.questionContain::-webkit-scrollbar {
  width: 0 !important;
}
.live-student-collapse .ivu-collapse-content::-webkit-scrollbar {
  width: 0 !important;
}
</style>
