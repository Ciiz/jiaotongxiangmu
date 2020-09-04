<template>
  <div class="personaldata">
    <Form :model="infolist" label-position="left" :label-width="100">
      <FormItem label="头像：">
        <div class="infolist_img" v-if="userInfo.icon !==''">
          <img :src="userInfo.icon" alt="">
          <Upload :action="action_url" :format="format" :max-size="maxsize"
            :data="{type:'icon',token:$store.state.user.token}" :on-exceeded-size="exceededsize" name='file'
            :on-format-error="formaterror" :on-success="handleSuccess">
            <div style="cursor:pointer;">更改头像</div>
          </Upload>
        </div>
        <div class="infolist_img" v-else>
          <img src="@/assets/images/personal/geren.png" alt="">
          <Upload :action="action_url">
            <div style="cursor:pointer;">上传头像</div>
          </Upload>
        </div>
      </FormItem>
      <FormItem label="姓名：">
        <div class="userInfo_style"> {{userInfo.name}}</div>

      </FormItem>
      <FormItem label="职业：">
        <div class="userInfo_style">{{userInfo.major_name}}</div>

      </FormItem>
      <FormItem label="院校：">
        <div class="userInfo_style">{{userInfo.school_name}}</div>

      </FormItem>
      <FormItem label="工号：">
        <div class="userInfo_style"> {{userInfo.account}}</div>

      </FormItem>
      <FormItem label="账号：">
        <div class="userInfo_password">

          <Input v-model="infolist.account" class="userInfo_style Inputaccount" ref="Inputfocus" disabled
            style="background-color:#fff"></Input>
          <div class="changed_password" style="cursor:pointer;">修改密码</div>
        </div>
      </FormItem>
      <FormItem label="微信：">
        <div class="userInfo_wc" v-if="userInfo.wx_id">
          <div class="userInfo_wc_img"><img src="@/assets/images/wechat.svg" alt=""></div>
          <div class="userInfo_wc_text" style="cursor:pointer;" @click="handle_wx">已绑定（解除绑定）</div>
        </div>
        <div class="userInfo_wc" v-else>
          还没有绑定微信
        </div>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import { teacher_message, update_info, updateUserWechatId } from '@/api/user'
import upload_mixin from '_c/mixins/upload_mixin'
export default {
  mixins: [upload_mixin],
  name: 'personaldata',

  data () {
    return {
      userInfo: {},
      infolist: {
        icon: '',
        account: ''

      },
      maxsize: 307200,
      format: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'pcd', 'webp'],
      name: '',
      userdata: {
        mobile: '',
        alipay_account: '',
        sex: '',
        email: '',
        icon: ''

      }
    }
  },
  computed: {

    personal_userInfo () {
      return this.$store.state.user.userInfo
    },
    userId () {
      return this.$store.state.user.userId
    }

  },
  methods: {
    formaterror (file) {
      this.$Notice.warning({
        title: '文件格式不正确',
        desc: `文件： ${file.name}  格式有误 文件后缀名可以是 ${this.format.join(',')}`,
        duration: 5
      })
    },
    exceededsize (file) {
      this.$Notice.warning({
        title: '超过文件大小限制',
        desc: `文件：  ${file.name}  大小超过 ${this.maxsize / 1024} M, 请上传不超过 ${this.maxsize / 1024} M的文件`,
        duration: 5
      })
    },
    handleSuccess (res, file) {
      console.log(res)
      console.log(file)
      if (res.code === 200) {
        this.userInfo.icon = res.data.url
        this.userdata.alipay_account = this.userInfo.alipay_account

        this.userdata.sex = this.userInfo.sex
        this.userdata.email = this.userInfo.email
        this.userdata.icon = this.userInfo.icon
        this.userdata.mobile = this.userInfo.mobile

        update_info(this.userdata).then(response => {
          console.log(response)
          if (response.code === 200) {
            this.$Message.success('上传成功！')
            this.$store.commit('userInfo_icon', this.userInfo.icon)
          }
        })
      } else {
        this.$Message.error(res.message)
      }
    },
    // handle_password () {
    //   this.$refs.Inputfocus.focus()
    // },
    // blur () {
    //   this.axios.request({
    //     method: 'post',
    //     url: '/index.php/Teacher/User/update_info',
    //     data: {
    //       mobile: this.userInfo.mobile,
    //       alipay_account: this.userInfo.alipay_account,
    //       sex: this.userInfo.sex,
    //       email: this.userInfo.email,
    //       icon: this.userInfo.icon,
    //       password: 123456,
    //     }
    //   }).then(res => {
    //     console.log(res);

    //   })

    // },
    // 解除绑定微信
    handle_wx () {
      // this.userInfo.wx_id = ''
      updateUserWechatId(this.userInfo.id).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.$Message.success('解绑成功')
        }
      })
    },
    // 获取单个教师信息
    getteacher_message () {
      teacher_message(this.userId).then(res => {
        this.userInfo = res.data.teacher_list
        this.infolist.account = res.data.teacher_list.account
        console.log(this.userInfo)
      })
    }

    // 上传图片成功
    // imgsuccess (res) {
    //   if (res.code === 200) {
    //     this.infolist.icon = res.data.url
    //   }
    // },

  },
  mounted () {
    // this.getCookie()

    this.getteacher_message()
  }

}
</script>

<style lang='less' scoped>
.personaldata {
  .infolist_img {
    display: flex;
    align-items: center;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #009aff;
    img {
      width: 73px;
      height: 73px;
      border-radius: 50%;
      margin-right: 30px;
      border: 1px solid #ddd;
    }
  }
  .userInfo_style {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #222222;
  }
  .userInfo_wc {
    display: flex;
    align-items: center;
    .userInfo_wc_img {
      width: 36px;
      height: 36px;
    }
    .userInfo_wc_text {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #009aff;
      margin-left: 60px;
    }
  }
  .userInfo_password {
    display: flex;
    /deep/.ivu-input-disabled {
      background-color: #fff;
    }
    /deep/.ivu-input-default {
      padding: 0 !important;
      margin: 0;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #222222;
      border: none;
    }
    .Inputaccount {
      width: 100px !important;
    }
    .changed_password {
      margin-left: 30px;

      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #009aff;
    }
  }
  /deep/.ivu-form-item-label {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #666666;
  }
}
</style>
