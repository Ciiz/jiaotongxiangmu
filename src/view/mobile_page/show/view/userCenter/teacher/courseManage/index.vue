<template>
  <div class="flex-contain" style="position:relative;height:100%">
    <mt-header title="课程管理">
      <router-link to="/mobile/mobileUserCenter" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
      <mt-button icon="search" slot="right"></mt-button>
    </mt-header>
    <mt-navbar v-model="bind_type" class="m-message-tab" style="padding:0 0.45rem">
      <mt-tab-item id="4">全部</mt-tab-item>
      <mt-tab-item id="1">被分配</mt-tab-item>
      <mt-tab-item id="2">自选课程</mt-tab-item>
      <mt-tab-item id="3">自建课程</mt-tab-item>
    </mt-navbar>
    <div class="m-courseManage-contain hideScroll">
      <div v-for="(item,index) in list" :key="index" class="m-mycourse-item" @click="showDetail(item.id,item.audit_status,item.release_status,item.teacher_course_id)">
        <div>
          <img :src="item.img" />
        </div>
        <div class="m-mycourse-list-info-t">
          <div>{{item.course_name}}</div>
          <div class="m-coursewareT-info-b" style="display:flex">
            <div>
              <span v-if="item.audit_status===1&&item.release_status===0">未发布</span>
              <span v-if="item.audit_status===1&&item.release_status===1">已发布</span>
              <span v-if="item.audit_status===2">审核不通过</span>
              <span v-if="item.audit_status===3">待审核</span>
            </div>
            <div>
              <spna><Icon type="ios-alarm-outline" /></spna>
              <spna style="vertical-align:middle">{{moment(item.created_at * 1000).format('YYYY-MM-DD')}}</spna>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Indicator } from 'mint-ui'

export default {
  data () {
    return {
      bind_type: '4',
      list: []
    }
  },
  watch: {
    bind_type (n, o) {
      this.getData()
    }
  },
  computed: {

  },
  methods: {
    getData () {
      Indicator.open()
      this.axios.request({
        url: '/index.php/Teacher/Course/index',
        method: 'get',
        params: {
          page: 1,
          keyword: '',
          type: this.bind_type
        }
      }).then(res => {
        if (res.code === 200) {
          this.list = res.data.course_list
        }
        Indicator.close()
      })
    },
    showDetail (i, a, r, t) {
      this.$router.push({ name: 'mobileCourseInfoT', query: { id: i, audit_status: a, release_status: r, teacher_course_id: t, bind_type: this.bind_type } })
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
