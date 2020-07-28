<template>
  <div class="modal-content" style="height: 95%">
    <Form :model="exam_release" :rules="rules" ref="exam_release" :label-width="120">
      <FormItem label="课件上课时间" prop>
        <Input v-model="class_begin_time" readonly disabled style="width: 200px;"/>
      </FormItem>
      <FormItem label="发布时间" prop="start_time">
        <DatePicker
          transfer
          :value="exam_release.start_time"
          @on-change="(fmt_date, date) => {exam_release.start_time = fmt_date}"
          type="datetime"
          placeholder="发布时间"
          style="width: 200px"
        ></DatePicker>
      </FormItem>
      <FormItem label="截止时间" prop="end_time">
        <DatePicker
          transfer
          :value="exam_release.end_time"
          @on-change="(fmt_date, date) => {exam_release.end_time = fmt_date}"
          type="datetime"
          placeholder="截止时间"
          style="width: 200px"
        ></DatePicker>
      </FormItem>
      <Divider orientation="left" v-if="!editable" size="small">该任务有其他班级使用 或者 当前班级已发布，以下信息不可编辑</Divider>
      <FormItem label="试卷标题" prop="exam.exam_name">
        <Input v-model="exam_release.exam.exam_name" style="width: 200px;" :disabled="!editable"/>
      </FormItem>
      <FormItem label="考试时间" required>
        <InputNumber v-model="exam_release.exam.exam_time" placeholder="请输入数字" :disabled="!editable" number style="width:80px;" />分钟
      </FormItem>
      <FormItem label="题目">
          <Row>
            <Col :span="16">
            <Tabs :animated="false" size="small" v-model="tab">
              <div slot="extra">
                <span style="margin-right: 20px;">总分：{{total_score}},&nbsp;&nbsp;主观题分数：{{subj_score}},&nbsp;&nbsp;客观题分数：{{obj_score}}</span>
                <Button @click="() => {this.view_mode = !this.view_mode}"  type="success" icon="md-eye" style="margin-right:15px;" >{{view_mode?'编辑': '预览'}}</Button>
                <Button @click="openExamBank(tab)" type="primary"  :disabled="!editable">{{tab === 'subj' ? '主观题' : '客观题'}}题库</Button>
              </div>

              <TabPane label="主观题" name="subj">
                <Form :label-width="80" label-position="left">
                  <draggable
                  v-model="exam_release.subj"
                  v-bind="dragOptions"
                  tag="ul"
                  :disabled="!editable"
                  @start="handleDragStart"
                  @end="handleDragEnd"
                  >
                      <div v-for="(item,index) in exam_release.subj" :key="`${index}-${item.id}`"
                        class="exam-item"  name="description"
                      >
                        <h2 :style="{cursor: editable?'move':'default'}">
                          第{{index+1}}题
                          <span style="float:right" >
                            <Button type="text" @click="del(2,index)" :disabled="!editable" >删除</Button>
                            <Button type="text" @click="move(2,'up',index)" :disabled="!editable">上移</Button>
                            <Button type="text" @click="move(2,'down',index)" :disabled="!editable">下移</Button>
                          </span>
                        </h2>
                        <FormItem label="分值：">
                          <InputNumber :min="1" :max="100" v-model="item.score" size="small" :disabled="!editable" v-if="!view_mode"></InputNumber> <span v-else>{{item.score}}分</span>
                        </FormItem>
                        <FormItem label="评分维度:">
                          <div class="score-item-container">
                            <div v-for="(score_option,index1) in item.score_options" :key="index1" class="score-item">
                              <div v-if="!view_mode">
                                <Input v-model="score_option.option_name" style="width: 250px;" class="score-option-input" size="small" placeholder="维度名称" :disabled="!editable" >
                                  <Button slot="prepend" @click="item.score_options.splice(index1,1)" size="small"  :disabled="!editable" >删除</Button>
                                  <InputNumber placeholder="权重"  slot="append" v-model="score_option.weight" :disabled="!editable" size="small"></InputNumber>
                                </Input>
                              </div>
                              <div v-else>
                                <span>{{score_option.option_name}}:</span>
                                <span>{{score_option.weight}}</span>
                              </div>
                            </div>
                            <Button size="small" type="dashed" icon="md-add" @click="addScoreOption(item.score_options)" :disabled="!editable" v-show="!view_mode"></Button>
                          </div>
                        </FormItem>
                        <FormItem label="题目:">
                          <div style="margin-left:80px;">
                          <!-- <Input type="textarea" v-model="item.content" :disabled="!editable" v-if="!view_mode"></Input> -->
                          <Editor
                            v-model="item.content"
                            :is_init.sync="editor_init"
                            :height="200"
                            :editable="editable" v-if="!view_mode"
                          ></Editor>
                          <div v-html="item.content" v-else></div>
                          </div>
                        </FormItem>
                        <FormItem label="参考答案:">
                          <div style="margin-left:80px;">
                            <Input type="textarea" v-model="item.answer" :disabled="!editable" v-if="!view_mode"></Input>
                            <div v-html="item.answer" v-else></div>
                          </div>
                        </FormItem>
                      </div>
                  </draggable>
                  <Button type="dashed" icon="md-add" @click="addItem(2)" :disabled="!editable" v-show="!view_mode">添加</Button>
                </Form>
              </TabPane>

              <TabPane label="客观题" name="obj">
                <Form :label-width="80">
                <draggable
                  v-model="exam_release.obj"
                  v-bind="dragOptions"
                  tag="ul"
                  :disabled="!editable"
                  @start="drag = true"
                  @end="drag = false"
                  >
                      <li v-for="(item,index) in exam_release.obj" :key="`${index}-${item.id}`" class="exam-item" name="description">
                        <h2 :style="{cursor: editable?'move':'default'}">
                          第{{index+1}}题
                          <span style="float:right">
                            <Button type="text" @click="del(1,index)" :disabled="!editable">删除</Button>
                            <Button type="text" @click="move(1,'up',index)" :disabled="!editable">上移</Button>
                            <Button type="text" @click="move(1,'down',index)" :disabled="!editable">下移</Button>
                          </span>
                        </h2>
                        <FormItem label="分值：">
                          <InputNumber :min="1" :max="100" v-model="item.score" :disabled="!editable" v-if="!view_mode"></InputNumber><span v-else>{{item.score}}分</span>
                        </FormItem>
                        <FormItem label="题目:">
                          <div style="margin-left:80px;">
                            <Editor
                              v-model="item.content"
                              :is_init.sync="editor_init"
                              :height="200"
                              :editable="editable" v-if="!view_mode"
                            ></Editor>
                            <!-- <Input type="textarea" v-model="item.content" :disabled="!editable" v-if="!view_mode"></Input> -->
                            <div v-html="item.content" v-else></div>
                          </div>
                        </FormItem>
                        <FormItem label="选项:">
                          <div style="margin-left:80px;">
                            <Input type="textarea" v-model="item.option" placeholder="示例：A:减肥IE  B:的见覅" :disabled="!editable" v-if="!view_mode"></Input>
                            <div v-html="item.option" v-else></div>
                          </div>
                        </FormItem>
                        <FormItem label="正确答案:">
                          <Select
                            v-model="item.answer"
                            multiple
                            style="width:180px"
                            size="small"
                            :transfer="true"
                            :disabled="!editable"
                            v-if="!view_mode"
                          >
                            <Option value="A">A</Option>
                            <Option value="B">B</Option>
                            <Option value="C">C</Option>
                            <Option value="D">D</Option>
                            <Option value="E">E</Option>
                            <Option value="F">F</Option>
                          </Select>
                          <span v-else>{{Array.isArray(item.answer) === true ? item.answer.join(',') : item.answer}}</span>
                        </FormItem>
                      </li>
                  </draggable>
                  <Button type="dashed" icon="md-add" @click="addItem(1)" :disabled="!editable" v-show="!view_mode">添加</Button>
                </Form>
              </TabPane>

            </Tabs>
          </Col>
          </Row>
      </FormItem>
    </Form>

    <div class="modal-footer">
      <Button @click="submit(false)" type="primary">提交</Button>
    </div>

    <Spin fix v-show="loading"></Spin>

    <Modal v-model="modal" :title="title" footer-hide :width="modal_width">
      <ExamBank :bank_type="target_id" :teacher_course_id="teacher_course_id" v-if="target === 'exam_bank'" @add="handleAdd"></ExamBank>
    </Modal>

  </div>
</template>
<script>
import class_begin from '@/view/mixins/class_begin'
import { mapActions } from 'vuex'
import ExamBank from './exam_bank'
import modal_mixin from '@/view/mixins/modal_mixin'
import { get_release_detail, save_examination_release } from '@/api/data'
import draggable from 'vuedraggable' // 拖拽组件
export default {
  mixins: [class_begin, modal_mixin],
  props: {
    timetable_id: '',
    action_type: '', // 1 新增 2编辑 3详情 4复制
    type: '',
    exam_id: '',
    courseware_id: '',
    teacher_course_id: '',
    exam_release_id: ''
  },
  components: {
    ExamBank, draggable
  },
  data () {
    return {
      drag: false,
      view_mode: true,
      editor_init: true,
      tab: 'subj',
      loading: false,
      editable: false,
      interv_id: null,
      exam_release: {
        id: '',
        start_time: this.moment().format('YYYY-MM-DD HH:mm:ss'),
        end_time: this.moment().format('YYYY-MM-DD HH:mm:ss'),
        timetable_id: this.timetable_id,
        exam: {
          exam_name: '',
          exam_time: 90,
          type: this.type,
          courseware_id: this.courseware_id
        },
        obj: [],
        subj: []
      },
      rules: {
        'exam.exam_name': [
          { required: true, message: '测试名称不能为空', trigger: 'blur' }
        ],
        start_time: [
          { required: true, message: '测试开始时间不能为空', trigger: 'blur' }
        ],
        end_time: [
          { required: true, message: '测试结束不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    class_begin_time (n, o) {
      if (!this.exam_id && n !== 0) {
        this.exam_release.start_time = this.moment(
          this.class_begin_time
        ).format('YYYY-MM-DD HH:mm:ss')
        this.exam_release.end_time = this.moment(this.class_begin_time)
          .add(2, 'days')
          .format('YYYY-MM-DD HH:mm:ss')
      }
    },
    exam_release_id (n, o) {
      this.getInfo()
    }
  },
  computed: {
    dragOptions () {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      }
    },
    obj_score () {
      let score_list = this.exam_release.obj.map(item => { return item.score })
      return score_list.reduce(function (prev, cur, index, array) {
        return prev + cur
      }, 0)
    },
    subj_score () {
      let score_list = this.exam_release.subj.map(item => { return item.score })
      return score_list.reduce(function (prev, cur, index, array) {
        return prev + cur
      }, 0)
    },
    total_score () {
      return this.obj_score + this.subj_score
    }
  },
  methods: {
    getInfo () {
      if (this.exam_release_id) {
        this.loading = true
        get_release_detail(this.exam_release_id).then(res => {
          if (res.code === 200) {
            let exam_release = res.data.exam_release
            exam_release.start_time = this.moment(exam_release.start_time * 1000).format('YYYY-MM-DD HH:mm:ss')
            exam_release.end_time = this.moment(exam_release.end_time * 1000).format('YYYY-MM-DD HH:mm:ss')
            exam_release.obj = exam_release.obj.map(item => { item.answer = item.answer.split(','); return item })// 处理客观题answer
            this.exam_release = exam_release
            this.editable = res.data.editable
            // if (this.editable) {
            //   this.autoSaveStart()
            // }
          }
          this.loading = false
        })
      } else {
        this.exam_release = {
          id: '',
          start_time: this.moment().format('YYYY-MM-DD HH:mm:ss'),
          end_time: this.moment().format('YYYY-MM-DD HH:mm:ss'),
          timetable_id: this.timetable_id,
          exam: {
            id: '',
            exam_name: '',
            exam_time: 90,
            type: this.type,
            courseware_id: this.courseware_id
          },
          obj: [],
          subj: []
        }
        this.editable = true
        // this.autoSaveStart()
        this.view_mode = false
      }
    },
    autoSaveStart () {
      let _this = this
      this.$nextTick(function () {
        _this.interv_id = setInterval(() => {
          _this.submit(true)
        }, 10000)
      })
    },
    autoSaveStop () {
      clearInterval(this.interv_id)
    },
    ...mapActions(['sendunread', 'resetgetInfo']),
    submit (auto_save = false) {
      this.$refs['exam_release'].validate(valid => {
        if (valid) {
          let copy_data = JSON.parse(JSON.stringify(this.exam_release)) // 深复制
          let { id, exam, start_time, end_time, timetable_id, obj, subj } = copy_data
          // 处理sort排序
          obj = obj.map((item, index) => {
            item.sort = index + 1
            item.answer = typeof item.answer === 'string' ? '' : item.answer.join(',')
            return item
          })
          subj = subj.map((item, index) => {
            item.sort = index + 1
            return item
          })
          let data = {
            id,
            timetable_id,
            start_time: Date.parse(start_time) / 1000,
            end_time: Date.parse(end_time) / 1000,
            exam,
            obj,
            subj,
            editable: this.editable,
            auto_save
          }
          save_examination_release(data).then(res => {
            if (res.code === 200) {
              this.$Message.success(res.message)// 自动保存有问题.   保存之后,会自动发布.
              // this.$Message.success(auto_save ? '自动保存' : res.message)
              this.exam_release.id = res.data.release_id
              this.exam_release.exam.id = res.data.exam_id
              this.$emit('success', false)
            }
          })
        } else {
          this.$Message.error('请检查填写信息')
        }
      })
    },
    openExamBank (bank_type) { // 打开题库
      let title = bank_type === 'obj' ? '客观题题库' : '主观题题库'
      this.open('exam_bank', bank_type === 'obj' ? 1 : 2, title)
    },
    handleAdd (data) { // 从题库添加的回调
      let { bank_type, bank_list } = data
      bank_list = bank_list.map(item => {
        if (item.question_type === 1 && typeof (item.answer) !== 'object') {
          item.answer = item.answer.split(',')
        } else {
          item.score_options = [{ option_name: '分数', weight: 100 }]
        }
        item.type = item.question_type
        return item
      })
      if (bank_type === 1) { // 客观题
        this.exam_release.obj = this.exam_release.obj.concat(bank_list)
      } else { // 主观题
        this.exam_release.subj = this.exam_release.subj.concat(bank_list)
      }
    },
    addItem (type) { // 添加条目
      switch (type) {
        case 1: {
          this.exam_release.obj.push({
            sort: this.exam_release.obj.length + 1,
            content: '',
            option: '',
            answer: [],
            score: 10,
            type: 1
          })
          break
        }
        case 2: {
          this.exam_release.subj.push({
            sort: this.exam_release.subj.length + 1,
            content: '',
            option: '',
            answer: '',
            score: 10,
            type: 2,
            score_options: [
              { option_name: '分数', weight: 100 }
            ]
          })
          break
        }
      }
    },
    addScoreOption (score_options) {
      score_options.push({
        option_name: '分数', weight: 100
      })
    },
    del (type, index) {
      switch (type) {
        case 1: {
          this.exam_release.obj.splice(index, 1); break
        }
        case 2: {
          this.exam_release.subj.splice(index, 1); break
        }
      }
    },
    move (type, action, index) {
      switch (type) {
        case 1: {
          if (action === 'up') {
            if (index === 0) {
              this.$Message.warning('撞天花板了，已经不能移动了！')
              return
            }
            let pre = this.exam_release.obj[index]
            let next = this.exam_release.obj[index - 1]
            this.exam_release.obj.splice(index - 1, 2, pre, next)
          }
          if (action === 'down') {
            if (index === this.exam_release.obj.length - 1) {
              this.$Message.warning('到底了，已经不能移动了！')
              return
            }
            let pre = this.exam_release.obj[index + 1]
            let next = this.exam_release.obj[index]
            this.exam_release.obj.splice(index, 2, pre, next)
          }
          break
        }
        case 2: {
          if (action === 'up') {
            if (index === 0) {
              this.$Message.warning('撞天花板了，已经不能移动了！')
              return
            }
            let pre = this.exam_release.subj[index]
            let next = this.exam_release.subj[index - 1]
            this.exam_release.subj.splice(index - 1, 2, pre, next)
          }
          if (action === 'down') {
            if (index === this.exam_release.subj.length - 1) {
              this.$Message.warning('到底了，已经不能移动了！')
              return
            }
            let pre = this.exam_release.subj[index + 1]
            let next = this.exam_release.subj[index]
            this.exam_release.subj.splice(index, 2, pre, next)
          }
          break
        }
      }
    },
    handleDragStart (e) {
      this.drag = true
      this.editor_init = false
    },
    handleDragEnd (e) {
      let _this = this
      this.drag = true
      setTimeout(() => {
        _this.editor_init = true
      }, 200)
    }
  },
  mounted () {
    this.getInfo()
  },
  beforeDestroy () {
    // this.autoSaveStop()
  }
}
</script>
<style lang="less" scoped>
.exam-item {
  padding: 8px;
  margin: 20px;
  // cursor: move;
  &:hover {
    box-shadow: 1px 2px 3px;
    transition: all 0.3s;
  }
}

.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.score-item-container{
    display: flex;
    flex-wrap: wrap;
    .score-item{
      display:inline-block;
      margin-right: 10px;
    }
}

</style>
