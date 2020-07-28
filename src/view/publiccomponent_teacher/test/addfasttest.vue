<template>
  <Form ref="formValidate" :model="formValidate" :label-width="100" class="max-height" >
    <FormItem label="试卷标题" required>
      {{receivedata.data.exam_info.exam_name}}
    </FormItem>
    <FormItem label="考试时间"  required>
      {{formValidate.number}} 分钟
      <!-- <Input v-model="formValidate.number" placeholder="请输入数字"  number style="width:80px;"/> 分钟 -->
    </FormItem>
    <FormItem>
        <Tabs :animated="false" size="small" name="addtest1" class="teacher">
        <TabPane label="主观题" tab="addtest1">
            <subqusbank :tid="tid" @sendsubdata='sendsubdata' :rowid="rowid" :receivedata='receivedata' :banklist='banklist' isinfo='true'></subqusbank>
        </TabPane>
        <TabPane label="客观题" tab="addtest1">
          <qusbank :tid="tid" @sendobjdata='sendobjdata' :rowid="rowid" :receivedata='receivedata' :banklist='banklist' isinfo='true'></qusbank>
        </TabPane>
    </Tabs>
    </FormItem>
    <!-- <FormItem v-if="!isInfo">
      <Button type="primary" @click="submit">提交</Button>
    </FormItem> -->
  </Form>
</template>
<script>
import editor from '@/components/editor'
import qusbank from '@/view/publiccomponent_teacher/test/addqusbank.vue'
import subqusbank from '@/view/publiccomponent_teacher/test/addsubqusbank.vue'
export default {
  props: ['clone_update_info', 'rowid', 'isInfo'],
  components: {
    editor,
    qusbank,
    subqusbank
  },
  data () {
    return {
      banklist: {},
      tid: 0,
      getsubdata: [],
      getobjdata: [],
      receivedata: {},
      formValidate: {
        number: 0
      }
    }
  },
  created () {
    this.receivedata = this.clone_update_info
    this.tid = this.clone_update_info.data.teacher_course_id
    this.formValidate.number = this.receivedata.data.exam_info.exam_time
    this.getbanklist(this.clone_update_info.data.teacher_course_id)
  },
  methods: {
    getbanklist (tcid) {
      this.axios.request({
        method: 'post',
        url: '/index.php/Teacher/QuestionBank/index',
        params: {
          tcid
        }
      }).then(res => {
        if (res.code === 200) {
          this.banklist = res
        }
      })
    },
    sendobjdata (val) {
      this.getobjdata = val
    },
    sendsubdata (val) {
      this.getsubdata = val
    },
    submit () {
      let sendsub = []
      for (let item in this.getsubdata) {
        sendsub.push(this.getsubdata[item].id)
      }
      let sendobj = []
      for (let item in this.getobjdata) {
        sendobj.push(this.getobjdata[item].id)
      }

      if (this.formValidate.number === null || Number(this.formValidate.number) === 0) {
        this.$Message.error('请输入考试时长且考试时长需大于0')
        return false
      } else if (sendsub.length === 0) {
        this.$Message.error('暂未添加主观题')
        return false
      } else if (sendobj.length === 0) {
        this.$Message.error('暂未添加客观题')
        return false
      } else {
        this.axios.request({
          method: 'post',
          url: '/index.php/Teacher/Examination/update',
          params: {
            id: this.rowid
          },
          data: {
            exam_time: this.formValidate.number,
            // start_time: this.startTime,
            // end_time: this.endTime,
            objective_question: sendobj,
            subjective_question: sendsub
          }
        }).then(res => {
          if (res.code === 200) {
            this.$Message.success(res.message)
            this.$emit('closefast', false)
          }
        })
      }
    }
  }
}
</script>
<style>

</style>
