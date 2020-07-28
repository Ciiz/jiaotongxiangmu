<template>
  <div class="modal-content" style="font-size:14px">
    <Row>
      <Col :span="11" :offset="1">
        <div style="margin-bottom:20px">
          <span class="black-c" style="font-weight:bold">课件名称：</span>
          <sapn class="gray-c">{{formValidate.courseware_name}}</sapn>
        </div>
        <div style="margin-bottom:20px">
          <span class="black-c" style="font-weight:bold">课时数：</span>
          <sapn class="gray-c">{{formValidate.sort}}</sapn>
        </div>
        <Row style="margin-bottom:20px">
          <Col :span="4"><span class="black-c" style="font-weight:bold">课业权重：</span></Col>
          <Col :span="20">
          <span class="gray-c">（100分制）</span></br>
          <div><Tag color="primary">课前：{{course_before}}</Tag> => <Tag color="blue">任务：{{before_task}}</Tag><Tag color="blue">测试：{{before_test}}</Tag></div>
          <div><Tag color="primary">课中：{{course_in}}</Tag> => <Tag color="blue">任务：{{in_task}}</Tag><Tag color="blue">测试：{{in_test}}</Tag></div>
          <div><Tag color="primary">课后：{{course_after}}</Tag> => <Tag color="blue">任务：{{after_task}}</Tag><Tag color="blue">测试：{{after_test}}</Tag><Tag color="blue">作业：{{after_test}}</Tag></div>
          </Col>
        </Row>
        <Row style="margin-bottom:20px">
          <Col :span="4"><span class="black-c" style="font-weight:bold">课件素材：</span></Col>
          <Col :span="20">
            <div v-if="attachment_file_name.length > 0">
              <span  v-for="(tagitem,index) in attachment_file_name" :key="index + ' tag'">
                  <Tag type="dot" color="success">
                    <a style="color:#989DA9;" :href="attachment_file_url[index]" target='_blank' >
                        {{tagitem}}
                    </a>
                  </Tag>
              </span>
            </div>
            <div v-else>暂无素材</div>
          </Col>
        </Row>
        <Row style="margin-bottom:20px">
          <Col :span="4"><span class="black-c" style="font-weight:bold">课件描述：</span></Col>
          <Col :span="20">
            <div v-html="formValidate.desc"></div>
          </Col>
        </Row>
      </Col>
      <Col :span="12">
        <div><span class="black-c" style="font-weight:bold">课件文件：</span></div>
        <embed :src="pdfsrc" v-if="ispdf" width="100%" height="480px"/>
      </Col>
    </Row>
  </div>
</template>

<script>
export default {
  props: ['isneworeditor', 'rowid', 'send_course_id'],
  data () {
    return {
      // 分配权重
      weight_conf: {},
      course_before: 0,
      course_in: 0,
      course_after: 0,
      before_task: 0,
      before_test: 0,
      in_task: 0,
      in_test: 0,
      after_task: 0,
      after_test: 0,
      after_homework: 0,
      // -------
      sort_list: [],
      attachment_file_name: [],
      attachment_file_url: [],
      teacher_course_id: 0,
      isshowalert: false,
      ispdf: false,
      pdfsrc: '',
      formValidate: {
        course_name: '',
        courseware_name: '',
        img: '',
        desc: '',
        sort: 1,
        course: ''
      }
    }
  },
  created () {
    this.getInfo(this.send_course_id)
  },
  methods: {
    getInfo (teacher_course_id) {
      this.axios.request({
        method: 'post',
        url: '/index.php/Teacher/Courseware/info',
        params: {
          id: this.rowid,
          teacher_course_id,
          action_type: 2
        }
      }).then(res => {
        if (res.code === 200) {
          if (res.data.sort_list === null) {
            this.formValidate.sort = 1
          } else {
            this.sort_list = res.data.sort_list
          }
          this.formValidate.sort = res.data.courseware_info.sort
          this.formValidate.courseware_name = res.data.courseware_info.courseware_name
          this.teacher_course_id = res.data.courseware_info.teacher_course_id
          this.formValidate.desc = res.data.courseware_info.description.replace(/<.*?>/ig, '').replace(/&nbsp;/ig, '')
          let weight_conf = res.data.weight_conf
          this.course_before = weight_conf.coruseware_weight.befor
          this.course_in = weight_conf.coruseware_weight.in
          this.course_after = weight_conf.coruseware_weight.after
          this.before_task = weight_conf.coruseware_obj_type.befor.task.weight
          this.before_test = weight_conf.coruseware_obj_type.befor.exam.weight
          this.in_task = weight_conf.coruseware_obj_type.in.task.weight
          this.in_test = weight_conf.coruseware_obj_type.in.exam.weight
          this.after_task = weight_conf.coruseware_obj_type.after.task.weight
          this.after_test = weight_conf.coruseware_obj_type.after.exam.weight
          let datalist = res.data.teacher_course_list
          for (let item in datalist) {
            if (Number(item) === Number(teacher_course_id)) {
              this.formValidate.course = datalist[item]
              break
            }
          }
          this.formValidate.course_name = res.data.courseware_info.teacher_course_id.toString()
          if (res.data.courseware_info.file_url !== 'null') {
            this.pdfsrc = res.data.courseware_info.file_url
            this.ispdf = true
          }
          if (res.data.courseware_info.courseware_file) {
            let attachment = res.data.courseware_info.courseware_file
            for (let item in attachment) {
              this.attachment_file_name.push(attachment[item].file_name)
              this.attachment_file_url.push(attachment[item].file_url)
            }
          }
        }
      })
    }
  }
}
</script>
<style scoped>
  .modal-content .ivu-row{
    margin: 20px 0;
  }
</style>
