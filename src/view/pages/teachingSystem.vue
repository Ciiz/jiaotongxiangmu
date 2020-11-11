<template>
  <div class="teachingSystem">
    <div class="unshowModal" @click="unshowSelectCourseModal ()"></div>
    <Header class="new-headerContain">
      <ul class="new-styleHeader">
        <li class="logo-contain">
          <router-link class="logo-contain-logo" to="/index">
            <img src="@/assets/images/teachingSystem/logo@2x.png" alt="">
          </router-link>
        </li>
        <li class="tab-contain">
          <ul class="main-tab">
            <li>
              <span style="margin-right:10px"
                class="ivu-avatar ivu-avatar-circle ivu-avatar-default ivu-avatar-image new-avatar">
                <img :src="userAvatar" alt="" :onerror="errorImg01">
              </span>
              <span
                class="header-username">{{$store.state.user.userInfo.name}}&nbsp;{{$store.state.user.userInfo.userType === 1 ? '老师' : '同学'}}</span>
            </li>
            <li @click="returnHome" style="cursor:pointer">
              <img src="@/assets/images/teachingSystem/backhome.png" alt="" :onerror="errorImg01">
              返回首页
            </li>
            <li @click="logout" style="cursor:pointer">
              <img src="@/assets/images/teachingSystem/logout.png" alt="" :onerror="errorImg01">
              注销账号
            </li>
          </ul>
        </li>
        <div style="clear:both"></div>
      </ul>
      <ul class="course-menu">
        <div class="sjx-t"></div>
        <div class="sjx-t2"></div>
        <li class="menu-l">
          <ul class="menu-l-tab">
            <router-link v-if="userType===1" v-for="(item) in teacher_tab" :key="item.title" :to="{path: item.path}"
              active-class="allTab-active" class="menuTabtitle" @click.native="changeTab($event)">
              <img :src="item.imgsrc">
              <span>{{item.title}}</span>
            </router-link>
            <router-link v-if="userType===2" v-for="(item) in student_tab" :key="item.title" :to="{path: item.path}"
              active-class="allTab-active" class="menuTabtitle" @click.native="changeTab($event)">
              <img :src="item.imgsrc">
              <span>{{item.title}}</span>
            </router-link>
          </ul>
        </li>
        <li class="menu-r">
          <ul class="menu-r-tab">
            <a @click="showInfo">
              <Badge dot :offset='[10,-4]' :count="data.message_total">
                <span class="mainTab">消息中心</span>
              </Badge>
            </a>
            <a @click="showInfo">
              <Badge dot :offset='[10,-4]' :count="data.system_total">
                <span class="mainTab">系统通知</span>
              </Badge>
            </a>
          </ul>
        </li>
        <div style="clear:both"></div>
      </ul>
    </Header>
    <div style="clear:both"></div>
    <Layout style="height:100%;background:#2E3640;margin-left:4px;position:relative">
      <div class="infoModal-full" @click="closeInfoCenter($event)">
        <div class="infoModal">
          <Spin v-if="infoloading" fix></Spin>
          <div class="infoModal-l">
            <div class="infoModal-l-header" v-if="userType===1">
              <Icon type="ios-search" :size="24" style="right:96px" v-if="infoCenter==='people'" />
              <input type="text" v-if="infoCenter==='people'" />
              <Icon type="ios-search" :size="24" v-if="infoCenter==='system'" />
              <input type="text" v-if="infoCenter==='system'" style="width:254px" />
              <button class="blueC-btn" v-if="infoCenter==='people'" @click="showAddDiscuss">添加话题</button>
            </div>
            <!-- 信息中心 -->
            <div class="infoModal-l-list" v-if="infoCenter==='people'">
              <Row type="flex" v-for="(item,index) in chatList" v-if="item.delete_status===1" :key="index+'chatList'"
                class="infoModal-l-list-l" @click.native="selectCurrentInfo($event,item)">
                <Col>
                <Badge :offset=[-4,6] :count="item.unread">
                  <img v-if="item.table_type===2" :src="item.userInfo.icon"
                    style="width:44px;height:44px;border-radius:5px;margin-right:10px" />
                  <img v-if="item.table_type===1||item.table_type===3" :src="item.icon"
                    style="width:44px;height:44px;border-radius:5px;margin-right:10px" />
                </Badge>
                </Col>
                <Col style="flex:1">
                <Row type="flex" justify="space-between">
                  <Col class="infoModal-title" v-if="item.table_type===2">{{item.userInfo.name}}<span
                    v-if="userType === 1&&item.title===undefined">({{item.userInfo.class_name}})</span></Col>
                  <Col class="infoModal-title" v-if="item.table_type===3">{{item.title}}</Col>
                  <Col class="infoModal-title" v-if="item.table_type===1">{{item.task_name}}</Col>
                  <Col class="infoModal-time">{{moment(item.created_at * 1000).format('YYYY-MM-DD HH:mm')}}</Col>
                </Row>
                <Row style="margin-top:5px">
                  <Col class="infoModal-content">{{item.content}}</Col>
                </Row>
                <Icon type="md-close" size="20" class="infoModal-content-md-close" @click="showDeleteDiscuss(item)" />
                </Col>
              </Row>
            </div>
            <!-- 系统通知 -->
            <div class="infoModal-l-list" v-if="infoCenter==='system'">
              <Row type="flex" class="infoModal-l-list-l" @click.native="selectCurrentSystem2($event)">
                <Col>
                <Badge :offset=[-4,6] :count="system_unread">
                  <img src="@/assets/images/teachingSystem/systeminfo.png" style="margin-right:10px;width:44px" />
                </Badge>
                </Col>
                <Col style="flex:1">
                <Row type="flex" justify="space-between">
                  <Col class="infoModal-title">系统信息</Col>
                </Row>
                </Col>
              </Row>
              <Row type="flex" class="infoModal-l-list-l" @click.native="selectCurrentSystem2($event)">
                <Col>
                <Badge :offset=[-4,6] :count="remind_unread">
                  <img src="@/assets/images/teachingSystem/ring.png" style="margin-right:10px;width:44px" />
                </Badge>
                </Col>
                <Col style="flex:1">
                <Row type="flex" justify="space-between">
                  <Col class="infoModal-title">上课提醒</Col>
                </Row>
                </Col>
              </Row>
              <Row type="flex" class="infoModal-l-list-l" @click.native="selectCurrentSystem2($event)">
                <Col>
                <Badge :offset=[-4,6] :count="commission_unread">
                  <img src="@/assets/images/teachingSystem/infocorrect.png" style="margin-right:10px;width:44px" />
                </Badge>
                </Col>
                <Col style="flex:1">
                <Row type="flex" justify="space-between">
                  <Col class="infoModal-title">待办</Col>
                </Row>
                </Col>
              </Row>
            </div>
          </div>
          <div class="infoModal-r" v-if="infoTitle==='系统信息'">
            <div class="infoModal-r-title">
              <span>{{infoTitle}}</span>
            </div>
            <!-- 系统通知的 查看历史消息 -->
            <div class="infoModal-r-content">
              <div>
                <div>
                  <div class="ab-scroll">
                    <div class="userinfo-info-showhistory" @click="getSystemInfo (2,systemHistory);systemHistory++">
                      查看历史消息>></div>
                    <div class="system-info-row" v-for="(item,index) in systemInfoList" :key="index">
                      <div class="hd" v-if="item.status===0"></div>
                      <Row type="flex" justify="space-between">
                        <Col class="system-info-row-header">{{item.title}}</Col>
                        <Col style="color:#AAAAAA">{{moment(item.created_at * 1000).format('YYYY-MM-DD HH:mm')}}</Col>
                      </Row>
                      <div class="system-info-row-color8" v-html="item.content"> </div>
                      <div style="margin-top:10px;color:#FF3333"><span style="cursor:pointer"
                          @click="modal3=true,deleteSystemId=item.id">删除</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="infoModal-r" v-else-if="infoTitle==='上课提醒'">
            <div class="infoModal-r-title">
              <span>{{infoTitle}}</span>
            </div>
            <div class="infoModal-r-content">
              <div>
                <div class="ab-scroll">
                  <div class="userinfo-info-showhistory" @click="getSystemInfo(2,classInfoHistory);classInfoHistory++">
                    查看历史消息>></div>
                  <div class="system-info-row" v-for="(item,index) in systemInfoList" :key="index">
                    <Row type="flex" justify="space-between">
                      <Col class="system-info-row-header">{{item.title}}</Col>
                      <Col style="color:#AAAAAA">{{moment(item.created_at * 1000).format('YYYY-MM-DD HH:mm')}}</Col>
                    </Row>
                    <div class="system-info-row-color8" style="line-height:22px">
                      {{item.content}}
                    </div>
                    <div style="margin-top:10px;color:#FF3333"><span style="cursor:pointer"
                        @click="modal3=true,deleteSystemId=item.id">删除</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="infoModal-r" v-else-if="infoTitle==='待办'">
            <div class="infoModal-r-title">
              <span>{{infoTitle}}</span>
            </div>
            <div class="infoModal-r-content">
              <div>
                <div class="ab-scroll">
                  <div class="userinfo-info-showhistory" @click="getSystemInfo(2,uncorrectHistory);uncorrectHistory++">
                    查看历史消息>></div>
                  <div class="system-info-row" v-for="(item,index) in systemInfoList" :key="index">
                    <Row type="flex" justify="space-between">
                      <Col class="system-info-row-header">{{item.title}}</Col>
                      <Badge dot :count="item.status===0?1:0">
                        <Col style="color:#AAAAAA;margin-right:10px">
                        {{moment(item.created_at * 1000).format('YYYY-MM-DD HH:mm')}}</Col>
                      </Badge>
                    </Row>
                    <div>
                      <span style="color:#222222" v-html="item.content"></span>
                      <!-- <span class="system-info-row-color8">的课前任务（这是任 务名称生活习性调查）时间已截止，可以去批改啦！</span> -->
                    </div>
                    <router-link to @click.native="toCorrect($event,item)" style="display:inline-block;margin-top:12px"
                      v-if="userType===1">
                      <span>前往批改>></span>
                    </router-link>
                    <router-link to @click.native="toReply($event,item)" style="display:inline-block;margin-top:12px"
                      v-if="userType===2">
                      <span>前往作答>></span>
                    </router-link>
                    <div style="margin-top:10px;color:#FF3333"><span style="cursor:pointer"
                        @click="modal3=true,deleteSystemId=item.id">删除</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="infoModal-r" style="position:relative" v-else>
            <div class="sjx-la" v-if="addInfoModal===true"></div>
            <div v-if="addInfoModal===true"
              style="width:100%;height:100%;background:#ffffff;position:absolute;z-index:100;padding:20px">
              <div style="color:#222222;font-size:14px">添加话题</div>
              <Input type="text" placeholder="请输入话题标题" v-model="discussAboutTitle" style="margin:14px 0" />
              <Input type="textarea" placeholder="话题描述" v-model="discussAboutContent" :rows='5' />
              <div>参与班级：
                <Select v-model="selectClaaaList" multiple style="width:200px;margin:14px 0">
                  <Option v-for="item in classList" :value="item.id" :key="item.id">{{ item.class_name }}</Option>
                </Select>
              </div>
              <div>
                <Button type="primary" style="width:100%;margin:10px 0;padding:10px 0"
                  @click="addDiscussAbout">确定添加</Button>
                <Button style="width:100%;padding:10px 0" @click="addInfoModal=false">取消</Button>
              </div>
            </div>
            <div class="infoModal-r-title">
              <span>{{infoTitle}}</span>
            </div>
            <!-- 消息中心的 查看历史消息 -->
            <div class="infoModal-r-content">
              <div>
                <div class="ab-scroll">
                  <div class="userinfo-info-showhistory" @click="getAnwserNum++,getAnwser(getAnwserNum)">查看历史消息>></div>
                  <!-- <div class="infoModal-t">2020-4-21 10:20</div> -->
                  <div v-for="(item,index) in answerList" :key="index">
                    <div v-if="userType===1&&table_type===2"
                      :class="item.type === 1&&userType===1 ? 'userinfo-right' : 'userinfo-left'">
                      <div>
                        <img :src="item.userInfo.icon" />
                      </div>
                      <div>
                        <div></div>
                        {{item.content}}
                      </div>
                    </div>
                    <div v-if="userType===1&&table_type===3"
                      :class="item.type === 1&&userType===1 ? 'userinfo-right' : 'userinfo-left'">
                      <div v-if="item.content">
                        <img :src="item.object.icon" />
                      </div>
                      <div v-if="item.content">
                        <div></div>
                        {{item.content}}
                      </div>
                    </div>
                    <div v-if="userType===2&&table_type===2"
                      :class="item.type === 2&&userType===2 ? 'userinfo-right' : 'userinfo-left'">
                      <div>
                        <img :src="item.userInfo.icon" />
                      </div>
                      <div>
                        <div></div>
                        {{item.content}}
                      </div>
                    </div>
                    <div v-if="userType===2&&table_type===1"
                      :class="item.object_id===userId&&userType===2 ? 'userinfo-right' : 'userinfo-left'">
                      <div>
                        <img :src="item.userInfo.icon" />
                      </div>
                      <div>
                        <div></div>
                        {{item.content}}
                      </div>
                    </div>
                    <div v-if="userType===2&&table_type===3"
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
            <!-- 发送消息 -->
            <div class="infoModal-r-bottom">
              <!-- <div>
                  <Icon type="ios-happy" size="20"/>
                  <Icon type="md-images" size="20"/>
                  <Icon type="ios-folder" size="20"/>
                </div> -->
              <div style="margin-top:6px;flex:1">
                <Input class="new-textarea" v-model="discussinfo" @on-enter="sendInfo" type="textarea"
                  style="width:100%;height:100%" />
              </div>
              <div>
                <button class="blackBorderC-btn" style="float:right;margin-top:5px" @click="sendInfo">发送</button>
              </div>
            </div>

          </div>
        </div>
      </div>
      <Sider hide-trigger class="myCourse-slider"
        style="max-width:400px;min-width:0px;width:400px;flex:none;background:#2E3640;"
        v-show="currentSelect==='course'">
        <ul class="myCourse-slider-type" v-show="bind_type===1||bind_type===2||bind_type===3||bind_type===4&&showT">
          <li>
            <span @click="changType($event,4)" class="ty" v-show="bind_type===4">全部</span>
            <span @click="changType($event,4)" v-show="bind_type!==4">全部</span>
          </li>
          <li>
            <span @click="changType($event,1)" class="ty" v-show="bind_type===1">被分配</span>
            <span @click="changType($event,1)" v-show="bind_type!==1">被分配</span>
          </li>
          <li>
            <span @click="changType($event,2)" class="ty" v-show="bind_type===2">自选</span>
            <span @click="changType($event,2)" v-show="bind_type!==2">自选</span>
          </li>
          <li>
            <span @click="changType($event,3)" class="ty" v-show="bind_type===3">自建</span>
            <span @click="changType($event,3)" v-show="bind_type!==3">自建</span>
          </li>
        </ul>
        <Row type="flex" justify="space-between" class="courswaretable" v-if="userType===1">
          <Col style="flex:1">
          <span class="tabSearch">
            <input placeholder="输入关键词" v-model="keyword" @keyup.enter="getData()" />
            <img src="@/assets/images/teachingSystem/search.png" style="cursor:pointer" @click="getData()" />
          </span>
          </Col>
          <Col>
          <span @click="open('course_table','','课程表编辑',1100)" v-show="bind_type === 0" class="timetable-btn">
            <img src="@/assets/images/teachingSystem/coursewaretable.png"
              style="margin-right:10px;vertical-align:text-top" />
            课程表
          </span>
          <span @click="showSelectCourseModal" v-show="bind_type === 2" class="selectcourse">
            添加课程
          </span>
          <span @click="showAddCourseModal('')" v-show="bind_type === 3" class="addcourse">
            添加课程
          </span>
          </Col>
        </Row>
        <Row type="flex" justify="space-between" class="courswaretable" v-if="userType===2&&showClassTable === true">
          <Col>
          <span class="white-f" style="line-height:30px">
            课程列表
          </span>
          </Col>
          <Col>
          <span @click="open('school_course','','课程')" class="timetable-btn" style="background:#3B9BFF">
            <img src="@/assets/images/teachingSystem/myCourse.png"
              style="margin-right:10px;vertical-align:middle;transform:translateY(-1px)" />
            选课
          </span>
          <span @click="open('course_table_student','','课表')" class="timetable-btn">
            <img src="@/assets/images/teachingSystem/coursewaretable.png"
              style="margin-right:10px;vertical-align:middle;transform:translateY(-1px)" />
            课程表
          </span>
          </Col>
        </Row>
        <vue-scroll :ops="ops" style="width:100%;height:100%">
          <div style="height:100%;width:100%">
            <ul class="mycourse-slider">
              <li v-for="(item,index) in list" class="mycourse"
                :class="$store.state.user.courseData.id===item.id?'mycourse-slider-active':''" v-if="userType===1"
                :key="item.id" @click="selectCourse(item,index)">
                <span>{{index+1}}</span>
                <img :src="item.img" />
                <span class="mycourse-slider-title-d">
                  <p style="font-size:16px">{{item.course_name}}</p>
                  <p style="color:#73787F">专业：{{item.major_name}}</p>
                </span>
              </li>
              <li v-for="(item,index) in list" class="mycourse"
                :class="$store.state.user.courseData.id===item.id?'mycourse-slider-active':''" v-if="userType===2"
                :key="item.id" @click="selectCourse(item,index)">
                <span>{{index+1}}</span>
                <img :src="item.img" />
                <span class="mycourse-slider-title-m">
                  <p style="font-size:16px">{{item.course_name}}</p>
                </span>
                <span style="color:#ffffff;line-height:60px" v-if="showScore===true">
                  <span style="font-size:24px">{{item.course_score}}</span>
                  <span style="font-size:14px">分</span>
                </span>
              </li>
            </ul>
          </div>
        </vue-scroll>
        <img src="@/assets/images/teachingSystem/packup.png" @click="closeSlider" class="packupImg" />
      </Sider>
      <Content class="ii-content" style="overflow:hidden;flex-direction:column;display:flex">
        <div style="background:#f2f2f2;height:100%;margin:4px 4px 4px 0;display:flex">
          <selectCourse v-if="showSelectCourse===true" @closeSelect="unshowSelectCourseModal" @bind-success="getData()"
            @changeNameT="changeNameT"></selectCourse>
          <addCourse v-if="showAddCourse===true" :course_id="changeCourseId" @success="getData()"
            @closeSelect="unshowSelectCourseModal"></addCourse>
          <img src="@/assets/images/teachingSystem/openSlider.png" @click="openSlider" class="openSlider" />
          <!--教师端及学生端当导航栏为课程类型且课程不为空时-->
          <div
            v-if="$store.state.user.courseData.length!==0&&course_namet !=='userInfoCenter'&&course_namet!=='studentUserCenter'&&course_namet!=='task'&&course_namet!=='homeworkExam'&&course_namet!=='inCourseDetail'&&course_namet!=='correct'&&course_namet!=='addCourseware'&&showSelectCourse===false&&showAddCourse===false"
            style="padding:0 30px;height:100%;width:100%;flex-direction: column;display: flex;position:relative;z-index:1001">
            <h1 style="color:#666666；font-size:26px;margin:20px 0">{{course_namet}}</h1>
            <keep-alive>
              <router-view @openSlider="openSlider" @showAddCourseModal='showAddCourseModal'
                @showCourseDetail="showCourseDetail" @showAllCourseDetail="showAllCourseDetail"
                @showAddCourseware='showAddCourseware' @closeAddCourseware='closeAddCourseware'
                @refreshData="refreshData" @reback="reback" @bind-success="regetData()" :courdetail="courdetail"
                v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
            <router-view v-if="!$route.meta.keepAlive"></router-view>
          </div>
          <!--教师端及学生端当导航栏为课程类型且课程为空时-->
          <div
            v-if="$store.state.user.courseData.length===0&&course_namet !=='userInfoCenter'&&course_namet!=='studentUserCenter'&&course_namet!=='task'&&course_namet!=='homeworkExam'&&course_namet!=='inCourseDetail'&&course_namet!=='correct'&&course_namet!=='addCourseware'&&showSelectCourse===false&&showAddCourse===false"
            style="height:100%;width:100%;background:#ffffff;position:relative">
            <div
              style="text-align:center;position:relative;top:50%;transform:translate(-50%,-50%);left:50%;position:absolute">
              <div><img src="@/assets/images/teachingSystem/mycourse-gb.png" /></div>
              <div><span style="color:#AFAFAF;font-size:14px">请选择一门课程</span></div>
            </div>
          </div>
          <!--教师端当导航栏为个人中心时-->
          <div v-if="course_namet ==='userInfoCenter'" style="height:100%;width:100%;background:#ffffff">
            <userInfoCenter></userInfoCenter>
          </div>
          <!--教师端当导航栏为批改时-->
          <div v-if="course_namet ==='correct'" style="height:100%;width:100%;background:#ffffff">
            <correct></correct>
          </div>
          <!--教师端新增课件-->
          <div v-if="course_namet ==='addCourseware'" style="height:100%;width:100%;background:#ffffff">
            <addCourseware @closeAddCourseware='closeAddCourseware' :type="type" :teacher_course_id="teacher_course_id"
              :courseware_id="courseware_id" :timet_id="timet_id" :courseware_name="courseware_name"
              :exam_release_id="exam_release_id" :action_type="action_type"></addCourseware>
          </div>
          <!--课程章节详细内容-->
          <div v-if="course_namet ==='inCourseDetail'" style="height:100%;width:100%;background:#ffffff">
            <inCourseDetail @closeCourseDetail="closeCourseDetail" :course_id="courseId"
              :showAllCourseDetailCId='showAllCourseDetailCId' :showAllCourseDetailEdit='showAllCourseDetailEdit'
              :showAllCourseDetailType='showAllCourseDetailType' :showAllCourseDetailId="showAllCourseDetailId"
              :id='coursedetail_id'></inCourseDetail>
          </div>
          <!--学生端当导航栏为个人中心时-->
          <div v-if="course_namet ==='studentUserCenter'" style="height:100%;width:100%;background:#ffffff">
            <studentUserCenter></studentUserCenter>
          </div>
          <!--学生端当导航栏为我的任务时-->
          <div v-if="course_namet ==='task'" style="height:100%;width:100%;background:#ffffff">
            <task :type="0" :teacher_course_id="0" :show_filter_option="true" :toTasktId="toTasktId"
              :toIsLeader="toIsLeader" @sendInfoStudent="sendInfoStudent" @showUserDiscuss="showUserDiscuss"></task>
          </div>
          <!--学生端当导航栏为作业测试时-->
          <div v-if="course_namet ==='homeworkExam'" style="height:100%;width:100%;background:#ffffff">
            <homeworkExam @unshowTab="unshowTab" :toCorrectType="toCorrectType" :toCorrectId="toCorrectId">
            </homeworkExam>
          </div>
        </div>
        <Modal v-model="modal" :title="title" width="1100px" footer-hide>
          <!-- <courseTimetable :teacher_course_id="target_id" v-if="target === 'course_timetable' && modal" @error="modal = false"></courseTimetable> -->
          <!-- <courseChooseList :course_id="target_id" v-if="target === 'course_choose_list' && modal" @bind-success="getData()"></courseChooseList> -->
          <courseDetailEdit :course_id="target_id" v-if="target === 'course_detail_edit' && modal" @success="getData()">
          </courseDetailEdit>
          <SchoolCourse v-if="target === 'school_course'" @bind-course="getData()"></SchoolCourse>
          <CourseTable :teacher_course_id="target_id" v-if="target === 'course_table' && modal"></CourseTable>
          <CourseTableStudent :teacher_course_id="target_id" v-if="target === 'course_table_student' && modal">
          </CourseTableStudent>
        </Modal>
      </Content>
    </Layout>
    <Modal v-model="modal1" title="跳转" @on-ok="ok">
      <p>是否离开添加课程页面</p>
    </Modal>
    <Modal v-model="modal2" title="跳转" @on-ok="deleteDiscuss">
      <p>是否删除当前聊天内容</p>
    </Modal>
    <Modal v-model="modal3" title="跳转" @on-ok="deleteSystem">
      <p>是否确定删除当前消息</p>
    </Modal>
    <Modal v-model="isshowclass" title="上课" @on-ok="entryClass">
      <p>当前正在上课，是否进入直播间</p>
    </Modal>
    <Footer class="teachingSystem-footer">
      <Row>
        <Col :span="13" style="margin-top:6px">
        <Row type="flex" justify="space-between">
          <Col>由英途信息提供技术支持Copyright©2019 Mobild Inc.</Col>
          <Col>版权所有：广州市英途信息软件股份有限公司</Col>
          <Col>粤ICP备10231381号-3号</Col>
        </Row>
        </Col>
        <Col :span="11">
        <span class="callme-btn">
          <img src="@/assets/images/teachingSystem/callme.png" style="margin-right:2px" />
          <span>联系我们</span>
        </span>
        </Col>
      </Row>
    </Footer>
  </div>
</template>
<script>
import modal_mixin from '@/view/mixins/modal_mixin'
import live from '@/view/common/live'
import { mapActions, mapMutations } from 'vuex'
import routers from '@/router/routers'
import CourseTable from '@/view/teacher_common/common/course_table'
import CourseTableStudent from '@/view/components/course_table'
import courseChooseList from '@/view/teacher_common/course/course_choose_list.vue'
import courseDetailEdit from '@/view/teacher_common/course/course_detail_edit.vue'
import SchoolCourse from '@/view/class_common/course/school_course'
import selectCourse from '@/view/teachingSystem_page/courseware_manage/selectCourse.vue'
import addCourse from '@/view/teachingSystem_page/courseware_manage/addCourse.vue'
import addCourseware from '@/view/teachingSystem_page/course_courseware_manage/addCourseware.vue'
import userInfoCenter from '@/view/teachingSystem_page/userInfoCenter.vue'
import correct from '@/view/teacher_page/course_manage/correct.vue'
import studentUserCenter from '@/view/user/profile'
import task from '@/view/class_common/task/task_list.vue'
import homeworkExam from '@/view/single-page/homework_exam.vue'
import inCourseDetail from '@/view/teachingSystem_page/inCourseDetail.vue'
import { my_course } from '@/api/student'
import { sendDiscussTeacher, sendInfoTeacher, sendInfoStudent, sendInfoGroup, sendDiscussStudent } from '@/api/chat'

export default {
  components: {
    CourseTableStudent,
    CourseTable,
    courseDetailEdit,
    courseChooseList,
    selectCourse,
    addCourse,
    userInfoCenter,
    addCourseware,
    correct,
    SchoolCourse,
    studentUserCenter,
    task,
    homeworkExam,
    inCourseDetail
  },
  watch: {
    '$route' (newRoute) {
      this.setBreadCrumb(newRoute)
    },
    chatList: {
      handler (newValue, oldValue) {
        let o
        for (let i = 0; i < this.chatList.length - 1; i++) {
          for (let j = i + 1; j < this.chatList.length; j++) {
            if (this.chatList[j].created_at > this.chatList[i].created_at) {
              o = this.chatList[i]
              this.chatList[i] = this.chatList[j]
              this.chatList[j] = o
            }
          }
        }
      },
      deep: true
    },
    currentTab (n, o) {
      if (this.userType === 1) {
        if (n === '我的课程' || n === '课程管理' || n === '课件管理' || n === '考核评价') {
          this.currentSelect = 'course'
          this.openSlider()
          this.course_namet = this.$store.state.user.courseData.course_name
        } else if (n === '个人信息') {
          this.currentSelect = ''
          this.unshowOpenImg()
          this.course_namet = 'userInfoCenter'
        } else if (n === '作业批改') {
          this.currentSelect = ''
          this.unshowOpenImg()
          this.course_namet = 'correct'
        } else {
          this.unshowOpenImg()
        }
        if (n === '课程管理') {
          this.showT = true
        } else {
          this.showT = false
        }
      } else if (this.userType === 2) {
        if (n === '考核评价') {
          this.showScore = true
        } else {
          this.showScore = false
        }
        if (n === '我的课程' || n === '考核评价' || n === '课堂笔记') {
          this.currentSelect = 'course'
          this.openSlider()
          this.course_namet = this.$store.state.user.courseData.course_name
        } else if (n === '个人信息') {
          this.currentSelect = ''
          this.unshowOpenImg()
          this.course_namet = 'studentUserCenter'
        } else if (n === '我的任务') {
          this.currentSelect = ''
          this.unshowOpenImg()
          this.course_namet = 'task'
        } else if (n === '作业测试') {
          this.currentSelect = ''
          this.unshowOpenImg()
          this.course_namet = 'homeworkExam'
        } else {
          this.unshowOpenImg()
          this.currentSelect = ''
        }
      }
    }
  },
  mixins: [modal_mixin, live],
  computed: {
    cacheList () {
      const list = ['teachingSystem', 'class', 'home', 'classing', 'after']
      return list
    },
    access () {
      return this.$store.state.user.access
    },
    breadCrumbList () {
      return this.$store.state.app.breadCrumbList
    },
    unreadCount () {
      return this.$store.state.user.unreadCount
    },
    unreadCount_teacher () {
      return this.$store.state.user.unreadCount_teacher
    },
    userAvatar () {
      return this.$store.state.user.avatarImgPath
    },
    menuList () {
      return this.$store.state.user.userInfo.userType === 1 ? this.constMenuList['teacher'] : this.constMenuList['student']
    },
    currentTab () {
      return this.$store.state.user.currentTab
    }
  },
  data () {
    return {
      toCorrectType: '',
      toCorrectId: '',
      toTasktId: '',
      toIsLeader: '',
      isshowclass: false,
      live_status: '',
      student_courseware_id: '',
      showAllCourseDetailId: ',',
      showAllCourseDetailType: '',
      showAllCourseDetailEdit: '',
      showAllCourseDetailCId: '',
      courseId: '',
      coursedetail_id: '',
      answerList: [],
      getAnwserNum: '',
      deleteSystemId: '',
      modal2: false,
      modal3: false,
      topic_id: '',
      discussAboutTitle: '', // 添加话题标题
      discussAboutContent: '', // 添加话题内容
      selectClaaaList: [], // 添加话题选择的班级
      classList: [], // 班级列表
      courseware_name: '',
      timet_id: '',
      exam_release_id: '',
      action_type: '',
      courseware_id: '',
      teacher_course_id: '',
      type: '',
      student_task_id: '',
      taskgroup: '',
      deltable_type: '',
      changeCourseId: '',
      table_type: '',
      deltaskgroup: '',
      delId: '',
      studentanswer: [],
      teacheranswer: [],
      answervalue: '',
      answer: [],
      resdata: [],
      chatList: [], // 一对一聊天列表
      discussinfo: '', // 聊天框信息
      systemHistory: 1, // 第几次点系统信息历史消息
      classInfoHistory: 1, // 第几次点上课提醒历史消息
      uncorrectHistory: 1, // 第几次点待办历史消息
      systemInfoList: [], // 系统通知列表
      systemInfoType: '', // 系统通知类型
      system_unread: 0, // 系统信息条数
      remind_unread: 0, // 上课提醒条数
      commission_unread: 0, // 代办条数
      infoloading: false,
      addInfoModal: false,
      infoTitle: '',
      infoCenter: 'people', // 显示的消息类型
      showScore: false, // 导航栏显示分数
      showClassTable: true,
      modal1: false,
      showT: false,
      userType: this.$store.state.user.userInfo.userType,
      userId: this.$store.state.user.userId,
      data: {
        message_total: 0,
        system_total: 0
      },
      list: [],
      course_namet: '',
      bind_type: this.$store.state.user.bindType,
      currentSelect: 'course',
      modal: false,
      courdetail: '',
      keyword: '',
      showSelectCourse: false,
      showAddCourse: false,
      ops: {
        vuescroll: {},
        scrollPanel: {},
        rail: {
          keepShow: true
        },
        bar: {
          hoverStyle: true,
          onlyShowBarOnScroll: false, // 是否只有滚动的时候才显示滚动条
          background: '#657282', // 滚动条颜色
          opacity: 0.5, // 滚动条透明度
          'overflow-x': 'hidden'
        }
      },
      teacher_tab: [
        {
          title: '我的课程',
          imgsrc: require('@/assets/images/teachingSystem/myCourse.png'),
          path: '/teachingSystem/MyCourse'
        },
        {
          title: '课程管理',
          imgsrc: require('@/assets/images/teachingSystem/courseManagement.png'),
          path: '/teachingSystem/course'
        },
        {
          title: '课件管理',
          imgsrc: require('@/assets/images/teachingSystem/courseCourseware.png'),
          path: '/teachingSystem/course_courseware_manage'
        },
        {
          title: '作业批改',
          imgsrc: require('@/assets/images/teachingSystem/correct.png'),
          path: '/teachingSystem/correct'
        },
        {
          title: '考核评价',
          imgsrc: require('@/assets/images/teachingSystem/examine.png'),
          path: '/teachingSystem/teacherassess'
        },
        {
          title: '个人信息',
          imgsrc: require('@/assets/images/teachingSystem/personal.png'),
          path: '/teachingSystem/teacher_personalinformation'
        }
      ],
      student_tab: [
        {
          title: '我的课程',
          imgsrc: require('@/assets/images/teachingSystem/myCourse.png'),
          path: '/teachingSystem/StudentCourse'
        },
        {
          title: '课堂笔记',
          imgsrc: require('@/assets/images/teachingSystem/courseManagement.png'),
          path: '/teachingSystem/student_notes'
        },
        {
          title: '我的任务',
          imgsrc: require('@/assets/images/teachingSystem/task.png'),
          path: '/teachingSystem/task'
        },
        {
          title: '作业测试',
          imgsrc: require('@/assets/images/teachingSystem/correct.png'),
          path: '/teachingSystem/homework_exam'
        },
        {
          title: '考核评价',
          imgsrc: require('@/assets/images/teachingSystem/examine.png'),
          path: '/teachingSystem/examine/course_score'
        },
        {
          title: '个人信息',
          imgsrc: require('@/assets/images/teachingSystem/personal.png'),
          path: '/teachingSystem/profile'
        }
      ]
    }
  },
  methods: {
    ...mapActions([
      'getUnreadMessageCount',
      'sendunread',
      'handleLogOut'
    ]),
    ...mapMutations([
      'setBreadCrumb',
      'setHomeRoute'
    ]),
    returnHome () {
      this.$store.commit('setuserMessagess', false)
      this.$router.push({ name: 'index' })
    },
    logout () {
      this.handleLogOut().then(() => {
        this.$router.push({
          name: 'index'
        })
      })
    },
    getOthers () {
      this.axios.request({
        method: 'get',
        url: 'index.php/Student/User/getNumData'
      }).then(res => {
        if (res.code === 200) {
          this.data = res.data
        }
      })
    },
    getOthers2 () {
      this.axios.request({
        method: 'get',
        url: 'index.php/Teacher/User/getNumData'
      }).then(res => {
        if (res.code === 200) {
          this.data = res.data
        }
      })
    },
    unshowOpenImg () {
      document.getElementsByClassName('openSlider')[0].style.display = 'none'
    },
    getData () {
      if (this.userType === 1) {
        this.loading = true
        this.axios.request({
          url: '/index.php/Teacher/Course/index',
          method: 'get',
          params: {
            page: 1,
            keyword: this.keyword,
            type: this.bind_type
            // type: 4
          }
        }).then(res => {
          if (res.code === 200) {
            this.list = res.data.course_list
            for (let i in this.list) {
              this.list[i]['style'] = 'width'
              this.list[i].img += '?nocache=' + new Date().getTime()
            }
            this.total = res.data.pages * this.page_size
          }
          this.loading = false
        })
      }
      if (this.userType === 2) {
        my_course({
          page_size: 10000,
          page_no: 1
        }).then(res => {
          if (res.code === 200) {
            let data = res.data
            this.list = data.list
            this.count = data.count
          }
        })
      }
    },
    regetData () {
      this.getData()
      this.courdetail = ''
      this.showSelectCourse = true
    },
    reback () {
      // this.getData()
      this.showSelectCourse = true
      this.courdetail = ''
      // this.course_namet = ''
    },
    unshowTab (i) {
      document.getElementsByClassName('course-menu')[0].style.display = i
    },
    showSelectCourseModal () { // 显示选择课程框
      document.getElementsByClassName('unshowModal')[0].style.display = 'block'
      this.showSelectCourse = true
    },
    unshowSelectCourseModal () { // 关闭选择课程框
      document.getElementsByClassName('unshowModal')[0].style.display = 'none'
      this.showSelectCourse = false
      this.course_namet = this.$store.state.user.courseData.course_name
      this.showAddCourse = false
    },
    showAddCourseModal (i) { // 显示添加课程框
      document.getElementsByClassName('unshowModal')[0].style.display = 'block'
      this.showAddCourse = true
      this.changeCourseId = i
    },
    selectCourse (item, index) {
      if (this.showSelectCourse === true) {
        this.modal1 = true
      } else {
        if (this.routersto === true && this.userType === 1) {
          this.$router.push({ path: '/teachingSystem/MyCourse/course_courseware' })
        }
        if (this.routersto === true && this.userType === 2) {
          this.$router.push({ path: '/teachingSystem/StudentCourse/course_coursewares' })
        }
        this.course_namet = item.course_name
        this.$store.commit('setcourseData', item)
      }
    },
    ok () {
      this.showSelectCourse = false
    },
    closeSlider () {
      document.getElementsByClassName('myCourse-slider')[0].style.width = 0 + 'px'
      document.getElementsByClassName('myCourse-slider')[0].style.transform = 'translateX(-400px)'
      document.getElementsByClassName('openSlider')[0].style.display = 'block'
    },
    openSlider () {
      document.getElementsByClassName('openSlider')[0].style.display = 'none'
      document.getElementsByClassName('myCourse-slider')[0].style.width = 400 + 'px'
      document.getElementsByClassName('myCourse-slider')[0].style.transform = 'translateX(0px)'
    },
    changeTab (e) {
      let itemText
      if (e.currentTarget.innerText === '前往批改>>') {
        itemText = '作业批改'
        document.getElementsByClassName('infoModal-full')[0].style.display = 'none'
        document.getElementsByClassName('sjx-t')[0].style.display = 'none'
        document.getElementsByClassName('sjx-t2')[0].style.display = 'none'
      } else if (e.currentTarget.innerText === '前往作答>>') {
        itemText = '前往作答'
        document.getElementsByClassName('infoModal-full')[0].style.display = 'none'
        document.getElementsByClassName('sjx-t')[0].style.display = 'none'
        document.getElementsByClassName('sjx-t2')[0].style.display = 'none'
      } else {
        itemText = e.currentTarget.innerText
      }
      this.$store.commit('setcurrentTab', itemText)
      if (this.userType === 1) {
        if (itemText === '我的课程') {
          this.$store.commit('setbindType', 0)
          this.bind_type = 0
          this.showT = false
          document.getElementsByClassName('timetable-btn')[0].style.display = 'block'
          this.routersto = true
          this.getData()
        } else if (itemText === '课程管理') {
          this.$store.commit('setbindType', 4)
          this.bind_type = 4
          this.showT = true
          document.getElementsByClassName('timetable-btn')[0].style.display = 'none'
          this.getData()
          this.routersto = false
        } else {
          this.$store.commit('setbindType', 0)
          this.bind_type = 0
          this.routersto = false
          this.getData()
          this.showT = false
        }
      } else if (this.userType === 2) {
        this.toCorrectType = ''
        this.toCorrectId = ''
        this.toTasktId = ''
        this.toIsLeader = ''
        if (itemText === '我的课程') {
          this.showClassTable = true
        } else {
          this.showClassTable = false
        }
        if (itemText === '我的课程' || itemText === '考核评价' || itemText === '课堂笔记') {
        } else {

        }
      }
    },
    toCorrect (e, item) { // 教师端前往批改
      this.changeTab(e)
      let a
      if (item.type === 51) {
        a = 'student_homework_list'
      } else if (item.type === 53) {
        a = 'student_exam_list'
      } else if (item.type === 56) {
        a = 'student_task_list'
      }
      this.readNotice(item.id)
      this.$router.push({ path: '/teachingSystem/correct', query: { toCorrectType: a, toCorrectId: item.obj_id } })
    },
    toReply (e, item) {
      this.changeTab(e)
      if (item.type === 55) {
        this.$store.commit('setcurrentTab', '我的任务')
        this.toTasktId = item.obj_id
        this.toIsLeader = 0
        this.$router.push({ path: '/teachingSystem/task' })
      } else if (item.type === 57) {
        this.$store.commit('setcurrentTab', '我的任务')
        this.toTasktId = item.obj_id
        this.toIsLeader = 1
        this.$router.push({ path: '/teachingSystem/task' })
      } else if (item.type === 52) {
        this.$store.commit('setcurrentTab', '作业测试')
        this.toCorrectType = 'homework'
        this.toCorrectId = item.obj_id
        this.$router.push({ path: '/teachingSystem/homework_exam' })
      } else if (item.type === 54) {
        this.$store.commit('setcurrentTab', '作业测试')
        this.toCorrectType = 'exam'
        this.toCorrectId = item.obj_id
        this.$router.push({ path: '/teachingSystem/homework_exam' })
      }
      this.readNoticeStudent(item.id)
    },
    readNotice (id) { // 教师端单条待办信息变为已读
      this.axios.request({
        url: '/index.php/Teacher/Notice/read',
        method: 'get',
        params: {
          id
        }
      }).then(res => {
      })
    },
    readNoticeStudent (id) { // 学生端单条待办信息变为已读
      this.axios.request({
        url: '/index.php/Student/User/readNotice',
        method: 'get',
        params: {
          id
        }
      }).then(res => {
      })
    },
    selectTabCourseManage () {
      this.$store.commit('setbindType', 4)
      this.bind_type = 4
      this.selectTabShow = true
      document.getElementsByClassName('timetable-btn')[0].style.display = 'none'
      this.getData()
    },
    changType (e, index) {
      this.$store.commit('setbindType', index)
      this.bind_type = index
      this.getData()
    },
    refreshData () {
      this.course_namet = this.$store.state.user.courseData.course_name
      this.getData()
    },
    changeNameT (t) {
      this.showSelectCourse = false
      this.course_namet = t
      this.courdetail = 'bd'
    },
    selectCurrentInfo (e, it) { // 选择消息
      console.log(e);

      if (it.table_type === 2) {
        this.infoTitle = e.currentTarget.childNodes[1].childNodes[0].childNodes[0].innerText
      } else if (it.table_type === 1) {
        this.infoTitle = '小组讨论：' + it.task_name
      } else {
        this.infoTitle = '话题：' + it.title
      }
      let item = document.getElementsByClassName('infoModal-l-list-l')
      let ic = document.getElementsByClassName('infoModal-content-md-close')
      for (let i = 0; i < item.length; i++) {
        item[i].style.background = '#E4E4E4'
        ic[i].style.display = 'none'
      }
      e.currentTarget.style.background = '#D7D7D7'
      e.currentTarget.childNodes[1].childNodes[2].style.display = 'block'
      it.unread = 0
      this.taskgroup = it.taskgroup
      if (it.table_type === 2) {
        this.sendId = it.userInfo.id
      }
      this.table_type = it.table_type
      if (this.userType === 1) {
        if (it.table_type === 3) {
          this.topic_id = it.id
          this.getDiscussCreate()
        } else if (it.table_type === 2) {
          this.getProblemDiscuss()
        }
      } else {
        if (it.table_type === 1) {
          this.student_task_id = it.student_task_id
          this.getDiscussStudent()
        } else if (it.table_type === 3) {
          this.topic_id = it.id
          this.getDiscussCreateStudent()
        } else {
          this.getProblemDiscussStudent()
        }
      }
    },
    selectCurrentSystem2 (e) { // 选择系统信息
      this.infoTitle = e.currentTarget.childNodes[1].childNodes[0].childNodes[0].innerText
      let item = document.getElementsByClassName('infoModal-l-list-l')
      for (let i = 0; i < item.length; i++) {
        item[i].style.background = '#E4E4E4'
      }
      e.currentTarget.style.background = '#D7D7D7'
      if (this.infoTitle === '系统信息') {
        this.systemInfoType = 1
        this.getSystemInfo(-1, 0)
      } else if (this.infoTitle === '上课提醒') {
        this.systemInfoType = 2
        this.getSystemInfo(-1, 0)
        this.remind_unread = 0
      } else if (this.infoTitle === '待办') {
        this.systemInfoType = 3
        this.getSystemInfo(-1, 0)
        this.commission_unread = 0
      }
    },
    deleteSystem (i) { // 删除系统信息
      let uRl = ''
      if (this.userType === 1) {
        uRl = '/index.php/Teacher/notice/delete'
      } else if (this.userType === 2) {
        uRl = '/index.php/Student/User/delete_notice'
      }
      this.axios.request({
        url: uRl,
        method: 'post',
        data: {
          id: this.deleteSystemId
        }
      }).then(res => {
        if (res.code === 200) {
          this.$Message.success('删除成功')
          this.getSystemInfo(-1, 0)
        }
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
    getProblemDiscuss () { // 教师端获取问题聊天记录
      this.studentanswer = []
      this.teacheranswer = []
      this.getAnwserNum = 1
      this.axios.request({
        method: 'post',
        url: '/index.php/Teacher/TaskQuestion/question_detail',
        data: {
          taskgroup: this.taskgroup,
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
          topic_id: this.topic_id
        }
      }).then(res => {
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
          taskgroup: this.taskgroup,
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
    getDiscussCreateStudent () { // 学生端获取话题内容
      this.studentanswer = []
      this.teacheranswer = []
      this.getAnwserNum = 1
      this.axios.request({
        method: 'post',
        url: '/index.php/Student/Topic/topic_detail',
        data: {
          page: 1,
          topic_id: this.topic_id,
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
          taskgroup: this.taskgroup,
          page_size: 1000,
          student_task_id: this.student_task_id
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
    showDeleteDiscuss (item) {
      // table_type 1：小组讨论，2：任务提问，3：话题
      if (item.table_type === 1 || item.table_type === 2) {
        this.deltaskgroup = item.taskgroup
        this.delId = ''
      } else {
        this.deltaskgroup = ''
        this.delId = item.id
      }
      this.deltable_type = item.table_type
      this.modal2 = true
    },
    deleteDiscuss () { // 删除聊天
      // table_type 1：小组讨论，2：任务提问，3：话题
      if (this.userType === 1) {
        if (this.deltable_type === 2) {
          this.axios.request({
            url: '/index.php/Teacher/TaskQuestion/question_empty',
            method: 'get',
            params: {
              taskgroup: this.deltaskgroup
            }
          }).then(res => {
            if (res.code === 200) {
              this.$Message.success('删除成功')
            } else {
              this.$Message.error(res.message)
            }
          })
        } else {
          this.axios.request({
            url: '/index.php/Teacher/Topic/topic_empty',
            method: 'get',
            params: {
              id: this.delId
            }
          }).then(res => {
            if (res.code === 200) {
              this.$Message.success('删除成功')
            } else {
              this.$Message.error(res.message)
            }
          })
        }
      } else if (this.userType === 2) {
        if (this.deltable_type === 1) {
          this.axios.request({
            url: '/index.php/Student/StudentTask/task_empty',
            method: 'get',
            params: {
              taskgroup: this.deltaskgroup
            }
          }).then(res => {
            if (res.code === 200) {
              this.$Message.success('删除成功')
            } else {
              this.$Message.error(res.message)
            }
          })
        } else if (this.deltable_type === 2) {
          this.axios.request({
            url: '/index.php/Student/Task/question_empty',
            method: 'get',
            params: {
              taskgroup: this.deltaskgroup
            }
          }).then(res => {
            if (res.code === 200) {
              this.$Message.success('删除成功')
            } else {
              this.$Message.error(res.message)
            }
          })
        } else {
          this.axios.request({
            url: '/index.php/Student/Topic/topic_empty',
            method: 'get',
            params: {
              id: this.delId
            }
          }).then(res => {
            if (res.code === 200) {
              this.$Message.success('删除成功')
            } else {
              this.$Message.error(res.message)
            }
          })
        }
      }

      this.showUserDiscuss()
    },
    showInfo (e) { // 点击消息中心或系统通知时
      console.log(e);

      if (e.target.innerText === '消息中心') {
        this.showUserDiscuss()
        this.data.message_total = 0
      } else {
        this.infoCenter = 'system'
        document.getElementsByClassName('sjx-t')[0].style.display = 'none'
        document.getElementsByClassName('sjx-t2')[0].style.display = 'block'
        document.getElementsByClassName('infoModal-full')[0].style.display = 'block'
        this.data.system_total = 0
        this.getSystemNum()
      }
    },
    getSystemNum () { // 获取系统通知
      let uRl = ''
      if (this.userType === 1) {
        uRl = '/index.php/Teacher/Notice/unread'
      } else {
        uRl = '/index.php/Student/User/unread'
      }
      this.axios.request({
        url: uRl,
        method: 'get',
        params: {}
      }).then(res => {
        console.log(res);

        if (res.code === 200) {
          this.commission_unread = res.data.commission_unread
          this.remind_unread = res.data.remind_unread
          this.system_unread = res.data.system_unread
        }
      })
    },
    showUserDiscuss () {
      this.infoCenter = 'people'
      document.getElementsByClassName('sjx-t2')[0].style.display = 'none'
      document.getElementsByClassName('sjx-t')[0].style.display = 'block'
      this.chatList = []
      if (this.userType === 1) {
        this.showProblem()
        this.showDiscussAbout()
      } else {
        this.showProblemStudent()
      }
      document.getElementsByClassName('infoModal-full')[0].style.display = 'block'
      setTimeout(() => {
        let it
        for (let i = 0; i < this.chatList.length; i++) {
          if (this.chatList[i].delete_status === 1) {
            it = this.chatList[i]
            break
          }
        }
        if (it.table_type === 2) {
          this.infoTitle = it.userInfo.name
        } else if (it.table_type === 1) {
          this.infoTitle = '小组讨论：' + it.task_name
        } else {
          this.infoTitle = '话题：' + it.title
        }
        let item = document.getElementsByClassName('infoModal-l-list-l')
        let ic = document.getElementsByClassName('infoModal-content-md-close')
        for (let i = 0; i < item.length; i++) {
          item[i].style.background = '#E4E4E4'
          ic[i].style.display = 'none'
        }
        item[0].style.background = '#D7D7D7'
        ic[0].style.display = 'block'
        it.unread = 0
        this.taskgroup = it.taskgroup
        if (it.table_type === 2) {
          this.sendId = it.userInfo.id
        }
        this.table_type = it.table_type
        if (this.userType === 1) {
          if (it.table_type === 3) {
            this.topic_id = it.id
            this.getDiscussCreate()
          } else if (it.table_type === 2) {
            this.getProblemDiscuss()
          }
        } else {
          if (it.table_type === 1) {
            this.student_task_id = it.student_task_id
            this.getDiscussStudent()
          } else if (it.table_type === 3) {
            this.topic_id = it.id
            this.getDiscussCreateStudent()
          } else {
            this.getProblemDiscussStudent()
          }
        }
      }, 1000)
    },
    closeInfoCenter (e) {
      // 关闭消息
      this.$store.commit('setuserMessagess', false)
      if (e.target.className === 'infoModal-full') {
        document.getElementsByClassName('infoModal-full')[0].style.display = 'none'
        document.getElementsByClassName('sjx-t')[0].style.display = 'none'
        document.getElementsByClassName('sjx-t2')[0].style.display = 'none'
        let item = document.getElementsByClassName('infoModal-l-list-l')
        for (let i = 0; i < item.length; i++) {
          item[i].style.background = '#E4E4E4'
        }
        this.infoTitle = ''
        this.answerList = []
        this.taskgroup = ''
      }
    },
    getSystemInfo (r, p) { // 获取系统信息
      if (this.userType === 1) {
        let _this = this
        let currentDo = p + 1
        this.infoloading = true
        this.axios.request({
          url: '/index.php/Teacher/notice/index',
          method: 'post',
          data: {
            read: r,
            type: this.systemInfoType,
            pagesize: currentDo * 10
          }
        }).then(res => {
          if (res.code === 200) {
            this.systemInfoList = []
            for (let i = res.data.notice_list.length - 1; i >= 0; i--) {
              this.systemInfoList.push(res.data.notice_list[i])
            }
            _this.$nextTick(function () {
              document.getElementsByClassName('ab-scroll')[0].scrollTop = 10 / this.systemInfoList.length * document.getElementsByClassName('ab-scroll')[0].scrollHeight
            })
          }
          this.infoloading = false
        })
      } else {
        let _this = this
        let currentDo = p + 1
        this.infoloading = true
        this.axios.request({
          url: '/index.php/Student/User/getNoticeList',
          method: 'post',
          data: {
            read: r,
            type: this.systemInfoType,
            page_size: currentDo * 10
          }
        }).then(res => {
          if (res.code === 200) {
            this.systemInfoList = []
            for (let i = res.data.list.length - 1; i >= 0; i--) {
              this.systemInfoList.push(res.data.list[i])
            }
            _this.$nextTick(function () {
              document.getElementsByClassName('ab-scroll')[0].scrollTop = 10 / this.systemInfoList.length * document.getElementsByClassName('ab-scroll')[0].scrollHeight
            })
          }
          this.infoloading = false
        })
      }
    },
    showDiscussAbout () { // 教师端话题列表获取
      this.axios.request({
        url: '/Teacher/Topic/topic_list',
        method: 'get',
        params: {
          page: 1,
          page_size: 10000
        }
      }).then(res => {
        if (res.code === 200) {
          console.log(res);
          if (res.data !== null) {
            for (let i = 0; i < res.data.list.length; i++) {
              this.chatList.push(res.data.list[i])
            }
          }

        }
      })
    },
    showProblem () { // 教师端消息中心显示消息列表
      this.axios.request({
        url: '/index.php/Teacher/TaskQuestion/question_list',
        method: 'get',
        params: {
          page: 1,
          rows: 10000
        }
      }).then(res => {
        console.log(res);

        if (res.code === 200) {
          for (let i = 0; i < res.data.question_list.length; i++) {
            this.chatList.push(res.data.question_list[i])
          }
        }
      })
    },
    showTeacherInfo () { // 学生端消息中心显示消息列表
      this.axios.request({
        url: '/index.php/Student/Task/question_list',
        method: 'get',
        params: {
          page_no: 1,
          page_size: 10000
        }
      }).then(res => {
        if (res.code === 200) {
          for (let i = 0; i < res.data.question_list.length; i++) {
            this.chatList.push(res.data.question_list[i])
          }
        }
      })
    },
    showDiscussStudent () { // 学生端消息中心学生讨论列表
      this.axios.request({
        url: '/index.php/Student/StudentTask/task_list',
        method: 'get',
        params: {
          page_no: 1,
          page_size: 10000
        }
      }).then(res => {
        if (res.code === 200) {
          for (let i = 0; i < res.data.list.length; i++) {
            this.chatList.push(res.data.list[i])
          }
        }
      })
    },
    showTopiclistStudent () { // 学生端话题列表
      this.axios.request({
        url: '/index.php/Student/Topic/topic_list',
        method: 'get',
        params: {
          page_no: 1,
          page_size: 10000
        }
      }).then(res => {
        if (res.code === 200) {
          for (let i = 0; i < res.data.list.length; i++) {
            this.chatList.push(res.data.list[i])
          }
        }
      })
    },
    showProblemStudent () {
      this.showTeacherInfo()
      this.showDiscussStudent()
      this.showTopiclistStudent()
    },
    sendInfo () {
      if (this.discussinfo === '') {
        this.$Message.error('请输入回答内容')
      } else {
        if (this.userType === 1) {
          if (this.table_type === 3) {
            this.sendDiscussTeacher()
          } else {
            this.sendInfoTeacher()
          }
        } else {
          if (this.table_type === 2) {
            this.sendInfoStudent(this.sendId, this.discussinfo, '')
          } else if (this.table_type === 1) {
            this.sendInfoGroup()
          } else {
            this.sendDiscussStudent()
          }
        }
      }
    },
    sendInfoTeacher () { // 教师端个人发送信息
      sendInfoTeacher(this.sendId, this.discussinfo).then(res => {
        if (res.code === 200) {
          this.resetDiscussInfo()
          this.getProblemDiscuss()
        }
      })
    },
    sendDiscussTeacher () { // 教师端话题发送信息
      sendDiscussTeacher(this.topic_id, this.discussinfo).then(res => {
        if (res.code === 200) {
          this.resetDiscussInfo()
        }
      })
    },
    sendInfoStudent (i, c, t, a) { // 学生端发送信息
      if (t === 1) {
        this.taskgroup = a
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
      sendInfoGroup(this.taskgroup, this.discussinfo, this.student_task_id).then(res => {
        if (res.code === 200) {
          this.resetDiscussInfo()
        }
      })
    },
    sendDiscussStudent () { // 学生端话题发送信息
      sendDiscussStudent(this.topic_id, this.discussinfo).then(res => {
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
    updataInfo (type, tgroup, courseware_id) {
      if (type === 43) {
        if (this.taskgroup !== tgroup) {
          this.getOthers()
        } else {
          this.getDiscussStudent()
        }
      } else if (type === 31) { // 教师接收学生信息
        if (this.taskgroup !== tgroup) {
          this.getOthers2()
        } else {
          this.getProblemDiscuss()
        }
      } else if (type === 32) { // 学生接收教师信息
        if (this.taskgroup !== tgroup) {
          this.getOthers()
        } else {
          this.getProblemDiscussStudent()
        }
      } else if (type === 44) {
        if (this.topic_id.toString() !== tgroup) {
          if (this.userType === 2) {
            this.getOthers()
          } else if (this.userType === 1) {
            this.getOthers2()
          }
        } else {
          if (this.userType === 1) {
            this.getDiscussCreate()
          } else {
            this.getDiscussCreateStudent()
          }
        }
      } else if (type === 42) { // 上课通知
        this.axios.request({
          method: 'get',
          url: '/index.php/Student/Courseware/courseware_class',
          params: {
            courseware_id
          }
        }).then(res => {
          if (res.code === 200) {
            this.live_status = res.data.live_status
            this.student_courseware_id = res.data.student_courseware_id
            this.isshowclass = true
          }
        })
      }
    },
    handleOnMessage (data) {
      this.updataInfo(data.notice_type, data.taskgroup, data.courseware_id)
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
    showAddCourseware (timetable_id, target_id, action_type, courseware_id, teacher_course_id, type, courseware_name) { // 新增课件
      this.currentSelect = ''
      this.course_namet = 'addCourseware'
      this.timet_id = timetable_id
      this.exam_release_id = target_id
      this.action_type = action_type
      this.courseware_id = courseware_id
      this.teacher_course_id = teacher_course_id
      this.type = type
      this.courseware_name = courseware_name
    },
    closeAddCourseware () { // 关闭新增课件
      this.currentSelect = 'course'
      this.course_namet = this.$store.state.user.courseData.course_name
    },
    showAddDiscuss () {
      this.addInfoModal = true
      this.axios.request({
        url: '/teacher/class/get_class_by_teacher_course',
        params: {
        },
        method: 'get'
      }).then(res => {
        if (res.code === 200) {
          this.classList = res.data
        }
      })
    },
    addDiscussAbout () { // 添加话题
      if (this.selectClaaaList.length === 0 || this.discussAboutTitle === '' || this.discussAboutTitle === '') {
        this.$Message.error('请填写相关信息')
      } else {
        this.axios.request({
          url: '/Teacher/Topic/topic_save',
          method: 'post',
          data: {
            id: '',
            title: this.discussAboutTitle,
            content: this.discussAboutContent,
            class_ids: this.selectClaaaList
          }
        }).then(res => {
          if (res.code === 200) {
            this.$Message.success('添加成功')
            this.addInfoModal = false
            this.showUserDiscuss()
          }
        })
      }
    },
    showAllCourseDetail (i, t, d, ci) {
      this.currentSelect = ''
      this.course_namet = 'inCourseDetail'
      this.showAllCourseDetailId = i
      this.showAllCourseDetailType = t
      this.showAllCourseDetailEdit = d
      this.showAllCourseDetailCId = ci
      this.courseId = ''
      this.coursedetail_id = ''
    },
    showCourseDetail (i, t) {
      this.currentSelect = ''
      this.course_namet = 'inCourseDetail'
      this.courseId = i
      this.coursedetail_id = t
      this.showAllCourseDetailId = ''
      this.showAllCourseDetailType = ''
      this.showAllCourseDetailEdit = ''
      this.showAllCourseDetailCId = ''
    },
    closeCourseDetail () {
      this.course_namet = this.$store.state.user.courseData.course_name
      this.currentSelect = 'course'
    },
    is_class () { // 学生端查询教师是否正在上课
      this.axios.request({
        url: '/Student/Courseware/is_class',
        params: {
        },
        method: 'get'
      }).then(res => {
        if (res.code === 200) {
          if (res.data.length !== 0) {
            this.isshowclass = true
            this.live_status = res.data[0].live_status
            this.student_courseware_id = res.data[0].student_courseware_id
          }
        }
      })
    },
    entryClass () { // 进入直播间
      this.$router.push({ path: '/live_student', query: { student_courseware_id: this.student_courseware_id, mode: this.live_status === 3 ? 'live' : 'pdf' } })
    }
  },
  mounted () {
    if (this.$store.state.user.userMessagess == true) {
      this.infoCenter = 'system'
      document.getElementsByClassName('sjx-t')[0].style.display = 'none'
      document.getElementsByClassName('sjx-t2')[0].style.display = 'block'
      document.getElementsByClassName('infoModal-full')[0].style.display = 'block'
      this.data.system_total = 0
      this.getSystemNum()
      // this.showUserDiscuss()
      // this.data.message_total = 0
    }
    this.initChat()
    this.getData()
    if (this.userType === 1) {
      this.getOthers2()
      if (this.currentTab === '我的课程' || this.currentTab === '课程管理' || this.currentTab === '课件管理' || this.currentTab === '考核评价') {
        this.currentSelect = 'course'
        this.course_namet = this.$store.state.user.courseData.course_name
      } else if (this.currentTab === '个人信息') {
        this.currentSelect = ''
        this.course_namet = 'userInfoCenter'
      } else if (this.currentTab === '作业批改') {
        this.currentSelect = ''
        this.course_namet = 'correct'
      } else {

      }
    }
    if (this.userType === 2) {
      this.getOthers()
      if (this.currentTab === '我的课程' || this.currentTab === '考核评价' || this.currentTab === '课堂笔记') {
        this.currentSelect = 'course'
        this.course_namet = this.$store.state.user.courseData.course_name
      } else if (this.currentTab === '个人信息') {
        this.currentSelect = ''
        this.course_namet = 'studentUserCenter'
      } else if (this.currentTab === '我的任务') {
        this.currentSelect = ''
        this.course_namet = 'task'
      } else if (this.currentTab === '作业测试') {
        this.currentSelect = ''
        this.course_namet = 'homeworkExam'
      } else {

      }
      if (this.currentTab === '我的课程') {
        this.showClassTable = true
      } else {
        this.showClassTable = false
      }
      if (this.currentTab === '考核评价') {
        this.showScore = true
      } else {
        this.showScore = false
      }
      this.is_class()
    }
    this.setHomeRoute(routers)
    this.$store.state.user.userInfo.userType === 2 ? this.getUnreadMessageCount() : this.sendunread()
  }
}
</script>
<style lang="less">
</style>
