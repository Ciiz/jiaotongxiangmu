<template>
<div>
    <Form ref="formValidate" :model="infolist" :label-width="80">
            <FormItem label="头像:">
                <div class="icon-style">
                  <upload-img @upload_img_success='imgsuccess' :showlist="false" :img_src='infolist.icon'
                  :format="['jpg','jpeg','png','gif','bmp','svg','pcd','webp']" btnname='上传头像'
                  :maxsize='307200' :maxlength='999'
                  :data_type="{type:'icon',token:$store.state.user.token}"></upload-img>
                </div>
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
        <FormItem label="推流地址">
          <span ref="live_push_url">{{live_push_url}}</span>
          <Button type="success" size="small" style="margin-left:10px" @click="copyText">复制</Button>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="submit">修改</Button>
        </FormItem>
    </Form>
</div>
</template>
<script>
import uploadImg from '@/view/publiccomponent_teacher/upload/upload-img'
import { mapActions } from 'vuex'
export default {
  components: { uploadImg },
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
    }
  }
}
</script>
