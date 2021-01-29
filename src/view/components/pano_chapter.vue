<template>
  <div>
    <Row>
      <Button size="small" @click="edit('')" type="success" icon="md-add" v-if="pano_editable">新增</Button>
    </Row>
    <div class="chapter-item" v-for="(item,index) in chapters" :key="item.id" @click.stop="detail(item)">
      <div class="img">
        <img :src="item.img" alt />
      </div>
      <div class="content" style="height:initial">
        <Button type="primary" size="small" v-if="pano_editable" @click.stop="edit(item)">编辑</Button>
        <Button type="error" size="small" @click.stop="del(item,index)" v-if="pano_editable">删除</Button>
        <p style="height:36px">第{{item.sort}}章：{{item.pano_name}}</p>
      </div>
    </div>

    <Row>
      <Modal v-model="modal" :title="title" :footer-hide="footerHide" :width="modal_width" :fullscreen="true">
        <Krpano :pano_id="target_id" v-if="target === 'krpano' && modal" :editable.sync="pano_editable"></Krpano>
        <KrpanoVideo :pano_id="target_id" v-if="target === 'krpano_video' && modal" :editable.sync="pano_editable"
          @success="modal = false ; getData()"></KrpanoVideo>
        <inCourseDetail v-if="modal&&target==='showAllCourseDetail'" @closeCourseDetail="closeCourseDetail"
          :showAllCourseDetailId="showAllCourseDetailId" :showAllCourseDetailCId='showAllCourseDetailCId'
          :showAllCourseDetailEdit='pano_editable' :showAllCourseDetailType='showAllCourseDetailType'></inCourseDetail>
        <div v-if="target === 'pano'">
          <Form :modal="pano" v-if="pano.pano_type === 1" :label-width="80">
            <FormItem label="类型">
              <RadioGroup v-model="pano.pano_type">
                <Radio :label="1">全景图</Radio>
                <Radio :label="2">全景视频</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="标题">
              <Input v-model="pano.pano_name"></Input>
            </FormItem>
            <FormItem label="章号：">
              <InputNumber v-model="pano.sort"></InputNumber>
            </FormItem>
            <FormItem label="封面">
              <ImageUpload v-model="pano.img" :extra="{type: 'pano',token:$store.state.user.token}"></ImageUpload>
            </FormItem>
            <FormItem label="全景图">
              <ImageUploadList :extra="{type: 'pano_file',token:$store.state.user.token}" v-model="pano.pano_img_url"
                :wh_scale="{width: 2, height: 1}" :maxLength="10"></ImageUploadList>
            </FormItem>
          </Form>

          <Form :modal="pano" v-if="pano.pano_type === 2" :label-width="80">
            <FormItem label="类型">
              <RadioGroup v-model="pano.pano_type">
                <Radio :label="1">全景图</Radio>
                <Radio :label="2">全景视频</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="标题">
              <Input v-model="pano.pano_name"></Input>
            </FormItem>
            <FormItem label="章号：">
              <InputNumber v-model="pano.sort"></InputNumber>
            </FormItem>
            <FormItem label="封面">
              <ImageUpload v-model="pano.img" :extra="{type: 'pano',token:$store.state.user.token}"></ImageUpload>
            </FormItem>
            <FormItem label="视频">

              <FileUpload :fileObj="{url: pano.video_url, name: ''}"
                @on-change="(file)=>{pano.video_url = file.url;pano.file_name= file.name}"
                :extra="{type: 'pano.video',token:$store.state.user.token}" :format="['mp4']">
              </FileUpload>
            </FormItem>
          </Form>
        </div>
        <Spin fix v-if="saving">保存中....请稍后</Spin>
        <div slot="footer">
          <Button @click="store" size="small" type="primary">保存</Button>
        </div>
      </Modal>
    </Row>
  </div>
</template>
<script>

import Krpano from '@/components/krpano'
import KrpanoVideo from '@/components/krpano-video'
import modal_mixin from '@/view/mixins/modal_mixin'
import inCourseDetail from '@/view/teachingSystem_page/inCourseDetail.vue'
import ImageUploadList from '@/components/image-upload-list'
import { course_chapter_class } from '@/api/common'
export default {
  props: {
    course_id: '',
    teacher_course_id: '',
    type: '',
    editable: true // 列表可编辑
  },
  mixins: [modal_mixin],
  components: {
    Krpano,
    KrpanoVideo,
    inCourseDetail,
    ImageUploadList
  },
  data () {
    return {
      chapters: [],
      saving: false,
      pano_editable: this.editable,
      showAllCourseDetailType: '',
      showAllCourseDetailId: '',
      showAllCourseDetailCId: '',
      pano: {
        id: '',
        course_id: this.course_id,
        description: '',
        img: '',
        item_name: '',
        pano_img_count: 2,
        pano_img_url: '',
        pano_name: '',
        pano_type: 1,
        update_record: {},
        video_url: '',
        sort: 0
      }
    }
  },
  watch: {
    course_id (n, o) {
      this.getData()
    },
    modal (n) {
      if (!n && this.showAllCourseDetailType === 'pano_video') {
        let krpano = document.getElementById('krpanoSWFObject')
        krpano.call('removeplugin("video")')
      }
    }
  },
  methods: {
    getData () {
      let _this = this
      if (!this.course_id) return
      course_chapter_class(this.course_id, this.teacher_course_id).then(res => {
        if (res.code === 200) {
          _this.chapters = res.data.chapter_list
        }
      })
    },
    detail (item) {
      this.target = 'showAllCourseDetail'
      if (this.type === undefined) {
        if (item.pano_type === 1) {
          this.$emit('showAllCourseDetail', item.id, 'krpano', this.pano_editable, item.course_id)
        } else {
          this.$emit('showAllCourseDetail', item.id, 'krpano_video', this.pano_editable, item.course_id)
        }
      } else if (this.type === 'addcourse') {
        if (item.pano_type === 1) {
          this.open('krpano', item.id, '编辑', 0, true, true)
        } else {
          this.open('krpano_video', item.id, '编辑', 0, true, true)
        }
      } else {
        if (item.pano_type === 1) {
          this.modal = true
          this.showAllCourseDetailType = 'krpano'
          this.showAllCourseDetailId = item.id
          this.showAllCourseDetailCId = item.course_id
        } else {
          this.modal = true
          this.showAllCourseDetailType = 'krpano_video'
          this.showAllCourseDetailId = item.id
          this.showAllCourseDetailCId = item.course_id
        }
      }
    },
    closeCourseDetail () {
      this.modal = false
      this.showAllCourseDetailType = ''
    },
    del (item, index) {
      this.$Modal.confirm({
        title: '确认删除?',
        onCancel: () => {
          return false
        },
        onOk: () => {
          this.axios.request({
            method: 'post',
            url: '/index.php/Teacher/Pano/delete',
            data: {
              id: [item.id]
            }
          }).then(res => {
            if (res.code === 200) {
              this.chapters.splice(index, 1)
              this.$Message.success(res.message)
            }
          })
        }
      })
    },
    edit (item) {
      if (!this.course_id) {
        this.$Message.warning('请先保存基本信息！')
        return
      }
      this.target = 'pano'
      this.modal = true
      this.footerHide = false
      this.fullscreen = false
      this.modal_width = 1000
      if (!item) {
        this.title = '新增'
        this.pano = {
          id: '',
          course_id: this.course_id,
          description: '',
          img: '',
          item_name: '',
          pano_img_count: 2,
          pano_img_url: '',
          pano_name: '',
          pano_type: 1,
          update_record: {},
          video_url: '',
          sort: 0
        }
      } else {
        this.title = '修改'
        this.pano = item
      }
    },
    store () {
      this.saving = true
      let {
        id,
        course_id,
        description,
        img,
        pano_img_count,
        pano_img_url,
        pano_name,
        pano_type,
        video_url,
        sort
      } = this.pano
      this.axios.request({
        method: 'post',
        url: '/index.php/Teacher/Pano/add',
        data: {
          id,
          course_id,
          description,
          img,
          pano_img_count,
          pano_img_url: pano_img_url.split(','),
          file_url: pano_img_url.split(','),
          pano_name,
          pano_type,
          video_url,
          sort
        }
      }).then(res => {
        this.saving = false
        if (res.code === 200) {
          this.$Message.success(res.message)
          this.getData()
          this.modal = false
        }
      }).catch(err => {
        console.error(err)
        this.saving = false
      })
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
<style lang="less">
.chapter-item {
  cursor: pointer;
  width: 200px;
  overflow: hidden;
  margin: 10px;
  display: inline-block;
  .img {
    overflow: hidden;
    width: 100%;
    height: 100px;
    img {
      width: 100%;
    }
  }
  .content {
    // height: 42px;
    padding: 10px;
    p {
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
  }
  &:hover {
    box-shadow: 1px 2px 3px #ccc;
  }
}
</style>
