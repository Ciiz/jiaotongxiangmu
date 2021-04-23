<template>
  <div class="lookHistory">
    <div class="lookHistory_header">
      <div class="lookHistory_header_iocn"><img src="@/assets/images/public/jilu.png" alt=""></div>
      <span>播放记录</span>
    </div>
    <div class="lookHistory_list">
      <ul>
        <li v-for="(v,i) in lookHistory" :key="i" @click="$router.push({ path: `/videojump/${v.course_id}` })">
          <div class="lookHistory_list_l">
            <div class="lookHistory_list_lImg"><img :src="v.img" alt=""></div>
            <div class="lookHistory_list_lText">
              <div class="lookHistory_list_lText_name">{{v.course_name}}</div>
              <div class="lookHistory_list_lText_bottom">
                <div class="lookHistory_list_lText_school">{{v.school_name}}</div>
                <div class="lookHistory_list_lText_major">{{v.major_name}}</div>
                <div class="lookHistory_list_lText_time" v-if="v.study_time===null">看到：0:00</div>
                <div class="lookHistory_list_lText_time" v-else>
                  看到：{{moment(v.study_time * 1000).format('mm:ss')}}</div>
              </div>
            </div>
          </div>
          <div class="lookHistory_list_r">
            <div class="lookHistory_list_rIconAndusername">
              <div class="lookHistory_list_rIcon"><img :src="v.icon" alt=""></div>
              <div class="lookHistory_list_rusername color">{{v.user_name}}</div>
            </div>
            <span
              class="lookHistory_list_rCreateTime color">{{moment(v.created_at * 1000).format('YYYY-MM-DD HH:mm:ss')}}</span>
          </div>
        </li>
      </ul>
    </div>
    <span class="lookHistory_footer">暂无更多播放记录了</span>
  </div>
</template>

<script>
import { get_lookHistory } from "@/api/common"
import log from 'video.js/es5/utils/log'
export default {
  data () {
    return {
      lookHistory: []
    }
  },
  methods: {


  },

  async activated () {
    let res = await get_lookHistory()
    console.log(res);
    this.lookHistory = res.data.data

  }
}
</script>

<style lang='less' scoped>
.lookHistory {
  width: 1200px;
  height: 100%;
  margin: 0 auto;
  .lookHistory_header {
    display: flex;
    align-items: center;
    margin: 30px 0;
    .lookHistory_header_iocn {
      img {
        width: 30px;
        height: 30px;
        margin-right: 20px;
      }
    }
    span {
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #333333;
    }
  }
  .lookHistory_list {
    ul {
      li {
        display: flex;
        margin: 10px 0;
        .lookHistory_list_l {
          display: flex;
          width: 75%;
          .lookHistory_list_lImg {
            margin-right: 30px;
            img {
              width: 160px;
              height: 100px;
              background: #000000;
              border-radius: 4px;
            }
          }
          .lookHistory_list_lText {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .lookHistory_list_lText_name {
              font-size: 14px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: #030303;
            }
            .lookHistory_list_lText_bottom {
              display: flex;
              justify-content: space-around;
              font-size: 12px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: #6d757a;
              .lookHistory_list_lText_major {
                margin: 0 30px 0 20px;
              }
            }
          }
        }
        .lookHistory_list_r {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .color {
            font-size: 12px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #6d757a;
          }
          .lookHistory_list_rIconAndusername {
            display: flex;
            align-items: center;

            .lookHistory_list_rIcon {
              margin-right: 10px;
              img {
                width: 38px;
                height: 38px;
                border-radius: 50%;
              }
            }
            .lookHistory_list_rusername {
            }
          }
        }
      }
    }
  }
  .lookHistory_footer {
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #6d757a;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 60px 0;
  }
}
</style>
