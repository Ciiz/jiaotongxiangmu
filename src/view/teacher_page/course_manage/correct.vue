<template>
  <div class="correct" style="height:100%;postition:relative">
    <div class="correct_newLeft">
      <Menu ref="side_menu" theme="light" accordion active-name="1-1" :open-names="['1']">
        <Submenu :name="i+1" v-for="(v,i) in menu_courseList" :key="i">
          <template slot="title">
            <div @click="handle_correct(i)"
              style="width:100%;height:50px;font-weight:bold; display: flex;justify-content: center;align-items: center;"
              :class="{correct_color:correct_index===i}">
              {{v.course_name}}</div>
          </template>
          <MenuItem :name="(i+1)+'-'+(item.class_id)" v-for="(item,index) in v.course_class" :key="index"
            @click.native="handle_course_name(item.class_id,item.teacher_course_id)">
          {{item.class_name}}</MenuItem>
          <MenuItem :name="v.id" v-if="v.course_class.length===0">暂无班级！</MenuItem>
        </Submenu>
      </Menu>
    </div>
    <div class="correct_newRight">
    </div>
    <div style="height:100%;width:100%;position:absolute" v-show="showCorrctList">
      <student-exam-list :targetwork_id="target_id" :target_type='target' @closeModal="closeModal"
        @on-refresh-parent-list="getData()"></student-exam-list>
    </div>
    <div style="height:100%;width:100%;display:flex;flex-direction:column;padding:20px">
      <div class="correct-iscorrect">
        <span v-show="correct_status===0" style="background:#1170FF;color:#FFFFFF" @click="correct_status=0">待批改</span>
        <span v-show="correct_status===0" style="background:#ffffff" @click="correct_status=1">已批改</span>
        <span v-show="correct_status===1" style="background:#ffffff" @click="correct_status=0">待批改</span>
        <span v-show="correct_status===1" style="background:#1170FF;color:#FFFFFF" @click="correct_status=1">已批改</span>
      </div>
      <!-- <Row type="flex" justify="space-between" class="correct-select" v-show="correct_status===1">
        <Col>
        <Select class="new-searchSel" v-model="class_id" placeholder="全部班级" clearable style="margin-right:30px">
          <Option :value="0">所有班级</Option>
          <Option v-for="item in classLst" :value="item.class_id" :key="'class'+item.class_id">{{item.class_name}}
          </Option>
        </Select>
        <Select class="new-searchSel" v-model="teacher_course_id" placeholder="全部课程" clearable
          style="margin-right:30px">
          <Option :value="0">所有课程</Option>
          <Option v-for="item in teacher_course_list" :value="item.id" :key="'course'+item.id">{{item.course_name}}
          </Option>
        </Select>
        <Input class="new-searchSel" v-model="keyword" placeholder="请输入课业关键词" style="width:240px;" />
        <button class="orangeRBorder-btn" style="transform:translate(-20px,2px)" @click="changeType()">搜索</button>
        </Col>
      </Row> -->
      <!-- 待批改 -->
      <Tabs size="small" class="correct-tab" value="task" v-if="correct_status===0">
        <TabPane label="任务" name="task">
          <div v-if="Object.keys(tasklist_menu).length===0" style="padding:10px;font-size:16px">暂无内容！</div>
          <ul class="correct-list">
            <li v-for="(item,index) in tasklist_menu" :key="'task'+index" style="width:20%;margin:10px 0">
              <div class="showdetail" @click="openModal('student_task_list', item.task_release_id)">
                <div class="correct-sjx" style="border-top:40px solid #1170FF"></div>
                <div class="correct-sjx-xz">任务</div>
                <div class="cname" v-if="item.task_name===''">&nbsp</div>
                <div class="cname" v-else>{{item.task_name}}</div>
                <div class="ccourse">课程：{{item.course_name}}</div>
                <div class="cclass">
                  <span>发布时间：{{moment(item.start_time * 1000).format('YYYY-MM-DD HH:mm')}}</span>
                  <span v-if="item.correct_status===1" class="cstatus" style="color: #0066FF">已批</span>
                  <span v-if="item.correct_status===0" class="cstatus" style="color: #FF3333">批改中...</span>
                </div>
              </div>
              <span style="margin-left:20px">截止时间：{{moment(item.end_time * 1000).format('YYYY-MM-DD HH:mm')}}</span>
              <span style="margin-left:20px">提交人数：</span>
            </li>
          </ul>
          <!-- <Button style="display:flex;justify-content:center;align-items:center;" type="primary">查看更多</Button> -->
        </TabPane>
        <TabPane label="作业" name="homework">
          <div v-if="Object.keys(homeworklist_meun).length===0" style="padding:10px;font-size:16px">暂无内容！</div>
          <ul class="correct-list">
            <li v-for="(item,index) in homeworklist_meun" :key="'homework'+index" style="width:20%;margin:10px 0">
              <div class="showdetail" @click="openModal('student_homework_list', item.homework_release_id)">
                <div class="correct-sjx" style="border-top:40px solid #33CCCC"></div>
                <div class="correct-sjx-xz">作业</div>
                <div class="cname" v-if="item.homework_name===''">&nbsp</div>
                <div class="cname" v-else>{{item.homework_name}}</div>
                <div class="ccourse">课程：{{item.course_name}}</div>
                <div class="cclass">
                  <span>发布时间：{{moment(item.start_time * 1000).format('YYYY-MM-DD HH:mm')}}</span>
                  <span v-if="item.correct_status===1" class="cstatus" style="color: #0066FF">已批</span>
                  <span v-if="item.correct_status===0" class="cstatus" style="color: #FF3333">批改中...</span>
                </div>
              </div>
              <span style="margin-left:20px">截止时间：{{moment(item.end_time * 1000).format('YYYY-MM-DD HH:mm')}}</span>
              <span style="margin-left:20px">提交人数：</span>
            </li>
          </ul>
        </TabPane>
        <TabPane label="测试" name="exam">
          <ul class="correct-list">
            <div v-if="Object.keys(examlist_meun).length===0" style="padding:10px;font-size:16px">暂无内容！</div>
            <li v-for="(item,index) in examlist_meun" :key="'exam'+index" style="width:20%;margin:10px 0">
              <div class="showdetail" @click="openModal('student_exam_list', item.exam_release_id)">
                <div class="correct-sjx" style="border-top:40px solid #FF3333"></div>
                <div class="correct-sjx-xz">测试</div>
                <div class="cname" v-if="item.exam_name===''">&nbsp</div>
                <div class="cname" v-else>{{item.exam_name}}</div>
                <div class="ccourse">课程：{{item.course_name}}</div>
                <div class="cclass">
                  <!-- <span>班级：{{item.class_name}}</span> -->
                  <span>发布时间：{{moment(item.start_time * 1000).format('YYYY-MM-DD HH:mm')}}</span>
                  <span v-if="item.correct_status===1" class="cstatus" style="color: #0066FF">已批</span>
                  <span v-if="item.correct_status===0" class="cstatus" style="color: #FF3333">批改中...</span>
                </div>
              </div>
              <span style="margin-left:20px">截止时间：{{moment(item.end_time * 1000).format('YYYY-MM-DD HH:mm')}}</span>
              <span style="margin-left:20px">提交人数：</span>
            </li>
          </ul>
        </TabPane>
      </Tabs>
      <Spin fix v-show="loading"></Spin>
      <!-- <div style="width:100%;height:100%;position:relative" v-show="correct_status===0">
        <ul class="correct-list">
          <li v-for="(item,index) in unreadtasklist" :key="'task'+index" style="width:300px;margin:10px 0">
            <div class="showdetail" @click="openModal('student_task_list', item.task_release_id)">
              <div class="correct-sjx" style="border-top:40px solid #1170FF"></div>
              <div class="correct-sjx-xz">任务</div>
              <div class="cname">
                {{item.task_name}}</div>
              <div class="ccourse">课程：{{item.course_name}}</div>
              <div class="cclass">
                <span>班级：{{item.class_name}}</span>
                <span v-if="item.correct_status===1" class="cstatus" style="color: #0066FF">已批</span>
                <span v-if="item.correct_status===0" class="cstatus" style="color: #FF3333">批改中...</span>
              </div>
            </div>
            <span style="margin-left:20px">截止时间：{{moment(item.end_time * 1000).format('YYYY-MM-DD HH:mm')}}</span>
            <span style="margin-left:20px">提交人数：{{item.student_submit}}</span>
          </li>
          <li v-for="(item,index) in unreadhomeworklist" :key="'homework'+index" style="width:300px;margin:10px 0">
            <div class="showdetail" @click="openModal('student_homework_list', item.homework_release_id)">
              <div class="correct-sjx" style="border-top:40px solid #33CCCC"></div>
              <div class="correct-sjx-xz">作业</div>
              <div class="cname">{{item.homework_name}}</div>
              <div class="ccourse">课程：{{item.course_name}}</div>
              <div class="cclass">
                <span>班级：{{item.class_name}}</span>
                <span v-if="item.correct_status===1" class="cstatus" style="color: #0066FF">已批</span>
                <span v-if="item.correct_status===0" class="cstatus" style="color: #FF3333">批改中...</span>
              </div>
            </div>
            <span style="margin-left:20px">截止时间：{{moment(item.end_time * 1000).format('YYYY-MM-DD HH:mm')}}</span>
            <span style="margin-left:20px">提交人数：</span>
          </li>
          <li v-for="(item,index) in unreadexamlist" :key="'exam'+index" style="width:300px;margin:10px 0">
            <div class="showdetail" @click="openModal('student_exam_list', item.exam_release_id)">
              <div class="correct-sjx" style="border-top:40px solid #FF3333"></div>
              <div class="correct-sjx-xz">测试</div>
              <div class="cname">{{item.exam_name}}</div>
              <div class="ccourse">课程：{{item.course_name}}</div>
              <div class="cclass">
                <span>班级：{{item.class_name}}</span>
                <span v-if="item.correct_status===1" class="cstatus" style="color: #0066FF">已批</span>
                <span v-if="item.correct_status===0" class="cstatus" style="color: #FF3333">批改中...</span>
              </div>
            </div>
            <span style="margin-left:20px">截止时间：{{moment(item.end_time * 1000).format('YYYY-MM-DD HH:mm')}}</span>
            <span style="margin-left:20px">提交人数：</span>
          </li>
        </ul>
      </div> -->
      <!-- 已批改 -->
      <Tabs size="small" class="correct-tab" value="task" v-if="correct_status===1">
        <TabPane label="任务" name="task">
          <div v-if="Object.keys(tasklist_menu).length===0" style="padding:10px;font-size:16px">暂无内容！</div>
          <ul class="correct-list">
            <li v-for="(item,index) in tasklist_menu" :key="'task'+index" style="width:20%;margin:10px 0">
              <div class="showdetail" @click="openModal('student_task_list', item.task_release_id)">
                <div class="correct-sjx" style="border-top:40px solid #1170FF"></div>
                <div class="correct-sjx-xz">任务</div>
                <div class="cname" v-if="item.task_name===''">&nbsp</div>
                <div class="cname" v-else>{{item.task_name}}</div>
                <div class="ccourse">课程：{{item.course_name}}</div>
                <div class="cclass">
                  <span>发布时间：{{moment(item.start_time * 1000).format('YYYY-MM-DD HH:mm')}}</span>
                  <span v-if="item.correct_status===1" class="cstatus" style="color: #0066FF">已批</span>
                  <span v-if="item.correct_status===0" class="cstatus" style="color: #FF3333">批改中...</span>
                </div>
              </div>
              <span style="margin-left:20px">截止时间：{{moment(item.end_time * 1000).format('YYYY-MM-DD HH:mm')}}</span>
              <span style="margin-left:20px">提交人数：</span>
            </li>
          </ul>
        </TabPane>
        <TabPane label="作业" name="homework">
          <div v-if="Object.keys(homeworklist_meun).length===0" style="padding:10px;font-size:16px">暂无内容！</div>
          <ul class="correct-list">
            <li v-for="(item,index) in homeworklist_meun" :key="'homework'+index" style="width:20%;margin:10px 0">
              <div class="showdetail" @click="openModal('student_homework_list', item.homework_release_id)">
                <div class="correct-sjx" style="border-top:40px solid #33CCCC"></div>
                <div class="correct-sjx-xz">作业</div>
                <div class="cname" v-if="item.homework_name===''">&nbsp</div>
                <div class="cname" v-else>{{item.homework_name}}</div>
                <div class="ccourse">课程：{{item.course_name}}</div>
                <div class="cclass">
                  <span>发布时间：{{moment(item.start_time * 1000).format('YYYY-MM-DD HH:mm')}}</span>
                  <span v-if="item.correct_status===1" class="cstatus" style="color: #0066FF">已批</span>
                  <span v-if="item.correct_status===0" class="cstatus" style="color: #FF3333">批改中...</span>
                </div>
              </div>
              <span style="margin-left:20px">截止时间：{{moment(item.end_time * 1000).format('YYYY-MM-DD HH:mm')}}</span>
              <span style="margin-left:20px">提交人数：</span>
            </li>
          </ul>
        </TabPane>
        <TabPane label="测试" name="exam">
          <div v-if="Object.keys(examlist_meun).length===0" style="padding:10px;font-size:16px">暂无内容！</div>
          <ul class="correct-list">
            <li v-for="(item,index) in examlist_meun" :key="'exam'+index" style="width:20%;margin:10px 0">
              <div class="showdetail" @click="openModal('student_exam_list', item.exam_release_id)">
                <div class="correct-sjx" style="border-top:40px solid #FF3333"></div>
                <div class="correct-sjx-xz">测试</div>
                <div class="cname" v-if="item.exam_name===''">&nbsp</div>
                <div class="cname" v-else>{{item.exam_name}}</div>
                <div class="ccourse">课程：{{item.course_name}}</div>
                <div class="cclass">
                  <span>发布时间：{{moment(item.start_time * 1000).format('YYYY-MM-DD HH:mm')}}</span>
                  <span v-if="item.correct_status===1" class="cstatus" style="color: #0066FF">已批</span>
                  <span v-if="item.correct_status===0" class="cstatus" style="color: #FF3333">批改中...</span>
                </div>
              </div>
              <span style="margin-left:20px">截止时间：{{moment(item.end_time * 1000).format('YYYY-MM-DD HH:mm')}}</span>
              <span style="margin-left:20px">提交人数：</span>
            </li>
          </ul>
        </TabPane>
      </Tabs>
    </div>
  </div>

</template>
<script>
import StudentExamList from '@/view/teacher_common/exam/student_exam_list'
import modal_mixin from '@/view/mixins/modal_mixin'
import { get_teacher_course_list, get_task_release_list, get_exam_release_list, get_homework_release_list } from '@/api/data'
import log from 'video.js/es5/utils/log'
export default {
  mixins: [modal_mixin],
  components: {
    StudentExamList
  },

  watch: {
    // openNames () {
    //   this.$nextTick(() => {
    //     this.$refs.side_menu.updateOpened();
    //     this.$refs.side_menu.updateActiveName();
    //   })
    // },
    correct_status () {
      this.handle_course_name()
      // this.changeType()
    },
    // class_id () {
    //   this.changeType()
    // },
    // teacher_course_id () {
    //   this.changeType()
    // },
    '$route': {
      handler (route) {
        if (route.name === 'correct') {
          if (this.toCorrectType && this.toCorrectId) {
            this.openModal(this.toCorrectType, this.toCorrectId)
          }
        }
      }
    }
  },
  data () {
    return {
      // activeName: '1-1',
      // openNames: ['1'],
      loading: false,
      correct_index: null,
      tasklist_menu: [],
      target: '',
      target_id: '',
      showCorrctList: false,
      showId: '',
      itemId: '',
      selectType: 'task',
      classLst: [],
      tasklist: [],
      unreadtasklist: [],
      unreadtasklistttotal: '',
      examlist: [],
      unreadexamlist: [],
      unreadexamlisttotal: '',
      correct_status: 0,
      examcount: '',
      homeworklist: [],
      unreadhomeworklist: [],
      unreadhomeworklisttotal: '',
      teacher_course_id: '',
      class_id: '',
      keyword: '',
      teacher_course_list: [],
      class_list: [],
      menu_courseList: [],
      homeworklist_meun: [],
      examlist_meun: []
    }
  },
  computed: {
    toCorrectType () {
      return this.$route.query.toCorrectType
    },
    toCorrectId () {
      return this.$route.query.toCorrectId
    }
  },
  methods: {
    handle_correct (i) {
      console.log(i);
      this.correct_index = i

    },
    get_list_teacher (id, teacher_course_id) {
      this.loading = true

      get_homework_release_list({ //作业
        page: 1,
        page_size: 10000,
        class_id: id,
        teacher_course_id: teacher_course_id,
        correct_status: this.correct_status
      }).then(res => {
        console.log(res);
        if (res.code === 200) {
          this.homeworklist_meun = res.data.list
        }
      })
      get_exam_release_list({//测试
        page: 1,
        page_size: 10000,
        class_id: id,
        teacher_course_id: teacher_course_id,
        correct_status: this.correct_status
      }).then(res => {
        if (res.code === 200) {
          this.examlist_meun = res.data.list

        }
      })
      get_task_release_list({//任务
        page: 1,
        page_size: 10000,
        class_id: id,
        teacher_course_id: teacher_course_id,
        correct_status: this.correct_status
      }).then(res => {
        console.log(res);
        if (res.code === 200) {
          this.tasklist_menu = res.data.list
          this.loading = false
          // if (res.data.list.length > 20)
          //   this.tasklist_menu = res.data.list.slice(0, 20)
        }
      })

    },
    handle_course_name (id, teacher_course_id) {
      if (this.correct_status === 0) {
        this.get_list_teacher(id, teacher_course_id)

      } else {
        this.get_list_teacher(id, teacher_course_id)
      }

    },
    openModal (t, i) {
      this.target = t
      this.target_id = i
      this.showCorrctList = true
    },
    get_menu_courseList () {
      this.axios.request({
        url: 'teacher/course/get_teacher_course_list',
        method: 'get',
        params: {
        }
      }).then(res => {
        this.menu_courseList = res.data.list
      })
    },
    getTeacherCourseList () {
      get_teacher_course_list().then(res => {
        if (res.code === 200) {
          this.teacher_course_list = res.data.list
        }
      })
    },
    getclasslist () {
      this.axios.request({
        url: '/index.php/Teacher/Class/get_class_list',
        method: 'get',
        params: {
        }
      }).then(res => {
        if (res.code === 200) {
          this.classLst = res.data
        }
      })
    },
    // changeType (t) {
    //   if (t !== undefined) {
    //     this.selectType = t
    //   }
    //   if (this.selectType === 'task') {
    //     get_task_release_list({
    //       page: 1,
    //       page_size: 10000,
    //       keyword: this.keyword,
    //       class_id: this.class_id,
    //       teacher_course_id: this.teacher_course_id,
    //       correct_status: this.correct_status
    //     }).then(res => {
    //       if (res.code === 200) {
    //         this.tasklist_menu = res.data.list
    //         // this.taskcount = res.data.count
    //       }
    //     })
    //   } else if (this.selectType === 'exam') {
    //     get_exam_release_list({
    //       page: 1,
    //       page_size: 10000,
    //       keyword: this.keyword,
    //       class_id: this.class_id,
    //       teacher_course_id: this.teacher_course_id,
    //       correct_status: this.correct_status
    //     }).then(res => {
    //       if (res.code === 200) {
    //         this.examlist_meun = res.data.list
    //         // this.examcount = res.data.count
    //       }
    //     })
    //   } else if (this.selectType === 'homework') {
    //     get_homework_release_list({
    //       page: 1,
    //       page_size: 10000,
    //       keyword: this.keyword,
    //       class_id: this.class_id,
    //       teacher_course_id: this.teacher_course_id,
    //       correct_status: this.correct_status
    //     }).then(res => {
    //       if (res.code === 200) {
    //         this.homeworklist_meun = res.data.list
    //         // this.homeworkcount = res.data.count
    //       }
    //     })
    //   }
    // },
    getData () {
      get_task_release_list({
        page: 1,
        page_size: 10000,
        keyword: '',
        class_id: '',
        teacher_course_id: this.teacher_course_id,
        correct_status: this.correct_status
      }).then(res => {
        if (res.code === 200) {
          this.unreadtasklist = res.data.list
        }
      })
      get_exam_release_list({
        page: 1,
        page_size: 10000,
        keyword: '',
        class_id: '',
        teacher_course_id: this.teacher_course_id,
        correct_status: this.correct_status
      }).then(res => {

        if (res.code === 200) {
          this.unreadexamlist = res.data.list
        }
      })
      get_homework_release_list({
        page: 1,
        page_size: 10000,
        keyword: '',
        class_id: '',
        teacher_course_id: this.teacher_course_id,
        correct_status: this.correct_status
      }).then(res => {
        if (res.code === 200) {
          this.unreadhomeworklist = res.data.list
        }
      })
      this.showCorrctList = false
    },
    closeModal () {
      this.showCorrctList = false
    }
  },
  mounted () {

    this.getTeacherCourseList()
    this.getclasslist()
    this.getData()
    this.get_menu_courseList(),
      this.handle_course_name()
  }
}
</script>
<style lang="less" scoped>
.correct_color {
  background-color: #1170ff;
  color: #fff;
  border-radius: 4px;
}
/deep/.ivu-menu-submenu-title {
  padding: 4px 20px 4px 20px;
}
/deep/.ivu-menu-submenu-title-icon {
  // position: absolute;
  // top: 25%;
}
.ivu-menu-light.ivu-menu-vertical
  .ivu-menu-item-active:not(.ivu-menu-submenu):after {
  content: "";
  display: block;
  width: 3px;
  position: absolute;
  margin-left: 24px;
  top: 0;
  bottom: 0;
  right: 0;
  background: #2d8cf0;
}
.ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {
  color: #2d8cf0;
  background: #f0faff;
  z-index: 2;
}
</style>