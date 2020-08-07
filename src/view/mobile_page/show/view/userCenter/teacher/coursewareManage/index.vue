<template>
  <div class="flex-contain" style="position:relative;height:100%">
    <mt-header title="课件管理">
      <router-link to="/mobile/mobileUserCenter" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <div class="m-mycourse-list hideScroll" style="background:#F7F7F7">
      <div v-for="(item,index) in list" :key="index" class="m-mycourse-item" @click="toLink(item)">
        <div>
          <img :src="item.img"/>
        </div>
        <div class="m-mycourse-list-info-t">
          <div>{{item.course_name}}</div>
          <div style="display:flex;justify-content:space-between;color:#444444">
            <div>班级：{{item.class_num}}</div>
            <div>课件：{{item.courseware_total}}</div>
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
      list: []
    }
  },
  watch: {

  },
  computed: {

  },
  methods: {
    getCourse () {
      Indicator.open({
        text: '加载中...',
        spinnerType: 'fading-circle'
      })
      this.axios.request({
        url: '/index.php/Teacher/Course/index',
        method: 'get',
        params: {
          page: 1,
          keyword: '',
          type: 0
        }
      }).then(res => {
        if (res.code === 200) {
          this.list = res.data.course_list
        }
        Indicator.close()
      })
    },
    toLink (item) {
      this.$router.push({ name: 'mobileCoursewareListT', query: { teacher_course_id: item.teacher_course_id } })
    }
  },
  mounted () {
    this.getCourse()
  }
}
</script>
