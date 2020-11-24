<template>
  <div class="m_index_like">
    <cell class="m_index_like_title" title="猜你喜欢">
      <span slot="left"><img src="@/assets/images/mobile_teacher/back.png" alt="" @click="handle_slot"></span>
      <span slot="right"></span>
    </cell>
    <div class="m_index_like_list">
      <div class="m_index_like_list_item" v-for="(v,i) in index_list" :key="i"
        @click="$router.push({path:`/m_index_videoCourse/${v.id}`})">
        <div class="m_index_like_list_img"> <img :src="v.img" alt=""></div>
        <div class="m_index_like_list_center">
          <div class="m_index_like_list_center_t"> {{v.course_name}}</div>
          <div class="m_index_like_list_center_c" v-html="v.description"></div>
          <div class="m_index_like_list_center_b">
            <div class="m_index_like_list_center_b1">
              <img src="@/assets/images/public/play_icon.png" alt="">
              {{v.caNum}}
            </div>
            <div class="m_index_like_list_center_b2">
              <img src="@/assets/images/public/time_icon.png" alt="">
              <span>{{moment(v.created_at * 1000).format('HH:mm')}}</span>

            </div>
          </div>
        </div>
        <!-- <div class="m_index_like_x" @click="hangle_delete(i)">
          X
        </div> -->
      </div>

    </div>

  </div>
  </div>

</template>

<script>
import { Indicator } from 'mint-ui'
import cell from '@/view/mobile_page/components/public_cell'
import { get_Course } from '@/api/common'
export default {
  components: {
    cell
  },

  data () {
    return {
      index_list: [],
      newCourse: [],
      freeCourse: []

    }
  },

  methods: {
    handle_slot () {
      this.$emit('handleslot')
    },
    // hangle_delete (i) {

    // }

  },
  mounted () {
    Indicator.open({
      text: '加载中...',
      spinnerType: 'fading-circle'
    })
    get_Course().then(res => {
      console.log(res)
      this.index_list = res.data.data

      Indicator.close()
    })
  }

}
</script>

<style lang='less' scoped>
/deep/.mint-spinner-snake {
  margin: 0 auto;
}
.m_index_like {
  width: 100vw;
  height: 100vh;
  z-index: 9;
  background-color: #fff;
  position: fixed;
  left: 0;
  top: 0;
  overflow-y: auto;

  .m_index_like_title {
    border-bottom: 1px solid #cccccc;
  }
  .m_index_like_list {
    .m_index_like_list_item {
      display: flex;
      padding: 0.3rem;
      border-bottom: 1px solid #ccc;

      justify-content: space-between;
      .m_index_like_list_img {
        width: 1.4rem;
        height: 1.4rem;
        img {
          width: 1.4rem;
          height: 1.4rem;
        }
      }
      .m_index_like_list_center {
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: space-between;
        margin-left: 0.2rem;
        .m_index_like_list_center_t {
          font-size: 0.32rem;
          font-family: PingFang SC;
          font-weight: bold;
          color: #000000;
        }
        .m_index_like_list_center_c {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
        }
        .m_index_like_list_center_b {
          display: flex;
          font-size: 0.24rem;
          font-family: PingFang SC;
          font-weight: 500;
          color: #787878;
          .m_index_like_list_center_b1 {
            display: flex;
            align-items: center;
            img {
              width: 0.22rem;
              height: 0.22rem;
              margin-right: 0.1rem;
            }
          }
          .m_index_like_list_center_b2 {
            margin-left: 0.3rem;
            display: flex;
            align-items: center;
            img {
              width: 0.22rem;
              height: 0.22rem;
              margin-right: 0.1rem;
            }
          }
        }
      }
      .m_index_like_x {
        width: 0.4rem;
        height: 0.4rem;
        border: 1px solid #d6d6d6;
        border-radius: 1px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.1rem;
        color: #eaeaea;
      }
    }
  }
}
</style>
