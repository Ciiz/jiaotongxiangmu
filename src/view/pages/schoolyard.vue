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
        <div style="display:flex;justify-content:space-between;width:100%">
          <div style="display:flex;width:100%">
            <span
              style="width:75px;height:30px;border-radius: 5px;cursor:pointer;display: flex;align-items:center;justify-content: center;"
              :class="{colorall:ststus_color}" @click="handleschoolList('全部')">全部</span>
            <div class="allschool_list" style="cursor:pointer">

              <span v-for="(item,index) in schoolList" :key="index" class="allschool_listItem"
                :class="{colorIndex:index_color===index}">
                <span href="#" @click="handleschoolList(index)">{{item.school_name}}</span>
              </span>
            </div>
          </div>
          <div ref="DropdownMenu">
            <div @click="isshows=!isshows">
              <Icon type="md-arrow-dropup" size="24" v-if="isshows" />
              <Icon type="md-arrow-dropdown" size="24" v-else />
            </div>
            <div class="DropdownMenu" v-show="isshows">
              <div class="DropdownMenu_item">
                <span v-for="(v,i) in DropdownItem_schoolList" :key="i" class="allschool_listItem"
                  :class="{coloritem:index_color===i}" @click="handleschoolList(i)">{{v.school_name}}</span>
              </div>
            </div>
          </div>
        </div>
        </col>
      </Row>
      <Divider />
      <Row class="allschool_and_major">
        <col>
        <div style="display:flex;justify-content:space-between;width:100%">
          <div style="display:flex;width:100%">
            <span
              style="width:75px;height:30px;border-radius: 5px;cursor:pointer;display: flex;align-items:center;justify-content: center;"
              :class="{colorall:ststus_color_major}" @click="handleMajorList('全部')">全部</span>
            <div class="allschool_list" style="cursor:pointer">
              <span v-for="(item,index) in majorList" :key="index" class="allschool_listItem2"
                :class="{colorIndex:major_color===index}">
                <span href="#" @click="handleMajorList(index)">{{item.major_name}}</span>
              </span>
            </div>
          </div>
          <div ref="DropdownMenu2">
            <div @click="isshows2=!isshows2">
              <Icon type="md-arrow-dropup" size="24" v-if="isshows2" />
              <Icon type="md-arrow-dropdown" size="24" v-else />
            </div>
            <div class="DropdownMenu" v-show="isshows2">
              <div class="DropdownMenu_item">
                <span v-for="(v,i) in majorListAll" :key="i" class="allschool_listItem"
                  :class="{coloritem:major_color===i}" @click="handleMajorList(i)">{{v.major_name}}</span>
              </div>
            </div>
          </div>
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

      </Tabs>
      <div style="text-align:center;margin-bottom:51px" @click="handlenewCoursemore">
        <button class="index-course-more-btn">加载更多...</button>
      </div>
    </div>
    <!-- 免费课程 -->
    <div>
      <Tabs value="allCourse" class="index-tabs" @on-click="changeTabs">
        <TabPane label="免费课程" name="allCourse">
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
      isshows: false,
      isshows2: false,
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
      goodrideo: '全部',
      index_color: null,
      major_color: null,
      ststus_color: false,
      ststus_color_major: false


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
    handle_icon (e) {
      if (this.$refs.DropdownMenu.contains(e.target)) {
        return
      } else {
        this.isshows = false
      }
    },
    handle_icon2 (e) {
      if (this.$refs.DropdownMenu2.contains(e.target)) {
        return
      } else {
        this.isshows2 = false
      }
    },
    // 单选
    handle_Radio (value) {
      console.log(value);
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
      this.ststus_color = false
      this.index_color = null
      if (index === '全部') {
        // this.ststus_color_major = true
        // this.major_color = false

      } else {
        console.log(this.major_color);

        this.ststus_color_major = false
        this.major_color = index
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
      }

    },
    handleschoolList (ind) {
      this.ststus_color_major = false
      this.major_color = null
      if (ind === '全部') {
        // this.ststus_color = true
        // this.index_color = null
        // schoolCourseList('').then(res => {
        //   if (res.data.list.length == 0) {
        //     this.$Message.error('该学校暂时没有课程推荐...')

        //   }
        //   this.schoolCourse = res.data.list
        //   var arr = [];
        //   var arr2 = [];
        //   res.data.list.forEach((v, i) => {
        //     if (v.is_charge === 1) {
        //       arr.push(v)
        //       this.newCourseAll = arr
        //       if (arr.length > 10) {
        //         this.newCourse = arr.slice(0, 10)
        //       } else {
        //         this.newCourse = arr
        //       }
        //     }
        //     if (v.is_charge === 0) {
        //       arr2.push(v)
        //       this.freeCourseAll = arr2
        //       if (arr2.length > 10) {
        //         this.freeCourse = arr2.slice(0, 10)
        //       } else {
        //         this.freeCourse = arr2
        //       }
        //     }
        //   })
        // })
      } else {
        this.ststus_color = false
        this.index_color = ind
        schoolCourseList(
          { schoolId: this.DropdownItem_schoolList[ind].id }
        ).then(res => {
          console.log(res);
          if (res.data.list.length == 0) {
            this.$Message.error('该学校暂时没有课程推荐...')
            this.newCourse = []
            this.freeCourse = []
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
      }

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
          this.majorListAll = res.data.list
          if (res.data.list.length >= 8) {
            this.majorList = res.data.list.slice(0, 8)
          } else {
            this.majorList = res.data.list
          }



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
            if (res.data.list.length >= 6) {
              this.schoolList = res.data.list.slice(0, 6)
            } else {
              this.schoolList = res.data.list
            }
            this.DropdownItem_schoolList = res.data.list
            // this.schoolList = res.data.list
          }
        })
    }
  },

  mounted () {

    document.addEventListener('click', this.handle_icon)
    document.addEventListener('click', this.handle_icon2)
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
  },
  destroyed () {
    document.removeEventListener('click', this.handle_icon)
    document.removeEventListener('click', this.handle_icon2)
  }
}
</script>

<style lang="less" scoped>
.colorall {
  background: #32b6ff;
  color: #fff;
}
.coloritem {
  color: #32b6ff;
}
.colorIndex {
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #32b6ff;
  border-radius: 5px;
}
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
  .all_option {
    width: 1200px;

    margin: 40px auto;
    position: relative;
    // overflow: hidden;
    .DropdownMenu {
      // width: 1200px;
      width: 100%;
      background-color: #ffffff;
      box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
      box-sizing: border-box;
      border-radius: 4px;
      z-index: 1000;
      position: absolute;
      left: 10px;
      top: 50px;
      padding: 10px;
      .DropdownMenu_item {
        display: flex;
        flex-wrap: wrap;
        cursor: pointer;
        span {
          width: 20%;
          padding: 5px 0;
        }
      }
    }
    .allschool_and_major {
      // display: flex;
      // align-items: center;
      width: 100%;
      .allschool_list {
        display: flex;
        // align-items: center;
        width: 100%;
        .allschool_listItem2 {
          height: 30px;
          width: 12.5%;
          // margin: 0 30px;
          display: flex;
          padding: 0 7px;
          justify-content: center;
          align-items: center;
        }
        .allschool_listItem {
          height: 30px;
          width: 16.6%;
          // margin: 0 30px;
          padding: 0 7px;
          display: flex;
          justify-content: center;
          align-items: center;
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
