<template>
  <div class="ques_list">
    <Row class="ques_header">
      <Col :span="3">提问时间</Col>
      <Col :span="16">提问内容</Col>
      <Col :span="2"></Col>
    </Row>
    <div class="ques_ul">
      <p v-if="Object.keys(quesList).length==0">暂无提问内容</p>
      <!-- <Row class="ques_l" v-for="(item) in quesList" :key="item.id">
        <Col :span="3">{{getDate(item.created_at)}}</Col>
        <Col :span="3">{{item.answer_num}}</Col>
        <Col :span="16" class="ques_content"><span style="cursor: pointer" @click="showAnswer(item.id)">{{item.content}}</span></Col>
        <Col :span="2"><Button type="error" size="small" @click="deleteNotice(item.id)">删除</Button></Col> -->
        <!-- <Spin v-show="loading" fix></Spin> -->
      </Row>
    </div>
    <Page :total="total" :current="page" size="small"  show-total show-elevator/>
  </div>
</template>

<script>
export default {
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
      quiz_id: '',
      total: 0,
      type: 0,
      page: 1,
      loading: false
    }
  },
  methods: {
    // getProblemList () {
    //   this.loading = true
    //   this.axios
    //     .request({
    //       method: 'get',
    //       url: '/index.php/Teacher/Quiz/get_list',
    //       params: {
    //         timetable_id: this.t_id,
    //         rows: 10,
    //         type: this.type,
    //         page: this.page
    //       }
    //     })
    //     .then(res => {
    //       this.quesList = res.data.list
    //       this.total = res.data.total
    //       this.loading = false
    //     })
    // },
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
    }
  },
  mounted () {
    // this.getProblemList()
  }
}
</script>

<style>
  .ques_header{
    font-size: 16px;
    font-weight: bold;
    padding: 15px 0;
    border-bottom:1px solid rgb(232, 234, 236);
  }
  .ques_l{
    padding: 10px 0;
    line-height: 27px;
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
  }

</style>
