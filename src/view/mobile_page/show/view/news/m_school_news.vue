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
    </div>
  </div>
</template>

<script>
import cell from '@/view/mobile_page/components/public_cell'
import log from 'video.js/es5/utils/log'
export default {
  components: {
    cell
  },

  data () {
    return {
      schoolNewsList: []
    }
  },

  methods: {
    hangle_news () {
      this.axios.request({
        method: 'get',
        url: '/index.php/home/index/getNews',
        params: {
          page: 1,
          page_size: 6,
          schoolId: localStorage.getItem('schoolId')
        }
      }).then(res => {
        console.log(res)
        this.schoolNewsList = res.data.list
      })
    }
  },
  mounted () {
    this.hangle_news()
  }
}
</script>

<style lang="less" scoped>
.schoolNews {
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
