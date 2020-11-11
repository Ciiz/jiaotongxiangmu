<template>
  <div>
    <div class="question-item" @click="getInfo(1)">
      <div style="position:relative">
        <div class="question-item-icon" style="background:#4AA0FB">
          <img src="@/assets/images/mobile_student/sh.png" />
        </div>
        <mt-badge type="error" size="small" style="position:absolute;top:0.08rem;right:0.08rem" class="m-badge-num"
          v-if="system_unread!==0">{{system_unread}}</mt-badge>
      </div>
      <div class="question-item-l">
        <div class="question-item-info">
          <div>
            <span class="question-item-name">系统消息</span>
          </div>
        </div>
      </div>
    </div>
    <div class="question-item" @click="getInfo(2)">
      <div style="position:relative">
        <div class="question-item-icon" style="background:#16C2AA">
          <img src="@/assets/images/mobile_student/ring.png" />
        </div>
        <mt-badge type="error" size="small" style="position:absolute;top:0.08rem;right:0.08rem" class="m-badge-num"
          v-if="remind_unread!==0">{{remind_unread}}</mt-badge>
      </div>
      <div class="question-item-l">
        <div class="question-item-info">
          <div>
            <span class="question-item-name">上课提醒</span>
          </div>
        </div>
      </div>
    </div>
    <div class="question-item" @click="getInfo(3)">
      <div style="position:relative">
        <div class="question-item-icon" style="background:#FBA64A">
          <img src="@/assets/images/mobile_student/uncorrect.png" />
        </div>
        <mt-badge type="error" size="small" style="position:absolute;top:0.08rem;right:0.08rem" class="m-badge-num"
          v-if="commission_unread!==0">{{commission_unread}}</mt-badge>
      </div>
      <div class="question-item-l">
        <div class="question-item-info">
          <div>
            <span class="question-item-name">待办</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Indicator } from 'mint-ui'
export default {
  data () {
    return {
      list: [],
      userType: this.$store.state.user.userInfo.userType,
      commission_unread: '',
      remind_unread: '',
      system_unread: ''
    }
  },
  watch: {

  },
  methods: {
    getSystemNum () { // 获取系统通知
      Indicator.open({
        text: '加载中...',
        spinnerType: 'fading-circle'
      })
      let uRl = ''
      if (this.userType === 1) {
        uRl = '/index.php/Teacher/Notice/unread'
      } else {
        uRl = '/index.php/Student/User/unread'
      }
      this.axios.request({
        url: uRl,
        method: 'get',
        params: {}
      }).then(res => {
        if (res.code === 200) {
          this.commission_unread = res.data.commission_unread
          this.remind_unread = res.data.remind_unread
          this.system_unread = res.data.system_unread
        }
        Indicator.close()
      })
    },
    getInfo (i) {
      this.$emit('getInfoType', i)
    }
  },
  mounted () {
    this.getSystemNum()
  }
}
</script>
