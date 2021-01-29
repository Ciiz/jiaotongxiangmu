<template>
  <div class="editor-wrapper">
    <div :id="editorId" style="box-shadow: 1px 2px 7px #ccc;margin-bottom: 10px;"></div>
    <div :id="`${editorId}_c`" :style="{height: `${height}px`}"></div>
  </div>
</template>

<script>
import Editor from 'wangeditor'
import 'wangeditor/release/wangEditor.min.css'
import { oneOf } from '@/libs/tools'
export default {
  name: 'Editor',
  props: {
    value: {
      type: String,
      default: ''
    },
    height: {
      type: Number,
      default: 400
    },
    editorReady: {// 处理数据被获取到就初始化,会导致绑定属性v-model设置不了初始值
      type: Boolean,
      default: true
    },
    /**
     * 绑定的值的类型, enum: ['html', 'text']
     */
    valueType: {
      type: String,
      default: 'html',
      validator: (val) => {
        return oneOf(val, ['html', 'text'])
      }
    },
    /**
     * @description 设置change事件触发时间间隔
     */
    changeInterval: {
      type: Number,
      default: 500
    },
    /**
     * @description 是否开启本地存储
     */
    cache: {
      type: Boolean,
      default: false
    },
    uploadImgServer: {
      type: String,
      default: ''
    },
    uploadFileName: {
      type: String,
      default: 'file'
    },
    is_init: false,
    editable: true
  },
  computed: {
    editorId () {
      return `editor${this._uid}`
    }
  },
  data () {
    return {
      el: null
    }
  },
  methods: {
    setHtml (val) {
      this.editor.txt.html(val)
    },
    getHtml (val) {
      return this.editor.txt.html()
    },
    init () {
      this.editor = new Editor(`#${this.editorId}`, `#${this.editorId}_c`)
      this.editor.customConfig.onchange = (html) => {
        let text = this.editor.txt.text()
        if (this.cache) localStorage.editorCache = html
        this.$emit('input', this.valueType === 'html' ? html : text)
        this.$emit('on-change', html, text)
      }
      this.editor.customConfig.onchangeTimeout = this.changeInterval
      this.editor.customConfig.uploadImgServer = this.uploadImgServer ? this.uploadImgServer : `${this.fileDomain}/Service/index.php/api/upload/upload_file`
      this.editor.customConfig.uploadFileName = this.uploadFileName
      this.editor.customConfig.uploadImgHeaders = {
        'Accept': '*/*'
        // 'Authorization': 'Bearer ' + token // 头部token
      }
      // 下面是最重要的的方法
      this.editor.customConfig.uploadImgHooks = {
        before: function (xhr, editor, files) {
          // 图片上传之前触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件

          // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
          // return {
          //   prevent: true,
          //   msg: '放弃上传'
          // }
        },
        success: function (xhr, editor, result) {
          // 图片上传并返回结果，图片插入成功之后触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
          this.imgUrl = Object.values(result.data.url).toString()
        },
        fail: function (xhr, editor, result) {
          // 图片上传并返回结果，但图片插入错误时触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
        },
        error: function (xhr, editor) {
          // 图片上传出错时触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
        },
        timeout: function (xhr, editor) {
          // 图片上传超时时触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
        },

        // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
        // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
        customInsert: function (insertImg, result, editor) {
          // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
          // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果
          if (result.code === 200) {
            insertImg(result.data.url)
          } else {
            alert('上传图片失败:' + result.data.message)
          }
        }
      }
      // 表情面板可以有多个 tab ，因此要配置成一个数组。数组每个元素代表一个 tab 的配置
      this.editor.customConfig.emotions = [
        {
          // tab 的标题
          title: '默认',
          // type -> 'emoji' / 'image'
          type: 'image',
          // content -> 数组
          content: [
            {
              alt: '[坏笑]',
              src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/50/pcmoren_huaixiao_org.png'
            },
            {
              alt: '[舔屏]',
              src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/40/pcmoren_tian_org.png'
            }
          ]
        }
      ]

      // create这个方法一定要在所有配置项之后调用
      this.editor.create()
      this.editor.$textElem.attr('contenteditable', this.editable)// 设置可便捷状态
      // 如果本地有存储加载本地存储内容
      let html = this.value
      if (this.cache && this.value === '') {
        html = localStorage.editorCache
      }
      if (html) this.editor.txt.html(html)
      // this.el = document.getElementById(`${this.editorId}_c`)
    }
  },
  watch: {
    value (n, o) {
      if (this.is_init) {
        setTimeout(() => { // 防止多个编辑器在同一个页面的时候，一个初始化后，后面的不能初始化(监听value时)
          this.$emit('update:is_init', false)
        }, 500)
        this.setHtml(n)
      }
    },
    editable (n, o) {
      this.editor.$textElem.attr('contenteditable', n)
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="less">
.w-e-menu {
  z-index: 2 !important;
}
.w-e-text-container {
  z-index: 1 !important;
}
.editor-wrapper {
  margin-top: 15px;
  border: 1px solid #ccc;
}
</style>
