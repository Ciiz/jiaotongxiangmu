<template>
  <div class="teacher_massge">
    <cell>
      <span slot="left"><img src="@/assets/images/mobile_teacher/back.png" alt="" @click="$router.back(-1)"></span>
    </cell>
    <div class="teacher_massge_top">
      <div class="teacher_massge_topHeader">
        <div class="teacher_massge_topHeader_img"><img :src="teacher_massge.icon" alt=""></div>
        <div class="teacher_massge_topHeader_r">
          <ul>

            <li class="teacher_massge_topHeader_r_name">
              {{teacher_massge.name}}
              <span><img src="@/assets/images/mobile_teacher/v.png" alt=""></span>
            </li>
            <li class="teacher_massge_topHeader_r_num">账号：{{teacher_massge.account}}</li>
            <li class="teacher_massge_topHeader_r_major">职业：{{teacher_massge.major_name}}</li>
            <li class="teacher_massge_topHeader_r_school">所属院校：<span
                class="teacher_massge_topHeader_r_school2">{{teacher_massge.school_name}}</span></li>
            <li @click="handle_follow" class="teacher_massge_topHeader_r_attention">
              <span :class="{color: teacher_massge.isfollow}"> {{teacher_massge.isfollow ?  '已关注' : '+ 关注'}}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="teacher_massge_topFooter">
        <ul>
          <li>
            <div class="teacher_massge_topFooter_course1">Ta的课程</div>
            <div class="teacher_massge_topFooter_course2">{{teacher_massge.course_num}}</div>
          </li>
          <li>
            <div class="teacher_massge_topFooter_study1">学习人数</div>
            <div class="teacher_massge_topFooter_study2">{{teacher_massge.student_num}}</div>
          </li>
          <li>
            <div class="teacher_massge_topFooter_class1">Ta的班级</div>
            <div class="teacher_massge_topFooter_class2">{{teacher_massge.class_num}}</div>
          </li>
          <li>
            <div class="teacher_massge_topFooter_fensi1">Ta的粉丝</div>
            <div class="teacher_massge_topFooter_fensi2">{{teacher_massge.attention_num}}</div>
          </li>
        </ul>
      </div>
    </div>
    <div class="teacher_massge_bottom">
      <div class="teacher_massge_bottom_title">Ta的全部课程</div>
      <div v-if="course_list.length===0" class="teacher_massge_bottom_null">暂无课程！</div>
      <div class="teacher_massge_bottom_list">
        <div class="teacher_massge_bottom_list_item" v-for="(v,i) in course_list" :key="i">
          <div class="teacher_massge_bottom_list_itemImg">
            <div class="teacher_massge_icon"><img src="@/assets/images/mobile_teacher/bofang3.png" alt="">

              <span v-if="v.play_count===null">0</span>
              <span v-else>{{v.play_count}}</span>
            </div>

            <div class="teacher_massge_img"> <img :src="v.img" alt=""> </div>
          </div>
          <div class="teacher_massge_bottom_list_itemName">
            {{v.course_name}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { get_taechermassge } from '@/api/teacher'
import { get_follow, get_unfollow } from '@/api/common'
import { Toast } from 'mint-ui'
import cell from '@/view/mobile_page/components/public_cell'
export default {
  components: {
    cell
  },
  data () {
    return {
      teacher_massge: '',
      course_list: []
    }
  },
  methods: {
    async handle_follow () {
      if (this.teacher_massge.isfollow) {
        let result = await get_unfollow(this.teacher_massge.id)
        if (result.code === 200) {
          Toast({
            message: '取消成功!',
            duration: 2000
          })
        }
        this.teacher_massge.isfollow = false
      } else {
        let res = await get_follow(this.teacher_massge.id)
        if (res.code === 200) {
          Toast({
            message: '关注成功!',
            duration: 2000
          })
        }
        this.teacher_massge.isfollow = true
      }
    }
  },
  async  mounted () {
    let res = await get_taechermassge(this.$route.params.id)
    console.log(res)
    this.teacher_massge = res.data.teacher_list
    this.isfollow = res.data.teacher_list.isfollow
    console.log(this.isfollow)
    console.log(this.liked)
    this.course_list = res.data.course_list
  }
}
</script>

<style lang='less' scoped>
.color {
  background-color: pink !important;
  width: 1.33rem;
  height: 0.6rem;
  border-radius: 8px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 0.26rem;
}
.teacher_massge {
  .teacher_massge_top {
    padding: 0.3rem 0.3rem;
    .teacher_massge_topHeader {
      display: flex;
      background-color: #fff;

      border-bottom: 1px solid #ccc;
      padding: 0 0 0.2rem 0;
      .teacher_massge_topHeader_img {
        margin-right: 0.3rem;
        img {
          width: 2.09rem;
          height: 2.09rem;
          border-radius: 50%;
        }
      }
      .teacher_massge_topHeader_r {
        li {
          margin: 0.2rem 0;
        }
        .teacher_massge_topHeader_r_name {
          font-size: 0.38rem;
          font-family: PingFang SC;
          font-weight: bold;
          color: #000000;
          img {
            width: 0.36rem;
            height: 0.36rem;
          }
        }
        .teacher_massge_topHeader_r_num,
        .teacher_massge_topHeader_r_major {
          font-size: 0.26rem;
          font-family: PingFang SC;
          font-weight: 500;
          color: #222222;
        }
        .teacher_massge_topHeader_r_school {
          font-size: 0.26rem;
          font-family: PingFang SC;
          font-weight: 500;
          color: #222222;
          .teacher_massge_topHeader_r_school2 {
            color: #268af1ff;
          }
        }
        .teacher_massge_topHeader_r_attention {
          background-color: #f63838ff;
          width: 1.33rem;
          height: 0.6rem;
          // background-color: #f63838ff;
          border-radius: 8px;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 0.26rem;
        }

        .teacher_massge_topHeader_r_btn {
          width: 1.33rem;
          height: 0.6rem;
          background-color: #f63838ff;
          border-radius: 8px;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 0.26rem;
        }
      }
    }
    .teacher_massge_topFooter {
      background-color: #fff;
      margin-top: 0.4rem;
      ul {
        display: flex;
        justify-content: space-between;
        li {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .teacher_massge_topFooter_course1,
          .teacher_massge_topFooter_study1,
          .teacher_massge_topFooter_class1,
          .teacher_massge_topFooter_fensi1 {
            font-size: 0.2rem;
            font-family: PingFang SC;
            font-weight: 500;
            color: #444444;
          }
          .teacher_massge_topFooter_course2,
          .teacher_massge_topFooter_study2,
          .teacher_massge_topFooter_class2,
          .teacher_massge_topFooter_fensi2 {
            font-size: 0.46rem;
            font-family: PingFang SC;
            font-weight: bold;
            color: #3c9bff;
            margin-top: 0.1rem;
          }
        }
      }
    }
  }
  .teacher_massge_bottom {
    margin-top: 0.3rem;
    .teacher_massge_bottom_null {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 1rem;
    }
    .teacher_massge_bottom_title {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.28rem;
      font-family: PingFang SC;
      font-weight: 500;
      color: #9a9a9a;
      margin: 0.2rem 0;
    }
    .teacher_massge_bottom_list {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      padding: 0.2rem 0.3rem;
      .teacher_massge_bottom_list_item {
        margin-bottom: 0.3rem;

        .teacher_massge_bottom_list_itemImg {
          position: relative;
          overflow: hidden;
          .teacher_massge_img {
            img {
              width: 3.04rem;
              height: 3.04rem;
              border-radius: 8px;
            }
          }
          .teacher_massge_icon {
            position: absolute;
            bottom: 0.1rem;
            left: 0.16rem;
            font-size: 0.22rem;
            font-family: PingFang SC;
            font-weight: bold;
            color: #ffffff;
            img {
              width: 0.16rem;
              height: 0.16rem;
              margin-right: 0.1rem;
            }
          }
          width: 3.04rem;
          height: 3.04rem;
          background: #3c9cff;
          border-radius: 8px;
        }

        .teacher_massge_bottom_list_itemName {
          font-size: 0.28rem;
          font-family: PingFang SC;
          font-weight: 500;
          color: #222222;
          margin: 0.1rem 0;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
      }
    }
  }
}
</style>
