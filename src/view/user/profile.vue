<template>
  <Row style="padding: 50px 200px">
    <Form :model="userInfo" :label-width="80" label-position="right" ref="userInfo" :rules="rules">
       <FormItem label="头像">
          <ImageCropUpload
            :imgsrc="userInfo.icon"
            @success="(url)=>{this.userInfo.icon = url}"
            :params="{type: 'icon',token:$store.state.user.token}"
            :size_editable="false"
            :imgWidth = '300'
            :imgHeight = '300'
          >
          </ImageCropUpload>
        </FormItem>
        <Row>
          <Col :span="12">
              <FormItem label="姓名">
                <Input v-model="userInfo.name" disabled/>
              </FormItem>
          </Col>
          <Col :span="12">
              <FormItem label="性别">
                <Select v-model="userInfo.sex" disabled>
                    <Option  :value="1">男</Option>
                    <Option  :value="2">女</Option>
                </Select>
              </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="12">
              <FormItem label="学号">
                <Input v-model="userInfo.s_no" disabled/>
              </FormItem>
          </Col>
          <!-- <Col :span="12">
              <FormItem label="邮箱">
                <Input v-model="userInfo.email"></Input>
              </FormItem>
          </Col> -->
        </Row>
        <Row>
          <Col :span="12">
              <FormItem label="所属学校">
                <Input v-model="userInfo.school_name" disabled/>
              </FormItem>
          </Col>
          <Col :span="12">
              <FormItem label="所属专业">
                <Input v-model="userInfo.major_name" disabled/>
              </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="12">
              <FormItem label="密码">
                <Input v-model="userInfo.password" type="password" placeholder=""/>
              </FormItem>
          </Col>
          <Col :span="12">
              <FormItem label="确认密码" prop="repassword">
                <Input v-model="userInfo.repassword" type="password"/>
              </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="12">
              <FormItem label="手机号">
                <Input v-model="userInfo.mobile" disabled/>
              </FormItem>
          </Col>
          <Col :span="12">
              <FormItem label="班级">
                <Input v-model="userInfo.class_name" disabled/>
              </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="24">
              <FormItem label="简介">
                <Input v-model="userInfo.profile" type="textarea" />
              </FormItem>
          </Col>
        </Row>
        <FormItem>
          <Button type="primary" @click="save">保存</Button>
        </FormItem>
        <!-- <Button type="default" @click="bind_zjy">绑定职教云用户</Button> -->
    </Form>
  </Row>
</template>
<script>
import { mapActions } from 'vuex'
import ImageCropUpload from '_c/image-crop-upload'
export default {
  components: {
    ImageCropUpload
  },
  data () {
    const validatePassCheck = (rule, value, callback) => {
      if (this.userInfo.password === '') {
        callback()
      }
      if (value === '') {
        callback(new Error('请输入确认密码'))
      } else if (value !== this.userInfo.password) {
        callback(new Error('两次输入的密码不正确!'))
      } else {
        callback()
      }
    }
    return {
      userInfo: {
        password: '',
        repassword: ''
      },
      rules: {
        repassword: [
          { validator: validatePassCheck, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    getUserInfo () {
      let _this = this
      _this.axios
        .request({
          method: 'get',
          url: '/index.php/Student/User/getUserInfo'
        })
        .then(res => {
          let data = res.data
          if (res.code === 200) {
            data.user.password = ''
            data.user.repassword = ''
            _this.userInfo = data.user
          }
        })
    },
    save () {
      let _this = this
      this.$refs['userInfo'].validate((valid) => {
        if (valid) {
          _this.axios.request({
            method: 'post',
            url: '/index.php/Student/User/save',
            data: this.userInfo
          }).then(res => {
            if (res.code === 200) {
              _this.$Message.success(res.message)
              if (_this.userInfo.password) { // 因为后台登录的处理,修改密码后要重新登录
                this.handleLogOut().then(() => {
                  // 正式环境跳转到portal入口
                  // let env = process.env.NODE_ENV === 'production'
                  // if (env) {
                  //   location.href = this.$config.portalDomain
                  // } else {
                  this.$router.push({
                    name: 'index'
                  })
                  // }
                }).catch(err => {
                  console.log(err)
                })
              }
            }
            this.$store.commit('setAvatar', this.userInfo.icon)
          })
        } else {
          this.$Message.error('请检查填写信息!')
        }
      })
    }
    // bind_zjy () {
    //   let redirect_uri = encodeURIComponent(`${this.$config.moocDomain}/index.php/Home/Index/authorize_callback`)
    //   location.href = `${this.$config.portalDomain}/index.php/Home/Index/authorize?app_key=mooc&redirect_uri=${redirect_uri}`
    // }
  },
  created () {
    this.getUserInfo()
  }
}
</script>
<style>
</style>
