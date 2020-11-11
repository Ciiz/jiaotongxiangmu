<template>
  <div class="mobileabout">
    <cell title="关于" class="aboutheader">
      <span slot="left"><img src="@/assets/images/mobile_teacher/back.png" alt="" @click="$router.back(-1)"></span>
      <span slot="right"></span>
    </cell>
    <div class="mobileabout_content">
      <div class="mobileabout_icon">
        <img src="@/assets/images/default.jpg" alt="">
      </div>
      <div class="mobileabout_contentList">
        <ul>
          <li><span>当前版本</span> <span>1.0</span></li>
          <li @click="$router.push({name:'aboutwe'})">
            <span>关于我们</span>
            <span><img src="@/assets/images/public/you.png" alt=""></span>
          </li>
          <li @click="$router.push({name:'agreement'})">
            <span>用户协议服务</span>
            <span><img src="@/assets/images/public/you.png" alt=""></span>
          </li>
          <li @click="$router.push({name:'feedback'})">
            <span>用户反馈</span>
            <span><img src="@/assets/images/public/you.png" alt=""></span>
          </li>
        </ul>
      </div>

    </div>
  </div>
</template>

<script>
import cell from '@/view/mobile_page/components/public_cell'
export default {
  components: {
    cell
  },

  data () {
    return {
    }
  },

  methods: {}
}
</script>

<style lang='less' scoped>
.mobileabout {
  .aboutheader {
  }
  .mobileabout_content {
    padding-top: 0.02rem;
    background-color: #f3f3f3ff;
    height: 100vh;
    .mobileabout_icon {
      width: 100%;
      height: 4rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #fff;

      img {
        width: 2rem;
        height: 2rem;
      }
    }
    .mobileabout_contentList {
      padding: 0.3rem;
      background-color: #fff;
      margin-top: 0.2rem;
      ul {
        li {
          font-size: 0.3rem;
          font-family: PingFang SC;
          font-weight: 500;
          color: #0d0d0d;
          display: flex;
          justify-content: space-between;
          height: 1rem;
          line-height: 1rem;
          border-bottom: 1px solid #e5e5e5ff;
          img {
            width: 0.3rem;
            height: 0.3rem;
          }
        }
      }
    }
  }
}
</style>
