<template>
  <Layout class="main-laout">
    <Header class="top-fixed-top">
      <Row class="main-header" type="flex" justify="space-between">
        <Col style="width:280px">
        <router-link class="layout-logo" to="/index">
          <img :src="maxLogo" alt="" style="height:39px;width:39px">
          <img src="@/assets/images/new-index/logoname.png" style="height:39px;width:initial" alt="">
        </router-link>
        </Col>
        <Col style="flex:1">
        <Menu mode="horizontal" theme="light" :active-name="$route.name" class="menu-list">
          <MenuItem v-for="(menu,index) in menuList" :key="index" :name="menu.name" :to="menu.path">
          <b>{{menu.title}}</b>
          </MenuItem>
        </Menu>
        </Col>

        <Col>
        <!-- maxlength='18' -->
        <div class="search_input">
          <Input v-model="searchValue" class="search_input_l" placeholder="请搜索院校、学生、课程"
            style="width: 200px;margin-right:30px" @keyup.enter.native="handlesearch" />
          <img src="@/assets/images/new-index/search.png" style="margin-right:20px" @click="handlesearch">

          <span v-if="token===''||token===false||token===undefined||userId===''" @click="showLoginModal"
            style="cursor:pointer">登录</span>
          <div v-if="userType!==3">
            <Badge dot :offset='[20,4]' :count="message_total"
              v-if="token!==''&&token!==false&&token!==undefined&&userId!==''">
              <img src="@/assets/images/new-index/message.png" @click="handlemessages">
            </Badge>
          </div>

          <user v-if="token!==''&&token!==false&&token!==undefined&&userId!==''"
            :message-unread-count="this.$store.state.user.userInfo.userType === 1 ? $store.state.user.userInfo.notice_total : unreadCount"
            :user-avatar="$store.state.user.userInfo.userType === 1 ? icon : userAvatar" />
        </div>
        </Col>
      </Row>
    </Header>
    <Content class="top-main-content" id="index">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive" @showLoginModal="showLoginModal"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </Content>
    <Footer class="layout-footer-center">
      <Row class="footer-row" type="flex" justify="space-between">
        <Col class="footer-block" style="margin-right:80px">
        <img src="@/assets/images/new-index/index-qo.png" />
        <!-- <h2>版权信息</h2>
            <p class="footer-item">由英途信息软件提供技术支持Copyright&copy;2019 Mobild Inc.</p>
            <p class="footer-item">版权所有：广州市英途信息软件股份有限公司</p>
            <p class="footer-item">粤ICP备10231381号-3号</p> -->
        </Col>
        <Col class="footer-block" style="flex:1">
        <Row type="flex" justify="space-between" style="margin-bottom:24px">
          <Col>
          <a href="#">网站首页</a>
          </Col>
          <Col>
          <a href="#">公司主营</a>
          </Col>
          <Col>
          <a href="#">成功案例</a>
          </Col>
          <Col>
          <a href="#">关于英途</a>
          </Col>
          <Col>
          <a href="#">关于英途</a>
          </Col>
          <Col>
          <a href="#">联系我们</a>
          </Col>
        </Row>
        <Row type="flex" justify="space-between" style="margin-bottom:12px">
          <Col>邮编：510635</Col>
          <Col>邮箱：romen@etoinfo.com</Col>
          <Col>电话：020-38921121</Col>
          <Col>传真：020-85589057</Col>
        </Row>
        <div style="margin-bottom:12px">版权所有：广州市英途信息技术有限公司 粤ICP备10231381号 </div>
        <div>地址：广州高新技术产业开发区科学城科学大道33号A栋2层206房</div>
        </Col>
        <Col class="new-footer-block" style="margin-left:250px">
        <a href="#index" target="_self">返回顶部</a>
        </Col>
      </Row>
    </Footer>

    <div class="login-modal" v-if="showLogin===true" @mousedown="closeModal">
      <login-form @on-success-valid="handleSubmit"></login-form>
    </div>
  </Layout>
</template>
<script>
import { get_search, teacher_unread, myCourseList } from "@/api/common"
import { student_unread } from "@/api/student"
import maxLogo from '@/assets/images/new-index/logo.png'
import LoginForm from '_c/login-form'
import User from './components/user'
import routers from '@/router/routers'
// import config from '@/config'
import { mapActions, mapMutations } from 'vuex'
import log from 'video.js/es5/utils/log'

// const homeName = config.homeName
export default {
  components: {
    User, LoginForm
  },
  data () {
    return {
      message_total: 0,
      isshow: false,
      searchValue: '',
      showLogin: false,
      maxLogo: maxLogo,
      menuList: [
        {
          name: 'index',
          title: '首页',
          path: '/index'
        },
        {
          name: 'schoolyard',
          title: '校园慕课',
          path: '/schoolyard'
        },
        {
          name: 'partner',
          title: '合作院校',
          path: '/partner'
        },
        {
          name: 'team',
          title: '教师团队',
          path: '/team'
        },
        {
          name: 'news',
          title: '新闻动态',
          path: '/news'
        }
      ]

    }
  },
  watch: {
    '$route' (newRoute) {
      this.setBreadCrumb(newRoute)
    }
  },
  computed: {
    userType () {
      return this.$store.state.user.userInfo.userType
    },
    token () {
      return this.$store.state.user.token
    },
    userId () {
      return this.$store.state.user.userId
    },
    unreadCount () {
      return this.$store.state.user.unreadCount
    },
    unreadCount_teacher () {
      return this.$store.state.user.unreadCount_teacher
    },
    userAvatar () {
      return this.$store.state.user.avatarImgPath
    },
    cacheList () {
      const list = ['user_center', 'class', 'home', 'classing', 'after']
      return list
    },
    icon () {
      return this.$store.state.user.userInfo.icon
    },
    schoolId () {
      return this.$store.state.user.userInfo.schoolId
    }
  },
  methods: {
    ...mapActions([
      'getUnreadMessageCount',
      // 'sendunread',
      'handleLogin',
      'getUserInfo'
    ]),
    ...mapMutations([
      'setBreadCrumb',
      'setHomeRoute'
    ]),
    handleSubmit ({ userName, password, user_type, school }) {
      this.handleLogin({ userName, password, user_type, school }).then(res => {

        this.getUserInfo().then(res => {

          this.$store.commit('setpasswordUserId', res.userId)
          if (res.login_status === 1) {

            if (this.userType === 1) {
              this.get_unread()
            } else if (this.userType === 2) {
              this.student_unread()
            }
            this.$store.commit('setLoginstatus', res.login_status)

          } else {
            this.$store.commit('setLoginstatus', 0)
          }
          this.showLogin = false
        })
      })
    },
    handlesearch () {
      if (this.searchValue.trim() === '') {
        this.$Message.info("内容不能为空哦...")
        return
      }
      get_search(this.searchValue).then(res => {
        console.log(res);
        if (res.data.course_data.length === 0 && res.data.school_data.length === 0 && res.data.teaher_data.length === 0) {
          this.$Message.info("暂无可搜的结果！")
        }
        this.$store.commit('setsearchResult', res.data)
        this.$router.push({ name: 'search_pages' })
      })
    },
    handlemessages () {
      this.$store.commit('setuserMessagess', true)
      if (this.userType === 1) {
        this.$router.push({
          path: '/teachingSystem/MyCourse/course_courseware'
        })
      } else {
        this.$router.push({
          path: '/teachingSystem/StudentCourse/course_coursewares'
        })
      }

    },
    // 头部未读消息
    async get_unread () {
      let res = await teacher_unread()
      console.log(res);
      if (res.data.commission_unread === 0 && res.data.remind_unread === 0 && res.data.system_unread === 0) {
        this.message_total = 0
      } else {
        this.message_total = 1
      }
    },
    async student_unread () {
      let res = await student_unread()
      console.log(res);
      if (res.data.commission_unread === 0 && res.data.remind_unread === 0 && res.data.system_unread === 0) {
        this.message_total = 0
      } else {
        this.message_total = 1
      }
    },
    showLoginModal () {
      this.showLogin = true
    },
    closeModal (e) {
      if (e.target.className === 'login-modal') {
        this.showLogin = false
      }
    }
  },
  mounted () {
    if (this.token !== '' && this.token !== false && this.token !== undefined && this.userId !== '') {
      if (this.userType === 1) {
        this.get_unread()
      } else {
        this.student_unread()

      }

    }
    this.setHomeRoute(routers)
    // this.$store.state.user.userInfo.userType === 2 ? this.getUnreadMessageCount() : this.sendunread()
    this.$store.commit('setcurrentTab', '我的课程')
    if (window.location.href.split('token=')[1] !== undefined) {
      let tok = window.location.href.split('token=')[1].split('#/')[0]
      if (tok !== undefined) {
        this.$store.commit('setToken', tok)
        this.getUserInfo().then(res => {
        })
      }
    }
  }
}
</script>
<style lang="less" >
.main-header {
  // position: fixed;
  z-index: 1000;
  height: 100%;
  width: 1200px !important;
  margin: 0 auto !important;
  padding: 10px 0;
}
.main-header > div {
  line-height: 60px;
  height: 100%;
}
.main-header > div img {
  vertical-align: middle;
  cursor: pointer;
}
.top-fixed-top {
  .search_input {
    display: flex;
    align-items: center;
  }
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 80px !important;
  background: #ffffff !important;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.07) !important;
}
.top-main-content {
  background: #fff;
}
.menu-list .ivu-menu-item {
  color: #6b6b6b !important;
  font-size: 14px;
  font-weight: 100;
}
.menu-list .ivu-menu-item-active {
  color: #000000 !important;
  font-size: 14px;
  font-weight: bold;
  border: none !important;
}
.login-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}
</style>
