<template>
  <div style="padding:20px 10px;background:#ffffff;flex:1">
    <div style="width:100%;height:100%;position:relative">
      <Row style="width:100%;height:100%;position:absolute;overflow:hidden">
        <Col :span="12" style="height:100%;overflow-y:scroll">
          <div class="black-c" style="font-weight:400;margin-left:16px">课程章节：</div>
          <!-- 普通课程 -->
          <Card shadow v-if="course.course_type === 1">
            <ChapterClass :type="course.course_type" :teacher_course_id="teacher_course_id" :course_id="course.id" :editable="false"></ChapterClass>
          </Card>
          <!-- 全景课程 -->
          <Row v-else>
            <PanoChapter :type="course.course_type" :teacher_course_id="teacher_course_id" :course_id="course.id" :editable="false"></PanoChapter>
          </Row>
        </Col>
        <Col :span="11" :offset="1" style="height:100%;overflow-y:scroll">
          <Form :label-width="100"  class="course-form">
            <div>
              <FormItem label="课程名称：" class="course-form-item">
                <p>{{course.course_name}}</p>
              </FormItem>
            </div>
            <div>
              <FormItem label="课程封面：" class="course-form-item">
                <div class="course-cover">
                  <img :src="course.img" alt="">
                </div>
              </FormItem>
            </div>
            <div>
              <FormItem label="课程标签：" class="course-form-item">
                <p class="blue-c">{{course.course_label}}</p>
              </FormItem>
            </div>
            <div>
              <FormItem label="课程类型：" class="course-form-item">
                <p class="blue-c" v-show="course.course_type === 1">普通</p>
                <p class="blue-c" :color="'green'" v-show="course.course_type === 2">全景</p>
              </FormItem>
            </div>
            <div>
              <FormItem label="描述：" class="course-form-item">
                <div v-html="course.description"></div>
              </FormItem>
            </div>
          </Form>
        </Col>
      </Row>
    </div>

    <!-- 普通课程MOdal -->
    <Modal v-model="modal" width="1200" :title="cur_content.name" :mask-closable="false" fullscreen footer-hide @on-visible-change="close">
    </Modal>
    <Spin size="large" v-if="loading" fix></Spin>
  </div>
</template>

<script>
import PanoChapter from '@/view/components/pano_chapter'
import ChapterClass from './chapter_class'
import { course_show } from '@/api/student'
export default {
  components: {
    PanoChapter, ChapterClass
  },
  name: 'chapter_class',
  data () {
    return {
      loading: false,
      modal: false,
      target: '',
      cur_content: { name: '' },
      video: '',
      columns: [
        {
          title: '序号',
          key: 'sort',
          width: '100px'
        },
        {
          title: '章节名称',
          key: 'name',
          width: '350px'
        },
        {
          title: '学习进度',
          key: 'progress',
          minWidth: '100px',
          type: 'template',
          template: 'progress'
        },
        {
          title: '',
          key: 'action',
          type: 'template',
          template: 'action'
        }
      ],
      data: [],
      teacher_course: {},
      course: {}
    }
  },
  watch: {
    teacher_course_id (newVal, oldVal) {
      this.getTeacherCourse()
    }
  },
  computed: {
    teacher_course_id () {
      return this.$store.state.user.courseData.teacher_course_id
    }
  },
  methods: {
    close (flag) {
      if (!flag) {
        this.video_timer && clearInterval(this.video_timer)
      }
    },
    getTeacherCourse () {
      if (!this.teacher_course_id) return
      this.loading = true
      course_show(this.teacher_course_id).then(res => {
        this.loading = false
        if (res.code === 200) {
          this.teacher_course = res.data.teacher_course
          this.course = res.data.teacher_course.course
        }
      })
    }
  },
  mounted () {
    this.getTeacherCourse()
  }
}
</script>

<style lang="less" >
.course-form-item>.ivu-form-item-label{
    font-size: 14px;
    color: #222222;
    font-weight: 400;
  }
.embed-tips{
    color: #fff;
    font-size: 18px;
    margin-top: 80px;
}
.course-cover{
  width:100px;
  height:100px;
  overflow: hidden;
  img{
    width:100%;
  }
}

.chapter-item{
    cursor:pointer;
    width: 200px;
    overflow: hidden;
    margin:10px;
    display: inline-block;
  .img{
    overflow: hidden;
    width: 100%;
    height: 120px;
    img{
    width: 100%;
    height: 100%;
    }
  }
  .content{
    margin-top: 10px;
    height: 42px;
    p{
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    }
  }

}
</style>
