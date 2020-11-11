<template>

  <div class="pc_message" style="overflow-x: auto; overflow-y: auto; height: 572px;">
    <div class="pc_message_label">课程名称：{{message.course_name}}</div>
    <div class="pc_message_label">课程便签：{{message.course_label}}</div>
    <div class="pc_message_label">专业：{{message.major_name}}</div>

    <div class="pc_message_label">课程类型：{{message.course_type==1? '普通' : '全景'}}</div>
    <div class="pc_message_label pc_message_description">
      <p class="pc_message_description1">描述： </p>
      <span class="pc_message_description2" v-html="message.description"></span>
    </div>
    <div class="pc_message_btn" @click="paystatus">
      <div class="pc_message_btn1">￥{{message.release_price}}</div>
      <div class="pc_message_btn2">购买</div>
    </div>

  </div>

</template>

<script>

import { get_taechermassge } from '@/api/teacher'
import { student_massges } from '@/api/student'
export default {

  data () {
    return {
      admin_status: 0
    }
  },
  props: {
    message: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  computed: {
    userType () {
      return this.$store.state.user.userInfo.userType
    },
    loginstatus () {
      return this.$store.state.user.loginstatus
    }
  },
  methods: {
    paystatus () {

      console.log(this.loginstatus);
      // 未登录
      if (this.loginstatus === 0 || this.loginstatus === '') {
        console.log('未登录');

        this.$emit('paystatus', true)
      } else { //登陆
        console.log('登陆');

      }
    },
  },

  mounted () {
    var ots = document.querySelector('.pc_message')
    ots.addEventListener('scroll', function () {
      // 获取当前的滑动屏幕的距离
      let ot = ots.scrollTop
      if (ot > 1) {
        document.querySelector('.pc_message_btn').style.position = 'static'
        document.querySelector('.pc_message_btn').style.margin = '10px 0 10px 160px'

      }

    })
    // setTimeout(() => {

    //   this.$store.commit('setLoginstatus', this.message.admin_status)
    //   console.log(this.message);
    //   // if (this.userType === 1) {
    //   //   if (this.message.create_type === 3) {
    //   //     let res = await get_taechermassge(this.message.teacher_id)
    //   //     console.log(res);
    //   //     this.course_list = res.data.course_list
    //   //   }
    //   // } else {
    //   //   if (this.message.create_type === 3) {
    //   //     let res = await student_massges(this.message.teacher_id)
    //   //     console.log(res);
    //   //     this.course_list = res.data.course_list
    //   //   }
    //   // }


    // }, 1000)
  }
}
</script>

<style lang='less' scoped>
.pc_message {
  background-color: #fff;
  padding: 0 20px;
  position: relative;
  overflow: hidden;
  .pc_message_label {
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #333333;
    padding: 10px;
    border-bottom: 1px solid #eeeeeeff;
  }
  .pc_message_btn {
    position: absolute;
    right: 13px;
    bottom: 6px;
    width: 104px;
    height: 48px;
    background-color: #2ba4e7ff;
    color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-left: 160px;
    // margin: 10px 0 10px 160px;
  }
}
</style>
