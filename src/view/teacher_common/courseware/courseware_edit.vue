<template>
  <div class="modal-content">
    <Form ref="formValidate" :model="formValidate" :label-width="80">
      <!-- <FormItem label="课程名称" required>
       <div>{{formValidate.course}}</div>
      </FormItem> -->
      <FormItem label="课件名称" required>
        <Input v-model="formValidate.courseware_name" :maxlength="200" placeholder="输入课件名称" style="width:300px;" />
      </FormItem>
      <FormItem label="排序" required>
        <InputNumber :min="1" v-model="formValidate.sort" style="width:50px;" size="small"></InputNumber>
        <Tag color="warning" v-if="showtag" style="margin-left:5px;">该序号已经使用,请重新选择</Tag>
        <Tag color="warning" v-if="showcopy && isneworeditor === '复制课件'" style="margin-left:5px;">复制课件时序号不能与原课件相同,请重新选择
        </Tag>
      </FormItem>
      <FormItem label="课时数" required>
        <Input number style="width:50px;" size="small" v-model="courseware_weight"></Input>
      </FormItem>
      <FormItem label="分配权重" required>
        <div>
          课前：<Input number style="width:40px;" size="small" v-model="course_before"></Input>
          课中：<Input number style="width:40px;" size="small" v-model="course_in"></Input>
          课后：<Input number style="width:40px;" size="small" v-model="course_after"></Input>
          &nbsp;&nbsp;<Tag color="warning" v-if="course_before + course_in + course_after !== 100">权重之和需为100</Tag>
        </div>
        <div v-if="course_before + course_in + course_after === 100">
          课前：任务：<Input number style="width:40px;" size="small" v-model="before_task"></Input>&nbsp;&nbsp;测试：<Input
            number style="width:40px;" size="small" v-model="before_test"></Input>&nbsp;&nbsp;<Tag color="warning"
            v-if="before_task + before_test  !== 100">任务、测试的权重之和应为100</Tag><br>
          课中：任务：<Input number style="width:40px;" size="small" v-model="in_task"></Input>&nbsp;&nbsp;测试：<Input number
            style="width:40px;" size="small" v-model="in_test"></Input>&nbsp;&nbsp;<Tag color="warning"
            v-if="in_task + in_test  !== 100">任务、测试的权重之和应为100</Tag><br>
          课后：任务：<Input number style="width:40px;" size="small" v-model="after_task"></Input>&nbsp;&nbsp;测试：<Input number
            style="width:40px;" size="small" v-model="after_test"></Input>&nbsp;&nbsp;作业：<Input number
            style="width:40px;" size="small" v-model="after_homework"></Input>&nbsp;&nbsp;<Tag color="warning"
            v-if="after_task + after_test + after_homework !== 100">任务、测试、作业的权重之和应为100</Tag>
        </div>
      </FormItem>
      <FormItem label="课件文件">
        <p style="width:500px;line-height:23px;margin-bottom:10px;font-size:10px">
          注意：只允许上传 pdf 文件
        </p>
        <!-- <Button type="primary" v-if="!needprogress" @click="needprogress = !needprogress">上传课件文件</Button> -->
        <upload-file :needprogress='true' @upload_file_success='pdf_upload' :showlist="false" :format="['pdf']"
          btnname='上传课件文件' :maxsize='105120' :maxlength='1'
          :data_type="{type:'courseware',token:$store.state.user.token}"></upload-file>
        <embed :src="pdfsrc" v-if="ispdf" width="100%" height="300px">
      </FormItem>
      <FormItem label="课件素材">
        <upload-file @upload_file_success='material_upload' :showlist="false"
          :format="['mp4', 'pdf', 'docx', 'doc', 'xls', 'zip', 'rar', 'png', 'jpg', 'jpeg', 'pptx']" btnname='上传课件素材'
          :maxsize='307200' :maxlength='9999' :data_type="{type:'courseware.file',token:$store.state.user.token}">
        </upload-file>
        <p>仅支持mp4', 'pdf', 'docx', 'doc', 'xls', 'zip', 'rar', 'png', 'jpg', 'jpeg', 'pptx格式</p>
        <div v-if="attachment_file_name.length > 0">
          已上传的课件素材 ：
          <span v-for="(tagitem,index) in attachment_file_name" :key="index + ' tag'">
            <Tag type="dot" closable color="success" @on-close="tagclose(index)">
              <!-- <Input type="text" number style="width:90px;height:20px;top:-7px;" v-model="tagitem.page"  placeholder="素材对应页码"/> -->
              <InputNumber :min="1" v-model="tagitem.page" style="width:90px;height:33px;top:-1px;"
                placeholder="素材对应页码"></InputNumber>
              <a style="color:#989DA9;" :href="tagitem.file_url" target='_blank'>
                {{tagitem.file_name}}
              </a>
            </Tag>
          </span>
          <p>素材对应页:课件对应页码显示对应素材</p>
        </div>
      </FormItem>
      <FormItem label="课件备注" required>
        <editor ref="editor" :value="formValidate.desc" :height="200" v-model="formValidate.desc" is_init='true'>
        </editor>
      </FormItem>
    </Form>
    <div class="modal-footer">
      <Button type="primary" @click="handleSubmit">提交</Button>
    </div>
  </div>
</template>

<script>
import editor from '@/components/editor'
import uploadFile from '@/view/publiccomponent_teacher/upload/upload'
export default {
  props: ['isneworeditor', 'rowid', 'send_course_id'],
  components: {
    editor,
    uploadFile
  },
  data () {
    return {
      // 分配权重
      courseware_weight: 0,
      weight_conf: {},
      course_before: 30,
      course_in: 40,
      course_after: 30,
      before_task: 40,
      before_test: 60,
      in_task: 40,
      in_test: 60,
      after_task: 30,
      after_test: 40,
      after_homework: 30,
      // -------
      needprogress: false,
      showtag: false,
      showcopy: false,
      sort_list: [],
      attachment_file_name: [],
      teacher_course_id: 0,
      isshowalert: false,
      ispdf: false,
      imgsrc: '',
      pdfsrc: '',
      defaultList: [],
      imgName: '',
      visible: true,
      formValidate: {
        select_list: [],
        course_name: '',
        courseware_name: '',
        img: '',
        desc: '',
        sort: 1,
        thissort: 1,
        course: ''
      }
    }
  },
  created () {
    this.getInfo(this.send_course_id)
  },
  watch: {
    sortvalue (newvalue) {
      if (this.sort_list.indexOf(newvalue) !== -1) {
        this.showtag = true
        this.showcopy = false
      } else {
        this.showtag = false
      }
      if (Number(this.formValidate.thissort) === Number(newvalue)) {
        this.showcopy = true
        this.showtag = false
      } else {
        this.showcopy = false
      }
    }
  },
  computed: {
    sortvalue () {
      return this.formValidate.sort
    }
  },
  methods: {
    pdf_upload (res) {
      if (res.code === 200) {
        this.ispdf = true
        this.pdfsrc = res.data.url
      }
    },
    material_upload (res) {
      if (res.code === 200) {
        this.attachment_file_name.push({
          file_name: res.data.upload_name,
          page: '',
          file_url: res.data.url
        })
      }
    },
    tagclose (index) {
      this.attachment_file_name.splice(index, 1)
    },
    handleSubmit () {
      let num = this.course_before + this.course_in + this.course_after
      let num_before = this.before_task + this.before_test
      let num_in = this.in_task + this.in_test
      let num_after = this.after_task + this.after_test + this.after_homework
      this.weight_conf = {}
      if (this.formValidate.courseware_name === '') {
        this.$Message.error('请输入课件名称')
        return false
      } else if (this.courseware_weight > 100 || this.courseware_weight < 1) {
        this.$Message.error('课时数不能小于1')
        return false
      } else if (num !== 100) {
        this.$Message.error('课前课中课后权重之和需为100,当前权重之和为' + num)
        return false
      } else if (num_before !== 100) {
        this.$Message.error('课前任务和测试的权重之和应为100,当前权重之和为' + num_before)
        return false
      } else if (num_in !== 100) {
        this.$Message.error('课中任务和测试的权重之和应为100,当前权重之和为' + num_in)
        return false
      } else if (num_after !== 100) {
        this.$Message.error('课后任务、测试、作业的权重之和应为100,当前权重之和为' + num_after)
        return false
      } else if (this.isneworeditor === '新增课件') {
        this.weight_conf['coruseware_weight'] = {
          befor: this.course_before,
          in: this.course_in,
          after: this.course_after
        }
        this.weight_conf['coruseware_obj_type'] = {
          befor: {
            task: this.before_task,
            exam: this.before_test,
            work: 0
          },
          in: {
            task: this.in_task,
            exam: this.in_test,
            work: 0
          },
          after: {
            task: this.after_task,
            exam: this.after_test,
            work: this.after_homework
          }
        }
        this.axios.request({
          method: 'post',
          url: '/index.php/Teacher/Courseware/add',
          data: {
            teacher_course_id: this.send_course_id,
            courseware_name: this.formValidate.courseware_name,
            file_url: this.pdfsrc,
            courseware_file: this.attachment_file_name,
            description: this.formValidate.desc,
            sort: this.formValidate.sort,
            weight_conf: this.weight_conf,
            weight: this.courseware_weight
          }
        }).then(res => {
          if (res.code === 200) {
            this.$Message.success(res.message)
            this.$emit('success', false)
          }
        })
      } else if (this.isneworeditor === '编辑课件') {
        this.weight_conf['coruseware_weight'] = {
          befor: this.course_before,
          in: this.course_in,
          after: this.course_after
        }
        this.weight_conf['coruseware_obj_type'] = {
          befor: {
            task: this.before_task,
            exam: this.before_test,
            work: 0
          },
          in: {
            task: this.in_task,
            exam: this.in_test,
            work: 0
          },
          after: {
            task: this.after_task,
            exam: this.after_test,
            work: this.after_homework
          }
        }
        this.axios.request({
          method: 'post',
          url: '/index.php/Teacher/Courseware/add',
          params: {
            id: this.rowid
          },
          data: {
            teacher_course_id: this.formValidate.course_name,
            courseware_name: this.formValidate.courseware_name,
            img: this.formValidate.img,
            file_url: this.pdfsrc,
            courseware_file: this.attachment_file_name,
            description: this.formValidate.desc,
            sort: this.formValidate.sort,
            weight_conf: this.weight_conf,
            weight: this.courseware_weight
          }
        }).then(res => {
          if (res.code === 200) {
            this.$Message.success(res.message)
            this.$emit('success', false)
          }
        })
      }
    },
    getInfo (teacher_course_id) {
      if (this.isneworeditor === '新增课件') {
        this.axios.request({
          method: 'post',
          url: '/index.php/Teacher/Courseware/info',
          params: {
            teacher_course_id,
            action_type: 1
          }
        }).then(res => {
          if (res.code === 200) {
            if (res.data.sort_list === null) {
              this.formValidate.sort = 1
            } else {
              this.sort_list = res.data.sort_list
            }
            for (let item in this.sort_list) {
              for (let i = 1; i < 99999; i++) {
                if (Number(i) === Number(this.sort_list[item]) && i !== 0) {
                  this.formValidate.sort = i + 1
                  break
                }
              }
            }
            this.formValidate.course = res.data.teacher_course_name
            let datalist = res.data.teacher_course_list
            for (let item in datalist) {
              if (Number(item) === Number(teacher_course_id)) {
                this.formValidate.course = datalist[item]
                break
              }
            }
          }
        })
      } else if (this.isneworeditor === '编辑课件') {
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
            this.courseware_weight = res.data.courseware_info.weight
            this.formValidate.sort = res.data.courseware_info.sort
            this.formValidate.course = res.data.teacher_course_name
            this.formValidate.thissort = res.data.courseware_info.sort
            this.formValidate.img = this.imgsrc = res.data.courseware_info.img
            this.formValidate.courseware_name = res.data.courseware_info.courseware_name
            this.teacher_course_id = res.data.courseware_info.teacher_course_id
            this.formValidate.desc = res.data.courseware_info.description
            this.formValidate.select_list = []
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
            this.after_homework = weight_conf.coruseware_obj_type.after.work.weight
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
              this.attachment_file_name = res.data.courseware_info.courseware_file
            }
          }
        })
      }
    }
  }
}
</script>
