<template>
  <div class="mobileHistory">
    <cell title="购买记录">
      <span slot="left"><img src="@/assets/images/mobile_teacher/back.png" alt="" @click="$router.back(-1)"></span>
      <span slot="right"></span>
    </cell>

    <div class="mobileHistory_list">
      <div class="mobile_null" v-if="mobileHistoryLength===0">暂无记录...</div>
      <ul>
        <li v-for="(item,index) in mobileHistory" :key="index">
          <div class="mobileHistory_list_icon"> <img :src="item.img" alt=""></div>
          <div class="mobileHistory_list_r">
            <div class="mobileHistory_list_rName">
              <div class="mobileHistory_list_rName1"> {{item.course_name}}</div>
              <div class="mobileHistory_list_rName2" @click="handlePopup(index)"> ...</div>

            </div>
            <div class="mobileHistory_list_rDescription" v-html="item.description"></div>
            <div class="mobileHistory_list_rTime">购买时间：{{moment(item.create_time * 1000).format('YYYY-MM-DD HH:mm')}}
            </div>
          </div>
        </li>
      </ul>
    </div>
    <mt-popup v-model="popupVisible" position="bottom">
      <div class="Popup">
        <div class="Popup_list">
          <div class="Popup_service ">
            <img src="@/assets/images/mobile_student/kefu (1).png" alt="" class="Popup_iocn">
            <div class="Popup_serviceFone">联系客服</div>
          </div>
          <div class="Popup_refund Popup_service">
            <img src="@/assets/images/mobile_student/tuikuang.png" alt="" class="Popup_iocn">
            <div class="Popup_serviceFone">申请退款</div>
          </div>
          <div class="Popup_invoice Popup_service">
            <img src="@/assets/images/mobile_student/fapiao.png" alt="" class="Popup_iocn">
            <div class="Popup_serviceFone">开具发票</div>
          </div>
        </div>
        <div class="Popup_btn" @click="popupVisible=false">取消</div>
      </div>
    </mt-popup>
  </div>
</template>

<script>
import { Indicator } from 'mint-ui'
import cell from '@/view/mobile_page/components/public_cell'
export default {
  components: { cell },
  data () {
    return {
      mobileHistory: [],
      popupVisible: false,
      mobileHistoryLength: ''
    }
  },
  computed: {
    status () {
      return this.$store.state.user.hasGetInfo ? '1' : '0'
    }
  },
  methods: {
    handlePopup (index) {
      this.popupVisible = true
    }
  },
  mounted () {
    Indicator.open()
    this.axios.request({
      method: 'post',
      url: '/home/order/index',
      data: {
        status: this.status
      }
    }).then(res => {
      console.log(res);
      this.mobileHistory = res.data.data.order
      this.mobileHistoryLength = res.data.data.order.length
      Indicator.close()
    })
  }
}
</script>

<style lang="less" scoped>
.mobileHistory {
  .mobileHistory_list {
    background: #f7f7f7;
    width: 100%;
    height: 100vh;
    padding: 0.3rem 0.3rem;
    ul {
      li {
        display: flex;
        background-color: #fff;
        margin-bottom: 0.3rem;
        border-radius: 8px;
        padding: 0.2rem;

        .mobileHistory_list_icon {
          width: 2.2rem;
          height: 1.65rem;
          border-radius: 8px;
          img {
            width: 2.2rem;
            height: 1.65rem;
            border-radius: 8px;
          }
        }
        .mobileHistory_list_r {
          margin-left: 0.3rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .mobileHistory_list_rName {
            font-size: 0.34rem;
            font-family: PingFang SC;
            font-weight: bold;
            color: #000000;
            display: flex;
            justify-content: space-between;
            position: relative;
            overflow: hidden;
            .mobileHistory_list_rName2 {
              font-size: 0.55rem;
              position: absolute;
              top: -19px;
              right: 0.2rem;
            }
          }
          .mobileHistory_list_rDescription {
            font-size: 0.26rem;
            font-family: PingFang SC;
            font-weight: 400;
            color: #666666;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
          }
        }
      }
    }
  }

  .Popup {
    padding: 0.3rem 0.3rem 0 0.3rem;
    width: 100vw;
    height: 4.63rem;
    background-color: #fff;
    border-top-left-radius: 0.3rem;
    border-top-right-radius: 0.3rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .Popup_list {
      display: flex;
      flex: 1;
      border-bottom: 1px solid #eeeeeeff;
      flex-direction: column;
      justify-content: space-between;
      .Popup_iocn {
        width: 0.47rem;
        height: 0.47rem;
        margin-right: 0.3rem;
      }
      .Popup_serviceFone {
        font-size: 0.34rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: #000000;
      }
      .Popup_service {
        display: flex;
      }
    }
    .Popup_btn {
      font-size: 0.36rem;
      font-family: PingFang SC;
      font-weight: 400;
      color: #000000;
      line-height: 0.8rem;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 1.1rem;
    }
  }
}
</style>
