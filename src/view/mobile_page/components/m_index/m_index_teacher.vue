<template>
  <div class="m_index_teach">
    <cell class="m_index_like_title" title="教师推荐">
      <span slot="left"><img src="@/assets/images/mobile_teacher/back.png" alt="" @click="handle_taech"></span>
      <span slot="right" class="m_index_teach_r" @click="refresh"><img src="@/assets/images/mobile_teacher/refres.png"
          alt=""></span>
    </cell>
    <!-- 教师推荐 -->

    <div class="m_recommendTeacher">

      <div class="m_recommendTeacher-center">
        <div class="m_recommendTeacher-center_item" v-for="(v,i) in recommendlist" :key="i">
          <div class="m_recommendTeacher-center_item_icon">
            <img :src="v.icon" alt="">
          </div>
          <div class="m_recommendTeacher-center_item_name">
            <div class="m_recommendTeacher-center_item_name1">
              <div class="m_recommendTeacher-center_item_name1_l"> {{v.name}}</div>
              <div class="m_recommendTeacher-center_item_name1_r"> {{v.course_count}}</div>

            </div>
            <div class="m_recommendTeacher-center_item_name2">院校：{{v.school_name}}</div>
            <div class="m_recommendTeacher-center_item_name3">职业：{{v.major_name}}</div>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script>

import { get_recommend } from '@/api/common'
import cell from '@/view/mobile_page/components/public_cell'
// import log from 'video.js/es5/utils/log'
export default {
  inject: ['reload'],
  components: {
    cell
  },

  data () {
    return {
      recommendlist: []
    }
  },

  methods: {
    // 点击刷新
    refresh () {
      // 刷新单页面
      this.reload()
    },
    handle_taech () {
      this.$emit('index_teacher')
    }
  },
  mounted () {
    get_recommend().then(res => {
      this.recommendlist = res.data.data
    })
  }
}
</script>

<style lang='less' scoped>
.m_index_teach {
  width: 100vw;
  height: 100vh;
  z-index: 999;
  background-color: #fff;
  position: fixed;
  left: 0;
  top: 0;
  overflow-y: auto;
  .m_index_teach_r {
    width: 0.42rem;
    height: 0.42rem;
    img {
      width: 0.42rem;
      height: 0.42rem;
    }
  }
  .m_recommendTeacher {
    width: 6.86rem;
    margin: 0.3rem auto;
    background-color: #fff;
    border-radius: 8px;

    .m_recommendTeacher-center {
      display: flex;
      padding: 0.1rem 0.2rem;
      justify-content: space-between;
      flex-wrap: wrap;
      .m_recommendTeacher-center_item {
        margin-bottom: 0.3rem;
        .m_recommendTeacher-center_item_icon {
          width: 3.08rem;
          height: 3.08rem;
          border-radius: 8px;
          box-shadow: 0px 0px 0.03rem 0px rgba(0, 0, 0, 0.5);
          img {
            border-radius: 8px;
            width: 3.08rem;
            height: 3.08rem;
          }
        }
        .m_recommendTeacher-center_item_name {
          .m_recommendTeacher-center_item_name1 {
            display: flex;
            justify-content: space-between;
            margin: 0.1rem 0;
            .m_recommendTeacher-center_item_name1_l {
              font-size: 0.32rem;
              font-family: PingFang SC;
              font-weight: bold;
              color: #000000;
            }
            .m_recommendTeacher-center_item_name1_r {
              font-size: 0.24rem;
              font-family: PingFang SC;
              font-weight: 500;
              color: #000000;
            }
          }
          .m_recommendTeacher-center_item_name2,
          .m_recommendTeacher-center_item_name3 {
            font-size: 0.22rem;
            font-family: PingFang SC;
            font-weight: 500;
            color: #999999;
          }
        }
      }
    }
  }
}
</style>
