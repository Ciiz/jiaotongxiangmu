<template>
  <div class="ques_list">
    <Row class="ques_header">
      <Col :span="3">创建时间</Col>
      <Col :span="3">提问人数</Col>
      <Col :span="16">提问内容</Col>
      <Col :span="2"></Col>
    </Row>
    <p v-if="Object.keys(quesList).length==0">暂无提问信息</p>
    <div class="ques_ul">
      <Row class="ques_l" v-for="(item) in quesList" :key="item.id">
        <Col :span="3">{{getDate(item.created_at)}}</Col>
        <Col :span="3">{{item.answer_num}}</Col>
        <Col :span="16">
          <Tooltip :content='item.content' placement="left">
             <span class="ques_content" @click="showAnswer(item.id)">{{item.content}}</span>
          </Tooltip>
        </Col>
        <Col :span="2"><Button type="error" size="small" @click="showDel(item.id)">删除</Button></Col>
      </Row>
    </div>
    <Spin v-show="loading" fix></Spin>
    <Page :total="total" :current="page" class="q_page" size="small" @on-change="changePage" show-total show-elevator/>
    <Modal v-model="modal" title="回答详情" width="800" footer-hide :mask-closable="true">
      <answerList :quiz_id="quiz_id"></answerList>
    </Modal>
    <Modal
      v-model="modal1"
      title="删除信息"
      @on-ok="deleteNotice">
      <p>是否确认删除这条提问</p>
    </Modal>
  </div>
</template>

<script>
import answerList from '@/view/teacher_common/question/anwser_list.vue'
export default {
  components: { answerList },
  props: {
    t_id: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      quesList: '',
      modal: false,
      modal1: false,
      quiz_id: '',
      total: 0,
      type: 0,
      page: 1,
      loading: false,
      delId: ''
    }
  },
  methods: {
    getProblemList () {
      this.loading = true
      this.axios
        .request({
          method: 'get',
          url: '/index.php/Teacher/Quiz/get_list',
          params: {
            timetable_id: this.t_id,
            rows: 10,
            type: this.type,
            page: this.page
          }
        })
        .then(res => {
          this.quesList = res.data.list
          this.total = res.data.total
          this.loading = false
        })
    },
    getDate (i) {
      return this.moment(i * 1000).format('YYYY-MM-DD')
    },
    showAnswer (val) {
      this.modal = true
      this.quiz_id = val
    },
    changePage (page) {
      this.page = page
      this.getProblemList()
    },
    showDel (val) {
      this.modal1 = true
      this.delId = val
    },
    deleteNotice () {
      this.axios
        .request({
          method: 'get',
          url: '/index.php/Teacher/Quiz/delete',
          params: {
            id: this.delId
          }
        })
        .then(res => {
          this.getProblemList()
        })
    }
  },
  mounted () {
    this.getProblemList()
  }
}
</script>

<style>
  .ques_header{
    font-size: 16px;
    font-weight: bold;
    padding: 0 0 15px 0;
    border-bottom:1px solid rgb(232, 234, 236);
  }
  .ques_l{
    padding: 6px 5px;
    border-bottom:1px solid rgb(232, 234, 236);
  }
  .ques_content{
    padding-right: 15px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    word-wrap: break-word;
    word-break: break-all;
    cursor: pointer
  }
  .ques_list .q_page{
    color:rgb(255, 255, 255,0.8)
  }
  .ques_list .ivu-tabs{
    color: rgb(255, 255, 255,0.8)
  }
  .q_page .ivu-icon{
    margin-top: 3px
  }
</style>
