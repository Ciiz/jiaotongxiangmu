<template>
  <div class="mobile-login flex-contain">
    <mt-header :title="user_type===1?'老师账号登录':'学生账号登录'">
      <router-link to="/entry" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <div class="login-form">
      <div class="loginSelect" @click="popupVisible=true">
        <span>{{selectName===''?'所属院校':selectName}}</span>
        <img src="@/assets/images/mobile_student/downl.png" />
      </div>
      <mt-field class="loginfield" placeholder="请输入您的工号" disableClear v-model="username"></mt-field>
      <div style="position:relative">
        <mt-field class="loginfield" placeholder="请输入您的密码" :type="showPassword===true?'text':'password'" disableClear
          v-model="password"></mt-field>
        <img src="@/assets/images/mobile_student/showPassword.png" v-show="!showPassword" @click="showPassword=true">
        <img src="@/assets/images/mobile_student/unshowPassword.png" v-show="showPassword"
          @click="showPassword=false" />
      </div>
      <div style="margin-top:1.2rem">
        <button class="login-btn" @click="handleSubmit">立即登录</button>
      </div>
    </div>
    <!-- <div class="login-bottom">
      <Divider style="font-size:0.24rem;color:#9A9A9A">使用微信账号登录</Divider>
      <img src="@/assets/images/mobile_student/wechat.jpg" />
    </div> -->
    <div id="peopleChorseT" @click="openQuestionType"></div>
    <mt-popup v-model="popupVisible" v-if="popupVisible===true" popup-transition="popup-fade" closeOnClickModal="true"
      position="bottom" style="width:100%">
      <mt-picker :slots="schoolList" @change="onValuesChange" valueKey="school_name" showToolbar>
        <div class="picker-toolbar-title">
          <div class="usi-btn-cancel" @click="popupVisible = !popupVisible">取消</div>
          <div class="">请选择所在学校</div>
          <div class="usi-btn-sure" @click="popupOk()">确定</div>
        </div>
      </mt-picker>
    </mt-popup>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import log from 'video.js/es5/utils/log'
export default {
  data () {
    return {
      inId: '', // 框所在的学校id
      inName: '', // 框所在的学校名字
      selectName: '', // 选择学校的名字
      selectId: '', // 选择学校的id
      popupVisible: false, // 问题类型弹框
      schoolList: [// 问题类型弹框数据
        {
          values: [

          ]
        }
      ],
      showPassword: false,
      username: '',
      password: '',
      user_type: ''
    }
  },
  watch: {
    username (n, o) {
      this.changeBtnActive()
    },
    password (n, o) {
      this.changeBtnActive()
    },
    selectId (n, o) {
      this.changeBtnActive()
    }
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    /**
     * 打开弹框
     */
    openQuestionType () {
      this.popupVisible = true
    },
    // 弹框点击确认
    popupOk () {
      this.selectId = this.inId
      this.selectName = this.inName
      document.getElementsByClassName('loginSelect')[0].style.color = 'rgb(0, 0, 0)'
      this.popupVisible = false
    },
    // 弹框picker值发生改变
    onValuesChange (picker, values) {
      this.inId = values[0].id
      this.inName = values[0].school_name
    },
    getSchoolList () {
      this.axios.request({
        method: 'get',
        url: '/index.php/Home/Index/getSchoolList'
      }).then(res => {
        if (res.code === 200) {
          this.schoolList[0].values = res.data.list
        }
      })
    },
    changeBtnActive () {
      if (this.username !== '' && this.password !== '' && this.selectId !== '') {
        document.getElementsByClassName('login-btn')[0].style.background = '#3B9BFF'
      } else {
        document.getElementsByClassName('login-btn')[0].style.background = '#9BC3EC'
      }
    },
    handleSubmit () {
      if (this.username !== '' && this.password !== '' && this.selectId !== '') {
        this.handleLogin(
          {
            userName: this.username,
            password: this.password,
            user_type: this.user_type,
            school: this.selectId
          }).then(res => {
            this.getUserInfo().then(res => {
              console.log(res)
              localStorage.setItem('schoolId', res.schoolId)
              this.$router.push({ path: '/mobile' })
            })
          })
      }
    }
  },
  mounted () {
    this.getSchoolList()
    this.user_type = this.$route.query.user_type
    if (this.user_type === undefined) {
      this.$router.push({ path: '/entry' })
    }
  }
}
</script>
<style lang='less' scoped>
.mobile-login {
  padding: 0.3rem 0;
}
</style>
