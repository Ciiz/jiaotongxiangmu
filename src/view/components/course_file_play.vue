<template>
<div>
  <Row>
    <Col :span="18" :offset="3" style="text-align:center;background:#000;">
      <video :src="file_url" v-if="['mp4','ogg', 'avi', 'rmvb'].indexOf(content_type)!==-1" controls autoplay style="width:100%;max-height:80vh;"></video>
      <div v-else-if="['mp3','pdf','swf'].indexOf(content_type)!==-1" style="height:80vh;width:100%;background:#000;">
        <embed :src="file_url"   style="width:100%;height:80vh"></embed>
      </div>
      <div v-else-if="['ppt','pptx','xlsx','xls','doc','docx'].indexOf(content_type)!==-1" style="height:80vh;width:100%;background:#000;">
        <iframe :src='`https://view.officeapps.live.com/op/view.aspx?src=${file_url}`' width='100%' height='100%' frameborder='1'></iframe>
      </div>
      <div v-else class="embed-tips" style="width:100%">
        格式不支持
        <a :href="file_url" target="blank">文件：{{file_url | filtFileName}}</a>
      </div>
    </Col>
  </Row>
</div>
</template>
<script>
import { getSuffix } from '@/libs/util'
export default {
  props: {
    file_url: ''
  },
  data () {
    return {
    }
  },
  watch: {
    file_url (val, oldVal) {
    }
  },
  computed: {
    content_type () {
      return getSuffix(this.file_url)
    }
  },
  filters: {
    filtFileName (file_url) {
      if (!file_url) return
      return file_url.substr(file_url.lastIndexOf('/') + 1).toLowerCase()
    }
  },
  methods: {

  },
  created () {
  }
}
</script>
