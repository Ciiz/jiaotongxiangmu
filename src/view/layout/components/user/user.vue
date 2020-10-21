<template>
  <div style="display:inline-block;margin-left:24px">
    <Dropdown @on-click="handleClick">
      <span class="ivu-avatar ivu-avatar-circle ivu-avatar-default ivu-avatar-image"
        style="width:48px;height:48px;border-radius:50%">
        <img :src="userAvatar" alt="" :onerror="errorImg01">
      </span>
      <Icon :size="18" type="md-arrow-dropdown" style="color: #fff;"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="" @click.native="entrySystem">教务系统</DropdownItem>
        <DropdownItem name="" @click.native="my_attention">我的关注</DropdownItem>
        <DropdownItem name="" @click.native="personal">个人中心</DropdownItem>
        <DropdownItem name="logout">注销登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import './user.less'
import { mapActions } from 'vuex'
export default {
  name: 'User',
  props: {
    userAvatar: {
      type: String,
      default: ''
    },
    messageUnreadCount: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      theme_list: [
        {
          title: '默认',
          color: '#424242',
          theme_name: 'default'
        },
        {
          title: '暗红',
          color: '#844848',
          theme_name: 'dark_red'
        },
        {
          title: '淡紫',
          color: '#585c8c',
          theme_name: 'purple'
        },
        {
          title: 'bilibili粉',
          color: '#fb7299',
          theme_name: 'pink'
        }
      ]
    }
  },
  computed: {
    userType () {
      return this.$store.state.user.userInfo.userType
    }
  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    logout () {
      this.handleLogOut().then(() => {
        // 正式环境跳转到portal入口
        // let env = process.env.NODE_ENV === 'production'
        // if (env) {
        //   location.href = portalDomain
        // } else {
        this.$router.push({
          name: 'index'
        })
        //   }
        // }).catch(err => {
        //   console.log(err)
      })
    },
    message () {
      // if (this.$store.state.user.userInfo.userType === 2) {
      //   this.$router.push({
      //     name: 'message'
      //   })
      // } else {
      //   this.$router.push({
      //     name: 'teacher_messagecenter'
      //   })
      // }
    },
    handleClick (name) {
      switch (name) {
        case 'logout': this.logout()
          break
        case 'home': this.$router.push({ name: this.$store.state.user.userInfo.userType === 2 ? 'home' : 'MyCourse' })
          break
      }
    },
    handleThemeChange (theme) {
      localStorage.setItem('etoTheme', theme)
      location.reload()
    },
    // 个人中心页面跳转
    personal () {
      this.$router.push({ path: '/personal' })
      // if (this.userType === 1) {
      //   this.$router.push({ path: '/personal' })
      // } else {
      //   this.$router.push({ path: '/personal' })
      // }
    },
    // 我的关注页面跳转
    my_attention () {
      if (this.userType === 1) {
        this.$router.push({ path: '/personal/attention' })
      } else {
        this.$router.push({ path: '/personal/attention' })
      }
    },
    entrySystem () {
      if (this.userType === 1) {
        this.$router.push({ path: '/teachingSystem/MyCourse/course_courseware' })
      } else {
        this.$router.push({ path: '/teachingSystem/StudentCourse/course_coursewares' })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.theme-container {
  display: flex;
  .theme-item {
    width: 50px;
    height: 50px;
  }
}
</style>
