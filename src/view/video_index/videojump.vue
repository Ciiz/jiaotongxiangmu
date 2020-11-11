<template>
  <div class="video">
    <Row class="video_user">
      <Col>
      <div class="video_user_l">

        <div class='videoCourse_video_isCharge' v-if="video_list.is_charge===1">
          <div class="isCharge_text">
            <div class="isCharge_text_big">
              <span>提示</span>
              <span>此课程为付费课程，需要购买后观看</span>
            </div>

          </div>
        </div>
        <div class="video_user_l_header" v-else>
          <!-- 播放完后 -->
          <div class='videoCourse_video_end' v-if="onend_stutas">
            <div class="video_end_top">
              <div class="video_end_topLeft">
                <div class="video_end_topLeft_icon"><img :src="video_list.icon" alt=""></div>
                <span>
                  <div class="video_end_topLeft_name">{{video_list.user_name}}</div>
                  <div class="video_end_topLeft_btn" @click="hangleattention">
                    {{video_list.isfollow===1 ? "已关注" : "关注" }}</div>
                </span>
              </div>
              <div class="video_end_topRight">
                <div class="video_end_topRight_play" @click="handlePlay">

                  <div class="video_end_topRight_play1">
                    <span></span>
                    <!-- <img src="@/assets/images/public/congbo.png" alt=""> -->
                    <img src="@/assets/images/public/congbo.png" alt="">
                  </div>
                  <span>重播</span>
                </div>
                <div class="video_end_topRight_zan">
                  <div class="video_end_topRight_zan1">
                    <img src="@/assets/images/public/zan.png" alt="">
                    <img src="@/assets/images/public/quxiaozan.png" alt="">
                  </div>
                  <span>点赞</span>
                </div>
                <div class="video_end_topRight_cai">
                  <div class="video_end_topRight_cai1">
                    <img src="@/assets/images/public/cai.png" alt="">
                    <img src="@/assets/images/public/cai.png" alt="">
                  </div>
                  <span>踩</span>
                </div>
              </div>
              <div style="width:16%"></div>
            </div>
            <div class="video_end_cneter">
              相关推荐
            </div>
            <div class="video_end_footer">
              <ul>
                <li v-for="(v,i) in recommend" :key="i" @click="handlelikeplay(v)">
                  <div class="video_end_footerIcon"><img :src="v.img" alt=""></div>
                  <span class="video_end_footerName">{{v.course_name}}</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="videoCourse_video_img" v-if="videoUrl==''">
            <span>暂无素材资源...</span>
          </div>
          <div v-else id="video_massege">
            <video :src="videoUrl" controls autoplay class="video_item"
              v-if="['mp4','ogg', 'avi', 'rmvb'].indexOf(content_type)!==-1" @ended="handleend"></video>
            <div v-else-if="['mp3','pdf','swf'].indexOf(content_type)!==-1"
              style="height:100%;width:100%;background:#000;" class="video_item">
              <embed :src="chapter_class.file_url"></embed>
            </div>
            <div v-else-if="['ppt','pptx','xlsx','xls','doc','docx'].indexOf(content_type)!==-1" class="video_item">
              <iframe :src='`https://view.officeapps.live.com/op/view.aspx?src=${videoUrl}`' width='100%' height='100%'
                frameborder='1'></iframe>
            </div>
            <div v-else class="embed-tips">
              <span> 格式不支持！</span>
              <!-- <a :href="file_url" target="blank">文件：{{chapter_firstUrl | filtFileName}}</a> -->
            </div>
          </div>
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
          <TabPane label="课程信息">
            <message :message='video_list' @paystatus="handlepay"></message>
          </TabPane>
        </Tabs>
      </div>
      </Col>
    </Row>
    <Row class="video_like">
      <Col>
      <div class="video_likeTitle">猜你喜欢</div>
      <div class="video_likeList">
        <ul>
          <li v-for="item in like_list" :key="item.id" @click="handlelikeplay(item)">
            <div class="video_likeList_itemImg">
              <img :src="item.img" alt="">
            </div>
            <div class="video_likeList_itemCenter">
              <div class="video_likeList_itemCenter_name">{{item.course_name}}</div>
              <div class="video_likeList_itemCenter_user">作者：{{item.user_name}}</div>
              <div class="video_likeList_itemCenter_user">院校：{{item.school_name}}</div>
            </div>
          </li>
        </ul>
      </div>
      </Col>
    </Row>
    <div class="login_modal" @mousedown="closeModal" v-if="loginststus">
      <LoginForm @on-success-valid="handleSubmit"></LoginForm>
    </div>
  </div>
</template>
<script>
import LoginForm from '@/components/login-form/login-form'
import { getSuffix } from '@/libs/util'
import { Toast } from 'mint-ui'
import { video_index, get_Course, get_follow, get_unfollow } from '@/api/common'
import chapter from "@/view/video_index/components/pc_chapter"
import message from "@/view/video_index/components/course_massgess"
import { mapActions } from 'vuex'
import log from 'video.js/es5/utils/log'
export default {
  name: 'videojump',
  components: {
    chapter, message, LoginForm
  },
  data () {
    return {
      video_list: {
        chapter_list: []
      },
      videoUrl: null,
      like_list: [],
      onend_stutas: false,
      recommend: [],
      loginststus: false,


    }
  },
  computed: {
    route () {
      return this.$route.params.id
    },
    content_type () {
      return getSuffix(this.videoUrl)
    },
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    handlepay (status) {
      this.loginststus = status
    },
    handleSubmit ({ userName, password, user_type, school }) {
      this.handleLogin({ userName, password, user_type, school }).then(res => {
        this.getUserInfo().then(res => {
          this.$store.commit('setLoginstatus', 1)
          this.loginststus = false
        })
      })
    },
    closeModal (e) {
      if (e.target.className === 'login_modal') {
        this.loginststus = false
      }
    },
    // 封装
    packaging (res) {
      this.video_list = res.data.data
      if (res.data.data.chapter_list[0] && res.data.data.chapter_list[0].child) {
        this.videoUrl = res.data.data.chapter_list[0].child[0].file_url
      }
      else if (res.data.data.chapter_list.length === 0) {
        this.videoUrl = ''
      }
      else if (res.data.data.chapter_list) {
        // if (res.data.data.chapter_list[0].child) {

        // }
        if (res.data.data.chapter_list[0].file_url) {
          this.videoUrl = res.data.data.chapter_list[0].file_url
        } else {
          this.videoUrl = ''
        }
      }

    },
    // 猜你喜欢的点击
    handlelikeplay (item) {
      console.log(item);
      this.onend_stutas = false
      video_index(item.id).then(res => {
        console.log(res);
        this.packaging(res)
        if (this.videoUrl !== '') {
          document.querySelector('#video_massege').style.display = "block"
          if (this.videoUrl === this.videoUrl) {
            document.querySelector('.video_item').play()
          }
        }
      })
    },
    // 关注和取消关注
    hangleattention () {
      if (this.video_list.isfollow === 1) {
        get_unfollow(this.video_list.teacher_id).then(res => {
          console.log(res);
          Toast({
            message: res.message,
            duration: 2000
          })
        })
        this.video_list.isfollow = 0
      }
      else {
        get_follow(this.video_list.teacher_id).then(res => {
          console.log(res);
          Toast({
            message: res.message,
            duration: 2000
          })
        })
        this.video_list.isfollow = 1
      }

    },
    // 重播
    handlePlay () {
      this.onend_stutas = false
      this.$nextTick(() => {
        document.querySelector('#video_massege').style.display = "block"
        document.querySelector('.video_item').play()
      })

    },
    handleend () {
      this.onend_stutas = true
      this.$nextTick(() => { document.querySelector('#video_massege').style.display = "none" })


    },
    handlevideo (data) {
      console.log(data);
      this.videoUrl = data.file_url
      this.onend_stutas = data.stutas
      this.$nextTick(() => {
        document.querySelector('#video_massege').style.display = "block"
      })
    },
    // 获取跳转的视频
    get_video () {
      video_index(this.route).then(res => {
        // this.$store.commit('setLoginstatus', res.data.data.admin_status)
        this.packaging(res)
      })
    },
    get_like () {
      get_Course().then(res => {
        this.recommend = res.data.data.slice(0, 3)
        if (res.data.data.length >= 5) {
          this.like_list = res.data.data.slice(0, 5)
        } else {
          this.like_list = res.data.data
        }
      })


    }
  },

  activated () {
    this.get_video()
  },
  mounted () {
    this.get_like()
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
  .login_modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.5);
  }
  background-color: #f2f2f2;
  padding: 40px 0;

  .video_user {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    // justify-content: space-between;
    .video_user_l {
      width: 856px;

      .videoCourse_video_isCharge {
        width: 856px;
        height: 481px;
        background-color: #014578;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        // opacity: 0.21;

        .isCharge_text {
          position: relative;
          .isCharge_text_big {
            display: flex;
            flex-direction: column;
            align-items: center;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
            span:nth-child(2) {
              margin-top: 20px;
            }
          }

          font-size: 14px;
          font-family: SimSun;
          font-weight: 400;
          color: #000000;
          width: 314px;
          height: 161px;
          opacity: 0.66;
          background: #ffffff;
        }
      }

      .video_user_l_header {
        .video_item {
          width: 856px;
          height: 481px;
        }
        width: 856px;
        height: 481px;
        background: #014578;
        .embed-tips {
          width: 856px;
          height: 481px;
          background-color: #014578;
          color: #fff;
          font-size: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .videoCourse_video_end {
          padding: 30px 50px;
          width: 856px;
          height: 481px;
          background-color: #014578;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: center;
          .video_end_top {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .video_end_topLeft {
              display: flex;
              align-items: center;
              width: 30%;
              .video_end_topLeft_icon {
                margin-right: 10px;
                img {
                  width: 60px;
                  height: 60px;
                  border-radius: 50%;
                }
              }
              .video_end_topLeft_name {
                font-size: 14px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: #ffffff;
              }
              .video_end_topLeft_btn {
                width: 70px;
                height: 27px;
                background-color: #2ba4e7ff;
                border-radius: 4px;
                font-size: 14px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: #ffffff;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-top: 10px;
              }
            }
            .video_end_topRight {
              display: flex;
              align-items: center;
              width: 30%;
              .video_end_topRight_play {
                .video_end_topRight_play1 {
                  display: flex;
                  flex-direction: column;
                  span {
                    width: 21px;
                    height: 24px;
                  }
                }
                display: flex;
                flex-direction: column;
                span {
                  font-size: 14px;
                  font-family: Microsoft YaHei;
                  font-weight: 400;
                  color: #ffffff;
                }
                img {
                  width: 21px;
                  height: 24px;
                  margin: 10px 0;
                }
              }
              .video_end_topRight_zan {
                display: flex;
                flex-direction: column;
                margin: 0 40px;
                .video_end_topRight_zan1 {
                  display: flex;
                  flex-direction: column;
                  margin-bottom: 10px;
                  img:nth-child(2) {
                    margin-top: 10px;
                  }
                }
                span {
                  font-size: 14px;
                  font-family: Microsoft YaHei;
                  font-weight: 400;
                  color: #ffffff;
                }
              }
              .video_end_topRight_cai {
                display: flex;
                flex-direction: column;
                .video_end_topRight_cai1 {
                  display: flex;
                  flex-direction: column;
                  margin-bottom: 10px;
                  img:nth-child(2) {
                    margin-top: 10px;
                  }
                }
                span {
                  font-size: 14px;
                  font-family: Microsoft YaHei;
                  font-weight: 400;
                  color: #ffffff;
                }
              }
            }
          }
          .video_end_cneter {
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: 400;
            color: #ffffff;
          }
          .video_end_footer {
            width: 100%;
            ul {
              display: flex;
              justify-content: space-around;

              li {
                position: relative;
                .video_end_footerIcon {
                  img {
                    width: 194px;
                    height: 100px;
                  }
                }
                .video_end_footerName {
                  color: #ffffff;
                  position: absolute;
                  left: 10px;
                  bottom: 10px;
                }
              }
            }
          }
        }
        .videoCourse_video_img {
          width: 856px;
          height: 481px;
          background-color: #014578;
          color: #fff;
          font-size: 20px;
          text-align: center;
          line-height: 481px;
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
  .video_like {
    width: 1200px;
    margin: 0 auto;
    .video_likeTitle {
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #333333;
      padding: 20px;
    }
    .video_likeList {
      ul {
        display: flex;
        li:nth-child(5) {
          margin-right: 0;
          // background-color: red;
        }
        li {
          width: 200px;
          height: 230px;
          margin-right: 51px;

          .video_likeList_itemImg {
            width: 200px;
            height: 150px;
            border-radius: 4px 4px 0px 0px;
            img {
              width: 200px;
              height: 150px;
              border-radius: 4px 4px 0px 0px;
            }
          }
          .video_likeList_itemCenter {
            background-color: #fff;
            padding: 10px;
            .video_likeList_itemCenter_name {
              font-size: 14px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: #030303;
            }
            .video_likeList_itemCenter_user {
              font-size: 12px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: #adadad;
            }
          }
        }
      }
    }
  }
}
</style>
