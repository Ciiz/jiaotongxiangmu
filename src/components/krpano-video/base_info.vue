<template>
        <div>
          <Form :modal="pano" v-if="pano.pano_type === 1" :label-width="80">
            <FormItem label="类型">
              <RadioGroup v-model="pano.pano_type">
                <Radio :label="1">全景图</Radio>
                <Radio :label="2">全景视频</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="标题">
              <Input v-model="pano.pano_name"></Input>
            </FormItem>
            <FormItem label="章号：">
              <InputNumber v-model="pano.sort"></InputNumber>
            </FormItem>
            <FormItem label="封面">
              <ImageUpload
                v-model="pano.img"
                :extra="{type: 'pano',token:$store.state.user.token}"
              ></ImageUpload>
            </FormItem>
            <!-- <FormItem label="全景图">
              <ImageUploadList
                :action="baseUrl+'index.php/Teacher/Upload/upload_img'"
                :data="{type: 'pano_file'}"
                v-model="pano.pano_img_url"
              ></ImageUploadList>
            </FormItem> -->
          </Form>

          <Form :modal="pano"  :label-width="80">
            <FormItem label="类型">
              <RadioGroup v-model="pano.pano_type" >
                <Radio :label="1" disabled>全景图</Radio>
                <Radio :label="2" disabled>全景视频</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="标题">
              <Input v-model="pano.pano_name"></Input>
            </FormItem>
            <FormItem label="章号：">
              <InputNumber v-model="pano.sort"></InputNumber>
            </FormItem>
            <FormItem label="封面">
              <ImageUpload
                :action="baseUrl+'index.php/Teacher/Upload/upload_img'"
                v-model="pano.img"
                :data="{type: 'pano',token:$store.state.user.token}"
              ></ImageUpload>
            </FormItem>
            <FormItem label="视频">

              <FileUpload
                :fileObj="{url: pano.video_url, name: ''}"
                @on-change="(file)=>{pano.video_url = file.url;pano.file_name= file.name}"
                :extra="{type: 'pano.video',token:$store.state.user.token}"
                :format="['mp4']"
              >
              </FileUpload>
            </FormItem>
          </Form>
          <div>
            <Button style="float:right" @click="store" type="primary">保存</Button>
          </div>
        </div>
</template>
<script>
import { course_pano } from '@/api/common'
import ImageUploadList from '@/components/image-upload-list'
export default {
  props: {
    pano_id: '',
    course_id: ''
  },
  components: {
    ImageUploadList
  },
  data () {
    return {
      pano: {
        id: '',
        course_id: this.course_id,
        description: '',
        img: '',
        item_name: '',
        pano_img_count: 2,
        pano_img_url: '',
        pano_name: '',
        pano_type: 1,
        update_record: {},
        video_url: '',
        sort: 0
      }
    }
  },
  watch: {
    pano_id (n, o) {
      this.getInfo()
    }
  },
  methods: {
    getInfo () {
      if (this.pano_id) {
        course_pano(this.pano_id).then(res => {
          if (res.code === 200) {
            this.pano = res.data.pano
          }
        })
      } else {
        this.pano = {
          id: '',
          course_id: this.course_id,
          description: '',
          img: '',
          item_name: '',
          pano_img_count: 2,
          pano_img_url: '',
          pano_name: '',
          pano_type: 1,
          update_record: {},
          video_url: '',
          sort: 0
        }
      }
    },
    store () {
      this.saving = true
      let {
        id,
        course_id,
        description,
        img,
        pano_img_count,
        pano_img_url,
        pano_name,
        pano_type,
        video_url,
        sort
      } = this.pano
      this.axios.request({
        method: 'post',
        url: '/index.php/Teacher/Pano/update',
        params: { id: this.pano.id },
        data: {
          id,
          course_id,
          description,
          img,
          pano_img_count,
          pano_img_url: pano_img_url.split(','),
          file_url: pano_img_url.split(','),
          pano_name,
          pano_type,
          video_url,
          sort
        }
      }).then(res => {
        this.saving = false
        if (res.code === 200) {
          this.$Message.success(res.message)
          this.$emit('success')
        }
      }).catch(err => {
        console.error(err)
        this.saving = false
      })
    }
  },
  mounted () {
    this.getInfo()
  }
}
</script>
<style lang="less">

</style>
