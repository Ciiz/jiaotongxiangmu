<template>
  <div class="m-attendance flex-contain">
    <mt-header title="考勤情况"  style="border-bottom: 1px solid #E5E5E5">
      <router-link to="/mobile/mobileUserCenter" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <div class="m-attendance-contain hideScroll">
      <mt-cell
      @click.native="linkTo(item)"
      class="m-cell"
      v-for="(item,index) in list"
      :key="index"
      :title="item.course_name"
      is-link
      >
      </mt-cell>
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

  computed: {

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
    },
    linkTo (item) {
      this.$router.push({ name: 'attendanceDetail', query: { teacher_course_id: item.teacher_course_id, course_name: item.course_name } })
    }
  },
  mounted () {
    this.getCourse()
  }
}
</script>
<style>

</style>
