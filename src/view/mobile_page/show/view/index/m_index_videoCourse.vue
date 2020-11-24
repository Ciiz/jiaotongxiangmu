<template>
  <div class="videoCourse">
    <div class="videoCourse_video">
      <div class="videoCourse_video_arrow">
        <div class="videoCourse_video_arrowLeft">
          <img src="@/assets/images/mobile_teacher/lastpage.png" alt="" @click="$router.back(-1)">
        </div>
        <div class="videoCourse_video_arrowRight">
          <!-- <img src="@/assets/images/mobile_teacher/fx2.png" alt=""> -->
        </div>
      </div>
      <div class="videoCourse_video_ispay" v-if="video_index.pay_status===0">
        <div class="videoCourse_video_ispay1">您好，该课程为精品课程，需付费后才能观看。 </div>
        <div class="videoCourse_video_ispay2" @click="handlePopup">立即购买 >></div>
      </div>
      <div v-else>
        <div class="videoCourse_video_img" v-if="chapter_firstUrl===''"
          style="height:4.2rem;width:100%;background:black;color:#ffffff;font-size:0.3rem;padding:1rem">
          <span>暂无素材资源...</span>
        </div>
        <div class="videoCourse_video_video" v-else>
          <video :src="chapter_firstUrl" controls autoplay
            v-if="['mp4','ogg', 'avi', 'rmvb'].indexOf(content_type)!==-1">
          </video>
          <div v-else-if="['mp3','pdf','swf'].indexOf(content_type)!==-1"
            style="height:100%;width:100%;background:#000;">
            <embed :src="chapter_class.file_url" style="width:100%;height:100%"></embed>
          </div>
          <div v-else-if="['ppt','pptx','xlsx','xls','doc','docx'].indexOf(content_type)!==-1"
            style="height:100%;width:100%;background:#000;">
            <iframe :src='`https://view.officeapps.live.com/op/view.aspx?src=${chapter_firstUrl}`' width='100%'
              height='100%' frameborder='1'></iframe>
          </div>
          <div
            v-else-if="['mp4','ogg', 'avi', 'rmvb','mp3','pdf','swf','ppt','pptx','xlsx','xls','doc','docx'].indexOf(content_type) ===-1 && status"
            class="embed-tips" style="width:100%;height:100%">
            格式不支持！
            <!-- <a :href="file_url" target="blank">文件：{{chapter_firstUrl | filtFileName}}</a> -->
          </div>
        </div>
      </div>
    </div>
    <div class="videoCourse_name">
      <div class="tuxing">
        <div class="tuxing_img"><img src="@/assets/images/mobile_teacher/tuxing.png" alt="">
          <div class="tuxing_right" v-if="video_index.is_charge===1">精品</div>
          <div class="tuxing_right" v-else>免费</div>
        </div>
      </div>
      <div class="videoCourse_name_title">{{video_index.course_name}}</div>
      <div class="videoCourse_name_num">共{{video_index.chapter_list.length}}节</div>
    </div>
    <div class="videoCourse_message">
      <div class="videoCourse_messageTap">
        <mt-navbar v-model="selected">
          <mt-tab-item id="1" class="schoolTeam_tap_size">课程章节</mt-tab-item>
          <mt-tab-item id="2" class="schoolTeam_tap_size">课程信息</mt-tab-item>
          <span class="release_price2" v-if="video_index.pay_status===1">已购买</span>
          <span class="release_price" v-else>￥{{video_index.release_price}}</span>
        </mt-navbar>
        <mt-tab-container v-model="selected">
          <!-- v-for="(item,index) in video_index.chapter_list" :key="index" -->
          <mt-tab-container-item id="1" class="hideScroll">
            <chapter :list='video_index.chapter_list' @handlevideo="handlevideo">
            </chapter>
          </mt-tab-container-item>
          <mt-tab-container-item id="2" class="hideScroll">
            <detail :message='video_index'></detail>
          </mt-tab-container-item>
        </mt-tab-container>
      </div>
    </div>
    <mt-popup v-model="popupVisible" position="bottom">
      <div class="Popup">
        <div class="Popup_list">
          <div class="Popup_list_top">本课程为精品课程，需付费后才能进行观看。</div>
          <div class="Popup_list_center">
            <div>
              <div class="Popup_list_center1">购买课程
                <span style="color:#3B9BFFFF">《{{video_index.course_name}}》</span> </div>
              <div class="Popup_list_center2">
                <span> 共{{video_index.chapter_list.length}}节课 </span>
                <span>￥{{video_index.release_price}}</span>
              </div>
            </div>
          </div>
          <div class="Popup_list_footer">温馨提示：请核对您将购买的课程，购买成功后将不可退款。</div>
        </div>
        <div class="Popup_btn">立即购买</div>
      </div>
    </mt-popup>
  </div>
</template>
<script>
import { getSuffix } from '@/libs/util'
import { video_index } from "@/api/common"
import chapter from "@/view/mobile_page/components/m_index/course_chapter"
import detail from "@/view/mobile_page/components/m_index/course_details"
export default {
  components: { chapter, detail },
  data () {
    return {
      video_index: {
        chapter_list: []
      },
      chapter_firstUrl: null,
      popupVisible: false,
      selected: '1',
      status: false
    }
  },
  computed: {
    content_type () {
      return getSuffix(this.chapter_firstUrl)
    },
    typeName () {
      return this.$route.query.typeName
    },
  },
  methods: {
    handlevideo (url) {
      this.chapter_firstUrl = url
    },
    handlePopup (index) {
      this.popupVisible = true
    }
  },
  created () {
    console.log(this.$route.params.id);

    video_index(this.$route.params.id).then(res => {
      console.log(res);
      this.video_index = res.data.data
      this.status = true
      if (res.data.data.chapter_list[0] && res.data.data.chapter_list[0].child) {
        this.chapter_firstUrl = res.data.data.chapter_list[0].child[0].file_url
      }
      else if (res.data.data.chapter_list.length === 0) {
        this.chapter_firstUrl = ''
      } else {
        if (res.data.data.chapter_list[0]) {
          this.chapter_firstUrl = res.data.data.chapter_list[0].file_url
        }
      }
    })
  },

}
</script>

<style lang='less' scoped>
.videoCourse {
  /deep/.mint-popup-bottom {
    border-radius: 16px 16px 0px 0px;
  }
  /deep/.mint-tab-item.is-selected {
    border-bottom: 3px solid #26a2ff;
  }
  /deep/.mint-navbar {
    padding: 0.1rem;
    border-bottom: 1px solid #e5e5e5ff;
  }
  .videoCourse_video {
    position: relative;
    overflow: hidden;

    .videoCourse_video_arrow {
      position: absolute;
      top: 0.3rem;
      display: flex;
      justify-content: space-between;
      padding: 0.2rem 0.3rem;
      width: 100%;
      z-index: 99;
      .videoCourse_video_arrowLeft {
        img {
          width: 0.2rem;
          height: 0.4rem;
        }
      }
      .videoCourse_video_arrowRight {
        img {
          width: 0.4rem;
          height: 0.4rem;
        }
      }
    }
    .videoCourse_video_ispay {
      height: 4.21rem;
      width: 100%;
      background-color: #000;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      .videoCourse_video_ispay1 {
        font-size: 0.26rem;
        font-family: PingFang SC;
        font-weight: 500;
        color: #ffffff;
      }
      .videoCourse_video_ispay2 {
        font-size: 0.26rem;
        font-family: PingFang SC;
        font-weight: 500;
        color: #f63838;
        width: 2.2rem;
        height: 0.8rem;
        border: 1px solid #f63838ff;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 0.3rem;
      }
    }
    .videoCourse_video_img {
      height: 4.21rem;
      width: 100%;
      img {
        height: 4.21rem;
        width: 100%;
      }
    }
    .videoCourse_video_video {
      .embed-tips {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #000;
        color: #fff;
      }
      height: 4.21rem;
      width: 100%;
      video {
        height: 4.21rem;
        width: 100%;
      }
    }
  }
  .videoCourse_name {
    display: flex;
    // align-items: center;
    justify-content: space-between;
    height: 1rem;
    padding: 0.2rem 0.3rem;
    border-bottom: 1px solid #e5e5e5ff;
    .tuxing {
      display: flex;
      align-items: center;
      // margin-bottom: 0.05rem;
      margin-right: 0.1rem;
      .tuxing_right {
        font-size: 0.2rem;
        font-family: PingFang SC;
        font-weight: 500;
        color: #fff;
        position: absolute;
        top: -2px;
        left: 2px;
      }
      .tuxing_img {
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        img {
          width: 0.68rem;
          height: 0.34rem;
        }
      }
    }
    .videoCourse_name_title {
      font-size: 0.34rem;
      font-family: PingFang SC;
      font-weight: bold;
      color: #222222;
      display: flex;
      flex: 1;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
    }
    .videoCourse_name_num {
      font-size: 0.28rem;
      font-family: PingFang SC;
      font-weight: 500;
      color: #222222;
      line-height: 30px;
    }
  }
  .videoCourse_message {
    .videoCourse_messageTap {
      .release_price {
        width: 2.2rem;
        height: 0.8rem;
        background: #f63838ff;
        border-radius: 8px;
        font-size: 0.32rem;
        font-family: PingFang SC;
        font-weight: bold;
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0.1rem 0.3rem;
      }
      .release_price2 {
        width: 2.2rem;
        height: 0.8rem;
        background: #16c2aaff;
        border-radius: 8px;
        font-size: 0.32rem;
        font-family: PingFang SC;
        font-weight: bold;
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0.1rem 0.3rem;
      }
      .schoolTeam_tap_size {
        font-size: 0.32rem;
        font-family: PingFang SC;
        font-weight: 500;
      }
    }
  }
  .Popup {
    padding: 0.3rem 0.3rem 0 0.3rem;
    width: 100vw;
    height: 6.44rem;
    background-color: #fff;
    border-top-left-radius: 0.3rem;
    border-top-right-radius: 0.3rem;
    display: flex;
    flex-direction: column;
    .Popup_list {
      display: flex;
      flex: 1;
      border-bottom: 1px solid #eeeeeeff;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
      // justify-content: space-between;
      .Popup_list_top {
        font-size: 0.28rem;
        font-family: PingFang SC;
        font-weight: 500;
        color: #999999;
      }
      .Popup_list_center {
        width: 6.86rem;
        height: 2.6rem;
        // margin: 0.2rem 0;
        border: 1px solid #dededeff;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 0.16rem;
        .Popup_list_center1 {
          font-size: 0.34rem;
          font-family: PingFang SC;
          font-weight: bold;
          color: #333333;
        }
        .Popup_list_center2 {
          text-align: center;
          span:nth-child(1) {
            font-size: 0.28rem;
            font-family: PingFang SC;
            font-weight: 500;
            color: #999999;
            margin-right: 0.2rem;
          }
          span:nth-child(2) {
            font-size: 0.48rem;
            font-family: PingFang SC;
            font-weight: bold;
            color: #f84646;
          }
        }
      }
      .Popup_list_footer {
        font-size: 0.24rem;
        font-family: PingFang SC;
        font-weight: 500;
        color: #999999;
      }
    }
    .Popup_btn {
      width: 6.86rem;
      height: 0.8rem;
      background: #3b9bff;
      border-radius: 40px;
      font-size: 0.36rem;
      font-family: PingFang SC;
      font-weight: 400;
      color: #fff;
      line-height: 0.8rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0.3rem 0;
    }
  }
}
</style>
