<template>
  <div class="video">
    <Row class="video_user">
      <Col>
      <div class="video_user_l">
        <div class="video_user_l_header">
          <!-- <img :src="video_list.img" alt=""> -->
          <video :src="videoUrl" controls autoplay style="width:100%;height:100%;"></video>
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
              <div class="video_user_iconAndusers">
                <div class="video_user_icon">
                  <img :src="video_list.icon" alt="">
                </div>
                <div class="video_user_users">作者：{{video_list.user_name}}</div>
              </div>
              <div class="video_user_mijor"> 专业：{{video_list.major_name}}</div>
              <div class="video_user_school">所属院校：{{video_list.school_name}}</div>
            </div>
            <div class="video_user_l_footer2_right">
              <div class="video_user_footerIcon1"><img src="@/assets/images/public/num1.png" alt="">
                {{video_list.play_count}}
              </div>
              <div class="video_user_footerIcon2"><img src="@/assets/images/public/num2.png"
                  alt="">{{video_list.attention}}</div>
              <div class="video_user_footerIcon3"><img src="@/assets/images/public/num3.png" alt=""> </div>

            </div>
          </div>
        </div>
      </div>
      </Col>
      <Col>
      <div class="video_user_r">
        <Tabs :animated="false">
          <TabPane label="课程章节">
            <chapter :list="video_list.chapter_list" @handlevideo='handlevideo'></chapter>
          </TabPane>
          <TabPane label="课程信息">课程信息</TabPane>
        </Tabs>
      </div>
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
import chapter from "@/view/video_index/components/pc_chapter"
export default {
  components: {
    chapter
  },
  data () {
    return {
      video_list: {
        chapter_list: []
      },
      videoUrl: null

    }
  },
  computed: {
    route () {
      return this.$route.params.id
    }
  },
  methods: {
    handlevideo (data) {
      console.log(data);
      this.videoUrl = data
    },
    // 获取跳转的视频
    get_video () {
      video_index(this.route).then(res => {
        console.log(res)
        this.video_list = res.data.data
        console.log(this.video_list.chapter_list);
      })
    }
  },
  mounted () {
    console.log(this.route);

    this.get_video()
  }
}
</script>

<style lang='less' scoped>
/deep/.ivu-tabs-ink-bar {
  background-color: #2ba4e7ff;
}
/deep/.ivu-tabs-tab-active {
  background-color: #2ba4e7ff;
  color: #fff;

  border-radius: 8px 8px 0px 0px;
}
/deep/.ivu-tabs-bar {
  margin-bottom: 0;
}
.video {
  background-color: #f2f2f2;
  height: 100vh;
  width: 100vw;
  padding: 40px 0;
  .video_user {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    // justify-content: space-between;
    .video_user_l {
      width: 856px;
      .video_user_l_header {
        width: 856px;
        height: 481px;
        background: #014578;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .video_user_l_footer {
        width: 855px;
        height: 107px;
        background: #ffffff;
        padding: 15px 25px;
        margin-top: 20px;
        .video_user_l_footer1 {
          display: flex;
          justify-content: space-between;
          margin-bottom: 13px;
          .video_user_l_footer1_name {
            font-size: 16px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #000000;
          }
          .video_user_l_footer1_time {
            font-size: 12px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #bbbbbb;
          }
        }
        .video_user_l_footer2 {
          display: flex;
          align-items: center;
          justify-content: space-between;
          // margin: 20px 0;
          padding: 10px 0;
          border-top: 1px solid #eeeeeeff;
          .video_user_l_footer2_left {
            flex: 1;
            display: flex;
            align-items: center;
            // justify-content: space-between;

            font-size: 12px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #333333;
            .video_user_iconAndusers {
              display: flex;
              align-items: center;
            }
            .video_user_mijor {
              margin: 0 30px;
            }
            .video_user_icon {
              img {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                margin-right: 20px;
              }
            }
          }
          .video_user_l_footer2_right {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 20%;
            font-size: 12px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #bbbbbb;
            img {
              margin-right: 4px;
            }
          }
        }
      }
    }
    .video_user_r {
      width: 320px;
      margin-left: 30px;
      // height: 578px;
    }
  }
}
</style>
