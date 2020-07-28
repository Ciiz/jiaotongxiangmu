<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="绑定慕课账号" :bordered="false">
        <div class="form-con">
          <Row>
            <Form ref="loginForm" :model="user" :rules="rules" @keydown.enter.native="handleSubmit">
              <FormItem prop="account">
                <Input v-model="user.account" placeholder="请输入用户名">
                  <span slot="prepend">
                    <Icon :size="16" type="ios-person"></Icon>
                  </span>
                </Input>
              </FormItem>
              <FormItem prop="password">
                <Input type="password" v-model="user.password" placeholder="请输入密码">
                  <span slot="prepend">
                    <Icon :size="14" type="md-lock"></Icon>
                  </span>
                </Input>
              </FormItem>
              <FormItem >
                <RadioGroup v-model="user.user_type" >
                    <Radio :label="'1'" >老师</Radio>
                    <Radio :label="'2'" >学生</Radio>
                </RadioGroup>
              </FormItem>

              <FormItem>
                <Button @click="handleSubmit" type="primary" long>绑定</Button>
              </FormItem>
              <FormItem>
                没有账号？ <router-link :to="{path: '/regist', query: {zjy_token: zjy_token, user_type: user_type}}">去注册</router-link>
              </FormItem>
            </Form>
          </Row>
        </div>
      </Card>
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      user: {
        user_type: this.$route.query.user_type,
        account: '',
        password: '',
        zjy_token: this.$route.query.zjy_token
      },
      rules: {

      }
    }
  },
  methods: {
    ...mapMutations([
      'setToken'
    ]),
    handleSubmit () {
      this.axios.request({
        method: 'post',
        url: '/index.php/Home/Index/bind',
        data: this.user
      }).then(res => {
        if (res.code === 200) {
          this.setToken(res.data.token)
          this.$router.push({
            name: this.$config.homeName
          })
        }
      })
    }
  },
  created () {

  }
}
</script>
<style scoped lang="less">
  @import './bind.less';
</style>
