<template>
  <div class="m-chapterInfoT">
    <Tree :data="chapter_class_list" class="m-tree" :render="renderContent" children-key="child" style="width:100%"
      v-if="course_type&&course_type.toString() === '1'"></Tree>
    <div class="m-pano" v-if="course_type&&course_type.toString() === '2'">
      <div v-for="(item,index) in chapter_class_list" :key="index" class="m-pano-item" @click="showDetail(item,2)">
        <div>
          <img :src="item.img" />
        </div>
        <div class="m-pano-item-name">{{item.pano_name}}</div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  data () {
    return {
      chapter_class_list: [],
      userType: this.$store.state.user.userInfo.userType
    }
  },
  props: {
    teacher_course_id: '',
    course_id: '',
    course_type: '',
    course_name: '',
    showProgress: ''
  },
  watch: {
    course_id () {
      this.getData()
    }
    // teacher_course_id () {
    //   this.getData()
    // }
  },
  computed: {

  },
  methods: {
    getData () {
      if (!this.course_id) return
      this.axios.request({
        method: 'get',
        url: '/teacher/course/getChapterClassList',
        params: {
          course_id: this.course_id
          // teacher_course_id: this.teacher_course_id
        }
      }).then(res => {
        if (res.code === 200) {
          this.chapter_class_list = res.data.chapter_list
        }
      })
    },
    renderContent (h, {
      root,
      node,
      data
    }) {
      return (
        <div class="m-chapter-class-item" style={{ display: 'flex' }} onClick={() => { this.cur_item = data; if (data.child === undefined || data.child.length === 0) { this.showDetail(data, 1) } }}>
          <span class="m-item2-title">{`${data.sort}：${data.title}`}</span>
          <span>
            <button v-show={(data.child === undefined || data.child.length === 0) && this.showProgress !== false} onClick={(e) => { e.stopPropagation(); this.linkTo(data) }}>学生进度</button>
          </span>
        </div>
      )
    },
    linkTo (data) {
      this.$router.push({ name: 'mobileProcess', query: { teacher_course_id: this.teacher_course_id, chapter_class_id: data.id, course_name: this.course_name, title: data.title } })
    },
    showDetail (data, i) {
      let typeName
      if (data.pano_type) {
        if (data.pano_type === 1) {
          typeName = 'krpano'
        } else {
          typeName = 'krpano_video'
        }
      } else {
        typeName = ''
      }
      this.$router.push({ name: 'mobileChapterDetail', query: { id: data.id, course_id: data.course_id, type: i, typeName: typeName } })
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
<style>
</style>
