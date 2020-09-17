<template>
  <div class="video">
    <Row class="video_user">
      <Col>
      <div class="video_user_l">
        <div class="video_user_l_header">
          <img :src="video_list.img" alt="">
        </div>
        <div class="video_user_l_footer">
          <div class="video_user_l_footer1">
            <div class="video_user_l_footer1_name">{{video_list.course_name}}</div>
            <div class="video_user_l_footer1_time">
              上传时间：{{moment(video_list.created_at * 1000).format('YYYY-MM-DD HH:mm')}}
            </div>
          </div>
          <div class="video_user_l_footer2">
            <div class="video_user_l_footer2_left">
              <div class="video_user_icon">
                <img src="" alt="">
              </div>
              <div class="video_user_mijor"></div>
              <div class="video_user_school"></div>
            </div>
            <div class="video_user_l_footer2_right">

            </div>

          </div>
        </div>
      </div>
      <div class="video_user_r"></div>
      </Col>
    </Row>
    <Row>
      <Col>
      </Col>
    </Row>
  </div>
</template>

<script>
import { video_index } from '@/api/common'
export default {
  name: '',

  data () {
    return {
      video_list: {}
    }
  },
  computed: {
    route () {
      return this.$route.params.id
    }
  },
  methods: {
    // 获取跳转的视频
    get_video () {
      video_index(this.route).then(res => {
        console.log(res)
        this.video_list = res.data.data
      })
    }

  },
  mounted () {
    this.get_video()
  }
}
</script>

<style lang='less' scoped>
.video {
  background-color: #f2f2f2;
  height: 100vh;
  width: 100vw;
  padding: 40px 0;
  .video_user {
    width: 1200px;
    margin: 0 auto;
    .video_user_l {
      width: 800px;
      .video_user_l_header {
        width: 800px;
        height: 500px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .video_user_l_footer {
        background-color: #fff;
        margin-top: 20px;
        height: 80px;
        padding: 15px;

        .video_user_l_footer1 {
          display: flex;
          justify-content: space-between;
          .video_user_l_footer1_name {
          }
          .video_user_l_footer1_time {
          }
        }
      }
    }
  }
}
</style>
