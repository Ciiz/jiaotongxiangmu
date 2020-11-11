<template>
  <div class="mobileAttention">
    <cell title="我的关注">
      <span slot="left"><img src="@/assets/images/mobile_teacher/back.png" alt="" @click="$router.back(-1)"></span>
      <span slot="right"></span>
    </cell>
    <div class="mobileAttention_list">
      <div class="mobile_null" v-if="mobileAttentionlength===0 ">暂无关注...</div>
      <ul>
        <li v-for="(item,index) in mobileAttention" :key="index"
          @click="$router.push({path: `/m_index_school_teacherUser/${item.teacher_id}`})">
          <div class="mobileAttention_list_icon"><img :src="item.icon" alt=""></div>
          <div class="mobileAttention_list_nameAndmajor">
            <div class="mobileAttention_list_name">{{item.teacher_name}}</div>
            <div class="mobileAttention_list_major">({{item.major_name}}老师)</div>
          </div>
          <div class="mobileAttention_list_cancle" @click="handleCancel(index)">取消关注</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { Indicator, Toast } from 'mint-ui'
import { student_unfollow } from "@/api/student"
import { unfollow_Attention } from "@/api/user"
import cell from '@/view/mobile_page/components/public_cell'
import log from 'video.js/es5/utils/log'
export default {

  components: {
    cell
  },

  data () {
    return {
      mobileAttention: [],
      mobileAttentionlength: ''
    }
  },
  computed: {
    userType () {
      return this.$store.state.user.userInfo.userType
    },
  },
  methods: {
    handleCancel (index) {
      if (this.userType === 1) {
        unfollow_Attention(this.mobileAttention[index].id).then(res => {
          this.mobileAttention.splice(index, 1)
          Toast({
            message: '取消成功',
            duration: 2000
          })
        })
      }
      else if (this.userType === 2) {
        student_unfollow(this.mobileAttention[index].id).then(res => {
          this.mobileAttention.splice(index, 1)
          Toast({
            message: '取消成功',
            duration: 2000
          })
        })
      }

    }
  },
  mounted () {
    Indicator.open()
    if (this.userType === 1) {
      this.axios.request({
        method: 'get',
        url: '/Teacher/TeacherAttention/index',
      }).then(res => {
        this.mobileAttention = res.data.list
        this.mobileAttentionlength = res.data.list.length
        Indicator.close()
      })
    } else if (this.userType === 2) {
      this.axios.request({
        method: 'get',
        url: '/Student/TeacherAttention/index',
      }).then(res => {
        console.log(res);
        this.mobileAttention = res.data.list
        this.mobileAttentionlength = res.data.list.length
        Indicator.close()
      })
    }


  }
}
</script>

<style lang='less' scoped>
.mobileAttention {
  /deep/.m_cell {
    border-bottom: 1px solid #eeeeeeff;
  }
  .mobileAttention_list {
    padding: 0.2rem;
    ul {
      li {
        display: flex;
        align-items: center;
        padding: 0.3rem 0.1rem;
        justify-content: space-between;
        border-bottom: 1px solid #eeeeeeff;
        .mobileAttention_list_nameAndmajor {
          display: flex;
          align-items: center;
          flex: 1;
          margin-left: 0.2rem;
          .mobileAttention_list_name {
            font-size: 0.36rem;
            font-family: PingFang SC;
            font-weight: bold;
            color: #000000;
          }
          .mobileAttention_list_major {
            font-size: 0.28rem;
            font-family: PingFang SC;
            font-weight: 500;
            color: #444444;
            margin-left: 0.2rem;
          }
        }
        .mobileAttention_list_icon {
          height: 0.9rem;
          width: 0.9rem;
          border-radius: 50%;
          img {
            height: 0.9rem;
            width: 0.9rem;
            border-radius: 50%;
          }
        }

        .mobileAttention_list_cancle {
          width: 1.25rem;
          height: 0.5rem;
          border: 1px solid #666666;
          border-radius: 0.1rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
}
</style>
