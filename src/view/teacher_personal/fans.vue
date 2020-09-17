<template>
  <div class="attention_main">
    <div v-if="fanList.length===0">还没有粉丝</div>
    <Row class="attention" v-for="(item,index) in fanList" :key="item.id">
      <Col class="attention_img">
      <img :src="item.icon" alt="">
      </Col>
      <Col class="attention_message">

      <div class="attention_message_header">
        <div class="attention_message_header_name">{{item.name}}</div>
        <router-link to="" class="attention_message_header_name2">查看主页>></router-link>
      </div>
      <div class="attention_message_footer">
        <span>院校:{{item.school_name}} </span>
        <span>职业:{{item.major_name}}</span>
        <!-- <span>Ta的课程:&nbsp&nbsp{{item.course_count}}</span> -->
        <span v-if="item.course_count">Ta的课程:{{item.course_count}}</span>
        <span v-else style="width:66.5px;"></span>
      </div>
      </Col>
      <Col style="cursor:pointer" class="attention_cancel_f">
      <div @click="handle_unfollow(index)" class="attention_cancel">移除粉丝</div>

      </Col>

    </Row>
  </div>
</template>

<script>
import { loveMe, unfollow_Attention } from '@/api/user'
export default {
  name: '',

  data () {
    return {
      fanList: [],
      id: ''

    }
  },
  methods: {
    // // 取消关注
    handle_unfollow (index) {
      this.fanList.forEach((v, i) => {
        if (i === index && this.fanList[index].id !== '') {
          console.log(this.fanList[index].id)

          unfollow_Attention(this.fanList[index].id).then(res => {
            console.log(res)
            if (res.message === '取消成功！') {
              this.$Message.success('移除成功！')
              this.fanList.splice(index, 1)
            } else {
              this.$Message.error('移除失败！')
            }
          })
        }
      })
    }

  },
  mounted () {
    loveMe().then(res => {
      console.log(res)
      this.fanList = res.data.data
    })
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
