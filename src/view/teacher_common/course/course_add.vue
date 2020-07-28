<template>
  <div class="modal-content">
    <Form :model="formdatalist" :label-width="80" >
      <FormItem label="课程封面" required style="width:300px;">
        <ImageUpload :name="'file'" v-model="formdatalist.img" :extra="{ type:'icon',token:$store.state.user.token }"></ImageUpload>
      </FormItem>
      <FormItem label="课程名称" required>
        <Input type="text" placeholder="请输入课程名称" style="width:200px" :maxlength="200" v-model="formdatalist.username"/>
      </FormItem>
      <FormItem label="课程类型" required>
        <Select v-model="model1" style="width:200px" placeholder="请选择课程" class="teacherSelect">
          <Option
            v-for="item in formdatalist.coursetype"
            :value="item.value"
            :key="item.value"
          >{{item.label}}</Option>
        </Select>
      </FormItem>
      <FormItem label="所属专业" required>
        <Select v-model="model2" style="width:200px" placeholder="请选择专业" class="teacherSelect">
          <Option
            v-for="item in formdatalist.major"
            :value="item.value"
            :key="item.value"
          >{{item.label}}</Option>
        </Select>
      </FormItem>
      <FormItem label="分类标签" required>
        <RadioGroup
          v-model="formdatalist.radiobutton"
          type="button"
          size="small"
          v-for="item in formdatalist.radiobuttonlist"
          :key="item"
        >
          <Radio :label="item">{{item}}</Radio>
        </RadioGroup><br>
        <Tag v-for=" (itemchoose,index) in formdatalist.chooselist" :key="itemchoose[index]"
        closable @on-close="handleClose2(index)" :fade="false">{{itemchoose}}</Tag>
      </FormItem>
      <FormItem label="课程描述" required>
        <editor ref="editor" :value="formdatalist.description" v-model="formdatalist.description" is_init='true'></editor>
      </FormItem>
      <FormItem v-if="audit_status !== 1">
        <Button type="primary" @click="submit">提交</Button>
        <Button @click="reset">重置</Button>
      </FormItem>
    </Form>
      <div class="modal-footer" v-if="audit_status === 1 || audit_status === 0">
          <Button type="primary" @click="submit">提交</Button>
          <Button @click="reset">重置</Button>
      </div>
  </div>
</template>
<script>
import editor from '@/components/editor'
export default {
  props: ['course_id'],
  components: {
    editor
  },
  data () {
    return {
      audit_status: 0,
      imgsrc: '',
      model1: '',
      model2: '',
      formdatalist: {
        img: '',
        learn_price: 0,
        username: '',
        coursetype: [
          {
            value: '1',
            label: '普通课程'
          },
          {
            value: '2',
            label: '全景课程'
          }
        ],
        major: [],
        radiobutton: '',
        radiobuttonlist: [],
        description: '',
        chooselist: []
      }
    }
  },
  watch: {
    tabvalue (value) {
      if (this.formdatalist.chooselist.indexOf(value) === -1) {
        this.formdatalist.chooselist.push(value)
      }
    }
  },
  computed: {
    tabvalue () {
      return this.formdatalist.radiobutton
    }
  },
  created () {
    this.getInfo()
  },
  methods: {
    handleClose2 (index) {
      this.formdatalist.chooselist.splice(index, 1)
    },
    imgsuccess (res) {
      if (res.code === 200) {
        this.formdatalist.img = res.data.url
        this.imgsrc = res.data.url
      }
    },
    submit () {
      if (this.course_id === 'add') {
        if (this.formdatalist.img === '') {
          this.$Message.error('请上传课程封面文件')
        } else if (this.formdatalist.username === '') {
          this.$Message.error('请输入课程名称')
        } else if (this.formdatalist.username.length < 2) {
          this.$Message.error('课程名称最少输入两个字')
        } else if (this.model1 === '') {
          this.$Message.error('请选择课程')
        } else if (this.model2 === '') {
          this.$Message.error('请选择专业')
        } else if (this.formdatalist.learn_price === '') {
          this.$Message.error('请输入学习费用')
        } else if (this.formdatalist.chooselist.length === 0) {
          this.$Message.error('请选择分类标签')
        } else if (this.formdatalist.description === '') {
          this.$Message.error('请输入课程描述')
        } else {
          let course_label = this.formdatalist.chooselist.join('、')
          this.axios.request({
            method: 'post',
            url: '/index.php/Teacher/Course/add',
            data: {
              course_name: this.formdatalist.username,
              img: this.formdatalist.img,
              description: this.formdatalist.description,
              course_type: this.model1,
              course_label,
              major: this.model2,
              learn_price: this.formdatalist.learn_price.toString()
            }
          }).then(res => {
            if (res.code === 200) {
              this.$Message.success(res.message)
              this.$emit('closeadd', false)
              this.$emit('success', false)
            } else if (res.code === 500) {
              this.$Message.error('错误:' + res.code + res.message)
            }
          })
        }
      } else {
        if (this.imgsrc === '') {
          this.$Message.error('请上传课程封面文件')
        } else if (this.formdatalist.username === '') {
          this.$Message.error('请输入课程名称')
        } else if (this.model1 === '') {
          this.$Message.error('请选择课程')
        } else if (this.model2 === '') {
          this.$Message.error('请选择专业')
        } else if (this.formdatalist.learn_price === '') {
          this.$Message.error('请输入学习费用')
        } else if (this.formdatalist.chooselist.length === 0) {
          this.$Message.error('请选择分类标签')
        } else if (this.formdatalist.description === '') {
          this.$Message.error('请输入课程描述')
        } else {
          let course_label = this.formdatalist.chooselist.join('、')
          this.axios.request({
            method: 'post',
            url: '/index.php/Teacher/Course/add',
            params: {
              id: this.course_id
            },
            data: {
              course_name: this.formdatalist.username,
              img: this.formdatalist.img,
              description: this.formdatalist.description,
              course_type: this.model1,
              course_label,
              major: this.model2,
              learn_price: this.formdatalist.learn_price.toString()
            }
          }).then(res => {
            if (res.code === 200) {
              this.$Message.success(res.message)
              this.$emit('closeadd', false)
              this.$emit('success')
            }
          })
        }
      }
    },
    reset () {
      this.imgsrc = ''
      this.model1 = ''
      this.model2 = ''
      this.formdatalist.description = ''
      this.formdatalist.learn_price = 0
      this.formdatalist.username = ''
    },
    getInfo () {
      if (this.course_id === 'add') {
        this.axios.request({
          method: 'get',
          url: '/index.php/Teacher/Course/info',
          params: {
            action_type: 1
          }
        }).then(res => {
          if (res.code === 200) {
            let label_list = res.data.label_list
            for (let item in label_list) {
              this.formdatalist.radiobuttonlist.push(label_list[item].name)
            }
            let major_list = res.data.major_list
            for (let item in major_list) {
              this.formdatalist.major.push({ value: major_list[item].major_id, label: major_list[item].major_name })
            }
          }
        })
      } else {
        this.axios.request({
          method: 'get',
          url: '/index.php/Teacher/Course/info',
          params: {
            id: this.course_id,
            action_type: 2
          }
        }).then(res => {
          this.audit_status = res.data.course_info.audit_status
          let label_list = res.data.label_list
          for (let item in label_list) {
            this.formdatalist.radiobuttonlist.push(label_list[item].name)
          }
          let choose = res.data.course_info.course_label
          if (choose.indexOf('、') !== -1) {
            this.chooselist = []
            this.formdatalist.chooselist = choose.split('、')
          } else {
            this.chooselist = []
            this.formdatalist.chooselist.push(choose)
          }
          this.imgsrc = res.data.course_info.img
          this.formdatalist.img = res.data.course_info.img
          this.formdatalist.username = res.data.course_info.course_name
          this.formdatalist.description = res.data.course_info.description
          this.formdatalist.learn_price = res.data.course_info.learn_price
          this.model1 = res.data.course_info.course_type.toString()
          this.model2 = res.data.major_id
          let major_list = res.data.major_list
          for (let item in major_list) {
            this.formdatalist.major.push({ value: major_list[item].major_id, label: major_list[item].major_name })
          }
        })
      }
    }
  }
}
</script>
<style>

</style>
