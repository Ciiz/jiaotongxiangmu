<template>
  <div class="m-systeminfoShow flex-contain">
    <mt-header title="系统消息">
      <router-link to="/mobile/mobileMessage" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <div class="infoModal-r-content">
      <div>
        <div>
          <div class="ab-scroll">
            <!-- <div class="userinfo-info-showhistory" @click="getSystemInfo (2,systemHistory);systemHistory++">查看历史消息>></div> -->
            <div class="system-info-row" v-for="(item,index) in systemInfoList" :key="index">
              <div class="hd" v-if="item.status===0"></div>
              <Row type="flex" justify="space-between">
                <Col class="system-info-row-header">{{item.title}}</Col>
                <Col style="color:#AAAAAA">{{moment(item.created_at * 1000).format('YYYY-MM-DD HH:mm')}}</Col>
              </Row>
              <div class="system-info-row-color8" v-html="item.content"> </div>
              <div style="margin-top:10px;color:#FF3333"><span style="cursor:pointer" @click="modal3=true,deleteSystemId=item.id">删除</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      systemInfoList: [],
      userType: this.$store.state.user.userInfo.userType
    }
  },
  watch: {

  },
  methods: {
    getData () {
      if (this.userType === 1) {
        this.axios.request({
          url: '/index.php/Teacher/notice/index',
          method: 'post',
          data: {
            read: -1,
            type: 1,
            pagesize: 10
          }
        }).then(res => {
          if (res.code === 200) {
            this.systemInfoList = []
            for (let i = res.data.notice_list.length - 1; i >= 0; i--) {
              this.systemInfoList.push(res.data.notice_list[i])
            }
            this.$nextTick(function () {
              document.getElementsByClassName('ab-scroll')[0].scrollTop = 10 / this.systemInfoList.length * document.getElementsByClassName('ab-scroll')[0].scrollHeight
            })
          }
        })
      } else if (this.userType === 2) {
        this.axios.request({
          url: '/index.php/Student/User/getNoticeList',
          method: 'post',
          data: {
            read: -1,
            type: 1,
            page_size: 10
          }
        }).then(res => {
          if (res.code === 200) {
            this.systemInfoList = []
            for (let i = res.data.list.length - 1; i >= 0; i--) {
              this.systemInfoList.push(res.data.list[i])
            }
            this.$nextTick(function () {
              document.getElementsByClassName('ab-scroll')[0].scrollTop = 10 / this.systemInfoList.length * document.getElementsByClassName('ab-scroll')[0].scrollHeight
            })
          }
        })
      }
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
