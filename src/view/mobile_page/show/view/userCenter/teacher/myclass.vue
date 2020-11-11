<template>
  <div class="myclass">
    <mt-header title="我的班级" style="border-bottom: 1px solid #E5E5E5">
      <router-link to="/mobile/mobileUserCenter" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <div class="myclass_list">
      <ul>
        <li v-for="(v,i) in myclassList" :key="i">
          <span>{{v.class_name}}</span>
          <span>{{v.count}}人</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { get_mycalss } from "@/api/teacher"
import log from 'video.js/es5/utils/log'
export default {
  name: '',

  data () {
    return {
      myclassList: []
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.user
    },

  },
  methods: {},
  async mounted () {
    let res = await get_mycalss()
    console.log(res);
    this.myclassList = res.data

  }
}
</script>

<style lang="less" scoped>
.myclass {
  .myclass_list {
    background: #f3f3f3;
    height: 100vh;
    width: 100%;
    padding: 0.3rem 0;
    ul {
      width: 6.86rem;
      margin: 0 auto;
      li {
        margin-bottom: 0.3rem;
        width: 6.86rem;
        height: 1rem;
        background: #ffffff;
        box-shadow: 0px 6px 15px 3px rgba(64, 63, 63, 0.04);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 0.2rem;

        font-size: 0.3rem;
        font-family: PingFang SC;
        font-weight: bold;
        color: #333333;
      }
    }
  }
}
</style>
