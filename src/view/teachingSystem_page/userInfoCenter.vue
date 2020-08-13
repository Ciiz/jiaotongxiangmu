<template>
<div class="userInfoCenter">
  <div style="position:relative;width:100%;height:100%">
    <Form ref="formValidate" :model="infolist" :label-width="80" style="padding: 18px 18px 10px 18px">
      <FormItem label="头像:">
        <ImageCropUpload
          :imgsrc="infolist.icon"
          @success="(url)=>{this.infolist.icon = url}"
          :params="{type: 'icon',token:$store.state.user.token}"
          :size_editable="false"
          :imgWidth = '300'
          :imgHeight = '300'
        >
        </ImageCropUpload>
      </FormItem>
      <Row>
        <Col :span="12">
          <FormItem label="姓名:">
              <Input v-model="infolist.name" disabled />
          </FormItem>
        </Col>
        <Col :span="12">
          <FormItem label="性别：">
              <RadioGroup v-model="infolist.sex">
                <Radio label="1">
                    <span>男</span>
                </Radio>
                <Radio label="2">
                    <span>女</span>
                </Radio>
            </RadioGroup>
          </FormItem>
        </Col>
        </Row>
         <Row>
        <Col :span="12">
            <FormItem label="工号：">
                <Input v-model="infolist.account"  disabled placeholder="暂未填写工号" />
            </FormItem>
        </Col>
        <Col :span="12">
          <FormItem label="邮箱：">
              <Input v-model="infolist.email"  placeholder="暂未填写邮箱" />
          </FormItem>
        </Col>
        </Row>
         <Row>
        <Col :span="12">
            <FormItem label="所属学校：">
                <Input v-model="infolist.school_name" disabled />
            </FormItem>
        </Col>
         <Col :span="12">
            <FormItem label="手机号：">
                <Input v-model="infolist.mobile" placeholder="暂未填写手机号" />
            </FormItem>
        </Col>
        </Row>
         <Row>
        <Col :span="12">
            <FormItem label="身份证：">
                <Input v-model="infolist.id_card" disabled placeholder="暂未填写身份证" />
            </FormItem>
        </Col>
         <Col :span="12">
            <FormItem label="支付宝：">
                <Input v-model="infolist.alipay_account" placeholder="暂未填写支付宝号码" />
            </FormItem>
        </Col>
        </Row>
        <Row>
          <Col :span="12">
              <FormItem label="密码">
                <Input v-model="infolist.password" type="password" placeholder=""></Input>
              </FormItem>
          </Col>
          <Col :span="12">
              <FormItem label="确认密码" prop="repassword">
                <Input v-model="infolist.repassword" type="password"></Input>
              </FormItem>
          </Col>
        </Row>
        <Row>
            <FormItem label="个人简介" prop="profile">
              <Input v-model="infolist.profile" :rows="4" type="textarea" ></Input>
            </FormItem>
        </Row>
        <FormItem label="推流地址" style="margin-bottom:0">
          <span ref="live_push_url">{{live_push_url}}</span>
          <Button size="small" style="margin-left:10px;background:#0BA97E;outline:none;color:#ffffff;border-radius: 15px" @click="copyText()">复制</Button>
        </FormItem>
        <FormItem label="摄像头地址">
          <span ref="live_push_url2">{{$store.state.user.userInfo.camera_url}}</span>
          <Button size="small" style="margin-left:10px;background:#0BA97E;outline:none;color:#ffffff;border-radius: 15px" @click="copyText2()">复制</Button>
        </FormItem>
        <Button @click="submit()" style="width:82px;float:right;background:#3B9BFF;outline:none;color:#ffffff;border-radius: 15px;">修改</Button>
    </Form>
  </div>
</div>
</template>
<script>
import ImageCropUpload from '_c/image-crop-upload'
import { mapActions } from 'vuex'
export default {
  components: { ImageCropUpload },
  data () {
    return {
      live_push_url: this.$store.state.user.userInfo.live_url,
      infolist: {
        icon: '',
        name: '',
        sex: '',
        account: '',
        email: '',
        school_name: '',
        id_card: '',
        mobile: '',
        alipay_account: '',
        profile: '',
        infolist: {
          password: '',
          repassword: ''
        }
      }
    }
  },
  created () {
    this.getInfo()
  },
  methods: {
    ...mapActions([
      'resetgetInfo',
      'handleLogOut'
    ]),
    imgsuccess (res) {
      if (res.code === 200) {
        this.infolist.icon = res.data.url
      }
    },
    submit () {
      if (this.infolist.email !== '' && this.infolist.email !== null && !this.infolist.email.match(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/)) {
        this.$Message.error('邮箱格式不正确')
        return false
      }
      if (!this.infolist.mobile.match(/^[1]([3-9])[0-9]{9}$/)) {
        this.$Message.error('手机号未填写或者填写的手机号格式不正确')
        return false
      }
      if (this.infolist.password !== this.infolist.repassword) {
        this.$Message.error('两次密码输入不一致')
        return false
      }
      this.axios.request({
        method: 'post',
        url: '/index.php/Teacher/User/update_info',
        data: {
          mobile: this.infolist.mobile,
          alipay_account: this.infolist.alipay_account,
          sex: this.infolist.sex,
          email: this.infolist.email,
          icon: this.infolist.icon,
          password: this.infolist.password,
          profile: this.infolist.profile
        }
      }).then(res => {
        if (res.code === 200) {
          this.$Message.success(res.message)
          this.resetgetInfo()
          this.getInfo()
          this.$store.commit('setAvatar', this.infolist.icon)
          if (this.infolist.password) {
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
      })
    },
    getInfo () {
      this.axios.request({
        method: 'post',
        url: '/index.php/Teacher/User/info'
      }).then(res => {
        this.infolist = res.data
        this.infolist.sex = this.infolist.sex.toString()
      })
    },
    copyText () {
      let Url2 = this.$refs.live_push_url.innerText
      var oInput = document.createElement('input')
      oInput.value = Url2
      document.body.appendChild(oInput)
      oInput.select() // 选择对象
      document.execCommand('Copy') // 执行浏览器复制命令
      oInput.className = 'oInput'
      oInput.style.display = 'none'
      this.$Message.success('已复制')
    },
    copyText2 () {
      let Url2 = this.$refs.live_push_url2.innerText
      var oInput = document.createElement('input')
      oInput.value = Url2
      document.body.appendChild(oInput)
      oInput.select() // 选择对象
      document.execCommand('Copy') // 执行浏览器复制命令
      oInput.className = 'oInput'
      oInput.style.display = 'none'
      this.$Message.success('已复制')
    }
  }
}
</script>
