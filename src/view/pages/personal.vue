<template>
  <div class="personal">
    <Row :gutter="16">
      <Col span="16">
      <Row>
        <Col class="personal_center" v-if="userType===1">
        <router-link class="personal_center_header" exact v-for="item in personal_tab" :key="item.title"
          :to="{path: item.path}">
          <div class="personal_center_header_icon">
            <img :src="item.imgsrc" alt="">
          </div>
          <div class="personal_center_header_title">
            {{item.title}}
          </div>
        </router-link>
        </Col>
        <Col class="personal_center" v-else>
        <router-link class="personal_center_header" exact v-for="item in student_tab" :key="item.title"
          :to="{path: item.path}">
          <div class="personal_center_header_icon">
            <img :src="item.imgsrc" alt="">
          </div>
          <div class="personal_center_header_title">
            {{item.title}}
          </div>
        </router-link>
        </Col>
      </Row>
      <div class="personal_center_list">
        <router-view></router-view>
      </div>
      </Col>
      <Col span="5" offset=3>
      <Row class="personal_right">
        <Col class="personal_right_title">
        相关推荐
        </Col>
        <Col>
        <div>
          <div class="personal_right_couseList" v-for="item in couseList" :key="item.id"
            @click="$router.push({ path: `/videojump/${item.id}` })">
            <div class="personal_right_couseList_img">
              <img :src="item.img" alt="">
            </div>
            <div>
              <div>{{item.course_name}}</div>
              <div class="personal_right_teacher_list">{{item.user_name}}</div>
            </div>
          </div>
        </div>
        </Col>
      </Row>
      </Col>
    </Row>

  </div>
</template>

<script>
// import { get_Course } from "@/api/common";
import { get_Course } from '@/api/common'
import log from 'video.js/es5/utils/log'

export default {
  name: 'personal',

  data () {
    return {
      student_tab: [
        {
          title: '个人资料',
          imgsrc: require('@/assets/images/personal/geren2.png'),
          path: '/personal/personaldata'
        },
        {
          title: '购买记录',
          imgsrc: require('@/assets/images/personal/goumai.png'),
          path: '/personal/record'
        },
        {
          title: '关注',
          imgsrc: require('@/assets/images/personal/guanzhu.png'),
          path: '/personal/attention'
        },
        {
          title: '喜欢',
          imgsrc: require('@/assets/images/personal/xihaun.png'),
          path: '/personal/like'
        },
        {
          title: '钱包',
          imgsrc: require('@/assets/images/personal/qianbao.png'),
          path: '/personal/wallet'
        }
      ],
      personal_tab: [
        {
          title: '个人资料',
          imgsrc: require('@/assets/images/personal/geren2.png'),
          path: '/personal/personaldata'
        },
        {
          title: '购买记录',
          imgsrc: require('@/assets/images/personal/goumai.png'),
          path: '/personal/record'
        },
        {
          title: '关注',
          imgsrc: require('@/assets/images/personal/guanzhu.png'),
          path: '/personal/attention'
        },
        {
          title: '喜欢',
          imgsrc: require('@/assets/images/personal/xihaun.png'),
          path: '/personal/like'
        },
        {
          title: '粉丝',
          imgsrc: require('@/assets/images/personal/fensi.png'),
          path: '/personal/fans'

        },
        {
          title: '钱包',
          imgsrc: require('@/assets/images/personal/qianbao.png'),
          path: '/personal/wallet'
        }
      ],
      couseList: []
    }
  },
  computed: {

    userId () {
      return this.$store.state.user.userId
    },
    userType () {
      return this.$store.state.user.userInfo.userType
    }

  },

  methods: {
    get_Course () {
      get_Course().then(res => {
        if (res.code === 200) {
          this.couseList = res.data.data.splice(0, 6)
        }

      })
    },

  },
  mounted () {
    this.get_Course()

  }

}
</script>

<style lang="less" scoped>
#nav a {
  text-decoration: none;
  color: #888888;
}
.personal {
  margin: 0 auto;
  width: 1200px;

  .personal_center {
    width: 70%;
    display: flex;
    justify-content: space-between;
    .router-link-exact-active {
      color: #3e92e2 !important;
      // background-color: red;
      // color: red !important;
      // color: #ffffff!important;
      // font-size: 30px !important;
      border-bottom: 1px solid #56a2ff;
    }
    .personal_center_header {
      display: flex;
      margin: 40px 0;
      align-items: center;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #888888;

      .personal_center_header_icon {
        margin-right: 10px;
        color: red;
      }
    }
  }
  .personal_right {
    margin: 50px 0;
    .personal_right_title {
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #222222;
    }
    .personal_right_couseList {
      display: flex;
      margin: 30px 0;
      align-items: center;
      .personal_right_teacher_list {
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #aaaaaa;
      }
      .personal_right_couseList_img {
        width: 60px;
        height: 60px;
        margin-right: 10px;
        img {
          width: 60px;
          height: 60px;
        }
      }
    }
  }
}
</style>
