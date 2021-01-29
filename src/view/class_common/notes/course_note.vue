<template>
  <div class="student-note">
    <notePreview :id="this.id" :courseware_id="this.courseware_id" :currentIdIndex="''"
      @unshowPreviewNote="unshowPreviewNote" v-show="previewNote"></notePreview>
    <div style="width:100%;height:100%;position:relative">
      <div v-show="list.length===0" style="margin:20px;font-size:14px">该课程暂无笔记</div>
      <div class="ab-scroll">
        <ul>
          <li v-for="(item,index) in list" :key="index" class="note-li">
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
  </div>
</template>
<script>
import notePreview from '@/view/class_common/notes/note_preview'
export default {
  components: { notePreview },
  props: { upload_courseware_id: '' },
  data () {
    return {
      previewNote: false,
      delId: '',
      modal_del: false,
      list: [],
      page: 1,
      page_size: 10000,
      keyword: '',
      search_type: 0,
      sort_type: 0,
      sort_order: 'desc',
      loading: false,
      id: '',
      courseware_id: ''
    }
  },
  watch: {
    upload_courseware_id (n, o) {
      this.getData()
    }
  },
  methods: {
    unshowPreviewNote () {
      this.previewNote = false
      this.getData()
    },
    getData () {
      this.loading = true
      this.axios.request({
        url: '/index.php/student/studentNotes/get_courseware_notes',
        method: 'get',
        params: {
          courseware_id: this.upload_courseware_id
        }
      }).then(res => {
        console.log(res);

        if (res.code === 200) {
          this.list = res.message.student_notes_list
        }
        this.loading = false
      })
    },
    showNote (val) {
      this.id = val.id
      this.courseware_id = val.courseware_id
      this.previewNote = true
    },
    showDeleteNote (val) {
      this.modal_del = true
      this.delId = val.id
    },
    deleteNote () {
      this.axios.request({
        url: '/index.php/student/studentNotes/delete',
        method: 'post',
        data: {
          id: this.delId
        }
      }).then(res => {
        if (res.code === 200) {
          this.getData()
          this.$Message.success('删除成功')
        }
      })
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
<style>
</style>
