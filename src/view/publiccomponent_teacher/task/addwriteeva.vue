<template>
  <Row class="max-height">
    <h3>任务内容：</h3>
    <div class="evainput" v-html="taskcontent"></div>
    <h3 style="margin-top:10px;">任务完成情况：</h3>
    <Row v-for="item in data_list" :key="item.id" style="padding:8px;">
      <h4 style="padding:5px 0;">学生完成任务情况：</h4>
      <!-- <h4 style="padding:5px 0;">ID为"{{item.student_id}}"的学生的任务完成情况：</h4> -->
      <div class="evainput" v-html="item.submit_content"  v-if="item.submit_content !== ''"></div>
      <embed :src="item.file_url" v-if="item.file_url !== null && item.file_url !== ''" type="">
      <iframe :src="item.file_url" height="0" frameborder="0" v-if="item.unimgorvideo"></iframe>
      <Button @click="item.unimgorvideo = true" v-if="!item.unimgorvideo && item.file_url !== ''" type="primary" class="addbtn">学生上传了其它文件，是否需要下载到本地预览</Button>
    </Row>
    <h3>对任务完成进行评价：</h3>
    <Input
      style="display:block;padding:8px;"
      v-model="teacherevaluation"
      type="textarea"
      :rows="4"
      placeholder="请输入评价（200字以内）"
      :clearable="true"
      :maxlength="200"
    />
    <h3>对任务完成进行评分：</h3>
    <div style="padding:8px;">
      <div class="homelist_radio" v-for="teacheritem in optionlist" :key="teacheritem.id">
      <span style="display:inline-block;width:100px;text-align:right;font-size:14px;">
       <b> {{teacheritem.option_name}}：</b>
      </span>&nbsp;
      <Input type="text" number v-model="teacheritem.opscroe" style="width:50px;" size='small'></Input>&nbsp;&nbsp;&nbsp;<Tag color="warning">只能输入1-100的整数</Tag>
    </div>
    <p style="padding:10px 0;">
      <Button @click="submit()" type="primary">提交</Button>
    </p>
    </div>
  </Row>
</template>
<script>
export default {
  props: ['writeEvaluationid', 'release_type'],
  components: {
  },
  data () {
    return {
      taskcontent: '',
      student_task_id: 0,
      teamtask: [], // xxx完成情况数据
      teacherevaluation: '', // 绑定评价输入框
      data_list: [], // 准备接收数据入口
      optionlist: [],
      senddata: {}
    }
  },
  created () {
    this.student_task_id = this.writeEvaluationid
    this.getInfo()
  },
  methods: {
    submit () {
      if (this.teacherevaluation === '') {
        this.$Message.error('请进行评价')
      } else {
        this.senddata = {}
        for (let item in this.optionlist) {
          let clone = this.optionlist[item]
          let id = clone.id
          let opscroe = clone.opscroe
          if (Number(opscroe) > 100 || Number(opscroe) < 0) {
            this.$Message.error('评分只能输入1-100的数字')
            return false
          }
          this.senddata[id] = opscroe
        }
        this.axios.request({
          method: 'post',
          url: '/index.php/Teacher/Task/score_update',
          data: {
            student_task_id: this.student_task_id,
            evaluation: this.teacherevaluation,
            scores: this.senddata
          }
        }).then(res => {
          if (res.code === 200) {
            this.$emit('writeend', false)
            this.$Message.success('评价提交成功')
          }
        })
      }
    },
    getInfo () {
      if (this.release_type === 1) {
        this.axios.request({
          method: 'post',
          url: '/index.php/Teacher/Task/score',
          data: {
            student_task_id: this.student_task_id
          }
        }).then(res => {
          if (res.code === 200) {
            let datalist = res.data.student_submit
            let teacherevadataclone = res.data.score_option
            for (let item in teacherevadataclone) {
              this.optionlist.push(
                {
                  id: teacherevadataclone[item].id,
                  option_name: teacherevadataclone[item].option_name,
                  description: teacherevadataclone[item].description,
                  weight: teacherevadataclone[item].weight,
                  opscroe: 0
                }
              )
            }
            if (res.data.score_list !== '' && res.data.score_list !== null) {
              for (let i in this.optionlist) {
                for (let item in res.data.score_list) {
                  if (this.optionlist[i].id.toString() === item.toString()) {
                    this.optionlist[i].opscroe = res.data.score_list[item].toString()
                  }
                }
              }
            }
            for (let item in datalist) {
              this.data_list.push({
                id: datalist[item].id,
                student_id: datalist[item].student_id,
                file_url: datalist[item].file_url,
                submit_content: datalist[item].submit_content,
                file_name: datalist[item].file_name,
                unimgorvideo: true
              })
            }
            for (let item in this.data_list) {
              if (this.data_list[item].file_url !== null && this.data_list[item].file_url !== '') {
                if (this.data_list[item].file_url.match(/(.zip)|(.doc)|(.docx)|(.xlxs)|(.rar)$/gi) !== null) {
                  this.data_list[item].unimgorvideo = false
                }
              }
            }
            this.teacherevaluation = res.data.evaluation
            let clonedata = this.data_list
            this.taskcontent = res.data.task_info.content
            for (let i = 0; i < clonedata.length; i++) {
              let item = clonedata[i]
              for (let i in item) {
                if (i === 'submit_content') {
                  if (item[i] !== null) {
                    this.teamtask = item[i]
                  } else {
                    this.teamtask = '暂无内容'
                  }
                  break
                }
              }
              break
            }
          }
        })
      } else if (this.release_type === 2) { // 个人
        this.axios.request({
          method: 'post',
          url: '/index.php/Teacher/Task/score',
          data: {
            student_task_id: this.student_task_id
          }
        }).then(res => {
          if (res.code === 200) {
            let datalist = res.data.student_submit
            this.teacherevaluation = res.data.evaluation
            let clonedata = this.data_list
            for (let item in datalist) {
              this.data_list.push({
                id: datalist[item].id,
                student_id: datalist[item].student_id,
                file_url: datalist[item].file_url,
                submit_content: datalist[item].submit_content,
                file_name: datalist[item].file_name,
                unimgorvideo: true
              })
            }
            for (let item in this.data_list) {
              if (this.data_list[item].file_url !== null && this.data_list[item].file_url !== '') {
                if (this.data_list[item].file_url.match(/(.zip)|(.doc)|(.docx)|(.xlxs)|(.rar)$/gi) !== null) {
                  this.data_list[item].unimgorvideo = false
                }
              }
            }
            this.taskcontent = res.data.task_info.content
            for (let i = 0; i < clonedata.length; i++) {
              let item = clonedata[i]
              if (item.id.toString() === res.data.student_task_id.toString()) {
                for (let i in item) {
                  if (i === 'submit_content') {
                    if (item[i] !== null) {
                      this.teamtask = item[i]
                    } else {
                      this.teamtask = '暂无内容'
                    }
                    break
                  }
                }
                break
              } else {
                console.log('else')
              }
            }
            let cloneop = res.data.score_option
            for (let item in cloneop) {
              this.optionlist.push({
                description: cloneop[item].description,
                id: cloneop[item].id,
                option_name: cloneop[item].option_name,
                weight: cloneop[item].weight,
                opscroe: 0
              })
            }
            if (res.data.score_list !== '' && res.data.score_list !== null) {
              for (let item in this.optionlist) {
                for (let i in res.data.score_list) {
                  if (this.optionlist[item].id.toString() === i.toString()) {
                    this.optionlist[item].opscroe = res.data.score_list[i].toString()
                  }
                }
              }
            }
          }
        })
      }
    }
  }
}
</script>
<style>
div.homelist_radio
  div.ivu-radio-group
  label.ivu-radio-wrapper.ivu-radio-group-item {
  border-radius: 50%;
  overflow: hidden;
  width: 30px;
  height: 30px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin: 10px;
}
</style>
