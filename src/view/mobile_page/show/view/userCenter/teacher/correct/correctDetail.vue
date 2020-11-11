<template>
  <div class="m-taskInfo flex-contain">
    <mt-header
      :title="(correct_status===0?'未批':(correct_status===1?'已批':''))+(type==='exam'?'测试':(type==='task'?'任务':'作业'))">
      <router-link to="mobileCorrectIndex" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <div class="m-taskInfo-middle hideScroll flex-contain">
      <div class="m-taskDetail">
        <div style="font-size:0.32rem;font-weight:bold;color:#000000">{{data_info.task_name}}</div>
        <div>
          <span>{{data_info.class_name}}</span>
        </div>
        <div>
          <span>截止时间：</span>
          <span>{{moment(data_info.end_time * 1000).format('YYYY-MM-DD HH:mm')}}</span>
        </div>
        <div>
          <span>提交人数：{{data_info.student_submitted_num}}/{{data_info.student_num}}</span>
        </div>
      </div>
      <div class="m-taskContent" v-if="type==='task'">
        <div style="color:#212121;margin-bottom:0.1rem">任务内容：</div>
        <div v-html="data_info.content" style="word-break:break-all"></div>
      </div>
      <div class="m-taskContent" v-if="type==='homework'">
        <div style="color:#212121;margin-bottom:0.1rem">作业内容：</div>
        <div v-html="data_info.homework_content" style="word-break:break-all"></div>
      </div>
      <div class="m-taskContent" v-if="type==='exam'">
        <div style="color:#212121;margin-bottom:0.1rem">测试内容：</div>
        <div v-for="(item,index) in objective_question" :key="index" class="m-exam-questionList">
          <p v-if="item.length!==0">
            {{item[0].object_type===1?'单选题':'多选题'}}（共{{objective_question.multiple_choice.length}}题）</p>
          <div v-for="(item2,index2) in item" :key="index2">
            <p>{{index2+1}}、{{item2.content}}（{{item2.score}}分）</p>
            <ul>
              <li v-for="(item3,index3) in item2.option" :key="index3">
                {{changeSel(index3)}}{{item3}}
              </li>
            </ul>
          </div>
        </div>
        <div v-for="(item,index) in subjective_question" :key="index" class="m-exam-questionList">
          <p v-if="item.length!==0">{{changeQusetionType(item[0].subject_type)}}（共{{item.length}}题）</p>
          <div v-for="(item2,index2) in item" :key="index2">
            <p class="m-subjective-question">{{index2+1}}、{{item2.content}}（{{item2.score}}分）</p>
          </div>
        </div>
      </div>
    </div>
    <div style="display:flex">
      <button class="m-b-btn-b" v-if="correct_status===0"
        @click="showStudent">批改{{type==='exam'?'测试':(type==='task'?'任务':'作业')}}</button>
      <button class="m-b-btn-b" v-if="correct_status===1" @click="showStudent">查看成绩</button>
    </div>
  </div>
</template>
<script>

export default {
  data () {
    return {
      correct_status: '',
      release_type: '',
      data_info: {},
      objective_question: [],
      subjective_question: []
    }
  },
  computed: {
    type () {
      return this.$route.query.type
    },
    id () {
      return this.$route.query.id
    }
  },
  methods: {
    getData () {
      if (this.type === 'exam') {
        this.axios.request({
          method: 'get',
          url: '/index.php/Teacher/Examination/student_exam_list',
          params: {
            exam_release_id: this.id
          }
        }).then(res => {
          if (res.code === 200) {
            this.correct_status = res.data.correct_status
            this.release_type = 2
            this.objective_question = res.data.exam_info.objective_question
            this.subjective_question = res.data.exam_info.subjective_question
            this.data_info = res.data.exam_info
          }
        })
      } else if (this.type === 'task') {
        this.axios.request({
          method: 'post',
          url: '/index.php/Teacher/Task/team_list_v2',
          data: {
            task_release_id: this.id
          }
        }).then(res => {
          if (res.code === 200) {
            this.data_info = res.data.task_info
            this.release_type = res.data.release_type
            this.correct_status = res.data.correct_status
            this.objective_question = []
            this.subjective_question = []
          }
        })
      } else if (this.type === 'homework') {
        this.axios.request({
          method: 'get',
          url: '/index.php/Teacher/Homework/student_homework_list',
          params: {
            homework_release_id: this.id
          }
        }).then(res => {
          if (res.code === 200) {
            this.correct_status = res.data.correct_status
            this.release_type = 2
            this.data_info = res.data.homework_info
            this.objective_question = []
            this.subjective_question = []
          }
        })
      }
    },
    showStudent () {
      this.$router.push({ name: 'mobileCorrectStudent', query: { id: this.id, type: this.type } })
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
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
