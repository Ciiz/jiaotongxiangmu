<template>
  <Row>
    <Row type="flex" justify="space-between" class="evaluate-top">
      <Col>
      <span style="color:#222222">{{student_task.task.task_name}}</span>
      </Col>
      <Col>
      <span style="color:#222222">小组成绩：
        <span style="color:#EE3333" v-for="item in teacherEvaluation.score_option" :key="item.index">
          {{student_task.score_info.team_score===null?'未评分':student_task.score_info.team_score}}
        </span>
      </span>
      <span style="color:#222222">个人成绩：<span
          style="color:#EE3333">{{student_task.score_info.user_score===null?'未评分':student_task.score_info.user_score}}</span></span>
      </Col>
    </Row>
    <div style="color:#999999;font-size:12px">计算机一班 第一课时 课前任务</div>
    <Divider orientation="left"><span class="black-b">任务描述</span></Divider>
    <div class="gray-c8" style="margin-bottom:10px;word-break:break-all" v-html="student_task.task.content"></div>
    <div class="blue-c" style="margin:4px 0">答案：</div>
    <div class="gray-c8" style="margin-bottom:10px;word-break:break-all" v-html="student_task.submit_content"></div>
    <div style="margin-bottom:30px;margin-top:20px" v-if="student_task.file_url!==''">
      <span class="gray-c6">附件：</span>
      <a :href="student_task.file_url" class="new-file"
        target="blank">{{student_task.file_name?student_task.file_name:'附件'}}</a>
    </div>

    <Col span="24">
    <!-- 小组 -->
    <div v-if="student_task.task_release.release_type === 1">
      <div><span class="black-b">小组成员</span></div>
      <div style="margin:10px 0 30px 10px">
        <ul class="evaluate-u">
          <li v-for="(item,index) in student_task.team_members_info" :key="index">
            <img :src="item.icon" />
            <span>{{item.name}}</span>
            <span v-if="item.is_team_leader===0">（组员）</span>
            <span class="blue-c" v-if="item.is_team_leader===1">（组长）</span>
          </li>
        </ul>
        <div style="clear:both"></div>
      </div>
      <Divider orientation="left"><span class="black-b">评价我</span></Divider>
      <h2 v-if="student_task.is_team_leader === 1" class="black-b">组员回答以及组长对组员的评价:</h2>
      <h2 class="black-b" v-else>组长对我的评价</h2>
      <Row v-for="member in members" :key="member.id">
        <Tag color="magenta">{{member.student_name}}:</Tag>
        <h4>内容</h4>
        <div class="evaluate-content" v-html="member.submit_content" v-if="member.submit_type === 0"></div>
        <!--在线编辑的-->
        <div class="evaluate-content" v-else>
          <!--文件上传的-->
          <a :href="member.file_url" target="blank">{{member.file_name}}</a>
        </div>
        <h4>评价</h4>
        <div class="evaluate-content">
          <pre v-html="member.evaluation" v-if="member.evaluation"></pre>
        </div>
        <Row>
          <Col span="8" v-for="score_item in member.score_option" :key="score_item.index">
          <Score :label="score_item.option_name" :disabled="true" v-model="score_item.score">
          </Score>
          </Col>
        </Row>
      </Row>
      <div v-if="student_task.is_team_leader">
        <!-- 组长（显示组员对组长的评价） -->
        <Divider />
        <h2 class="black-b">组员对我的评价</h2>
        <Row v-for="member in members_to_leader" :key="member.id">
          <Tag color="magenta">{{member.student_name}}:</Tag>
          <h4>评价</h4>
          <div class="evaluate-content">
            <pre v-html="member.evaluation"></pre>
          </div>
          <Row>
            <Col span="8" v-for="score_item in member.score_option" :key="score_item.index">
            <Score :label="score_item.option_name" :disabled="true" v-model="score_item.score">
            </Score>
            </Col>
          </Row>
        </Row>
      </div>
      <Divider />
      <!-- <div v-if="!student_task.is_team_leader" class="row-item">
            <h2>我对组长的评价</h2>
            <div class="evaluate-content">
              <pre v-html="member_to_leader.evaluation"></pre>
            </div>
            <Row v-for="item in member_to_leader.score_option" :key="item.index">
                <Score
                :label="item.option_name"
                :disabled="true"
                v-model="item.score"
                >
                </Score>
            </Row>
          </div> -->

      <!-- <Divider/> -->

      <h2 class="black-b">教师对小组的评价</h2>
      <div class="row-item">
        <div class="evaluate-content">
          <pre v-html="teacherEvaluation.evaluation"></pre>
        </div>
      </div>
    </div>

    <!-- 个人 -->
    <div v-else>
      <h2 class="black-b">我的作答</h2>
      <div class="evaluate-content">
        <div v-html="student_task.submit_content"></div>
        <div v-if="student_task.file_url">
          文件:<a :href="student_task.file_url" target="blank">-----附件-----</a>
        </div>
      </div>
      <Divider />
      <h2 class="black-b">教师的评价</h2>
      <div class="evaluate-content">
        <pre v-html="teacherEvaluation.evaluation"></pre>
      </div>
      <Row>
        <Col :span="8" v-for="item in teacherEvaluation.score_option" :key="item.index">
        <Score :label="item.option_name" :disabled="true" v-model="item.score">
        </Score>
        </Col>
      </Row>
    </div>

    </Col>
    <Spin size="large" v-if="loading" fix></Spin>
  </Row>
</template>
<script>
import { student_task_detail } from '@/api/student'
export default {
  components: {
  },
  props: {
    student_task_id: ''
  },
  data () {
    return {
      student_task: {
        task: {},
        task_release: {}
      },
      uploadList: [],
      members: [],
      loading: false,
      teacherEvaluation: '',
      member_to_leader: {},
      members_to_leader: []
    }
  },
  computed: {
    member_name_list () {
      return this.members
        .map(item => {
          return item.student_name
        })
        .join(',')
    }
  },
  watch: {
    student_task_id (newVal, oldVal) {
      this.getTaskInfo(newVal)
    }
  },
  methods: {
    getTaskInfo (student_task_id) {
      if (!student_task_id) return
      let _this = this
      _this.loading = true
      student_task_detail(student_task_id).then(res => {
        _this.loading = false
        let data = res.data
        if (res.code === 200) {
          _this.student_task = data.student_task
          _this.members = data.members
          this.teacherEvaluation = data.teacherEvaluation
          this.members_to_leader = data.members_to_leader
          this.member_to_leader = data.member_to_leader
        }
      })
    }
  },
  mounted () {
    this.getTaskInfo(this.student_task_id)
  }
}
</script>
<style type="text/css" lang="less" scoped>
.center {
  text-align: right;
  margin-top: 15px;
}
.p-text {
  text-indent: 20px;
}
</style>
