<template>
  <div class="feedback">
    <cell title="用户反馈">
      <span slot="left"><img src="@/assets/images/mobile_teacher/back.png" alt="" @click="$router.back(-1)"></span>
      <span slot="right"></span>
    </cell>
    <div class="feedback_contnet">
      <div class="feedback_contnet_top">
        <span style="margin-right: 0.7rem;">请发送邮箱至</span>
        <!-- <span style="color: #2E69C7FF;">pre-sale@etoinfo.com</span> -->
        <!-- <span style="color: #2E69C7FF;" @click="copyClick">复制</span> -->
        <div class="code" data-clipboard-text="pre-sale@etoinfo.com" @click="copy" style="color: #2E69C7FF;">
          <div>pre-sale@etoinfo.com</div>
          <div>复制</div>
        </div>
      </div>
      <div class="feedback_contnet_footer">我们将会收到您的反馈</div>
    </div>
  </div>
</template>

<script>
import { Toast } from 'mint-ui'
import Clipboard from "clipboard";
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
    copy () {
      var clipboard = new Clipboard('.code')
      clipboard.on('success', e => {
        // console.log('复制成功', e)
        Toast({
          message: '复制成功',
          duration: 2000
        })
        // 释放内存
        clipboard.destroy()
      })
      clipboard.on('error', e => {
        // 不支持复制
        Toast({
          message: '手机权限不支持复制功能'
        })
        // console.log('该浏览器不支持自动复制')
        // 释放内存
        clipboard.destroy()
      })
    },
  }
}
</script>

<style lang='less' scoped>
.feedback_contnet {
  background-color: #f3f3f3ff;
  height: 100vh;
  font-size: 0.3rem;
  font-family: PingFang SC;
  font-weight: 500;
  color: #333333;
  padding: 0.3rem 0.2rem;
  .feedback_contnet_top {
    display: flex;
    // justify-content: space-between;

    margin-bottom: 0.3rem;
    .code {
      display: flex;
      flex: 1;
      justify-content: space-between;
    }
  }
}
</style>
