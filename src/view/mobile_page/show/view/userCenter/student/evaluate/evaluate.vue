<template>
  <div class="m-evaluate flex-contain">
    <mt-header title="考核评价" style="border-bottom: 1px solid #E5E5E5">
      <router-link to="/mobile/mobileUserCenter" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <div class="m-evaluate-contain hideScroll">
      <div v-for="(item,index) in list" :key="index" class="m-evaluate-item">
        <div>{{item.course_name}}</div>
        <div>成绩：<span>{{item.course_score}}</span>&nbsp;分</div>
      </div>
    </div>
    <div class="m-evaluate-bottom">
      <Icon type="ios-qr-scanner" />
      <span>更多信息请登录电脑端查看</span>
    </div>
  </div>
</template>
<script>
import { Indicator } from 'mint-ui'
import { my_course } from '@/api/student'
export default {
  data () {
    return {
      list: []
    }
  },
  watch: {

  },
  methods: {
    getCourse () {
      Indicator.open({
        text: '加载中...',
        spinnerType: 'fading-circle'
      })
      my_course({
        page_size: 10000,
        page_no: 1
      }).then(res => {
        if (res.code === 200) {
          let data = res.data
          this.list = data.list
        }
        Indicator.close()
      })
    }
  },
  mounted () {
    this.getCourse()
  }
}
</script>
