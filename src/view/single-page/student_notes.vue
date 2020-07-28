<template>
<div class="student-note">
  <notePreview :id="this.id" :courseware_id="this.courseware_id" :currentIdIndex="currentIdIndex" @unshowPreviewNote="unshowPreviewNote" @changeNote="changeNote" v-show="previewNote"></notePreview>
  <div style="width:100%;height:100%;position:relative">
    <div v-show="list.length===0" style="margin:20px;font-size:14px">该课程暂无笔记</div>
    <div class="ab-scroll">
      <div v-for="item in list" :key="item.courseware_id" class="ul-list">
        <div class="black-b">{{item.courseware_name}}</div>
        <ul>
          <li v-for="(item2,index2) in item.notes" :key="item2.id" class="note-li">
            <div @click="showNote(item2)">
              <span class="black-b" style="font-weight:400">{{index2+1}}、{{item2.title}}</span>
              <!-- <span class="gray-c8 note-detail">{{item2.content}}</span> -->
            </div>
            <div>
              <span style="color:#BBBBBB;font-size:14px">{{moment(item2.created_at * 1000).format('YYYY-MM-DD HH:mm')}}</span>
              <Icon type="md-close" color="#FF3333" size="24" style="margin-left:20px;cursor:pointer" @click="showDeleteNote(item2)"/>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
   <Modal
        v-model="modal1"
        title="删除笔记"
        @on-ok="deleteNote">
        <p>是否确定删除当前笔记？</p>
    </Modal>
</div>
</template>
<script>
import { get_course_notes } from '@/api/student'
import notePreview from '@/view/class_common/notes/note_preview'
export default{
  components: { notePreview },
  data () {
    return {
      currentIdIndex: '',
      previewNote: false,
      delId: '',
      modal1: false,
      list: [],
      page: 1,
      page_size: 10000,
      keyword: '',
      search_type: 0,
      sort_type: 0,
      sort_order: 'desc',
      loading: false,
      id: '',
      courseware_id: '',
      idList: []
    }
  },
  computed: {
    courseId () {
      return this.$store.state.user.courseData.teacher_course_id
    }
  },
  watch: {
    courseId (n, o) {
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
      this.idList = []
      get_course_notes({
        page: this.page,
        page_size: this.page_size,
        teacher_course_id: this.courseId,
        search_type: this.search_type,
        keyword: this.keyword,
        sort_type: this.sort_type,
        sort_order: this.sort_order
      })
        .then(res => {
          if (res.code === 200) {
            this.list = res.data.list
            for (let i = 0; i < res.data.list.length; i++) {
              for (let j = 0; j < res.data.list[i].notes.length; j++) {
                let a = { id: res.data.list[i].notes[j].id, courseware_id: res.data.list[i].courseware_id }
                this.idList.push(a)
              }
            }
          }
          this.loading = false
        })
    },
    showNote (val) {
      this.id = val.id
      this.courseware_id = val.courseware_id
      for (let i = 0; i < this.idList.length; i++) {
        if (this.idList[i].id === val.id && this.idList[i].courseware_id === val.courseware_id) {
          this.currentIdIndex = i
        }
      }
      this.previewNote = true
    },
    changeNote (i) {
      if (i < 0) {
        this.$Message.error('已经是第一篇了')
      } else if (i >= this.idList.length) {
        this.$Message.error('已经是最后一篇了')
      } else {
        this.id = this.idList[i].id
        this.courseware_id = this.idList[i].courseware_id
        this.currentIdIndex = i
      }
    },
    showDeleteNote (val) {
      this.modal1 = true
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
