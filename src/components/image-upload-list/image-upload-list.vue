<template>
  <div>
    <div class="demo-upload-list" v-for="item in uploadList" :key="item.name">
      <template v-if="item.status === 'finished'">
        <img :src="item.url" />
        <div class="demo-upload-list-cover">
          <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
          <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
        </div>
      </template>
      <template v-else>
        <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
      </template>
    </div>
    <Upload
      :ref="'upload'"
      :show-upload-list="false"
      :default-file-list="defaultList"
      :on-success="handleSuccess"
      :format="['jpg','jpeg','png']"
      :max-size="1024*10"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      :before-upload="handleBeforeUpload"
      :data="extra"
      type="drag"
      :action="action_url"
      style="display: inline-block;width:58px;"
    >
      <div style="width: 58px;height:58px;line-height: 58px;">
        <Icon type="ios-camera" size="20"></Icon>
      </div>
    </Upload>
    <Modal  v-model="visible" footer-hide width="800">
      <img
        :src="imageUrl"
        v-if="visible"
        style="width: 100%"
      />
    </Modal>
  </div>
</template>
<script>
import upload_mixin from '_c/mixins/upload_mixin'
export default {
  mixins: [upload_mixin],
  props: {
    action: '',
    value: '',
    maxLength: {
      type: Number,
      default: 0
    },
    data: {
      type: Object,
      default: () => {
        return {
          type: 'default'
        }
      }
    },
    extra: {
      type: Object,
      token: String
    },
    wh_scale: {// 宽高比例
      type: Object,
      default: () => {
        return {
          height: null,
          width: null
        }
      }
    }
  },
  data () {
    return {
      defaultList: [
      ],
      uploadList: [],
      imageUrl: '',
      visible: false,
      upload: 'upload' + this._uid
    }
  },
  watch: {
    value (n, o) {
      this.$refs.upload.fileList.splice(0, this.$refs.upload.fileList.length)
      let new_list = n.split(',').map((item, index) => {
        return {
          name: index,
          url: item,
          status: 'finished'
        }
      })
      this.$refs.upload.fileList = n ? new_list : []
      this.uploadList = this.$refs.upload.fileList
    }
  },
  methods: {
    handleView (name) {
      this.imageUrl = name
      this.visible = true
    },
    handleRemove (file) {
      const fileList = this.$refs.upload.fileList
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
    },
    handleSuccess (res, file) {
      if (res.code === 200) {
        file.url = res.data.url
        file.name = res.data.url
        let url_strs = this.uploadList.map(item => { return item.url }).join(',')
        this.$emit('input', url_strs)
      } else {
        this.$Message.error('上传是啊比')
      }
    },
    handleFormatError (file) {
      this.$Notice.warning({
        title: 'The file format is incorrect',
        desc:
            'File format of ' +
            file.name +
            ' is incorrect, please select jpg or png.'
      })
    },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: 'Exceeding file size limit',
        desc: 'File  ' + file.name + ' is too large, no more than 2M.'
      })
    },
    handleBeforeUpload (file) {
      return this.checkImage(file)
    },
    checkImage  (file) {
      let self = this
      return new Promise(function (resolve, reject) {
        const check = self.uploadList.length < self.maxLength || self.maxLength === 0
        if (!check) {
          self.$Notice.warning({
            title: `最多上传${self.maxLength}张图片！`
          })
          reject(new Error(`最多上传${self.maxLength}张图片！`))
        }
        let filereader = new FileReader()

        filereader.onload = e => {
          let src = e.target.result
          const image = new Image()
          image.onload = function () {
            let width = self.wh_scale.width
            let height = self.wh_scale.height
            if (width && height) {
              if ((width / height) === (this.width / this.height)) {
                resolve()
              } else {
                self.$Notice.warning({
                  title: `请上传宽高比例为${width}:${height}的图片`
                })
                reject(new Error(`请上传宽高比例为${width}:${height}的图片`))
              }
            } else {
              resolve()
            }
          }
          image.onerror = reject
          image.src = src
        }
        filereader.readAsDataURL(file)
      })
    }
  },
  mounted () {
    let init_list = this.value.split(',').map((item, index) => {
      return {
        name: index,
        url: item,
        status: 'finished'
      }
    })
    this.$refs.upload.fileList = this.value ? init_list : []
    this.uploadList = this.$refs.upload.fileList
  }
}
</script>
<style>
  .demo-upload-list {
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
    margin-right: 4px;
  }
  .demo-upload-list img {
    width: 100%;
    height: 100%;
  }
  .demo-upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.6);
  }
  .demo-upload-list:hover .demo-upload-list-cover {
    display: block;
  }
  .demo-upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
</style>
