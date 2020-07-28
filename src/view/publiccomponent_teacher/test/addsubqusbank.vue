<template>
  <div>
    <Row>
      <Tabs :animated="false" size="small" name="add2" class="centerTab">
        <TabPane label="题库" tab="add2">
          <Col :span="12" style="padding:8px;">
            <div
              v-for="(getitem, index) in this.question_list"
              :key="getitem.id + 'getitem'"
              class="boxstyle"
            >
              <p  class="text-nowrap" style="width:80%;">试题内容: {{getitem.content}}</p>
              <Button  type="primary" size="small" style="position:absolute;right:20px;top:30%;" @click="join(index)" v-if="!isinfo"
              >加入</Button>
            </div>
          </Col>
          <Col :span="12" style="padding:8px;">
            <div
              v-for="(senditem,index) in this.sendlist"
              :key="senditem.id + 'senditem'"
              class="boxstyle"
            >
              <p  class="text-nowrap" style="width:80%;">试题内容: {{senditem.content}}</p>
              <Button
                type="error"
                size="small"
                style="position:absolute;right:30px;top:30%;"
                @click="remove(index)"
                v-if="!isinfo"
              >删除</Button>
            </div>
          </Col>
        </TabPane>
        <TabPane label="管理题库" tab="add2" v-if="!isinfo">
          <Button type="primary" size="small" @click="addtest">题库新增</Button>
          <Table size="small"  ref="selection" :columns="columns" :data="course_list" >
          </Table>
          <Modal v-model="isedtest" :title="testname" footer-hide width="1000" :mask-closable='false'>
            <div v-if="isedtest">
              <Form ref="formInline" :model="formValidate" :label-width="100">
                <FormItem label="试题内容" required>
                  <Input type="textarea" v-model="formValidate.content" style="width:500px;"></Input>
                </FormItem>
                <FormItem label="试题分值" required>
                  <Input type="text" v-model="formValidate.score" number style="width:50px;"></Input>
                </FormItem>
                <FormItem>
                  <Button type="primary" @click="submit">提交</Button>
                </FormItem>
              </Form>
            </div>
          </Modal>
        </TabPane>
      </Tabs>
    </Row>
  </div>
</template>
<script>
export default {
  name: 'beforeclasssubbank',
  props: ['tid', 'rowid', 'receivedata', 'banklist', 'isinfo'],
  data () {
    return {
      timer: null,
      question_list: [],
      sendlist: [],
      testname: '',
      formValidate: {
        content: '',
        score: 0
      },
      isedtest: false,
      course_list: [],
      columns: [
        {
          title: '试题内容',
          key: '',
          render: (h, params) => {
            return h('Tooltip', {
              props: {
                placement: 'right'
              },
              style: {
                width: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                cursor: 'pointer'
              }
            }, [
              params.row.content,
              h('span', {
                slot: 'content',
                style: {
                  whiteSpace: 'normal', wordBreak: 'break-all'
                }
              }, params.row.content)
            ])
          }
        },
        {
          title: '试题分数',
          key: '',
          render: (h, params) => {
            return (
              <div>
                {params.row.score}
              </div>
            )
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 250,
          align: 'center',
          fixed: 'right',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small',
                  ghost: true
                },
                style: {
                  marginRight: '5px',
                  width: '50px'
                },
                on: {
                  click: () => {
                    this.handleSave(params.row)
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {
                  marginLeft: '5px',
                  width: '50px'
                },
                on: {
                  click: () => {
                    this.handleremove(params.index, params.row)
                  }
                }
              }, '删除')
            ])
          }
        }
      ]
    }
  },
  watch: {
    sendvalue (newvalue) {
      if (newvalue !== 'undefined') {
        this.$emit('sendsubdata', this.sendlist)
      }
    },
    banklist (n) {
      this.getInfo()
    }
  },
  computed: {
    sendvalue () {
      return this.sendlist.length
    }
  },
  methods: {
    join (index) { // 添加题目
      this.sendlist.push(...this.question_list.splice(index, 1))
      if (this.question_list.length === 0) {
        this.question_list = []
      }
    },
    remove (index) { // 删除题目
      if (Array.isArray(this.question_list) === false) {
        this.question_list = []
      }
      this.question_list.push(...this.sendlist.splice(index, 1))
    },
    submit () {
      if (this.testname === '题库新增') {
        this.axios.request({
          method: 'post',
          url: '/index.php/Teacher/QuestionBank/add',
          params: {
            tcid: this.tid
          },
          data: {
            content: this.formValidate.content,
            score: this.formValidate.score,
            question_type: 2
          }
        }).then(res => {
          if (res.code === 200) {
            this.$Message.success(res.message)
            this.$emit('updata_bank', true)
            this.sendlist = []
            this.isedtest = false
          }
        })
      } else if (this.testname === '题库编辑') {
        this.axios.request({
          method: 'post',
          url: '/index.php/Teacher/QuestionBank/add',
          params: {
            tcid: this.tid,
            qid: this.qid
          },
          data: {
            content: this.formValidate.content,
            score: this.formValidate.score,
            question_type: 2
          }
        }).then(res => {
          if (res.code === 200) {
            this.$Message.success(res.message)
            this.$emit('updata_bank', true)
            this.sendlist = []
            this.isedtest = false
          }
        })
      }
    },
    addtest () {
      this.testname = '题库新增'
      this.isedtest = true
      this.formValidate.content = ''
      this.formValidate.score = ''
    },
    handleremove (index, row) {
      this.axios.request({
        method: 'post',
        url: '/index.php/Teacher/QuestionBank/delete',
        data: {
          ids: row.id
        }
      }).then(res => {
        if (res.code === 200) {
          this.$Message.success(res.message)
          this.$emit('updata_bank', true)
          this.sendlist = []
        }
      })
    },
    handleSave (row) {
      this.qid = row.id
      this.isedtest = true
      this.testname = '题库编辑'
      this.axios.request({
        method: 'post',
        url: '/index.php/Teacher/QuestionBank/info',
        params: {
          qid: row.id,
          tcid: this.tid
        }
      }).then(res => {
        if (res.code === 200) {
          this.formValidate.content = res.data.question_info.content
          this.formValidate.option = res.data.question_info.option
          this.formValidate.score = res.data.question_info.score
          this.formValidate.answer = res.data.question_info.answer
        }
      })
    },
    getInfo () {
      this.timer = setInterval(() => {
        if (Object.keys(this.banklist).length > 0) {
          let clonelist = this.banklist.data.question_list
          this.course_list = []
          for (let item in clonelist) {
            if (clonelist[item].question_type === 2) {
              this.course_list.push(clonelist[item])
            }
          }
          if (this.receivedata.data.question_bank.subjective_not_used) {
            this.question_list = this.receivedata.data.question_bank.subjective_not_used
          }
          if (this.receivedata.data.question_bank.subjective_used) {
            this.sendlist = this.receivedata.data.question_bank.subjective_used
          }
          clearInterval(this.timer)
        }
      }, 200)
    }
  },
  mounted () {
    this.getInfo()
  }
}
</script>
