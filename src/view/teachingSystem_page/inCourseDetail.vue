<template>
  <div style="height:100%;padding:20px 200px;">
    <div style="width:100%;height:100%;position:relative">
      <div class="ab-scroll">
        <div style="margin-bottom:10px">
          <button class="blueText-btn" @click="$emit('closeCourseDetail')">返回</button>
        </div>
        <Row type="flex" style="min-height:450px">
          <Col style="text-align:center;background:#000;flex:1"
            v-if="chapter_class.file_url&&showAllCourseDetailType===''">
          <video :src="chapter_class.file_url" v-if="['mp4','ogg', 'avi', 'rmvb'].indexOf(content_type)!==-1" id="video"
            controls autoplay style="width:100%;height:100%;"></video>
          <div v-else-if="['mp3','pdf','swf'].indexOf(content_type)!==-1"
            style="height:100%;width:100%;background:#000;">
            <embed :src="chapter_class.file_url" style="width:100%;height:100%"></embed>
          </div>
          <div v-else-if="['ppt','pptx','xlsx','xls','doc','docx'].indexOf(content_type)!==-1"
            style="height:100%;width:100%;background:#000;">
            <iframe :src='`https://view.officeapps.live.com/op/view.aspx?src=${chapter_class.file_url}`' width='100%'
              height='100%' frameborder='1'></iframe>
          </div>
          <div v-else class="embed-tips" style="width:100%">
            格式不支持
            <a :href="file_url" target="blank">文件：{{chapter_class.file_url | filtFileName}}</a>
          </div>
          </Col>
          <Col style="text-align:center;background:#000;flex:1;font-size:16px;color:#ffffff;height:400px"
            v-if="!chapter_class.file_url&&showAllCourseDetailType===''">
          <span>暂无素材资源</span>
          </Col>
          <Col style="text-align:center;background:#000;flex:1;font-size:16px;color:#ffffff;"
            v-if="showAllCourseDetailType!==''">
          <Krpano :pano_id="showAllCourseDetailId" v-if="showAllCourseDetailType === 'krpano'"
            :editable.sync="showAllCourseDetailEdit"></Krpano>
          <KrpanoVideo :pano_id="showAllCourseDetailId" v-if="showAllCourseDetailType === 'krpano_video'"
            :editable.sync="showAllCourseDetailEdit"></KrpanoVideo>
          </Col>
          <Col style="width:325px;margin-left:20px;display:flex;flex-direction:column">
          <div
            style="width:100%;border-radius:5px 5px 0 0;line-height:54px;height:54px;background:#28303A;border:1px solid #404040;font-size:14px;color:#c4c4c4;text-align:center">
            课程章节列表</div>
          <Tree :data="chapter_class_list" children-key="child" class="new-tree" @on-select-change="changeDetail"
            style="background:#F4F4F4;flex:1;overflow-y:scroll"></Tree>
          </Col>
        </Row>
        <div v-if="showAllCourseDetailType===''">
          <h2 style="font-size:22px;color:#222222;margin:10px 0">{{chapter_class.title}}</h2>
          <div style="font-size:14px;color:#666666;word-break:break-all;margin-bottom:20px"
            v-html="chapter_class.content"></div>
        </div>
        <div style="flex:1">
          <div style="font-size:16px;color:#222222;border-bottom:1px solid #EEEEEE;padding:10px 0;margin-bottom:20px">
            评论列表</div>
          <chapterDiscuss :chapter_id="showAllCourseDetailId?showAllCourseDetailId:t_id"
            :type="showAllCourseDetailType===''?1:2"></chapterDiscuss>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import { getSuffix } from '@/libs/util'
import chapterDiscuss from '@/view/class_common/course/chapter_discuss.vue'
import Krpano from '@/components/krpano'
import KrpanoVideo from '@/components/krpano-video'
import { course_chapter_class } from '@/api/data'
import { update_study_progress, chapter_class_show } from '@/api/common'
export default {
  components: {
    chapterDiscuss,
    Krpano,
    KrpanoVideo  },
  props: {
    id: '',
    course_id: '',
    showAllCourseDetailId: '',
    showAllCourseDetailType: '',
    showAllCourseDetailEdit: '',
    showAllCourseDetailCId: ''
  },
  data () {
    return {
      video_timer: '', // 定时器
      userType: this.$store.state.user.userInfo.userType,
      chapter_class: {},
      t_id: '',
      chapter_class_list: []
    }
  },
  watch: {
    id (val, oldVal) {
      if (this.showAllCourseDetailType === '') {
        this.getInfo()
      }
    },
    course_id (newVla, oldVal) {
      this.getData()
    }
  },
  computed: {
    content_type () {
      return getSuffix(this.chapter_class.file_url)
    },
    teacher_course_id () {
      return this.$store.state.user.courseData.teacher_course_id
    }
  },
  filters: {
    filtFileName (file_url) {
      if (!file_url) return
      return file_url.substr(file_url.lastIndexOf('/') + 1).toLowerCase()
    }
  },
  methods: {
    changeDetail (i) {
      if (this.showAllCourseDetailType === '') {
        if (i.length !== 0 && i[0].child === undefined) {
          this.id = i[0].id
          this.course_id = i[0].course_id
        }
      } else {
        if (i[0].pano_type === 1) {
          this.showAllCourseDetailType = 'krpano'
        } else {
          this.showAllCourseDetailType = 'krpano_video'
        }
        this.showAllCourseDetailId = i[0].id
      }
    },
    getInfo () {
      chapter_class_show(this.id).then(res => {
        if (res.code === 200) {
          this.chapter_class = res.data.chapter_class
          this.userType === 2 && this.updateStudyProgress()
          this.t_id = res.data.chapter_class.id
        }
      })
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
      update_study_progress({ chapter_class_id: item.id, video_time: item.video_time, study_time: item.study_time, status: item.status, teacher_course_id: this.teacher_course_id }).then(res => { })
    },
    getData () {
      if (this.$store.state.user.userInfo.userType === 1) {
        if (this.course_id !== '' && this.course_id !== undefined) {
          course_chapter_class(this.course_id, this.teacher_course_id).then(res => {
            let data = res.data
            if (res.code === 200) {
              this.chapter_class_list = data.chapter_list
            }
          })
        }
        if (this.showAllCourseDetailCId !== '' && this.showAllCourseDetailCId !== undefined) {
          course_chapter_class(this.showAllCourseDetailCId, this.teacher_course_id).then(res => {
            if (res.code === 200) {
              this.chapter_class_list = res.data.chapter_list
              for (let i = 0; i < this.chapter_class_list.length; i++) {
                this.chapter_class_list[i].title = res.data.chapter_list[i].pano_name
              }
            }
          })
        }
      } else if (this.$store.state.user.userInfo.userType === 2) {
        if (this.course_id !== '' && this.course_id !== undefined) {
          this.axios.request({
            method: 'get',
            url: '/home/course/getChapterClassList',
            params: {
              course_id: this.course_id,
              teacher_course_id: this.teacher_course_id
            }
          }).then(res => {
            if (res.code === 200) {
              this.chapter_class_list = res.data.chapter_list
            }
          })
        }
        if (this.showAllCourseDetailCId !== '' && this.showAllCourseDetailCId !== undefined) {
          this.axios.request({
            url: '/home/course/getChapterClassList',
            params: {
              course_id: this.showAllCourseDetailCId,
              teacher_course_id: this.teacher_course_id
            },
            method: 'get'
          }).then(res => {
            if (res.code === 200) {
              this.chapter_class_list = res.data.chapter_list
              for (let i = 0; i < this.chapter_class_list.length; i++) {
                this.chapter_class_list[i].title = res.data.chapter_list[i].pano_name
              }
            }
          })
        }
      }
    }
  },
  mounted () {
    if (this.showAllCourseDetailType === '') {
      this.getInfo()
    }
    this.getData()
  },
  beforeDestroy () {
    clearInterval(this.video_timer)
  }
}
</script>
<style>
.dic {
  font-size: 18px;
  font-weight: bold;
  padding: 10px 5px;
  border-bottom: 1px solid rgb(232, 234, 236);
  margin-top: 20px;
}
</style>
