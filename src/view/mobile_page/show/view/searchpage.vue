<template>
  <div class="searchpage">
    <div class="searchpage_header">
      <Icon type="ios-arrow-back" class="search-back-btn" @click="$router.back()" />
      <div class="div_sech">
        <!-- 解释：<form action="" target="frameFile"> 手机键盘添加搜索按钮，<iframe name='frameFile'
            style="display: none;"></iframe>禁止页面刷新，在当前页显示，手机上按
          搜索按钮查询，电脑端按回车键查询。 -->
        <form action="" target="frameFile">
          <mt-search v-model="value" class="m-search" cancel-text="取消" placeholder="搜索课程、教师、院校"
            @keyup.enter.native="searchData" :result.sync="searchChangelist" @input="searchChange">
            <div class="m-search_cell_b" ref="b">
              <div class="m-search_cell_icon">
                <img src="@/assets/images/mobile_teacher/searchicon 3.png" alt="">
                <span>搜索“<span style="color:#16C2AA">{{value}}</span>”</span>
              </div>
              <div class="m-search_cell" v-for="item in searchChangelist" :key="item.id">
                <div class="m-search_cell_img"><img :src="item.img" alt=""></div>
                <div class="m-search_cell_coursename">
                  <div class="m-search_cell_coursename1" ref="foresee" v-html="item.course_name"></div>
                  <div class="m-search_cell_courseuser">
                    <div class="m-search_cell_courseuser1">作者：{{item.user_name}}</div>
                    <div class="m-search_cell_courseuser2">章节:{{item.caNum}}</div>
                  </div>
                </div>
                <div class="m-search_cell_icon"><img src="@/assets/images/mobile_teacher/fanhui .png" alt=""></div>
              </div>
            </div>
          </mt-search>

        </form>

        <iframe name='frameFile' style="display: none;"></iframe>

      </div>
      <div class="m_seardh_bt">
        <mt-button @click="hangdle_search">搜索</mt-button>
      </div>

    </div>

    <div class="searchpage_center" ref="p">
      <mt-navbar v-model="selected">
        <mt-tab-item id="course">课程</mt-tab-item>
        <mt-tab-item id="2">院校</mt-tab-item>
        <mt-tab-item id="3">用户</mt-tab-item>
      </mt-navbar>
      <mt-tab-container v-model="selected">
        <mt-tab-container-item id="course">

          <div v-if="courelength===0" class="m_courelength">
            <div class="courelength1">{{`关键词"${value2}"`}}</div>
            <div class="courelength2">很抱歉，没有找到相关内容</div>
            <div class="courelength3"><img src="@/assets/images/mobile_teacher/search.png" alt=""></div>
          </div>
          <div class="m-search_courseList" v-if="courelength !==0" v-for="(v,i) in searsh_arry" :key="i">
            <div class="m-search_courseList_img">
              <img :src="v.img" alt="">
            </div>
            <div class="m-search_courseList_description_r">
              <div class="m-search_courseList_name " ref="coursename" v-html="v.course_name"></div>
              <div class="m-search_courseList_description" v-html="v.description"></div>
              <div class="m-search_courseList_time">
                <div class="m-search_courseList_time1">{{v.caNum}}</div>
                <div class="m-search_courseList_time2">
                  {{moment(v.created_at * 1000).format('HH:mm')}}</div>
              </div>
            </div>
          </div>

        </mt-tab-container-item>

        <mt-tab-container-item id="2">
          2
        </mt-tab-container-item>
        <mt-tab-container-item id="3">
          3
        </mt-tab-container-item>
      </mt-tab-container>
    </div>

    <div class="searchpage_history_b" v-if="value2 ==''">
      <div class="searchpage_history">
        <div class="searchpage_history_left">搜索历史</div>
        <div class="searchpage_history_right" @click="clear_history">清空</div>

      </div>
      <div class="searchpage_history_list">
        <ul>
          <li v-for="(item,index) in tearchdata" :key="index" @click="onSearch2(item)">{{item}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import search_course from '@/view/mobile_page/show/view/userCenter/teacher/tearch_search/search_course.vue'
// import { get_Course } from '@/api/common'
import { Toast } from 'mint-ui'
// import log from 'video.js/es5/utils/log'
export default {
  components: { search_course },
  data () {
    return {
      courelength: '',
      selected: 'course',
      value: '',
      value2: '',
      searsh_arry: [],
      arr: [],
      searchChangelist: []
    }
  },
  watch: {

  },
  computed: {
    tearchdata () {
      return this.$store.state.app.searchdata
    }
  },
  methods: {
    searchChange (e) {
      if (e) {
        this.$refs.p.style.display = 'none'
        this.$refs.b.style.display = 'block'
      }
      if (!e) return
      this.axios.request({
        method: 'get',
        url: '/home/index/recommendCourse',
        params: {
          keyword: e
        }
      }).then(res => {
        console.log(res)
        // this.searsh_arry = res.data.data
        this.searchChangelist = res.data.data
        // 给每一个课程名称的关键字添加颜色
        this.searchChangelist.forEach(v => {
          var ss = this.value
          v.course_name = v.course_name.replace(ss, `<span style="color:#16C2AA">${ss}</span>`)
          console.log(v.course_name)
        })
      })
    },
    onSearch2 () {

    },
    // 清空历史记录
    clear_history () {
      this.$store.commit('setsearchdata', [])
    },
    searchData () {
      this.search_list()
    },
    hangdle_search () {
      this.search_list()
    },
    search_list () {
      this.$refs.p.style.display = 'block'
      this.$refs.b.style.display = 'none'

      if (this.value.trim() === '') {
        Toast({
          message: '内容不能为空',
          duration: 2000
        })
        return
      }
      this.axios.request({
        method: 'get',
        url: '/home/index/recommendCourse',
        params: {
          keyword: this.value
        }
      }).then(res => {
        console.log(res)
        this.courelength = res.data.data.length
        this.value2 = this.value
        // this.search_result = res.data.data
        // this.searsh_arry = res.data.data
        // 历史记录
        let arr = this.tearchdata || []
        var index = arr.indexOf(this.value)
        if (index !== -1) {
          arr.splice(index, 1)
        }
        if (arr.length >= 10) {
          arr.splice(arr.length - 1, 1)
        }
        arr.unshift(this.value)
        this.$store.commit('setsearchdata', arr || [])
        // 给每一个课程名称的关键字添加颜色
        this.searsh_arry = res.data.data
        console.log(this.searsh_arry)
        if (this.value) {
          this.searsh_arry.forEach(v => {
            console.log(888)
            var ss = this.value
            v.course_name = v.course_name.replace(new RegExp(ss, 'g'), `<span style="color:#16C2AA">${ss}</span>`)
            console.log(v.course_name)
          })
        }
      })
    }
  },
  mounted () {
  }
}
</script>
<style lang='less' scoped>
.color {
  color: red;
}
.searchpage {
  height: 100%;
  /deep/.mint-button--normal {
    font-size: 0.34rem;
    width: 0.75rem;
    font-family: PingFang SC;
    font-weight: bold;
    color: #3b9bff;
    padding: 0;
    background-color: #fff;
    border: none;
    list-style: none;
    outline: none;
    margin: 0;
  }

  /deep/.mint-search {
    height: 100%;
    flex: 1;
  }
  .searchpage_header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    margin-top: 0.1rem;

    .div_sech {
      flex: 1;
      .m-search {
        .m-search_cell_b {
          height: 100vh;
          width: 100vw;
          margin: 0 auto;
          background-color: #fff;
          z-index: 999999;
          .m-search_cell_icon {
            display: flex;
            align-items: center;
            padding: 0.4rem 0.4rem;
            img {
              width: 0.34rem;
              height: 0.34rem;
              margin-right: 0.4rem;
            }
            span {
              font-size: 0.28rem;
              font-family: PingFang SC;
              font-weight: 500;
              color: #343434;
            }
          }
          .m-search_cell {
            display: flex;
            width: 90%;
            justify-content: space-between;
            align-items: center;
            margin-left: 0.3rem;
            margin-bottom: 0.2rem;
            .m-search_cell_img {
              img {
                width: 0.8rem;
                height: 0.8rem;
              }
            }
            .m-search_cell_coursename {
              flex: 1;
              .m-search_cell_coursename1 {
                font-size: 0.28rem;
                font-family: PingFang SC;
                font-weight: 500;
                color: #343434;
                margin-left: 0.2rem;
              }
              .m-search_cell_courseuser {
                display: flex;
                font-size: 0.24rem;
                font-family: PingFang SC;
                font-weight: 500;
                color: #787878;
                .m-search_cell_courseuser1 {
                  margin: 0 0.4rem 0 0.2rem;
                }
              }
            }
            .m-search_cell_icon {
              width: 0.24rem;
              height: 0.24rem;
            }
          }
        }
      }
    }
  }
  .searchpage_center {
    /deep/.mint-tab-item {
      padding: 12px 0;
      z-index: 1;
    }
    /deep/.mint-tab-container {
      z-index: 999 !important;
      // background-color: pink;
    }
    /deep/.mint-search-list {
      top: 0;
      left: 0;
      position: absolute;
      background-color: #fff;
      overflow: visible;
    }
    /deep/.mint-tab-item-label {
      font-size: 0.3rem;
    }
    .m_courelength {
      margin: 2rem auto;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      .courelength1 {
        font-size: 0.32rem;
        font-family: PingFang SC;
        font-weight: 500;
        color: #343434;
      }
      .courelength2 {
        font-size: 0.26rem;
        font-family: PingFang SC;
        font-weight: 500;
        color: #9a9a9a;
        margin: 0.2rem 0;
      }
      .courelength3 {
        img {
          width: 1.8rem;
          height: 1.8rem;
        }
      }
    }
    .m-search_courseList {
      display: flex;
      margin: 0.3rem 0.2rem;
      padding-bottom: 0.4rem;
      border-bottom: 1px solid #cccccc;

      .m-search_courseList_img {
        width: 1.4rem;
        height: 1.4rem;
        border-radius: 8px;
        img {
          width: 1.4rem;
          height: 1.4rem;
          border-radius: 8px;
        }
      }
      .m-search_courseList_description_r {
        margin-left: 0.3rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .m-search_courseList_name {
          font-size: 0.32rem;
          font-family: PingFang SC;
          font-weight: 500;
          color: #000000;
        }
        // .m-search_courseList_description > div label.search_color {
        //   color: #16c2aa;
        // }
        .m-search_courseList_description {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
          width: 5.2rem;
          height: 0.48rem;
          // text-align: center;
          line-height: 0.48rem;
          background: #f7f7f7;
          border-radius: 8px;
        }
        .m-search_courseList_time {
          display: flex;
          .m-search_courseList_time2 {
            margin-left: 0.7rem;
          }
        }
      }
    }
  }
  .searchpage_history_b {
    .searchpage_history {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 6.86rem;
      margin: 0.2rem auto;
      .searchpage_history_left {
        font-size: 0.24rem;
        font-family: PingFang SC;
        font-weight: bold;
        color: #000000;
      }
      .searchpage_history_right {
        font-size: 0.28rem;
        font-family: PingFang SC;
        font-weight: 500;
        color: #9a9a9a;
      }
    }
    .searchpage_history_list {
      width: 6.86rem;
      margin: 0.4rem auto;
      ul {
        display: flex;
        flex-wrap: wrap;
        // justify-content: space-between;
        justify-content: flex-start;
        li {
          margin: 0.2rem 0.34rem;
          height: 0.5rem;
          background-color: #f7f7f7;
          border-radius: 23px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 0.26rem;
          padding: 0.1rem 0.2rem;
          font-family: PingFang SC;
          font-weight: 500;
          color: #343434;
        }
      }
    }
  }
}
</style>
