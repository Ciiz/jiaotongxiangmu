<template>
  <div class="check">
    <cell title="学生考勤">
      <span slot="left"><img src="@/assets/images/mobile_teacher/back.png" alt="" @click="$router.back(-1)"></span>
      <span slot="right"></span>
    </cell>
    <div class="check_list">
      <ul>
        <li v-for="(v,i) in list" :key="i" @click="handleckeck(i)">
          <div class="check_list_item">{{v.course_name}}</div>
          <div class="check_list_iocn"><img src="@/assets/images/public/you.png" alt=""></div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import cell from '@/view/mobile_page/components/public_cell'
import { my_course } from '@/api/student'
import { Indicator } from 'mint-ui'
import log from 'video.js/es5/utils/log'
// import { get_attendance_list } from "@/api/data"
export default {
  components: {
    cell
  },

  data () {
    return {
      list: []
    }
  },
  computed: {

  },
  methods: {
    handleckeck (i) {
      console.log(this.list[i].teacher_course_id);
      this.$router.push({ path: `/look_check_details/${this.list[i].teacher_course_id}` })
    },
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
        console.log(res);
        this.list = res.data.course_list
        Indicator.close()
      })
    },
  },
  mounted () {

    this.getCourse()

  }
}
</script>

<style lang='less' scoped>
.check {
  .check_list {
    ul {
      li {
        display: flex;
        justify-content: space-between;
        padding: 0.4rem 0.2rem;
        border-bottom: 1px solid #ccc;
        .check_list_item {
        }
        .check_list_iocn {
          img {
            width: 0.3rem;
            height: 0.3rem;
          }
        }
      }
    }
  }
}
</style>
