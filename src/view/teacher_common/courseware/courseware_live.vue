<template>
  <Row class="live_body">
    <div @click="end_live" class='class_over eto-box-shadow'>下课</div>
    <div class="live_box">
      <Row>
        <Col :span="18">

          <!-- pdf -->
          <Card class="pdfcard" style="background:#3a3a3a;overflow-y:auto;">
            <div id="pdf" v-if="unpdf">
              <!-- 弹幕组件：vue-baberrage -->
              <vue-baberrage
                class="baberrage"
                style="z-index:99999;height:100px;padding-top:10px;"
                :isShow= "barrageIsShow"
                :barrageList = "barrageList"
                :loop = "barrageLoop"
                :boxHeight="100"
              >
              </vue-baberrage>
              <div class="switch_input switch_input_style" style="height:60px" ref="switch_input" @mousedown="move($event)">
                <div style="display:flex;justify-content: space-around;height:66px;line-height:66px;align-items: center;">
                  <Tooltip content="上一页" placement="top">
                    <span class="page_style" @click="last_page"><Icon type="ios-arrow-back" /></span>
                  </Tooltip>
                  <Tooltip content="下一页" placement="top">
                    <span class="page_style" @click="next_page"><Icon type="ios-arrow-forward" /></span>
                  </Tooltip>
                  <Tooltip content="退出全屏" placement="top">
                    <span class="page_style" @click="end_full"><Icon type="md-contract" /></span>
                  </Tooltip>
                  <Tooltip :content="!isshare ? '取消广播同步' : '开始广播同步课件'" placement="top">
                    <div class="page_style" :style="{background: isshare ? `#fff` : 'red', cursor: 'pointer'}"  @click="isshare = !isshare"> <Icon type="md-wifi" /></div>
                  </Tooltip>
                  <Tooltip content="弹幕" placement="top">
                    <span class="page_style" :style="{background: barrageIsShow ? 'red' : `#fff`, cursor: 'pointer'}" @click="barrageIsShow = !barrageIsShow"><Icon type="ios-outlet-outline" /></span>
                  </Tooltip>
                  <Tooltip content="移动" placement="top">
                    <span class="page_style" style="cursor: move;"><Icon type="md-move"/></span>
                  </Tooltip>
                </div>
                <div style="position:fixed;bottom:10px;right:30px">
                  <Select v-model="material_choose" style="width:160px" class="select_material" placement="top" placeholder="选择素材预览">
                   <Option v-for="maitem in material" :value="maitem.file_url" :key="maitem.id" @click.native="option_click(maitem)">{{ maitem.file_name }}</Option>
                  </Select>
                </div>
              </div>

              <pdf
                ref="pdf"
                :src="src"
                :page="page"
                @progress="loadedRatio = $event"
                @error="error"
                @num-pages="numPages = $event"
                @link-clicked="page = $event"
                style="width:100%;"
              >
              </pdf>
            </div>
            <div v-else style="width:100%;height:444px;overflow-y:auto;margin: 10px auto">
              <embed :src="src" width="100%" height="440px" autostart="false">
            </div>
          </Card>
          <div class="btn_live_style">
           <Button type="primary" class="ques_btn" size="small" @click="selectMethod">提问</Button>
           <span @click="show_online = true">在线学生<b> : </b>{{online_data.online_count }}</span>
           <!-- <Button type="primary" @click="test_btn">{{test_btn_content}}</Button> -->
           <Select v-model="material_choose" style="width:160px" class="select_material" placement="top" placeholder="选择素材预览">
             <Option v-for="maitem in material" :value="maitem.file_url" :key="maitem.id" @click.native="option_click(maitem)">{{ maitem.file_name }}</Option>
           </Select>
           <span @click="last_page" class="live-fz-20"><Icon type="ios-arrow-dropleft" /></span>
           <InputNumber
             v-model.number="page"
             type="number"
             :max="numPages"
             :min="1"
             style="width:50px"
             size="small"
             @on-change="handlePageChange"
           ></InputNumber>
           &nbsp;&nbsp;/{{numPages}}
           <span @click="next_page" class="live-fz-20"><Icon type="ios-arrow-dropright" /></span>
           <span @click="isshare = !isshare" :style="{color:isshare === false ? '#fff' : 'red'}">{{isshare === false ? '同步' : '关闭'}}</span>
           <span @click="qrModal = true" class="qrcode_btn"></span>
           <span @click="barrageIsShow = false" class="danmushow" v-show="barrageIsShow"></span>
           <span @click="barrageIsShow = true" class="danmuopen" v-show='!barrageIsShow'></span>
           <span @click="fullScreen('pdf')"></span>
          </div>
        </Col>
        <!-- 聊天框 -->
        <Col :span="6">
          <Card style="border-radius:0;border:0;padding:0;background: #3a3a3a;" class="chatcard">
            <div id="chat">
              <div v-for="item in chatlist" :key="item.id" class="chat-item" >
                  <div class="userInfo" style=" word-break: break-all">
                      <span style="color:#3B88D0;">{{item.msg.extra.userInfo.name}}: </span>
                      <span class="time" style="margin-right:10px">({{item.sendTime | timeFrom}})</span>
                      <span v-html="item.msg.msg"></span>
                  </div>
                </div>
              </div>
              <div class="chat_box_bottom">
                <span class="msg_length">{{msg.length}} / 30</span>
                <Input :maxlength="30" type="text"  v-model="msg" class="chatinput" placeholder="和同学们交流一下吧" @on-enter='send'></Input>
                <Button type="primary" @click="send()" class="sendbtn">发送</Button>
              </div>
          </Card>
        </Col>
      </Row>
    </div>

    <!-- 课件管理 -->

    <Row style="margin:0;padding:0;background-color:#16161A;height: 100%;">
       <div class="live_box">
          <h2 style="margin:20px 0;letter-spacing: 5px;">课件管理:查看任务，测试，作业详情</h2>
        <Col :xxl='3' :xl="4" :sm='4' :xs='4'>
        <Menu theme="dark" active-name="1" @on-select='Menu_change' style="width:100%;">
          <Submenu name="1">
              <template slot="title">
                  任务测试
              </template>
              <MenuItem name="1-1">课中</MenuItem>
              <MenuItem name="1-2">课后</MenuItem>
          </Submenu>
          <MenuItem name="2">
              课件附件列表
          </MenuItem>
          <MenuItem name="3">
              提问列表
          </MenuItem>
        </Menu>
        </Col>
        <Col :xl="{span:19,offset:1}" :sm='19' :xs='19'>
            <div v-if="courseware_list_type === 'maitem'" class="maitem_list">
              <Row style="font-size:16px;font-weight:bold">
                <Col :span="5">对应页码</Col>
                <Col :span="19">附件名</Col>
              </Row>
              <p v-if="Object.keys(material_total).length==0" style="margin:10px">暂无附件</p>
               <Row v-for="item in material_total" :key="item.id" style="margin:6px 0">
                <Col :span="4" :offset="1">{{item.page}}</Col>
                <Col :span="19" @click.native="option_click(item)"><span class="maitem_name">{{item.file_name}}</span></Col>
              </Row>
            </div>
            <div v-if="courseware_list_type === 'question'" class="QL">
              <questionList ref="questionList" :t_id="t_id"></questionList>
            </div>
            <div v-if="courseware_list_type === 'inclass'">
              <Menu mode="horizontal" theme="dark" active-name="1" @on-select='Menu_change2' style="margin-bottom:20px">
                  <MenuItem name="4">
                    任务管理
                  </MenuItem>
                  <MenuItem name="5">
                    测试管理
                  </MenuItem>
              </Menu>
                <div v-if="courseware_list_type2 === 'task'">
                <p v-if="Object.keys(courseware_list).length==0" style="margin:10px">暂无任务</p>
                <div v-for="in_item in courseware_list" :key="in_item.name + 'in_task_item'">
                  <h3 style="margin-left:11px;">任务名称:  {{in_item.name}}</h3>
                  <div class="table_flex">
                    <div class="table_item" v-for="in_task_item in in_item.array" :key="in_task_item.task_release_id">
                    <p>班级：{{in_task_item.class_name}}</p>
                    <p>名称：<span style="color:#2D8CF0;cursor:pointer;" @click="taskname = in_task_item.task_name,timetable_id = in_task_item.timetable_id,rowid = in_task_item.id,tasktype = '3',click_type = 'info',isshowaddtask = true">{{in_task_item.task_name}}</span></p>
                    <div class="action_btn">
                      操作：
                      <span v-if="in_task_item.release_status === 0" class="action_btn_style" @click="release_id = in_task_item.task_release_id,release_type='task',release()">发布</span>
                      <span v-if="in_task_item.release_status === 1" class="action_btn_style" @click="unrelease('task',in_task_item.task_release_id)">撤回</span>
                      <span v-if="in_task_item.release_status === 1" class="action_btn_style" @click="answer(in_task_item)">回复</span>
                      <span v-if="in_task_item.release_status === 1" class="action_btn_style" @click="release_id = in_task_item.task_release_id,isevaluationshow = true">评价</span>
                      <span v-if="in_task_item.release_type === 1 && in_task_item.release_status === 1" class="action_btn_style" @click="release_id = in_task_item.task_release_id,changeleader()">更换组长</span>
                    </div>
                  </div>
                  </div>
                </div>
              </div>
              <div v-if="courseware_list_type2 === 'test'">
                <p v-if="Object.keys(courseware_list).length==0" style="margin:10px">暂无测试</p>
                <div v-for="in_item in courseware_list" :key="in_item.name + 'in_exam_item'">
                  <h3 style="margin-left:11px;">测试名称:  {{in_item.name}}</h3>
                  <div class="table_flex">
                    <div class="table_item" v-for="in_test_item in in_item.array" :key="in_test_item.exam_release_id">
                      <p>班级：{{in_test_item.class_name}}</p>
                      <p>名称：<span style="color:#2D8CF0;cursor:pointer;" >{{in_test_item.exam_name}}</span></p>
                      <div class="action_btn">
                        操作：
                        <span v-if="in_test_item.release_status === 0" class="action_btn_style" @click="release_id = in_test_item.exam_release_id,release_type='test',release()">发布</span>
                        <span v-if="in_test_item.release_status === 1" class="action_btn_style" @click="unrelease('test',in_test_item.exam_release_id)">撤回</span>
                        <span v-if="in_test_item.release_status === 1" class="action_btn_style" @click="release_id = in_test_item.exam_release_id,isshowhomeworkcheck = true">查询</span>
                        <span v-if="in_test_item.release_status === 1" class="action_btn_style" @click="analyze(in_test_item)">分析</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="courseware_list_type === 'afterclass'">
              <Menu mode="horizontal" theme="dark" active-name="1" @on-select='Menu_change3' style="margin-bottom:20px">
                  <MenuItem name="6">
                    任务管理
                  </MenuItem>
                  <MenuItem name="7">
                    测试管理
                  </MenuItem>
                  <MenuItem name="8">
                    作业管理
                  </MenuItem>
              </Menu>
              <div v-if="courseware_list_type2 === 'task'">
                <p v-if="Object.keys(courseware_list).length==0" style="margin:10px">暂无任务</p>
                <div v-for="in_item in courseware_list" :key="in_item.name + 'in_task_item'">
                  <h3 style="margin-left:11px;">任务名称:  {{in_item.name}}</h3>
                  <div class="table_flex">
                    <div class="table_item" v-for="in_task_item in in_item.array" :key="in_task_item.task_release_id">
                    <p>班级：{{in_task_item.class_name}}</p>
                    <p>名称：<span style="color:#2D8CF0;cursor:pointer;" @click="taskname = in_task_item.task_name,timetable_id = in_task_item.timetable_id,rowid = in_task_item.id,tasktype = '3',click_type = 'info',isshowaddtask = true">{{in_task_item.task_name}}</span></p>
                    <div class="action_btn">
                      操作：
                      <span v-if="in_task_item.release_status === 0" class="action_btn_style" @click="release_id = in_task_item.task_release_id,release_type='task',release()">发布</span>
                      <span v-if="in_task_item.release_status === 1" class="action_btn_style" @click="unrelease('task',in_task_item.task_release_id)">撤回</span>
                      <span v-if="in_task_item.release_status === 1" class="action_btn_style" @click="answer(in_task_item)">回复</span>
                      <span v-if="in_task_item.release_status === 1" class="action_btn_style" @click="release_id = in_task_item.task_release_id,isevaluationshow = true">评价</span>
                      <span v-if="in_task_item.release_type === 1 && in_task_item.release_status === 1" class="action_btn_style" @click="release_id = in_task_item.task_release_id,changeleader()">更换组长</span>
                    </div>
                  </div>
                  </div>
                </div>
              </div>
              <div v-if="courseware_list_type2 === 'test'">
                <p v-if="Object.keys(courseware_list).length==0" style="margin:10px">暂无测试</p>
                <div v-for="in_item in courseware_list" :key="in_item.name + 'in_exam_item'">
                  <h3 style="margin-left:11px;">测试名称:  {{in_item.name}}</h3>
                  <div class="table_flex">
                    <div class="table_item" v-for="in_test_item in in_item.array" :key="in_test_item.exam_release_id">
                      <p>班级：{{in_test_item.class_name}}</p>
                      <p>名称：<span style="color:#2D8CF0;cursor:pointer;" >{{in_test_item.exam_name}}</span></p>
                      <div class="action_btn">
                        操作：
                        <span v-if="in_test_item.release_status === 0" class="action_btn_style" @click="release_id = in_test_item.exam_release_id,release_type='test',release()">发布</span>
                        <span v-if="in_test_item.release_status === 1" class="action_btn_style" @click="unrelease('test',in_test_item.exam_release_id)">撤回</span>
                        <span v-if="in_test_item.release_status === 1" class="action_btn_style" @click="release_id = in_test_item.exam_release_id,isshowhomeworkcheck = true">查询</span>
                        <span v-if="in_test_item.release_status === 1" class="action_btn_style" @click="analyze(in_test_item)">分析</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="courseware_list_type2 === 'homework'">
                <p v-if="Object.keys(courseware_list).length==0" style="margin:10px">暂无作业</p>
                <div v-for="after_item in courseware_list" :key="after_item.name + 'after_homework_item'">
                  <h3 style="margin-left:11px;">作业名称:  {{after_item.name}}</h3>
                  <div class="table_flex">
                  <div class="table_item" v-for="after_homework_item in after_item.array" :key="after_homework_item.homework_release_id">
                    <p>班级：{{after_homework_item.class_name}}</p>
                    <p>名称：<span style="color:#2D8CF0;cursor:pointer;" @click="timetable_id = after_homework_item.timetable_id,open_homework_info(after_homework_item)">{{after_homework_item.homework_name}}</span></p>
                    <div class="action_btn">
                      操作：
                      <span v-if="after_homework_item.release_status === 0" class="action_btn_style" @click="release_id = after_homework_item.homework_release_id,release_type='homework',release()">发布</span>
                      <span v-if="after_homework_item.release_status === 1" class="action_btn_style" @click="unrelease('homework',after_homework_item.homework_release_id)">撤回</span>
                      <span v-if="after_homework_item.release_status === 1" class="action_btn_style" @click="release_id = after_homework_item.homework_release_id,isshowevalist = true">批改</span>
                    </div>
                  </div>
                  </div>
                </div>
              </div>
            </div>
        </Col>
      </div>
    </Row>

    <!-- 新增modal ------------------>
    <Modal v-model="isshouwMaterial" :width="1000" title="浏览素材">
      <div v-if="isshouwMaterial">
         <embed :src="Material_url" width="100%" height="440px" autostart="false">
      </div>
    </Modal>
    <!-- 任务发布 -->
    <Modal v-model="show_release" title="发布" :mask-closable='false'  footer-hide>
        <div v-if="show_release"  style="height:150px;">
            <h3 style="margin:10px 0;">选择发布类型：</h3>
            <RadioGroup v-model="release_for_choose" style="height:30px;" vertical>
                <Radio label="2" style="padding-top:10px;" v-show="is_in === false">
                    <span>按个人发布</span>
                </Radio>
                <Radio label="1" style="padding-top:10px;">
                    <span>按小组发布</span>
                    <div style="display:inline;" v-if="release_for_choose === '1'">
                        <Input style="width:40px;margin:0 5px;" type="text" number size="small" v-model="teamnumber" />人<Tag color="warning" style="height:auto;margin:0 10px;padding:0 5px;">权重之和需为100</Tag><br>
                        <span>&nbsp;&nbsp;&nbsp;&nbsp;
                          老师评权重 <Input style="width:40px;margin:0 5px;" number type="text" size="small" v-model="release_teacher" />|
                         组长评权重 <Input style="width:40px;margin:0 5px;" number type="text" size="small" v-model="release_leader" />
                         | 组员评组长权重<Input style="width:40px;margin:0 5px;" number type="text" size="small" v-model="release_team" /></span>
                      </div>
                </Radio>
            </RadioGroup>
            <div style="position:relative;top:65px;"><Button @click="release" type="primary" size="small">发布</Button></div>
        </div>
    </Modal>

    <!-- 更换小组组长 -->
    <div v-if="ischangeleader">
      <Modal v-model="ischangeleader"  footer-hide width="1000" title="更换小组组长">
        <changeLeader :task_release_id='release_id'></changeLeader>
      </Modal>
    </div>

    <!-- 任务评价 -->
    <div v-if="isevaluationshow">
      <Modal v-model="isevaluationshow" width="1000"  :mask-closable='false' title="评价列表" footer-hide>
            <addevaluation :rowid="release_id"></addevaluation>
      </Modal>
    </div>

    <!-- 测试结果查询 -->
    <div v-if="isshowhomeworkcheck">
      <Modal v-model="isshowhomeworkcheck"  title="考试结果查询" :mask-closable='false' footer-hide width="1000" >
          <StudentExamList :exam_release_id="release_id" ></StudentExamList>
      </Modal>
    </div>

    <!-- 测试结果分析 -->
    <Modal v-model="isshowanalyze"  title="考试结果分析" footer-hide fullscreen v-show="isgetinfo">
      <div v-if="isshowanalyze">
        <addtestanalyze :analyzelist="analyzelist" ></addtestanalyze>
      </div>
    </Modal>

    <!-- 作业评价 -->
    <Modal v-model="isshowevalist" width="1000" :mask-closable='false' title="评价列表" footer-hide>
      <div v-if="isshowevalist">
        <StudentHomeworkList :homework_release_id="release_id" ></StudentHomeworkList>
      </div>
    </Modal>

    <!-- 任务详情 -->
    <div v-if="isshowaddtask">
      <Modal v-model="isshowaddtask" width="1000" footer-hide :title="taskname" :mask-closable='false'>
          <TaskReleaseDetail :task_release_id="rowid" ></TaskReleaseDetail>
      </Modal>
    </div>

    <!-- 查看测试详情 -->
    <Modal v-model="isshowaddclass1" :title="test_name" fullscreen footer-hide>
      <div v-if="isshowaddclass1">
        <!-- <ExamReleaseDetail :exam_release_id="rowid" ></ExamReleaseDetail> -->
         <ExamEdit :timetable_id="timetable_id" :exam_release_id="rowid"
          :action_type="3" :courseware_id="courseware_id" :teacher_course_id="$router.query.teacher_course_id" :type="2"
         ></ExamEdit>
      </div>
    </Modal>

    <!-- 作业详情 -->
    <div v-if="isshowaddhomework">
      <Modal v-model="isshowaddhomework"  :title="homeworkname" footer-hide width="1000"  :mask-closable='false' :styles="{top: '20px'}">
             <HomeworkReleaseDetail :homework_release_id="rowid"  ></HomeworkReleaseDetail>
      </Modal>
    </div>

    <!-- 任务提问 -->
    <Modal v-model="isshowreply"  title="问题列表" footer-hide :mask-closable='false' width="1000">
        <div v-if="isshowreply">
          <TaskQuestionList :task_release_id="rowid" ></TaskQuestionList>
        </div>
    </Modal>

    <!-- 二维码 -->
    <Modal v-model="qrModal" :width="1000" title="二维码">
      <div id="qrcode" style="display: flex;justify-content: center;"></div>
    </Modal>
    <!-- 在线状态 -->
    <Modal v-model="show_online" :width="500" :title="`当前在线人数 : ${online_data.online_count }`" :styles="{top: '20px'}">
      <Online :online_data='online_data' v-if="show_online"></Online>
    </Modal>
    <!-- 输入问题 -->
    <Modal v-model="inputProblem" :width="600" title="请输入问题" footer-hide>
      <div>
        <div style="font-weight:bold">当前在线学生数:{{online_data.online_count }}</div>
        <Input v-model="problem" type="textarea" placeholder="请输入问题..." :rows="4"/>
        <div style="margin-top:10px;text-align:right">
           回答人数：<InputNumber v-model="studentNumber"/>
          <Button type="success" @click="selectStudent">确定</Button>
        </div>
      </div>
    </Modal>
    <!-- 选择回答问题的学生 -->
    <Modal v-model="isshowStudent" :width="600" title="提问" footer-hide>
      <coursewareQuestion :online_data='online_data' @closeList="closeList" :group_chat_id='group_chat_id' :studentNumber='studentNumber' :quiz_id='quiz_id'></coursewareQuestion>
    </Modal>
    <!-- <Modal v-model="isshowAnswer" :width="800" title="学生回答" footer-hide>
      <coursewareAnswer :problemAnswer='problemAnswer'></coursewareAnswer>
    </Modal> -->
  </Row>
</template>
<script>
import pdf from 'vue-pdf'
import { _debounce, fullScreen } from '@/libs/util'
import live from '@/view/common/live'
import TaskQuestionList from '@/view/teacher_common/task/task_question_list.vue'// 问题回复
import addcsscrore from '@/view/publiccomponent_teacher/addscore.vue'//
import addevaluation from '@/view/publiccomponent_teacher/task/evaluationlist.vue'// 任务评价
import addtestscore from '@/view/publiccomponent_teacher/test/addtestscore.vue'// 考试评价
import addtestanalyze from '@/view/publiccomponent_teacher/test/addtestanalyze_testresults.vue'// 考试分析
import StudentHomeworkList from '@/view/teacher_common/homework/student_homework_list.vue'// 作业评价
import TaskReleaseDetail from '@/view/teacher_common/task/task_release_detail.vue'// 任务详情
import ExamEdit from '@/view/teacher_common/exam/exam_edit.vue'// 快速命题
import HomeworkReleaseDetail from '@/view/teacher_common/homework/homework_release_detail.vue'// 作业详情
import changeLeader from '@/view/teacher_common/task/task_team_leader_change.vue'// 更换小组长
import StudentExamList from '@/view/teacher_common/exam/student_exam_list.vue'
import Online from '@/view/teacher_common/courseware/courseware_live_online.vue'
import coursewareQuestion from '@/view/teacher_common/question/courseware_question.vue'
import questionList from '@/view/teacher_common/question/question_list.vue'
import { setTimeout } from 'timers'
import { MESSAGE_TYPE } from 'vue-baberrage'
import QRCode from 'qrcodejs2'
import { task_release } from '@/api/data'
import { handle_ppt_option } from '@/api/common'
export default {
  props: {
    courseware_id: '',
    t_id: {
      type: Array,
      default: () => {
        return []
      }
    },
    class_id: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  components: {
    pdf,
    addcsscrore,
    addevaluation,
    addtestscore,
    addtestanalyze,
    StudentHomeworkList,
    TaskReleaseDetail,
    ExamEdit,
    HomeworkReleaseDetail,
    TaskQuestionList,
    changeLeader,
    StudentExamList,
    Online,
    coursewareQuestion,
    questionList
  },
  mixins: [live],
  data () {
    return {
      // isshowAnswer: false,
      problemAnswer: [],
      quiz_id: '',
      studentNumber: 1,
      problem: '',
      inputProblem: false,
      isshowStudent: false,
      show_online: false,
      showBtn: true,
      online_data: {
        online_count: 0,
        students: [],
        total_count: 0
      },
      // 课件管理
      courseware_list_type: '',
      courseware_list_type2: '',
      courseware_list: [],
      // 点名
      test_type: false,
      test_timer: null,
      test_btn_content: '点名',
      name_list: ['张三', '李四', '王五', '赵六'],
      Material_url: '', // 预览素材地址
      isshouwMaterial: false,
      // 弹幕数据
      getHistory: false, // 检测是否有新消息
      barrageIsShow: true, // 是否显示弹幕
      currentId: 0, // 弹幕消息id
      barrageLoop: false,
      barrageList: [], // 弹幕数据
      // 课前课中课后
      is_in: false,
      evaluate: [
        { evaluate_type: 1, evaluate_weight: 0 },
        { evaluate_type: 2, evaluate_weight: 0 },
        { evaluate_type: 4, evaluate_weight: 0 }
      ],
      qrModal: false,
      qrCode_url: `${window.location.protocol}`,
      timetable_id: 0, // 课表id
      release_teacher: 0, // 老师评权重
      release_leader: 0, // 组长评权重
      release_team: 0, // 组长评组员权重
      sendloading: false, // 发送消息的loading，用于设置发送间隔
      isshowreply: false, // 是否显示问题列表
      release_type: 0, // 问题类型 ： 1 小组 2 个人
      isInfo: true, // 判断点击类型是否为详情
      homeworkname: '', // 作业详情弹出显示名称
      evaid: 0, // xx id
      isshowaddhomework: false,
      isshowaddclass1: false,
      isshowaddclass2: false,
      clone_update_info: {}, // 给快速命题或者普通命题传值的数据
      test_name: '', // 测试详情弹出显示名称
      isshowaddtask: false,
      rowid: 0, // xx 发布id
      click_type: '', // 点击类型是否为详情
      tasktype: '', // 任务类型：1课前 2课中 3课后
      taskname: '', // 任务详情弹出显示名称
      isshowevalist: false,
      isgetinfo: false, // 判断考试分析数据是否接受完成
      isshowanalyze: false,
      isshowhomeworkcheck: false,
      isevaluationshow: false,
      release_id: 0, // 发布id
      show_release: false,
      release_for_choose: '', // 发布类型
      teamnumber: '', // 小组人数
      leader_name: '', // 组长姓名
      leader_id: 0, // 组长id
      ischangeleader: false,
      team_list: [], // 更换组长时显示成员列表
      leaderchoose: '', // 选定的组长
      team: {
        list: [],
        choose: ''
      },
      leader: {
        list: [],
        choose: ''
      },
      // pdf
      src: '',
      numPages: undefined,
      page: 1,
      loadedRatio: 0,
      scrollTop: 0,
      ws: {},
      group_chat_id: '',
      size: 1,
      userInfo: this.$store.state.user.userInfo,
      msg: '',
      // 教师新增
      task: { // 任务列表数据
        before: [],
        in: [],
        after: []
      },
      test: { // 测试列表数据
        before: [],
        in: [],
        after: []
      },
      homework: [], // 作业列表数据
      before_choose: 'before_1',
      in_choose: 'in_1',
      after_choose: 'after_1',
      material_choose: '', // 素材选择
      isshare: false,
      chatlist: [],
      courseware_name: '', // 当前课件名称
      material_list: [],
      material_total: [],
      material: [], // 课件素材
      unpdf: true // 判断src是否为pdf，true：是
    }
  },
  created () {
    if (!window.localStorage.getItem('sendbarrage')) { // 弹幕发送间隔初始化
      window.localStorage.setItem('sendbarrage', new Date().getTime().toString().slice(8)) // 设置缓存(分钟+毫秒：00000-99999)
    }
    this.getInfo()
    this.class_id = this.class_id.sort()
    this.group_chat_id = `courseware_${this.courseware_id}_${this.class_id}`
    this.$nextTick(() => {
      this.chat_scrollTop()
    })
  },
  watch: {
    problemAnswer: {
      handler (newValue, oldValue) {
        this.problemAnswer = newValue
        this.$Message.info({
          content: newValue.student_name + '回答了问题',
          duration: 60,
          closable: true
        })
      }
    },
    ischangeleader (newvalue) {
      if (!newvalue) {
        this.team.list = []
        this.team.chooes = ''
      }
    },
    'team.chooes' (newvalue) {
      this.leader.list = []
      this.leader_name = ''
      this.team.choose = ''
      let list = this.team_list[newvalue]
      for (let item in list) {
        if (list[item].is_team_leader === 1) {
          this.leader_name = list[item].name
          this.leader_id = list[item].student_id
          break
        }
      }
      for (let item in this.team_list) {
        if (item.toString() === newvalue.toString()) {
          let newitem = this.team_list[item]
          for (let i in newitem) {
            if (isNaN(Number(newitem[i])) === true) {
              this.leader.list.push({
                value: newitem[i].student_id.toString(),
                label: newitem[i].name
              })
            }
          }
          break
        }
      }
    },
    page (n) {
      setTimeout(() => {
        if (n > this.numPages) {
          this.page = this.numPages
        } else if (n < 1) {
          this.page = 1
        }
        this.getMaterial()
      }, 0)
    }
  },
  methods: {
    // 课件管理切换数据
    Menu_change (val) {
      switch (val) {
        case '1-1':
          this.courseware_list_type = 'inclass'
          this.courseware_list_type2 = 'task'
          this.courseware_list = this.task.in
          break
        case '1-2':
          this.courseware_list_type = 'afterclass'
          this.courseware_list_type2 = 'task'
          this.courseware_list = this.task.after
          break
        case '2':
          this.courseware_list_type = 'maitem'
          break
        case '3':
          this.courseware_list_type = 'question'
          break
        default:
          break
      }
    },
    Menu_change2 (val) {
      switch (val) {
        case '4':
          this.courseware_list_type2 = 'task'
          this.courseware_list = this.task.in
          break
        case '5':
          this.courseware_list_type2 = 'test'
          this.courseware_list = this.test.in
          break
        default:
          break
      }
    },
    Menu_change3 (val) {
      switch (val) {
        case '6':
          this.courseware_list_type2 = 'task'
          this.courseware_list = this.task.after
          break
        case '7':
          this.courseware_list_type2 = 'test'
          this.courseware_list = this.test.after
          break
        case '8':
          this.courseware_list_type2 = 'homework'
          this.courseware_list = this.homework
          break
        default:
          break
      }
    },

    // 随机点名
    test_btn () {
      this.test_type = !this.test_type
      if (this.test_type) {
        this.test_timer = setInterval(() => {
          this.test_btn_content = this.name_list[Math.floor(Math.random() * this.name_list.length)]
        }, 10)
      } else {
        clearInterval(this.test_timer)
      }
    },

    option_click (val) { // 点击的预览素材
      window.open(val.file_url, '_blank')
    },
    top_scorll () {
      document.querySelector('#pdf').scrollTop -= 100
    },
    bottom_scorll () {
      document.querySelector('#pdf').scrollTop += 100
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
    // 教师新增

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

    // 任务回复
    answer (item) {
      this.rowid = item.task_release_id
      this.release_type = item.release_type
      this.isshowreply = true
    },

    // 作业详情
    open_homework_info (row) {
      this.rowid = row.id
      this.homeworkname = row.homework_name
      this.isshowaddhomework = true
    },

    // 测试详情
    open_test_info (row) {
      this.test_name = row.exam_name
      this.rowid = row.id
      this.isshowaddclass1 = true
    },
    // 通过右上角关闭页面触发
    finnishClass () {
      this.end_live()
    },
    // 结束直播
    end_live () {
      this.axios.request({
        method: 'post',
        url: '/index.php/Teacher/Courseware/live_end',
        params: {
          id: this.courseware_id,
          class_id: this.class_id
        }
      }).then(res => {
        if (res.code === 200) {
          this.$Message.success(res.message)
          setTimeout(() => {
            this.$emit('success', false)
          }, 1000)
        }
      })
    },
    // 考试结果分析
    analyze (row) {
      this.isgetinfo = false
      this.axios.request({
        method: 'post',
        url: '/index.php/Teacher/Examination/analyse',
        data: {
          id: row.id
        }
      }).then(res => {
        this.analyzelist = res
      })
      setTimeout(() => { // 该操作待优化
        this.isshowanalyze = true
        this.isgetinfo = true
      }, 500)
    },

    // 点击更换组长触发
    changeleader () {
      this.ischangeleader = true
    },

    // 更换组长
    change_teamleader () {
      this.axios.request({
        method: 'post',
        url: '/index.php/Teacher/Task/change_leader',
        data: {
          task_release_id: this.release_id,
          new_leader_student_id: this.leader.chooes.toString(),
          old_leader_student_id: this.leader_id
        }
      }).then(res => {
        if (res.code === 200) {
          this.$Message.success(res.message)
          this.team.chooes = this.leader.chooes = this.leader_name = ''
          this.getInfo()
          this.ischangeleader = false
        }
      })
    },

    // pdf换页
    last_page () {
      if (this.page < 2) {
        this.$Message.error('前面没有了')
        return false
      } else {
        this.page--
        this.handlePageChange()
      }
    },
    next_page () {
      if (this.page > this.numPages - 1) {
        this.$Message.error('已经是最后一页了')
        return false
      } else {
        this.page++
        this.handlePageChange()
      }
    },

    /***
     * 任务，作业，测试发布
     * @release_type =>task    任务发布
     * @release_type =>test    测试发布
     * @release_type =>homework    作业发布
    ***/
    release () {
      if (this.release_type === 'task') {
        task_release(this.release_id).then(res => {
          if (res.code === 200) {
            this.$Message.success(res.message)
            this.getInfo()
          }
        })
      } else if (this.release_type === 'test') {
        this.axios.request({
          method: 'post',
          url: '/index.php/Teacher/Examination/release',
          data: {
            exam_release_id: this.release_id
          }
        }).then(res => {
          if (res.code === 200) {
            this.$Message.success(res.message)
            this.getInfo()
          }
        })
      } else if (this.release_type === 'homework') {
        this.axios.request({
          method: 'post',
          url: '/index.php/Teacher/Homework/release',
          data: {
            homework_release_id: this.release_id
          }
        }).then(res => {
          if (res.code === 200) {
            this.$Message.success(res.message)
            this.getInfo()
          }
        })
      }
    },
    selectStudent () {
      if (this.problem === '') {
        this.$Message.error('请输入问题')
      } else if (this.studentNumber > this.online_data.online_count) {
        this.$Message.error('选取学生数不能大于在线人数')
      } else {
        this.axios.request({
          method: 'post',
          url: 'index.php/Teacher/Quiz/save',
          data: {
            quiz_id: '',
            group: this.group_chat_id,
            content: this.problem,
            answer_num: this.studentNumber,
            type: 0
          }
        }).then(res => {
          this.quiz_id = res.data.quiz_id
          this.inputProblem = false
          this.isshowStudent = true
        })
      }
    },
    /***
     * 任务，作业，测试撤回
     * @type =>task    任务撤回
     * @type =>test    测试撤回
     * @type =>homework    作业撤回
    ***/
    unrelease (type, id) {
      if (type === 'task') {
        this.axios.request({
          method: 'post',
          url: '/index.php/Teacher/Task/un_release',
          data: {
            task_release_id: id
          }
        }).then(res => {
          if (res.code === 200) {
            this.$Message.success(res.message)
            this.getInfo()
          }
        })
      } else if (type === 'test') {
        this.axios.request({
          method: 'post',
          url: '/index.php/Teacher/Examination/un_release',
          data: {
            exam_release_id: id
          }
        }).then(res => {
          if (res.code === 200) {
            this.$Message.success(res.message)
            this.getInfo()
          }
        })
      } else if (type === 'homework') {
        this.axios.request({
          method: 'post',
          url: '/index.php/Teacher/Homework/un_release',
          data: {
            homework_release_id: id
          }
        }).then(res => {
          if (res.code === 200) {
            this.$Message.success(res.message)
            this.getInfo()
          }
        })
      }
    },
    /**
      * 处理任务，测试，作业列表数据
      * @data 传输数据
      * @type_name 判断的字段名称
     **/
    getArray (data, type_name) {
      // console.log(arguments)
      let arr = [] // 放置名称的数组
      for (let i in data) {
        if (arr.indexOf(data[i][type_name])) {
          arr.push(data[i][type_name])
        }
      }
      arr = [...new Set(arr)] // 去重
      let arr2 = [] // 返回数据的数组
      for (let i in arr) {
        arr2.push({
          name: arr[i],
          array: []
        })
      }
      for (let i in arr2) {
        for (let j in data) {
          if (arr2[i].name === data[j][type_name]) {
            arr2[i].array.push(data[j])
          }
        }
      }
      return arr2
    },
    getInfo () {
      this.axios.request({
        method: 'post',
        url: '/index.php/Teacher/Courseware/live_info',
        data: {
          id: this.courseware_id,
          class_id: this.class_id
        }
      }).then(res => {
        if (res.code === 200) {
          let domain = window.location.protocol + '//' + window.location.host
          this.qrcode(`${domain}/#/live_public?courseware_id=${res.data.courseware_info.id}`)
          this.material_list = []
          this.src = res.data.courseware_info.file_url
          this.courseware_name = res.data.courseware_info.courseware_name
          if (res.data.courseware_info.courseware_file) this.material_list = res.data.courseware_info.courseware_file
          if (res.data.task_list['2']) this.task.in = this.getArray(res.data.task_list['2'], 'task_name')
          if (res.data.task_list['3']) this.task.after = this.getArray(res.data.task_list['3'], 'task_name')
          if (res.data.exam_list['2']) this.test.in = this.getArray(res.data.exam_list['2'], 'exam_name')
          if (res.data.exam_list['3']) this.test.after = this.getArray(res.data.exam_list['3'], 'exam_name')
          if (res.data.homework_list['3']) this.homework = this.getArray(res.data.homework_list['3'], 'homework_name')
          this.courseware_list = this.task.in
          this.axios.request({
            method: 'get',
            url: '/index.php//home/live/get_online_user',
            params: {
              group: this.group_chat_id
            }
          }).then(res => {
            if (res.code === 200) {
              this.online_data = res.data
            }
          })
        }
      })
    },
    getMaterial () {
      this.material = []
      for (let i = 0; i < this.material_list.length; i++) {
        if (this.material_list[i].page === this.page) {
          this.material.push(this.material_list[i])
        }
      }
    },
    getMaterialTotal () {
      this.material_total = this.material_list
      var p = ''
      for (let i = 0; i < this.material_total.length; i++) {
        for (let j = i + 1; j < this.material_total.length; j++) {
          if (this.material_total[j].page < this.material_total[i].page) {
            p = this.material_total[i]
            this.material_total[i] = this.material_total[j]
            this.material_total[j] = p
          }
        }
      }
    },
    // ------------ ------------ ------------
    sendDirection (uid) {
      if (uid === this.userInfo.id) {
        return true
      }
      return false
    },
    error: function (err) {
      console.log(err)
    },
    handlePageChange () {
      if (this.isshare) {
        let _this = this
        let _pdf = document.querySelector('.pdfcard')
        _this.scrollTop = _pdf.scrollTop
        handle_ppt_option({
          option_obj: {
            type: 'ppt',
            page: this.page,
            scrollTop: this.scrollTop
          },
          group: this.group_chat_id
        }).then(res => {})
      }
    },
    send () {
      // let local = window.localStorage.getItem('sendbarrage')
      // let num = Number(new Date().getTime().toString().slice(8))
      this.sendloading = false
      // 每隔五秒只能发送一次弹幕
      // if (num - local < 5000 && num - local > 0) {
      //   this.$Message.error('发送太频繁，休息一下再发送吧')
      //   return false
      // }
      // if (num - local < -95000 && num - local < 0) {
      //   this.$Message.error('发送太频繁，休息一下再发送吧')
      //   return false
      // }
      if (this.msg === '') {
        this.$Message.error('输入内容不能为空')
        return false
      } else {
        this.sendloading = true
        window.localStorage.setItem('sendbarrage', new Date().getTime().toString().slice(8)) // 重置缓存
        if (this.sendloading) {
          this.sendMsg(this.msg)
        }
      }
    },
    online_status (data) {
      let online_list = this.online_data.students
      for (let i in online_list) {
        if (online_list[i].id === data.user_id && data.user_type === 2) {
          if (data.type === 'online') {
            online_list[i].online_status = true
            this.online_data.online_count++
          } else if (data.type === 'offline' && data.user_type === 2) {
            online_list[i].online_status = false
            this.online_data.online_count--
          }
        }
      }
    },
    chat_scrollTop () {
      let chat = document.getElementById('chat')
      setTimeout(() => {
        if (chat.scrollHeight > chat.offsetHeight) {
          chat.scrollTop = chat.scrollHeight - chat.offsetHeight
        }
      }, 0)
    },
    handleOnMessage (data) {
      if (data.data !== undefined) {
        this.problemAnswer = data.data
      }
      let type = data.type || ''
      switch (type) {
        // Events.php中返回的init类型的消息，将client_id发给后台进行uid绑定
        case 'init':
          this.bindUser(data.client_id)
          break
        case 'ppt':
          break
        case 'online':
          this.online_status(data)
          break
        case 'offline':
          this.online_status(data)
          break
        default: {
          this.addToList(data)
          this.chatlist.push(data)
          this.handlePageChange()
          this.chat_scrollTop()
        }
      }
    },
    handleScroll: _debounce(function () {
      this.handlePageChange()
    }, 100),
    fullScreen (id) {
      // this.showBtn = false
      fullScreen(id)
    },
    opewnQrCode () {
      this.qrModal = true
    },
    qrcode (url) {
      // eslint-disable-next-line no-new
      new QRCode('qrcode', {
        width: 500,
        height: 500,
        text: url, // 二维码地址
        colorDark: '#000',
        colorLight: '#fff'
      })
    },
    selectMethod () {
      this.inputProblem = true
    },
    closeList () {
      this.isshowStudent = false
      this.$refs.questionList.getProblemList()
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
    }
  },
  mounted () {
    let _this = this
    this.initChat()
    let _pdf = document.querySelector('.pdfcard')
    _pdf.onscroll = function () {
      _this.handleScroll()
    }
    setTimeout(() => {
      this.getMaterial()
      this.getMaterialTotal()
    }, 1000)
  }
}
</script>
<style lang="less">
  .cLive .pdfcard  .ivu-card-body{
    height: 774px;
  }
  .QL .ques_list{
    background: #3a3a3a;
    padding:10px;
  }
  .maitem_list{
    width:480px;
    background:#3a3a3a;
    color:rgba(255, 255, 255, 0.8);
    padding:10px;
  }
  .maitem_name{
    cursor:pointer
  }
</style>
