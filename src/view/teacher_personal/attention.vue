<template>
  <div class="attention_main">
    <Row class="attention" v-for="(item,index) in attention_List" :key="item.id">
      <Col class="attention_img">
      <img :src="item.icon" alt="">
      </Col>

      <Col class="attention_message">

      <div class="attention_message_header">
        <div class="attention_message_header_name">{{item.teacher_name}}</div>
        <router-link to="" class="attention_message_header_name2">查看主页>></router-link>
      </div>
      <div class="attention_message_footer">
        <span>院校</span>
        <span>职业</span>
        <span>他的课程</span>
      </div>
      </Col>
      <Col style="cursor:pointer" class="attention_cancel_f">
      <div @click="handle_unfollow(index)" class="attention_cancel">取消关注</div>

      </Col>

    </Row>
  </div>
</template>

<script>
import { get_TeacherAttention, unfollow_Attention } from '@/api/user'
export default {
  name: '',

  data () {
    return {
      attention_List: [],
      id: ''
    }
  },
  methods: {
    // 取消关注
    handle_unfollow (index) {
      this.attention_List.forEach((v, i) => {
        if (i === index && this.attention_List[index].id !== '') {
          unfollow_Attention(this.attention_List[index].id).then(res => {
            console.log(res)
            if (res.message === '取消成功！') {
              this.$Message.success('取消成功！')
              this.attention_List.splice(index, 1)
            } else {
              this.$Message.error('取消失败！')
            }
          })
        }
      })
    },
    get_TeacherAttention () {
      get_TeacherAttention().then(res => {
        console.log(res)
        this.attention_List = res.data.list
      })
    }
  },
  mounted () {
    this.get_TeacherAttention()
  }
}
</script>

<style lang='less' socped>
.attention_main {
  margin: 20px 0;
}
.attention {
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  // align-items: center;

  .attention_img {
    width: 73px;
    height: 73px;
    img {
      width: 73px;
      height: 73px;
      border-radius: 50%;
    }
  }
  .attention_message {
    flex: 1;
    padding: 0 150px 40px 30px;

    border-bottom: 1px solid #eeeeee;
    .attention_message_header {
      display: flex;
      .attention_message_header_name {
        margin-right: 40px;
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: #444444;
      }
      .attention_message_header_name2 {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #3d92e2;
      }
    }
    .attention_message_footer {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #888888;
    }
  }
  .attention_cancel_f {
    padding-bottom: 69px;
    border-bottom: 1px solid #eeeeee;
    // background-color: red;
    .attention_cancel {
      width: 70px;
      height: 24px;
      line-height: 24px;
      text-align: center;
      background: #ffffff;
      border: 1px solid #cccccc;
      border-radius: 12px;
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #aaaaaa;
    }
  }
}
</style>
