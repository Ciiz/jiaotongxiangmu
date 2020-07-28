<template>
  <div style="height:100%;width:100%;position:relative">
    <div class="showCorrctList">
      <Row type="flex" justify="space-between">
        <Col :span="12" class="correct-iscorrect2">
          <span v-show="correct_status===1" style="background:#1170FF;color:#FFFFFF" @click="changeRank($event,'')">全部（{{data_info.student_num}}）</span>
          <span v-show="correct_status===1" style="background:#ffffff" @click="changeRank($event,'A')">优秀（{{data_info.rank_A_num}}）</span>
          <span v-show="correct_status===1" style="background:#ffffff" @click="changeRank($event,'B')">良好（{{data_info.rank_B_num}}）</span>
          <span v-show="correct_status===1" style="background:#ffffff" @click="changeRank($event,'C')">及格（{{data_info.rank_C_num}}）</span>
          <span v-show="correct_status===1" style="background:#ffffff" @click="changeRank($event,'D')">不及格（{{data_info.rank_D_num}}）</span>
        </Col>
        <Col style="margin-bottom:10px">
          <button class="correct-iscorrect2-back" @click="$emit('closeModal')">返回</button>
          <span v-show="correct_status===0" class="correct-iscorrect2-shownum" style="cursor:pointer" v-if="data_info.has_correct===list.length" @click="updateCorrectStatus">批改完成(发布)</span>
          <span v-show="correct_status===0" class="correct-iscorrect2-shownum" v-if="data_info.has_correct!==list.length">已批改：{{data_info.has_correct}}/{{list.length}}</span>
        </Col>
      </Row>
      <Row type="flex" style="flex:1;overflow:hidden">
        <Col :span="12" style="height:100%;overflow-y:scroll;margin-right:20px;padding:10px;background:#ffffff">
          <div style="border:1px solid #EEEEEE">
            <Row v-for="(item,index) in list" :key="index" style="color:#666666;font-size:14px;line-height:60px;text-align:center">
              <Col :span="1">{{index+1}}</Col>
              <Col :span="8" v-if="target_type==='student_task_list'">
                <span v-if="release_type === 2">
                <img :src="item.icon" style="margin:14px 0;vertical-align:middle;border-radius:50%;display:inline-block;width:32px;height:32px;margin-right:10px"/>
                  {{item.name}}
                </span>
                <span v-if="release_type === 1">小组{{item.team_id}}（组长：{{item.name}}）</span>
              </Col>
              <Col :span="5" v-else>
                <span v-if="release_type === 2">
                <img :src="item.icon" style="margin:14px 0;vertical-align:middle;border-radius:50%;display:inline-block;width:32px;height:32px;margin-right:10px"/>
                  {{item.name}}
                </span>
                <span v-if="release_type === 1">小组{{item.team_id}}（组长：{{item.name}}）</span>
              </Col>
              <Col :span="6">学号：{{item.s_no}}</Col>
              <Col :span="3">{{getexamstatus(item.exam_status)}}</Col>
              <Col :span="3">{{getscorestatus(item.score_status)}}</Col>
              <Col :span="3" v-if="target_type==='student_exam_list'">
                <span v-if="item.total_score!==''">{{item.total_score}}分</span>
                <span v-if="item.total_score===''">未评分</span>
              </Col>
              <Col :span="3" v-else>
                <span v-if="item.user_score!==''">{{item.user_score}}分</span>
                <span v-if="item.user_score===''">未评分</span>
              </Col>
              <Col :span="3">
                <button class="blue-btn" style="width:62px;line-height:30px" @click="openEvaluate(item,index)">{{item.score_status===1?'查看':'评价'}}</button>
              </Col>
            </Row>
          </div>
        </Col>
        <Col style="padding:20px;height:100%;flex:1;background:#ffffff;overflow-y:scroll">
        <div style="font-size:16px;color:#222222">{{target_type==='student_exam_list'?data_info.exam_name:(target_type==='student_task_list'?data_info.task_name:data_info.homework_name)}}</div>
        <div class="examDetail-info">
          <span>班级：{{data_info.class_name}}</span>
          <span>开始时间：{{moment(data_info.start_time * 1000).format('YYYY-MM-DD HH:mm')}}</span>
          <span>截止时间：{{moment(data_info.end_time * 1000).format('YYYY-MM-DD HH:mm')}}</span>
        </div>
        <div style="font-size:14px;margin-top:2px">提交人数：{{data_info.student_submitted_num}}/{{data_info.student_num}}</div>
        <div class="examDetail-info-num">满分：{{data_info.option}}</div>
        <Row v-if="target_type==='student_exam_list'">
          <h2 style="font-size:16px;color:#3B9BFF">试题内容</h2>
          <div v-for="(item,index) in objective_question" :key="index" class="exam-questionList">
            <p class="examDetail-info-title" v-if="item.length!==0">{{item[0].object_type===1?'单选题':'多选题'}}（共{{objective_question.multiple_choice.length}}题）</p>
            <div v-for="(item2,index2) in item" :key="index2">
              <p>{{index2+1}}、{{item2.content}}（{{item2.score}}分）</p>
              <ul>
                <li v-for="(item3,index3) in item2.option" :key="index3">
                  {{changeSel(index3)}}{{item3}}
                </li>
              </ul>
            </div>
          </div>
          <div v-for="(item,index) in subjective_question" :key="index" class="exam-questionList">
            <p class="examDetail-info-title" v-if="item.length!==0">{{changeQusetionType(item[0].subject_type)}}（共{{item.length}}题）</p>
            <div v-for="(item2,index2) in item" :key="index2">
              <p>{{index2+1}}、{{item2.content}}（{{item2.score}}分）</p>
            </div>
          </div>
        </Row>
        <Row v-if="target_type==='student_task_list'">
          <h2 style="font-size:16px;color:#3B9BFF;margin-bottom:10px">任务内容</h2>
          <div v-html="data_info.content"></div>
        </Row>
        <Row v-if="target_type==='student_homework_list'">
          <h2 style="font-size:16px;color:#3B9BFF;margin-bottom:10px">作业内容</h2>
          <div v-html="data_info.homework_content"></div>
        </Row>
        </Col>
        <Modal class="fistIndex-modal" v-model="modal" :title="title" :width="900" :footer-hide="footerHide" :fullscreen="fullscreen">
          <StudentExamEvaluate @changeExam="changePage" :examIndex="currentIndex" :student_exam_id="target_id" v-if="target === 'student_exam_list' && modal" @success="modal = false ; getData()"></StudentExamEvaluate>
          <StudentTaskEvaluate @changeTask='changePage' :taskIndex="currentIndex" :student_task_id="target_id" v-if="target === 'student_task_list' && modal" @success="modal = false ; getData()"></StudentTaskEvaluate>
          <StudentHomeworkEvaluate @changeHomwork="changePage" :homeworkIndex="currentIndex" :student_homework_id="target_id" v-if="target === 'student_homework_list' && modal" @success="modal = false ; getData()"></StudentHomeworkEvaluate>
        </Modal>
      </Row>
    </div>
  </div>
</template>
<script>
import modal_mixin from '@/view/mixins/modal_mixin'
import { update_correct_status } from '@/api/data'
import StudentExamEvaluate from '@/view/teacher_common/exam/student_exam_evaluate'
import StudentTaskEvaluate from '@/view/teacher_common/task/student_task_evaluate'
import StudentHomeworkEvaluate from '@/view/teacher_common/homework/student_homework_evaluate'

export default{
  props: {
    targetwork_id: '',
    target_type: ''
  },
  mixins: [modal_mixin],
  components: {
    StudentExamEvaluate,
    StudentTaskEvaluate,
    StudentHomeworkEvaluate
  },
  data () {
    return {
      rank: '',
      total: 0,
      list: [],
      keyword: '',
      loading: false,
      release_type: '',
      correct_status: 0,
      modal: false,
      title: '',
      currentIndex: '',
      exam_name: '',
      objective_question: [],
      subjective_question: [],
      data_info: []
    }
  },
  watch: {
    targetwork_id (n, o) {
      this.getData()
    },
    rank (n, o) {
      this.getData()
    }
  },
  methods: {
    changeRank (e, r) {
      for (let i = 0; i < document.getElementsByClassName('correct-iscorrect2')[0].children.length; i++) {
        document.getElementsByClassName('correct-iscorrect2')[0].children[i].style.color = '#666666'
        document.getElementsByClassName('correct-iscorrect2')[0].children[i].style.background = '#ffffff'
      }
      this.rank = r
      e.target.style.background = '#1170FF'
      e.target.style.color = '#FFFFFF'
    },
    changeSel (i) {
      if (i === 0) {
        return 'A.'
      } else if (i === 1) {
        return 'B.'
      } else if (i === 2) {
        return 'C.'
      } else if (i === 3) {
        return 'D.'
      } else if (i === 4) {
        return 'E.'
      } else if (i === 5) {
        return 'F.'
      }
    },
    changeQusetionType (i) {
      if (i === 1) {
        return '论述题.'
      } else if (i === 2) {
        return '简答题.'
      } else if (i === 3) {
        return '应用题.'
      } else if (i === 4) {
        return '作文题.'
      }
    },
    getscorestatus (i) {
      if (i === 0) {
        return '未评分'
      }
      if (i === 1) {
        return '已评分'
      }
    },
    getexamstatus (i) {
      if (i === 0) {
        return '未开始'
      }
      if (i === 1) {
        return '考试中'
      }
      if (i === 2) {
        return '已交卷'
      }
      if (i === 3) {
        return '已批改'
      }
      if (i === 4) {
        return '已逾期'
      }
    },
    getData () {
      this.loading = true
      if (this.target_type === 'student_exam_list') {
        this.axios.request({
          method: 'get',
          url: '/index.php/Teacher/Examination/student_exam_list',
          params: {
            exam_release_id: this.targetwork_id,
            score_rank: this.rank
          }
        }).then(res => {
          if (res.code === 200) {
            this.list = res.data.list
            this.correct_status = res.data.correct_status
            this.release_type = 2
            this.objective_question = res.data.exam_info.objective_question
            this.subjective_question = res.data.exam_info.subjective_question
            this.data_info = res.data.exam_info
          }
          this.loading = false
        })
      } else if (this.target_type === 'student_task_list') {
        this.axios.request({
          method: 'post',
          url: '/index.php/Teacher/Task/team_list_v2',
          data: {
            task_release_id: this.targetwork_id,
            score_rank: this.rank
          }
        }).then(res => {
          if (res.code === 200) {
            this.list = res.data.list
            this.data_info = res.data.task_info
            this.release_type = res.data.release_type
            this.correct_status = res.data.correct_status
            this.objective_question = []
            this.subjective_question = []
          }
          this.loading = false
        })
      } else if (this.target_type === 'student_homework_list') {
        this.axios.request({
          method: 'get',
          url: '/index.php/Teacher/Homework/student_homework_list',
          params: {
            homework_release_id: this.targetwork_id,
            score_rank: this.rank
          }
        }).then(res => {
          if (res.code === 200) {
            this.list = res.data.list
            this.correct_status = res.data.correct_status
            this.release_type = 2
            this.data_info = res.data.homework_info
            this.objective_question = []
            this.subjective_question = []
          }
          this.loading = false
        })
      }
    },
    updateCorrectStatus (val) {
      let t
      if (this.target_type === 'student_exam_list') {
        t = 'exam'
      } else if (this.target_type === 'student_task_list') {
        t = 'task'
      } else if (this.target_type === 'student_homework_list') {
        t = 'homework'
      }
      update_correct_status({ type: t, release_id: this.targetwork_id, correct_status: 1 }).then(res => {
        if (res.code === 200) {
          this.$Message.success(res.message)
          this.$emit('on-refresh-parent-list')
        }
      })
    },
    openEvaluate (item, index) {
      this.currentIndex = index
      this.open(this.target_type, item.id, '评价')
    },
    changePage (i) {
      if (i >= this.list.length) {
        this.$Message.error('已经是最后一位了')
        this.currentIndex = this.list.length - 1
      } else if (i < 0) {
        this.$Message.error('已经是第一位了')
        this.currentIndex = 0
      } else {
        this.currentIndex = i
        this.open(this.target_type, this.list[i].id, '评价')
      }
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
