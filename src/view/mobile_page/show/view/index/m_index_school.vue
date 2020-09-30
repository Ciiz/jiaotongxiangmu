<template>
  <div class="m_index_school">
    <cell class="m_index_school_title" title="合作院校">
      <span slot="left"><img src="@/assets/images/mobile_teacher/back.png" alt="" @click="$router.back(-1)"></span>
      <span slot="right" class="m_index_school_r" @click="$router.push({name:'searchpage'})"><img
          src="@/assets/images/mobile_teacher/search2.png" alt=""></span>
    </cell>
    <div class="m_index_school_num">
      <span class="m_index_school_num1">合作院校：{{allSchool.length}} 所</span>
      <span class="m_index_school_num2">按课程数量排序</span>
    </div>

    <mt-spinner v-show="list<1 && InitialLoading" color="#26a2ff" class="center"></mt-spinner>
    <mt-loadmore :top-method="loadTop" @top-status-change="handleTopChange" :bottom-method="loadBottom"
      @bottom-status-change="handleBottomChange" ref="loadmore" :bottom-all-loaded="allLoaded" :auto-fill="false">
      <ul>
        <li class="m_index_school_list" v-for="(v,i) in newarr" :key="i" @click="handle_item(i)">
          <div class="m_index_school_list_l">
            <span :class="{red: i+1 ==1,bulue: i+1 ==2, yellow:i+1==3} ">{{i+1}}</span>
          </div>
          <span class="m_index_school_list_r">
            <div class="m_index_school_list_r_img"><img :src="v.school_icon" alt=""></div>
            <div class="m_index_school_list_r_name">
              <div class="m_index_school_list_r_name_top">{{v.school_name}}</div>
              <div class="m_index_school_list_r_name_num">
                <div class="m_index_school_list_r_name_num1">拥有课程 ：{{v.course_num}}</div>
                <div class="m_index_school_list_r_name_num2"> 拥有教师 ：{{v.teacher_num}}</div>
              </div>
            </div>
          </span>
        </li>
      </ul>
      <div slot="top" class="mint-loadmore-top" style="text-align:center">
        <span v-show="topStatus !== 'loading'" :class="{ 'is-rotate': topStatus === 'drop' }">↓</span>
        <mt-spinner color="#26a2ff" v-show="topStatus == 'loading'"></mt-spinner>
      </div>
      <div v-if="allLoaded" style="text-align:center;" class="data-none">没有更多数据了</div>
      <div slot="bottom" class="mint-loadmore-bottom">
        <span v-show="bottomStatus !== 'loading'" :class="{ 'is-rotate': bottomStatus === 'drop' }">↑</span>
        <span v-show="bottomStatus === 'loading'">
          <mt-spinner v-show="bottomStatus == 'loading'" color="#26a2ff"></mt-spinner>
        </span>
      </div>
    </mt-loadmore>

  </div>
</template>

<script>

import cell from '@/view/mobile_page/components/public_cell'
import { Indicator } from 'mint-ui'
import { getSchoolList } from '@/api/common'
import log from 'video.js/es5/utils/log'
// import log from 'video.js/es5/utils/log'
export default {
  components: {
    cell
  },
  data () {
    return {
      allSchool: [],
      // examplename: 'Loadmore',
      pageNum: 1, // 页码
      InitialLoading: true, // 初始加载
      list: 0, // 数据
      allLoaded: false, // 数据是否加载完毕
      bottomStatus: '', // 底部上拉加载状态
      wrapperHeight: 0, // 容器高度
      topStatus: '', // 顶部下拉加载状态
      pageIndex: 1,
      pageSize: 6,
      newarr: [],
      testarr: []
    }
  },
  methods: {
    handleBottomChange (status) {
      this.bottomStatus = status
    },
    loadBottom () {
      this.handleBottomChange('loading')// 上拉时 改变状态码
      this.pageIndex++
      this.pageNum += 1
      if (this.pageNum <= 3) { // 最多下拉三次
        this.list += 12// 上拉加载 每次数值加12
      } else {
        this.allLoaded = true// 数据加载完毕 禁用上拉加载
      }
      this.$refs.loadmore.onBottomLoaded()
      this.getschoolList()
      this.handleBottomChange('loadingEnd')// 数据加载完毕 修改状态码
    },
    handleTopChange (status) {
      this.topStatus = status
    },
    loadTop () { // 下拉刷新 模拟数据请求这里为了方便使用一次性定时器
      this.handleTopChange('loading')// 下拉时 改变状态码
      this.pageNum = 1
      this.allLoaded = false// 下拉刷新时解除上拉加载的禁用
      this.list = 12// 下拉刷新 数据初始化
      this.refresh()
      if (this.testarr.length < this.pageSize) {
        this.refresh()
      }
      this.handleTopChange('loadingEnd')// 数据加载完毕 修改状态码
      this.$refs.loadmore.onTopLoaded()
    },
    handle_item (i) {
      console.log(i)
      this.$router.push({ path: `/m_index_school_team/${this.newarr[i].id} ` })
      this.$store.commit('setSschoolMesage', this.newarr[i])
    },

    compare (property) {
      return function (a, b) {
        var value1 = a[property]
        var value2 = b[property]
        return value2 - value1 // value2>value1---降序  value1>value2 ---升序
      }
    },
    // 下拉刷新页面
    async refresh () {
      this.pageIndex = 1
      let res = await getSchoolList({
        page: this.pageIndex,
        page_size: this.pageSize
      })
      var course_num = []
      var course_num = res.data.list.map(v => {
        return v
      })
      this.newarr = course_num.sort(this.compare('course_num')) // 排序
    },
    // 一次性获取列表数据
    getdata_school () {
      this.axios.request({
        method: 'get',
        url: '/index.php/Home/Index/getSchoolList',
        params: {}
      }).then(res => {
        console.log(res)
        this.allSchool = res.data.list
      })
    },
    // 获取列表数据
    async getschoolList () {
      let res = await getSchoolList(
        {
          page: this.pageIndex,
          page_size: this.pageSize
        }
      )
      this.testarr = res.data.list
      this.newarr.push(...res.data.list)
      var course_num = []
      var course_num = this.newarr.map(v => {
        return v
      })
      this.newarr = course_num.sort(this.compare('course_num')) // 排序
      console.log(this.newarr)

      if (res.data.list.length < this.pageSize) {
        this.allLoaded = true
      }
    }

  },
  mounted () {
    this.getdata_school()
    this.getschoolList()
    let windowWidth = document.documentElement.clientWidth// 获取屏幕宽度
    if (windowWidth >= 768) { // 这里根据自己的实际情况设置容器的高度
      this.wrapperHeight = document.documentElement.clientHeight - 105
    } else {
      this.wrapperHeight = document.documentElement.clientHeight - 80
    }
    setTimeout(() => { // 页面挂载完毕 模拟数据请求 这里为了方便使用一次性定时器
      this.list = 12
    }, 1500)
  }
}
</script>

<style lang='less' scoped>
/deep/.mint-spinner-snake {
  margin: 0 auto;
}
.red {
  color: #ff0000ff;
}
.bulue {
  color: #ff6600ff;
}
.yellow {
  color: #ffcc00ff;
}

.m_index_school {
  width: 100vw;
  height: 100vh;
  z-index: 999;
  background-color: #fff;
  position: fixed;
  left: 0;
  top: 0;
  overflow: scroll;
  // overflow-y: auto;
  .m_index_school_title {
    border-bottom: 1px solid #ccc;
    .m_index_school_r {
      width: 0.4rem;
      height: 0.4rem;
      img {
        width: 0.4rem;
        height: 0.4rem;
      }
    }
  }
  .m_index_school_num {
    margin: 0 auto;
    width: 6.86rem;
    display: flex;
    padding: 0.4rem 0;
    justify-content: space-between;
    border-bottom: 1px solid #ccc;
    .m_index_school_num1 {
      font-size: 0.24rem;
      font-family: PingFang SC;
      font-weight: 500;
      color: #000000;
    }
    .m_index_school_num2 {
      font-size: 0.24rem;
      font-family: PingFang SC;
      font-weight: 500;
      color: #999999;
    }
  }
  .m_index_school_list:nth-last-child(1) {
    margin-bottom: 0.4rem;
  }
  .m_index_school_list {
    display: flex;
    align-items: center;
    padding: 0.1rem 0.3rem;
    .m_index_school_list_l {
      padding: 0.1rem 0.5rem 0.1rem 0;

      font-size: 0.36rem;
      font-family: FZLanTingHeiS-H-GB;
      font-weight: bold;
      font-style: italic;
      color: #999999;
    }
    .m_index_school_list_r {
      flex: 1;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #ccc;
      padding: 0.3rem 0;
      .m_index_school_list_r_img {
        width: 1.2rem;
        height: 1.2rem;
        border-radius: 50%;
        margin-right: 0.2rem;
        img {
          width: 1.2rem;
          height: 1.2rem;
          border-radius: 50%;
        }
      }
      .m_index_school_list_r_name {
        display: flex;
        flex-direction: column;
        .m_index_school_list_r_name_top {
          margin-bottom: 0.2rem;
        }
        .m_index_school_list_r_name_num {
          display: flex;
          .m_index_school_list_r_name_num1 {
            margin-right: 0.4rem;
          }
        }
      }
    }
  }
}
</style>
