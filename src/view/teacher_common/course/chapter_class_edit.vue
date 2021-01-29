<template>
  <div class="modal-content-default">
    <Form :modal="chapter_class" :label-width="100">
      <FormItem label="序号">
        <InputNumber :min="1" v-model="chapter_class.sort"></InputNumber>
      </FormItem>
      <FormItem label="章节名称">
        <Input v-model="chapter_class.title"></Input>
      </FormItem>
      <FormItem label="内容">
        <Editor v-model="chapter_class.content" :is_init.sync="editor_init" :height="300">
        </Editor>
      </FormItem>
      <FormItem label="文件" style="margin-bottom:40px">
        <FileUpload :fileObj="{url: chapter_class.file_url, name: chapter_class.file_name}"
          @on-change="(file)=>{chapter_class.file_url = file.url;chapter_class.file_name= file.name}"
          :extra="{type: 'chapter',token:$store.state.user.token}"
          :format="['mp4','pdf','ppt','pptx','xlsx','xls','doc','docx']">
        </FileUpload>
      </FormItem>
    </Form>
    <div class="modal-footer">
      <Button type="primary" @click="save">保存</Button>
    </div>
    <Spin v-if="loading" fix></Spin>
  </div>
</template>

<script>
import { save_chapter_class } from '@/api/data'
import { chapter_class_show } from '@/api/common'
export default {
  components: {
  },
  props: {
    id: ''
  },
  data () {
    return {
      chapter_class: {},
      loading: false,
      editor_init: false
    }
  },
  watch: {
    id (newVla, oldVal) {
      this.getInfo()
    }
  },
  methods: {
    getInfo () {
      this.loading = true
      this.editor_init = false
      chapter_class_show(this.id).then(res => {
        if (res.code === 200) {
          this.chapter_class = res.data.chapter_class
        }
        this.loading = false
        this.editor_init = true
      })
    },
    save () {
      if (this.chapter_class.file_url === '') {
        this.$Message.error('请上传文件')
      } else {
        save_chapter_class(this.chapter_class).then(res => {
          if (res.code === 200) {
            this.$Message.success(res.message)
            this.$emit('success')
          }
        })
      }
    }
  },
  mounted () {
    this.getInfo()
  }
}
</script>

<style lang="less" scoped>
</style>
