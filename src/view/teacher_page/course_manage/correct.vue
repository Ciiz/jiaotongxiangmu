<template>
  <div class="correct" style="height:100%;postition:relative">
    <div style="height:100%;width:100%;position:absolute" v-show="showCorrctList">
      <student-exam-list :targetwork_id="target_id" :target_type='target' @closeModal="closeModal"
        @on-refresh-parent-list="getData()"></student-exam-list>
    </div>

    <div style="height:100%;display:flex;flex-direction:column;padding:20px">
      <div class="correct-iscorrect">
        <span v-show="correct_status===0" style="background:#1170FF;color:#FFFFFF" @click="correct_status=0">待批改</span>
        <span v-show="correct_status===0" style="background:#ffffff" @click="correct_status=1">已批改</span>
        <span v-show="correct_status===1" style="background:#ffffff" @click="correct_status=0">待批改</span>
        <span v-show="correct_status===1" style="background:#1170FF;color:#FFFFFF" @click="correct_status=1">已批改</span>
      </div>
      <Row type="flex" justify="space-between" class="correct-select" v-show="correct_status===1">
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
      </Row>
      <!-- 待批改 -->
      <div style="width:100%;height:100%;position:relative" v-show="correct_status===0">
        <ul class="correct-list">
          <li v-for="(item,index) in unreadtasklist" :key="'task'+index" style="width:300px;margin:10px 0">
            <div class="showdetail" @click="openModal('student_task_list', item.task_release_id)">
              <div class="correct-sjx" style="border-top:40px solid #1170FF"></div>
              <div class="correct-sjx-xz">任务</div>
              <div class="cname">{{item.task_name}}</div>
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
      </div>
      <!-- 已批改 -->
      <Tabs size="small" @on-click="changeType" class="correct-tab" value="task" v-if="correct_status===1">
        <TabPane label="任务" name="task">
          <ul class="correct-list">
            <li v-for="(item,index) in tasklist" :key="'task'+index" style="width:300px;margin:10px 0">
              <div class="showdetail" @click="openModal('student_task_list', item.task_release_id)">
                <div class="correct-sjx" style="border-top:40px solid #1170FF"></div>
                <div class="correct-sjx-xz">任务</div>
                <div class="cname">{{item.task_name}}</div>
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
        </TabPane>
        <TabPane label="作业" name="homework">
          <ul class="correct-list">
            <li v-for="(item,index) in homeworklist" :key="'homework'+index" style="width:300px;margin:10px 0">
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
          </ul>
        </TabPane>
        <TabPane label="测试" name="exam">
          <ul class="correct-list">
            <li v-for="(item,index) in examlist" :key="'exam'+index" style="width:20%;margin:10px 0">
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
        </TabPane>
      </Tabs>
    </div>
  </div>
</template>
<script>
import StudentExamList from '@/view/teacher_common/exam/student_exam_list'
import modal_mixin from '@/view/mixins/modal_mixin'
import { get_teacher_course_list, get_task_release_list, get_exam_release_list, get_homework_release_list } from '@/api/data'
export default {
  mixins: [modal_mixin],
  components: {
    StudentExamList
  },
  watch: {
    correct_status () {
      this.changeType()
    },
    class_id () {
      this.changeType()
    },
    teacher_course_id () {
      this.changeType()
    },
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
      taskcount: '',
      examlist: [],
      unreadexamlist: [],
      unreadexamlisttotal: '',
      correct_status: 0,
      examcount: '',
      homeworklist: [],
      unreadhomeworklist: [],
      unreadhomeworklisttotal: '',
      homeworkcount: '',
      teacher_course_id: '',
      class_id: '',
      keyword: '',
      teacher_course_list: [],
      class_list: []
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
    openModal (t, i) {
      this.target = t
      this.target_id = i
      this.showCorrctList = true
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
    changeType (t) {
      if (t !== undefined) {
        this.selectType = t
      }
      if (this.selectType === 'task') {
        get_task_release_list({
          page: 1,
          page_size: 10000,
          keyword: this.keyword,
          class_id: this.class_id,
          teacher_course_id: this.teacher_course_id,
          correct_status: this.correct_status
        }).then(res => {
          if (res.code === 200) {
            this.tasklist = res.data.list
            this.taskcount = res.data.count
          }
        })
      } else if (this.selectType === 'exam') {
        get_exam_release_list({
          page: 1,
          page_size: 10000,
          keyword: this.keyword,
          class_id: this.class_id,
          teacher_course_id: this.teacher_course_id,
          correct_status: this.correct_status
        }).then(res => {
          console.log(res);
          console.log('待测试');
          if (res.code === 200) {
            this.examlist = res.data.list
            this.examcount = res.data.count
          }
        })
      } else if (this.selectType === 'homework') {
        get_homework_release_list({
          page: 1,
          page_size: 10000,
          keyword: this.keyword,
          class_id: this.class_id,
          teacher_course_id: this.teacher_course_id,
          correct_status: this.correct_status
        }).then(res => {
          if (res.code === 200) {
            this.homeworklist = res.data.list
            this.homeworkcount = res.data.count
          }
        })
      }
    },
    getData () {
      get_task_release_list({
        page: 1,
        page_size: 10000,
        keyword: '',
        class_id: '',
        teacher_course_id: this.teacher_course_id,
        correct_status: this.correct_status
      }).then(res => {
        console.log(res);
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
        console.log(res);
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
  }
}
</script>
