<template>
  <div class="flex-contain">
    <mt-header title="课件列表" style="border-bottom:1px solid #CCCCCC">
      <router-link to="/mobileCoursewareManageT" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <div class="m-mycourseware-list-t hideScroll">
      <div v-for="(item,index) in list" :key="index" class="m-mycourseware-item-t" @click="tolink(item)">
        <div class="m-mycourseware-item-t-sort">{{item.sort}}</div>
        <div style="flex:1">
          <div class="m-mycourseware-item-t-name">{{item.courseware_name}}</div>
          <div class="m-mycourseware-item-t-class">已绑定班级：{{item.class_list.length}}</div>
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
      list: [],
      page: 1
    }
  },
  watch: {

  },
  computed: {
    teacher_course_id () {
      return this.$route.query.teacher_course_id
    }
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
        }
        Indicator.close()
      })
    },
    tolink (i) {
      let data = JSON.stringify(i.class_list)
      this.$router.push({ name: 'mobileClassListT', query: { class_list: data, id: i.id } })
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
