<template>
  <div>
    <img :src="imgsrc" style="height:80px;cursor:pointer" @click="toggleShow" v-if="imgsrc!==''"/>
    <Icon type="ios-camera" size="30" style="margin-left:10px;cursor:pointer" @click="toggleShow" v-if="imgsrc===''"></Icon>
    <my-upload
    style="z-index: 100001"
      field="file"
      @crop-success="cropSuccess"
      @crop-upload-success="cropUploadSuccess"
      @crop-upload-fail="cropUploadFail"
      v-model="show"
      :width="imgWidth"
      :height="imgHeight"
      :url="action_url"
      :params="params"
      img-format="png"
    >
    </my-upload>
    <div v-if="size_editable">
      大小：<InputNumber v-model="imgWidth"  placeholder="宽" style="width: 100px"></InputNumber> x <InputNumber v-model="imgHeight" placeholder="高" style="width: 100px"></InputNumber>
    </div>
  </div>
</template>
<script>
import myUpload from 'vue-image-crop-upload'
import upload_mixin from '_c/mixins/upload_mixin'
export default {
  mixins: [upload_mixin],
  props: {
    imgsrc: '',
    value: '',
    action: '',
    params: {
      type: Object,
      token: String
    },
    size_editable: {
      type: Boolean,
      default: true
    },
    imgWidth: '',
    imgHeight: ''
  },
  watch: {
    value (n, o) {}
  },
  components: {
    'my-upload': myUpload
  },
  data () {
    return {
      show: false,
      imgDataUrl: '' // the datebase64 url of created imags
    }
  },
  methods: {
    toggleShow () {
      this.show = !this.show
    },
    /**
       * crop success
       *
       * [param] imgDataUrl
       * [param] field
       */
    cropSuccess (imgDataUrl, field) {
      console.log('-------- crop success --------')
      this.imgDataUrl = imgDataUrl
    },
    /**
       * upload success
       *
       * [param] jsonData   服务器返回数据，已进行json转码
       * [param] field
       */
    cropUploadSuccess (jsonData, field) {
      console.log('-------- upload success --------')
      console.log(jsonData)
      console.log('field: ' + field)
      this.$emit('success', jsonData.data.url)
    },
    /**
       * upload fail
       *
       * [param] status    server api return error status, like 500
       * [param] field
       */
    cropUploadFail (status, field) {
      // this.$Message.error('上传失败'.field)
      console.log('-------- upload fail --------')
      console.log(status)
      console.log('field: ' + field)
    }
  }
}
</script>
