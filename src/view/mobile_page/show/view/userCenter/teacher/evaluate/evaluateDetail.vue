<template>
  <div class="flex-contain">
    <mt-header :title="username+'的成绩'">
      <router-link to slot="left">
        <mt-button icon="back" @click="back"></mt-button>
      </router-link>
    </mt-header>
    <div class="m-evaluateDetail-contain hideScroll">
      <div v-for="(item,index) in list" :key="index" class="m-evaluateDetail-item">
        <div class="m-evaluateDetail-item-sort">{{index+1}}</div>
        <div style="flex:1">
          <div style="display:flex">
            <div class="m-evaluateDetail-item-name">{{item.courseware_name}}</div>
            <div class="m-evaluateDetail-item-score">
              <span>课程总成绩：</span>
              <span>{{item.score.total_score}}</span>
            </div>
          </div>
          <div class="m-evaluateDetail-score-detail">
            <div>课前：{{item.score.before_score}}</div>
            <div>课中：{{item.score.in_score}}</div>
            <div>课后：{{item.score.after_score}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import { student_course_score } from '@/api/data'
export default {
  data () {
    return {
      username: '',
      list: []
    }
  },
  watch: {

  },
  computed: {
    student_course_id () {
      return this.$route.query.student_course_id
    }
  },
  methods: {
    back () {
      window.history.go(-1)
    },
    getData () {
      student_course_score(this.student_course_id).then(res => {
        if (res.code === 200) {
          this.username = res.data.name
          this.list = Object.values(res.data.courseware)
        }
      })
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
