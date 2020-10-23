<template>
  <div class="new-index">
    <div class="site">
      <Carousel autoplay v-model="value2" loop :autoplay-speed="autoplaySpeed">
        <CarouselItem v-for="(item,index) in banner_list" :key="index">
          <div class="wrapper horizontal demo1">
            <ul class="container">
              <li class="cards-list">
                <div class="img">
                  <img :src="item.img" alt />
                </div>
              </li>
            </ul>
          </div>
        </CarouselItem>
      </Carousel>
    </div>
    <div class="entry-btnList">
      <div @click="entrySystem">教务系统</div>
      <div>观看记录</div>
      <div>智慧党建</div>
      <div>第二课堂</div>
      <div>在线报名</div>
      <div>更多入口</div>
    </div>
    <div>
      <Tabs value="allCourse" class="index-tabs" @on-click="changeTabs">
        <!-- 课程推荐 -->
        <TabPane label="课程推荐" name="allCourse">
          <Row type="flex" justify="space-between" class="new-index-course-header">
            <Col>
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
            <div v-if="comamnd_Select_list.length===0" style="height:200px">暂无推荐课程</div>
            <li v-for="(item,index) in comamnd_Select_list" :key="index" class="index-course-item"
              @click="$router.push({ path: `/videojump/${item.id}` })">

              <img :src="item.img" style="width:100%;height:150px" />
              <div class="index-course-name">{{item.course_name}}</div>
              <div class="index-course-schoolanme">
                <div class="index-course-schoolanme1">{{item.school_name}}</div>
                <div class="index-course-schoolanme2">{{item.major_name}}</div>
              </div>
              <div class="index-course-majorname">{{item.course_label}}</div>
              <div class="index-course-username">
                <div class="index-course-username_l">
                  <div class="index-course-username_l_img">
                    <img src="" alt="">
                  </div>
                  <div class="index-course-username_l_name">{{item.user_name}}</div>
                </div>
                <div class="index-course-username_r"></div>
              </div>

            </li>
            <div style="clear:both"></div>
          </ul>
        </TabPane>
        <!-- 本校课程 -->
        <TabPane label="本校课程" name="schoolCourse" v-if="token!==''&&token!==false&&token!==undefined&&userId!==''">
          <Row type="flex" justify="space-between" class="new-index-course-header">
            <Col>
            <Select v-model="major" style="width:200px" @on-change='handle_select'>
              <Option v-for="item in majorList" :value="item.major_name" :key="item.major_id">{{ item.major_name }}
              </Option>
            </Select>
            </Col>
            <Col>
            <RadioGroup @on-change='handle_Radio'>
              <Radio label="全部"></Radio>
              <Radio label="精选课程"></Radio>
              <Radio label="免费课程"></Radio>
            </RadioGroup>
            </Col>
          </Row>
          <ul>
            <div v-if="Select_list.length===0" style="height:200px">暂无课程</div>
            <li v-for="(item,index) in Select_list" :key="index" class="index-course-item">
              <img :src="item.img" style="width:100%;height:150px" />
              <div class="index-course-name">{{item.course_name}}</div>

              <div class="index-course-majorname">{{item.major_name}}</div>
            </li>
            <div style="clear:both"></div>
          </ul>
        </TabPane>
      </Tabs>
      <div style="text-align:center;margin-bottom:51px">
        <button class="index-course-more-btn" @click="$router.push({name:'schoolyard'})">加载更多...</button>
      </div>
    </div>
    <div class="index-news">
      <Row type="flex" justify="space-between" class="new-index-info">
        <Col style="margin-right:100px;flex:1">
        <div>
          <img src="@/assets/images/new-index/news.png" />
          <span>新闻动态</span>
        </div>
        <Row type="flex">
          <Col style="width:420px;margin-right:20px">
          <div>
            <img :src="newsList[0].cover" style="width:420px;height:250px" />
          </div>
          <div class="index-news-top-title">{{newsList[0].title}}</div>
          <div class="index-news-top-content">{{newsList[0].describe}}</div>
          </Col>
          <Col style="flex:1">
          <ul>
            <li v-for="(item,index) in newsList" :key="item.id" class="new-index-news" @click="showContent(item.id)">
              <Row type="flex">
                <Col>
                <span class="new-index-no">{{index+1}}</span>
                </Col>
                <Col style="flex:1">
                <div>
                  <div class="index-news-title">{{item.title}}</div>
                  <Row type="flex" justify="space-between" style="color:#ABACAC">
                    <Col>
                    <span>来源：英途信息</span>
                    </Col>
                    <Col>
                    <span class="Sfr">{{moment(item.created_at * 1000).format('YYYY-MM-DD')}}</span>
                    </Col>
                  </Row>
                </div>
                </Col>
              </Row>
            </li>
          </ul>
          </Col>
        </Row>
        </Col>
        <Col :span="6">
        <div>
          <img src="@/assets/images/new-index/school.png" />
          <span>合作院校</span>
        </div>
        <ul>
          <li class="index-school-list" v-for="(item,index) in schoolList" :key="index">
            <Row type="flex">
              <Col>
              <img :src="item.school_icon" style="width:56px;height:56px;margin-right:10px;border-radius:50%" />
              </Col>
              <Col style="flex:1">
              <div class="index-school-name">{{item.school_name}}</div>
              <Row>
                <Col>
                <span>拥有课程：{{item.course_num}}</span>
                </Col>
                <Col>
                <span>拥有教师：{{item.teacher_num}}</span>
                </Col>
              </Row>
              </Col>
            </Row>
          </li>
        </ul>
        </Col>
      </Row>
    </div>
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
        <button class="index-course-more-btn" @click="$router.push({name:'team'})">教师团队...</button>
      </div>
    </div>
    <Modal v-model="modal2" :title="title" width="800" footer-hide>
      <newsContent :id="id"></newsContent>
    </Modal>
    <!-- <span>{{flitersdata}}</span> -->
  </div>
</template>
<script>
import modal_mixin from '@/view/mixins/modal_mixin'
import newsContent from '@/view/news/newsContent'
import { get_bannersIndex, get_majors, myCourseList, courselist } from '@/api/common'
import log from 'video.js/es5/utils/log'
// import log from 'video.js/es5/utils/log'
export default {
  mixins: [modal_mixin],
  components: {
    newsContent
  },
  data () {
    return {
      id: '',
      major: '',
      modal2: false,
      title: '',
      majorList: [],
      courseList: [], // 本校课程
      commandCourseList: [],
      banner_list: [],
      schoolList: [],
      teacherList: [],
      newsList: [{ cover: '' }],
      tItemIndex: 0,
      value2: 0,
      autoplaySpeed: 2000,
      animal: '全部', // 单选框
      Select_list: [], // 本校课程的渲染数组
      comamnd_Select_list: [] // 推荐课程的渲染数组

    }
  },
  watch: {
    // major (newVal, oldVal) {
    //   this.getData()
    // },
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
      return this.$store.state.user.token
    },
    userType () {
      return this.$store.state.user.userInfo.userType
    },
    userId () {
      return this.$store.state.user.userId
    },
    schoolId () {
      return this.$store.state.user.userInfo.schoolId
    }
  },
  methods: {
    // handlemy (item, index) {
    //   console.log(item);
    //   console.log(item.id);

    //   // this.$router.push({ name: 'videojump' })
    //   // this.$router.push({ path: `/video_index/${item.id}` })
    // },
    // 单选
    handle_Radio (value) {
      this.Select_list = this.courseList.filter(v => {
        return v.is_charge_name === value
      })
      if (this.Select_list.length > 10) {
        this.Select_list.length = 10
      }
      if (value === '全部') {
        var data = {
          page: 1,
          page_size: 10,
          school_id: this.schoolId
        }
        myCourseList(data).then(res => {
          if (this.Select_list.length > 10) {
            this.Select_list.length = 10
          }
          this.Select_list = res.data.list
        })
      }
    },
    // 选中select下拉列表和
    handle_select (value) {
      this.Select_list = this.courseList.filter(v => {
        return v.major_name === value
      })
    },
    // 课程推荐的单选框的切换
    handle_change (value) {
      if (value === '全部') {
        courselist().then(res => {

          this.comamnd_Select_list = res.data.data
          if (this.comamnd_Select_list.length > 10) {
            this.comamnd_Select_list.length = 10
          }
        })
      }
      this.comamnd_Select_list = this.commandCourseList.filter(v => {
        return v.is_charge_name === value
      })
      if (this.comamnd_Select_list.length > 10) {
        this.comamnd_Select_list.length = 10
      }
    },
    // 获取轮播图
    get_banners (path) {
      get_bannersIndex({ path: path }).then(res => {
        if (res.code === 200) {
          // nextTick涉及到Vue中DOM的异步更新，将回调延迟到下次 DOM 更新循环之后执行。在修改数据之后立即使用它，然后等待 DOM 更新。
          this.$nextTick(function () {
            this.banner_list = res.data.list
            this.$nextTick(() => {
              // this.showbanner();
            })
          })
        }
      })
    },
    // 获取本校课程
    getData () {
      var data = {
        page: 1,
        page_size: 10,
        school_id: this.schoolId
      }

      myCourseList(data).then(res => {
        console.log(res)
        // 数据改造
        res.data.list.map(item => {
          if (item.is_charge === 1) return item.is_charge_name = '精选课程'
          else if (item.is_charge === 0) return item.is_charge_name = '免费课程'
        })
        this.courseList = res.data.list
        this.Select_list = res.data.list
        if (this.Select_list.length > 10) {
          this.Select_list.length = 10
        }
      })
    },
    // 获取推荐课程
    get_command_course () {
      courselist().then(res => {
        // console.log(res)
        // 数据改造
        if (res.code === 200) {
          console.log(res);
          res.data.data.map(item => {
            if (item.is_charge === 1) return item.is_charge_name = '精选课程'
            else if (item.is_charge === 0) return item.is_charge_name = '免费课程'
          })
          this.commandCourseList = res.data.data
          this.comamnd_Select_list = res.data.data
          // this.comamnd_Select_list.forEach((v, i) => {
          //   console.log(v.id);
          //   // console.log(i);

          // });
          console.log(this.comamnd_Select_list);
          if (this.comamnd_Select_list.length > 10) {
            this.comamnd_Select_list.length = 10
          }
        }
      })
    },
    // 获取推荐教师
    get_command_teacher () {
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
    changeTabs (i) {
      if (i === 'allCourse') {
        this.getMajor()
      }
      if (i === 'schoolCourse') {
        this.getMajorStudent()
      }
    },
    getNewsData () {
      this.axios
        .request({
          method: 'get',
          url: '/index.php/home/index/getNews',
          params: {
            page: 1,
            page_size: 5,
            type: 0
          }
        })
        .then(res => {
          this.newsList = res.data.list
        })
    },
    showContent (i) {
      this.id = i
      this.open2('newsContent', i, '新闻详情')
    },
    open2 (target, target_id, title) {
      this.modal2 = true
      this.target = target
      this.title = title
      this.id = target_id
    },
    // 获取所有学校所有专业信息
    getMajor () {
      this.axios
        .request({
          method: 'post',
          url: '/index.php/home/index/getAllMajor',
          data: {}
        })
        .then(res => {
          this.majorList = res.data.list
        })
    },
    // 获取本校所有专业
    getMajorStudent () {
      get_majors().then(res => {
        console.log(res)
        if (res.code === 200) {
          this.majorList = res.data.list
        }
      })
    },
    entrySystem () {
      if (
        this.token === '' ||
        this.token === false ||
        this.token === undefined ||
        this.userId === ''
      ) {
        this.$Message.error('您尚未登录，请先登录')
        this.$emit('showLoginModal')
      } else {
        if (this.userType === 1) {
          this.$router.push({
            path: '/teachingSystem/MyCourse/course_courseware'
          })
        } else {
          this.$router.push({
            path: '/teachingSystem/StudentCourse/course_coursewares'
          })
        }
      }
    },
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
    // showbanner () {
    //   // 轮播图
    //   var $ = function (el) {
    //     try {
    //       var item = document.querySelectorAll(el)
    //       return item.length <= 1 ? item[0] : item
    //     } catch (err) {
    //       console.log(err)
    //     }
    //   }
    //   var backdrop1 = new Backdrop($('.demo1>.container'), {
    //     transition: {
    //       value: '360ms',
    //       waitForTransition: true
    //     },
    //     autoplay: {
    //       enable: true,
    //       delay: 4000
    //     },
    //     isClickSlide: true,
    //     opacity: 0.8,
    //     scale: 0.64,
    //     navigation: {
    //       nextEl: $('.demo1 .btn-right'),
    //       prevEl: $('.demo1 .btn-left')
    //     },
    //     baseZIndex: 100 // 默认为10
    //   })
    // },
    getSchoolList () {
      // 获取学校列表
      this.schoolList = []
      this.axios
        .request({
          method: 'get',
          url: '/index.php/Home/Index/getSchoolList'
        })
        .then(res => {
          if (res.code === 200) {
            if (res.data.list.length < 4) {
              this.schoolList = res.data.list
            } else {
              for (let i = 0; i < 4; i++) {
                this.schoolList.push(res.data.list[i])
              }
            }
          }
        })
    }
  },
  mounted () {
    this.getMajor()
    this.get_banners('/news')
    this.getNewsData()
    this.getSchoolList()
    this.get_command_course()
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
<style lang="less">
.new-index {
  padding: 40px 0;
}
.swiper-slide {
  width: 600px !important;
}
.slide-item {
  width: 100%;
  margin: 0 auto;
  // height: 300px;
  // overflow: hidden;
  // cursor: pointer;
  // position:relative;
  &:hover {
    // box-shadow: 1px 1px 9px #222;
  }
  img {
    width: 100%;
    border-radius: 4px;
  }
}
.entry-btnList {
  display: flex;
  margin: 60px auto;
  width: 1000px;
  justify-content: space-between;
}
.entry-btnList > div {
  // flex:1
  width: 100px;
  height: 100px;
  color: #ffffff;
  font-size: 14px;
  text-align: center;
  line-height: 146px;
  cursor: pointer;
}
.entry-btnList > div:nth-of-type(1) {
  background-image: url("../../assets/images/new-index/system.png");
}
.entry-btnList > div:nth-of-type(2) {
  background-image: url("../../assets/images/new-index/history.png");
}
.entry-btnList > div:nth-of-type(3) {
  background-image: url("../../assets/images/new-index/info.png");
}
.entry-btnList > div:nth-of-type(4) {
  background-image: url("../../assets/images/new-index/study.png");
}
.entry-btnList > div:nth-of-type(5) {
  background-image: url("../../assets/images/new-index/bm.png");
}
.entry-btnList > div:nth-of-type(6) {
  background-image: url("../../assets/images/new-index/more.png");
}
.index-tabs {
  width: 1200px;
  margin: 0 auto;
}
.index-tabs .ivu-tabs-bar .ivu-tabs-nav {
  width: 100%;
  text-align: center;
  font-size: 18px;
  color: #000000;
  font-weight: 400;
}
.index-tabs .ivu-tabs-nav .ivu-tabs-tab-active {
  color: #2ba4e7;
  font-weight: bold;
  border-bottom: 4px solid #2ba4e7;
}
.index-tabs .ivu-tabs-bar .ivu-tabs-ink-bar {
  display: none;
}
.index-news {
  background: #fcfcfc;
  padding: 64px 0;
  margin-bottom: 79px;
}
.new-index-course-header .ivu-radio-wrapper {
  margin-left: 30px;
  margin-bottom: 40px;
  color: #999999;
}
.new-index-info {
  width: 1200px;
  margin: 0 auto;
}
.new-index-info img {
  vertical-align: middle;
}
.new-index-info > div > div:nth-of-type(1) > span {
  color: #000000;
  font-weight: bold;
  font-size: 16px;
  display: inline-block;
  margin-left: 10px;
  transform: translateY(2px);
}
.new-index-info > div > div:nth-of-type(1) {
  margin-bottom: 10px;
}
.new-index-news {
  margin-bottom: 20px;
  cursor: pointer;
}
.new-index-no {
  background: #3b9bff;
  display: inline-block;
  width: 42px;
  height: 42px;
  line-height: 42px;
  color: #ffffff;
  font-family: "FZDHTJW";
  font-size: 24px;
  border-radius: 4px;
  text-align: center;
  margin-right: 20px;
}
.index-news-title {
  color: #3c3c3c;
  font-size: 14px;
  margin: 2px 0 4px 0;
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
.index-news-top-title {
  color: #3c3c3c;
  font-size: 16px;
  margin: 8px 0 4px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.index-news-top-content {
  color: #abacac;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.index-school-list {
  background: #ffffff;
  border: 1px solid #eeeeee;
  border-radius: 4px;
  padding: 4px;
  margin: 10px 0;
}
.index-school-name {
  font-size: 16px;
  color: #555555;
  font-weight: bold;
  margin: 4px 0;
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
  .index-course-schoolanme {
    display: flex;
    justify-content: space-between;
    padding: 0 10px;

    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #adadad;
  }
  .index-course-username {
    .index-course-username_l {
      display: flex;
      padding: 0 10px;
      .index-course-username_l_img {
        width: 20px;
        height: 20px;
      }
    }
  }
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
</style>
