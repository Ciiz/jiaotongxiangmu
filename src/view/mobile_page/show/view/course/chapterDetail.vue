<template>
  <div class="m-chapterDetail flex-contain">
    <Icon type="ios-arrow-back" @click="back"/>
    <div v-if="chapter_class.file_url&&typeName===''" style="height:4.2rem;width:100%">
      <video :src="chapter_class.file_url" v-if="['mp4','ogg', 'avi', 'rmvb'].indexOf(content_type)!==-1" id="video" controls autoplay style="width:100%;height:100%"></video>
      <div v-else-if="['mp3','pdf','swf'].indexOf(content_type)!==-1" style="height:100%;width:100%;background:#000;">
        <embed :src="chapter_class.file_url"  style="width:100%;height:100%"></embed>
      </div>
      <div v-else-if="['ppt','pptx','xlsx','xls','doc','docx'].indexOf(content_type)!==-1" style="height:100%;width:100%;background:#000;">
        <iframe :src='`https://view.officeapps.live.com/op/view.aspx?src=${chapter_class.file_url}`' width='100%' height='100%' frameborder='1'></iframe>
      </div>
      <div v-else class="embed-tips" style="width:100%;height:100%">
        格式不支持
        <a :href="file_url" target="blank">文件：{{chapter_class.file_url | filtFileName}}</a>
      </div>
    </div>
    <div v-if="!chapter_class.file_url&&typeName===''"  style="height:4.2rem;width:100%;background:black;color:#ffffff;font-size:0.3rem;padding:0.8rem">
      <span>暂无素材资源</span>
    </div>
    <div v-if="typeName!==''" style="height:4.2rem;width:100%">
      <Krpano :pano_id="id" v-if="typeName === 'krpano'" :editable.sync="showAllCourseDetailEdit"></Krpano>
      <KrpanoVideo :pano_id="id" v-if="typeName === 'krpano_video'" :editable.sync="showAllCourseDetailEdit"></KrpanoVideo>
    </div>
    <div class="m-chapterDetail-contain flex-contain">
      <div>
        <span style="font-size:0.3rem;color:#222222;font-weight:bold">评论</span>
        <span style="font-size:0.26rem;color:#222222;margin-left:0.25rem">{{total}}</span>
      </div>
      <div class="m-chapterDetail-contain-c hideScroll">
        <div v-for="(item,index) in discussInfo" :key="index" class="m-chapter-discuss-item">
          <div>
            <img :src="item.icon" width="40px" class="dis_ico"/>
          </div>
          <div>
            <div>
              <div style="font-size:0.26rem">{{item.name}}</div>
              <div style="font-size:0.24rem">{{changeTime(item.created_at)}}</div>
            </div>
            <div v-html="item.content"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="m-chapterDetail-bottom">
      <input type="text" placeholder="留个言 分享下你的收获..." v-model="writeDiscuss"/>
      <img src="@/assets/images/mobile_student/sendcommand.png" @click="addDiscuss"/>
    </div>
      <!-- <video :src="chapter_class.file_url" v-if="['mp4','ogg', 'avi', 'rmvb'].indexOf(content_type)!==-1" id="video" controls autoplay style="width:100%;height:100%;"></video> -->
  </div>
</template>
<script>

import { getSuffix } from '@/libs/util'
import { update_study_progress, chapter_class_show } from '@/api/common'
import { Toast } from 'mint-ui'
import Krpano from '@/components/krpano'
import KrpanoVideo from '@/components/krpano-video'

export default {
  data () {
    return {
      chapter_class: [],
      page: 1,
      discussInfo: [],
      total: '',
      writeDiscuss: '',
      showAllCourseDetailEdit: false
    }
  },
  components: { Krpano, KrpanoVideo },
  watch: {

  },
  computed: {
    course_id () {
      return this.$route.query.course_id
    },
    id () {
      return this.$route.query.id
    },
    type () {
      return this.$route.query.type
    },
    typeName () {
      return this.$route.query.typeName
    },
    content_type () {
      return getSuffix(this.chapter_class.file_url)
    },
    teacher_course_id () {
      return this.$store.state.user.courseData.teacher_course_id
    }
  },
  methods: {
    back () {
      history.go(-1)
    },
    changeTime (v) {
      return this.moment(v * 1000).format('YYYY-MM-DD')
    },
    updateStudyProgress () {
      if (this.chapter_class.status) return
      this.chapter_class.content_type = getSuffix(this.chapter_class.file_url)
      // 处理进度
      let _this = this
      if (['mp4', 'ogg', 'avi', 'rmvb'].indexOf(this.chapter_class.content_type) !== -1) { // 视频类型
        setTimeout(() => {
          _this.video = document.getElementById('video')
          if (_this.chapter_class.study_time) { // 跳转之前播放的位置
            _this.video.currentTime = _this.chapter_class.study_time
          }
          _this.video.ontimeupdate = function () {
            _this.chapter_class.study_time = _this.video.currentTime.toFixed(0)
          }
          _this.video_timer = setInterval(() => {
            _this.chapter_class.video_time = _this.video.duration.toFixed(0)// FIXME:总时间(可能会有问题.要缓冲完才能获取总时间)
            if ((_this.chapter_class.video_time - _this.chapter_class.study_time) <= 5) { // 小于5秒默认完成
              _this.chapter_class.study_time = _this.chapter_class.video_time
              _this.chapter_class.status = 1
            }

            _this.video_timer && _this.updateProgress(_this.chapter_class)
          }, 5000)
        }, 500)
      } else { // 其他类型
        _this.chapter_class.video_time = 0
        _this.chapter_class.study_time = 0
        _this.chapter_class.status = 1
        _this.updateProgress(_this.chapter_class)
      }
    },
    updateProgress (item) {
      this.$emit('update_progress', item.status === 1 ? 100 : parseInt(item.study_time / item.video_time * 100))
      update_study_progress({ chapter_class_id: item.id, video_time: item.video_time, study_time: item.study_time, status: item.status, teacher_course_id: this.teacher_course_id }).then(res => {})
    },
    addDiscuss () {
      if (this.writeDiscuss === '') {
        Toast({
          message: '请输入你要发表的内容',
          duration: 2000
        })
      } else {
        this.axios
          .request({
            method: 'post',
            url: '/index.php/Student/ChapterClass/add_discuss',
            data: {
              chapter_class_id: this.id,
              parent_id: 0,
              content: this.writeDiscuss,
              comment_course_type: this.type
            }
          }).then(res => {
            if (res.code === 200) {
              Toast({
                message: '评论成功',
                duration: 2000
              })
              this.getCommand()
              this.writeDiscuss = ''
            }
          })
      }
    },
    getInfo () {
      chapter_class_show(this.id).then(res => {
        if (res.code === 200) {
          this.chapter_class = res.data.chapter_class
          // this.userType === 2 && this.updateStudyProgress()
          // this.t_id = res.data.chapter_class.id
        }
      })
    },
    getCommand () {
      // if (this.$store.state.user.userInfo.userType === 1) {
      //   this.axios
      //     .request({
      //       method: 'get',
      //       url: '/index.php/Teacher/ChapterClass/discuss_list',
      //       params: {
      //         page: this.page,
      //         chapter_class_id: this.chapter_id,
      //         comment_course_type: this.type
      //       }
      //     }).then(res => {
      //       if (res.code === 200) {
      //         this.discussInfo = res.data.list
      //         this.total = res.data.total
      //       }
      //     })
      // } else if (this.$store.state.user.userInfo.userType === 2) {
      this.axios
        .request({
          method: 'get',
          url: '/index.php/Student/ChapterClass/discuss_list',
          params: {
            page: this.page,
            chapter_class_id: this.id,
            comment_course_type: this.type
          }
        }).then(res => {
          if (res.code === 200) {
            this.discussInfo = res.data.list
            this.total = res.data.total
          }
        })
    }
    // }
  },
  mounted () {
    this.getInfo()
    this.getCommand()
  }
}
</script>
<style>
  .m-chapterDetail .scene-container .item{
    width: auto;
  }
  .m-chapterDetail .scene-container .item .img{
    width: 2rem;
    height: 2rem;
  }
  .m-chapterDetail .scene-container .item .img>img{
    width: 100%;
    height: 100%;
  }
  .m-chapterDetail .option-container{
    top: 0.5rem;
  }
  .m-chapterDetail .option-container .btn-base{
    width: 0.8rem;
    height: 0.8rem;
  }
</style>
