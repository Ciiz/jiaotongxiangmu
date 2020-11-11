<template>
  <div class="mobile-index flex-contain">
    <div>
      <div class="mobile-index-teacher" @click="tologin(1)">
        <div>
          <div>老师登录</div>
          <div>T E A C H E R</div>
        </div>
      </div>
    </div>
    <div style="flex:1">
      <div class="mobile-index-student" @click="tologin(2)">
        <div>
          <div>学生登录</div>
          <div>S T U D E N T</div>
        </div>
      </div>
    </div>
    <div class="mobile-index-text" @click="handlelogin">
      <div>以游客身份访问 >>>></div>
      <div>T O U R I S T</div>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import { getUserInfo } from "@/api/user"
import log from 'video.js/es5/utils/log'
export default {
  data () {
    return {

    }
  },
  computed: {
    userType () {
      return this.$store.state.user.userInfo.userType
    }
  },
  methods: {
    ...mapActions([
      'handleLogin',
    ]),
    handlelogin () {
      this.axios.request({
        method: 'post',
        url: '/home/login/user_login',
        data: {
          visitor_type: 1,
          user_type: 3
        }
      }).then(res => {
        console.log(res);
        this.$store.commit('setToken', res.data.token)
        this.$store.commit('setUserInfo', res.data.userInfo)
        this.$router.push({ path: '/mobile' })
        // getUserInfo(res.data.token).then(res => {
        //   console.log(res);
        // })
      })


    },
    tologin (i) {
      this.$router.push({ name: 'mobileLogin', query: { user_type: i } })
    }
  },
  mounted () {
    console.log(this.userType);

  }
}
</script>
