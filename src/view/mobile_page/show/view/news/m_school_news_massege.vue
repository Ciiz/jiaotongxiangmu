<template>
  <div class="schoolNewsMassege">
    <div class="schoolNewsMassege_header">
      <cell title="校内新闻">
        <span slot="left"><img src="@/assets/images/mobile_teacher/back.png" alt="" @click="$router.back(-1)"></span>
        <span slot="right" class="schoolNews_share">
          <img src="@/assets/images/mobile_teacher/fx.png" alt=""></span>
      </cell>
    </div>
    <div class="schoolNewsMassege_details">
      <div class="schoolNewsMassege_details_title">
        {{school_news.title}}
      </div>
      <div class="schoolNewsMassege_details_name">
        <div class="schoolNewsMassege_details_name1">来源：{{school_news.name}}</div>
        <div class="schoolNewsMassege_details_name2">
          {{moment(school_news.created_at * 1000).format('YYYY-MM-DD HH:mm')}}</div>
      </div>
      <div class="schoolNewsMassege_details_content" v-html="school_news.content">

      </div>
      <div class="schoolNewsMassege_details_cover">
        <img :src="school_news.cover" alt="">
      </div>
    </div>
  </div>
</template>
<script>
import cell from '@/view/mobile_page/components/public_cell'
// import log from 'video.js/es5/utils/log'
export default {
  components: {
    cell
  },

  data () {
    return {
      school_news: {}
    }
  },

  methods: {

  },
  mounted () {
    this.axios.request({
      method: 'get',
      url: '/index.php/home/index/newsShow',
      params: {
        id: this.$route.params.id
      }
    }).then(res => {
      console.log(res)
      this.school_news = res.data.school_news
    })
  }
}
</script>

<style lang='less' scoped>
.schoolNewsMassege {
  .schoolNewsMassege_header {
    border-bottom: 1px solid #edededff;
    .schoolNews_share {
      img {
        width: 0.4rem;
        height: 0.4rem;
      }
    }
  }
  .schoolNewsMassege_details {
    width: 6.86rem;
    margin: 0.2rem auto;
    .schoolNewsMassege_details_title {
      font-size: 0.34rem;
      font-family: PingFang SC;
      font-weight: bold;
      color: #000000;
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }
    .schoolNewsMassege_details_name {
      display: flex;
      font-size: 0.24rem;
      font-family: PingFang SC;
      font-weight: 500;
      color: #787878;
      padding: 0.2rem 0;
      .schoolNewsMassege_details_name2 {
        margin-left: 0.9rem;
      }
    }
    .schoolNewsMassege_details_content {
      font-size: 0.32rem;
      font-family: PingFang SC;
      font-weight: 500;
      color: #343434;
    }
    .schoolNewsMassege_details_cover {
      img {
        width: 6.86rem;
        height: 3.92rem;
      }
    }
  }
}
</style>
