<template>
    <div class="iconUpload">
      <Row>
          <Upload
              :ref="uploadRef"
              :show-upload-list="false"
              :on-success="handleSuccess"
              :format="format"
              :on-format-error="handleFormatError"
              :on-exceeded-size="handleMaxSize"
              :name="name"
              :max-size="maxSize"
              :before-upload="handleBeforeUpload"
              :action="action_url"
              :data="extra"
              >
            <Button size="small" class="m-upload-btn">上传附件</Button>
          </Upload>
          <ul class="m-ivu-upload-list">
            <li v-for="(item,index) in uploadList" :key="index">
              <template v-if="item.status === 'finished'">
                <span style="flex:1">
                  <span style="color:#888888">已上传附件： </span>
                  <a :href="item.url" target="blank" style="color:#3699FF">{{item | filtFileName}}</a>
                </span>
                <Icon type="ios-close" color="#888888" @click="handleRemove(item)"/>
              </template>
              <template v-else>
                  <Progress :percent="item.percentage" hide-info></Progress>
              </template>
            </li>
          </ul>
      </Row>
    </div>
</template>
<script>
// 先做单个的
import { Toast } from 'mint-ui'
import upload_mixin from '_c/mixins/upload_mixin'
export default {
  mixins: [upload_mixin],
  name: 'fileUpload',
  data () {
    return {
      uploadList: [],
      uploadRef: `upload`
      // uploadRef: `upload_${Math.floor((Math.random() * 100) + 1)}`
    }
  },
  props: {
    // 编辑回显数据
    fileObj: {
      type: Object,
      default: () => {
        return {
          url: '',
          name: ''
        }
      }
    },
    name: 'file',
    maxSize: 30 * 1024,
    extra: {
      type: Object,
      token: String
    },
    format: {
      type: Array,
      default: () => {
        return ['mp4', 'pdf', 'docx', 'doc', 'xls', 'zip', 'rar', 'png', 'jpg', 'jpeg', 'pptx']
      }
    },
    maxNum: {
      type: Number,
      default: 1
    }
  },
  filters: {
    filtFileName (file) {
      if (file.name) {
        return file.name
      } else {
        return (file.url.substr(file.url.lastIndexOf('/') + 1)).toLowerCase()
      }
    }
  },
  watch: {
    fileObj (val, oldVal) {
      if (val.url) {
        this.$refs[this.uploadRef].fileList.splice(0, this.$refs[this.uploadRef].fileList.length)
        this.$refs[this.uploadRef].fileList.push({
          url: val.url,
          name: val.name !== '' ? val.name : '',
          status: 'finished'
        })
      } else {
        this.$refs[this.uploadRef].fileList.splice(0, this.$refs[this.uploadRef].fileList.length)
      }
    }
  },
  methods: {
    // ==================文件上传==============
    handleRemove (file) {
      const fileList = this.$refs[this.uploadRef].fileList
      this.$refs[this.uploadRef].fileList.splice(fileList.indexOf(file), 1)
      this.$emit('on-change', { url: '', name: '' })
    },
    handleSuccess (res, file) {
      if (res.code === 200) {
        file.url = res.data.url
        file.name = res.data.file_name
        file.status = 'finished'
        this.$emit('on-change', { url: file.url, name: file.name })
        Toast({
          message: '上传成功！',
          duration: 2000
        })
      } else {
        const fileList = this.$refs[this.uploadRef].fileList
        this.$refs[this.uploadRef].fileList.splice(fileList.indexOf(file), 1)
        Toast({
          message: res.message,
          duration: 2000
        })
      }
    },
    handleFormatError (file) {
      Toast({
        message: `${file.name}  格式错误,</br>只能上传${this.format.join(' / ')}格式的文件`,
        duration: 2000
      })
    },
    handleMaxSize (file) {
      Toast({
        message: `文件  ${file.name} 太大了, 不能超过 ${this.maxSize / 1024}M`,
        duration: 2000
      })
    },
    handleBeforeUpload () {
      const check = this.uploadList.length < this.maxNum
      if (!check) {
        Toast({
          message: `最多只能上传${this.maxNum}个文件, 请先移除原来的文件`,
          duration: 2000
        })
      }
      return check
    }
  },
  mounted () {
    this.uploadList = this.$refs[this.uploadRef].fileList
    if (this.fileObj.url) {
      this.uploadList.push({
        url: this.fileObj.url,
        name: this.fileObj.name ? this.fileObj.name : '',
        status: 'finished'
      })
    }
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
  .iconUpload{
    margin-top:10px;
  }
  .m-upload-btn{
    padding: 0.07rem 0.28rem;
    // line-height: 6rem;
    border-radius: 0.03rem;
    border:1px solid #AAAAAA;
    font-size: 0.26rem;
    color: #888888;
    outline: none;
    margin-left: 0.3rem;
  }
  .m-ivu-upload-list{
    margin-top: 0.24rem;
    border: 1px solid #EEEEEE;
  }
  .m-ivu-upload-list>li{
    padding: 0.31rem;
    font-size: 0.26rem;
    display:flex
  }
  .m-ivu-upload-list>li>span{
    overflow: hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
    line-height: 0.6rem;
  }
  .m-ivu-upload-list>li>i{
    font-size: 0.6rem;
  }
</style>
