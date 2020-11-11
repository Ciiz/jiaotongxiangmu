<template>
  <div class="courseDetails">
    <div class="courseDetails_header">
      <div class="courseDetails_icon"><img :src="message.icon" alt=""></div>
      <div class="courseDetails_name">
        <div class="courseDetails_name1">{{message.user_name}}</div>
        <div class="courseDetails_name2">{{message.school_name}}</div>
      </div>
      <div class="courseDetails_homepage"
        @click="$router.push({path: `/m_index_school_teacherUser/${message.teacher_id}`})">Ta的主页 >>
      </div>
    </div>
    <div class="courseDetails_mome">
      标签：{{message.course_label}}
    </div>
    <div class="courseDetails_center">
      <div class="courseDetails_centerTop">
        <div class="courseDetails_centerTop_img">
          <img :src="message.img" alt="">
        </div>
        <div class="courseDetails_centerTop_r">
          <span>日期：{{moment(message.created_at * 1000).format('YYYY-MM-DD HH:mm')}}</span>
          <span>章节：{{message.chapter_list.length}}</span>
          <span v-if="message.play_count===null">0人学习过</span>
          <span v-else>{{message.play_count}}人学习过</span>
          <span v-if="message.grade===0">{{message.grade}}.0</span>
          <span v-else-if="message.grade>0 && message.grade<=2" class="courseDetails_centerTop_rImg">{{message.grade}}.0
            <span><img src="@/assets/images/mobile_teacher/xingxing.png" alt=""></span>
          </span>
          <span class="courseDetails_centerTop_rImg" v-else-if="message.grade>2 && message.grade<=4">{{message.grade}}.0
            <span>
              <img src="@/assets/images/mobile_teacher/xingxing.png" alt="">
              <img src="@/assets/images/mobile_teacher/xingxing.png" alt="">
            </span>
          </span>
          <span class="courseDetails_centerTop_rImg" v-else-if="message.grade>4 && message.grade<=6">{{message.grade}}.0
            <span>
              <img src="@/assets/images/mobile_teacher/xingxing.png" alt="">
              <img src="@/assets/images/mobile_teacher/xingxing.png" alt="">
              <img src="@/assets/images/mobile_teacher/xingxing.png" alt="">
            </span>
          </span>
          <span class="courseDetails_centerTop_rImg" v-else-if="message.grade>6 && message.grade<=8">{{message.grade}}.0
            <span>
              <img src="@/assets/images/mobile_teacher/xingxing.png" alt="">
              <img src="@/assets/images/mobile_teacher/xingxing.png" alt="">
              <img src="@/assets/images/mobile_teacher/xingxing.png" alt="">
              <img src="@/assets/images/mobile_teacher/xingxing.png" alt="">
            </span>
          </span>
          <span class="courseDetails_centerTop_rImg"
            v-else-if="message.grade>8 && message.grade<=10">{{message.grade}}.0
            <span>
              <img src="@/assets/images/mobile_teacher/xingxing.png" alt="">
              <img src="@/assets/images/mobile_teacher/xingxing.png" alt="">
              <img src="@/assets/images/mobile_teacher/xingxing.png" alt="">
              <img src="@/assets/images/mobile_teacher/xingxing.png" alt="">
              <img src="@/assets/images/mobile_teacher/xingxing.png" alt="">
            </span>
          </span>
        </div>
      </div>

      <div class="courseDetails_centerFooter" :class="{active:isshow}" v-html="message.description">
      </div>
    </div>
    <div class="courseDetails_btn" @click="handlebtn"><img src="@/assets/images/mobile_teacher/bontom.png" alt="">
    </div>
    <div class="courseDetails_his">
      <div class="courseDetails_his_title">ta的其他课程</div>
      <div v-if="course_list.length===0" class="teacher_massge_bottom_null">暂无课程！</div>
      <div class="teacher_massge_bottom_list" v-else>
        <div class="teacher_massge_bottom_list_item" v-for="(v,i) in course_list" :key="i">
          <div class="teacher_massge_bottom_list_itemImg">
            <div class="teacher_massge_icon"><img src="@/assets/images/mobile_teacher/bofang3.png" alt="">
              <span v-if="v.play_count===null">0</span>
              <span v-else>{{v.play_count}}</span>
            </div>

            <div class="teacher_massge_img"> <img :src="v.img" alt=""> </div>
          </div>
          <div class="teacher_massge_bottom_list_itemName">
            {{v.course_name}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 
<script>
import { get_taechermassge } from '@/api/teacher'
import { student_massges } from '@/api/student'
export default {
  data () {
    return {
      isshow: true,
      course_list: []
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
  },
  methods: {
    handlebtn () {
      this.isshow = !this.isshow
    }
  },
  mounted () {
    setTimeout(async () => {
      console.log(this.message);
      if (this.message.create_type === 3) {
        if (this.userType === 1) {
          let res = await get_taechermassge(this.message.teacher_id)
          console.log(res);
          this.course_list = res.data.course_list
        }
        else if (this.userType === 2) {
          console.log(this.message.teacher_id);

          let res2 = await student_massges(this.message.teacher_id)
          console.log(res2);

          this.course_list = res2.data.course_list
        }
      }

    }, 1000)
  }
}
</script>

<style lang='less' scoped>
.courseDetails {
  .active {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
  }
  padding: 0.4rem 0.2rem 0.2rem 0.2rem;
  .courseDetails_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .courseDetails_icon {
      img {
        width: 0.7rem;
        height: 0.7rem;
        border-radius: 50%;
      }
    }
    .courseDetails_name {
      flex: 1;
      margin-left: 0.2rem;
      .courseDetails_name1 {
        font-size: 0.34rem;
        font-family: PingFang SC;
        font-weight: bold;
        color: #070707;
      }
      .courseDetails_name2 {
        font-size: 0.2rem;
        font-family: PingFang SC;
        font-weight: 500;
        color: #999999;
      }
    }
    .courseDetails_homepage {
      font-size: 0.26rem;
      font-family: PingFang SC;
      font-weight: 500;
      color: #4ea5ff;
    }
  }
  .courseDetails_mome {
    font-size: 0.26rem;
    font-family: PingFang SC;
    font-weight: 500;
    color: #070707;
    margin: 0.3rem 0;
  }
  .courseDetails_center {
    .courseDetails_centerTop {
      display: flex;
      margin: 0.2rem 0;
      .courseDetails_centerTop_img {
        width: 1.96rem;
        height: 1.96rem;
        border-radius: 8px;
        img {
          width: 1.96rem;
          height: 1.96rem;
          border-radius: 8px;
        }
      }
      .courseDetails_centerTop_r {
        .courseDetails_centerTop_rImg {
          display: flex;
          align-items: center;
          span {
            margin-left: 0.1rem;
          }
          img {
            width: 0.24rem;
            height: 0.24rem;
            margin-left: 0.1rem;
          }
        }
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-left: 0.3rem;
        font-size: 0.28rem;
        font-family: PingFang SC;
        font-weight: bold;
        color: #080808;
        span:nth-child(1),
        :nth-child(2) {
          font-size: 0.28rem;
          font-family: PingFang SC;
          font-weight: 500;
          color: #070707;
        }
      }
    }
    .courseDetails_centerFooter {
      font-size: 0.26rem;
      font-family: PingFang SC;
      font-weight: 500;
      color: #444444;
    }
  }
  .courseDetails_btn {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.3rem 0;
    border-bottom: 1px solid #e5e5e5ff;
    margin-bottom: 0.3rem;
    img {
      width: 0.3rem;
      height: 0.3rem;
    }
  }
  .courseDetails_his {
    .courseDetails_his_title {
      font-size: 0.32rem;
      font-family: PingFang SC;
      font-weight: 500;
      color: #222222;
    }
    .teacher_massge_bottom_null {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 1rem;
    }
    .teacher_massge_bottom_list {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      padding: 0.2rem 0.3rem;
      .teacher_massge_bottom_list_item {
        margin-bottom: 0.3rem;

        .teacher_massge_bottom_list_itemImg {
          position: relative;
          overflow: hidden;
          .teacher_massge_img {
            img {
              width: 3.04rem;
              height: 3.04rem;
              border-radius: 8px;
            }
          }
          .teacher_massge_icon {
            position: absolute;
            bottom: 0.1rem;
            left: 0.16rem;
            font-size: 0.22rem;
            font-family: PingFang SC;
            font-weight: bold;
            color: #ffffff;
            img {
              width: 0.16rem;
              height: 0.16rem;
              margin-right: 0.1rem;
            }
          }
          width: 3.04rem;
          height: 3.04rem;
          background: #3c9cff;
          border-radius: 8px;
        }

        .teacher_massge_bottom_list_itemName {
          font-size: 0.28rem;
          font-family: PingFang SC;
          font-weight: 500;
          color: #222222;
          margin: 0.1rem 0;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
      }
    }
  }
}
</style>
