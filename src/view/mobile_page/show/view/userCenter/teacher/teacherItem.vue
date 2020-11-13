<template>
  <div class="m-studentItem">
    <div class="m-userCenter-sel">
      <div @click="toRouter('mobileCourseManageT')">
        <div>
          <img src="@/assets/images/mobile_student/mytask.png" />
        </div>
        <div class="m-userCenter-sel-itemN">课程管理</div>
      </div>
      <div @click="toRouter('mobilecCursewareManageT')">
        <div>
          <img src="@/assets/images/mobile_student/test.png" />
        </div>
        <div class="m-userCenter-sel-itemN">课件管理</div>
      </div>
      <div @click="toRouter('mobileCorrectIndex')">
        <div>
          <img src="@/assets/images/mobile_student/note.png" />
        </div>
        <div class="m-userCenter-sel-itemN">批改</div>
      </div>
      <div @click="toRouter('mobileEvaluateT')">
        <div>
          <img src="@/assets/images/mobile_student/evaluate.png" />
        </div>
        <div class="m-userCenter-sel-itemN">查看考核</div>
      </div>
    </div>
    <div class="m-userCenter-type">
      <div @click="toRouter('mobileWatch')">
        <div>
          <img src="@/assets/images/mobile_student/history.png" />
        </div>
        <div>观看记录</div>
      </div>
      <div @click="toRouter('mobileAttention')">
        <div>
          <img src="@/assets/images/mobile_student/attenction.png" />
        </div>
        <div>我的关注</div>
      </div>
      <div @click="toRouter('mobileLike')">
        <div>
          <img src="@/assets/images/mobile_student/love.png" />
        </div>
        <div>我的喜欢</div>
      </div>
      <div @click="toRouter('mobileHistory')">
        <div>
          <img src="@/assets/images/mobile_student/shop.png" />
        </div>
        <div>购买记录</div>
      </div>
      <div @click="handleMyschool">
        <div>
          <img src="@/assets/images/mobile_student/school.png" />
        </div>
        <div>我的学校</div>
      </div>
      <div @click="toRouter('mobileCourseTimetable')">
        <div>
          <img src="@/assets/images/mobile_student/coursetale.png" />
        </div>
        <div>我的课表</div>
      </div>
      <div @click="toRouter('undo')">
        <div>
          <img src="@/assets/images/mobile_student/undo.png" />
        </div>
        <div>代办事项</div>
      </div>
      <div @click="toRouter('look_check')">
        <div>
          <img src="@/assets/images/mobile_student/attence.png" />
        </div>
        <div>学生考勤</div>
      </div>
      <div @click="toRouter('myclass')">
        <div>
          <img src="@/assets/images/mobile_student/teacher.png" />
        </div>
        <div>我的班级</div>
      </div>
      <div @click="toRouter('mobileCourse')">
        <div>
          <img src="@/assets/images/mobile_student/mycourse.png" />
        </div>
        <div>我的课程</div>
      </div>
    </div>
  </div>
</template>
<script>
import { Toast } from 'mint-ui'
import log from 'video.js/es5/utils/log'
export default {
  data () {
    return {
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.user
    },
    userType () {
      return this.$store.state.user.userInfo.userType
    }
  },
  watch: {

  },
  methods: {
    toRouter (i) {
      if (this.userType === 3) {
        Toast({
          message: '请先注册登录....',
          duration: 2000
        })
        return
      } else {
        this.$router.push({ name: i })
      }

    },
    handleMyschool () {
      if (this.userType === 3) {
        Toast({
          message: '请先注册登录....',
          duration: 2000
        })
        return
      } else {
        this.$store.commit('setSschoolMesage', this.userInfo.userInfo)
        this.$router.push({ path: `/m_index_school_team/${this.userInfo.userInfo.schoolId} ` })
      }

    }
  },
  mounted () {
    console.log(this.userInfo);

  }
}
</script>
