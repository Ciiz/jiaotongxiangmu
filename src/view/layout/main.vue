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
              <MenuItem v-for="(menu,index) in menuList" :key="index" :name="menu.name" :to="menu.path" >
                <b>{{menu.title}}</b>
              </MenuItem>
            </Menu>
          </Col>
          <Col>
            <img src="@/assets/images/new-index/search.png" style="margin-right:20px">
            <span v-if="token===''||token===false||token===undefined||userId===''" @click="showLoginModal" style="cursor:pointer">登录</span>
            <img src="@/assets/images/new-index/message.png"  v-if="token!==''&&token!==false&&token!==undefined&&userId!==''">
            <user v-if="token!==''&&token!==false&&token!==undefined&&userId!==''" :message-unread-count="this.$store.state.user.userInfo.userType === 1 ? $store.state.user.userInfo.notice_total : unreadCount" :user-avatar="$store.state.user.userInfo.userType === 1 ?$store.state.user.userInfo.icon : userAvatar"/>
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
            <img src="@/assets/images/new-index/index-qo.png"/>
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
      <div class="login-modal" v-if="showLogin===true" @click="closeModal">
        <login-form @on-success-valid="handleSubmit"></login-form>
      </div>
    </Layout>
</template>
<script>
import maxLogo from '@/assets/images/new-index/logo.png'
import LoginForm from '_c/login-form'
import User from './components/user'
import routers from '@/router/routers'
// import config from '@/config'
import { mapActions, mapMutations } from 'vuex'
// const homeName = config.homeName
export default {
  components: {
    User, LoginForm
  },
  data () {
    return {
      showLogin: false,
      maxLogo: maxLogo,
      menuList: [
        {
          name: 'index',
          title: '首页',
          path: '/index'
        },
        {
          name: '',
          title: '校园慕课',
          path: ''
        },
        {
          name: '',
          title: '合作院校',
          path: ''
        },
        {
          name: '',
          title: '教师团队',
          path: ''
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
          this.showLogin = false
        })
      })
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
.main-header{
  // position: fixed;
  z-index: 1000;
  height: 100%;
  width: 1200px!important;
  margin: 0 auto!important;
  padding: 10px 0;
}
.main-header>div{
  line-height: 60px;
  height: 100%;
}
.main-header>div img{
  vertical-align: middle;
  cursor: pointer;
}
.top-fixed-top{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 80px!important;
  background: #FFFFFF!important;
  box-shadow:0px 0px 5px 0px rgba(0, 0, 0, 0.07)!important;
}
.top-main-content{
  background: #fff;
}
.menu-list .ivu-menu-item{
  color: #6B6B6B!important;
  font-size: 14px;
  font-weight: 100;
}
.menu-list .ivu-menu-item-active{
  color: #000000!important;
  font-size: 14px;
  font-weight: bold;
  border:none!important
}
.login-modal{
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,.5);
  z-index: 1000;
}
</style>
