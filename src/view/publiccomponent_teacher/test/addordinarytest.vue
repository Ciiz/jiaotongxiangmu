<template>
  <Form ref="formValidate" :model="formValidate" :label-width="100" class="max-height">
    <FormItem label="试卷标题" required>
      {{receivedata.data.exam_info.exam_name}}
    </FormItem>
    <FormItem label="考试时间"  required>
      <Input v-model="formValidate.number" placeholder="请输入数字"  number style="width:80px;"/> 分钟
    </FormItem>
    <FormItem>
        <Tabs :animated="false" size="small" name="addtest1" class="teacher">
        <TabPane label="主观题" tab="addtest1">
            <FormItem label="试题总数" required  v-if="!isInfo ">
                <div v-if="formValidate.subjectivecontent.length === 0">
                  <Input v-model="formValidate.total1" placeholder="请输入数字"  number style="width:80px;"/> 题
                  <Tag color="warning">请先输入要创建的试题总数，再编辑试题</Tag>
                </div>
                <div v-else> {{formValidate.subjectivecontent.length}}
                  <div style="margin-left:30px;">
                    <p>添加：<Button type="primary" size="small" ghost @click="formValidate.subjectivecontent.push({subjectivecontent: '',sort: formValidate.subjectivecontent.length + 1,total: 0})">增加一题</Button></p>
                    <p>删除：<Button type="error" size="small" ghost @click="sub_remove">删除</Button>&nbsp;&nbsp;&nbsp;第<InputNumber :max="formValidate.subjectivecontent.length" size="small" :min="1" v-model="sub_remove_test"></InputNumber>题</p>
                  </div>
                </div>
            </FormItem>
            <div style="padding:8px;" v-for="subitem in formValidate.subjectivecontent" :key="subitem.sort + 'sub'">
              <Tag color="primary">主观题{{subitem.sort}}</Tag>
              <FormItem label="主观题分值" required><br>
                  <Input v-model="subitem.total" placeholder="请输入数字"  number style="width:100px;"/>
              </FormItem>
              <FormItem label="主观题内容" required><br>
                  <editor v-model="subitem.subjectivecontent" :value="subitem.subjectivecontent" is_init='true'></editor>
              </FormItem>
            </div>
        </TabPane>
        <TabPane label="客观题" tab="addtest1">
          <FormItem label="试题总数" required  v-if="!isInfo">
            <div v-if="formValidate.objectivecontent.length === 0">
                  <Input v-model="formValidate.total2" placeholder="请输入数字"  number style="width:80px;"/> 题
                  <Tag color="warning">请先输入要创建的试题总数，再编辑试题</Tag>
                </div>
                <div v-else> {{formValidate.objectivecontent.length}}
                  <div style="margin-left:30px;">
                    <p>添加：<Button type="primary" size="small" ghost @click="formValidate.objectivecontent.push({objectivecontent: '',sort: formValidate.objectivecontent.length + 1,total: 0,optioncontent:'',answer:[]})">增加一题</Button></p>
                    <p>删除：<Button type="error" size="small" ghost @click="obj_remove">删除</Button>&nbsp;&nbsp;&nbsp;第<InputNumber :max="formValidate.objectivecontent.length" size="small" :min="1" v-model="obj_remove_test"></InputNumber>题</p>
                  </div>
                </div>
            </FormItem>
            <div v-for="objitem in formValidate.objectivecontent" :key="objitem.sort + 'obj'">
               <Tag color="primary">客观题{{objitem.sort}}</Tag>
                <FormItem label="客观题内容" required><br>
                  <editor v-model="objitem.objectivecontent" :value="objitem.objectivecontent" is_init='true'></editor>
                  <Tag color="warning"  style="height:auto;">
                      示例:<br>
                            选择题：1.There's coffee an Coke; you can have _____ ?<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            A.  either&nbsp;&nbsp;&nbsp;&nbsp;B.  each&nbsp;&nbsp;&nbsp;&nbsp;C.  one&nbsp;&nbsp;&nbsp;&nbsp;D.  it<br>
                            判断题：2.America is an European country?<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            A.  yes&nbsp;&nbsp;&nbsp;&nbsp;B.  no
                  </Tag>
                </FormItem>
                <FormItem label="客观题选项" required style="padding-top:10px;">
                     <Input type="text" style="width:500px;" placeholder="请输入选项" v-model="objitem.optioncontent"></Input>
                </FormItem>
                <FormItem label="客观题分值" required style="padding-top:10px;">
                    <Input v-model="objitem.total" placeholder="请输入分值" number type="text"  style="width:100px;height:auto;" />
                </FormItem>
                <FormItem label="客观题答案" required style="padding-top:10px;">
                    <Select v-model="objitem.answer" multiple style="width:250px" placement="top-start">
                        <Option value="A" label="A">A</Option>
                        <Option value="B" label="B">B</Option>
                        <Option value="C" label="C">C</Option>
                        <Option value="D" label="D">D</Option>
                        <Option value="E" label="E">E</Option>
                        <Option value="F" label="F">F</Option>
                    </Select>
                </FormItem>
            </div>
        </TabPane>
    </Tabs>
    </FormItem>
    <FormItem  v-if="!isInfo">
      <Button type="primary" @click="submit">提交</Button>
      <!-- <Button @click="handleReset()" style="margin-left: 8px">重置</Button> -->
    </FormItem>
  </Form>
</template>
<script>
import editor from '@/components/editor'
export default {
  name: 'ordinarytest',
  props: ['clone_update_info', 'rowid', 'isInfo'],
  components: {
    editor
  },
  data () {
    return {
      options3: {
        disabledDate (date) {
          return date && date.valueOf() < Date.now() - 86400000
        }
      },
      sub_remove_test: 1,
      obj_remove_test: 1,
      isshowsubmit: false,
      exam_time: '',
      start_time: '',
      end_time: '',
      objective_content: [],
      objective_option: [],
      objective_answer: [],
      objective_score: [],
      subjective_content: [],
      subjective_score: [],
      receivedata: {},
      startTime: '',
      start_Time: '',
      endTime: '',
      end_Time: '',
      formValidate: {
        total1: 0,
        total2: 0,
        subjectivecontent: [],
        subjectivetotal: 0,
        objectivecontent: [],
        objectivetotal: 0,
        name: '',
        video: '',
        date: '',
        desc: '',
        value: 0,
        number: 0
      }
    }
  },
  watch: {
    subvalue (newvalue) {
      this.formValidate.subjectivecontent.splice(0, this.formValidate.subjectivecontent.length)
      for (let i = 0; i < newvalue; i++) {
        this.formValidate.subjectivecontent.push(
          {
            subjectivecontent: '',
            sort: i + 1,
            total: 0
          }
        )
      }
    },
    objvalue (newvalue) {
      this.formValidate.objectivecontent.splice(0, this.formValidate.objectivecontent.length)
      for (let i = 0; i < newvalue; i++) {
        this.formValidate.objectivecontent.push(
          {
            objectivecontent: '',
            sort: i + 1,
            total: 0,
            optioncontent: '',
            answer: []
          }
        )
      }
    }
  },
  computed: {
    subvalue () {
      return this.formValidate.total1
    },
    objvalue () {
      return this.formValidate.total2
    }
  },
  created () {
    this.receivedata = this.clone_update_info
    this.formValidate.number = this.receivedata.data.exam_info.exam_time
    if (this.receivedata.data.exam_detail['1']) {
      let obj = this.receivedata.data.exam_detail['1']
      this.formValidate.total2 = Object.keys(obj).length
      this.$nextTick(function () {
        for (let item in obj) {
          this.formValidate.objectivecontent[item - 1].objectivecontent = obj[item].content
          this.formValidate.objectivecontent[item - 1].total = obj[item].score
          this.formValidate.objectivecontent[item - 1].answer = obj[item].answer.split('')
          this.formValidate.objectivecontent[item - 1].optioncontent = obj[item].option
        }
      })
    }
    if (this.receivedata.data.exam_detail['2']) {
      let sub = this.receivedata.data.exam_detail['2']
      this.formValidate.total1 = Object.keys(sub).length
      this.$nextTick(function () {
        for (let i in sub) {
          this.formValidate.subjectivecontent[i - 1].subjectivecontent = sub[i].content
          this.formValidate.subjectivecontent[i - 1].total = sub[i].score
        }
      })
    }
  },
  methods: {
    obj_remove () {
      if (parseInt(this.obj_remove_test) === this.obj_remove_test) { // 判断删除的题号是否为整数
        this.formValidate.objectivecontent.splice(this.obj_remove_test - 1, 1)
        this.obj_remove_test = 1
        let sort = 1
        let objectivecontent = this.formValidate.objectivecontent
        for (let i in objectivecontent) {
        // 确保删除完之后题目排序正常
          objectivecontent[i].sort = sort
          sort++
        }
      } else {
        this.$Message.error('请输入整数')
      }
    },
    sub_remove () {
      if (parseInt(this.sub_remove_test) === this.sub_remove_test) { // 判断删除的题号是否为整数
        this.formValidate.subjectivecontent.splice(this.sub_remove_test - 1, 1)
        this.sub_remove_test = 1
        let sort = 1
        let subjectivecontent = this.formValidate.subjectivecontent
        for (let i in subjectivecontent) {
        // 确保删除完之后题目排序正常
          subjectivecontent[i].sort = sort
          sort++
        }
      } else {
        this.$Message.error('请输入整数')
      }
    },
    objdelete (listname) {
      list = JSON.parse(JSON.stringify(this.formValidate.objectivecontent))
      for (let item in list) {
        let id = list[item].sort
        list[item][id] = objcontent[item][listname]
        this.$delete(list[item], 'sort')
        this.$delete(list[item], 'total')
        this.$delete(list[item], 'optioncontent')
        this.$delete(list[item], 'optiontotal')
        this.$delete(list[item], 'answer')
        this.$delete(list[item], 'objanswerlist')
        this.$delete(list[item], 'objectivecontent')
      }
      return list
    },
    submit () {
      let objcontent = JSON.parse(JSON.stringify(this.formValidate.objectivecontent))
      let objcontentto = []
      for (let item in objcontent) {
        objcontentto.push(objcontent[item].objectivecontent)
      }
      let objanswer = JSON.parse(JSON.stringify(this.formValidate.objectivecontent))
      let objanswerto = []
      for (let item in objanswer) {
        let answer = objanswer[item].answer.join('')
        objanswerto.push(answer)
      }
      let objtotal = JSON.parse(JSON.stringify(this.formValidate.objectivecontent))
      let objtotalto = []
      for (let item in objtotal) {
        objtotalto.push(objtotal[item].total)
      }
      let objoption = JSON.parse(JSON.stringify(this.formValidate.objectivecontent))
      let objoptionto = []
      for (let item in objoption) {
        objoptionto.push(objoption[item].optioncontent)
      }
      let subcontent = JSON.parse(JSON.stringify(this.formValidate.subjectivecontent))
      let subcontentto = []
      for (let item in subcontent) {
        subcontentto.push(subcontent[item].subjectivecontent)
      }
      let subscore = JSON.parse(JSON.stringify(this.formValidate.subjectivecontent))
      let subscoreto = []
      for (let item in subscore) {
        subscoreto.push(subscore[item].total)
      }
      if (this.formValidate.number === null || Number(this.formValidate.number) === 0) {
        this.$Message.error('请输入考试时长且考试时长需大于0')
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
            objective_content: objcontentto,
            objective_option: objoptionto,
            objective_answer: objanswerto,
            objective_score: objtotalto,
            subjective_content: subcontentto,
            subjective_score: subscoreto
          }
        }).then(res => {
          if (res.code === 200) {
            this.$Message.success(res.message)
            this.$emit('closeord', false)
          }
        })
      }
    },
    handleReset () {
    }
  }
}
</script>
<style>

</style>
