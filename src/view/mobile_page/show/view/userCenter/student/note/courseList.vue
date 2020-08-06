<template>
  <div class="m-course flex-contain" style="padding-bottom:0">
    <mt-header title="课堂笔记">
      <router-link to="/mobile/mobileUserCenter" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <div class="m-mycourse-list hideScroll" style="background:#F7F7F7">
      <div v-for="(item,index) in list" :key="index" class="m-mycourse-item" @click="toLink(item)">
        <div>
          <img :src="item.img"/>
        </div>
        <div class="m-mycourse-list-info">
          <div>{{item.course_name}}</div>
          <div v-html="item.description"></div>
          <div style="display:flex;justify-content:space-between">
            <div>xx老师</div>
            <div>笔记：xx</div>
          </div>
        </div>
      </div>
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
    },
    toLink (item) {
      this.$router.push({ name: 'noteList', query: { teacher_course_id: item.teacher_course_id, course_name: item.course_name } })
    }
  },
  mounted () {
    this.getCourse()
  }
}
</script>
