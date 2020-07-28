<template>
  <Row>
    <h1>消息中心</h1>
    <Row>
      <Col :span="8" style="border-right: 1px solid #ccc;">
      <RadioGroup v-model="status" @on-change="(val) => {this.page_no = 1; this.getData()}">
          <Radio :label="-1">全部</Radio>
          <Radio :label="0">未读</Radio>
          <Radio :label="1">已读</Radio>
      </RadioGroup>
      <ul class="msg-list" :style="{minHeight: ($store.state.app.tableHeight-25)+'px'}">
        <li class="msg-item row-item" :class="{'cur-item': (msg.id === item.id)}"  v-for="item in messageList" :key="item.id" @click="detail(item)">
          <h4 style=" word-break:break-all"><Badge dot style="left: -7px;top: -5px;" v-if="!item.status"></Badge>{{item.title}}</h4>
          <p class="time">{{item.created_at | time}} <Button type="text" size="small" style="float:right" @click="showModal(item)">删除</Button></p>
        </li>
      </ul>
      <Page :total="total" :current.sync="page_no" @on-change="(page) => {this.page_no = page; this.getData()}" size="small" style="margin-top: 8px;"/>
      </Col>
      <Col :span="16">
        <Content style="padding: 15px;">
          <div style="text-align:center">
            <h4 style="word-break:break-all">{{msg.title}}</h4>
            <p class="time">{{msg.created_at | time}}</p>
          </div>
          <div v-html="msg.content" style=" word-break:break-all"></div>
        </Content>
      </Col>
    </Row>
    <Modal
        v-model="modal1"
        title="删除"
        @on-ok="deleteInfo">
        <p>是否确定删除</p>
    </Modal>
  </Row>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
export default {
  data () {
    return {
      info: '',
      modal1: false,
      page_no: 1,
      page_size: 10,
      status: -1,
      messageList: [],
      total: 0,
      msg: {
        id: ''
      }
    }
  },
  computed: {
    ...mapState({
      unreadCount: state => state.user.unreadCount
    })
  },
  methods: {
    ...mapMutations([
      'setMessageCount'
    ]),
    getData () {
      this.axios.request({
        method: 'get',
        url: '/index.php/Student/User/getNoticeList',
        params: {
          page_no: this.page_no,
          page_size: this.page_size,
          status: this.status
        }
      }).then(res => {
        if (res.code === 200) {
          this.messageList = res.data.list
          this.total = res.data.count
        }
      })
    },
    detail (item) {
      this.msg = item
      if (item.status === 0) {
        this.axios.request({
          method: 'post',
          url: '/index.php/Student/User/readNotice',
          data: {
            id: item.id
          }
        }).then(res => {
          if (res.code === 200) {
            item.status = 1
            this.setMessageCount(this.unreadCount - 1)
          }
        })
      }
    },
    showModal (item) {
      this.info = item
      this.modal1 = true
    },
    deleteInfo () {
      this.axios.request({
        method: 'post',
        url: '/index.php/Student/User/delete_notice',
        data: {
          id: this.info.id
        }
      }).then(res => {
        this.getData()
      })
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
<style lang="less" scoped>
  .msg-list{
    list-style: none;
    .msg-item{
      cursor: pointer;
      border-bottom: 1px dotted #ccc;
      margin: 0px;
    }
  }
  .time{
    font-size:  12px;
    color:#999;
    text-align: left;
    line-height: 24px;
  }
  .cur-item{
    background: #fff;
    // font-size: 18px;
    color: #0fa9df;
    // box-shadow: 1px 2px 5px gray;
    transition: all ease-in-out 0.3s;
  }
</style>
