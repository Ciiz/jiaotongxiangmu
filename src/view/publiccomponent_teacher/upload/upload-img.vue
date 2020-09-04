<template>
  <div>
    <Upload :ref="upload_file" :format="format" :max-size="maxsize" name='file' style="display:inline-block;"
      :action="action_url" :on-success="success" :on-error="error" :before-upload="beforeupload" :on-remove="onremove"
      :on-format-error="formaterror" :on-exceeded-size="exceededsize" :show-upload-list="showlist" :data="data_type">
      <div v-if="imgsrc !== '' && krpano === false">
        <img :src="imgsrc" width="100" />
      </div>
      <div v-else-if="imgsrc === '' && krpano === false">
        <Button icon="ios-cloud-upload-outline">{{btnname}}</Button>
      </div>
      <div v-else-if="krpano === true">
        <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
        <p>{{btnname}}（支持拖拽上传或者点击选择文件上传）</p>
      </div>
    </Upload>
  </div>
</template>
<script>
import upload_mixin from '_c/mixins/upload_mixin'
export default {
  mixins: [upload_mixin],
  props: {
    img_src: {
      default: ''
    },
    krpano: {
      default: false
    },
    showlist: { // 是否显示已上传文件列表
      type: Boolean,
      default: false
    },
    btnname: {
      type: String
    },
    upload_file: {
      type: String,
      default: 'upload_file'
    },
    format: { //  格式验证
      type: Array,
      default () {
        return {}
      }
    },
    maxsize: { // 文件大小限制
      type: Number,
      default: 307200
    },
    maxlength: { // 最多允许上传多少个文件
      type: Number,
      default: 1
    },
    data_type: {
      type: Object,
      token: String
    }
  },
  data () {
    return {
      imgsrc: '',
      data_src: '/index.php/api/Upload/upload_file',
      upload_file_list: []
    }
  },
  watch: {
    img_src (n) {
      this.imgsrc = n
    }
  },
  created () {
  },
  methods: {
    exceededsize (file) {
      this.$Notice.warning({
        title: '超过文件大小限制',
        desc: `文件：  ${file.name}  大小超过 ${this.maxsize / 1024} M, 请上传不超过 ${this.maxsize / 1024} M的文件`,
        duration: 5
      })
    },
    formaterror (file) {
      this.$Notice.warning({
        title: '文件格式不正确',
        desc: `文件： ${file.name}  格式有误 文件后缀名可以是 ${this.format.join(',')}`,
        duration: 5
      })
    },
    onremove (file) {
    },
    beforeupload (file) {
      const check = this.upload_file_list.length < this.maxlength
      if (!check) { this.$Message.error(`只能上传${this.maxlength}个文件`) }
      return check
    },
    error (error, file) {
      console.log(error)
    },
    success (res) {
      if (res.code === 200) {
        this.imgsrc = res.data.url
        this.$emit('upload_img_success', res)
      }
    }
  },
  mounted () {
    this.upload_file_list = this.$refs.upload_file.fileList
  }
}
</script>
