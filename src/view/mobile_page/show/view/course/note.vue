<template>
  <div class="m-live-note flex-contain">
    <div class="m-live-note-list hideScroll">
      <div v-for="(item,index) in noteList" :key="index" class="m-live-note-item">
        <span><input type="text" v-model="item.title"/></span>
        <Icon type="ios-arrow-forward" />
      </div>
    </div>
    <div class="m-live-note-bottom">添加笔记</div>
  </div>
</template>
<script>


export default {
  data () {
    return {
      noteList:[]
    }
  },
  props:{
    courseware_id:''
  },
  watch: {
    courseware_id(){
      this.getNotesData()
    }
  },
  computed: {

  },
  methods: {
    getNotesData () {
      if (this.courseware_id === '') {
        return
      }
      this.axios.request({
        url: '/index.php/student/studentNotes/get_courseware_notes',
        method: 'get',
        params: {
          courseware_id: this.courseware_id
        }
      }).then(res => {
        if (res.code === 200) {
          this.noteList = res.message.student_notes_list
        }
      })
    },
  },
  mounted () {
    this.getNotesData()
  }
}
</script>
<style>
 
</style>
