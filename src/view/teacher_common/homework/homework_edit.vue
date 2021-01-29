<template>
  <div class="modal-content">
    <Form :model="homework_release" :label-width="100" :rules="rules" ref="homework_release">
      <FormItem label="课件上课时间">
        <Input v-model="class_begin_time" readonly disabled style="width: 200px"></Input>
      </FormItem>
      <FormItem label="发布时间" prop="start_time">
        <DatePicker :value="homework_release.start_time"
          @on-change="(fmt_date, date) => {homework_release.start_time = fmt_date}" type="datetime" placeholder="开始时间"
          style="width: 200px"></DatePicker>
      </FormItem>
      <FormItem label="结束时间" prop="end_time">
        <DatePicker :value="homework_release.end_time"
          @on-change="(fmt_date, date) => {homework_release.end_time = fmt_date}" type="datetime" placeholder="结束时间"
          style="width: 200px"></DatePicker>
      </FormItem>
      <Divider orientation="left" v-if="!editable" size="small">该任务有其他班级使用 或者 当前班级已发布，以下信息不可编辑</Divider>
      <FormItem label="作业名称" prop="homework_name">
        <Input v-model="homework_release.homework_name" style="width: 200px;" placeholder="作业名称"
          v-if="editable"></Input>
        <p v-else>{{homework_release.homework_name}}</p>
      </FormItem>
      <FormItem label="发布方式：" prop="is_auto_release" v-if="editable">
        <RadioGroup v-model="homework_release.is_auto_release">
          <Radio :label="1">自动发布</Radio>
          <Radio :label="0">在课堂中手动发布</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="评分维度:">
        <div class="score-item-container" v-if="editable">
          <div v-for="(score_option,index1) in homework_release.option" :key="index1" class="score-item">
            <div>
              <Input v-model="score_option.option_name" style="width: 250px;" class="score-option-input" size="small"
                placeholder="维度名称">
              <Button type="default" slot="prepend" @click="homework_release.option.splice(index1,1)"
                size="small">删除</Button>
              <InputNumber placeholder="权重" slot="append" v-model="score_option.weight" size="small"></InputNumber>
              </Input>
            </div>
          </div>
          <Button size="small" type="dashed" icon="md-add" @click="addScoreOption(homework_release.option)"
            v-show="editable"></Button>
        </div>
        <div v-else>
          <span v-for="(score_option,index1) in homework_release.option" :key="index1" style="margin-right: 20px;">
            <span>{{score_option.option_name}}:</span>
            <span>{{score_option.weight}}</span>
          </span>
        </div>
      </FormItem>
      <FormItem label="作业内容" prop="content">
        <div v-if="editable">
          <Editor v-model="homework_release.homework_content" :is_init.sync="editor_init" :height="400">
          </Editor>
        </div>
        <div v-else v-html="homework_release.homework_content"></div>
      </FormItem>
    </Form>
    <Modal v-model="modal" :title="title" :width="modal_width" :footer-hide="footerHide">
      <HomeworkEvaluationEdit :id="target_id" v-if="target === 'homework_evaluation_edit'" @success="$emit('success')">
      </HomeworkEvaluationEdit>
    </Modal>
    <Spin fix v-if="loading"></Spin>
    <div class="modal-footer">
      <Button type="primary" @click="submit">保存</Button>
    </div>
  </div>
</template>
<script>
import class_begin from '@/view/mixins/class_begin'
import HomeworkEvaluationEdit from '@/view/teacher_common/homework/homework_evaluation_edit.vue'
import modal_mixin from '@/view/mixins/modal_mixin'
import { mapActions } from 'vuex'
export default {
  props: {
    homework_release_id: '',
    timetable_id: '',
    type: '',
    courseware_id: ''
  },
  components: {
    HomeworkEvaluationEdit
  },
  mixins: [class_begin, modal_mixin],
  data () {
    return {
      homework_release: {
        id: '',
        homework_name: '',
        is_auto_release: 1,
        homework_content: '',
        type: this.type,
        days: 1,
        start_time: '',
        end_time: '',
        timetable_id: this.timetable_id,
        courseware_id: this.courseware_id,
        option: []
      },
      editable: false,
      loading: false,
      editor_init: false,
      rules: {
        homework_name: [
          { required: true, message: '作业名称不能为空', trigger: 'blur' }
        ],
        is_auto_release: [
          { required: true, type: 'number', message: '发布方式不能为空', trigger: 'blur' }
        ],
        start_time: [
          { required: true, message: '作业开始时间不能为空', trigger: 'blur' }
        ],
        end_time: [
          { required: true, message: '作业结束不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    homework_release_id (n, o) {
      this.getInfo()
    },
    class_begin_time (n, o) {
      if (!this.homework_release_id && n !== 0) {
        console.log(this.class_begin_time);
        this.homework_release.start_time = this.moment(this.class_begin_time).format('YYYY-MM-DD HH:mm:ss')
        this.homework_release.end_time = this.moment(this.class_begin_time).add(2, 'days').format('YYYY-MM-DD HH:mm:ss')
      }
    }
  },
  methods: {
    getInfo () {
      console.log(this.homework_release_id);
      this.editor_init = false
      if (this.homework_release_id) { // 编辑
        this.loading = true
        this.axios.request({
          method: 'get',
          url: 'index.php/Teacher/Homework/homework_release_detail',
          params: {
            homework_release_id: this.homework_release_id
          }
        }).then(res => {
          console.log(res);
          if (res.code === 200) {
            let data = res.data.homework_release
            this.homework_release = {
              id: data.homework_id,
              homework_name: data.homework.homework_name,
              is_auto_release: data.is_auto_release,
              homework_content: data.homework.homework_content,
              type: data.homework.type,
              days: '',
              start_time: this.moment(data.start_time * 1000).format('YYYY-MM-DD HH:mm:ss'),
              end_time: this.moment(data.end_time * 1000).format('YYYY-MM-DD HH:mm:ss'),
              timetable_id: data.timetable_id,
              courseware_id: data.homework.courseware_id,
              option: data.option
            }
            this.editor_init = true
            this.editable = res.data.editable
            this.loading = false
          }
        })
      } else { // 新增

        this.homework_release = {
          id: '',
          homework_name: '',
          is_auto_release: '',
          homework_content: '',
          type: this.type,
          days: 1,
          start_time: this.moment().format('YYYY-MM-DD HH:mm:ss'),
          end_time: this.moment().format('YYYY-MM-DD HH:mm:ss'),
          timetable_id: this.timetable_id,
          courseware_id: this.courseware_id,
          option: [{ option_name: '分数', weight: 100 }]
        }
        this.editor_init = true
        this.editable = true
      }
    },
    ...mapActions([
      'sendunread',
      'resetgetInfo'
    ]),
    submit () {
      this.$refs['homework_release'].validate(valid => {
        if (valid) {
          let { id, homework_name, is_auto_release, homework_content, type, days, start_time, end_time, timetable_id, courseware_id, option } = this.homework_release
          this.axios.request({
            method: 'post',
            url: '/index.php/Teacher/Homework/add',
            params: { // FIXME:这里不应该这样传
              id
            },
            data: {
              id, homework_name, is_auto_release, homework_content, type, days, timetable_id, courseware_id, start_time: Date.parse(start_time) / 1000, end_time: Date.parse(end_time) / 1000, score_weight: option
            }
          }).then(res => {
            if (res.code === 200) {
              this.$emit('success')
              this.$Message.success(res.message)
              this.sendunread()
              this.resetgetInfo()
            }
          })
        } else {
          this.$Message.error('请检查填写内容')
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
    this.getInfo()
  }
}
</script>
