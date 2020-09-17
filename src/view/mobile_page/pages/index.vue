<template>
  <div class="m-index_b">
    <div class="m-index">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
      <!-- 底部tabbar -->
      <mt-tabbar v-model="selected" class="m-tabbar">
        <mt-tab-item v-for="(item,index) in teacher_tab" :key="index" :id="item.id" style="position:relative">
          <div class="m-badge" v-show="item.badgeShow"></div>
          <img slot="icon" :src="selected===item.id?item.imgsrcA:item.imgsrc">
          {{item.title}}
        </mt-tab-item>
      </mt-tabbar>
    </div>
  </div>
</template>
<script>

import live from '@/view/common/live'
export default {
  mixins: [live],
  data () {
    return {
      selected: '',
      userType: this.$store.state.user.userInfo.userType,
      teacher_tab: [
        {
          title: '首页',
          imgsrc: require('@/assets/images/mobile_student/index.png'),
          imgsrcA: require('@/assets/images/mobile_student/index-a.png'),
          id: 'index',
          badgeShow: false
        },
        {
          title: '消息',
          imgsrc: require('@/assets/images/mobile_student/message.png'),
          imgsrcA: require('@/assets/images/mobile_student/message-a.png'),
          id: 'message',
          badgeShow: false
        },
        {
          title: '课程',
          imgsrc: require('@/assets/images/mobile_student/course.png'),
          imgsrcA: require('@/assets/images/mobile_student/course-a.png'),
          id: 'course',
          badgeShow: false
        },
        {
          title: '我的',
          imgsrc: require('@/assets/images/mobile_student/userInfo.png'),
          imgsrcA: require('@/assets/images/mobile_student/userInfo-a.png'),
          id: 'userInfo',
          badgeShow: false
        }
      ]
    }
  },
  watch: {
    selected (n, o) {
      if (n === 'userInfo') {
        this.$router.push({ name: 'mobileUserCenter' })
      } else if (n === 'message') {
        if (this.teacher_tab[1].badgeShow === true) {
          this.$router.push({ name: 'mobileMessage', query: { newInfo: true } })
        } else {
          this.$router.push({ name: 'mobileMessage', query: { newInfo: false } })
        }
      } else if (n === 'course') {
        this.$router.push({ name: 'mobileCourse' })
      } else {
        this.$router.push({ name: 'showIndex' })
      }
    }
  },
  methods: {
    handleOnMessage (data) {
      this.updataInfo(data.notice_type, data.courseware_id)
      let type = data.type || ''
      switch (type) {
        // Events.php中返回的init类型的消息，将client_id发给后台进行uid绑定
        case 'init':
          this.bindUser(data.client_id)
          if (this.userType === 1) {
            this.joinDisucussTeacher()
          } else {
            this.joinDisucussStudent()
          }
          break
        case 'ppt':
          break
        case 'online':
          break
        case 'offline':
          break
        default: {

        }
      }
    },
    updataInfo (type, courseware_id) {
      if (type === 43) {
        this.getOthers()
      } else if (type === 31) { // 教师接收学生信息
        this.getOthers2()
      } else if (type === 32) { // 学生接收教师信息
        this.getOthers()
      } else if (type === 44) {
        if (this.userType === 2) {
          this.getOthers()
        } else if (this.userType === 1) {
          this.getOthers2()
        }
      } else if (type === 42) { // 上课通知
        // this.axios.request({
        //   method: 'get',
        //   url: '/index.php/Student/Courseware/courseware_class',
        //   params: {
        //     courseware_id
        //   }
        // }).then(res => {
        //   if (res.code === 200) {
        //     this.live_status = res.data.live_status
        //     this.student_courseware_id = res.data.student_courseware_id
        //     this.isshowclass = true
        //   }
        // })
      }
    },
    getOthers () {
      this.axios.request({
        method: 'get',
        url: 'index.php/Student/User/getNumData'
      }).then(res => {
        if (res.code === 200) {
          if (res.data.message_total + res.data.system_total !== 0) {
            this.teacher_tab[1].badgeShow = true
          }
        }
      })
    },
    getOthers2 () {
      this.axios.request({
        method: 'get',
        url: 'index.php/Teacher/User/getNumData'
      }).then(res => {
        if (res.code === 200) {
          if (res.data.message_total + res.data.system_total !== 0) {
            this.teacher_tab[1].badgeShow = true
          }
        }
      })
    },
    getSelected () {
      if (this.$route.path === '/mobile/showIndex') {
        this.selected = 'index'
      } else if (this.$route.path === '/mobile/mobileMessage') {
        this.selected = 'message'
      } else if (this.$route.path === '/mobile/mobileCourse') {
        this.selected = 'course'
      } else if (this.$route.path === '/mobile/mobileUserCenter') {
        this.selected = 'userInfo'
      }
    }
  },
  mounted () {
    this.getSelected()
    this.initChat()
    if (this.userType === 2) {
      this.getOthers()
    } else if (this.userType === 1) {
      this.getOthers2()
    }
  }
}
</script>
<style lang='less' scoped>
body {
}
// .m-index_b {
//   overflow: hidden;
//   width: 7.4rem;
// }

.m-index {
}
</style>
