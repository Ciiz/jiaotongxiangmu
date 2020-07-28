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
    <div class="mobile-index-text">
      <div>以游客身份访问 >>>></div>
      <div>T O U R I S T</div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {

    }
  },
  methods: {
    tologin (i) {
      this.$router.push({ name: 'mobileLogin', query: { user_type: i } })
    }
  }
}
</script>
