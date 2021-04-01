<template>
  <div>
    <Row class="teacher_homepage">
      <Col class="teacher_homepageHeader">
      <div class="teacher_homepageHeader_l">
        <div class="teacher_homepageHeader_lImg">
          <img :src="teacher_list.icon" alt="">
        </div>
        <div class="teacher_homepageHeader_lText">
          <span>{{teacher_list.name}}</span>
          <span>专业：{{teacher_list.major_name}}</span>
          <span>{{teacher_list.school_name}}</span>
          <span style="width:800px"> 简介：{{teacher_list.profile}}</span>
        </div>
      </div>
      <div class="teacher_homepageHeader_r">
        <span class="teacher_homepageHeader_r1_active" v-if="teacher_list.isfollow===1" @click="handleclick">已关注</span>
        <span class="teacher_homepageHeader_r1" v-else @click="handleclick">关注</span>

        <span class="teacher_homepageHeader_r2">粉丝数：{{teacher_list.attention_num}}</span>
      </div>
      </Col>
    </Row>
    <Divider />
    <Row>
      <Col class="teacher_homepageFooter">
      <span class="teacher_homepageFooter_title">ta的视频({{course_list.length}})</span>
      <ul>
        <li v-for="(v,i) in course_list" :key='i' @click="$router.push({ path: `/videojump/${v.id}` })">
          <div class="jingxuan" v-if="v.is_charge"><img src="@/assets/images/public/jingxuan.png" alt=""></div>
          <div class="teacher_homepageFooter_img"><img :src="v.img" alt=""></div>
          <div class="teacher_homepageFooter_name">
            <span>{{v.course_name}}</span>
            <span>作者：{{teacher_list.name}}</span>
            <span>院校：{{teacher_list.school_name}}</span>
          </div>
        </li>
      </ul>
      </Col>
    </Row>
    <span class="morelook" v-if="Bettercourse_list.length>15" @click="handlemore">查看更多</span>
  </div>
</template>
<script>
import { getTearher_Massgess, get_follow, get_unfollow } from "@/api/common"
import { student_massges } from "@/api/student"
export default {


  data () {
    return {
      teacher_list: {},
      course_list: [],
      Bettercourse_list: []
    }
  },
  computed: {
    route () {
      return this.$route.params.id
    },
    userType () {
      return this.$store.state.user.userInfo.userType
    }
  },
  // watch: {   //监听路由变化
  //   $route () {
  //     console.log(8888888);
  //   }
  // },
  methods: {
    getTearher_Massgess () {
      if (this.userType === 1) {
        getTearher_Massgess(this.route).then(res => {
          console.log(res);
          this.teacher_list = res.data.teacher_list
          this.course_list = res.data.course_list
          this.Bettercourse_list = res.data.course_list
          if (res.data.course_list.length > 15) {
            this.course_list = res.data.course_list.slice(0, 15)
          }
        })
      } else {
        student_massges(this.route).then(res => {
          this.teacher_list = res.data.teacher_list
          this.course_list = res.data.course_list
          this.Bettercourse_list = res.data.course_list
          if (res.data.course_list.length > 15) {
            this.course_list = res.data.course_list.slice(0, 15)
          }
        })
      }


    },
    handlemore () {
      this.course_list = this.Bettercourse_list
    },
    async  handleclick () {
      if (this.teacher_list.isfollow === 1) {
        var res = await get_unfollow(this.$route.params.id)
        this.teacher_list.isfollow = 0
      } else {
        var result = await get_follow(this.$route.params.id)
        this.teacher_list.isfollow = 1
      }
    }
  },
  activated () { //由于 路由keepAlive的原因，用mounted不触发，要有activated
    this.getTearher_Massgess()
  }
}
</script>

<style lang='less' scoped>
/deep/.ivu-divider-horizontal {
  height: 12px;
}
.teacher_homepage {
  .teacher_homepageHeader {
    width: 1200px;
    margin: 30px auto;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .teacher_homepageHeader_l {
      display: flex;
      .teacher_homepageHeader_lImg {
        width: 80px;
        height: 80px;
        margin-right: 40px;
        img {
          border-radius: 50%;
          width: 80px;
          height: 80px;
        }
      }
      .teacher_homepageHeader_lText {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #666666;
      }
    }
    .teacher_homepageHeader_r {
      .teacher_homepageHeader_r1_active {
        background-color: #2ba4e7ff;
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #ffffff;
        width: 100px;
        height: 48px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 10px;
      }
      display: flex;
      flex-direction: column;
      align-items: center;
      .teacher_homepageHeader_r1 {
        width: 100px;
        height: 48px;
        border: 2px solid #2ba4e7;
        border-radius: 8px;
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #2ba4e7;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 10px;
        cursor: pointer;
      }
      .teacher_homepageHeader_r2 {
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #666666;
      }
    }
  }
}
.teacher_homepageFooter {
  width: 1200px;
  margin: 0 auto;
  .teacher_homepageFooter_title {
    height: 20px;
    font-size: 20px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #000000;
  }
  ul {
    margin: 20px 0;
    display: flex;
    // justify-content: space-between;
    flex-wrap: wrap;
    li:nth-child(5n) {
      margin-right: 0;
    }
    li {
      position: relative;
      .jingxuan {
        position: absolute;
        left: 0;
        top: 0;
        width: 50px;
        height: 50px;
        img {
          width: 50px;
          height: 50px;
        }
      }
      margin: 20px 50px 0 0;
      width: 200px;
      height: 230px;
      box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.06);
      border-radius: 4px;
      .teacher_homepageFooter_img {
        width: 200px;
        height: 150px;
        background: #000000;
        border-radius: 4px 4px 0px 0px;
        img {
          width: 200px;
          height: 150px;
          background: #000000;
          border-radius: 4px 4px 0px 0px;
        }
      }
      .teacher_homepageFooter_name {
        display: flex;
        flex-direction: column;
        padding: 10px;
        span:nth-child(1) {
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #030303;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
        }
      }
    }
  }
}
.morelook {
  margin: 40px auto;
  width: 187px;
  height: 48px;
  background: #2ba4e7;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #ffffff;
}
</style>
