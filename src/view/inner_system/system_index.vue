<template>
  <div class="layout">
    <Layout>
      <Header>
        <Menu mode="horizontal" theme="dark" active-name="1">
          <div class="layout-logo"></div>
          <div class="layout-nav">
            <span style="width:37px;height:37px;border-radius: 50%;"><img src="@/assets/images/system_inter/xaioxi.png"
                style="width:37px;height:37px;border-radius: 50%; background-color: red;" alt=""></span>
            <span style="width:46px;height:46px;border-radius: 50%;"><img
                style="width:46px;height:46px;border-radius: 50%;"
                src="@/assets/images/u=3730772664,138405132&fm=26&gp=0.jpg" alt=""></span>
          </div>
        </Menu>
      </Header>
      <Layout>
        <Sider hide-trigger :style="{background: '#fff'}">
          <Menu theme="light" active-name="1" width="auto">
            <MenuItem name="1" @click.native="routerTo(1)">
            <Icon custom="iconfont icon-location" :size="18" />
            课程管理
            </MenuItem>
            <MenuItem name="2" @click.native="routerTo(2)">
            <Icon custom="iconfont icon-chuizhifanzhuan" :size="18" />
            培训班管理
            </MenuItem>
            <MenuItem name="3" @click.native="routerTo(3)">
            <Icon type="md-heart" />
            个人试题库
            </MenuItem>
            <MenuItem name="4" @click.native="routerTo(4)">
            <Icon type="md-leaf" />
            资源管理
            </MenuItem>
            <MenuItem name="5" @click.native="routerTo(5)">
            <Icon type="md-leaf" />
            学员管理
            </MenuItem>
            <MenuItem name="6" @click.native="routerTo(6)">
            <Icon type="md-leaf" />
            组织考试
            </MenuItem>
          </Menu>
        </Sider>
        <Layout :style="{padding: '0 24px 24px'}">
          <keep-alive>
            <router-view />
          </keep-alive>
          <router-view v-if="!$route.meta.keepAlive"></router-view>
        </Layout>
      </Layout>
    </Layout>
  </div>
</template>

<script>
export default {
  name: '',

  data () {
    return {
    }
  },
  mounted () {
    this.routerTo(1)
  },

  methods: {
    routerTo (num) {
      if (num === 1) {
        this.$router.push({ path: '/system_index/course_adm' })
      } else if (num === 2) {
        this.$router.push({ path: '/system_index/training_adm' })
      } else if (num === 3) {
        this.$router.push({ path: '/system_index/person_test' })
      } else if (num === 4) {
        this.$router.push({ path: '/system_index/resource_adm' })
      } else if (num === 5) {
        this.$router.push({ path: '/system_index/students_adm' })
      } else if (num === 6) {
        this.$router.push({ path: '/system_index/organization_exam' })
      }

    },

  }
}

</script>

<style lang='less' scoped>
@media screen and (max-width: 1800px) {
  .ivu-layout-header,
  .ivu-layout-header {
    width: 1800px;
    background-color: #fff !important;
  }
}
.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  height: 100vh;
  .ivu-layout-sider {
    .ivu-layout-sider-children {
      ul {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        height: 50%;
      }
      .ivu-menu-item-active {
        background-color: #bbe2ff;
        // opacity: 0.65;
      }
      .ivu-menu-item-selected {
        color: #00aeff;
      }
      .ivu-menu-item {
        font-size: 18px;
        font-family: Microsoft YaHei;
        font-weight: bold;
      }
    }
  }
  .layout-nav {
    width: 10%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin-right: 70px;
  }
  .ivu-layout-header {
    background-color: #246ac1;
    .ivu-menu-dark {
      background-color: #246ac1;
    }
  }
}
.layout-logo {
  width: 100px;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  float: left;
  position: relative;
  top: 15px;
  left: 20px;
}
.ivu-layout {
  height: 100vh;
}
.ivu-menu-light.ivu-menu-vertical
  .ivu-menu-item-active:not(.ivu-menu-submenu):after {
  background: #246ac1;
}
.ivu-menu-vertical.ivu-menu-light:after {
  display: none;
}
</style>
