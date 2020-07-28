<template>
<div style="width:100%;height:100%;padding:20px;display:flex;flex-direction:column">
  <Row type="flex" justify="space-between">
    <Col>
      <span>班级：</span>
      <Select class="new-searchSel" v-model="class_choose" placeholder="全部" clearable style="width:200px" >
        <Option v-for="classitem in class_list" :value="classitem.value" :key="classitem.value">{{ classitem.label }}</Option>
      </Select>
    </Col>
    <Col>
      <button class="blueText-btn" @click="$emit('closeModal')">返回</button>
    </Col>
  </Row>
  <div style="flex:1;position:relative">
    <ChapterClass ref="chapter" :chapter_class_id="c_id" ></ChapterClass>
  </div>

</div>

</template>

<script>

import ChapterClass from './student_chapter_total'
export default {
  props: { c_id: '' },
  components: {
    ChapterClass
  },
  data () {
    return {
      class_list: [],
      class_choose: ''
    }
  },
  watch: {
    class_choose (n, o) {
      if (this.class_choose === undefined) {
        this.class_choose = ''
      }
      this.$refs.chapter.getData(n)
    },
    teacher_course_id (n, o) {
      this.getClass()
    }
  },
  computed: {
    teacher_course_id () {
      return this.$store.state.user.courseData.teacher_course_id
    }
  },
  methods: {
    getClass () {
      this.axios.request({
        method: 'get',
        url: '/index.php/Teacher/Class/get_class_by_course',
        params: {
          teacher_course_id: this.teacher_course_id
        }
      }).then(res => {
        if (res.code === 200) {
          if (res.data.length > 0) {
            let data = res.data
            this.axios_data = data
            this.class_list = []
            for (let i in data) {
              this.class_list.push({
                value: data[i].id,
                label: data[i].class_name
              })
            }
            this.class_choose = this.class_list[0].value
          }
        }
      })
    }
  },
  mounted () {
    this.getClass()
  }

}
</script>

<style lang="less">

</style>
