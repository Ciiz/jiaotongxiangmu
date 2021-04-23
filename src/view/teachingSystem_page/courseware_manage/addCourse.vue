<template>
  <div class="select-course" style="position:relative;display:flex;flex-direction:column">
    <div>
      <span class="select-course-header-l-title" v-if="course_id">修改课程</span>
      <span class="select-course-header-l-title" v-else>添加自建课程</span>
    </div>
    <Row style="padding:40px 0 70px 0;flex:1">
      <Col :span="11" class="add-course-l">
      <Form :label-width="100" :modal="course" :rules="courseRules" class="course-form">
        <div>
          <FormItem label="课程名称：">
            <Input v-model="course.course_name" placeholder="请填写课程名称" style="width:70%;height:36px"></Input>
          </FormItem>
        </div>
        <div>
          <FormItem label="封面：">
            <ImageCropUpload :imgsrc="course.img" @success="(url)=>{this.course.img = url}"
              :params="{type: 'course',token:$store.state.user.token}" :size_editable="false" :imgWidth='300'
              :imgHeight='225'>
            </ImageCropUpload>
          </FormItem>
        </div>
        <div>
          <div>

            <FormItem label="课程标签：">
              <Tag v-for="item in course.course_label" :key="item" :name="item" closable @on-close="handleClose">
                {{item}}</Tag>
              <Tag v-for="tag in tagList" @on-change="chooseTag(tag)" :key="tag.id" checkable
                :checked="inChecked(tag.name)" color="primary">{{tag.name}}</Tag></br>
              <Input v-model="tag" style="width:130px;"></Input>
              <span class="blue-cg" @click="handleAdd" style="cursor:pointer;margin-left:4px">添加</span>
              <Row>
              </Row>
            </FormItem>
          </div>
        </div>
        <div>
          <FormItem label="专业：">
            <Select v-model="course.major" filterable style="width:70%;height:36px">
              <Option v-for="item in majorList" :value="item.major_id" :key="item.major_id">{{item.major_name}}</Option>
            </Select>
          </FormItem>
        </div>
        <div>
          <FormItem label="课程类型：">
            <RadioGroup v-model="course.course_type" v-if="!is_editor">
              <Radio :label="1">普通</Radio>
              <Radio :label="2">全景</Radio>
            </RadioGroup>
            <div v-else>
              {{course.course_type === 1 ? '普通课程' : '全景课程'}}
            </div>
          </FormItem>
        </div>
        <div>
          <FormItem label="描述：">
            <Input type="textarea" :rows="6" v-model="course.description" style="width:100%;"></Input>
          </FormItem>
        </div>
        <div>
          <FormItem style="margin-bottom:4px">
            <Checkbox label="twitter">
              <span>仅供本人上课使用</span>
            </Checkbox>
          </FormItem>
        </div>
        <div>
          <FormItem>
            <Checkbox label="twitter">
              <span>允许管理员对外发布</span>
            </Checkbox>
            <RadioGroup>
              <Radio :label="1">免费</Radio>
              <Radio :label="2">收费：</Radio>
            </RadioGroup>
            <Input type="number" class="addC-inp" />%
          </FormItem>
        </div>
      </Form>
      </Col>
      <Col :span="12" :offset="1" style="height:100%">
      <div class="ab-scroll">
        <div v-if="course.course_type === 1">
          <h2>章节信息 </h2>
          <ChapterClass :type="'addcourse'" :course_id="course.id" :editable="true"></ChapterClass>
        </div>

        <Row v-if="course.course_type === 2">
          <h2>全景章节信息</h2>
          <PanoChapter :type="'addcourse'" :course_id="course.id" :editable="true"></PanoChapter>
        </Row>

        <Spin size="large" fix v-if="loading"></Spin>
      </div>
      </Col>
    </Row>
    <!-- 普通课程MOdal -->
    <Modal v-model="modal" :title="title">
      <CourseFilePlay :file_url="target_id.file_url" v-if="target==='course_file_play'"></CourseFilePlay>
    </Modal>
    <Modal v-model="modal1" title="保存" @on-ok="submit">
      <p>是否保存</p>
    </Modal>
    <div class="add-course-footer">
      <button class="blackBorder-btn" @click="closethis">返回</button>
      <button class="blueC-btn" @click="submitshow">保存</button>
    </div>
  </div>
</template>
<script>
import ChapterClass from '@/view/teacher_common/course/chapter_class'
import PanoChapter from '@/view/components/pano_chapter'
import CourseFilePlay from '@/view/components/course_file_play.vue'
import modal_mixin from '@/view/mixins/modal_mixin'
import ImageCropUpload from '_c/image-crop-upload'
import { course_save, course_show } from '@/api/data'
export default {
  name: 'course',
  props: {
    course_id: ''
  },
  mixins: [modal_mixin],
  components: {
    ChapterClass,
    CourseFilePlay,
    PanoChapter,
    ImageCropUpload
  },
  data () {
    return {
      modal1: false,
      is_editor: false, // 判断新增 or 编辑
      chapter_modal: false,
      modal: false,
      visible: false,
      uploadList: [],
      defaultList: [],
      editor_init: true,
      course: {
        id: '',
        course_id: '',
        course_name: '',
        description: '',
        img: '',
        course_label: [],
        course_type: 1,
        major: ''
      },
      loading: false,
      page: 1,
      pagesize: 10,
      search_word: '',
      chapterList: [],
      courseRules: {},
      tagList: [],
      majorList: [],
      tag: ''
    }
  },
  filters: {
    audit_str: val => {
      let str = ''
      switch (val) {
        case 0:
          str = '未审核'
          break
        case 1:
          str = '已通过'
          break
        case 2:
          str = '不通过'
          break
        case 3:
          str = '已提交'
          break
      }
      return str
    }
  },
  watch: {
    course_id (newVal, oldVal) {
      this.getCourseInfo()
    }
  },
  methods: {
    submitshow () {
      this.modal1 = true

    },
    getCourseInfo () {
      // 获取课程详细信息
      let _this = this
      if (this.course_id) {
        _this.loading = true
        _this.editor_init = true
        course_show(this.course_id, 2).then(res => {
          let data = res.data
          if (res.code === 200) {
            let _course = data.course_info
            _this.course = {
              id: _course.id,
              course_name: _course.course_name,
              description: _course.description,
              img: _course.img,
              course_label: _course.course_label ? _course.course_label.split('、') : [],
              course_type: _course.course_type,
              major: data.major_id
            }
            _this.is_editor = true
            // _this.chapterList = _this.dealChapterData(data.chapter)
          }
          _this.loading = false
        })
      } else {
        this.course = {// 初始化
          course_id: '',
          course_name: '',
          description: '',
          img: '',
          course_label: [],
          course_type: 1,
          major: '',
          id: ''
        }
        this.chapterList = []
        this.is_editor = false
      }
    },
    dealChapterData (list) {
      let arr = []
      list.forEach(item => {
        let data = item
        data.title = item.chapter_name
        data.expand = true
        if (typeof (item.class_data) !== 'undefined') {
          data.children = item.class_data.map(child => {
            child.title = child.class_name
            child.expand = true
            return child
          })
        }
        arr.push(data)
      })
      return arr
    },
    handleChange (html, text) {
      this.course.description = html
    },
    handleCoursePlayChange (arr, item) {
      if (item.has_file || typeof (item.children) === 'undefined') {
        this.open('course_file_play', item, item.title)
      }
    },
    inChecked (tagName) {
      return this.course.course_label.indexOf(tagName) !== -1
    },
    closethis () {
      this.$emit('closeSelect')

    },
    chooseTag (tag) {
      const index = this.course.course_label.indexOf(tag.name)
      if (index === -1) {
        this.course.course_label.push(tag.name)
      } else {
        this.course.course_label.splice(index, 1)
      }
    },
    handleAdd () {
      if (this.course.course_label.indexOf(this.tag) === -1) {
        this.course.course_label.push(this.tag)
        this.tag = ''
      } else {
        this.$Message.warning('不能添加相同的标签')
      }
    },
    handleClose (event, name) {
      const index = this.course.course_label.indexOf(name)
      this.course.course_label.splice(index, 1)
    },
    submit () {
      let _this = this
      if (this.course.img === '') {

        this.$Message.warning('请上传封面图')
        return false
      }
      const data = {
        id: this.course.id,
        course_name: this.course.course_name,
        description: this.course.description,
        img: this.course.img,
        course_label: this.course.course_label.join('、'),
        course_type: this.course.course_type,
        major: this.course.major
      }
      course_save(this.course.id, data).then(res => {
        if (res.code === 200) {
          // _this.$Message.success(res.message)
          _this.$Message.success('修改成功！修改后需要重新提交审核！')
          _this.$emit('success')
          if (!_this.course.id) {
            _this.course.id = res.data.id
          }
        }
      })
    },
    getMajorTag () {
      course_show('', 1).then(res => {
        if (res.code === 200) {
          this.tagList = res.data.label_list
          this.majorList = res.data.major_list
        }
      })
    }
  },
  mounted () {
    // console.log(this.course.course_type);
    this.getCourseInfo()
    this.getMajorTag()
  }
}
</script>
<style lang="less">
.addC-inp {
  width: 60px;
  margin-right: 4px;
}
</style>
