<template>
  <div class="modal-content">
    <Form :model="task_release" :label-width="100" :rules="rules" ref="task_release">
      <FormItem label="课件上课时间：">
        <Input v-model="class_begin_time" readonly disabled style="width: 200px"></Input>
      </FormItem>
      <FormItem label="发布时间：" prop="start_time">
        <DatePicker :value="task_release.start_time" format="yyyy-MM-dd HH:mm:ss" type="datetime"
          @on-change="(fmt_date, date) => {task_release.start_time = fmt_date}" placeholder="开始时间" style="width: 200px">
        </DatePicker>
        <p v-show="type === 1">提示：课前任务可在设置的开始时间自动发布！</p>
      </FormItem>
      <FormItem label="结束时间：" prop="end_time">
        <DatePicker :value="task_release.end_time" format="yyyy-MM-dd HH:mm:ss"
          @on-change="(fmt_date, date) => {task_release.end_time = fmt_date}" type="datetime" placeholder="结束时间"
          style="width: 200px"></DatePicker>
      </FormItem>
      <Divider orientation="left" v-if="!editable" size="small">该任务有其他班级使用 或者 当前班级已发布，以下信息不可编辑</Divider>
      <FormItem label="任务名称：" prop="task_name">
        <Input v-model="task_release.task_name" style="width: 200px;" placeholder="任务名称" v-if="editable"></Input>
        <p v-else>{{task_release.task_name}}</p>
      </FormItem>
      <FormItem label="任务类型：" prop="release_type">
        <RadioGroup v-model="task_release.release_type" v-if="editable">
          <Radio :label="2">个人</Radio>
          <!--课中只能个人任务-->
          <Radio :label="1">小组</Radio>
        </RadioGroup>
        <p v-else>{{task_release.release_type === 1 ? '小组' : '个人'}}</p>
      </FormItem>
      <FormItem label="发布方式：" prop="is_auto_release" v-if="editable">
        <RadioGroup v-model="task_release.is_auto_release">
          <Radio :label="1">自动发布</Radio>
          <Radio :label="0">在课堂中手动发布</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="小组分配：" v-if="task_release.release_type === 1">
        <TaskTeamManage ref="team" v-model="task_release.students" :team_list.sync="team_list"></TaskTeamManage>
      </FormItem>
      <FormItem label="评分维度:">
        <div class="score-item-container" v-if="editable">
          <div v-for="(score_option,index1) in task_release.option" :key="index1" class="score-item">
            <div>
              <Input v-model="score_option.option_name" style="width: 250px;" class="score-option-input" size="small"
                placeholder="维度名称">
              <Button type="default" slot="prepend" @click="task_release.option.splice(index1,1)"
                size="small">删除</Button>
              <InputNumber placeholder="权重" slot="append" v-model="score_option.weight" size="small"></InputNumber>
              </Input>
            </div>
          </div>
          <Button size="small" type="dashed" icon="md-add" @click="addScoreOption(task_release.option)"
            v-show="editable"></Button>
        </div>
        <div v-else>
          <span v-for="(score_option,index1) in task_release.option" :key="index1" style="margin-right: 20px;">
            <span>{{score_option.option_name}}:</span>
            <span>{{score_option.weight}}</span>
          </span>
        </div>
      </FormItem>
      <FormItem label="评分人权重：" v-if="task_release.release_type === 1">
        <div style="width: 120px;display:inline-block" v-for="item in task_release.evaluate_weight"
          :key="item.evaluate_type">
          {{evaluateTypeMap[item.evaluate_type]}}:
          <InputNumber style="width: 100px;" v-model="item.evaluate_weight"
            v-if="editable&&evaluateTypeMap[item.evaluate_type]==='教师评'"></InputNumber>
          <p v-else>{{item.evaluate_weight}}</p>
        </div>
      </FormItem>
      <FormItem label="任务内容：" prop="content">
        <div v-show="editable">
          <Editor v-model="task_release.content" :is_init.sync="editor_init" :height="400">
          </Editor>
        </div>
        <div v-html="task_release.content" v-show="!editable"></div>
      </FormItem>
    </Form>
    <div class="modal-footer">
      <Button type="primary" @click="submit">保存</Button>
    </div>
    <Modal v-model="modal" :title="title" :width="modal_width" :footer-hide="footerHide">
      <TaskEvaluationEdit :id="target_id" v-if="target === 'task_evaluation_edit'" @success="$emit('success')">
      </TaskEvaluationEdit>
    </Modal>
    <Spin fix v-if="loading"></Spin>
  </div>
</template>
<script>
import class_begin from '@/view/mixins/class_begin'
import { mapActions } from 'vuex'
import modal_mixin from '@/view/mixins/modal_mixin'
import TaskEvaluationEdit from '@/view/teacher_common/task/task_evaluation_edit.vue'
import { evaluateTypeMap } from '@/view/mixins/str_map'
import TaskTeamManage from '@/view/teacher_common/task/task_team_manage'
import { get_students_by_timetable_id } from '@/api/data'
export default {
  props: {
    task_release_id: '',
    timetable_id: '',
    type: '',
    courseware_id: ''
  },
  components: {
    TaskEvaluationEdit, TaskTeamManage
  },
  mixins: [class_begin, modal_mixin],
  data () {
    return {
      editable: false,
      evaluateTypeMap: evaluateTypeMap,
      team_list: [],
      task_release: {
        id: '',
        task_name: '',
        content: '',
        type: this.type,
        days: 1,
        start_time: this.moment().format('YYYY-MM-DD HH:mm:ss'),
        end_time: this.moment().format('YYYY-MM-DD HH:mm:ss'),
        timetable_id: this.timetable_id,
        courseware_id: this.courseware_id,
        release_type: 2,
        is_auto_release: 1,
        team_size: 1,
        evaluate_weight: [
          { evaluate_type: 1, evaluate_weight: 100 }, // 教师
          { evaluate_type: 2, evaluate_weight: 0 }, // 组长
          { evaluate_type: 4, evaluate_weight: 0 }// 组员
        ],
        option: [],
        students: []
      },
      loading: false,
      editor_init: false,
      rules: {
        task_name: [
          { required: true, message: '任务名称不能为空', trigger: 'blur' }
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
        is_auto_release: [
          { required: true, type: 'number', message: '请选择发布方式', trigger: 'blur' }
        ],
        team_size: [
          { required: true, type: 'number', message: '请填写小组分组人数', trigger: 'blur' },
          { type: 'number', message: '分组人数必须为数字', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    task_release_id (n, o) {
      this.getInfo()
    },
    class_begin_time (n, o) {
      if (!this.task_release_id && n !== 0) {
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
  methods: {
    getInfo () {
      this.editor_init = false
      if (this.task_release_id) { // 编辑
        this.loading = true
        this.axios.request({
          method: 'get',
          url: 'index.php/Teacher/Task/task_release_detail',
          params: {
            task_release_id: this.task_release_id
          }
        }).then(res => {
          if (res.code === 200) {
            let data = res.data.task_release
            if (data.evaluate_weight.length === 0) { // 处理开始是个人任务,换成小组没有返回评分人权重的问题
              data.evaluate_weight = [
                { evaluate_type: 1, evaluate_weight: 100 }, // 教师
                { evaluate_type: 2, evaluate_weight: 0 }, // 组长
                { evaluate_type: 4, evaluate_weight: 0 }// 组员
              ]
            }
            this.task_release = {
              id: data.task_id,
              task_name: data.task.task_name,
              content: data.task.content,
              type: data.task.type,
              days: '',
              start_time: this.moment(data.start_time * 1000).format('YYYY-MM-DD HH:mm:ss'),
              end_time: this.moment(data.end_time * 1000).format('YYYY-MM-DD HH:mm:ss'),
              timetable_id: data.timetable_id,
              courseware_id: data.task.courseware_id,
              release_type: data.release_type,
              is_auto_release: data.is_auto_release,
              evaluate_weight: data.evaluate_weight,
              team_size: data.team_size,
              release_status: data.release_status,
              option: data.option,
              students: data.students
            }
            this.team_list = this.getTargetArr(data.students) // 处理获取team_list
            this.editable = res.data.editable
            this.editor_init = true
            this.loading = false
          }
        })
      } else { // 新增
        this.task_release = {
          id: '',
          task_name: '',
          content: '',
          type: this.type,
          days: 1,
          start_time: this.moment().format('YYYY-MM-DD HH:mm:ss'),
          end_time: this.moment().format('YYYY-MM-DD HH:mm:ss'),
          timetable_id: this.timetable_id,
          courseware_id: this.courseware_id,
          release_status: 0,
          release_type: this.type === 2 ? 1 : 2,
          is_auto_release: this.is_auto_release,
          team_size: 1,
          evaluate_weight: [
            { evaluate_type: 1, evaluate_weight: 100 },
            { evaluate_type: 2, evaluate_weight: 0 },
            { evaluate_type: 4, evaluate_weight: 0 }
          ],
          option: [{ option_name: '分数', weight: 100 }],
          students: []
        }

        this.getStudents()
        this.editor_init = true
        this.editable = true
      }
    },
    ...mapActions([
      'sendunread',
      'resetgetInfo'
    ]),
    submit () {
      if (this.task_release.release_type === 1) {
        this.$refs['team'].validate((flag, errMsg) => {
          if (!flag) {
            this.$Message.error(errMsg)
          } else {
            this.submit_action()
          }
        })
      } else {
        this.submit_action()
      }
    },
    submit_action () {
      if (this.task_release.evaluate_weight[0].evaluate_weight > 100 || this.task_release.evaluate_weight[0].evaluate_weight < 0) {
        this.$Message.error('教师评分只能在0-100之间')
      } else {
        this.$refs['task_release'].validate(valid => {
          if (valid) {
            let { id, task_name, content, type, days, start_time, end_time, timetable_id, courseware_id, team_size, release_type, is_auto_release, evaluate_weight, option, students } = this.task_release
            this.axios.request({
              method: 'post',
              url: '/index.php/Teacher/Task/add',
              params: { // FIXME:这里不应该这样传
                id: this.task_release.id
              },
              data: {
                id,
                task_name,
                content,
                type,
                days,
                timetable_id,
                courseware_id,
                start_time: Date.parse(start_time) / 1000,
                end_time: Date.parse(end_time) / 1000,
                evaluate_weight,
                team_size,
                release_type,
                is_auto_release,
                score_weight: option,
                students: students
              }
            }).then(res => {
              if (res.code === 200) {
                if (!this.task_release.id) {
                  this.$emit('success')
                  this.$Message.success(res.message)
                } else {
                  this.$Message.success(res.message)
                  this.$emit('success')
                }
                this.sendunread()
                this.resetgetInfo()
              }
            })
          } else {
            this.$Message.error('请检查填写内容')
          }
        })
      }
    },
    getStudents () {
      get_students_by_timetable_id(this.timetable_id).then(res => {
        if (res.code === 200) {
          res.data.students.forEach((item, index) => {
            item.team_id = 1
            item.is_team_leader = index === 0 ? 1 : 0
          })
          this.team_list = this.getTargetArr(res.data.students)
          this.task_release.students = res.data.students
        }
      })
    },
    getTargetArr (arr) { // 获取team_list数组
      arr.sort((a, b) => {
        return b.is_team_leader - a.is_team_leader
      })
      let obj = {}
      arr.forEach(item => {
        typeof obj[item.team_id] === 'undefined'
          ? (obj[item.team_id] = [item])
          : obj[item.team_id].push(item)
      })

      return Object.values(obj)
    },
    addScoreOption (option) {
      option.push({
        option_name: '分数', weight: 100
      })
    }
  },
  mounted () {
    this.getInfo()
  }
}
</script>
<style lang="less">
</style>
