<template>
  <div class="videoCourse">
    <!-- 精品课程 -->
    <div class="m_Boutique">
      <div class="m_Boutique_header">
        <div class="m_Boutique_header_left">精品课程</div>
        <div class="m_Boutique_header_right">更多 ></div>
      </div>
      <div class="m_Boutique_list">
        <div class="m_Boutique_list_item" v-for="(v,i) in newCourse" :key="i"
          @click="$router.push({path:`/m_index_videoCourse/${v.id}`})">
          <div class="m_Boutique_list_item_img">
            <img :src="v.img" alt="">
          </div>
          <div class="m_Boutique_list_item_center">
            <div class="m_Boutique_list_item_center1">{{v.course_name}}</div>
            <div class="m_Boutique_list_item_center2" v-html="v.description"></div>
            <div class="m_Boutique_list_item_center3">{{moment(v.created_at * 1000).format('HH:mm')}}</div>

          </div>
        </div>
      </div>
    </div>
    <!-- 免费课程 -->
    <div class="m_Boutique free">
      <div class="m_Boutique_header">
        <div class="m_Boutique_header_left">免费课程</div>
        <div class="m_Boutique_header_right free">更多 ></div>
      </div>
      <div class="m_Boutique_list">
        <div class="m_Boutique_list_item" v-for="(v,i) in freeCourse" :key="i"
          @click="$router.push({path:`/m_index_videoCourse/${v.id}`})">
          <div class="m_Boutique_list_item_img">
            <img :src="v.img" alt="">
          </div>
          <div class="m_Boutique_list_item_center">
            <div class="m_Boutique_list_item_center1">{{v.course_name}}</div>
            <div class="m_Boutique_list_item_center2" v-html="v.description"></div>
            <div class="m_Boutique_list_item_center3">{{moment(v.created_at * 1000).format('HH:mm')}}</div>

          </div>
        </div>
      </div>
    </div>
    <!-- 教师推荐 -->
    <div class="m_recommendTeacher">
      <div class="m_recommendTeacher-header">
        <div class="m_recommendTeacher-header-left">教师推荐</div>
        <div class="m_recommendTeacher-header-right" @click="handle_teach">更多></div>
      </div>
      <div class="m_recommendTeacher-center">
        <div class="m_recommendTeacher-center_item" v-for="(v,i) in recommendlist" :key="i">
          <div class="m_recommendTeacher-center_item_icon">
            <img :src="v.icon" alt="">
          </div>
          <div class="m_recommendTeacher-center_item_name">
            <div class="m_recommendTeacher-center_item_name1">
              <div class="m_recommendTeacher-center_item_name1_l"> {{v.name}}</div>
              <div class="m_recommendTeacher-center_item_name1_r"> {{v.course_count}}</div>

            </div>
            <div class="m_recommendTeacher-center_item_name2">院校：{{v.school_name}}</div>
            <div class="m_recommendTeacher-center_item_name3">职业：{{v.major_name}}</div>
          </div>
        </div>
      </div>
      <div class="m_recommendTeacher-footer" @click="handle_footerchange">换一组</div>
    </div>
    <keep-alive v-if="isReloadData">
      <indexTeacher v-if="isteacth_show" @index_teacher='handle_teacherShow'></indexTeacher>
    </keep-alive>
  </div>
</template>

<script>
import { Indicator, Toast } from 'mint-ui'
import { get_Course, get_recommend } from '@/api/common'
import indexTeacher from '@/view/mobile_page/components/m_index/m_index_teacher'
export default {
  components: { indexTeacher },
  data () {
    return {
      courseList: [],
      newCourse: [],
      freeCourse: [],
      recommendlist: [],
      isteacth_show: false,
      isReloadData: true,
      m: 1,
    }

  },
  // 暴露父页面的'方法' 父传子
  provide () {
    return {
      reload: this.reload
    }
  },

  methods: {
    // 刷新事件
    reload () {
      this.isReloadData = false
      this.$nextTick(() => {
        this.isReloadData = true // 从false到true的过程刷新子页面
      })
    },

    get_Course () {
      get_Course().then(res => {
        console.log(res)
        if (res.data.data.length > 6) {
          this.courseList = res.data.data.slice(0, 6)
        } else {
          this.courseList = res.data.data
        }
        // 获取精品课程 和 获取免费课程
        res.data.data.forEach((v, i) => {
          if (v.is_charge === 1) {
            this.newCourse.push(v)
            console.log(this.newCourse);

            if (this.newCourse.length > 4) {
              this.newCourse.length = 4
            }
          }
          if (v.is_charge === 0) {
            this.freeCourse.push(v)
            if (this.freeCourse.length > 4) {
              this.freeCourse.length = 4
            }
          }
        })
      })
    },

    // 老师推荐的更多
    handle_teach () {
      this.isteacth_show = true
    },
    // 关闭老师推荐
    handle_teacherShow () {
      this.isteacth_show = false
    },
    // 教师推荐换一组
    handle_footerchange () {
      get_recommend().then(res => {
        console.log(res)
        if (res.data.data.length >= 4 * this.m && res.data.data.length <= 4 * (this.m + 1)) {
          this.recommendlist = res.data.data.slice(4 * this.m, 4 * (this.m + 1))
          this.m++
          return
        }
        if (res.data.data.length < this.m * 4) this.m = 0
        this.recommendlist = res.data.data.slice(4 * this.m, 4 * (this.m + 1))
        this.m++

      })
    },
    // 获取教师推荐
    get_recommend () {
      Indicator.open({
        text: '加载中...',
        spinnerType: 'fading-circle'
      })
      get_recommend().then(res => {
        console.log(res)
        if (res.code === 200) {
          if (res.data.data.length > 4) {
            this.recommendlist = res.data.data.slice(0, 4)
          } else {
            this.recommendlist = res.data.data
          }
        }
        Indicator.close()
      })
    },

  },
  mounted () {
    this.get_Course()
    this.get_recommend()
  }
}
</script>

<style lang='less' scoped>
.videoCourse {
  // height: 100vh;
  background: #f7f7f7;
  .m_Boutique {
    width: 6.86rem;
    margin: 0.4rem auto;
    .m_Boutique_header {
      display: flex;
      justify-content: space-between;
      .m_Boutique_header_left {
        font-size: 0.34rem;
        font-family: PingFang SC;
        font-weight: bold;
        color: #000000;
      }
      .m_Boutique_header_right {
        font-size: 0.24rem;
        font-family: PingFang SC;
        font-weight: 500;
        color: #b1b1b1;
      }
    }
    .m_Boutique_list {
      display: flex;
      flex-direction: column;
      .m_Boutique_list_item {
        display: flex;
        margin-top: 0.3rem;
        background-color: #fff;
        border-radius: 8px;
        padding: 0.2rem;
        height: 2.36rem;
        .m_Boutique_list_item_img {
          width: 1.96rem;
          height: 1.96rem;
          border-radius: 8px;
          box-shadow: 0px 0px 0.03rem 0px rgba(0, 0, 0, 0.5);
          img {
            width: 1.96rem;
            height: 1.96rem;
            border-radius: 8px;
          }
        }
        .m_Boutique_list_item_center {
          display: flex;
          flex-direction: column;
          margin-left: 0.2rem;
          justify-content: space-between;
          .m_Boutique_list_item_center1 {
            font-size: 0.32rem;
            font-family: PingFang SC;
            font-weight: bold;
            color: #000000;
          }
          .m_Boutique_list_item_center2 {
            font-size: 0.24rem;
            font-family: PingFang SC;
            font-weight: 500;
            color: #b5b5b5;
            width: 4.3rem;
            height: 8.4rem;
            background: #f9f9f9;
            border-radius: 4px;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            padding: 0.2rem;
            margin: 0.1rem 0;
          }
          .m_Boutique_list_item_center3 {
            font-size: 0.24rem;
            font-family: PingFang SC;
            font-weight: 500;
            color: #4a4a4a;
          }
        }
      }
    }
  }
  .m_recommendTeacher {
    width: 6.86rem;
    margin: 0.3rem auto;
    background-color: #fff;
    border-radius: 8px;
    .m_recommendTeacher-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.2rem;
      .m_recommendTeacher-header-left {
        font-size: 0.34rem;
        font-family: PingFang SC;
        font-weight: bold;
        color: #000000;
      }
      .m_recommendTeacher-header-right {
        font-size: 0.24rem;
        font-family: PingFang SC;
        font-weight: 500;
        color: #b1b1b1;
      }
    }
    .m_recommendTeacher-center {
      display: flex;
      padding: 0.1rem 0.2rem;
      justify-content: space-between;
      flex-wrap: wrap;
      .m_recommendTeacher-center_item {
        margin-bottom: 0.3rem;
        .m_recommendTeacher-center_item_icon {
          width: 3.08rem;
          height: 3.08rem;
          border-radius: 8px;
          box-shadow: 0px 0px 0.03rem 0px rgba(0, 0, 0, 0.5);
          img {
            border-radius: 8px;
            width: 3.08rem;
            height: 3.08rem;
          }
        }
        .m_recommendTeacher-center_item_name {
          .m_recommendTeacher-center_item_name1 {
            display: flex;
            justify-content: space-between;
            margin: 0.1rem 0;
            .m_recommendTeacher-center_item_name1_l {
              font-size: 0.32rem;
              font-family: PingFang SC;
              font-weight: bold;
              color: #000000;
            }
            .m_recommendTeacher-center_item_name1_r {
              font-size: 0.24rem;
              font-family: PingFang SC;
              font-weight: 500;
              color: #000000;
            }
          }
          .m_recommendTeacher-center_item_name2,
          .m_recommendTeacher-center_item_name3 {
            font-size: 0.22rem;
            font-family: PingFang SC;
            font-weight: 500;
            color: #999999;
          }
        }
      }
    }
    .m_recommendTeacher-footer {
      display: flex;
      align-items: center;
      justify-content: center;
      padding-bottom: 0.2rem;
      font-size: 0.26rem;
      font-family: PingFang SC;
      font-weight: 500;
      color: #0da1ff;
    }
  }
}
</style>
