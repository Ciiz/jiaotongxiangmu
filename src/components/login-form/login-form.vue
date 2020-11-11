<template>
  <div class="login_pc">
    <div class="login-index">
      <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
        <!-- 忘记密码 -->
        <div class="forget_password" v-if="forget_password">
          <div v-if="reset_password_show ===false">
            <span style="font-family: Microsoft YaHei;font-weight: bold;color: #444444;">找回密码</span>
            <FormItem prop="register_userName"
              style='margin-top: 20px;font-family: Microsoft YaHei;font-weight: bold;color: #444444;'>
              <Row>
                <Col>
                <Input v-model="form.register_userName" placeholder="请输入您的账号">
                </Input>
                </Col>
              </Row>
            </FormItem>
            <FormItem prop="register_email">
              <Row>
                <Col>
                <Input v-model="form.register_email" placeholder="请输入您的邮箱">
                </Input>
                </Col>
              </Row>
            </FormItem>
            <FormItem style="margin-bottom:15px;text-align:center;margin-top:140px">
              <Row>
                <Col>
                <Button type="primary" @click="findPassword" long>找回密码</Button>
                </Col>
              </Row>
            </FormItem>
          </div>
          <!-- 重置密码 -->
          <div class="reset_password" v-else>
            <span style="font-family: Microsoft YaHei;font-weight: bold;color: #444444;">重置密码</span>
            <FormItem prop="reset_password"
              style='margin-top: 20px;font-family: Microsoft YaHei;font-weight: bold;color: #444444;'>
              <Row>
                <Col>
                <Input v-model="form.reset_password" placeholder="请输入新密码">
                </Input>
                </Col>
              </Row>
            </FormItem>
            <FormItem prop="reset_passwordtwo"
              style='margin-top: 20px;font-family: Microsoft YaHei;font-weight: bold;color: #444444;'>
              <Row>
                <Col>
                <Input v-model="form.reset_passwordtwo" placeholder="请再次输入新密码">
                </Input>
                </Col>
              </Row>
            </FormItem>
            <FormItem style="margin-bottom:15px;text-align:center;margin-top:140px">
              <Row>
                <Col>
                <Button type="primary" @click="change" long>立即修改</Button>
                </Col>
              </Row>
            </FormItem>
            <div class="succeed_tips" v-if="succeed_tip2">
              <span>提示</span>
              <span>修改成功，请返回登录</span>
              <div class="succeed_tip_btn" @click="reset_login">登录</div>
            </div>
          </div>
        </div>

        <!-- 注册 -->
        <div v-else>
          <div class="register_form" v-if="isshow">
            <span class="register_form_title"
              style="font-family: Microsoft YaHei;font-weight: bold;color: #444444;">注册</span>
            <FormItem prop="register_userName"
              style='margin-top: 20px;font-family: Microsoft YaHei;font-weight: bold;color: #444444;'>
              <Row>
                <Col>
                <Input v-model="form.register_userName" placeholder="请输入您的账号">
                </Input>
                </Col>
              </Row>
            </FormItem>
            <FormItem prop="register_password">
              <Row>
                <Col>
                <Input v-model="form.register_password" placeholder="请输入您的密码">
                </Input>
                </Col>
              </Row>
            </FormItem>
            <FormItem prop="register_email">
              <Row>
                <Col>
                <Input v-model="form.register_email" placeholder="请输入您的邮箱">
                </Input>
                </Col>
              </Row>
            </FormItem>
            <FormItem style="margin-bottom:15px;text-align:center;margin-top:120px">
              <Row>
                <Col>
                <Button @click="handle_register" type="primary" long>立即注册</Button>
                </Col>
              </Row>
            </FormItem>

            <div class="succeed_tip" v-if="succeed_tip">
              <span>提示</span>
              <span>注册成功，请返回登录</span>
              <div class="succeed_tip_btn" @click="handle_succeed_tipLogin">登录</div>
            </div>
          </div>

          <div class="login_form" v-else>
            <FormItem style="margin-bottom:15px">
              <RadioGroup v-model="form.user_type">
                <Radio :label="1" style="margin-right:22px">老师</Radio>
                <Radio :label="2" style="margin-right:22px">学生</Radio>
                <Radio :label="3">游客</Radio>
              </RadioGroup>
            </FormItem>
            <div v-if="form.user_type===3" class="login_tourist">
              <FormItem prop="visitorUserName">
                <Row>
                  <Col>
                  <Input v-model="form.visitorUserName" placeholder="请输入您的账号">
                  </Input>
                  </Col>
                </Row>
              </FormItem>
              <FormItem prop="visitorpassword">
                <Row>
                  <Col>
                  <Input type="password" v-model="form.visitorpassword" placeholder="请输入您的密码"></input>
                  </Col>
                </Row>
              </FormItem>
              <span class="login_tourist_password" style="cursor:pointer" @click="handleforget_password">忘记密码</span>
              <FormItem style="margin-bottom:15px;text-align:center;margin-top:20px">
                <Row>
                  <Col>
                  <Button @click="handleSubmit" type="primary" long>登录</Button>
                  </Col>
                </Row>
              </FormItem>
              <FormItem style="margin-bottom:15px;text-align:center;margin-top:20px">
                <Row>
                  <Col>
                  <Button @click="handleRegistershow" long>立即注册</Button>
                  </Col>
                </Row>
              </FormItem>
            </div>

            <div v-else>
              <FormItem prop="school">
                <Row>
                  <Col>
                  <Select v-model="form.school" placeholder="请选择学校" filterable>
                    <Option :value="item.id" v-for="item in schoolList" :key="item.id">{{item.school_name}}</Option>
                  </Select>
                  </Col>
                </Row>
              </FormItem>
              <FormItem prop="userName">
                <Row>
                  <Col>
                  <Input v-model="form.userName" placeholder="请输入学号/工号">
                  </Input>
                  </Col>
                </Row>
              </FormItem>

              <FormItem prop="password">
                <Row>
                  <Col>
                  <Input type="password" v-model="form.password" placeholder="请输入密码"></input>
                  </Col>
                </Row>
              </FormItem>
              <FormItem style="margin-bottom:15px;text-align:center">
                <Row>
                  <Col>
                  <Button @click="handleSubmit" type="primary" long>登录</Button>
                  <div style="text-align:center;margin-top:10px">
                    <img style="cursor:pointer" src="../../assets/images/wechat.svg" width="34" height="34"
                      @click="goLogin">
                  </div>
                  </Col>
                </Row>
              </FormItem>
            </div>
          </div>
        </div>
      </Form>
    </div>
  </div>
</template>
<script>
import { tourist_register } from "@/api/common"
import { f } from 'tree-table-vue'
import log from 'video.js/es5/utils/log'
export default {
  name: 'LoginForm',
  props: {
    reset_passwordtwoRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '再次输入新密码不能为空', trigger: 'blur' },
        ]
      }
    },
    reset_passwordRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '新密码不能为空', trigger: 'blur' },
        ]
      }
    },
    visitorUserNameRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '账号不能为空', trigger: 'blur' },
        ]
      }
    },
    visitorUserNameRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '账号不能为空', trigger: 'blur' },
        ]
      }
    },
    register_emailRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { type: 'email', message: '不正确的电子邮件格式', trigger: 'blur' }

        ]
      }
    },
    register_userNameRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ]
      }
    },
    register_passwordRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    },
    userNameRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '学号或工号不能为空', trigger: 'blur' }
        ]
      }
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    },
    schoolRules: {
      type: Array,
      default: () => {
        return [
          { required: true, type: 'integer', message: '请选择学校', trigger: 'change' }
        ]
      }
    }
  },
  data () {
    return {
      form: {
        userName: '',
        password: '',
        user_type: 1,
        school: '',
        visitorUserName: '',
        visitorpassword: '',
        register_userName: '',
        register_password: '',
        register_email: '',
        reset_password: '',//重置密码第一次输入
        reset_passwordtwo: ''//重置密码第二次输入
      },
      schoolList: [],
      isshow: false,
      forget_password: false,
      succeed_tip: false,
      reset_password_show: false,
      userId: '',
      succeed_tip2: false

    }
  },
  watch: {

  },
  computed: {
    passwordUserId () {
      return this.$store.state.user.passwordUserId
    },
    rules () {
      return {
        userName: this.userNameRules,
        password: this.passwordRules,
        school: this.schoolRules,
        register_userName: this.register_userNameRules,
        register_password: this.register_passwordRules,
        register_email: this.register_emailRules,
        visitorUserName: this.visitorUserNameRules,
        reset_password: this.reset_passwordRules,
        reset_passwordtwo: this.reset_passwordtwoRules
      }
    }
  },
  methods: {
    reset_login () {
      this.forget_password = false
      this.form.user_type = 3
      this.isshow = false
      this.reset_password_show = false
      this.form.register_userName = ''
      this.form.register_email = ''
      this.form.reset_password = ''
      this.form.reset_passwordtwo = ''
      this.succeed_tip2 = false
    },
    // 立即修改
    change () {
      console.log(this.passwordUserId);
      this.axios.request({
        method: 'post',
        url: '/home/login/visitorReset',
        data: {
          password: this.form.reset_password,
          confirm_password: this.form.reset_passwordtwo,
          id: this.passwordUserId
        }
      }).then(res => {
        console.log(res);
        if (res.code === 200) {
          this.$Message.success(res.message);
          this.succeed_tip2 = true
        }
      })
    },
    // 立即找回
    findPassword () {
      this.axios.request({
        method: 'post',
        url: '/home/login/visitorSend',
        data: {
          email: this.form.register_email,
          account: this.form.register_userName
        }
      }).then(res => {
        console.log(res);
        if (res.code === 200) {
          this.$Message.success(res.message);
          this.reset_password_show = true
        }

      })
    },

    handle_succeed_tipLogin () {
      this.isshow = false
      this.form.user_type = 3
    },
    handleforget_password () {
      this.forget_password = true
    },
    // 注册
    handle_register () {
      var data = {
        account: this.form.register_userName,
        password: this.form.register_password,
        user_type: this.form.user_type,
        email: this.form.register_email
      }
      tourist_register(data).then(res => {
        console.log(res);
        if (res.message === 'success') {
          this.succeed_tip = true
        }

      })
    },
    handleRegistershow () {
      this.isshow = true
    },
    handleSubmit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          if (this.form.user_type === 3) {
            // this.axios.request({
            //   method: 'post',
            //   url: 'home/login/user_login',
            //   data: {
            //     userName: this.form.visitorUserName,
            //     password: this.form.visitorpassword,
            //     user_type: this.form.user_type,
            //   }
            // }).then(res => {
            //   this.userId = res.data.userInfo.userId
            //   console.log(this.userId);
            // })
            this.$emit('on-success-valid', {
              userName: this.form.visitorUserName,
              password: this.form.visitorpassword,
              user_type: this.form.user_type,
            })
          } else {
            this.$emit('on-success-valid', {
              userName: this.form.userName,
              password: this.form.password,
              user_type: this.form.user_type,
              school: this.form.school
            })
          }

        }
      })
    },
    getSchoolList () {
      this.axios.request({
        method: 'get',
        url: '/index.php/Home/Index/getSchoolList'
      }).then(res => {
        if (res.code === 200) {
          this.schoolList = res.data.list
        }
      })
    },
    goLogin () {
      let url = 'https://open.weixin.qq.com/connect/qrconnect?appid=wx9ee7d665d55be992&redirect_uri=' + encodeURI('https://zjymooc.etomooc.com/Api/Wechat/login?type=' + this.form.user_type + '&scope=snsapi_login#wechat_redirect')
      location.href = url
    }
  },
  mounted () {
    this.getSchoolList()
  }
}
</script>
<style>
.login-index .forget_password .reset_password .succeed_tips .succeed_tip_btn {
  width: 140px;
  height: 40px;
  background-color: #3d92e2ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  border-radius: 5px;
}
.login-index .forget_password .reset_password .succeed_tips {
  background-color: #fff;
  width: 300px;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  box-shadow: 1px 1px 9px #222;
  /* border: 1px solid #ccc; */
  position: absolute;
  left: 50%;
  top: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
  z-index: 99;
}
.login-index .register_form {
  position: relative;
  overflow: hidden;
}

.login-index .register_form .succeed_tip {
  background-color: #fff;
  width: 300px;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  box-shadow: 1px 1px 9px #222;
  /* border: 1px solid #ccc; */
  position: absolute;
  left: 50%;
  top: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
  z-index: 99;
}
.login-index .register_form .succeed_tip .succeed_tip_btn {
  width: 140px;
  height: 40px;
  background-color: #3d92e2ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  border-radius: 5px;
}
.login-index .register_form .register_form_title {
  font-size: 20px;
}
.login-index {
  font-size: 16px;
  width: 450px;
  background: #ffffff;
  left: 50%;
  top: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
  padding: 20px;
}
.login-index .ivu-select-input,
.login-index .ivu-select-single .ivu-select-selection {
  height: 44px;
  font-size: 16px;
  line-height: 44px;
}
.login-index .ivu-input {
  font-size: 16px;
  height: 44px;
  line-height: 44px;
}
.login-index .ivu-btn {
  padding: 12px 0;
}
.login-index .ivu-radio-wrapper {
  font-size: 16px;
}
.login-index .login_tourist .login_tourist_password {
  margin-left: 342px;
  color: #3699ffff;
}
</style>
