<template>
  <div class="searchpage">
    <div class="searchpage_header">
      <Icon type="ios-arrow-back" class="search-back-btn" @click="$router.back(-1)" />
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
              <div class="m-search_cell" v-if="searchChangelist" v-for="item in searchChangelist" :key="item.id">
                <div class="m-search_cell_img"><img :src="item.img" alt=""></div>
                <div class="m-search_cell_coursename">
                  <div class="tuxing">
                    <div class="tuxing_img"><img src="@/assets/images/mobile_teacher/tuxing.png" alt="">
                      <div class="tuxing_right" v-if="searchChangelist">课程</div>
                    </div>

                    <div class="m-search_cell_coursename1" ref="foresee" v-html="item.course_name"></div>
                  </div>
                  <div class="m-search_cell_courseuser">
                    <div class="m-search_cell_courseuser1">作者：{{item.name}}</div>
                    <div class="m-search_cell_courseuser2">章节:{{item.chapter_num}}</div>
                  </div>
                </div>
                <div class="m-search_cell_icon"><img src="@/assets/images/mobile_teacher/fanhui .png" alt=""></div>
              </div>
              <div class="m-search_cell" v-if="searchSchoollist" v-for="item in searchSchoollist" :key="item.id">
                <div class="m-search_cell_img"><img :src="item.school_icon" alt=""></div>
                <div class="m-search_cell_coursename">
                  <div class="tuxing">
                    <div class="tuxing_img"><img src="@/assets/images/mobile_teacher/tuxing.png" alt="">

                      <div class="tuxing_right" v-if="searchSchoollist">院校</div>

                    </div>

                    <div class="m-search_cell_coursename1" ref="foresee" v-html="item.school_name"></div>
                  </div>
                  <div class="m-search_cell_courseuser">
                    <div class="m-search_cell_courseuser1">作者：{{}}</div>
                    <div class="m-search_cell_courseuser2">章节:{{}}</div>
                  </div>
                </div>
                <div class="m-search_cell_icon"><img src="@/assets/images/mobile_teacher/fanhui .png" alt=""></div>
              </div>
              <div class="m-search_cell" v-if="searchUser" v-for="item in searchUser" :key="item.id">
                <div class="m-search_cell_img"><img :src="item.icon" alt=""></div>
                <div class="m-search_cell_coursename">
                  <div class="tuxing">
                    <div class="tuxing_img"><img src="@/assets/images/mobile_teacher/tuxing.png" alt="">

                      <div class="tuxing_right" v-if="searchUser">用户</div>

                    </div>

                    <div class="m-search_cell_coursename1" ref="foresee" v-html="item.name"></div>
                  </div>
                  <div class="m-search_cell_courseuser">
                    <div class="m-search_cell_courseuser1">职业：{{item.major_name}}</div>
                    <div class="m-search_cell_courseuser2">章节:{{item.course_num}}</div>
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
                <div class="m-search_courseList_time1">{{v.play_count}}</div>
                <div class="m-search_courseList_time2">
                  {{v.created_at}}</div>
              </div>
            </div>
          </div>

        </mt-tab-container-item>

        <mt-tab-container-item id="2">
          <div v-if="schoolLength===0" class="m_courelength">
            <div class="courelength1">{{`关键词"${value2}"`}}</div>
            <div class="courelength2">很抱歉，没有找到相关内容</div>
            <div class="courelength3"><img src="@/assets/images/mobile_teacher/search.png" alt=""></div>
          </div>
          <div class="search_schoolList" v-if="schoolLength !==0" v-for="(v,i) in search_school" :key="i">
            <div class="search_schoolList_icon"><img :src="v.school_icon" alt=""></div>
            <div class="search_schoolList_name">
              <div class="search_schoolList_name_t" v-html="v.school_name"></div>
              <div class="search_schoolList_name_b">
                <div class="search_schoolList_name_b1">拥有课程 ：{{v.course_num}}</div>
                <div class="search_schoolList_name_b2">拥有教师 ：{{v.teacher_num}}</div>
              </div>
            </div>
          </div>
        </mt-tab-container-item>
        <mt-tab-container-item id="3">
          <div v-if="teaherLength===0" class="m_courelength">
            <div class="courelength1">{{`关键词"${value2}"`}}</div>
            <div class="courelength2">很抱歉，没有找到相关内容</div>
            <div class="courelength3"><img src="@/assets/images/mobile_teacher/search.png" alt=""></div>
          </div>
          <div class="search_schoolList" v-for="(v,i) in searchUserlist" :key="i">
            <div class="search_schoolList_icon"><img :src="v.icon" alt=""></div>
            <div class="search_schoolList_name">
              <div class="search_schoolList_name_t" v-html="v.name"></div>
              <div class="search_schoolList_name_b">
                <div class="search_schoolList_name_b1">职业 ：{{v.major_name}}</div>
                <div class="search_schoolList_name_b2">ta的课程 ：{{v.course_num}}</div>
              </div>
            </div>
          </div>
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
          <li v-for="(item,index) in tearchdata" :key="index">{{item}}</li>
        </ul>
      </div>
    </div>
    <div class="search_hot">
      <div class="search_hot_title">热门搜索</div>
      <div class="search_hot_item">
        <ul>
          <li v-for="(v,i) in hotsearchList" :key="i">
            <img src="@/assets/images/mobile_teacher/huo.png" alt="" v-if="i+1===1 || i+1===2">
            <span v-else>●</span>
            {{v.course_name}}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>

// import search_course from '@/view/mobile_page/show/view/userCenter/teacher/tearch_search/search_course.vue'
import { hotsearch } from '@/api/common'
import { Toast } from 'mint-ui'
import log from 'video.js/es5/utils/log'
// import log from 'video.js/es5/utils/log'
export default {
  // components: { search_course },
  data () {
    return {
      courelength: '',
      selected: 'course',
      value: '',
      value2: '',
      searsh_arry: [],
      arr: [],
      searchChangelist: [],
      tearchdatas: [],
      search_school: [], // 搜索院校
      schoolLength: '',
      searchSchoollist: [], // 预搜索 院校
      searchUserlist: [],
      teaherLength: '',
      searchUser: [], // 预搜索 用户
      hotsearchList: []
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
        url: '/index.php/home/index/getSearch',
        params: {
          keyword: e
        }
      }).then(res => {
        console.log(res)
        if (res.data.course_data.length > 2) {
          this.searchChangelist = res.data.course_data.slice(0, 2)
        } else {
          this.searchChangelist = res.data.course_data
        }

        if (res.data.school_data.length > 2) {
          this.searchSchoollist = res.data.school_data.slice(0, 2)
        } else {
          this.searchSchoollist = res.data.school_data
        }
        if (res.data.teaher_data.length > 2) {
          this.searchUser = res.data.teaher_data.slice(0, 2)
        } else {
          this.searchUser = res.data.teaher_data
        }

        // 给每一个课程名称的关键字添加颜色
        this.searchChangelist.forEach(v => {
          var ss = this.value
          v.course_name = v.course_name.replace(ss, `<span style="color:#16C2AA">${ss}</span>`)
        })
        this.searchSchoollist.forEach(v => {
          var ss = this.value
          v.school_name = v.school_name.replace(ss, `<span style="color:#16C2AA">${ss}</span>`)
        })
        this.searchUser.forEach(v => {
          var ss = this.value
          v.name = v.name.replace(ss, `<span style="color:#16C2AA">${ss}</span>`)
        })
      })
    },
    // 热门搜索
    hot_search () {
      hotsearch({ page: 1, page_size: 12 }).then(res => {
        console.log(res)
        this.hotsearchList = res.data.course_data
      })
    },
    // 清空历史记录
    clear_history () {
      this.$store.commit('setsearchdata', [])
      localStorage.removeItem('mykeyword')
    },
    searchData () {
      this.search_list()
    },
    hangdle_search () {
      this.search_list()
    },
    // 搜索
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
        url: '/index.php/home/index/getSearch',
        params: {
          keyword: this.value
        }
      }).then(res => {
        console.log(res)

        this.searsh_arry = res.data.course_data // 课程的数据
        this.courelength = res.data.course_data.length // 课程的长度
        this.search_school = res.data.school_data // 院校的数据
        this.schoolLength = res.data.school_data.length // 院校的长度
        this.teaherLength = res.data.teaher_data.length // 用户的长度
        this.searchUserlist = res.data.teaher_data // 用户的数据
        this.value2 = this.value
        // 历史记录
        let arr = JSON.parse(localStorage.getItem('mykeyword')) || []
        var index = arr.indexOf(this.value)
        if (index !== -1) {
          arr.splice(index, 1)
        }
        if (arr.length >= 10) {
          arr.splice(arr.length - 1, 1)
        }
        arr.unshift(this.value)
        localStorage.setItem('mykeyword', JSON.stringify(arr))
        this.$store.commit('setsearchdata', JSON.parse(localStorage.getItem('mykeyword')) || [])
        // 给每一个课程名称的关键字添加颜色
        if (this.value) {
          this.searsh_arry.forEach(v => {
            var ss = this.value
            v.course_name = v.course_name.replace(new RegExp(ss, 'g'), `<span style="color:#16C2AA">${ss}</span>`)
          })
          this.search_school.forEach(v => {
            var ss = this.value
            v.school_name = v.school_name.replace(new RegExp(ss, 'g'), `<span style="color:#16C2AA">${ss}</span>`) // 操作dom的，必须是html
          })
          this.searchUserlist.forEach(v => {
            var ss = this.value
            v.name = v.name.replace(new RegExp(ss, 'g'), `<span style="color:#16C2AA">${ss}</span>`) // 操作dom的，必须是html
          })
        }
      })
    }
  },
  mounted () {
    this.hot_search()
    this.arr = JSON.parse(localStorage.getItem('mykeyword')) || []
    this.$store.commit('setsearchdata', JSON.parse(localStorage.getItem('mykeyword')) || [])
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
            padding: 0.2rem 0;
            border-bottom: 1px solid #ccc;
            .m-search_cell_img {
              width: 0.8rem;
              height: 0.8rem;
              border-radius: 8px;
              margin-right: 0.2rem;
              img {
                width: 0.8rem;
                height: 0.8rem;
                border-radius: 8px;
              }
            }
            .m-search_cell_coursename {
              flex: 1;
              .tuxing {
                display: flex;
                align-items: center;
                margin-bottom: 0.05rem;
                .tuxing_right {
                  font-size: 0.2rem;
                  font-family: PingFang SC;
                  font-weight: 500;
                  color: #fff;
                  position: absolute;
                  top: -2px;
                  left: 2px;
                }
                .tuxing_img {
                  position: relative;
                  overflow: hidden;
                  display: flex;
                  align-items: center;
                  img {
                    width: 0.68rem;
                    height: 0.3rem;
                  }
                }
              }
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
                  margin: 0 0.4rem 0 0;
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
    .search_schoolList {
      display: flex;
      align-items: center;
      margin: 0 auto;
      width: 6.86rem;
      padding: 0.2rem 0.4rem;
      margin-top: 0.2rem;
      border-bottom: 1px solid #ccc;
      .search_schoolList_icon {
        height: 1.2rem;
        width: 1.2rem;
        border-radius: 50%;
        img {
          border-radius: 50%;
          height: 1.2rem;
          width: 1.2rem;
        }
      }
      .search_schoolList_name {
        margin-left: 0.3rem;
        .search_schoolList_name_t {
          font-size: 0.36rem;
          font-family: PingFang SC;
          font-weight: bold;
          color: #000000;
        }
        .search_schoolList_name_b {
          font-size: 0.26rem;
          font-family: PingFang SC;
          font-weight: 500;
          color: #777777;
          display: flex;
          .search_schoolList_name_b2 {
            margin-left: 0.4rem;
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
  .search_hot {
    width: 6.86rem;
    margin: 0.4rem auto;
    .search_hot_title {
      font-size: 0.24rem;
      font-family: PingFang SC;
      font-weight: bold;
      color: #f63939;
    }
    .search_hot_item {
      ul {
        display: flex;
        flex-wrap: wrap;
        li {
          width: 50%;
          margin: 0.2rem 0;
          font-size: 0.24rem;
          font-family: PingFang SC;
          font-weight: 500;
          color: #333333;
          span {
            color: #999999ff;
          }
          img {
            width: 0.24rem;
            height: 0.24rem;
          }
        }
      }
    }
  }
}
</style>
