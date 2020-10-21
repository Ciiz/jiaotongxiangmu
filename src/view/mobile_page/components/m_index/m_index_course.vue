<template>
  <div class="m-course">
    <div class="m_Boutique">

      <div class="m_Boutique_list">
        <div class="m_Boutique_list_item" v-for="(v,i) in teacher_course" :key="i">
          <div class="m_Boutique_list_item_img">
            <img :src="v.img" alt="">
          </div>
          <div class="m_Boutique_list_item_center">
            <div class="m_Boutique_list_item_center1">{{v.course_name}}</div>
            <div class="m_Boutique_list_item_center2" v-html="v.description"></div>
            <div class="m_Boutique_list_item_center3">
              <div class="m_Boutique_list_item_center3_num" v-if="v.play_count !==null">
                {{v.play_count}}</div>
              <div class="m_Boutique_list_item_center3_num" v-else>0</div>
              <div class="m_Boutique_list_item_center3_time"> {{moment(v.created_at * 1000).format('HH:mm')}}</div>

            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Indicator } from 'mint-ui'
import { get_courseMassge } from '@/api/common'
export default {
  data () {
    return {
      teacher_course: []
    }
  },

  methods: {},
  mounted () {
    Indicator.open({
      text: '加载中...',
      spinnerType: 'fading-circle'
    })
    this.axios.request({
      method: 'post',
      url: '/home/course/isShowSchoolCourses',
      params: {
        school_id: this.$route.params.id
      }
    }).then(result => {
      console.log(result)
      this.teacher_course = result.data.list
      Indicator.close()
    })
  }

}
</script>

<style lang='less' scoped>
.m_Boutique {
  width: 6.86rem;
  margin: 0.4rem auto;

  .m_Boutique_list {
    display: flex;
    flex-direction: column;
    .m_Boutique_list_item {
      display: flex;
      margin-top: 0.3rem;
      background-color: #fff;
      border-radius: 8px;
      padding: 0.2rem;
      padding-bottom: 0.4rem;
      height: 2.36rem;
      border-bottom: 1px solid #ccccccff;
      .m_Boutique_list_item_img {
        width: 1.96rem;
        height: 1.96rem;
        border-radius: 8px;
        box-shadow: 0px 0px 0.03rem 0px rgba(0, 0, 0, 0.5);
        img {
          width: 1.96rem;
          height: 1.96rem;

          border-radius: 8px;
        }
      }
      .m_Boutique_list_item_center {
        display: flex;
        flex-direction: column;
        margin-left: 0.2rem;
        justify-content: space-between;
        .m_Boutique_list_item_center1 {
          font-size: 0.32rem;
          font-family: PingFang SC;
          font-weight: bold;
          color: #000000;
        }
        .m_Boutique_list_item_center2 {
          font-size: 0.24rem;
          font-family: PingFang SC;
          font-weight: 500;
          color: #b5b5b5;
          width: 4.3rem;
          height: 8.4rem;
          background: #f9f9f9;
          border-radius: 4px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          padding: 0.2rem;
          margin: 0.1rem 0;
        }
        .m_Boutique_list_item_center3 {
          display: flex;
          font-size: 0.24rem;
          font-family: PingFang SC;
          font-weight: 500;
          color: #4a4a4a;
          .m_Boutique_list_item_center3_time {
            margin-left: 1.5rem;
          }
        }
      }
    }
  }
}
</style>
