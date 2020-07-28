<template>
  <div class="m-noteList flex-contain">
    <mt-header :title="course_name+'笔记'">
      <router-link to="/courseList" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <div class="m-noteList-contain hideScroll">
      <div v-if="list.length===0" class="m-noteList-notename">该课程暂无笔记</div>
      <div v-for="item in list" :key="item.courseware_id">
        <div class="m-noteList-notename">{{item.courseware_name}}</div>
        <ul class="m-noteList-ul">
          <li v-for="(item2,index2) in item.notes" :key="index2" @click="showNote(item2)">
            <div style="flex:1;padding-right:0.2rem">
              <span>{{item2.title}}</span>
            </div>
            <div>
              <img src="@/assets/images/mobile_student/note-jt.png"/>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { get_course_notes } from '@/api/student'
export default {
  data () {
    return {
      list: []
    }
  },
  computed: {
    teacher_course_id () {
      return this.$route.query.teacher_course_id
    },
    course_name () {
      return this.$route.query.course_name
    }
  },
  watch: {

  },
  methods: {
    getData () {
      get_course_notes({
        page: 1,
        page_size: 1000,
        teacher_course_id: this.teacher_course_id,
        search_type: 0,
        sort_order: 'desc',
        sort_type: 0,
        keyword: ''
      })
        .then(res => {
          if (res.code === 200) {
            this.list = res.data.list
          }
        })
    },
    showNote (item) {
      this.$router.push({ name: 'noteDetail', query: { id: item.id, courseware_id: item.courseware_id } })
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
