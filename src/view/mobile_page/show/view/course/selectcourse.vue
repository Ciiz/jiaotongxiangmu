<template>
  <div class="m-selectcourse flex-contain">
    <mt-header title="选课">
      <router-link to="/mobile/mobileCourse" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <div class="m-selectcourse-contain hideScroll">
      <RadioGroup v-model="selectC" style="width:100%">
        <Radio :label="item.teacher_course_id" v-for="(item,index) in list" :key="index" class="m-selectcourse-item" :disabled="item.selected===true">
          <div>
            <img :src="item.img"/>
          </div>
          <div class="m-mycourse-list-info">
            <div>{{item.course_name}}</div>
            <div v-html="item.description"></div>
            <div style="display:flex;justify-content:space-between">
              <div>xx老师</div>
              <div>x章节</div>
            </div>
          </div>
        </Radio>
      </RadioGroup>
    </div>
    <div>
      <button class="m-b-btn-b" @click="selectCourse">选择课程</button>
    </div>
  </div>
</template>
<script>

import { get_school_course } from '@/api/common'
import { Toast } from 'mint-ui'
export default {
  data () {
    return {
      list: [],
      selectC: ''
    }
  },
  computed: {
    schoolId () {
      return this.$store.state.user.userInfo.schoolId
    }
  },
  watch: {

  },
  methods: {
    getData () {
      get_school_course({
        page_no: 1,
        page_size: 1000,
        school_id: this.schoolId
      }).then(res => {
        if (res.code === 200) {
          this.list = res.data.list
          for (let i = 0; i < this.list.length; i++) {
            this.list[i].select = false
          }
        }
      })
    },
    selectCourse () {
      if (this.selectC === '') {
        Toast({
          message: '尚未选择课程',
          duration: 2000
        })
      } else {
        this.axios
          .request({
            method: 'post',
            url: 'index.php/Student/Course/bindCourse',
            data: {
              teacher_course_id: this.selectC
            }
          })
          .then(res => {
            if (res.code === 200) {
              Toast({
                message: res.message,
                duration: 2000
              })
              this.$router.push({ path: '/mobile/mobileCourse' })
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
<style>

</style>
