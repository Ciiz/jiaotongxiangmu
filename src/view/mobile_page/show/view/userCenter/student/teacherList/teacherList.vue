<template>
  <!-- to="/mobile/mobileUserCenter" -->
  <div class="m-teacherList flex-contain">
    <mt-header title="提问教师" style="border-bottom: 1px solid #E5E5E5">
      <div slot="left" @click="$router.back(-1)">
        <mt-button icon="back"></mt-button>
      </div>
    </mt-header>
    <div class="m-teacherList-contain hideScroll">
      <div v-for="(item,index) in list" :key="index">
        <img :src="item.icon" />
        <span>{{item.name}}</span>
        <button @click="rTeacher(item)">提问</button>
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
  methods: {
    getData () {
      Indicator.open({
        text: '加载中...',
        spinnerType: 'fading-circle'
      })
      this.axios.request({
        method: 'post',
        url: '/index.php/Student/User/teacher_list',
        data: {
        }
      }).then(res => {
        if (res.code === 200) {
          console.log(res);

          this.list = res.data.teacher_list
          Indicator.close()
        }
      })
    },
    rTeacher (item) {
      let a = 'task_' + item.id + '_' + this.$store.state.user.userInfo.userId
      this.sendInfoStudent(item, a)
    },
    sendInfoStudent (item, a) { // 学生端提问
      console.log(item);
      this.axios.request({
        method: 'post',
        url: '/index.php/Student/Task/question_send',
        data: {
          target_id: item.id,
          content: item.name + '老师你好',
          statustype: 1
        }
      }).then(res => {
        if (res.code === 200) {
          let chatList = { table_type: 2, taskgroup: a, userInfo: { name: item.name, id: item.id } }
          this.$router.push({ name: 'discuss', query: { chatList: chatList } })
        }
      })
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
