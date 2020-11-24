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
          <span v-for="(item,index) in schoolList" :key="index"><a href="#"
              @click="handleschoolList(index)">{{item.school_name}}</a></span>
          <Dropdown style="margin-left: 20px">
            <Icon type="md-arrow-dropdown" size="20" color="#000" />
            <DropdownMenu slot="list" type="flex" class="schoolyard_DropdownMenu">
              <DropdownItem v-for="(v,i) in DropdownItem_schoolList" :key="i" @click.native="handleschoolList(i)">
                {{v.school_name}}
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
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
          <span v-for="(item,index) in majorList" :key="index"><a href="#"
              @click="handleMajorList(index)">{{item.major_name}}</a></span>
          <Dropdown style="margin-left: 20px">
            <Icon type="md-arrow-dropdown" size="20" color="#000" />
            <DropdownMenu slot="list" type="flex" class="schoolyard_DropdownMenu">
              <DropdownItem v-for="(v,i) in majorListAll" :key="i" @click.native="handleMajorList(i)">{{v.major_name}}
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        </col>

      </Row>
    </div>

    <!-- 精品课程 -->
    <div>
      <Tabs value="allCourse" class="index-tabs" @on-click="changeTabs">
        <TabPane label="精品课程" name="allCourse">
          <Row type="flex" justify="space-between" class="new-index-course-header">

            <Col>
            <RadioGroup @on-change='handle_Radio' v-model="goodrideo">
              <Radio label="全部"></Radio>
              <Radio label="视频"></Radio>
              <Radio label="全景"></Radio>
            </RadioGroup>
            </Col>
          </Row>
          <ul>
            <div v-if="newCourse.length===0" style="height:200px">暂无推荐课程</div>
            <li v-for="(item,index) in newCourse" :key="index" class="index-course-item"
              @click="$router.push({ path: `/videojump/${item.id}` })">
              <img :src="item.img" style="width:100%;height:150px" />
              <div class="index-course-name">{{item.course_name}}</div>
              <div class="index-course-majorname">{{item.course_label}}</div>
            </li>
            <div style="clear:both"></div>
          </ul>
        </TabPane>
        <!-- <TabPane label="本校课程" name="schoolCourse" v-if="token!==''&&token!==false&&token!==undefined&&userId!==''">
          <Row type="flex" justify="space-between" class="new-index-course-header">
            <Col>
            <Select v-model="major" style="width:200px">
              <Option v-for="item in majorList" :value="item.major_id" :key="item.major_id">{{ item.major_name }}
              </Option>
            </Select>
            </Col>
            <Col>
            <RadioGroup @on-change='handle_change'>
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
        </TabPane> -->
      </Tabs>
      <div style="text-align:center;margin-bottom:51px" @click="handlenewCoursemore">
        <button class="index-course-more-btn">加载更多...</button>
      </div>
    </div>
    <!-- 免费课程 -->
    <div>
      <Tabs value="allCourse" class="index-tabs" @on-click="changeTabs">
        <TabPane label="推荐课程" name="allCourse">
          <Row type="flex" justify="space-between" class="new-index-course-header">

            <Col>
            <RadioGroup @on-change='handle_Radio2' v-model="couserradio">
              <Radio label="全部"></Radio>
              <Radio label="视频"></Radio>
              <Radio label="全景"></Radio>
            </RadioGroup>
            </Col>
          </Row>
          <ul>
            <div v-if="freeCourse.length===0" style="height:200px">暂无推荐课程</div>
            <li v-for="(item,index) in freeCourse" :key="index" class="index-course-item"
              @click="$router.push({ path: `/videojump/${item.id}` })">
              <img :src="item.img" style="width:100%;height:150px" />
              <div class="index-course-name">{{item.course_name}}</div>
              <div class="index-course-majorname">{{item.course_label}}</div>
            </li>
            <div style="clear:both"></div>
          </ul>
        </TabPane>

        <!-- <TabPane label="本校课程" name="schoolCourse" v-if="token!==''&&token!==false&&token!==undefined&&userId!==''">
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
        </TabPane> -->
      </Tabs>
      <div style="text-align:center;margin-bottom:51px" @click="handlefreeCourseemore">
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
            <li v-for="(item,index) in teacherList" :key="index" class="index-teacher-item"
              @click="$router.push({path:`/teacher_homepage/${item.teacher_id}`})">
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
      <div style="text-align:center;margin-bottom:51px" @click="$router.push({name:'team'})">
        <button class="index-course-more-btn">教师团队...</button>
      </div>
    </div>
  </div>
</template>

<script>
import { get_majors, courselist, teacher_recommend, myCourseList, schoolCourseList } from '@/api/common'
import log from 'video.js/es5/utils/log'
export default {
  name: 'schoolyard',

  data () {
    return {
      commandCourseList: [],
      majorList: [],
      // getData: [],
      major: '',
      schoolCourse: [],
      teacherList: [],
      tItemIndex: 0,
      schoolList: [],
      DropdownItem_schoolList: [],
      comamnd_Select_list: [],
      newCourse: [],
      freeCourse: [],
      majorListAll: [],
      newCourseAll: [],
      freeCourseAll: [],
      couserradio: '全部',
      goodrideo: '全部'

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
    // 单选
    handle_Radio (value) {
      if (value === "视频") {
        value = 1
      }
      else if (value === '全景') {
        value = 2
      }
      else {
        value = 0
      }
      var coursearr = this.newCourseAll.filter(v => {
        return v.course_type === value
      })
      // if (coursearr.length > 10) {
      //   coursearr.length = 10
      // }
      this.newCourse = coursearr
      if (value === 0) {
        this.newCourse = this.newCourseAll
        // if (this.newCourse.length > 10) {
        //   this.newCourse.length = 10
        // }
      }
    },
    handle_Radio2 (value) {
      if (value === "视频") {
        value = 1
      }
      else if (value === '全景') {
        value = 2
      }
      else {
        value = 0
      }
      var coursearr2 = this.freeCourseAll.filter(v => {
        return v.course_type === value
      })
      // if (coursearr2.length > 10) {
      //   coursearr2.length = 10
      // }
      this.freeCourse = coursearr2
      if (value === 0) {
        this.freeCourse = this.freeCourseAll
        // if (this.newCourse.length > 10) {
        //   this.freeCourse.length = 10
        // }
      }
    },
    handleMajorList (index) {
      var majorcourse = this.schoolCourse.filter(v => {
        return this.majorList[index].major_name === v.major_name
      })
      if (majorcourse.length == 0) {
        this.$Message.error('该专业暂时没有课程推荐...')
      }
      var arr = [];
      var arr2 = [];
      majorcourse.forEach((v, i) => {
        if (v.is_charge === 1) {
          arr.push(v)
          this.newCourseAll = arr
          if (arr.length > 10) {
            this.newCourse = arr.slice(0, 10)
          } else {
            this.newCourse = arr
          }
        }
        if (v.is_charge === 0) {
          arr2.push(v)
          this.freeCourseAll = arr2
          if (arr2.length > 10) {
            this.freeCourse = arr2.slice(0, 10)
          } else {
            this.freeCourse = arr2
          }
        }
      })
    },
    handleschoolList (ind) {
      schoolCourseList(
        this.DropdownItem_schoolList[ind].id
      ).then(res => {
        if (res.data.list.length == 0) {
          this.$Message.error('该学校暂时没有课程推荐...')
        }
        this.schoolCourse = res.data.list
        var arr = [];
        var arr2 = [];
        res.data.list.forEach((v, i) => {
          if (v.is_charge === 1) {
            arr.push(v)
            this.newCourseAll = arr
            if (arr.length > 10) {
              this.newCourse = arr.slice(0, 10)
            } else {
              this.newCourse = arr
            }
          }
          if (v.is_charge === 0) {
            arr2.push(v)
            this.freeCourseAll = arr2
            if (arr2.length > 10) {
              this.freeCourse = arr2.slice(0, 10)
            } else {
              this.freeCourse = arr2
            }
          }
        })
      })
    },
    handlenewCoursemore () {
      if (this.newCourseAll.length > 10) {
        this.newCourse = this.newCourseAll
      } else {
        this.$Message.warning('没有更多了....');
      }
    },
    handlefreeCourseemore () {
      if (this.freeCourseAll.length > 10) {
        this.freeCourse = this.freeCourseAll
      } else {
        this.$Message.warning('没有更多了....');
      }
    },
    get_command_teacher () {
      // 获取推荐教师
      teacher_recommend().then(res => {
        this.teacherList = res.data.data
      })
    },
    get_schoolCourseList (id) {
      schoolCourseList(id).then(res => {
        console.log(res);
        this.schoolCourse = res.data.list
        // 获取精品课程 和 获取免费课程
        var arr = [];
        var arr2 = []
        res.data.list.forEach((v, i) => {
          if (v.is_charge === 1) {
            arr.push(v)
            this.newCourseAll = arr
            if (arr.length > 10) {
              this.newCourse = arr.slice(0, 10)
            } else {
              this.newCourse = arr
            }
          }
          if (v.is_charge === 0) {
            arr2.push(v)
            this.freeCourseAll = arr2
            if (arr2.length > 10) {
              this.freeCourse = arr2.slice(0, 10)
            } else {
              this.freeCourse = arr2
            }
          }
        })
      })
    },
    get_command_course () {
      // 首页课程推荐
      if (this.schoolId) {
        this.get_schoolCourseList(this.schoolId)
      } else {
        this.get_schoolCourseList({ schoolId: '' })
      }

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
      this.axios.request({
        method: 'post',
        url: '/index.php/home/index/getAllMajor',
        data: {}
      })
        .then(res => {
          console.log(res);

          if (res.data.list.length >= 12) {
            res.data.list.length = 12
            this.majorList = res.data.list
          }
          this.majorList = res.data.list
          this.majorListAll = res.data.list

        })
    },
    // 左右箭头的切换
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
      this.axios
        .request({
          method: 'get',
          url: '/index.php/Home/Index/getSchoolList'
        })
        .then(res => {
          console.log(res);
          if (res.code === 200) {
            if (res.data.list.length >= 8) {
              this.schoolList = res.data.list.slice(0, 8)
            } else {
              this.schoolList = res.data.list
            }
            this.DropdownItem_schoolList = res.data.list
            console.log(this.DropdownItem_schoolList);

          }
        })
    }
  },
  mounted () {
    // this.getData()
    this.getSchoolList()
    this.get_command_course()
    this.getMajor()
    this.get_command_teacher()
    // if (
    //   this.token !== '' &&
    //   this.token !== false &&
    //   this.token !== undefined &&
    //   this.userId !== ''
    // ) {
    //   this.getData()
    // }
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
        a:hover {
          color: #2ba4e7ff;
        }
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
          top: 30px !important;
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
