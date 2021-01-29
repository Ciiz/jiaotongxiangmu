<template>
  <div class="note_video">
    <!-- <div class="note_video_center"> -->
    <video controls :src="vedioSrc" style="width:1030px"></video>
    <!-- <div class="student-note">
        <notePreview :id="this.id" :courseware_id="this.courseware_id" :currentIdIndex="''"
          @unshowPreviewNote="unshowPreviewNote" v-if="previewNote"></notePreview>
        <div style="width:100%;height:100%;position:relative">
          <div v-if="note_list.length==0" style="margin:20px;font-size:14px">该课程暂无笔记</div>
          <div class="ab-scroll2">
            <ul>
              <li v-for="(item,index) in note_list" :key="index" class="note-li">
                <div @click="showNote(item)">
                  <span class="black-b" style="font-weight:400">{{index+1}}、{{item.title}}</span>
                  <span class="gray-c8 note-detail">{{item.content}}</span>
                </div>
                <div>
                  <span
                    style="color:#BBBBBB;font-size:14px">{{moment(item.created_at * 1000).format('YYYY-MM-DD HH:mm')}}</span>
                  <Icon type="md-close" color="#FF3333" size="24" style="margin-left:20px;cursor:pointer"
                    @click="showDeleteNote(item)" />
                </div>
              </li>
            </ul>
          </div>
        </div>
        <Modal class="noteDeleteModal" v-model="modal_del" title="删除笔记" @on-ok="deleteNote">
          <p>是否确定删除当前笔记？</p>
        </Modal>
      </div> -->
    <!-- </div> -->

    <span class="red-EE" style="float:right;cursor:pointer" @click="modal4=true" v-if="userType===1">删除</span>
    <Button type="primary" style="float:right;cursor:pointer" @click="modal1=true" v-if="userType===2">笔记</Button>
    <!-- <Button type="primary" class="blue-cg" style="float:right;cursor:pointer" @click="modal1=true"
      v-if="userType===2">笔记</Button> -->
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
// import notePreview from '@/view/class_common/notes/note_preview'
import courseNote from '@/view/class_common/notes/course_note'
export default {
  components: { courseNote },
  props: { vedioSrc: '', vedioName: '', upload_courseware_id: '', vedioClass_id: '' },
  data () {
    return {
      modal1: false,
      modal4: false,
      userType: this.$store.state.user.userInfo.userType,
      // previewNote: false,
      // delId: '',
      // modal_del: false,
      // note_list: [],
      // page: 1,
      // page_size: 10000,
      // keyword: '',
      // search_type: 0,
      // sort_type: 0,
      // sort_order: 'desc',
      // loading: false,
      // id: '',
      // courseware_id: ''
    }
  },
  methods: {
    // unshowPreviewNote () {
    //   this.previewNote = false
    //   this.getData()
    // },
    // getData () {
    //   this.loading = true
    //   this.axios.request({
    //     url: '/index.php/student/studentNotes/get_courseware_notes',
    //     method: 'get',
    //     params: {
    //       courseware_id: this.upload_courseware_id
    //     }
    //   }).then(res => {
    //     console.log(res);
    //     if (res.code === 200) {
    //       this.note_list = res.message.student_notes_list
    //     }
    //     this.loading = false
    //   })
    // },
    // showNote (val) {
    //   this.id = val.id
    //   this.courseware_id = val.courseware_id
    //   this.previewNote = true
    // },
    // showDeleteNote (val) {
    //   this.modal_del = true
    //   this.delId = val.id
    // },
    // deleteNote () {
    //   this.axios.request({
    //     url: '/index.php/student/studentNotes/delete',
    //     method: 'post',
    //     data: {
    //       id: this.delId
    //     }
    //   }).then(res => {
    //     if (res.code === 200) {
    //       this.getData()
    //       this.$Message.success('删除成功')
    //     }
    //   })
    // },
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
  },
  mounted () {
    // if (this.userType === 2) {
    //   this.getData()
    // }

  }
}
</script>
<style lang='less' scoped>
.vedioDeleteModal /deep/.ivu-modal-wrap {
  z-index: 6000 !important;
  // background-color: red;
}
// .note_video {
//   .note_video_center {
//     display: flex;
//     .ab-scroll2 {
//       width: 100%;
//       height: 100%;
//     }
//   }
// }
</style>
