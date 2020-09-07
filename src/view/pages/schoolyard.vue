<template>
  <div class="schoolyard">
    <Row class="schoolyard_img">
      <Col type="flex">
      <img src="@/assets/images/login-bg.jpg" alt="">
      </Col>

    </Row>
    <div class="all_option">
      <Row class="allschool_and_major">
        <col>
        <Button type="info">

          <span>全部</span>

        </Button>
        <div class="allschool_list">
          <span v-for="(item,index) in schoolList" :key="index"><a href="#">{{item.school_name}}</a></span>
          <!-- <div @mouseover="enter">
            <Icon type="md-arrow-dropdown" size="20" color="#000" />
          </div> -->

          <!-- <div class="school_name_list" v-for="(v,i) in DropdownItem_schoolList" :key="i">
            {{v.school_name}}</div> -->
          <Dropdown style="margin-left: 20px">
            <Icon type="md-arrow-dropdown" size="20" color="#000" />
            <DropdownMenu slot="list" type="flex" class="schoolyard_DropdownMenu">
              <DropdownItem disabled v-for="(v,i) in DropdownItem_schoolList" :key="i">{{v.school_name}}
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <!-- <router-link to="partner">
            <Icon type="md-arrow-dropdown" size="20" color="#000" />
          </router-link> -->

        </div>
        </col>

      </Row>
      <Divider />
      <Row class="allschool_and_major">
        <col>
        <Button type="info">

          <span>全部</span>

        </Button>
        <div class="allschool_list">
          <span v-for="(item,index) in majorList" :key="index"><a href="#">{{item.major_name}}</a></span>
          <Icon type="md-arrow-dropdown" size="20" color="#000" />
        </div>
        </col>

      </Row>
    </div>
    <!-- 精品课程 -->
    <!-- <Row>
        <col>
        <div class="boutique">
          <div class="boutique_header_left">
                精品课程
          </div>
          <div class="boutique_header_right">
                查看更多>>
          </div>
         </div>
        </col>
      </Row> -->
    <!-- 精品课程 -->
    <div style="background-color: #f8f8f8;">
      <Tabs value="allCourse" class="index-tabs" @on-click="changeTabs">
        <TabPane label="精品课程" name="allCourse">
          <Row type="flex" justify="space-between" class="new-index-course-header">

            <Col>
            <RadioGroup>
              <Radio label="全部"></Radio>
              <Radio label="精选课程"></Radio>
              <Radio label="免费课程"></Radio>
            </RadioGroup>
            </Col>
          </Row>
          <ul>
            <div v-if="commandCourseList.length===0" style="height:200px">暂无推荐课程</div>
            <li v-for="(item,index) in commandCourseList" :key="index" class="index-course-item">
              <img :src="item.img" style="width:100%;height:150px" />
              <div class="index-course-name">{{item.course_name}}</div>
              <div class="index-course-majorname">{{item.course_label}}</div>
            </li>
            <div style="clear:both"></div>
          </ul>
        </TabPane>

        <TabPane label="本校课程" name="schoolCourse" v-if="token!==''&&token!==false&&token!==undefined&&userId!==''">
          <Row type="flex" justify="space-between" class="new-index-course-header">
            <Col>
            <Select v-model="major" style="width:200px">
              <Option v-for="item in majorList" :value="item.major_id" :key="item.major_id">{{ item.major_name }}
              </Option>
            </Select>
            </Col>
            <Col>
            <RadioGroup>
              <Radio label="全部"></Radio>
              <Radio label="精选课程"></Radio>
              <Radio label="免费课程"></Radio>
            </RadioGroup>
            </Col>
          </Row>
          <ul>
            <div v-if="courseList.length===0" style="height:200px">暂无课程</div>
            <li v-for="(item,index) in courseList" :key="index" class="index-course-item">
              <img :src="item.img" style="width:100%;height:150px" />
              <div class="index-course-name">{{item.course_name}}</div>
              <div class="index-course-majorname">{{item.major_name}}</div>
            </li>
            <div style="clear:both"></div>
          </ul>
        </TabPane>
      </Tabs>
      <div style="text-align:center;margin-bottom:51px">
        <button class="index-course-more-btn">加载更多...</button>
      </div>
    </div>
    <!-- 免费课程 -->
    <div>
      <Tabs value="allCourse" class="index-tabs" @on-click="changeTabs">
        <TabPane label="免费课程" name="allCourse">
          <Row type="flex" justify="space-between" class="new-index-course-header">

            <Col>
            <RadioGroup>
              <Radio label="全部"></Radio>
              <Radio label="视频"></Radio>
              <Radio label="全景"></Radio>
            </RadioGroup>
            </Col>
          </Row>
          <ul>
            <div v-if="commandCourseList.length===0" style="height:200px">暂无推荐课程</div>
            <li v-for="(item,index) in commandCourseList" :key="index" class="index-course-item">
              <img :src="item.img" style="width:100%;height:150px" />
              <div class="index-course-name">{{item.course_name}}</div>
              <div class="index-course-majorname">{{item.course_label}}</div>
            </li>
            <div style="clear:both"></div>
          </ul>
        </TabPane>

        <TabPane label="本校课程" name="schoolCourse" v-if="token!==''&&token!==false&&token!==undefined&&userId!==''">
          <Row type="flex" justify="space-between" class="new-index-course-header">
            <Col>
            <Select v-model="major" style="width:200px">
              <Option v-for="item in majorList" :value="item.major_id" :key="item.major_id">{{ item.major_name }}
              </Option>
            </Select>
            </Col>
            <Col>
            <RadioGroup>
              <Radio label="全部"></Radio>
              <Radio label="视频"></Radio>
              <Radio label="全景"></Radio>
            </RadioGroup>
            </Col>
          </Row>
          <ul>
            <div v-if="courseList.length===0" style="height:200px">暂无课程</div>
            <li v-for="(item,index) in courseList" :key="index" class="index-course-item">
              <img :src="item.img" style="width:100%;height:150px" />
              <div class="index-course-name">{{item.course_name}}</div>
              <div class="index-course-majorname">{{item.major_name}}</div>
            </li>
            <div style="clear:both"></div>
          </ul>
        </TabPane>
      </Tabs>
      <div style="text-align:center;margin-bottom:51px">
        <button class="index-course-more-btn">加载更多...</button>
      </div>
    </div>
    <!-- 教师推荐 -->
    <div>
      <div class="index-teacher">
        <span>教师推荐</span>
      </div>
      <div class="index-teacher-list">
        <Icon type="ios-arrow-back" size="60" color="#E1E1E1" @click="scroll(--tItemIndex)" />
        <div class="index-teacher-list-d">
          <ul class="index-teacher-list-ul">
            <li v-for="(item,index) in teacherList" :key="index" class="index-teacher-item">
              <div>
                <img :src="item.icon" />
              </div>
              <div style="font-size:16px;color:#000000;font-weight:bold;margin-top:10px">{{item.name}}</div>
              <div style="font-size:14px;color:#909090">院校：{{item.school_name}}</div>
            </li>
          </ul>
        </div>
        <Icon type="ios-arrow-forward" size="60" color="#E1E1E1" @click="scroll(++tItemIndex)" />
      </div>
      <div style="text-align:center;margin-bottom:51px">
        <button class="index-course-more-btn">教师团队...</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'schoolyard',

  data () {
    return {
      commandCourseList: [],
      majorList: [],
      // getData: [],
      major: '',
      courseList: [],
      teacherList: [],
      tItemIndex: 0,
      schoolList: [],
      DropdownItem_schoolList: []

    }
  },
  watch: {
    major (newVal, oldVal) {
      this.getData()
    },
    // 监听token，值变化就触发，重新获取
    token (n, o) {
      if (n !== '' && n !== false && n !== undefined) {
        this.getData()
        this.getMajor()
      }
    },
    schoolId () {
      this.getMajorStudent()
      this.getData()
    }
  },
  computed: {
    token () {
      return this.$store.state.user.token // 监听到token的变化，利用计算属性，解决异步问题
    },
    userId () {
      return this.$store.state.user.userId
    },
    schoolId () {
      return this.$store.state.user.userInfo.schoolId
    }
  },

  methods: {
    get_command_teacher () {
      // 获取推荐教师
      this.axios
        .request({
          method: 'get',
          url: '/index.php/home/index/recommendTeacher',
          params: {}
        })
        .then(res => {
          this.teacherList = res.data.data
        })
    },
    getData () {
      // 获取本校课程
      this.axios
        .request({
          method: 'get',
          url: '/index.php/home/course/isShowSchoolCourses',
          params: {
            page: 1,
            page_size: 10,
            school_id: this.schoolId
          }
        })
        .then(res => {
          this.courseList = res.data.list
        })
    },
    get_command_course () {
      // 获取推荐课程
      this.axios
        .request({
          method: 'get',
          url: '/index.php/home/index/recommendCourse',
          params: {}
        })
        .then(res => {
          this.commandCourseList = res.data.data
        })
    },
    changeTabs (i) {
      if (i === 'allCourse') {
        this.getMajor()
      }
      if (i === 'schoolCourse') {
        this.getMajorStudent()
      }
    },

    getMajor () {
      // 获取所有学校所有专业信息
      this.axios
        .request({
          method: 'post',
          url: '/index.php/home/index/getAllMajor',
          data: {}
        })
        .then(res => {
          if (res.data.list.length >= 12) {
            res.data.list.length = 12
            this.majorList = res.data.list
            // console.log(res);
          }
          this.majorList = res.data.list
        })
    },
    // z左右箭头的切换
    scroll (i) {
      let teacherlist = document.getElementsByClassName(
        'index-teacher-list-ul'
      )[0]
      if (i < 0) {
        this.tItemIndex = teacherlist.children.length - 4
        let s = 224 * this.tItemIndex
        teacherlist.style.transform = 'translateX(-' + s + 'px)'
      } else if (i > teacherlist.children.length - 4) {
        this.tItemIndex = 0
        teacherlist.style.transform = 'translateX(0px)'
      } else {
        let s = 224 * i
        teacherlist.style.transform = 'translateX(-' + s + 'px)'
      }
    },
    // 获取学校列表
    getSchoolList () {
      // let schoolList = []
      // this.DropdownItem_schoolList = [];
      this.axios
        .request({
          method: 'get',
          url: '/index.php/Home/Index/getSchoolList'
        })
        .then(res => {
          if (res.code === 200) {
            if (res.data.list.length >= 8) {
              this.schoolList = res.data.list.slice(0, 4)
              console.log(this.schoolList)
            }
            this.DropdownItem_schoolList = res.data.list
          }
        })
    }
  },
  mounted () {
    this.getSchoolList()
    this.get_command_course()
    this.getMajor()
    this.get_command_teacher()
    if (
      this.token !== '' &&
      this.token !== false &&
      this.token !== undefined &&
      this.userId !== ''
    ) {
      this.getData()
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.ivu-tabs-nav {
  width: 100%;
  text-align: center;
  font-size: 18px;
  color: #000000;

  font-weight: 400;
}
/deep/.ivu-tabs-tab-active {
  color: #2ba4e7;
  font-weight: bold;
  border-bottom: 4px solid #2ba4e7;
}
/deep/.ivu-tabs-ink-bar {
  display: none;
}
/deep/.ivu-radio-wrapper {
  margin-left: 30px;
  margin-bottom: 40px;
  color: #999999;
}
.schoolyard {
  .schoolyard_img {
    display: flex;
    justify-content: center;
    //  align-items: center;
    img {
      height: 320px;
      width: 1200px;
      border-radius: 4px;
    }
  }
  .index-tabs {
    width: 1200px;
    margin: 0 auto;
    padding: 40px 0 20px 0;
  }

  .index-course-item {
    width: 200px;
    // height: 260px;
    margin-right: 40px;
    float: left;
    border-radius: 4px;
    cursor: pointer;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.06);
    margin-bottom: 50px;
  }
  .index-course-name {
    margin-left: 10px;
    color: #030303;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .index-course-majorname {
    margin-left: 10px;
    color: #adadad;
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 10px;
  }
  .new-index-course-header .ivu-radio-wrapper {
    margin-left: 30px;
    margin-bottom: 40px;
    color: #999999;
  }
  .index-course-more-btn {
    width: 98px;
    height: 31px;
    line-height: 31px;
    text-align: center;
    border-radius: 4px;
    border: 1px solid #ededed;
    color: #cfcfcf;
    font-size: 14px;
    outline: none;
    background: #ffffff;
    cursor: pointer;
  }
  .index-teacher {
    border-bottom: 1px solid #f0f0f0;
    text-align: center;
  }
  .index-teacher > span {
    color: #2ba4e7;
    font-weight: bold;
    font-size: 20px;
    display: inline-block;
    padding: 10px 0;
    border-bottom: 3px solid #2ba4e7;
  }
  .index-teacher-list {
    width: 1200px;
    margin: 66px auto;
    display: flex;
  }
  .index-teacher-list .ivu-icon {
    line-height: 150px;
    cursor: pointer;
  }
  .index-teacher-list-d {
    flex: 1;
    overflow: hidden;
    margin: 0 116px;
  }
  .index-teacher-list-ul {
    width: max-content;
  }
  .index-teacher-item {
    float: left;
    width: 224px;
    text-align: center;
  }
  .index-teacher-item img {
    width: 120px;
    height: 120px;
    border-radius: 50%;
  }
  // .boutique {
  //   margin: 0 auto;
  //   width: 1200px;
  //   padding-bottom: 19px;
  //   border-bottom: 1px solid #000;
  //   display: flex;
  //   justify-content: space-between;
  //   margin-bottom: 30px;
  //   margin-top: 30px;
  //   .boutique_header_left {
  //     font-size: 20px;
  //     font-family: Microsoft YaHei;
  //     font-weight: bold;
  //     color: rgba(44, 164, 231, 1);
  //     line-height: 24px;
  //   }
  // }
  .all_option {
    width: 1200px;
    margin: 40px auto;

    .allschool_and_major {
      display: flex;
      align-items: center;

      .allschool_list {
        .schoolyard_DropdownMenu {
          display: flex;
          flex-wrap: wrap;
          // min-height: 300px;
          justify-content: flex-start;
          /deep/.ivu-dropdown-item {
            padding: 0;
            margin: 10px 10px;
            height: 30px;
          }
        }
        /deep/.ivu-select-dropdown {
          width: 1200px;
          background-color: #fff;

          position: absolute;
          left: 0 !important;
          // opacity: 0.6;
          display: flex;
        }
        flex: 1;
        display: flex;
        align-items: center;
        // justify-content: space-around;
        justify-content: space-between;
        margin-left: 20px;

        span {
          // margin: 0 17px;
          // font-size: 13px;
          a {
            color: #000;
            // font-size: 12px;
          }
        }
      }

      .ivu-btn-info {
        width: 61px;
        height: 24px;
        background: #32b6ff;
        border-radius: 12px;
        display: flex;
        align-items: center;
        text-align: center;
        justify-content: center;
        margin: 0;
        padding: 0;
      }
    }
  }
}
</style>
