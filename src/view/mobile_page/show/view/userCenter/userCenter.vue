<template>
  <div class="m-userCenter">
    <div class="m-userCenter-bg"></div>
    <div class="m-userCenter-contain flex-contain">
      <div class="m-userCenter-header" >
        <div>
          <img :src="userInfo.avatarImgPath" class="m-userAvatar"/>
        </div>
        <div class="m-userCenter-r">
          <div class="m-userCenter-name">{{userInfo.userName}}</div>
          <div class="m-userCenter-c">
            <span style="margin-right:0.2rem">{{userInfo.userInfo.class_name}}</span>
            <span>学号：{{userInfo.userInfo.account}}</span>
          </div>
        </div>
        <div class="m-userCenter-icon">
          <img src="@/assets/images/mobile_student/userInfot.png" @click="toRouter('mobileUserInfo')"/>
          <img src="@/assets/images/mobile_student/settings.png"/>
        </div>
      </div>
      <div class="m-userCenter-sel">
        <div @click="toRouter('taskIndex')">
          <div>
            <img src="@/assets/images/mobile_student/mytask.png"/>
          </div>
          <div class="m-userCenter-sel-itemN">我的任务</div>
        </div>
        <div @click="toRouter('homeworkExamIndex')">
          <div>
            <img src="@/assets/images/mobile_student/test.png"/>
          </div>
          <div class="m-userCenter-sel-itemN">作业测试</div>
        </div>
        <div @click="toRouter('courseList')">
          <div>
            <img src="@/assets/images/mobile_student/note.png"/>
          </div>
          <div class="m-userCenter-sel-itemN">课堂笔记</div>
        </div>
        <div @click="toRouter('evaluate')">
          <div>
            <img src="@/assets/images/mobile_student/evaluate.png"/>
          </div>
          <div class="m-userCenter-sel-itemN">考核评价</div>
        </div>
      </div>
      <div class="m-userCenter-type">
        <div>
          <div>
            <img src="@/assets/images/mobile_student/history.png"/>
          </div>
          <div>观看记录</div>
        </div>
        <div>
          <div>
            <img src="@/assets/images/mobile_student/attenction.png"/>
          </div>
          <div>我的关注</div>
        </div>
        <div>
          <div>
            <img src="@/assets/images/mobile_student/love.png"/>
          </div>
          <div>我的喜欢</div>
        </div>
        <div>
          <div>
            <img src="@/assets/images/mobile_student/shop.png"/>
          </div>
          <div>购买记录</div>
        </div>
        <div>
          <div>
            <img src="@/assets/images/mobile_student/school.png"/>
          </div>
          <div>我的学校</div>
        </div>
        <div>
          <div>
            <img src="@/assets/images/mobile_student/coursetale.png"/>
          </div>
          <div>我的课表</div>
        </div>
        <div>
          <div>
            <img src="@/assets/images/mobile_student/undo.png"/>
          </div>
          <div>代办事项</div>
        </div>
        <div @click="toRouter('attendance')">
          <div>
            <img src="@/assets/images/mobile_student/attence.png"/>
          </div>
          <div>考勤情况</div>
        </div>
        <div @click="toRouter('teacherList')">
          <div>
            <img src="@/assets/images/mobile_student/teacher.png"/>
          </div>
          <div>提问老师</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
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
