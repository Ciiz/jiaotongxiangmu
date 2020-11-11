<template>
  <div class="mobileLike">
    <cell title="我的喜欢">
      <span slot="left"><img src="@/assets/images/mobile_teacher/back.png" alt="" @click="$router.back(-1)"></span>
      <span slot="right"></span>
    </cell>

    <div class="mobileLike_list">

      <ul>
        <li v-for="item in mobileLike" :key="item.id">
          <div class="mobileLike_list_icon"><img :src="item.icon" alt=""></div>
          <div class="mobileLike_list_r">
            <div class="mobileLike_list_rNameAndicon">
              <div class="mobileLike_list_rName"> {{item.course_name}}</div>
              <div class="mobileLike_list_rIcon"><img src="@/assets/images/mobile_student/like.png" alt=""></div>
            </div>
            <div class="mobileLike_list_rDescription" v-html="item.description"></div>
            <div class="mobileLike_list_rTime">
              <!-- <div class="mobileLike_list_rTime_tiem">时长：{{moment(item.video_time).format('LT')}}</div> -->
              <div class="mobileLike_list_rTime_tiem">时长：{{moment(item.video_time * 1000).format('mm:ss')}}</div>
              <div class="mobileLike_list_rTime_right">已看{{item.percent}}%</div>
            </div>
          </div>
        </li>
      </ul>
      <div class="mobile_null" v-if="mobileLikeLength===0">暂无喜欢...</div>
    </div>
  </div>
</template>

<script>
import { Indicator } from 'mint-ui'
import cell from '@/view/mobile_page/components/public_cell'
export default {
  components: {
    cell
  },

  data () {
    return {
      mobileLike: [],
      mobileLikeLength: ''
    }
  },

  methods: {},
  mounted () {
    Indicator.open()
    this.axios.request({
      method: 'get',
      url: '/home/course/getMyCourseAttention',
    }).then(res => {
      console.log(res);
      this.mobileLike = res.data.data
      // res.data.data.forEach(element => {
      //   console.log(element.video_time);

      // });
      this.mobileLikeLength = res.data.data.length

      Indicator.close()
    })

  }
}
</script>

<style lang='less' scoped>
.mobileLike {
  .mobileLike_list {
    background: #f7f7f7;
    width: 100%;
    height: 100vh;

    padding: 0.2rem;

    ul {
      li {
        padding: 0.2rem;
        background-color: #fff !important;
        display: flex;
        margin-bottom: 0.2rem;
        border-radius: 8px;
        .mobileLike_list_icon {
          width: 2.2rem;
          height: 1.65rem;
          border-radius: 8px;
          img {
            width: 2.2rem;
            height: 1.65rem;
            border-radius: 8px;
          }
        }
        .mobileLike_list_r {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          margin-left: 0.2rem;
          .mobileLike_list_rNameAndicon {
            display: flex;
            align-items: center;
            justify-content: space-between;
            .mobileLike_list_rName {
              font-size: 0.34rem;
              font-family: PingFang SC;
              font-weight: bold;
              color: #000000;
            }

            .mobileLike_list_rIcon {
              img {
                width: 0.44rem;
                height: 0.38rem;
              }
            }
          }
          .mobileLike_list_rDescription {
            font-size: 0.24rem;
            font-family: PingFang SC;
            font-weight: 500;
            color: #999999;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
          }
          .mobileLike_list_rTime {
            display: flex;
            justify-content: space-between;
            font-size: 0.24rem;
            font-family: PingFang SC;
            font-weight: 500;
            color: #444444;
          }
        }
      }
    }
  }
}
</style>
