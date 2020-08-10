<template>
  <div class="flex-contain">
    <mt-header title="考核与评价">
      <router-link to="/mobileEvaluateT" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <div class="m-evaluateList-h">
      <select class="m-select" v-model="class_choose" style="flex:1;margin-right:0.14rem">
        <option :value="item.value" v-for="(item,index) in class_list" :key="index">{{item.label}}</option>
      </select>
      <select class="m-select" v-model="section_choose">
        <option v-for="(sectionitem,index) in section_list" :value="sectionitem.id" :key="sectionitem.id">{{index !== 0 ? '第' + sectionitem.sort + '课时' : sectionitem.sort}}</option>
      </select>
    </div>
    <div class="m-evaluateList-list hideScroll">
      <div v-for="(item,index) in course_list" :key="index" class="m-evaluateList-item" @click="tolink(item.student_course_id)">
        <div class="m-evaluateList-item-index">{{index+1}}</div>
        <div class="m-evaluateList-item-name">{{item.name}}</div>
        <div class="m-evaluateList-item-score">课程总成绩：{{item.total_score}}</div>
        <div class="m-evaluateList-item-icon"><Icon type="ios-arrow-forward" /></div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  data () {
    return {
      class_list: [],
      section_list: [],
      class_choose: '',
      section_choose: '',
      course_list: []

    }
  },
  watch: {
    class_choose (newval) {
      this.section_choose = ''
      this.section_list = []
      this.get_list_info(this.class_choose, '', this.keyword)
      for (let i in this.axios_data) {
        if (this.axios_data[i].id === newval) {
          this.section_list = this.axios_data[i].coursewares
          break
        }
      }
      this.section_list.unshift({
        id: 0,
        sort: '课程总成绩'
      })
      // 数组去重
      let allArr = []
      for (let i = 0; i < this.section_list.length; i++) {
        let flag = true
        for (let j = 0; j < allArr.length; j++) {
          if (this.section_list[i].id === allArr[j].id) {
            flag = false
          }
        }
        if (flag) {
          allArr.push(this.section_list[i])
        }
      }
      this.section_list = allArr
      this.timer_class = setInterval(() => { // 班级设置默认选中 （开启定时器消除网速对操作的影响）
        if (this.section_list.length > 0) {
          clearInterval(this.timer_class)
          this.section_choose = this.section_list[0].id
        }
      }, 200)
    },
    section_choose (newval) {
      if (newval !== '' && newval !== undefined) {
        this.get_list_info(this.class_choose, newval)
      }
    }
  },
  computed: {
    teacher_course_id () {
      return this.$route.query.teacher_course_id
    }
  },
  methods: {
    getInfo () {
      this.axios.request({
        method: 'get',
        url: '/index.php/Teacher/Class/get_class_by_course',
        params: {
          teacher_course_id: this.teacher_course_id
        }
      }).then(res => {
        if (res.code === 200) {
          if (res.data.length > 0) {
            let data = res.data
            this.axios_data = data
            this.class_list = []
            for (let i in data) {
              this.class_list.push({
                value: data[i].id,
                label: data[i].class_name
              })
            }
          }
          this.timer_class = setInterval(() => { // 班级设置默认选中 （开启定时器消除网速对操作的影响）
            if (this.class_list.length > 0) {
              clearInterval(this.timer_class)
              this.class_choose = this.class_list[0].value
            }
          }, 200)
        }
      })
    },
    get_list_info (class_id, coursware_id, keyword) {
      this.axios.request({
        method: 'get',
        url: '/index.php/Teacher/Score/get_student_by_class_score',
        params: {
          class_id,
          coursware_id,
          teacher_course_id: this.teacher_course_id,
          keyword
        }
      }).then(res => {
        if (res.code === 200) {
          this.course_list = []
          let data = res.data
          for (let i in data) {
            this.course_list.push(data[i])
          }
        }
      })
    },
    tolink (i) {
      this.$router.push({ name: 'mobileEvaluateDetailT', query: { student_course_id: i } })
    }
  },
  mounted () {
    this.getInfo()
  }
}
</script>
