<template>
  <div class="qrecode">
    <div class="qrecode_login">
      <span class="qrecode_title">账号绑定</span>
      <div class="qrecode_form">
        <!-- <mt-field label="学校" placeholder="请输入学校" v-model="selectName" @focus.native.capture="popupVisible=true">
        </mt-field> -->
        <div class="loginSelect" @click="popupVisible=true">
          <span>学校</span>
          <span>{{selectName===''?'所属院校':selectName}}</span>
          <img src="@/assets/images/mobile_student/downl.png" />
        </div>
        <mt-field label="账号" placeholder="请输入账号" v-model="number">
        </mt-field>
        <mt-field label="密码" placeholder="请输入密码" v-model="password">
        </mt-field>
        <mt-field label="姓名" placeholder="请输入姓名" v-model="username">
        </mt-field>
        <mt-radio v-model="test" :options="options">
        </mt-radio>
      </div>
      <div class="qrecode_submit" @click="submit"><span>提交</span></div>
    </div>
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
import { Toast } from 'mint-ui';
import log from 'video.js/es5/utils/log';
// import axios from './loginaxios'
export default {
  data () {
    return {
      test: '',
      username: '',
      password: '',
      number: '',
      school: '',
      popupVisible: false,
      schoolList: [// 问题类型弹框数据
        {
          values: [

          ]
        }
      ],
      inId: '', // 框所在的学校id
      inName: '', // 框所在的学校名字
      selectName: '', // 选择学校的名字
      selectId: '', // 选择学校的id
      wx_id: '',
      lat: '',
      lng: '',
      attendance_ids: '',
      showTest: '',
      options: [{
        label: '老师',
        value: '1'
      },
      {
        label: '学生',
        value: '2'
      }

      ]
    }
  },
  watch: {
    test (val) {
      this.test = val;
      for (var i = 0; i < this.options.length; i++) {
        if (val == this.options[i].value) {
          if (this.options[i].label === '老师') this.showTest = '1'
          else this.showTest = '2'

        }
      }
    }
  },
  methods: {

    submit () {
      this.axios.request({
        method: 'post',
        url: '/index.php/Api/Wechat/wxgzh_bind_user',
        data: {
          wx_id: this.wx_id,
          type: this.showTest,
          account: this.number,
          password: this.password,
          school_id: this.selectId,
          user_name: this.username,
          lat: this.lat,
          lng: this.lng,
          attendance_ids: this.attendance_ids
        }
      }).then(res => {
        if (this.selectName.trim() === '') {
          Toast({
            message: '请选择院校！',
            duration: 2000
          })
          return
        }
        if (this.number.trim() === '' || this.password.trim() === '' || this.username.trim() === '') {
          Toast({
            message: '内容不能为空！',
            duration: 2000
          })
          return
        }
        if (this.showTest === '') {
          Toast({
            message: '请选择用户类型！',
            duration: 2000
          })
          return
        }
        // if (res.code === 200) {
        //   alert('成功')
        //   this.$router.push({ name: 'sucess_tip' })
        // } else {
        //   alert('失败')
        //   // return
        // }
      })

    },
    getCookie () {
      var cookieList = document.cookie.split('; ')
      for (let i = 0; i < cookieList.length; i++) {
        var n = cookieList[i].split('=')
        if (n[0] === 'wx_id') {
          this.wx_id = n[1]
        }
        else if (n[0] === 'lat') this.lat = n[1]
        else if (n[0] === 'lng') this.lng = n[1]
        else if (n[0] === 'attendance_ids') this.attendance_ids = n[1]
      }

    },
    getSchoolList () {
      this.axios.request({
        method: 'get',
        url: '/index.php/Home/Index/getSchoolList'
      }).then(res => {
        if (res.code === 200) {
          console.log(res);
          this.schoolList[0].values = res.data.list
        }
      })
    },
    // 弹框点击确认
    popupOk () {
      this.selectId = this.inId
      console.log(this.selectId);
      this.selectName = this.inName
      // document.getElementsByClassName('loginSelect')[0].style.color = 'rgb(0, 0, 0)'
      this.popupVisible = false
    },
    // 弹框picker值发生改变
    onValuesChange (picker, values) {
      this.inId = values[0].id
      this.inName = values[0].school_name
    },
  },
  mounted () {

    this.getCookie()
    this.getSchoolList()

  }
}
</script>

<style lang='less' scoped>
.qrecode {
  width: 6.86rem;
  .qrecode_login {
    width: 100vw;
    .loginSelect {
      span {
        color: #515a6e;
        font-size: 0.34rem;
        // line-height: 1;
      }
      display: flex;
      justify-content: space-between;
      padding: 0.3rem 10px;
      position: relative;
      font-size: 0.3rem;
      border-bottom: none;
      img {
        width: 0.4rem;
        height: 0.4rem;
      }
    }
    .qrecode_title {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0.8rem 0;
      font-size: 0.5rem;
    }
    .qrecode_submit {
      width: 2rem;
      margin: 0.2rem auto;
      height: 0.7rem;
      background-color: red;
      border-radius: 0.1rem;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      span {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>
