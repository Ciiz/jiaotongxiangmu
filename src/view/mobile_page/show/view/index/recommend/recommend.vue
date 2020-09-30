<template>
  <div class="recommend_big ">
    <div id='recommend'>

      <div class="recommend-choose">
        <div @click="$router.push({name:'m_school_news'})">
          <div>
            <Icon type="ios-bookmarks-outline" />
          </div>
          <div>校内新闻</div>
        </div>
        <div>
          <div>
            <Icon type="ios-time-outline" />
          </div>
          <div>通知公告</div>
        </div>
        <div>
          <div>
            <Icon type="ios-volume-up" />
          </div>
          <div>最新公告</div>
        </div>
        <div>
          <div>
            <Icon type="ios-chatboxes-outline" />
          </div>
          <div>问题讨论</div>
        </div>
      </div>
      <!--所有 学校 -->
      <ul ref="schoolList">

        <li class="m_allschool" id="m_allschool" ref="li" v-for="(item,index) in schoolList" :key="index"
          style="display:none">
          <div class="m_allschool_a">
            <div class="m_allschool_icon"><img :src="item.school_icon" alt=""></div>
            <div class="m_allschool_school_name">
              <div class="m_allschool_school_name_b">{{item.school_name}}</div>
              <div class="m_allschool_school_name_s">查看该院校所有课程</div>
            </div>
            <div class="m_allschool_name" @click="$router.push({name:'m_index_school'})">所有院校 ></div>
          </div>
        </li>
      </ul>
      <indexSchool v-if="isSchool_show" @handle_schoolClose='handle_schoolClose'></indexSchool>
      <!-- 猜你喜欢 -->
      <div class="m_allcourse_like">
        <div class="m_allcourse_like_header">
          <div class="m_allcourse_like_header_l">猜你喜欢</div>
          <div class="m_allcourse_likee_header_r" @click="handle_more">更多 ></div>
        </div>
        <div class="m_allcourse_like_list">
          <div class="m_allcourse_like_item" v-for="(v,i) in courseList" :key="i">
            <div class="m_allcourse_like_item_icon"><img :src="v.img" alt=""></div>
            <div class="m_allcourse_like_item_description" v-html="v.description"></div>
          </div>
        </div>
        <div class="m_allcourse_like_footer">
          <span @click="handle_change">换一批</span>
        </div>
      </div>
      <indexLike v-if="ishshow" @handleslot='handle_slot'></indexLike>
      <!-- 精品课程 -->
      <div class="m_Boutique">
        <div class="m_Boutique_header">
          <div class="m_Boutique_header_left">精品课程</div>
          <div class="m_Boutique_header_right">更多 ></div>
        </div>
        <div class="m_Boutique_list">
          <div class="m_Boutique_list_item" v-for="(v,i) in newCourse" :key="i">
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
          <div class="m_Boutique_list_item" v-for="(v,i) in freeCourse" :key="i">
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
      <div></div>

    </div>
  </div>
</template>
<script>
import indexLike from '@/view/mobile_page/components/m_index/m_index_like'

import indexTeacher from '@/view/mobile_page/components/m_index/m_index_teacher'
import { get_Course, get_recommend } from '@/api/common'
import log from 'video.js/es5/utils/log'
// import log from 'video.js/es5/utils/log'

export default {
  components: { indexLike, indexTeacher },
  data () {
    return {
      schoolList: [], // 所有学校
      courseList: [], // 猜你喜欢
      n: 0,
      newCourse: [], // 精品课程
      freeCourse: [], // 免费课程
      recommendlist: [], // 教师推荐
      m: 1,
      ishshow: false,
      isteacth_show: false,
      isReloadData: true,
      isSchool_show: false // 所有院校的组件打开和关闭
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
    // 关闭老师推荐
    handle_teacherShow () {
      this.isteacth_show = false
    },
    // 老师推荐的更多
    handle_teach () {
      this.isteacth_show = true
    },

    // 关闭猜你喜欢的更多
    handle_slot () {
      this.ishshow = false
    },
    // 猜你喜欢的更多
    handle_more () {
      this.ishshow = true
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
    // 换一批 猜你喜欢
    handle_change () {
      get_Course().then(res => {
        console.log(res)
        if (res.data.data.length >= 6 * this.m && res.data.data.length <= 6 * (this.m + 1)) {
          this.courseList = res.data.data.slice(6 * this.m, 6 * (this.m + 1))
          this.m++
          return
        }
        if (res.data.data.length < this.m * 6) this.m = 0
        this.courseList = res.data.data.slice(6 * this.m, 6 * (this.m + 1))
        this.m++
      })
    },
    // 获取教师推荐
    get_recommend () {
      get_recommend().then(res => {
        console.log(res)
        if (res.code === 200) {
          if (res.data.data.length > 4) {
            this.recommendlist = res.data.data.slice(0, 4)
          } else {
            this.recommendlist = res.data.data
          }
        }
      })
    },
    getSchoolList () {
      // 获取学校列表
      this.schoolList = []
      this.axios
        .request({
          method: 'get',
          url: '/index.php/Home/Index/getSchoolList'
        })
        .then(res => {
          if (res.code === 200) {
            this.schoolList = res.data.list
            console.log(this.schoolList)
          }
        })
    },
    // 获取猜你喜欢
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
    // 手指滑动监听处理
    getallschool () {
      setTimeout(() => {
        var Li = document.querySelectorAll('.m_allschool')
        Li[0].style.display = 'block'
        var startx, starty
        // 获得角度
        function getAngle (angx, angy) {
          return Math.atan2(angy, angx) * 180 / Math.PI
        };
        // 根据起点终点返回方向 1向上滑动 2向下滑动 3向左滑动 4向右滑动 0点击事件
        function getDirection (startx, starty, endx, endy) {
          var angx = endx - startx
          var angy = endy - starty
          var result = 0
          // 如果滑动距离太短
          if (Math.abs(angx) < 2 && Math.abs(angy) < 2) {
            return result
          }
          var angle = getAngle(angx, angy)
          if (angle >= -135 && angle <= -45) {
            result = 1
          } else if (angle > 45 && angle < 135) {
            result = 2
          } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
            result = 3
          } else if (angle >= -45 && angle <= 45) {
            result = 4
          }
          return result
        }
        // 手指开始触摸屏幕
        for (let i = 0; i <= Li.length; i++) {
          Li[i].index = i
          Li[i].addEventListener('touchstart', function (e) {
            // var j = this.index
            document.querySelector('body').style.overflow = 'hidden'
            startx = e.touches[0].pageX
            starty = e.touches[0].pageY
          })
          // 手指离开屏幕
          Li[i].addEventListener('touchend', function (e) {
            document.querySelector('body').style.overflow = 'auto'
            var endx, endy
            var j = this.index
            endx = e.changedTouches[0].pageX
            endy = e.changedTouches[0].pageY
            var direction = getDirection(startx, starty, endx, endy)
            switch (direction) {
              case 0:
                break
              case 1:
                // alert("向上！");
                Li[j].style.display = 'none'
                Li[j + 1].style.display = 'block'
                if (j === Li.length - 2) {
                  alert('已经到最后了')
                }
                break
            }
          }, false)
        }
      }, 800)
    }
  },
  updated () {
    // this.getallschool()
  },
  mounted () {
    this.getSchoolList()
    this.get_Course()
    this.get_recommend()
    this.getallschool()
  }
}
</script>
<style lang='less' scoped>
.hidden {
  overflow: hidden;
}
.m_allschool {
  margin-top: 0.3rem;
  .m_allschool_a {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    border-radius: 8px;
    width: 6.86rem;
    height: 1.3rem;
    margin: 0 auto;
    padding: 0.2rem;
  }
  .m_allschool_school_name {
    flex: 1;
    margin-left: 0.3rem;

    .m_allschool_school_name_b {
      font-size: 0.32rem;
      font-family: PingFang SC;
      font-weight: bold;
      color: #222222;
    }
    .m_allschool_school_name_s {
      font-size: 0.22rem;
      font-family: PingFang SC;
      font-weight: 500;
      color: #b1b1b1;
    }
  }
  .m_allschool_name {
    font-size: 0.28rem;
    font-family: FZLanTingHeiS-B-GB;
    font-weight: 400;
    color: #3b9bff;
  }
  .m_allschool_icon {
    img {
      width: 0.7rem;
      height: 0.7rem;
      border-radius: 50%;
    }
  }
}
.m_allcourse_like {
  width: 6.86rem;
  background-color: #fff;
  margin: 0 auto;
  margin-top: 0.3rem;
  .m_allcourse_like_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.1rem 0.2rem;
    margin-bottom: 0.1rem;
    .m_allcourse_like_header_l {
      font-size: 0.34rem;
      font-family: PingFang SC;
      font-weight: bold;
      color: #222222;
      .m_allcourse_likee_header_r {
        font-size: 0.24rem;
        font-family: PingFang SC;
        font-weight: 500;
        color: #b2b2b2;
      }
    }
  }
  .m_allcourse_like_list {
    display: flex;

    flex-wrap: wrap;
    padding-left: 0.2rem;
    // margin-bottom: 0.2rem;
    .m_allcourse_like_item {
      width: 33.33%;

      .m_allcourse_like_item_icon {
        width: 2rem;
        height: 2rem;

        box-shadow: 0px 0px 0.03rem 0px rgba(0, 0, 0, 0.5);
        img {
          width: 2rem;
          height: 2rem;
        }
      }
      .m_allcourse_like_item_description {
        margin: 0.2rem 0;
        width: 90%;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
      }
    }
  }
  .m_allcourse_like_footer {
    display: flex;
    text-align: center;
    justify-content: center;
    padding: 0.2rem 0;
    font-size: 0.26rem;
    font-family: PingFang SC;
    font-weight: 500;
    color: #3b9bff;
  }
}
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
</style>
