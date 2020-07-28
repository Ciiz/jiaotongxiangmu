<template>
  <div class="modal-content">
    <Form :label-width="100" :model="task_release" :rules="rules" ref="task_release">
      <FormItem label="课件上课时间">
        <Input v-model="class_begin_time" readonly disabled  style="width: 200px"></Input>
      </FormItem>
      <FormItem label="任务" prop="id">
        <Select v-model="task_release.id" style="width: 200px" @on-change="handleTaskChange" transfer>
          <Option :value="item.id" v-for="item in task_list" :key="item.id">{{item.task_name}}</Option>
        </Select>
      </FormItem>
      <FormItem label="发布时间" prop="start_time">
        <DatePicker transfer  :value="task_release.start_time"  @on-change="(fmt_date, date) => {task_release.start_time = fmt_date}"  type="datetime" placeholder="开始时间" style="width: 200px"></DatePicker>
        <p  v-show="type === 1">提示：课前任务可在设置的开始时间自动发布！</p>
      </FormItem>
      <FormItem label="结束时间" prop="end_time">
        <DatePicker transfer  :value="task_release.end_time"  @on-change="(fmt_date, date) => {task_release.end_time = fmt_date}" type="datetime" placeholder="结束时间" style="width: 200px"></DatePicker>
      </FormItem>
      <div v-show="task_release.id">
      <Spin v-if="loading"></Spin>
        <div v-show="!loading">
          <Divider orientation="left" v-if="!editable" size="small">该任务有其他班级使用，以下信息不可编辑</Divider>
          <FormItem label="任务类型" prop="release_type">
            <RadioGroup v-model="task_release.release_type" v-if="editable">
              <Radio :label="2" :disabled="!editable">个人</Radio>
              <Radio :label="1" :disabled="!editable">小组</Radio>
            </RadioGroup>
            <p v-else>{{task_release.release_type === 1 ? '小组' : '个人'}}</p>
          </FormItem>
          <!-- <FormItem label="小组人数：" v-show="task_release.release_type === 1" prop="team_size">
            <InputNumber v-model="task_release.team_size" :min="1" v-if="editable"></InputNumber>
            <p v-else>{{task_release.team_size}}</p>
          </FormItem> -->
          <FormItem label="评分维度:">
              <div class="score-item-container">
                <div v-for="(score_option,index1) in task_release.option" :key="index1" class="score-item">
                  <div v-if="editable">
                    <Input v-model="score_option.option_name" style="width: 250px;" class="score-option-input" size="small" placeholder="维度名称"  >
                      <Button type="default" slot="prepend" @click.native="task_release.option.splice(index1,1)"  size="small">删除</Button>
                      <InputNumber placeholder="权重"  slot="append" v-model="score_option.weight" size="small"></InputNumber>
                    </Input>
                  </div>
                  <div v-else>
                    <span  v-for="(score_option,index1) in task_release.option" :key="index1" style="margin-right: 20px;">
                      <span>{{score_option.option_name}}:</span>
                      <span>{{score_option.weight}}</span>
                    </span>
                  </div>
                </div>
                <Button size="small" type="dashed" icon="md-add" @click="addScoreOption(task_release.option)" v-show="editable"></Button>
              </div>
          </FormItem>
          <FormItem label="评分人权重：" v-show="task_release.release_type === 1">
            <Row>
              <Col :span="4" v-for="item in task_release.evaluate_weight" :key="item.evaluate_type" style="margin-right: 10px;">
              {{evaluateTypeMap[item.evaluate_type]}}:
              <InputNumber style="width: 100%;" v-model="item.evaluate_weight"  v-if="editable&&evaluateTypeMap[item.evaluate_type]==='教师评'"></InputNumber>
              <p v-else>{{item.evaluate_weight}}</p>
            </Col>
            </Row>
          </FormItem>
          <FormItem label="任务内容：" >
            <div v-html="task_release.task_content"></div>
          </FormItem>
          <FormItem label="小组分配：" v-if="task_release.release_type === 1">
            <TaskTeamManage ref="team" v-model="task_release.students"></TaskTeamManage>
          </FormItem>
        </div>
      </div>
    </Form>
    <div class="modal-footer">
      <Button type="primary" @click="submit" :disabled="loading">确定</Button>
    </div>
  </div>
</template>
<script>
import class_begin from '@/view/mixins/class_begin'
import { evaluateTypeMap } from '@/view/mixins/str_map'
import { get_release_info_by_task, get_students_by_timetable_id } from '@/api/data'
import TaskTeamManage from '@/view/teacher_common/task/task_team_manage'
export default{
  props: {
    courseware_id: '',
    timetable_id: '',
    type: ''
  },
  components: {
    TaskTeamManage
  },
  mixins: [class_begin],
  data () {
    return {
      id: '',
      loading: false,
      evaluateTypeMap: evaluateTypeMap,
      task_list: [],
      task_release: {
        id: '',
        start_time: this.moment().format('YYYY-MM-DD HH:mm:ss'),
        end_time: this.moment().format('YYYY-MM-DD HH:mm:ss'),
        release_type: 2,
        team_size: 2,
        evaluate_weight: [
          { evaluate_type: 1, evaluate_weight: 100 },
          { evaluate_type: 2, evaluate_weight: 0 },
          { evaluate_type: 4, evaluate_weight: 0 }
        ],
        students: [],
        option: []
      },
      editable: false,
      rules: {
        id: [
          { required: true, type: 'number', message: '任务不能为空', trigger: 'change' }
        ],
        start_time: [
          { required: true, message: '任务开始时间不能为空', trigger: 'blur' }
        ],
        end_time: [
          { required: true, message: '任务结束不能为空', trigger: 'blur' }
        ],
        release_type: [
          { required: true, type: 'number', message: '请选择发布类型', trigger: 'blur' }
        ],
        team_size: [
          { required: true, type: 'number', message: '请填写小组分组人数', trigger: 'blur' },
          { type: 'number', message: '分组人数必须为数字', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    refreshFlag (n, o) {
      this.getData()
    },
    class_begin_time (n, o) {
      if (n !== 0) {
        this.task_release.start_time = this.moment(this.class_begin_time).format('YYYY-MM-DD HH:mm:ss')
        this.task_release.end_time = this.moment(this.class_begin_time).add(2, 'days').format('YYYY-MM-DD HH:mm:ss')
      }
    },
    task_release: {
      handler (newValue, oldValue) {
        this.task_release.evaluate_weight[1].evaluate_weight = 100 - newValue.evaluate_weight[0].evaluate_weight
        this.task_release.evaluate_weight[2].evaluate_weight = this.task_release.evaluate_weight[1].evaluate_weight
      },
      deep: true
    }
  },
  computed: {
    refreshFlag () {
      return this.courseware_id + this.timetable_id + this.type
    }
  },
  methods: {
    submit () {
      if (this.task_release.evaluate_weight[0].evaluate_weight > 100 || this.task_release.evaluate_weight[0].evaluate_weight < 0) {
        this.$Message.error('教师评分只能在0-100之间')
      } else {
        this.$refs['task_release'].validate(valid => {
          if (valid) {
            let { id, start_time, end_time, release_type, team_size, evaluate_weight, option, students } = this.task_release
            this.axios.request({
              method: 'post',
              url: '/index.php/Teacher/Task/select_task_to_class',
              data: {
                id,
                type: this.type,
                days: '',
                start_time: Date.parse(start_time) / 1000,
                end_time: Date.parse(end_time) / 1000,
                timetable_id: this.timetable_id,
                release_type,
                team_size,
                evaluate_weight,
                editable: this.editable,
                score_weight: option,
                students
              }
            }).then(res => {
              if (res.code === 200) {
                this.$emit('success')
              }
            })
          } else {
            this.$Message.error('请检查填写信息')
          }
        })
      }
    },
    getData () {
      this.axios.request({
        method: 'get',
        url: '/index.php/Teacher/Task/index',
        params: {
          type: this.type,
          courseware_id: this.courseware_id,
          release: 1,
          timetable_id: this.timetable_id,
          page: 0
        }
      }).then(res => {
        if (res.code === 200) {
          this.task_list = res.data.task_list
          this.getStudents()
        }
      })
    },
    getStudents () {
      get_students_by_timetable_id(this.timetable_id).then(res => {
        if (res.code === 200) {
          this.task_release.students = res.data.students
        }
      })
    },
    handleTaskChange (task_id) {
      this.loading = true
      get_release_info_by_task(task_id).then(res => {
        if (res.code === 200) {
          this.editable = res.data.editable
          let release_info = res.data.release_info
          if (!res.data.editable) { // 不可编辑
            let { release_type, team_size, evaluate_weight } = release_info
            this.task_release.release_type = release_type
            this.task_release.team_size = team_size
            this.task_release.evaluate_weight = evaluate_weight
            this.task_release.task_content = release_info.task.content
            this.task_release.option = release_info.option
          } else {
            this.task_release.task_content = release_info.task.content
            this.task_release.release_type = 1
            this.team_size = 2
            this.task_release.option = release_info.option.length === 0 ? [{ option_name: '分数', weight: 100 }] : release_info.option
            this.task_release.evaluate_weight = !release_info.evaluate_weight ? [
              { evaluate_type: 1, evaluate_weight: 100 },
              { evaluate_type: 2, evaluate_weight: 0 },
              { evaluate_type: 4, evaluate_weight: 0 }
            ] : release_info.evaluate_weight
          }
          this.loading = false
        }
      })
    },
    addScoreOption (option) {
      option.push({
        option_name: '分数', weight: 100
      })
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
