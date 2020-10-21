<template>
  <div class="mobileWatch">
    <cell title="观看记录">
      <span slot="left"><img src="@/assets/images/mobile_teacher/back.png" alt="" @click="$router.back(-1)"></span>
      <span slot="right"></span>
    </cell>
    <div class="mobileWatch_list">
      <ul v-if="todayList.length !==0">
        <span class="daystyle">今天</span>
        <li v-for="(item,index) in todayList" :key="item.index">
          <div class="mobileWatch_list_footer">
            <div class=" mobileWatch_list_icon"><img :src="item.img" alt=""></div>
            <div class="mobileWatch_list_r">
              <div class="mobileWatch_list_rTitle">{{item.title}}</div>
              <div class="mobileWatch_list_description" v-html="item.course_description"></div>
              <div class="mobileWatch_list_rTime">
                <div class="mobileWatch_list_rTitle_l">时长：{{moment(item.video_time * 1000).format('mm:ss')}}</div>
                <div class="mobileWatch_list_rTitle_r">已看{{item.percent}}%</div>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <ul v-if="yesterdayList.length !==0">
        <span class="daystyle">昨天</span>
        <li v-for="(item,index) in yesterdayList" :key="item.index">
          <div class="mobileWatch_list_footer">
            <div class=" mobileWatch_list_icon"><img :src="item.img" alt=""></div>
            <div class="mobileWatch_list_r">
              <div class="mobileWatch_list_rTitle">{{item.title}}</div>
              <div class="mobileWatch_list_description" v-html="item.course_description"></div>
              <div class="mobileWatch_list_rTime">
                <div class="mobileWatch_list_rTitle_l">时长：{{moment(item.video_time * 1000).format('mm:ss')}}</div>
                <div class="mobileWatch_list_rTitle_r">已看{{item.percent}}%</div>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <ul v-if="moredayList.length !==0">
        <span class="daystyle">更早</span>
        <li v-for="(item,index) in moredayList" :key="item.index">
          <div class="mobileWatch_list_footer">
            <div class=" mobileWatch_list_icon"><img :src="item.img" alt=""></div>
            <div class="mobileWatch_list_r">
              <div class="mobileWatch_list_rTitle">{{item.title}}</div>
              <div class="mobileWatch_list_description" v-html="item.course_description"></div>
              <div class="mobileWatch_list_rTime">
                <div class="mobileWatch_list_rTitle_l">时长：{{moment(item.video_time * 1000).format('mm:ss')}}</div>
                <div class="mobileWatch_list_rTitle_r">已看{{item.percent}}%</div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { Indicator } from 'mint-ui'
import cell from '@/view/mobile_page/components/public_cell'
export default {
  components: { cell },

  data () {
    return {
      mobileWatch: [],
      todayList: [],
      yesterdayList: [],
      moredayList: []
    }
  },

  methods: {
    WatchList () {
      Indicator.open()
      this.axios.request({
        method: 'post',
        url: '/home/course/showMyViewRecord',
      }).then(res => {
        console.log(res);
        this.mobileWatch = res.data.data
        Indicator.close()
        var date = new Date();
        var dates = date.valueOf();
        res.data.data.map(v => {
          var tiems = dates - (v.created_at * 1000)
          v.created_time = Math.floor(tiems / 1000 / 60 / 60)

        });
        res.data.data.forEach(item => {
          if (item.created_time > 0 && item.created_time < 24) {
            this.todayList.push(item)
          }
          if (item.created_time > 24 && item.created_time < 48) {
            this.yesterdayList.push(item)
          }
          if (item.created_time > 48) {
            this.moredayList.push(item)
          }
        });
      })
    }
  },
  mounted () {
    this.WatchList()

  }
}
</script>

<style lang='less' scoped>
.mobileWatch {
  .mobileWatch_list {
    background: #f7f7f7;
    height: 100vh;
    width: 100%;
    padding: 0.1rem 0.2rem 0 0.2rem;
    ul {
      .daystyle {
        font-size: 0.26rem;
        font-family: PingFang SC;
        font-weight: 500;
        color: #666666;
        margin: 0.1rem 0;
      }
      li {
        .mobileWatch_list_footer {
          display: flex;
          padding: 0.2rem;
          margin: 0.3rem 0;
          border-radius: 8px;
          background-color: #fff;
          .mobileWatch_list_icon {
            width: 2.2rem;
            height: 1.65rem;
            border-radius: 8px;
            img {
              width: 2.2rem;
              height: 1.65rem;
              border-radius: 8px;
            }
          }
          .mobileWatch_list_r {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            flex: 1;
            margin-left: 0.2rem;
            .mobileWatch_list_rTitle {
              font-size: 0.34rem;
              font-family: PingFang SC;
              font-weight: bold;
              color: #000000;
            }
            .mobileWatch_list_description {
              font-size: 0.24rem;
              font-family: PingFang SC;
              font-weight: 500;
              color: #999999;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 1;
              overflow: hidden;
            }
            .mobileWatch_list_rTime {
              font-size: 0.24rem;
              font-family: PingFang SC;
              font-weight: 500;
              color: #444444;
              display: flex;
              justify-content: space-between;
            }
          }
        }
      }
    }
  }
}
</style>
