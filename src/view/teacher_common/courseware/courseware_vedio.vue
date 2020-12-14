<template>
  <div>
    <video controls :src="vedioSrc" style="width:100%"></video>
    <span class="red-EE" style="float:right;cursor:pointer" @click="modal4=true" v-if="userType===1">删除</span>
    <span class="blue-cg" style="float:right;cursor:pointer" @click="modal1=true" v-if="userType===2">笔记</span>
    <div style="clear:both"></div>
    <Modal v-model="modal4" title="删除视频" class="vedioDeleteModal" @on-ok="deleteVedio1">
      <p>确定删除当前视频？</p>
    </Modal>
    <Modal v-model="modal1" title="课件笔记" width="700" class="vedioDeleteModal" @on-ok="deleteVedio1" footer-hide
      draggable>
      <courseNote v-if="modal1===true" :upload_courseware_id="upload_courseware_id" style="height:600px"></courseNote>
    </Modal>
  </div>
</template>
<script>

import courseNote from '@/view/class_common/notes/course_note'
export default {
  components: { courseNote },
  props: { vedioSrc: '', vedioName: '', upload_courseware_id: '', vedioClass_id: '' },
  data () {
    return {
      modal1: false,
      modal4: false,
      userType: this.$store.state.user.userInfo.userType
    }
  },
  methods: {
    deleteVedio1 () {
      this.axios.request({
        method: 'post',
        url: '/index.php/Teacher/Courseware/delete_video',
        data: {
          courseware_id: this.upload_courseware_id,
          file_name: this.vedioName,
          class_id: this.vedioClass_id
        }
      }).then(res => {
        if (res.code === 200) {
          this.$Message.success('删除成功')
          this.$emit('closeVedioModal')
        } else {
          this.$Message.error(res.message)
        }
      })
    }
  }
}
</script>
<style>
.vedioDeleteModal .ivu-modal-wrap {
  z-index: 5010 !important;
}
</style>
