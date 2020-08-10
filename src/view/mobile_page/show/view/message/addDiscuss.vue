<template>
  <div class="flex-contain">
    <mt-header title="创建话题" style="border-bottom:1px solid #EEEEEE">
      <router-link to="/mobile/mobileMessage" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <div class="m-addDiscuss-contain">
      <div style="border-bottom:1px solid #EEEEEE">
        <input type="text" placeholder="输入标题" v-model="discussAboutTitle"/>
      </div>
      <div>
        <textarea rows="6" placeholder="讨论内容简介" v-model="discussAboutContent"></textarea>
      </div>
      <div style="margin: 0 0.28rem">
        <Select v-model="selectClaaaList" multiple>
          <Option v-for="item in classList" :value="item.id" :key="item.id">{{ item.class_name }}</Option>
        </Select>
      </div>
    </div>
    <div class="m-addDiscuss-btn" @click="addDiscussAbout">确认创建</div>
  </div>
</template>
<script>

import { Toast } from 'mint-ui'
export default {
  data () {
    return {
      selectClaaaList: [],
      classList: [],
      discussAboutTitle: '',
      discussAboutContent: ''
    }
  },
  computed: {

  },
  watch: {

  },
  methods: {
    getClass () {
      this.addInfoModal = true
      this.axios.request({
        url: '/teacher/class/get_class_by_teacher_course',
        params: {
        },
        method: 'get'
      }).then(res => {
        if (res.code === 200) {
          this.classList = res.data
        }
      })
    },
    addDiscussAbout () { // 添加话题
      if (this.selectClaaaList.length === 0 || this.discussAboutTitle === '' || this.discussAboutTitle === '') {
        Toast({
          message: '请输入相关信息',
          duration: 2000
        })
      } else {
        this.axios.request({
          url: '/Teacher/Topic/topic_save',
          method: 'post',
          data: {
            id: '',
            title: this.discussAboutTitle,
            content: this.discussAboutContent,
            class_ids: this.selectClaaaList
          }
        }).then(res => {
          if (res.code === 200) {
            Toast({
              message: '添加成功',
              duration: 2000
            })
            window.history.go(-1)
          }
        })
      }
    }
  },
  mounted () {
    this.getClass()
  }
}
</script>
