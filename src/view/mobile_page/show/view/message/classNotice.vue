<template>
   <div class="m-classNotice flex-contain">
    <mt-header title="上课提醒">
      <router-link to="/mobile/mobileMessage" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <div class="infoModal-r-content">
      <div>
        <div class="ab-scroll">
          <!-- <div class="userinfo-info-showhistory" @click="getSystemInfo(2,classInfoHistory);classInfoHistory++">查看历史消息>></div> -->
          <div class="system-info-row" v-for="(item,index) in systemInfoList" :key="index">
            <Row type="flex" justify="space-between">
              <Col class="system-info-row-header">{{item.title}}</Col>
              <Col style="color:#AAAAAA">{{moment(item.created_at * 1000).format('YYYY-MM-DD HH:mm')}}</Col>
            </Row>
            <div class="system-info-row-color8" style="line-height:22px">
              {{item.content}}
            </div>
            <div style="margin-top:10px;color:#FF3333"><span style="cursor:pointer" @click="modal3=true,deleteSystemId=item.id">删除</span></div>
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
      systemInfoList: []
    }
  },
  watch: {

  },
  methods: {
    getData () {
      this.axios.request({
        url: '/index.php/Student/User/getNoticeList',
        method: 'post',
        data: {
          read: -1,
          type: 2,
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
  },
  mounted () {
    this.getData()
  }
}
</script>
