<template>
  <div class="schoolNews">

    <div class="schoolNews_header">
      <cell title="校内新闻">
        <span slot="left"><img src="@/assets/images/mobile_teacher/back.png" alt="" @click="$router.back(-1)"></span>
        <span slot="right" class="schoolNews_search" @click="$router.push({name:'searchpage'})">
          <img src="@/assets/images/mobile_teacher/search2.png" alt=""></span>
      </cell>
    </div>

    <div class="schoolNews_list">
      <mt-spinner v-show="list<1 && InitialLoading" color="#26a2ff" class="center"></mt-spinner>
      <mt-loadmore :top-method="loadTop" @top-status-change="handleTopChange" :bottom-method="loadBottom"
        @bottom-status-change="handleBottomChange" ref="loadmore" :bottom-all-loaded="allLoaded" :auto-fill="false">
        <ul>
          <li v-for="(item,index) in schoolNewsList" :key="index"
            @click="$router.push({ path: `/m_school_news_massege/${schoolNewsList[index].id}` })">
            <div class="schoolNews_list_l">
              <div class="schoolNews_list_l_title">
                {{item.title}}
              </div>
              <div class="schoolNews_list_l_name">
                <div class="schoolNews_list_l_name1">来源：{{item.name}}</div>
                <div class="schoolNews_list_l_name2">{{moment(item.created_at * 1000).format('YYYY-MM-DD HH:mm')}}</div>

              </div>
            </div>
            <div class="schoolNews_list_r">
              <img :src="item.cover" alt="">
            </div>
          </li>
        </ul>
        <div class="mint-loadmore-top" style="text-align:center">
          <!-- <span v-show="topStatus !== 'loading'" :class="{ 'is-rotate': topStatus === 'drop' }">↓</span> -->
          <mt-spinner color="#26a2ff" v-show="topStatus == 'loading'" type="snake"></mt-spinner>
        </div>
        <div v-if="allLoaded" style="text-align:center;" class="data-none">没有更多数据了</div>
        <div class="mint-loadmore-bottom">
          <span v-show="bottomStatus !== 'loading'" :class="{ 'is-rotate': bottomStatus === 'drop' }">↑</span>
          <!-- <span v-show="bottomStatus === 'loading'">
            <mt-spinner v-show="bottomStatus == 'loading'" color="#26a2ff" type="snake"></mt-spinner>
          </span> -->
        </div>
      </mt-loadmore>
    </div>

  </div>
</template>

<script>
import cell from '@/view/mobile_page/components/public_cell'
import { getSchoolList } from '@/api/common'
// import log from 'video.js/es5/utils/log'
export default {
  components: {
    cell
  },

  data () {
    return {
      schoolNewsList: [],
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
    }
  },

  methods: {
    handleBottomChange (status) {
      this.bottomStatus = status
    },
    handleTopChange (status) {
      this.topStatus = status
    },
    loadBottom () {
      this.handleBottomChange('loading')// 上拉时 改变状态码
      this.pageIndex++
      this.pageNum += 1
      setTimeout(() => {
        if (this.pageNum <= 3) { // 最多下拉三次
          this.list += 12// 上拉加载 每次数值加12
        } else {
          this.allLoaded = true// 数据加载完毕 禁用上拉加载
        }
        this.$refs.loadmore.onBottomLoaded()
        this.hangle_news()
        this.handleBottomChange('loadingEnd')// 数据加载完毕 修改状态码
      }, 500)

    },
    loadTop () { // 下拉刷新 模拟数据请求这里为了方便使用一次性定时器
      this.handleTopChange('loading')// 下拉时 改变状态码
      this.pageNum = 1
      this.allLoaded = false// 下拉刷新时解除上拉加载的禁用
      setTimeout(() => {
        this.list = 12// 下拉刷新 数据初始化
        this.refresh()
        if (this.schoolNewsList.length < this.pageSize) {
          this.refresh()
        }
        this.handleTopChange('loadingEnd')// 数据加载完毕 修改状态码
        this.$refs.loadmore.onTopLoaded()
      }, 500)

    },
    // 下拉刷新页面
    async refresh () {
      this.pageIndex = 1
      this.axios.request({
        method: 'get',
        url: '/index.php/home/index/getNews',
        params: {
          page: this.pageIndex,
          page_size: this.pageSize,
          schoolId: localStorage.getItem('schoolId')
        }
      }).then(res => {
        console.log(res);
        this.schoolNewsList = res.data.list
      })
    },
    hangle_news () {
      this.axios.request({
        method: 'get',
        url: '/index.php/home/index/getNews',
        params: {
          page: this.pageIndex,
          page_size: this.pageSize,
          schoolId: localStorage.getItem('schoolId')
        }
      }).then(res => {
        console.log(res)
        this.schoolNewsList.push(...res.data.list)

        if (res.data.list.length < this.pageSize) {
          this.allLoaded = true
        }
      })
    }
  },
  mounted () {
    this.hangle_news()
    let windowWidth = document.documentElement.clientWidth// 获取屏幕宽度
    if (windowWidth >= 768) { // 这里根据自己的实际情况设置容器的高度
      this.wrapperHeight = document.documentElement.clientHeight - 105
    } else {
      this.wrapperHeight = document.documentElement.clientHeight - 80
    }
    // this.list = 12
    setTimeout(() => { // 页面挂载完毕 模拟数据请求 这里为了方便使用一次性定时器
      this.list = 12
    }, 300)
  }
}
</script>

<style lang="less" scoped>
/deep/.mint-spinner-snake {
  margin: 0 auto;
}
.schoolNews {
  overflow: scroll;
  .schoolNews_header {
    border-bottom: 1px solid #edededff;
    .schoolNews_search {
      img {
        width: 0.34rem;
        height: 0.34rem;
      }
    }
  }
  .schoolNews_list {
    ul {
      width: 6.86rem;
      height: 100vh;
      margin: 0 auto;
      li {
        display: flex;
        align-items: center;
        margin: 0.2rem 0;
        border-bottom: 1px solid #ccccccff;
        padding: 0.2rem 0;
        .schoolNews_list_l {
          flex: 1;
          .schoolNews_list_l_title {
            font-size: 0.32rem;
            font-family: PingFang SC;
            font-weight: 500;
            color: #000000;
            margin-bottom: 0.1rem;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
          }
          .schoolNews_list_l_name {
            font-size: 0.24rem;
            font-family: PingFang SC;
            font-weight: 500;
            color: #999999;
            display: flex;
            .schoolNews_list_l_name2 {
              margin-left: 0.12rem;
            }
          }
        }
        .schoolNews_list_r {
          width: 2rem;
          height: 1.4rem;
          border-radius: 8px;
          img {
            width: 2rem;
            height: 1.4rem;
            border-radius: 8px;
          }
        }
      }
    }
  }
}
</style>
