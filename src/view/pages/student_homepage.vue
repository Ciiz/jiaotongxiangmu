<template>
  <div class="student_homepage">
    <div class="s_Header">
      <div class="s_Header_l">
        <div class="s_HeaderIcon"><img :src="student_list.icon" alt=""></div>
        <div class="s_HeaderName">
          <div class="s_HeaderName1">{{student_list.name}}</div>
          <div class="s_HeaderName2">专业:{{student_list.major_name}}</div>
          <div class="s_HeaderName3">{{student_list.school_name}}</div>
        </div>
        <div class="s_Headerclass">
          <div></div>
          <div class="s_Headerclass1">学号：{{student_list.s_no}}</div>
          <div class="s_Headerclass2">班级:{{student_list.class_name}}</div>
        </div>
        <div class="s_Headernumber">
          <div></div>
          <div class="s_Headernumber1">电话:{{student_list.mobile}}</div>
          <div class="s_Headernumber2">邮箱:{{student_list.email}}</div>
        </div>
      </div>

      <div class="s_Header_r">
        <div class="s_HeaderNum">
          <div class="s_HeaderNum1">
            <span style="margin-bottom: 10px;">关注数</span>
            <span>{{student_list.attention_num}}</span>
          </div>
          <div class="s_HeaderNum2">
            <span style="margin-bottom: 10px;">课程数</span>
            <span>{{student_list.course_num}}</span>
          </div>
        </div>
      </div>
    </div>
    <Divider />
    <div class="hisAttention">
      <span style="color: #2BA4E7;font-size: 16px;font-weight: 400;font-family: Microsoft YaHei;">他的关注</span>
      <ul>
        <li v-for="(v,i) in teacher_list" :key="i" v-if="teacher_list.length!==0">
          <div class="hisAttention_l">
            <div class="hisAttention_lIcon"><img :src="v.icon" alt=""></div>
            <div class="hisAttention_lName">
              <span>{{v.name}}</span>
              <span>职业:{{v.major_name}}</span>
              <span>{{v.school_name}}</span>
            </div>
          </div>
          <div class="hisAttention_r">
            <span>已关注</span>
          </div>
        </li>
      </ul>
      <div class="hisAttention_footer" v-if="teacher_list2.length>=5" @click="handleclick">
        <span>查看更多</span>
      </div>
    </div>
    <Divider />
    <div class="hiscourse">
      <span style="color: #2BA4E7;font-size: 16px;font-weight: 400;font-family: Microsoft YaHei;">他的课程</span>
      <ul>
        <li v-for="(item,index) in course_list" :key="index" v-if="course_list.length!==0">
          <div class="hiscourse_big">
            <span style="color: #CCCCCC;">{{index+1}}</span>
            <div class="hiscourse_icon"><img :src="item.img" alt=""></div>
            <div class="hiscourse_icon_name">{{item.course_name}}</div>
          </div>
          <!-- <div class="hiscourse_r">选修</div> -->
        </li>
      </ul>
      <div class="hiscourse_footer" v-if="course_list2.length>=5" @click="handlehiscourse">
        <span>查看更多</span>
      </div>
    </div>
  </div>
</template>

<script>
import { get_student } from "@/api/teacher"
export default {

  data () {
    return {
      student_list: {},
      teacher_list: [],
      teacher_list2: [],
      course_list2: [],
      course_list: []
    }
  },

  methods: {
    handleclick () {
      this.teacher_list = this.teacher_list2
    },
    handlehiscourse () {
      this.course_list = this.course_list2
    }
  },


  async mounted () {
    console.log(this.$route.params.id);
    var res = await get_student(this.$route.params.id)
    console.log(res);
    this.student_list = res.data.student_list
    this.teacher_list2 = res.data.student_list.teacher_list
    this.course_list2 = res.data.student_list.course_list
    if (res.data.student_list.course_list.length >= 5) {
      this.course_list = res.data.student_list.course_list.slice(0, 5)
    }
    else {
      this.course_list = res.data.student_list.course_list
    }

    if (res.data.student_list.teacher_list.length >= 5) {
      this.teacher_list = res.data.student_list.teacher_list.slice(0, 5)
    } else {
      this.teacher_list = res.data.student_list.teacher_list
    }
  }
}
</script>

<style lang='less' scoped>
.student_homepage {
  /deep/.ivu-divider-default {
    height: 12px;
  }
  .s_Header {
    width: 1200px;
    margin: 0 auto;

    height: 150px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30px 10px;
    // border-bottom: 12px solid #eeeeeeff;
    .s_Header_l {
      width: 60%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-around;
      .s_HeaderIcon {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        box-shadow: 0px 6px 15px 3px rgba(64, 63, 63, 0.18);
        img {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          box-shadow: 0px 6px 15px 3px rgba(64, 63, 63, 0.18);
        }
      }
      .s_HeaderName {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #666666;
        .s_HeaderName1 {
          font-size: 16px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #333333;
        }
      }
      .s_Headerclass {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #666666;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      .s_Headernumber {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #666666;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
      }
    }
    .s_Header_r {
      .s_HeaderNum {
        display: flex;
        .s_HeaderNum1,
        .s_HeaderNum2 {
          display: flex;
          flex-direction: column;
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #333333;
          margin-right: 20px;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }
  .hisAttention {
    width: 1200px;
    margin: 0 auto;
    padding: 0 30px;
    ul {
      margin-top: 20px;
      li {
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #eeeeeeff;
        padding: 10px;
        .hisAttention_l {
          display: flex;
          .hisAttention_lIcon {
            img {
              width: 53px;
              height: 53px;
              border-radius: 50%;
            }
          }
          .hisAttention_lName {
            display: flex;
            flex-direction: column;
            margin-left: 20px;
          }
        }
        .hisAttention_r {
          width: 100px;
          height: 48px;
          background-color: #2ba4e7ff;
          color: #fff;
          border-radius: 8px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 16px;
          font-family: Microsoft YaHei;
          font-weight: 400;
        }
      }
    }
    .hisAttention_footer {
      width: 100px;
      height: 48px;
      border: 1px solid #2ba4e7;
      border-radius: 8px;
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #2ba4e7;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 30px auto;
    }
  }
  .hiscourse {
    width: 1200px;
    margin: 0 auto;
    padding: 0 30px;
    .hiscourse_footer {
      width: 100px;
      height: 48px;
      border: 1px solid #2ba4e7;
      border-radius: 8px;
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #2ba4e7;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 30px auto;
    }
    ul {
      li {
        border-bottom: 1px solid #eeeeeeff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 0;
        .hiscourse_big {
          display: flex;
          align-items: center;
          .hiscourse_icon {
            width: 60px;
            height: 60px;
            border-radius: 2px;
            margin: 0 20px;
            img {
              width: 60px;
              height: 60px;
              border-radius: 2px;
            }
          }
          .hiscourse_icon_name {
            font-size: 16px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #333333;
          }
        }
      }
    }
  }
}
</style>
