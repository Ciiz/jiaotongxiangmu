<template>
  <div class="m-userInfo flex-contain">
    <mt-header title="个人资料" style="background:#3B9BFF;color:#FFFFFF">
      <router-link to="/mobile/mobileUserCenter" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <div class="m-userInfo-contain">
      <div class="m-userInfo-icon">
        <div>
          <img :src="userInfo.icon"/>
        </div>
        <!-- <div>修改头像</div> -->
      </div>
      <div class="m-scroll">
        <div class="m-userInfo-detail">
          <mt-cell
            title="姓名"
            style="border-top: 1px solid #E5E5E5;"
            v-model="userInfo.name">
          </mt-cell>
          <mt-cell
            title="性别">
            {{userInfo.sex===1?'男':'女'}}
          </mt-cell>
          <mt-cell
            title="所属院校"
            v-model="userInfo.school_name">
          </mt-cell>
          <mt-cell
            title="绑定手机"
            v-model="userInfo.mobile">
          </mt-cell>
          <mt-cell
            title="邮箱"
            v-model="userInfo.email">
          </mt-cell>
          <mt-cell
            title="身份证"
            v-model="userInfo.id_card">
          </mt-cell>
        </div>
      </div>
    </div>
    <!-- <div>
      <button class="m-b-btn-b">修改密码</button>
    </div> -->
  </div>
</template>
<script>
export default {
  data () {
    return {
      userInfo: {}
    }
  },
  computed: {

  },
  watch: {

  },
  methods: {
    getUserInfo () {
      this.axios
        .request({
          method: 'get',
          url: '/index.php/Teacher/User/info'
        })
        .then(res => {
          if (res.code === 200) {
            this.userInfo = res.data
          }
        })
    }
  },
  mounted () {
    this.getUserInfo()
  }
}
</script>
