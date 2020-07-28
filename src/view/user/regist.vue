<template>
  <div class="regist">
    <div class="bg-left"></div>
    <div class="regist-con">
      <Card icon="log-in" title="账号绑定" :bordered="false">
        <div class="form-con">
          <Row>
            <Form
              ref="info"
              :model="info"
              :rules="rules"
              :label-width="80"
            >
              <FormItem label="学校" prop="school">
                <Select v-model="info.school" placeholder="选择学校" >
                    <Option :value="item.id" v-for="item in schoolList" :key="item.id">{{item.school_name}}</Option>
                </Select>
              </FormItem>
              <FormItem label="账号" prop="account">
                <Input v-model="info.account" placeholder="请输入账号"></Input>
              </FormItem>
              <FormItem label="密码" prop="password">
                <Input v-model="info.password" type="password" placeholder="密码"></Input>
              </FormItem>
              <FormItem label="姓名" prop="callname">
                <Input v-model="info.callname" placeholder="请输入姓名"></Input>
              </FormItem>
              <FormItem>
                <Button type="primary" @click="submit">提交</Button>
              </FormItem>
            </Form>
          </Row>
        </div>
      </Card>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      info: {},
      wx_id: '',
      type: '',
      schoolList: [],
      account: '',
      school: '',
      password: '',
      callname: '',
      rules: {
        account: [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        school: [
          { required: true, type: 'number', message: '学校不能为空', trigger: 'change' }
        ],
        callname: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    getCookie () {
      var cookieList = document.cookie.split('; ')
      for (let i = 0; i < cookieList.length; i++) {
        var n = cookieList[i].split('=')
        if (n[0] === 'user_type') {
          this.type = n[1]
        }
        if (n[0] === 'wx_id') {
          this.wx_id = n[1]
        }
      }
    },
    handleSubmit ({ userName, password, user_type, school }) {
      this.handleLogin({ userName, password, user_type, school }).then(res => {
        this.getUserInfo().then(res => {
          this.$router.push({
            name: this.$config.homeName
          })
        })
      })
    },
    submit () {
      this.$refs['info'].validate((valid) => {
        if (valid) {
          this.axios.request({
            method: 'post',
            url: '/index.php/Api/Wechat/bind_user',
            data: {
              wx_id: this.wx_id,
              type: this.type,
              account: this.info.account,
              password: this.info.password,
              school_id: this.info.school,
              user_name: this.info.callname
            }
          }).then(res => {
            if (res.code === 200) {
              this.$Message.success('绑定成功')
              this.handleSubmit({ userName: this.info.account, password: this.info.password, user_type: this.type, school: this.info.school })
            } else {
              // this.$Message.error(res.message)
            }
          })
        } else {
          this.$Message.error('请检查填写信息')
        }
      })
    },
    getSchool () {
      this.axios.request({
        method: 'get',
        url: '/index.php/Home/Index/getSchoolList'
      }).then(res => {
        if (res.code === 200) {
          this.schoolList = res.data.list
        }
      })
    }
  },
  mounted () {
    this.getCookie()
    this.getSchool()
  }
}
</script>

<style scoped lang="less">
  .regist {
    overflow: auto;
    width: 100%;
    height: 100%;
    background: #abccff;
    background-size: cover;
    background-position: center;
    position: relative;
  }
  .regist-con {
    position: absolute;
    right: 50%;
    top: 20%;
    -webkit-transform: translateY(-60%);
    transform: translateX(50%);
    width: 500px;
  }
  .regist-con .form-con {
    padding: 10px 0 0;
  }
  .regist-con .regist-tip {
    font-size: 10px;
    text-align: center;
    color: #c3c3c3;
  }
  .regist .title {
    color: #fff;
    text-align: center;
    margin-bottom: 50px;
  }
  .bg-left{
    width: 50%;
    height: 100vh;
    background-image: url('../../assets/images/loginbg.png');
    background-size: cover;
    background-position: right;
  }
</style>
