<template>
  <div class="m_index_school">
    <cell class="m_index_school_title" title="合作院校">
      <span slot="left"><img src="@/assets/images/mobile_teacher/back.png" alt="" @click="handle_school"></span>
      <span slot="right" class="m_index_school_r" @click="$router.push({name:'searchpage'})"><img
          src="@/assets/images/mobile_teacher/search2.png" alt=""></span>
    </cell>
    <div class="m_index_school_num">
      <span class="m_index_school_num1">合作院校：{{allSchool.length}} 所</span>
      <span class="m_index_school_num2">按课程数量排序</span>
    </div>
    <div class="m_index_school_list" v-for="(v,i) in allSchool" :key="i">
      <div class="m_index_school_list_l">
        <span :class="{red: i+1 ==1,bulue: i+1 ==2, yellow:i+1==3} ">{{i+1}}</span>
      </div>
      <span class="m_index_school_list_r">
        <div class="m_index_school_list_r_img"><img :src="v.school_icon" alt=""></div>
        <div class="m_index_school_list_r_name">
          <div class="m_index_school_list_r_name_top">{{v.school_name}}</div>
          <div class="m_index_school_list_r_name_num">
            <div class="m_index_school_list_r_name_num1">拥有课程 ：{{v.course_num}}</div>
            <div class="m_index_school_list_r_name_num2"> 拥有教师 ：{{v.teacher_num}}</div>
          </div>
        </div>
      </span>
    </div>
  </div>
</template>

<script>
import cell from '@/view/mobile_page/components/public_cell'

import { getSchoolList } from '@/api/common'
// import log from 'video.js/es5/utils/log'
export default {
  components: {
    cell
  },
  data () {
    return {
      allSchool: []

    }
  },
  methods: {
    handle_school () {
      this.$emit('handle_schoolClose')
    },

    compare (property) {
      return function (a, b) {
        var value1 = a[property]
        var value2 = b[property]
        return value2 - value1 // value2>value1---降序  value1>value2 ---升序
      }
    }

  },
  async mounted () {
    let res = await getSchoolList()
    console.log(res)
    var course_num = []
    var course_num = res.data.list.map(item => {
      return item
    })
    // 排序
    this.allSchool = course_num.sort(this.compare('course_num'))
    console.log(course_num)
  }
}
</script>

<style lang='less' scoped>
.red {
  color: #ff0000;
}
.bulue {
  color: #ff6600;
}
.yellow {
  color: #ffcc00;
}
.m_index_school {
  width: 100vw;
  height: 100vh;
  z-index: 999;
  background-color: #fff;
  position: fixed;
  left: 0;
  top: 0;
  overflow-y: auto;
  .m_index_school_title {
    border-bottom: 1px solid #ccc;
    .m_index_school_r {
      width: 0.4rem;
      height: 0.4rem;
      img {
        width: 0.4rem;
        height: 0.4rem;
      }
    }
  }
  .m_index_school_num {
    margin: 0 auto;
    width: 6.86rem;
    display: flex;
    padding: 0.4rem 0;
    justify-content: space-between;
    border-bottom: 1px solid #ccc;
    .m_index_school_num1 {
      font-size: 0.24rem;
      font-family: PingFang SC;
      font-weight: 500;
      color: #000000;
    }
    .m_index_school_num2 {
      font-size: 0.24rem;
      font-family: PingFang SC;
      font-weight: 500;
      color: #999999;
    }
  }
  .m_index_school_list:nth-last-child(1) {
    margin-bottom: 0.4rem;
  }
  .m_index_school_list {
    display: flex;
    align-items: center;
    padding: 0.1rem 0.3rem;
    .m_index_school_list_l {
      padding: 0.1rem 0.5rem 0.1rem 0;

      font-size: 0.36rem;
      font-family: FZLanTingHeiS-H-GB;
      font-weight: bold;
      font-style: italic;
      color: #999999;
    }
    .m_index_school_list_r {
      flex: 1;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #ccc;
      padding: 0.3rem 0;
      .m_index_school_list_r_img {
        width: 1.2rem;
        height: 1.2rem;
        border-radius: 50%;
        margin-right: 0.2rem;
        img {
          width: 1.2rem;
          height: 1.2rem;
          border-radius: 50%;
        }
      }
      .m_index_school_list_r_name {
        display: flex;
        flex-direction: column;
        .m_index_school_list_r_name_top {
          margin-bottom: 0.2rem;
        }
        .m_index_school_list_r_name_num {
          display: flex;
          .m_index_school_list_r_name_num1 {
            margin-right: 0.4rem;
          }
        }
      }
    }
  }
}
</style>
