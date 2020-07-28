<template>
<div class="modal-content-default">
  <div>
    <Button type="success" icon="md-add" size="small" @click="open('exam_bank_edit','','添加题目')">添加题目</Button>
  </div>
  <Table :columns="columns" @on-selection-change="handleSelectChange" :data="bank_list" ref="selection" :height="$store.state.app.tableHeight" size="small" :loading="loading"></Table>
  <Modal v-model="modal" :title="title" footer-hide :width="1000">
    <ExamBankEdit :teacher_course_id="teacher_course_id" :exam_bank_id="target_id" :bank_type="bank_type" v-if="target === 'exam_bank_edit'" @success="modal = false; getBankList()"></ExamBankEdit>
  </Modal>
  <div class="modal-footer">
    <Button type="primary" @click="add(selectedIds)">加入</Button>
  </div>
</div>
</template>
<script>
import { get_question_bank_list, delete_question_bank } from '@/api/data'
import ExamBankEdit from './exam_bank_edit'
import modal_mixin from '@/view/mixins/modal_mixin'
export default{
  props: ['bank_type', 'teacher_course_id'],
  components: {
    ExamBankEdit
  },
  mixins: [modal_mixin],
  data () {
    return {
      origin_bank_list: [],
      loading: false,
      selectedIds: [],
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '题目',
          key: 'content',
          width: 400,
          tooltip: true,
          render: (h, params) => {
            return <div domPropsInnerHTML={params.row.content } ></div>
          }
        },
        {
          title: '分值',
          key: 'score',
          width: 100
        },
        {
          title: '类型',
          key: 'question_type',
          minWidth: 250,
          render: (h, params) => {
            let question_type = params.row.question_type
            return (
              <div>
                <Tag color={question_type === 1 ? 'primary' : 'success'}>{question_type === 1 ? '客观题' : '主观题'}</Tag>
              </div>
            )
          }
        },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          width: 200,
          render: (h, params) => {
            return (
              <div>
                <Button type="success" size="small" onClick={() => { this.add(params.row.id) }}>加入</Button>
                <Button type="primary" size="small" onClick={() => { this.open('exam_bank_edit', params.row.id, '编辑') }}>编辑</Button>
                <Button type="error" size="small" onClick={() => { this.del(params.row, params.index) }}>删除</Button>
              </div>
            )
          }
        }
      ]
    }
  },
  watch: {
    teacher_course_id (n, o) {
      n && this.getBankList()
    },
    bank_type (n, o) {
      this.getBankList()
    }
  },
  computed: {
    bank_list () {
      return this.origin_bank_list.filter(item => {
        return item.question_type === this.bank_type
      })
    }
  },
  methods: {
    getBankList () {
      this.loading = true
      get_question_bank_list(this.teacher_course_id).then(res => {
        this.loading = false
        if (res.code === 200) {
          this.origin_bank_list = res.data.question_list
        }
      })
    },
    add (ids) {
      if (typeof ids === 'number') {
        ids = [ids]
      }
      if (!ids || ids.length === 0) {
        this.$Message.warning('请选择题目!')
        return
      }
      let bank_list = this.bank_list.filter(item => { return ids.indexOf(item.id) !== -1 })
      let arr = bank_list.slice(0)// 实现深拷贝
      this.$emit('add', { bank_type: this.bank_type, bank_list: arr })
      this.$Message.success('添加成功！')
      this.$refs.selection.selectAll(false)
      this.selectedIds = []
    },
    del (item, index) {
      this.$Modal.confirm({
        title: '确定删除吗？',
        onOk: () => {
          delete_question_bank(item.id).then(res => {
            if (res.code === 200) {
              let i = this.origin_bank_list.findIndex(el => {
                return el.id === item.id
              })
              this.origin_bank_list.splice(i, 1)
              this.$Message.success(res.message)
            }
          })
        }
      })
    },
    handleSelectChange (selection) {
      this.selectedIds = selection.map(item => {
        return item.id
      })
    }
  },
  mounted () {
    this.getBankList()
  }
}
</script>
