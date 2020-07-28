<template>
  <div class="select-course">
    <div class="select-course-header">
      <div class="select-course-header-l">
        <span class="select-course-header-l-title">添加自选课程</span>
        <span class="select-course-header-l-ib">
          <Input class="new-searchSel" placeholder="请输入课程关键词"  v-model="keyword"></Input>
          <button class="blue-btn" style="transform: translate(-22px,2px)" @click="selectbtn">搜索</button>
          <span class="gray-c8">专业：</span>
          <Select class="new-searchSel" v-model="classid" placeholder="班级" clearable style="margin-right:30px">
            <Option v-for="item in classList" :value="item.class_id" :key="item.class_id">{{ item.class_name }}</Option>
          </Select>
          <span class="gray-c8">共有课程：56</span>
        </span>
      </div>
      <div class="select-course-header-r">
        <button class="blackBorder-btn" @click="closethis()">取消</button>
        <button class="blueC-btn" @click="closethis()" style="margin-left:20px">确定</button>
      </div>
    </div>
    <div style="position:relative;height:100%;width:100%">
      <div class="ab-scroll">
        <div class="select-course-content">
          <ul>
            <li v-for="(item,index) in course_list" :key="index">
              <Row type="flex" justify="space-between">
                <Col>
                  <img :src="item.img" style="width:88px;height:88px;margin-right:20px"/>
                </Col>
                <Col class="select-course-content-li-r">
                  <div>{{item.course_name}}</div>
                  <div class="gray-c8">类型：{{item.course_type===1?"普通课程":"全景课程"}}</div>
                  <div>
                    <button class="blackBorderCC-btn" style="margin-right:10px;color:#888888" @click="showCourse(item)">课程信息</button>
                    <button class="blue-btn" @click="handlebind(item)">绑定课程</button>
                  </div>
                </Col>
              </Row>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      course_list: [],
      keyword: '',
      course_ids: [],
      classList: [],
      classid: ''
    }
  },
  methods: {
    getInfo (page = 1, keyword) {
      this.axios.request({
        method: 'get',
        url: '/index.php/Teacher/Course/optional_index',
        params: {
          page: 1,
          page_size: 10000,
          keyword: this.keyword
        }
      }).then(res => {
        if (res.code === 200 && res.data.course_list !== null) {
          this.course_list = res.data.course_list
          this.loading = false
        }
      })
    },
    selectbtn () {
      this.course_list = []
      this.loading = true
      this.getInfo(1, this.keyword)
    },
    handlebind (item) {
      this.course_ids.push(item.id)
      this.axios.request({
        method: 'post',
        url: 'index.php/Teacher/Course/choose',
        data: {
          course_ids: this.course_ids
        }
      }).then(res => {
        if (res.code === 200) {
          this.$Message.success('绑定成功')
          this.course_list = []
          this.course_ids = []
          this.getInfo()
          this.$emit('bind-success')
        }
      })
    },
    showCourse (item) {
      this.$emit('changeNameT', item.course_name)
      this.$store.commit('setcourseData', item)
    },
    closethis () {
      this.$emit('closeSelect')
    },
    getclassList () {
      this.axios.request({
        url: '/index.php/Teacher/Class/get_class_list',
        method: 'get',
        params: {
        }
      }).then(res => {
        if (res.code === 200) {
          this.classList = res.data
        }
      })
    }
  },
  mounted () {
    this.getclassList()
    this.getInfo()
  }
}
</script>
