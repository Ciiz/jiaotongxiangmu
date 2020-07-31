<template>
  <div class="m-coursewareTList">
    <div class="m-coursewareTItem" v-for="(item,index) in list" :key="index">
      <div class="m-coursewareT-sort">
        <span style="margin-left:0.32rem">课时</span>
        <span class="m-coursewareT-s">{{item.sort}}</span>
      </div>
      <div class="m-coursewareT-info">
        <div class="m-coursewareT-title">{{item.courseware_name}}</div>
        <div class="m-coursewareT-info-b">
          <div>
            <span>已绑定班级：</span>
            <span style="color:#16C2AA">{{item.class_list.length}}</span>
          </div>
          <div style="margin-right:0.77rem">
            <spna><Icon type="ios-alarm-outline" /></spna>
            <spna style="vertical-align:middle">{{moment(item.create_time * 1000).format('YYYY-MM-DD')}}</spna>
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
      page: 1,
      list: []
    }
  },
  props: {
    teacher_course_id: ''
  },
  watch: {

  },
  computed: {

  },
  methods: {
    getData () {
      if (!this.teacher_course_id) return
      Indicator.open({
        text: '加载中...',
        spinnerType: 'fading-circle'
      })
      this.axios.request({
        url: '/index.php/Teacher/Courseware/index',
        method: 'get',
        params: {
          page: this.page,
          teacher_course_id: this.teacher_course_id
        }
      }).then(res => {
        if (res.code === 200) {
          this.list = res.data.courseware_list
          // this.class_list = res.data.class_list ? res.data.class_list : []
          // this.course_status = res.data.course_status
        }
        Indicator.close()
      })
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
<style>

</style>
