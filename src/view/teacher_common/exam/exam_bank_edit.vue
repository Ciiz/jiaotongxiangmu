<template>
  <div class="modal-content-default ">
    <Form :modal="exam_bank" :label-width="80">
      <FormItem label="类型">
        <p>{{exam_bank.question_type === 1?'客观题' :'主观题'}}</p>
      </FormItem>
      <FormItem label="内容">
            <Editor
              v-model="exam_bank.content"
              :is_init.sync="editor_init"
              :height="400"
            ></Editor>
      </FormItem>
      <FormItem label="选项" v-if="exam_bank.question_type === 1">
        <Input type="textarea" v-model="exam_bank.option" placeholder="A:费劲儿附件 B:ffiedkfj"/>
      </FormItem>
      <FormItem label="参考答案">
        <Select v-model="exam_bank.answer" v-if="exam_bank.question_type === 1" multiple transfer>
          <Option value="A">A</Option>
          <Option value="B">B</Option>
          <Option value="C">C</Option>
          <Option value="D">D</Option>
          <Option value="E">E</Option>
          <Option value="F">F</Option>
        </Select>
        <Input type="textarea" v-model="exam_bank.answer" v-else/>
      </FormItem>
      <FormItem label="分值">
        <InputNumber v-model="exam_bank.score" :min="1" :max="100"></InputNumber>
      </FormItem>
    </Form>
    <div class="modal-footer">
      <Button type="primary" @click="save">保存</Button>
    </div>
  </div>
</template>
<script>
import { get_question_bank, save_question_bank } from '@/api/data'
export default {
  props: ['exam_bank_id', 'teacher_course_id', 'bank_type'], // bank_type: subj:主观题，obj：客观题
  data () {
    return {
      exam_bank: {},
      editor_init: true
    }
  },
  watch: {
    exam_bank_id (n, o) {
      console.log(n)
      this.getInfo()
    },
    bank_type (n, o) {
      this.getInfo()
    }
  },
  methods: {
    getInfo () {
      this.editor_init = false
      if (this.exam_bank_id) {
        get_question_bank(this.exam_bank_id).then(res => {
          if (res.code === 200) {
            let { id, question_type, content, answer, score, teacher_course_id, option } = res.data.question_bank
            this.exam_bank = {
              question_type,
              content,
              answer: (question_type === 1 && answer) ? answer.split(',') : answer,
              teacher_course_id,
              score,
              id,
              option
            }
            this.editor_init = true
          }
        })
      } else {
        this.exam_bank = {
          id: '',
          question_type: this.bank_type,
          content: '',
          answer: this.bank_type === 1 ? [] : '',
          score: 10,
          option: '',
          teacher_course_id: this.teacher_course_id
        }
        this.editor_init = true
      }
    },
    save () {
      let { id, question_type, content, answer, score, teacher_course_id, option } = this.exam_bank
      answer = question_type === 1 ? answer.join(',') : answer
      save_question_bank({ id, question_type, content, answer, score, teacher_course_id, option }).then(res => {
        if (res.code === 200) {
          this.$Message.success(res.message)
          this.$emit('success')
        }
      })
    }
  },
  mounted () {
    this.getInfo()
  }
}
</script>
