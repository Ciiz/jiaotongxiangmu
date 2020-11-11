<template>
  <div class="m-undo flex-contain">
    <mt-header title="代办事项">
      <div slot="left" @click="$router.back(-1)">
        <mt-button icon="back"></mt-button>
      </div>
      <!-- <router-link to="/mobile/mobileMessage" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link> -->
    </mt-header>
    <div class="infoModal-r-content">
      <div>
        <div class="ab-scroll">
          <!-- <div class="userinfo-info-showhistory" @click="getSystemInfo(2,uncorrectHistory);uncorrectHistory++">查看历史消息>></div> -->
          <div class="system-info-row" v-for="(item,index) in systemInfoList" :key="index">
            <Row type="flex" justify="space-between">
              <Col class="system-info-row-header">{{item.title}}</Col>
              <Col style="color:#AAAAAA">{{moment(item.created_at * 1000).format('YYYY-MM-DD HH:mm')}}</Col>
            </Row>
            <div>
              <span style="color:#222222">{{item.content}}</span>
              <!-- <span class="system-info-row-color8">的课前任务（这是任 务名称生活习性调查）时间已截止，可以去批改啦！</span> -->
            </div>
            <!-- <router-link to="/teachingSystem/correct" @click.native="changeTab($event)" style="display:inline-block;margin-top:12px">
              <span>前往批改>></span>
            </router-link> -->
            <!-- @click="modal3=true,deleteSystemId=item.id" -->
            <div style="margin-top:10px;color:#FF3333"><span style="cursor:pointer" @click="handledele(index)">删除</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Toast } from 'mint-ui'
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
    handledele (index) {
      if (this.userType === 1) {
        this.axios.request({
          url: '/index.php/Teacher/Notice/delete',
          method: 'post',
          data: {
            id: this.systemInfoList[index].id
          }
        }).then(res => {
          console.log(res);
          this.systemInfoList.splice(index, 1)
          Toast({
            message: '删除成功！',
            duration: 2000
          })
        })
      } else if (this.userType === 2) {
        this.axios.request({
          url: 'index.php/Student/User/delete_notice',
          method: 'post',
          data: {
            id: this.systemInfoList[index].id
          }
        }).then(res => {
          console.log(res);
          this.systemInfoList.splice(index, 1)
          Toast({
            message: '删除成功！',
            duration: 2000
          })
        })
      }

    },
    getData () {
      if (this.userType === 1) {
        this.axios.request({
          url: '/index.php/Teacher/notice/index',
          method: 'post',
          data: {
            read: -1,
            type: 3,
            pagesize: 10
          }
        }).then(res => {
          console.log(res);
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
            type: 3,
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
