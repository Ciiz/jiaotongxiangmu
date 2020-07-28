<template>
  <div class="login-index">
    <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
      <FormItem style="margin-bottom:15px">
        <RadioGroup v-model="form.user_type">
            <Radio :label="1" style="margin-right:22px">老师</Radio>
            <Radio :label="2">学生</Radio>
        </RadioGroup>
      </FormItem>

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
            <Input v-model="form.userName"  placeholder="请输入学号/工号">
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
              <img style="cursor:pointer" src="../../assets/images/wechat.svg" width="34" height="34" @click="goLogin">
            </div>
          </Col>
        </Row>
      </FormItem>
    </Form>

  </div>
</template>
<script>

export default {
  name: 'LoginForm',
  props: {
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
        school: ''
      },
      schoolList: []
    }
  },
  watch: {

  },
  computed: {
    rules () {
      return {
        userName: this.userNameRules,
        password: this.passwordRules,
        school: this.schoolRules
      }
    }
  },
  methods: {
    handleSubmit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$emit('on-success-valid', {
            userName: this.form.userName,
            password: this.form.password,
            user_type: this.form.user_type,
            school: this.form.school
          })
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
  .login-index{
    font-size: 16px;
    width: 450px;
    background: #ffffff;
    left: 50%;
    top: 50%;
    position: absolute;
    transform: translate(-50%,-50%);
    padding: 20px;
  }
  .login-index .ivu-select-input,.login-index .ivu-select-single .ivu-select-selection{
    height: 44px;
    font-size: 16px;
    line-height: 44px;
  }
  .login-index .ivu-input{
    font-size: 16px;
    height: 44px;
    line-height: 44px;
  }
  .login-index .ivu-btn{
    padding: 12px 0;
  }
  .login-index .ivu-radio-wrapper{
    font-size: 16px;
  }
</style>
