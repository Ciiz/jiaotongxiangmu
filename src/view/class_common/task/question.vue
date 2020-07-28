<template>
  <Row>
    <Card v-if="list.length === 0" style="background:#e8eaec;width: 500px;margin:10px auto;">
      <div style="text-align:center">
        请在下面输入框提出问题
      </div>
    </Card>
    <ul style="list-style:none;height: 550px;overflow: auto;">
      <li v-for="(item, index) in list" :key="item.index" >
        <div v-if="item.type === 1" style="display: flex;align-items: center;">
          <h4>问题:</h4>
          <p style="flex:1;padding:10px;word-break:break-all ">{{item.content}}</p>
          <div class="option">
            <Button v-if="item.type!==3" size="small" type="text" @click="deleteItem(item, index)">删除</Button>
          </div>
        </div>
        <!-- 追问&教师回答 -->
        <div class="item-left" v-if="item.type !== 1">
          <div class="top">
            <span class="avator">
              <img :src="item.userInfo.icon" alt :onerror="errorImg01">
            </span>
            <span class="name">{{item.userInfo.name}}</span>
            <div class="time">{{item.created_at | time}}</div>
          </div>
          <div class="content">
            <div class="text" v-html="item.content"></div>
            <div class="option">
              <Button v-if="item.type!==3" size="small" type="text" @click="deleteItem(item, index)">删除</Button>
            </div>
          </div>
        </div>
        <Divider/>
      </li>
    </ul>
    <Input type="textarea" class="bg-gray" v-model="content"></Input>
    <div style="text-align:right;margin-top:15px;"><Button type="info" @click="submit">提交</Button></div>
    <Spin size="large" v-if="loading" fix></Spin>
  </Row>
</template>
<script>
export default {
  props: {
    teacher_id: ''
  },
  components: {
  },
  data () {
    return {
      list: [],
      loading: false,
      content: ''
    }
  },
  computed: {
  },
  watch: {
    teacher_id (newVal, oldVal) {
      this.getData()
    }
  },
  methods: {
    getData () {
      // if (!this.student_task_id) return
      // let _this = this
      // // _this.loading = true
      // _this.axios
      //   .request({
      //     method: 'get',
      //     url: `/index.php/Student/Task/questionDetail`,
      //     params: {
      //       student_task_id: this.student_task_id
      //     }
      //   })
      //   .then(res => {
      //     _this.loading = false
      //     let data = res.data
      //     if (res.code === 200) {
      //       _this.list = data.list
      //     }
      //   })
    },
    submit () {
      let _this = this
      if (_this.content === '') {
        _this.$Message.warning('提交内容不能为空')
        return
      }
      _this.axios.request({
        method: 'post',
        url: '/index.php/Student/Task/submitQuestion',
        data: {
          target_id: this.teacher_id,
          content: this.content
        }
      }).then(res => {
        if (res.code === 200) {
          _this.$Message.success(res.message)
          _this.content = ''
          _this.getData()
        }
      })
    },
    deleteItem (item, index) {
      this.$Modal.confirm({
        title: '确认删除提问？',
        content: item.type === 1 ? '该提问下面的内容也会删除' : '',
        onCancel: () => {
          return false
        },
        onOk: () => {
          this.axios.request({
            method: 'post',
            url: '/index.php/Student/Task/deleteQuestion',
            data: {
              id: item.id
            }
          }).then(res => {
            if (res.code === 200) {
              this.$Message.success(res.message)
              this.getData()
            }
          })
        }
      })
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
<style type="text/css" lang="less" scoped>
  .item-left {
    padding: 10px;
    .top {
      display: flex;
      align-items: center;
      .avator {
        width: 50px;
        height: 50px;
        overflow: hidden;
        border-radius: 100px;
        cursor: pointer;
        img {
          width: 100%;
        }
      }
      .name {
        margin-left: 15px;
      }
      .time {
        flex: 1;
        display: flex;
        flex-direction: row-reverse;
      }
    }
    .content {
      .text {
        width: 80%;
        display: inline-block;
        padding-left: 65px;
        word-break: break-all
      }
      .option {
        width: 20%;
        display: inline-block;
        text-align: right;
      }
    }
  }

  .item-right {
    padding: 10px;
    .top {
      display: flex;
      align-items: center;
      flex-direction: row-reverse;
      .avator {
        width: 50px;
        height: 50px;
        overflow: hidden;
        border-radius: 100px;
        cursor: pointer;
        img {
          width: 100%;
        }
      }
      .name {
        margin-right: 15px;
      }
      .time {
        flex: 1;
        display: flex;
        color: #999;
      }
    }
    .content {
      .text {
        width: 80%;
        display: inline-block;
        padding-right: 65px;
        text-align: right;
      }
      .option {
        width: 20%;
        display: inline-block;
      }
    }
  }

  .textarea.ivu-input{
    background:#dfdddd!important;
  }

  .name{
    color:#999
  }
  .time{
    color: #999;
  }

  .ivu-divider-horizontal{
    margin: 5px 0px;
  }
</style>
