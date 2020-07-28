<template>
<div>
  <Row>
    <Col :span="18" :offset="3" style="text-align:center;background:#000;" v-if="chapter_class.file_url">
      <video :src="chapter_class.file_url" v-if="['mp4','ogg', 'avi', 'rmvb'].indexOf(content_type)!==-1" id="video" controls autoplay style="width:100%;max-height:80vh;"></video>
      <div v-else-if="['mp3','pdf','swf'].indexOf(content_type)!==-1" style="height:80vh;width:100%;background:#000;">
        <embed :src="chapter_class.file_url"   style="width:100%;height:80vh"></embed>
      </div>
      <div v-else-if="['ppt','pptx','xlsx','xls','doc','docx'].indexOf(content_type)!==-1" style="height:80vh;width:100%;background:#000;">
        <iframe :src='`https://view.officeapps.live.com/op/view.aspx?src=${chapter_class.file_url}`' width='100%' height='100%' frameborder='1'></iframe>
      </div>
      <div v-else class="embed-tips" style="width:100%">
        格式不支持
        <a :href="file_url" target="blank">文件：{{chapter_class.file_url | filtFileName}}</a>
      </div>
    </Col>
    <Col :span="18" :offset="3" >
      <h2>{{chapter_class.title}}</h2>
      <div v-html="chapter_class.content"></div>
    </Col>
  </Row>
  <div style="padding:50px 12%;min-width:600px">
    <div class="dic">评论</div>
    <chapterDiscuss :chapter_id="t_id" :type="type"></chapterDiscuss>
</div>
</div>
</template>
<script>
import { getSuffix } from '@/libs/util'
import chapterDiscuss from '@/view/class_common/course/chapter_discuss.vue'
import { chapter_class_show } from '@/api/common'
export default {
  components: { chapterDiscuss },
  props: {
    id: '',
    course_id: '',
    type: ''
  },
  data () {
    return {
      userType: this.$store.state.user.userInfo.userType,
      chapter_class: {},
      t_id: '',
      chapter_class_list: []
    }
  },
  watch: {
    id (val, oldVal) {
      this.getInfo()
    }
  },
  computed: {
    content_type () {
      return getSuffix(this.chapter_class.file_url)
    }
  },
  filters: {
    filtFileName (file_url) {
      if (!file_url) return
      return file_url.substr(file_url.lastIndexOf('/') + 1).toLowerCase()
    }
  },
  methods: {
    getInfo () {
      chapter_class_show(this.id).then(res => {
        if (res.code === 200) {
          this.chapter_class = res.data.chapter_class
          this.t_id = res.data.chapter_class.id
        }
      })
    }
  },
  mounted () {
    this.getInfo()
  }
}
</script>
<style>
  .dic{
    font-size: 18px;
    font-weight: bold;
    padding: 10px 5px;
    border-bottom: 1px solid rgb(232, 234, 236);
    margin-top: 20px
  }
</style>
