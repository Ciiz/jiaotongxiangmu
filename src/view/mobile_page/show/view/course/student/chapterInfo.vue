<template>
  <div class="m-chapterInfo flex-contain">
    <mt-header title="章节信息">
      <router-link to slot="left">
        <mt-button icon="back" @click="back"></mt-button>
      </router-link>
      <img slot="right" src="@/assets/images/mobile_student/setting.png">
    </mt-header>
    <div class="m-chapterInfo-contain hideScroll">
      <Tree :data="chapter_class_list" class="m-tree" :render="renderContent" children-key="child" style="width:100%" v-if="course_type.toString() === '1'"></Tree>
      <div class="m-pano" v-if="course_type.toString() === '2'">
        <div v-for="(item,index) in chapter_class_list" :key="index" class="m-pano-item" @click="showDetail(item,2)">
          <div>
            <img :src="item.img"/>
          </div>
          <div class="m-pano-item-name">{{item.pano_name}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import { course_chapter_class } from '@/api/common'
export default {
  data () {
    return {
      chapter_class_list: [],
      userType: this.$store.state.user.userInfo.userType
    }
  },
  watch: {

  },
  computed: {
    course_id () {
      return this.$route.query.course_id
    },
    teacher_course_id () {
      return this.$route.query.teacher_course_id
    },
    course_type () {
      return this.$route.query.course_type
    }
  },
  methods: {
    back () {
      history.go(-1)
    },
    getData () {
      course_chapter_class(this.course_id, this.teacher_course_id).then(res => {
        let data = res.data
        if (res.code === 200) {
          this.chapter_class_list = data.chapter_list
        }
      })
    },
    renderContent (h, {
      root,
      node,
      data
    }) {
      return (
        <div class="m-chapter-class-item" onClick={() => { this.cur_item = data; if (data.child === undefined || data.child.length === 0) { this.showDetail(data, 1) } }}>
          <div class="item2-title">{ `${data.sort}：${data.title}` }</div>
          <Progress class="m-progress" v-show={this.userType === 2 && (data.child === undefined || data.child.length === 0)} percent={data.percent} style={{ marginTop: '10px' }}/>
        </div>
      )
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
