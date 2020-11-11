<template>
  <div class="m-message flex-contain" style="position:relative;height:100%">
    <mt-header title="消息">
      <!-- <mt-button icon="search" slot="right"></mt-button> -->
    </mt-header>
    <mt-navbar v-model="selected" class="m-message-tab">
      <mt-tab-item id="1">消息中心</mt-tab-item>
      <mt-tab-item id="3" v-if="userType===1">问题讨论</mt-tab-item>
      <mt-tab-item id="2">系统通知</mt-tab-item>
    </mt-navbar>
    <!-- tab-container -->
    <mt-tab-container v-model="selected">
      <mt-tab-container-item id="1">
        <teacherQusetion ref="studentQusetion" v-if="userType===1"></teacherQusetion>
        <studentQusetion ref="studentQusetion" v-if="userType===2"></studentQusetion>
      </mt-tab-container-item>
      <mt-tab-container-item id="2">
        <systemInfo ref="systemInfo" @getInfoType="getInfoType"></systemInfo>
      </mt-tab-container-item>
      <mt-tab-container-item id="3" v-if="userType===1">
        <teacherDiscuss></teacherDiscuss>
      </mt-tab-container-item>
    </mt-tab-container>
  </div>
</template>
<script>

import studentQusetion from '@/view/mobile_page/show/view/message/studentQuestion.vue'
import teacherQusetion from '@/view/mobile_page/show/view/message/teacherQusetion.vue'
import teacherDiscuss from '@/view/mobile_page/show/view/message/teacherDiscuss.vue'
import discuss from '@/view/mobile_page/show/view/message/discuss.vue'
import systemInfo from '@/view/mobile_page/show/view/message/systemInfo.vue'
import systemInfoShow from '@/view/mobile_page/show/view/message/systeminfoShow.vue'
import classNotice from '@/view/mobile_page/show/view/message/classNotice.vue'
import undo from '@/view/mobile_page/show/view/message/undo.vue'
export default {
  components: { studentQusetion, teacherQusetion, teacherDiscuss, systemInfo, discuss, systemInfoShow, classNotice, undo },
  data () {
    return {
      selected: '1',
      isshowSystemInfoShow: false,
      isshowClassNotice: false,
      isshowUndo: false,
      discussInfo: [],
      userType: this.$store.state.user.userInfo.userType
    }
  },
  watch: {
    '$route': {
      handler (route) {
        if (route.name === 'mobileMessage') {
          if (this.newInfo === true) {
            this.$refs.studentQusetion.getData()
            this.$refs.systemInfo.getSystemNum()
          }
        }
      }
    }
  },
  computed: {
    newInfo () {
      return this.$route.query.newInfo
    }
  },
  methods: {
    getInfoType (i) {
      if (i === 1) {
        this.$router.push({ name: 'systeminfoShow' })
      } else if (i === 2) {
        this.$router.push({ name: 'classNotice' })
      } else if (i === 3) {
        this.$router.push({ name: 'undo' })
      }
    }
  },
  mounted () {
  }
}
</script>
