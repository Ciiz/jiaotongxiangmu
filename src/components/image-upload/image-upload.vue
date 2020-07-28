<template>
    <div class="iconUpload">
      <Row>
        <Col span="2">
          <div class="demo-upload-list"  v-for="(item,index) in uploadList" :key="index">
            <template>
              <img :src="item.response.data.url" :onerror="errorImg01">
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item.response.data.url)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
              </div>
            </template>
          </div>
        <input type="text" style="display: none" :value="value">
        </Col>
        <Col span="2" v-show="uploadList.length === 0">
          <Upload
                  ref="upload"
                  :show-upload-list="false"
                  :on-success="handleSuccess"
                  :format="format"
                  :before-upload="handleBeforeUpload"
                  type="drag"
                  :action="action_url"
                  :name="name"
                  :data="extra"
                  style="display: inline-block;widt h:58px;">
              <div style="width: 58px;height:58px;line-height: 58px;">
                  <Icon type="ios-camera" size="20"></Icon>
              </div>
          </Upload>
        </Col>
      </Row>
      <Modal title="查看" v-model="visible" footer-hide width="800">
        <img :src="imageUrl" v-if="visible" style="width: 100%" :onerror="errorImg01">
      </Modal>
    </div>
</template>
<script>
import { messageAll } from './text-local'
import upload_mixin from '_c/mixins/upload_mixin'
export default {
  name: 'imageUpload',
  mixins: [upload_mixin],
  data () {
    return {
      messageAllData: messageAll,
      imgName: '',
      imageUrl: '',
      visible: false,
      uploadList: [],
      resultUrl: ''
    }
  },
  props: {
    // 编辑回显数据
    value: {
      type: String,
      default: ''
    },
    action: '',
    name: '',
    extra: {
      type: Object,
      token: String
    },
    format: {
      type: Array,
      default: () => { return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'pcd', 'webp'] }
    }
  },
  watch: {
    value: {
      handler: function (val, oldVal) {
        if (val) {
          if (val) {
            this.uploadList = [{
              response: {
                data: {
                  url: val,
                  file_name: ''
                }
              }
            }]
          } else {
            this.uploadList = []
          }
          this.resultUrl = val
        }
      },
      immediate: true
    },
    resultUrl (val) {
      this.$emit('input', val)
    }
  },
  methods: {
    handleView (url) {
      this.imageUrl = url
      this.visible = true
    },
    handleRemove (file) {
      const fileList = this.$refs.upload.fileList
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
      this.$nextTick(() => {
        this.uploadList = []
        this.resultUrl = ''
      })
    },
    handleSuccess (res, file) {
      if (res.code === 200) {
        this.$nextTick(() => {
          this.uploadList = this.$refs.upload.fileList
          this.resultUrl = this.uploadList[0].response.data.url
        })
      } else {
        this.$refs.upload.fileList.splice(0, 1)
        this.$Message.error(res.message)
        this.resultUrl = ''
      }
    },
    handleBeforeUpload (file) {
      // 文件类型校验
      let type = (file.name.substr(file.name.lastIndexOf('.'))).toLowerCase() // .jpg
      let imgType = type.split('.')[1] // jpg
      let checkType = this.format.some((item) => {
        return item === imgType
      })
      if (!checkType) {
        this.$Message.info({
          content: `只支持格式为${this.format.join(',')}的图片`,
          duration: 10
        })
        return false
      }
      // 文件大小校验
      const checkMax = file.size < messageAll.imgLimitBytes
      if (!checkMax) {
        this.$Message.info({
          content: messageAll.imgFileSizeError
        })
        return false
      }
      // 只能上传一张图片，暂时以另一张方式代替
      const check = this.uploadList.length < 1
      if (!check) {
        this.$Message.info({
          content: messageAll.imgMaxNumberMsg
        })
      }
      return check
    }
  },
  mounted () {
    // this.uploadList = this.$refs['upload'].fileList
  }
}
</script>
<style lang="less" scoped>
  .demo-upload-list{
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
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 4px;
  }
  .demo-upload-list img{
    width: 100%;
    height: 100%;
  }
  .demo-upload-list-cover{
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
  }
  .demo-upload-list:hover .demo-upload-list-cover{
    display: block;
  }
  .demo-upload-list-cover i{
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
</style>
