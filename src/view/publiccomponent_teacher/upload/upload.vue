<template>
  <div>
    <Progress :percent="percent" v-if="progress_show && percent !== 0"></Progress>
    <Upload :ref="upload_file" :format="format" :max-size="maxsize" name='file' style="display:inline-block;"
      :action="action_url" :on-success="success" :on-progress='progress' :on-error="error" :before-upload="beforeupload"
      :on-remove="onremove" :on-format-error="formaterror" :on-exceeded-size="exceededsize" :show-upload-list="showlist"
      :data="data_type">
      <div v-if="krpano !== true">
        <Button type="primary">{{btnname}}</Button>
      </div>
      <div v-else>
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
    krpano: {
      default: false
    },
    showlist: { // 是否显示已上传文件列表
      type: Boolean,
      default: false
    },
    btnname: { // 上传按钮显示的名称
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
    },
    // needprogress: {
    //   type: Boolean,
    //   default: false
    // }
  },
  data () {
    return {
      upload_file_list: [],
      percent: 0,
      progress_show: false
    }
  },
  // created () {
  //   this.progress_show = this.needprogress
  // },
  methods: {
    progress (e, res) {

      this.progress_show = true
      if (this.progress_show) {
        this.percent = e.percent
      }
      if (e.percent === 100) {
        setTimeout(() => {
          this.progress_show = false
        }, 1000)
      }
    },
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
    success (res, file) {
      if (res.code === 200) {
        this.$Message.success('上传成功！')
        this.$emit('upload_file_success', res)
      }
    }
  },
  mounted () {
    this.upload_file_list = this.$refs.upload_file.fileList
  }
}
</script>
