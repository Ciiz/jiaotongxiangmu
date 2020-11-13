<template>
  <div class="m-userCenter">
    <div class="m-userCenter-bg"></div>
    <div class="m-userCenter-contain flex-contain">
      <div class="m-userCenter-header">
        <div v-if="userInfo.userInfo.userType ===3"><img src="@/assets/images/public/toux.jpg" alt=""
            class="m-userAvatar" /></div>
        <div v-else>
          <img :src="userInfo.avatarImgPath" class="m-userAvatar" />
        </div>
        <div class="m-userCenter-r">
          <div class="m-userCenter-name" v-if="userInfo.userInfo.userType ===3">游客</div>
          <div class="m-userCenter-name" v-else>{{userInfo.userName}}</div>
          <div class="m-userCenter-c">
            <span v-if="userInfo.userInfo.userType===2"
              style="margin-right:0.2rem">{{userInfo.userInfo.class_name}}</span>
            <span v-if="userInfo.userInfo.userType===1">工号：{{userInfo.userInfo.account}}</span>
            <span v-if="userInfo.userInfo.userType===2">学号：{{userInfo.userInfo.account}}</span>
          </div>
        </div>
        <div class="m-userCenter-icon">
          <img src="@/assets/images/mobile_student/userInfot.png" v-if="userInfo.userInfo.userType===1"
            @click="toRouter('mobileUserInfoT')" />

          <img src="@/assets/images/mobile_student/userInfot.png" v-if="userInfo.userInfo.userType===2"
            @click="toRouter('mobileUserInfo')" />

          <img src="@/assets/images/mobile_student/settings.png" @click="toRouter('usersetting')" />
        </div>
      </div>
      <teacherItem v-if="userInfo.userInfo.userType===1 || userInfo.userInfo.userType===3"></teacherItem>
      <studentItem v-if="userInfo.userInfo.userType===2"></studentItem>
    </div>
  </div>
</template>
<script>

import studentItem from '@/view/mobile_page/show/view/userCenter/student/studentItem'
import teacherItem from '@/view/mobile_page/show/view/userCenter/teacher/teacherItem'

export default {
  components: { studentItem, teacherItem },
  data () {
    return {
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.user
    }
  },
  watch: {

  },
  methods: {
    toRouter (i) {
      this.$router.push({ name: i })
    }
  },
  mounted () {

  }
}
</script>
