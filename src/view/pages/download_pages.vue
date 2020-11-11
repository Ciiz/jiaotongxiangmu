<template>
  <div class="download">
    <div class="download_img">
      <img src="@/assets/images/public/tupian.png" alt="">
      <div class="download_btn" @click="handledownload" style="cursor:pointer"></div>
      <div class="tips" v-if="isshow">
        <span>提示</span>
        <span>近期上线，敬请期待</span>
      </div>
    </div>

  </div>
</template>

<script>
import log from 'video.js/es5/utils/log'
export default {
  name: 'download_pages',

  data () {
    return {
      isshow: false
    }
  },

  methods: {
    handledownload () {

      this.isshow = true
      setTimeout(() => {
        this.isshow = false
      }, 1500)
    }
  }
}
</script>

<style lang="less" scoped>
.download {
  display: flex;
  align-items: center;
  justify-content: center;

  .download_img {
    .tips {
      position: absolute;
      right: 55px;
      bottom: 132px;
      width: 227px;
      height: 127px;
      background: #ffffff;
      border-radius: 8px;

      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: bold;
      color: #333333;
      span:nth-child(2) {
        margin-top: 10px;
      }
    }
    position: relative;
    overflow: hidden;
    width: 1033px;
    height: 686px;
    /deep/.ivu-btn {
      background-color: red;
    }
    img {
      width: 1033px;
      height: 686px;
    }
    .download_btn {
      width: 220px;
      height: 56px;
      border-radius: 8px;
      position: absolute;
      right: 58px;
      bottom: 63px;
    }
  }
  .isdownload {
    display: none;
  }
}
</style>
