<template>
  <div style="height:100%">
    <Layout style="height:100%">
      <Header class="live-header">
        <Row type="flex" justify="space-between" class="code-row-bg">
          <Col span="4">
          <img src="@/assets/images/new_img/live-logo.png" style="margin-left:20px;vertical-align:middle" />
          </Col>
          <Col style="color:#ACABAB;">
          <span class="lvie-coursewarename">{{courseware_name}}</span>
          <span style="font-size:14px;display:none" class="headerShowTime">全体作答中：{{showTime}}秒</span>
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
            <div class="live-question-btn" @click="showListQuestion">
              <img src="@/assets/images/new_img/question.png"
                style="vertical-align:middle;width:16px;margin-right:10px;" />提问
            </div>
            <div class="livedot">1</div>
            <ul class="live-btnList liveul">
              <li class="live-btnList-li" @click="showList3">
                <Badge dot :offset=[0,-4] :count="badge" class="question-badge">
                  提问列表({{questionAllQuestionList.length}})
                </Badge>
              </li>
              <li class="live-btnList-li" @click="showList2">附件列表({{material_total.length}})</li>

              <!-- <li class="live-btnList-li" @click="showList2">课中测试({{material_total.length}})</li> -->
              <li v-for="(item,index) in courseware_list_list" :key="index" @click="showList(item,$event)"
                class="live-btnList-li">
                {{item.title}}({{item.listlength}})
                {{item.color}}
              </li>
              <li class="live-btnList-li" @click="openAtten()" v-if="course_status.toString()===1+''">考勤</li>
              <!-- <li class="live-btnList-li" @click="open('course_table','','课程表编辑',1100)" v-if="course_status===1">考勤</li> -->
            </ul>
            <div class="finnish-class" @click="end_live">
              <img src="@/assets/images/new_img/finnish-class.png"
                style="vertical-align:middle;width:16px;margin-right:10px" />下课
            </div>
            </Col>
            <Col :span="21" class="live-r">
            <div class="allscreen" @click="closeList($event)">
              <div class="show-list">
                <div>
                  <span style="margin:16px 20px;display:inline-block;font-size:14px;color:#FFFFFF">{{list_title}}</span>
                  <span style="float:right;cursor:pointer" @click="closeDetailList">
                    <Icon type="ios-close" size="48" color="#FFFFFF" />
                  </span>
                </div>
                <div class="list-contain">
                  <p v-if="Object.keys(courseware_list).length==0" style="margin:10px">暂无{{list_title}}</p>
                  <div v-for="in_item in courseware_list" :key="in_item.name + 'in_task_item'">
                    <h3 style="margin-left:11px;color:#ffffff;font-size:14px">{{list_title}}名称: {{in_item.name}}</h3>
                    <div class="table_flex" style="font-size:14px" v-if="list_title==='课中任务'||list_title==='课后任务'">
                      <div class="table_item" v-for="(in_task_item) in in_item.array"
                        :key="in_task_item.task_release_id">
                        <p style="font-size:16px;font-weight:bold">名称：<span
                            @click="taskname = in_task_item.task_name,timetable_id = in_task_item.timetable_id,rowid = in_task_item.task_release_id,tasktype = '3',click_type = 'info',isshowaddtask = true"
                            style="cursor:pointer">{{in_task_item.task_name===undefined?in_item.name:in_task_item.task_name}}</span>
                        </p>
                        <p>班级：{{in_task_item.class_name}}</p>
                        <div class="w_btn">
                          <span
                            @click="taskname = in_task_item.task_name,timetable_id = in_task_item.timetable_id,rowid = in_task_item.task_release_id,tasktype = '3',click_type = 'info',isshowaddtask = true">查看</span>
                          <span v-if="in_task_item.release_status === 0 && in_task_item.task_release_id!==undefined"
                            @click="release_id = in_task_item.task_release_id,release_type='task',release()">发布</span>

                          <span v-if="in_task_item.release_status === 1 && in_task_item.task_release_id!==undefined"
                            @click="unrelease('task',in_task_item.task_release_id)">撤回</span>
                          <span v-if="in_task_item.release_status === 0 && in_task_item.exam_release_id!==undefined"
                            @click="release_id = in_task_item.exam_release_id,release_type='test',release()">发布</span>

                          <span v-if="in_task_item.release_status === 1 && in_task_item.exam_release_id!==undefined"
                            @click="unrelease('test',in_task_item.exam_release_id)">撤回</span>
                          <span v-if="in_task_item.release_type === 1 && in_task_item.release_status === 1"
                            @click="release_id = in_task_item.task_release_id,changeleader()">更换组长</span>
                        </div>
                      </div>
                    </div>
                    <div class="table_flex" style="font-size:14px" v-if="list_title==='课中测试'||list_title==='课后测试'">
                      <div class="table_item" v-for="in_test_item in in_item.array" :key="in_test_item.exam_release_id">
                        <p style="font-size:16px;font-weight:bold">
                          名称：<span>{{in_test_item.exam_name===undefined?in_item.name:in_test_item.exam_name}}</span></p>
                        <p>班级：{{in_test_item.class_name}}</p>
                        <div class="w_btn">
                          <span v-if="in_test_item.release_status === 0"
                            @click="release_id = in_test_item.exam_release_id,release_type='test',release()">发布</span>
                          <span v-if="in_test_item.release_status === 1"
                            @click="unrelease('test',in_test_item.exam_release_id)">撤回</span>
                          <span v-if="in_test_item.release_status === 1"
                            @click="release_id = in_test_item.exam_release_id,isshowhomeworkcheck = true">查询</span>
                          <span v-if="in_test_item.release_status === 1" @click="analyze(in_test_item)">分析</span>
                        </div>
                      </div>
                    </div>
                    <div class="table_flex" style="font-size:14px" v-if="list_title==='课后作业'">
                      <div class="table_item" v-for="after_homework_item in in_item.array"
                        :key="after_homework_item.homework_release_id">
                        <p style="font-size:16px;font-weight:bold">名称：<span style="cursor:pointer"
                            @click="timetable_id = after_homework_item.timetable_id,open_homework_info(after_homework_item)">{{after_homework_item.homework_name===undefined?in_item.name:after_homework_item.homework_name}}</span>
                        </p>
                        <p>班级：{{after_homework_item.class_name}}</p>
                        <div class="w_btn">
                          <span v-if="after_homework_item.release_status === 0"
                            @click="release_id = after_homework_item.homework_release_id,release_type='homework',release()">发布</span>
                          <span v-if="after_homework_item.release_status === 1"
                            @click="unrelease('homework',after_homework_item.homework_release_id)">撤回</span>
                          <span v-if="after_homework_item.release_status === 1"
                            @click="release_id = after_homework_item.homework_release_id,isshowevalist = true">批改</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="allscreen" @click="closeList($event)">
              <div class="show-list" style="width:42%">
                <div>
                  <span style="margin:16px 20px;display:inline-block;font-size:14px;color:#FFFFFF">已有问题：</span>
                  <span style="float:right;cursor:pointer" @click="closeDetailList2">
                    <Icon type="ios-close" size="48" color="#FFFFFF" />
                  </span>
                </div>
                <div class="list-contain">
                  <ul class="teacher-uestionlist">
                    <li v-for="(item,index) in alreadyQuestion" :key="index" @click="shouDetailQuestion(index)">
                      <span>{{index+1}}、</span>
                      <span v-if="item.topic_type===2">主观题</span>
                      <span v-if="item.topic_type===1" style="color:#7A9AB7">客观题</span>
                      <span style="word-break:break-all">{{item.content}}</span>
                    </li>
                  </ul>
                  <button class="add-question" @click="isshowAddquestion=true">+ &nbsp;&nbsp;添加问题</button>
                </div>
              </div>
            </div>
            <div class="allscreen" @click="closeList($event)">
              <div class="show-list" style="width:42%">
                <div>
                  <span style="margin:16px 20px;display:inline-block;font-size:14px;color:#FFFFFF">提问列表：</span>
                  <span style="float:right;cursor:pointer" @click="closeDetailList3">
                    <Icon type="ios-close" size="48" color="#FFFFFF" />
                  </span>
                </div>
                <div class="list-contain">
                  <ul class="teacher-uestionlist">
                    <li v-for="(item,index) in questionAllQuestionList" class="qL" :key="index"
                      @click="showQuestion(item,index)" style="display:flex">
                      <span style="flex:1">
                        <span>{{index+1}}、</span>
                        <span v-if="item.topic_type===2" style="margin-right:10px">主观题</span>
                        <span v-if="item.topic_type===1" style="margin-right:10px;color:#7A9AB7">客观题</span>
                        <span style="word-break:break-all">{{item.content}}</span>
                      </span>
                      <Icon type="ios-close" size="28" @click="deleteQuestion($event,item.id)" />
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="allscreen" @click="closeList($event)">
              <div class="show-list">
                <div>
                  <span style="margin:16px 20px;display:inline-block;font-size:14px;color:#FFFFFF">{{list_title}}</span>
                  <span style="float:right;cursor:pointer" @click="closeDetailList4">
                    <Icon type="ios-close" size="48" color="#FFFFFF" />
                  </span>
                </div>
                <div class="list-contain">
                  <div style="color:#ffffff">
                    <p v-if="Object.keys(material_total).length===0" style="margin:10px">暂无附件</p>
                    <div v-else>
                      <Row style="font-size:16px;font-weight:bold">
                        <Col :span="7">对应页码</Col>
                        <Col :span="17">附件名</Col>
                      </Row>
                      <Row v-for="item in material_total" :key="item.id" style="margin:6px 0">
                        <Col :span="6" :offset="1">{{item.page}}</Col>
                        <Col :span="17" @click.native="option_click(item)">
                        <span class="maitem_name" style="cursor:pointer">{{item.file_name}}</span>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="live-box">
              <!-- pdf -->
              <div class="live-box-contain">
                <div class="pdfcard" ref="pdfcard" @mousedown="mou1" @mousemove="mou2" @mouseup="mou3"
                  @dblclick="fullScreen('pdf')">
                  <div id="pdf" v-if="unpdf" style="align-self:center">
                    <!-- 弹幕组件：vue-baberrage -->
                    <vue-baberrage class="baberrage" style="z-index:1;height:100px;padding-top:10px;"
                      :isShow="barrageIsShow" :barrageList="barrageList" :loop="barrageLoop" :boxHeight="100">
                    </vue-baberrage>
                    <div class="switch_input switch_input_style" style="height:60px" ref="switch_input">
                      <div style="display:flex;justify-content: space-around;align-items: center;">
                        <Tooltip content="上一页" placement="top">
                          <img src="@/assets/images/new_img/last_page.png" @click="last_page" />
                        </Tooltip>
                        <Tooltip content="下一页" placement="top">
                          <img src="@/assets/images/new_img/next_page.png" @click="next_page" />
                        </Tooltip>
                        <Tooltip content="退出全屏" placement="top">
                          <img src="@/assets/images/new_img/closeFull.png" @click="end_full" />
                        </Tooltip>
                        <Tooltip :content="!isshare ? '取消广播同步' : '开始广播同步课件'" placement="top">
                          <img src="@/assets/images/new_img/unshare.png" v-show="isshare===false"
                            @click="isshare = true" />
                          <img src="@/assets/images/new_img/isshare.png" v-show="isshare===true"
                            @click="isshare = false" />
                        </Tooltip>
                        <Tooltip content="弹幕" placement="top">
                          <img src="@/assets/images/new_img/unbarrage.png" v-show="barrageIsShow===false"
                            @click="barrageIsShow = true" />
                          <img src="@/assets/images/new_img/isbarrage.png" v-show="barrageIsShow===true"
                            @click="barrageIsShow = false" />
                        </Tooltip>
                        <Tooltip content="画笔" placement="top">
                          <img src="@/assets/images/new_img/unbrush.png" v-show="iscanvas===false"
                            @click="iscanvas = true" />
                          <img src="@/assets/images/new_img/isbrush.png" v-show="iscanvas===true"
                            @click="iscanvas = false" />
                        </Tooltip>
                      </div>
                      <div style="position:fixed;bottom:10px;right:30px;background:rgba(0,0,0,.3);padding:8px 14px">
                        <img src="@/assets/images/new_img/back.png" @click="backCanvas"
                          style="vertical-align:middle;margin-right:10px" />
                        <img src="@/assets/images/new_img/clearcanvas.png" @click="clearCanvas"
                          style="vertical-align:middle;margin-right:30px" />
                        <span><span style="vertical-align:middle">画笔颜色</span><input type="color" id="context.color"
                            value="#FF8040"
                            style="width:26px;height:26px;vertical-align:middle;margin-left:6px" /></span>
                        <span style="margin:0 40px 0 20px"><span style="vertical-align:middle">大小 </span><input
                            type="number" id="context.size" max="10" value="3" style="width:53px" /></span>
                        <Select style="width:160px" class="select_material" placement="top" placeholder="选择素材预览">
                          <Option v-for="maitem in material" :value="maitem.file_url" :key="maitem.id"
                            @click.native="option_click(maitem)">{{ maitem.file_name }}</Option>
                        </Select>
                      </div>
                    </div>

                    <pdf ref="pdf" :src="src" :page="page" @progress="loadedRatio = $event" @error="error"
                      @num-pages="numPages = $event" @link-clicked="page = $event" style="width:100%;">
                    </pdf>
                  </div>
                  <div v-else style="width:100%;height:444px;overflow-y:auto;margin: 10px auto">
                    <embed :src="src" width="100%" height="440px" autostart="false">
                  </div>
                </div>
                <Row class="pdfcard-bottom">
                  <Col :span="4">
                  <span>分享直播间</span>
                  <img src="@/assets/images/new_img/qrCode.png" @click="qrModal = true" />
                  </Col>
                  <Col :span="8" style="transform:translateY(-3px)">
                  <span>选择课件素材</span>
                  <Select style="width:160px" class="select_material" placement="top" placeholder="选择素材预览">
                    <Option v-for="maitem in material" :value="maitem.file_url" :key="maitem.id"
                      @click.native="option_click(maitem)">{{ maitem.file_name }}</Option>
                  </Select>
                  </Col>
                  <Col :span="6">
                  <img src="@/assets/images/new_img/beforePage.png" @click="last_page" style="margin-right:20px" />
                  <InputNumber v-model.number="page" type="number" :max="numPages" :min="1" style="width:50px"
                    size="small" @on-change="handlePageChange" class="showcurrentpage"></InputNumber>
                  &nbsp;
                  <span style="vertical-align:middle">/{{numPages}}</span>
                  <img src="@/assets/images/new_img/nextPage.png" @click="next_page" style="margin-left:3px" />
                  </Col>
                  <Col :span="6">
                  <div class="pdfcard-bottom-r">
                    <img src="@/assets/images/new_img/synchronization.png" @click="isshare = true" v-show="!isshare" />
                    <img src="@/assets/images/new_img/unsynchronization.png" @click="isshare = false"
                      v-show="isshare" />
                    <img src="@/assets/images/new_img/open-barrage.png" @click="barrageIsShow = true"
                      v-show="!barrageIsShow" style="width:23px;padding:0 4px" />
                    <img src="@/assets/images/new_img/close-barrage.png" @click="barrageIsShow = false"
                      v-show="barrageIsShow" />
                    <img src="@/assets/images/new_img/ergeType.png" @click="ergeTypeChange()" />
                    <img src="@/assets/images/new_img/enlarge.png" @click="fullScreen('pdf')" />
                  </div>
                  </Col>
                </Row>
                <Row class="pdfcard-bottom2">
                  <Col :span="2">
                  <img src="@/assets/images/new_img/qrCode.png" @click="qrModal = true" />
                  </Col>
                  <Col :span="6" style="transform:translateY(-3px)">
                  <Select style="width:80%" class="select_material" placement="top" placeholder="选择素材预览">
                    <Option v-for="maitem in material" :value="maitem.file_url" :key="maitem.id"
                      @click.native="option_click(maitem)">{{ maitem.file_name }}</Option>
                  </Select>
                  </Col>
                  <Col :span="7">
                  <img src="@/assets/images/new_img/beforePage.png" @click="last_page" style="margin-right:20px" />
                  <InputNumber v-model.number="page" type="number" :max="numPages" :min="1" style="width:50px"
                    size="small" @on-change="handlePageChange" class="showcurrentpage"></InputNumber>
                  &nbsp;
                  <span style="vertical-align:middle">/{{numPages}}</span>
                  <img src="@/assets/images/new_img/nextPage.png" @click="next_page" style="margin-left:3px" />
                  </Col>
                  <Col :span="9">
                  <div class="pdfcard-bottom-r">
                    <img src="@/assets/images/new_img/synchronization.png" @click="isshare = true" v-show="!isshare" />
                    <img src="@/assets/images/new_img/unsynchronization.png" @click="isshare = false"
                      v-show="isshare" />
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
            <!-- 弹幕讨论 -->
            <div class="discuss">
              <div class="discuss-top">
                <span @click="changeType(0,$event)" class="selectChangActive">弹幕讨论</span>
                <span @click="changeType(1,$event)">在线学生({{online_data.online_count}})</span>
              </div>
              <Card class="chatcard" v-if="showdiscuss===true">
                <div id="chat">
                  <div v-for="item in chatlist" :key="item.id" class="chat-item">
                    <div class="userInfo" style=" word-break: break-all">
                      <Avatar :src="item.msg.extra.userInfo.avator" style="margin-right:8px;margin-bottom:4px"
                        @on-error="e => { e.target.src = errorImg }" />
                      <span style="color:#3B88E8;">{{item.msg.extra.userInfo.name}}: </span>
                      <span v-html="item.msg.msg" style="color:#A4A4A4"></span>
                    </div>
                  </div>
                </div>
                <div class="chat_box_bottom">
                  <div class="prohibit-discuss-btn" @click="prohibitDiscuss">
                    <img src="@/assets/images/new_img/prohibit-discuss.png"
                      style="vertical-align:middle;margin-right:10px">
                    <span class="prohibit-discuss-des" v-if="online_data.groupstatus===1">全部禁言</span>
                    <span class="prohibit-discuss-des" v-if="online_data.groupstatus!==1">解除禁言</span>
                  </div>
                  <div class="input-s">
                    <input :maxlength="30" type="text" @keyup.enter="send" v-model="msg" class="chat-input"
                      @on-enter='send'></input>
                    <Button type="primary" @click="send()" class="send-btn">发送</Button>
                  </div>
                </div>
              </Card>
              <Card class="chatcard" v-if="showdiscuss===false">
                <Spin fix v-show="loading"> </Spin>
                <div class="online-list-header">
                  <span class="blwz" @click="changeOnlineType(0,$event)">全部({{online_data.total_count}})</span>
                  <span class="ptwz" @click="changeOnlineType(1,$event)">在线({{online_data.online_count}})</span>
                  <span class="ptwz"
                    @click="changeOnlineType(2,$event)">离线({{online_data.total_count - online_data.online_count}})</span>
                </div>
                <Collapse class="newtypeCollapse" v-model="collapseVal">
                  <Panel v-model="online_data" v-for="(item,index) in online_data.students" :key="index">
                    {{item.class_name}}
                    <ul slot="content">
                      <li style="width:25%;float:left" v-for="(item2,index2) in item.student" :key="index2">
                        <div style="text-align:center">
                          <img v-if="item2.online_status === false" :src="item2.icon===''?default_icon:item2.icon"
                            width="60%" class="gray" style="width:40px;height:40px;border-radius:50%" />
                          <img v-if="item2.online_status === true" :src="item2.icon===''?default_icon:item2.icon"
                            width="60%" style="width:40px;height:40px;border-radius:50%" />
                        </div>
                        <div class="online-data-name" style="text-align:center">
                          <span>{{item2.name}}</span>
                        </div>
                      </li>
                      <div style="clear:both;"></div>
                    </ul>
                  </Panel>
                </Collapse>
                <!-- <div class="prohibit-discuss-btn" @click="prohibitDiscuss" v-if="course_status===1">
                  <span class="prohibit-discuss-des">考勤</span>
                </div> -->
              </Card>
            </div>
            </Col>
            <!-- <Col :span="5" style="background:#373639;height:100%;padding-right:20px;padding-left:10px">
            <div></div>
          </Col> -->
          </Row>
          <!-- 二维码 -->
          <Modal v-model="qrModal" :width="640" title="扫码" class="qrModal">
            <div>
              <div id="qrcode"></div>
              <div style="width:200px;text-align:center;margin-top:20px;display:flex">
                <div>
                  <img src="@/assets/images/new_img/qccot2.jpg" style="width:40px;height:40px;margin-right:10px" />
                </div>
                <div style="flex:1">微信/手机浏览器扫一扫观看直播</div>
              </div>
            </div>
            <div>
              <div id="qrcode2"></div>
              <div style="width:200px;text-align:center;margin-top:20px;display:flex">
                <div>
                  <img src="@/assets/images/new_img/qccot.jpg" style="width:40px;height:40px;margin-right:10px" />
                </div>
                <div style="flex:1">Insta360全景播放器扫一扫观看全景直播</div>
              </div>
            </div>
          </Modal>
          <!-- 任务发布 -->
          <Modal v-model="show_release" title="发布" :mask-closable='false' footer-hide>
            <div v-if="show_release" style="height:150px;">
              <h3 style="margin:10px 0;">选择发布类型：</h3>
              <RadioGroup v-model="release_for_choose" style="height:30px;" vertical>
                <Radio label="2" style="padding-top:10px;" v-show="is_in === false">
                  <span>按个人发布</span>
                </Radio>
                <Radio label="1" style="padding-top:10px;">
                  <span>按小组发布</span>
                  <div style="display:inline;" v-if="release_for_choose === '1'">
                    <Input style="width:40px;margin:0 5px;" type="text" number size="small" v-model="teamnumber" />人<Tag
                      color="warning" style="height:auto;margin:0 10px;padding:0 5px;">权重之和需为100</Tag><br>
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;
                      老师评权重 <Input style="width:40px;margin:0 5px;" number type="text" size="small"
                        v-model="release_teacher" />|
                      组长评权重 <Input style="width:40px;margin:0 5px;" number type="text" size="small"
                        v-model="release_leader" />
                      | 组员评组长权重<Input style="width:40px;margin:0 5px;" number type="text" size="small"
                        v-model="release_team" /></span>
                  </div>
                </Radio>
              </RadioGroup>
              <div style="position:relative;top:65px;"><Button @click="release" type="primary" size="small">发布</Button>
              </div>
            </div>
          </Modal>

          <!-- 更换小组组长 -->
          <div v-if="ischangeleader">
            <Modal v-model="ischangeleader" footer-hide width="1000" title="更换小组组长">
              <changeLeader :task_release_id='release_id'></changeLeader>
            </Modal>
          </div>

          <!-- 测试结果查询 -->
          <div v-if="isshowhomeworkcheck">
            <Modal v-model="isshowhomeworkcheck" title="考试结果查询" :mask-closable='false' footer-hide width="1200"
              class="hei-modal">
              <StudentExamList @closeModal="isshowhomeworkcheck=false"
                @on-refresh-parent-list="isshowhomeworkcheck=false" :targetwork_id="release_id"
                :target_type='"student_exam_list"'></StudentExamList>
            </Modal>
          </div>
          <!-- 作业评价 -->
          <div v-if="isshowevalist">
            <Modal v-model="isshowevalist" :mask-closable='false' title="评价列表" footer-hide width="1200"
              class="hei-modal">
              <StudentExamList @closeModal="isshowevalist=false" @on-refresh-parent-list="isshowevalist=false"
                :targetwork_id="release_id" :target_type='"student_homework_list"'></StudentExamList>
            </Modal>
          </div>

          <!-- 测试结果分析 -->
          <Modal v-model="isshowanalyze" title="考试结果分析" footer-hide fullscreen v-show="isgetinfo">
            <div v-if="isshowanalyze">
              <addtestanalyze :analyzelist="analyzelist"></addtestanalyze>
            </div>
          </Modal>

          <!-- 任务详情 -->
          <div v-if="isshowaddtask">
            <Modal v-model="isshowaddtask" width="1000" footer-hide :title="taskname" :mask-closable='false'>
              <TaskReleaseDetail :task_release_id="rowid"></TaskReleaseDetail>
            </Modal>
          </div>

          <!-- 查看测试详情 -->
          <Modal v-model="isshowaddclass1" :title="test_name" fullscreen footer-hide>
            <div v-if="isshowaddclass1">
              <!-- <ExamEdit :timetable_id="timetable_id" :exam_release_id="rowid"
              :action_type="3" :courseware_id="courseware_id" :teacher_course_id="$router.query.teacher_course_id" :type="2"
             ></ExamEdit> -->
              <ExamEdit :timetable_id="timetable_id" :exam_release_id="rowid" :action_type="3"
                :courseware_id="courseware_id" :teacher_course_id="teacher_course_id" :type="2"></ExamEdit>
            </div>
          </Modal>

          <!-- 作业详情 -->
          <div v-if="isshowaddhomework">
            <Modal v-model="isshowaddhomework" :title="homeworkname" footer-hide width="1000" :mask-closable='false'
              :styles="{top: '20px'}">
              <HomeworkReleaseDetail :homework_release_id="rowid"></HomeworkReleaseDetail>
            </Modal>
          </div>

          <!-- 删除问题 -->
          <Modal v-model="isshowDeleteModel" @on-ok="sureDelete" title="删除">
            是否确认删除问题
          </Modal>

          <!-- 添加问题 -->
          <Modal v-model="isshowAddquestion" :width="620" footer-hide>
            <coursewareQuestion :online_data='online_student' :courseware_id='courseware_id'
              :group_chat_id='group_chat_id' :showTime="showTime" :add_type="'call'" @changeTime='changeTime'
              @closeQList='closeQList'></coursewareQuestion>
          </Modal>

          <!-- 显示已有客观题 -->
          <Modal v-model="isshowSeclectquestion" :width="690" footer-hide>
            <div>
              <span
                style="font-size:14px;color:#26282F;margin-bottom:20px;display:inline-block;margin-bottom:10px">提问：</span>
              <div class="questionContain">
                <p class="questionContain-question">
                  {{contentShow}}
                </p>
                <p v-for="(item,index) in topicShow" :key="index">{{item.choose}}、{{item.choose_content}}</p>
              </div>
              <div class="showtime">
                作答时间：<input type="number" class="new-inputnumber" v-model="reply_timeShow" style="font-size:14px" />秒
                <button style="background:#15B5A8" @click="submitQuestion2">全体作答</button>
              </div>
              <div style="clear:both"></div>
            </div>
          </Modal>

          <!-- 显示已有主观题 -->
          <Modal v-model="isshowMainquestion" :width="690" footer-hide>
            <span
              style="font-size:14px;color:#26282F;margin-bottom:20px;display:inline-block;margin-bottom:10px">提问：</span>
            <div class="questionContain">
              <p class="questionContain-question" style="margin-bottom:0;min-height:100px">
                {{mainQuestionContent}}
              </p>
            </div>
            <div style="float:left;margin-top:20px;line-height:26px">在线人数：{{online_data.online_count}}</div>
            <div class="showtime">
              回答人数：<input type="number" v-model="mainAnswer_num" class="new-inputnumber" />
              <button @click="submitQuestion" style="background:#3B88E8">随机发布</button>
              <button @click="submitQuestion" style="background:#15B5A8">指定学生</button>
              <button @click="submitQuestion" style="background:#49951B">抢答</button>
            </div>
            <div style="clear:both"></div>
          </Modal>

          <!-- 学生主观题回答 -->
          <Modal v-model="isshowAnswer" :width="690" footer-hide>
            <answerList :mainQuestion='mainQuestion'></answerList>
          </Modal>

          <!-- 学生客观题回答 -->
          <Modal v-model="isshowAnswerSelectAnwser" :width="690" footer-hide>
            <selectquestionAnwser :selectQuestion='selectQuestion'></selectquestionAnwser>
          </Modal>

          <Modal v-model="modal2" title="选择学生" @on-ok="submit">
            <div style="font-size:14px;margin-bottom:8px;color:black;font-weight:bold">
              请选择（{{total}}/{{mainAnswer_num}}）位学生:</div>
            <div class="student">
              <div v-for="(item,index) in online_student.students" class="className" ref="className" :key="index">
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

          <Modal v-model="modal1" title="抢答" @on-ok="ok">
            <p>是否确定进行抢答？</p>
          </Modal>
          <!-- <Modal v-model="isshowAnswer" :width="800" title="学生回答" footer-hide>
          <coursewareAnswer :problemAnswer='problemAnswer'></coursewareAnswer>
        </Modal> -->
          <Modal v-model="modal" :title="title" width="1100px" :styles="{top: '0px'}" footer-hide>
            <CourseTable :teacher_course_id="target_id" v-if="target === 'course_table' && modal"></CourseTable>
          </Modal>
          <Modal v-model="modal4" title="请选择要考勤的时间" width="300px" footer-hide>
            <ul>
              <li v-for="(item,index) in courseTimeList" :key="index" style="font-size:16px;margin:4px 0">
                <span style="cursor:pointer" @click="doAtten(item)">第{{item.class}}节</span>
              </li>
            </ul>
          </Modal>
          <Modal v-model="modal3" title="考勤" width="1000" footer-hide>
            <Attendance v-if="target == 'attend'&& modal3" :teacher_course_list='attenDetailList'
              :teacher_course_id="teacher_course_id" :year="year" :class_ids="class_id" :semester="semester">
            </Attendance>
          </Modal>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>
<script>
import pdf from 'vue-pdf'
import modal_mixin from '@/view/mixins/modal_mixin'
import { _debounce, fullScreen } from '@/libs/util'
import live from '@/view/common/live'
import CourseTable from '@/view/teacher_common/common/course_table' // 课表
import Attendance from '@/view/teacher_common/common/attendance' // 考勤
import addtestanalyze from '@/view/publiccomponent_teacher/test/addtestanalyze_testresults.vue'// 考试分析
import TaskReleaseDetail from '@/view/teacher_common/task/task_release_detail.vue'// 任务详情
import ExamEdit from '@/view/teacher_common/exam/exam_edit.vue'// 快速命题
import HomeworkReleaseDetail from '@/view/teacher_common/homework/homework_release_detail.vue'// 作业详情
import changeLeader from '@/view/teacher_common/task/task_team_leader_change.vue'// 更换小组长
import StudentExamList from '@/view/teacher_common/exam/student_exam_list.vue'
import coursewareQuestion from '@/view/teacher_common/question/courseware_question.vue'
import selectquestionAnwser from '@/view/teacher_common/question/selectquestion_anwser.vue'
import answerList from '@/view/teacher_common/question/anwser_list.vue'
import { setTimeout } from 'timers'
import { MESSAGE_TYPE } from 'vue-baberrage'
import QRCode from 'qrcodejs2'
import { task_release } from '@/api/data'
import { handle_ppt_option } from '@/api/common'
export default {
  data () {
    return {
      teacher_course_id: '',
      pdfWidth: '',
      iscanvas: false, // 是否开启画笔
      canvasHistory: [],
      step: -1,
      canvas: '',
      context: '',
      x: '',
      y: '',
      a: '',
      b: '',
      badge: 0,
      showTime: '',
      questionAllQuestionList: [],
      collapseVal: [],
      courseTimeList: [], // 考勤时间列表
      attenDetailList: [], // 考勤课时信息
      year: '',
      semester: '',
      tt: 0,
      modal: false,
      modal1: false,
      modal2: false,
      modal3: false,
      modal4: false,
      selectQuestion: [],
      mainQuestion: [],
      deleteId: '',
      students: [],
      total: 0,
      isshowMainquestion: false,
      isshowSeclectquestion: false,
      isshowAnswerSelectAnwser: false,
      isshowAnswer: false,
      isshowDeleteModel: false,
      online_student: [],
      isshowAddquestion: false,
      alreadyQuestion: [],
      screenWidth: document.body.clientWidth,
      class_id: this.$route.query.class_id,
      courseware_id: this.$route.query.courseware_id,
      live_status: this.$route.query.live_status,
      course_status: this.$route.query.course_status,
      showdiscuss: true,
      problemAnswer: [],
      mainQuestionContent: '',
      mainAnswer_num: '',
      studentNumber: 1,
      reply_timeShow: '',
      topic_typeShow: '',
      topicShow: [],
      contentShow: '',
      loading: false,
      online_data: {
        online_count: 0,
        students: [],
        total_count: 0
      },
      // 课件管理
      courseware_list_list: [
        {
          title: '课中任务',
          courseware_list_type: 'inclass',
          courseware_list_type2: 'task',
          listlength: ''
        },
        {
          title: '课中测试',
          courseware_list_type: 'inclass',
          courseware_list_type2: 'test',
          listlength: '',

        },
        {
          title: '课后任务',
          courseware_list_type: 'afterclass',
          courseware_list_type2: 'task',
          listlength: ''
        },
        {
          title: '课后测试',
          courseware_list_type: 'afterclass',
          courseware_list_type2: 'test',
          listlength: ''
        },
        {
          title: '课后作业',
          courseware_list_type: 'afterclass',
          courseware_list_type2: 'homework',
          listlength: ''
        }
      ],
      courseware_list_type: '',
      courseware_list_type2: '',
      courseware_list: [],
      list_title: '',
      // 点名
      test_type: false,
      test_timer: null,
      test_btn_content: '点名',
      name_list: ['张三', '李四', '王五', '赵六'],
      // 弹幕数据
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
      timetable_id: 0, // 课表id
      release_teacher: 0, // 老师评权重
      release_leader: 0, // 组长评权重
      release_team: 0, // 组长评组员权重
      sendloading: false, // 发送消息的loading，用于设置发送间隔
      release_type: 0, // 问题类型 ： 1 小组 2 个人
      homeworkname: '', // 作业详情弹出显示名称
      isshowaddhomework: false,
      isshowaddclass1: false,
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
      release_id: 0, // 发布id
      show_release: false,
      release_for_choose: '', // 发布类型
      teamnumber: '', // 小组人数
      leader_name: '', // 组长姓名
      leader_id: 0, // 组长id
      ischangeleader: false,
      team_list: [], // 更换组长时显示成员列表
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
      camera_url: this.$store.state.user.userInfo.camera_url,
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
      isshare: false,
      chatlist: [],
      courseware_name: '', // 当前课件名称
      material_list: [],
      material_total: [],
      material: [], // 课件素材
      unpdf: true, // 判断src是否为pdf，true：是
      default_icon: require('@/assets/images/new_img/default.jpg')
    }
  },
  components: {
    CourseTable,
    Attendance,
    pdf,
    addtestanalyze,
    TaskReleaseDetail,
    ExamEdit,
    HomeworkReleaseDetail,
    changeLeader,
    StudentExamList,
    coursewareQuestion,
    selectquestionAnwser,
    answerList
  },
  mixins: [modal_mixin, live],
  computed: {
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
  created () {
    console.log(333);

    if (!window.localStorage.getItem('sendbarrage')) { // 弹幕发送间隔初始化
      window.localStorage.setItem('sendbarrage', new Date().getTime().toString().slice(8)) // 设置缓存(分钟+毫秒：00000-99999)
    }
    this.getInfo()
    // this.class_id = this.class_id.sort()
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
          duration: 5,
          closable: true
        })
        this.badge = 1
      }
    },
    showTime (n, o) {
      if (n !== '') {
        document.getElementsByClassName('headerShowTime')[0].style.display = 'inline-block'
      }
      setTimeout(() => {
        if (n === 0) {
          document.getElementsByClassName('headerShowTime')[0].style.display = 'none'
          this.showTime = ''
          this.$Message.info('全体作答时间结束')
          return false
        } else if (n > 0) {
          this.showTime = n - 1
        }
      }, 1000)
    },
    screenWidth (val) {
      // 为了避免频繁触发resize函数导致页面卡顿，使用定时器
      if (!this.timer) {
        // 一旦监听到的screenWidth值改变，就将其重新赋给data里的screenWidth
        this.screenWidth = val
        this.timer = true
        let that = this
        setTimeout(function () {
          // 打印screenWidth变化的值
          that.getLiveHeight()
          that.timer = false
        }, 400)
      }
    },
    pdfWidth (val) {
      if (val !== this.screenWidth) {
        this.iscanvas = false
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
    deleteQuestion (e, i) {
      if (event && event.stopPropagation) {
        event.stopPropagation() // 非IE浏览器
      } else {
        event.cancelBubble = true // IE浏览器
      }
      this.deleteId = i
      this.isshowDeleteModel = true
    },
    sureDelete () {
      this.axios.request({
        method: 'get',
        url: 'index.php/Teacher/Quiz/delete',
        params: {
          id: this.deleteId
        }
      }).then(res => {
        if (res.code === 200) {
          this.$Message.success(res.message)
          this.getQuestionList()
        } else {
          this.$Message.error(res.message)
        }
      })
    },
    showQuestion (item) {
      if (item.topic_type === 1) {
        this.isshowAnswerSelectAnwser = true
        this.selectQuestion = item
      }
      if (item.topic_type === 2) {
        this.isshowAnswer = true
        this.mainQuestion = item
      }
    },
    ok () {
      this.axios.request({
        method: 'post',
        url: 'index.php/Teacher/Quiz/save',
        data: {
          rob: 1,
          group: this.group_chat_id,
          student_ids: this.students,
          topic_type: 2,
          reply_time: '',
          quiz_id: '',
          courseware_id: this.courseware_id,
          content: this.mainQuestionContent,
          answer_num: this.studentNumber,
          type: 0
        }
      }).then(res => {
        if (res.code === 200) {
          this.$Message.success('提问成功')
          this.getQuestionList()
          this.isshowMainquestion = false
        } else {
          this.$Message.error(res.message)
        }
      })
    },
    shouDetailQuestion (i) {
      this.topic_typeShow = this.alreadyQuestion[i].topic_type
      if (this.alreadyQuestion[i].topic_type === 1) {
        this.isshowSeclectquestion = true
        this.reply_timeShow = this.alreadyQuestion[i].reply_time
        this.topicShow = this.alreadyQuestion[i].detail
        this.contentShow = this.alreadyQuestion[i].content
      } else {
        this.mainQuestionContent = this.alreadyQuestion[i].content
        this.mainAnswer_num = this.alreadyQuestion[i].answer_num
        this.isshowMainquestion = true
      }
    },
    submitQuestion (e) {
      if (this.showTime !== '') {
        this.$Message.error('正在全体作答中')
      } else {
        if (this.mainAnswer_num <= 0) {
          this.$Message.error('提问人数不能小于1')
        } else if (this.mainAnswer_num > this.online_data.online_count) {
          // } else if (this.mainAnswer_num > 100) {
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
    },
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
    submit () {
      if (parseInt(this.total) === parseInt(this.mainAnswer_num)) {
        this.axios.request({
          method: 'post',
          url: 'index.php/Teacher/Quiz/save',
          data: {
            quiz_id: '',
            student_ids: this.students,
            rob: 0,
            topic_type: 2,
            reply_time: '',
            courseware_id: this.courseware_id,
            group: this.group_chat_id,
            content: this.mainQuestionContent,
            answer_num: this.studentNumber,
            type: 0
          }
        }).then(res => {
          if (res.code === 200) {
            this.$Message.success('提问成功')
            this.getQuestionList()
            this.isshowMainquestion = false
          } else {
            this.$Message.error(res.message)
          }
        })
      } else {
        this.$Message.error('请选择' + this.mainAnswer_num + '位学生')
      }
    },
    clear () {
      if (this.$refs.studentName !== undefined) {
        for (let i = 0; i < this.$refs.studentName.length; i++) {
          this.$refs.studentName[i].style.borderColor = 'black'
        }
      }
      this.students = []
      this.total = 0
    },
    issure () {
      this.modal1 = true
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
    submitQuestion2 () {
      if (this.showTime !== '') {
        this.$Message.error('正在全体作答中')
      } else {
        this.axios.request({
          method: 'post',
          url: 'index.php/Teacher/Quiz/save',
          data: {
            topic_type: this.topic_typeShow,
            reply_time: this.reply_timeShow,
            quiz_id: '',
            topic: this.topicShow,
            courseware_id: this.courseware_id,
            group: this.group_chat_id,
            content: this.contentShow,
            answer_num: 1,
            type: 0
          }
        }).then(res => {
          if (res.code === 200) {
            this.$Message.success('提问成功')
            this.getQuestionList()
            this.showTime = this.reply_timeShow
            this.isshowSeclectquestion = false
          }
        })
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

    // 作业详情
    open_homework_info (row) {
      this.rowid = row.homework_release_id
      this.homeworkname = row.homework_name
      this.isshowaddhomework = true
    },

    // 测试详情
    open_test_info (row) {
      this.test_name = row.exam_name
      this.rowid = row.exam_release_id
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
            // window.location.href = '/user_center/teacher1/course_courseware#/user_center/teacher1/MyCourse'
            history.go(-1)
          }, 1000)
        }
      })
    },
    // 打开考勤班级选择
    openAtten () {
      let time = new Date()
      this.axios.request({
        method: 'post',
        url: '/home/course/getShcoolTerm',
        data: {
        }
      }).then(res => {
        for (let i = 0; i < res.data.list.length; i++) {
          if (res.data.list[i].semester === 1) {
            if (Date.parse(time) / 1000 < res.data.list[i].term_begins) {
              this.semester = 2
            } else {
              this.semester = 1
            }
          }
        }
      })
      this.year = new Date().getFullYear()
      this.axios.request({
        method: 'post',
        url: '/home/course/getDayClassTime',
        data: {
          teacher_course_id: this.teacher_course_id,
          semester: this.semester,
          year: this.year,
          courseware_id: this.courseware_id

        }
      }).then(res => {
        this.courseTimeList = res.data.list
        this.modal4 = true
      })
    },
    doAtten (item) {
      this.attenDetailList = item
      this.target = 'attend'

      this.modal3 = true
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
        task_release(this.release_id, this.group_chat_id).then(res => {
          console.log(res);
          if (res.code === 200) {
            this.$Message.success(res.message)
            this.getInfo()
          }
        })
      } else if (this.release_type === 'test') {
        this.axios.request({
          method: 'post',
          url: '/index.php/Teacher/Examination/live_release',
          data: {
            exam_release_id: this.release_id,
            group: this.group_chat_id,
            reply_time: '',
          }
        }).then(res => {
          console.log(res);
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
          class_id: this.class_id,
          live_status: this.live_status,
          course_status: this.course_status
        }
      }).then(res => {
        console.log(res);
        if (res.code === 200) {
          this.teacher_course_id = res.data.courseware_info.teacher_course_id
          let domain = window.location.protocol + '//' + window.location.host
          this.qrcode(`${domain}/#/live_public?courseware_id=${res.data.courseware_info.id}`)
          this.qrcode2(this.camera_url)
          this.material_list = []
          this.src = res.data.courseware_info.file_url
          this.courseware_name = res.data.courseware_info.courseware_name
          if (res.data.courseware_info.courseware_file) this.material_list = res.data.courseware_info.courseware_file
          if (res.data.task_list['1']) this.task.in = this.getArray(res.data.task_list['1'], 'task_name')
          if (res.data.task_list['2']) this.task.after = this.getArray(res.data.task_list['2'], 'task_name')
          if (res.data.exam_list['1']) this.test.in = this.getArray(res.data.exam_list['1'], 'exam_name') //课中
          if (res.data.exam_list['2']) this.test.after = this.getArray(res.data.exam_list['2'], 'exam_name')
          if (res.data.homework_list['0']) this.homework = this.getArray(res.data.homework_list['0'], 'homework_name')
          if (this.list_title === '课中任务') {
            this.courseware_list = this.task.in
          } else if (this.list_title === '课中测试') {
            this.courseware_list = this.test.in
          } else if (this.list_title === '课后任务') {
            this.courseware_list = this.task.after
          } else if (this.list_title === '课后测试') {
            this.courseware_list = this.test.after
          } else if (this.list_title === '课后作业') {
            this.courseware_list = this.homework
          }
          if (res.data.task_list['1'] === undefined) {
            this.courseware_list_list[0].listlength = 0
          } else {
            this.courseware_list_list[0].listlength = res.data.task_list['1'].length
          }
          if (res.data.exam_list['1'] === undefined) {
            this.courseware_list_list[1].listlength = 0
          } else {
            this.courseware_list_list[1].listlength = res.data.exam_list['1'].length

          }
          if (res.data.task_list['2'] === undefined) {
            this.courseware_list_list[2].listlength = 0
          } else {
            this.courseware_list_list[2].listlength = res.data.task_list['2'].length
          }
          if (res.data.exam_list['2'] === undefined) {
            this.courseware_list_list[3].listlength = 0
          } else {
            this.courseware_list_list[3].listlength = res.data.exam_list['2'].length
          }
          if (res.data.homework_list['0'] === undefined) {
            this.courseware_list_list[4].listlength = 0
          } else {
            this.courseware_list_list[4].listlength = res.data.homework_list['0'].length
          }
          this.getOnlineData(0)
        }
      })
    },
    getOnlineData (m) {
      this.axios.request({
        method: 'get',
        url: '/index.php/home/live/get_online_user',
        params: {
          group: this.group_chat_id,
          status: m
        }
      }).then(res => {
        console.log(res);

        if (res.code === 200) {
          this.online_data = res.data
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
        }).then(res => { })
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
      this.getonlineStudent()
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
      this.getOnlineData(this.tt)
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
      fullScreen(id)
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
    opewnQrCode () {
      this.qrModal = true
    },
    qrcode (url) {
      // eslint-disable-next-line no-new
      new QRCode('qrcode', {
        width: 200,
        height: 200,
        text: url, // 二维码地址
        colorDark: '#000',
        colorLight: '#fff'
      })
    },
    qrcode2 (url) {
      // eslint-disable-next-line no-new
      new QRCode('qrcode2', {
        width: 200,
        height: 200,
        text: url, // 二维码地址
        colorDark: '#000',
        colorLight: '#fff'
      })
    },
    closeList (e) {
      if (e.target.className === 'allscreen') {
        e.target.style.display = 'none'
      } else {
        return false
      }
    },
    // move (e) {
    //   var va = this.$refs.switch_input
    //   var inx = null
    //   var iny = null
    //   inx = e.clientX - va.offsetLeft
    //   iny = e.clientY - va.offsetTop
    //   document.onmousemove = function (e) {
    //     if (e.clientX - inx >= 0 && e.clientX - inx <= document.body.clientWidth - va.offsetWidth) {
    //       va.style.left = e.clientX - inx + 'px'
    //     }
    //     if (e.clientY - iny >= 0 && e.clientY - iny <= document.body.clientHeight - va.offsetHeight) {
    //       va.style.top = e.clientY - iny + 'px'
    //     }
    //     va.style.margin = 0
    //   }
    //   document.onmouseup = function () {
    //     document.onmousemove = null
    //     document.onmouseup = null
    //   }
    //   return false
    // },
    prohibitDiscuss () {
      let o = document.getElementsByClassName('prohibit-discuss-des')[0].innerText
      if (o === '全部禁言') {
        document.getElementsByClassName('prohibit-discuss-des')[0].innerText = '解除禁言'
      } else {
        document.getElementsByClassName('prohibit-discuss-des')[0].innerText = '全部禁言'
      }
      this.axios.request({
        method: 'post',
        url: '/index.php/home/live/banned',
        data: {
          group: this.group_chat_id
        }
      }).then(res => {

      })
    },
    getQuestionList () {
      this.axios.request({
        method: 'get',
        url: '/index.php/Teacher/Quiz/get_list',
        params: {
          group: this.group_chat_id,
          courseware_id: this.courseware_id,
          type: 0
        }
      }).then(res => {
        if (res.code === 200) {
          this.questionAllQuestionList = res.data.list
        }
      })
    },
    showList (index, e) {
      for (let i = 0; i < e.target.parentNode.children.length; i++) {
        e.target.parentNode.children[i].style.background = '#161616'
        e.target.parentNode.children[i].style.color = '#B6B6B6'
      }
      document.getElementsByClassName('question-badge')[0].style.background = '#161616'
      document.getElementsByClassName('question-badge')[0].style.color = '#B6B6B6'
      e.target.style.background = '#282A30'
      e.target.style.color = '#397ED6'
      if (index.title === '课中任务') {
        this.courseware_list = this.task.in
      } else if (index.title === '课中测试') {
        this.courseware_list = this.test.in

      } else if (index.title === '课后任务') {
        this.courseware_list = this.task.after
      } else if (index.title === '课后测试') {
        this.courseware_list = this.test.after
      } else if (index.title === '课后作业') {
        this.courseware_list = this.homework
      }
      this.list_title = index.title
      this.courseware_list_type = index.courseware_list_type
      this.courseware_list_type2 = index.courseware_list_type2
      for (let index = 0; index < document.getElementsByClassName('allscreen').length; index++) {
        document.getElementsByClassName('allscreen')[index].style.display = 'none'
      }
      document.getElementsByClassName('allscreen')[0].style.display = 'block'
    },
    showList2 (e) {
      for (let i = 0; i < e.target.parentNode.children.length; i++) {
        e.target.parentNode.children[i].style.background = '#161616'
        e.target.parentNode.children[i].style.color = '#B6B6B6'
      }
      this.list_title = '附件列表'
      document.getElementsByClassName('question-badge')[0].style.background = '#161616'
      document.getElementsByClassName('question-badge')[0].style.color = '#B6B6B6'
      e.target.style.background = '#282A30'
      e.target.style.color = '#397ED6'
      for (let index = 0; index < document.getElementsByClassName('allscreen').length; index++) {
        document.getElementsByClassName('allscreen')[index].style.display = 'none'
      }
      document.getElementsByClassName('allscreen')[3].style.display = 'block'
      // this.getMaterial()
      // this.getMaterialTotal()
    },
    showList3 (e) {
      let dos
      if (e.target.tagName === 'SPAN') {
        dos = e.target.parentNode
      } else {
        dos = e.target
      }
      for (let i = 0; i < dos.parentNode.children.length; i++) {
        dos.parentNode.children[i].style.background = '#161616'
        dos.parentNode.children[i].style.color = '#B6B6B6'
      }
      dos.style.background = '#282A30'
      dos.style.color = '#397ED6'
      document.getElementsByClassName('question-badge')[0].style.background = '#282A30'
      document.getElementsByClassName('question-badge')[0].style.color = '#397ED6'
      this.badge = 0
      for (let index = 0; index < document.getElementsByClassName('allscreen').length; index++) {
        document.getElementsByClassName('allscreen')[index].style.display = 'none'
      }
      document.getElementsByClassName('allscreen')[2].style.display = 'block'
      this.getQuestionList()
    },
    showListQuestion () {
      for (let index = 0; index < document.getElementsByClassName('allscreen').length; index++) {
        document.getElementsByClassName('allscreen')[index].style.display = 'none'
      }
      for (let i = 0; i < document.getElementsByClassName('live-btnList-li').length; i++) {
        document.getElementsByClassName('live-btnList-li')[i].style.background = '#161616'
        document.getElementsByClassName('live-btnList-li')[i].style.color = '#B6B6B6'
      }
      document.getElementsByClassName('question-badge')[0].style.background = '#161616'
      document.getElementsByClassName('question-badge')[0].style.color = '#B6B6B6'
      this.axios.request({
        method: 'get',
        url: '/index.php/Teacher/Quiz/get_list',
        params: {
          group: '',
          courseware_id: this.courseware_id,
          type: 1
        }
      }).then(res => {
        if (res.code === 200) {
          this.alreadyQuestion = res.data.list
        }
      })
      document.getElementsByClassName('allscreen')[1].style.display = 'block'
    },
    closeDetailList () {
      document.getElementsByClassName('allscreen')[0].style.display = 'none'
    },
    closeDetailList2 () {
      document.getElementsByClassName('allscreen')[1].style.display = 'none'
    },
    closeDetailList3 () {
      document.getElementsByClassName('allscreen')[2].style.display = 'none'
    },
    closeDetailList4 () {
      document.getElementsByClassName('allscreen')[3].style.display = 'none'
    },
    closeQList () {
      this.isshowAddquestion = false
      this.getQuestionList()
    },
    changeType (o, e) {
      for (let i = 0; i < e.target.parentNode.childNodes.length; i++) {
        e.target.parentNode.childNodes[i].className = ''
      }
      e.target.className = 'selectChangActive'
      if (o === 0) {
        this.showdiscuss = true
      } else {
        for (let i = 0; i < this.online_data.students.length; i++) {
          this.collapseVal.push(i.toString())
        }
        this.showdiscuss = false
      }
    },
    getLiveHeight () {
      document.getElementsByClassName('live-question-btn')[0].style.lineHeight = document.getElementsByClassName('live-question-btn')[0].offsetHeight + 'px'
      document.getElementsByClassName('finnish-class')[0].style.lineHeight = document.getElementsByClassName('finnish-class')[0].offsetHeight + 'px'
      for (let i = 0; i < document.getElementsByClassName('live-btnList-li').length; i++) {
        document.getElementsByClassName('live-btnList-li')[i].style.lineHeight = document.getElementsByClassName('live-btnList-li')[i].offsetHeight + 'px'
      }
    },
    changeOnlineType (index, e) {
      this.loading = true
      for (let i = 0; i < e.target.parentNode.children.length; i++) {
        e.target.parentNode.children[i].className = 'ptwz'
      }
      e.target.className = 'blwz'
      this.tt = index
      this.getOnlineData(index)
      this.loading = false
    },
    getonlineStudent () {
      this.axios.request({
        method: 'get',
        url: '/index.php/home/live/get_online_user',
        params: {
          group: this.group_chat_id,
          status: 1
        }
      }).then(res => {
        if (res.code === 200) {
          this.online_student = res.data
        }
      })
    },
    changeTime (i) {
      this.showTime = i
    },
    // createCanvas () {
    //   this.iscanvas = true
    // },
    mou1 (e) {
      if (this.iscanvas === true) {
        this.canvas = document.getElementById('pdf').childNodes[2].childNodes[0]// 获得画布
        this.context = this.canvas.getContext('2d')// 准备画笔
        this.step++
        if (this.step < this.canvasHistory.length) {
          this.canvasHistory.length = this.step // 截断数组
        }
        this.x = e.clientX - this.canvas.getBoundingClientRect().left
        this.y = e.clientY - this.canvas.getBoundingClientRect().top
        this.a = document.getElementById('context.color')
        this.b = document.getElementById('context.size')
        this.context.beginPath()
        this.context.moveTo(this.x, this.y)
        this.canvasHistory.push(this.canvas.toDataURL()) // 添加新的绘制到历史记录
      }
    },
    mou2 (e) {
      if (this.canvas !== '') {
        this.x = e.clientX - this.canvas.getBoundingClientRect().left
        this.y = e.clientY - this.canvas.getBoundingClientRect().top
        this.context.lineTo(this.x, this.y)// 绘制线条
        this.context.strokeStyle = this.a.value
        this.context.lineWidth = this.b.value
        this.context.stroke()
      }
    },
    mou3 (e) {
      this.canvas = ''
    },
    backCanvas () {
      if (this.step >= 1) {
        this.context.clearRect(0, 0, document.getElementById('pdf').childNodes[2].childNodes[0].offsetWidth, document.getElementById('pdf').childNodes[2].childNodes[0].offsetHeight)
        let canvasPic = new Image()
        canvasPic.src = this.canvasHistory[this.step - 1]
        canvasPic.addEventListener('load', () => {
          this.context.drawImage(canvasPic, 0, 0)
        })
        this.step = this.step - 2
      } else {
        console.log('不能再继续撤销了')
      }
    },
    clearCanvas () {
      this.context.clearRect(0, 0, document.getElementById('pdf').childNodes[2].childNodes[0].offsetWidth, document.getElementById('pdf').childNodes[2].childNodes[0].offsetHeight)
      let canvasPic = new Image()
      canvasPic.src = this.canvasHistory[0]
      canvasPic.addEventListener('load', () => {
        this.context.drawImage(canvasPic, 0, 0)
      })
      this.step = 0
      this.canvas = ''
    }
    // showchangeattenStatusModal (e) { // 修改学生考勤状态
    //   e.target.parentNode.childNodes[2].style.display = 'block'
    // }
  },
  mounted () {
    // this.courseware_id = this.$route.query.courseware_id
    // this.class_id = this.$route.query.class_id
    this.getonlineStudent()
    const that = this
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth
        that.screenWidth = window.screenWidth
        this.pdfWidth = document.getElementById('pdf').offsetWidth
      })()
    }
    let _this = this
    this.initChat()
    let _pdf = document.querySelector('.pdfcard')
    _pdf.onscroll = function () {
      _this.handleScroll()
    }
    setTimeout(() => {
      this.getMaterial()
      this.getMaterialTotal()
      this.getQuestionList()
      this.getLiveHeight()
    }, 1500)
  }
}
</script>
<style>
.liveul :nth-child(3) {
  color: red;
}
.liveul .livedot {
  width: 10px;
  height: 10px;
}
.finnish-class {
  width: 100%;
  height: 10%;
  background: #de5959;
  color: #ffffff;
  line-height: 80px;
  text-align: center;
  border-radius: 8px;
  margin-top: 16%;
  cursor: pointer;
}

.prohibit-discuss-btn {
  width: 100%;
  padding: 16px 0;
  background: #333335;
  border: 1px solid #3c3b3e;
  text-align: center;
  cursor: pointer;
  margin-bottom: 10px;
  border-radius: 4px;
}

.show-list {
  width: 32%;
  left: 0;
  min-width: 330px;
  height: 100%;
  background: #272930;
  position: absolute;
  z-index: 2;
  overflow: scroll;
  overflow-x: hidden;
  box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.18);
}
.list-contain {
  padding: 0 10px;
  font-size: 14px;
}
.table_item {
  width: 100%;
  color: #c4c4c4;
  background-size: 100%;
  background: #272930;
}
.table_item p {
  margin-bottom: 10px;
}
.w_btn {
  padding: 10px 0;
}
.w_btn span {
  border: 1px solid rgb(251, 250, 252);
  padding: 6px 20px;
  margin-right: 10px;
  border-radius: 6px;
  cursor: pointer;
}
.online-list-header {
  width: 100%;
  border-bottom: 1px solid #474747;
  display: flex;
  color: #d1d1d1;
}
.ptwz {
  flex: 1;
  text-align: center;
  margin: 0 20px;
  padding: 5px 0;
  cursor: pointer;
}
.blwz {
  flex: 1;
  text-align: center;
  margin: 0 20px;
  padding: 5px 0;
  cursor: pointer;
  border-bottom: 2px solid #3b88e8;
  color: #3b88e8;
}
.newtypeCollapse {
  background: #323232;
  border: none;
  height: 100%;
  overflow-y: scroll;
}
.newtypeCollapse
  > .ivu-collapse-item.ivu-collapse-item-active
  > .ivu-collapse-header {
  border-bottom: none;
}
.newtypeCollapse
  .ivu-collapse
  > .ivu-collapse-item.ivu-collapse-item-active
  > .ivu-collapse-header {
  border: none;
}
.newtypeCollapse > .ivu-collapse-item {
  color: #c5c5c5;
  border: none;
}
.newtypeCollapse > .ivu-collapse-item > .ivu-collapse-header {
  color: #c5c5c5;
  padding: 0;
}
.newtypeCollapse .ivu-collapse-content {
  background: #323232;
  color: #bcbcbc;
  padding: 0;
}
.newtypeCollapse .ivu-collapse-content > .ivu-collapse-content-box {
  padding-top: 8px;
  padding-bottom: 4px;
}
.newtypeCollapse ul {
  margin-bottom: 0;
}
.newtypeCollapse ul li {
  margin: 10px 0;
}
.online-data-name {
  position: relative;
}
.changeattenStatus {
  position: absolute;
  right: 0;
  top: 10px;
  background: rgb(55, 54, 57);
  border: 1px solid #404040;
  border-radius: 4px;
  display: none;
}
ul.changeattenStatus > li {
  margin: 4px;
  cursor: pointer;
}
.atten-r {
  display: inline-block;
  background: red;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  margin: 0 4px;
}
.atten-g {
  display: inline-block;
  background: green;
  width: 8px;
  margin: 0 4px;
  height: 8px;
  border-radius: 4px;
}
.atten-o {
  display: inline-block;
  background: orange;
  width: 8px;
  margin: 0 4px;
  height: 8px;
  border-radius: 4px;
}
.teacher-uestionlist {
  padding: 0 10px;
}
.teacher-uestionlist li {
  border: 1px solid #3e4046;
  padding: 9px 12px;
  margin-bottom: 10px;
  cursor: pointer;
}
.teacher-uestionlist li > span:nth-of-type(1),
.teacher-uestionlist li > span:nth-of-type(3) {
  color: #a7a7a7;
}
.teacher-uestionlist li > span:nth-of-type(2) {
  color: #547a63;
  margin-right: 10px;
}
.add-question {
  background: #26282f;
  border: 1px solid #3e4046;
  color: #3b88e8;
  padding: 9px 56px;
  margin: 0 10px 10px 10px;
  cursor: pointer;
  outline: none;
}
.questionContain {
  background: #e7e7e7;
  color: #26282f;
  font-size: 14px;
  border-radius: 4px;
  padding: 14px;
}
.questionContain > p {
  margin: 0 0 18px 0;
}
.questionContain > p:nth-of-type(5) {
  margin-bottom: 6px;
}
.questionContain > .questionContain-question {
  margin-bottom: 30px;
}
.qrModal .ivu-modal-body {
  padding: 40px 60px;
  display: flex;
  justify-content: space-between;
  font-size: 16px;
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
.hei-modal .ivu-modal-body {
  height: 700px;
}
.gray {
  -webkit-filter: grayscale(100%);
  -moz-filter: grayscale(100%);
  -ms-filter: grayscale(100%);
  -o-filter: grayscale(100%);

  filter: grayscale(100%);

  filter: gray;
}
.clear:after {
  content: "";
  display: block;
  height: 0;
  clear: both;
}
.clearfix {
  zoom: 1;
}

.show-list::-webkit-scrollbar {
  width: 0 !important;
}
#pdf::-webkit-scrollbar {
  width: 0 !important;
}
.newtypeCollapse::-webkit-scrollbar {
  width: 0 !important;
}
</style>
