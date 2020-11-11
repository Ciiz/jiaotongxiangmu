<template>
  <div class="setting">
    <cell title="设置">
      <span slot="left"><img src="@/assets/images/mobile_teacher/back.png" alt="" @click="$router.back(-1)"></span>
      <span slot="right"></span>
    </cell>
    <div class="setting_list">
      <div class="setting_content">
        <!-- <div class="setting_content_cache border">缓存设置</div> -->
        <div class="setting_content_update border">检测更新</div>
        <div class="setting_content_about border" @click="$router.push({name: 'mobileabout'})">
          <span>关于</span>
          <span><img src="@/assets/images/public/you.png" alt=""></span>
        </div>
      </div>
      <div class="setting_out" @click="handleout">
        <span>退出登录</span>
      </div>
    </div>

  </div>
</template>

<script>
import { mapActions } from 'vuex'
import cell from '@/view/mobile_page/components/public_cell'
export default {
  components: {
    cell
  },

  data () {
    return {
    }
  },

  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    handleout () {
      this.handleLogOut().then(() => {
        // 正式环境跳转到portal入口
        // let env = process.env.NODE_ENV === 'production'
        // if (env) {
        //   location.href = portalDomain
        // } else {
        this.$store.commit('setToken', '')
        this.$router.push({
          name: 'entry'
        })
        // }
      })
    }
  }
}
</script>

<style lang='less' scoped>
.setting {
  .setting_list {
    position: relative;
    overflow: hidden;
    .setting_out {
      width: 6.86rem;
      height: 1rem;
      background-color: #3699ffff;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-size: 0.34rem;
      border-radius: 0.8rem;
      position: absolute;
      bottom: 0;
      left: 0.3rem;
    }
    background-color: #f3f3f3ff;
    // height: 100vh;
    height: 12.46rem;
    padding-top: 0.2rem;
    .setting_content {
      background-color: #fff;
      width: 100%;

      font-size: 0.3rem;
      font-family: PingFang SC;
      font-weight: 500;
      color: #0d0d0d;
      .border {
        border-bottom: 1px solid #dcdcdcff;
        padding: 0.4rem 0.3rem;
      }
      .setting_content_about {
        display: flex;
        justify-content: space-between;
        align-items: center;
        img {
          width: 0.3rem;
          height: 0.3rem;
        }
      }
    }
  }
}
</style>
