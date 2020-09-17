<template>

  <div class="m-course flex-contain">
    <!-- <search v-if="showsearch===true" @closemodal="closemodal"></search> -->
    <div class="m-course-header-bc"></div>
    <div class="m-course-header">
      <div @click="$router.push({name:'searchpage'})">
        <img src="@/assets/images/mobile_student/search.png" class="m-search-icon" />
        <input class="mobile-searchInput" placeholder="搜索课程、教师、院校" />
      </div>
      <div>
        <img src="@/assets/images/mobile_student/seachImage.png" class="m-seachImage" />
      </div>
    </div>
    <mt-navbar v-model="selected" class="m-mt-navbar">
      <mt-tab-item id="recommend">推荐</mt-tab-item>
      <mt-tab-item id="2">视频课程</mt-tab-item>
      <mt-tab-item id="3">VR全景</mt-tab-item>
      <mt-tab-item id="4">文本课程</mt-tab-item>
      <mt-tab-item id="5">更多</mt-tab-item>
    </mt-navbar>
    <div style="background:#ffffff">
      <mt-swipe :auto="4000" class="m-swipe">
        <mt-swipe-item v-for="(item,index) in banner_list" id="item.id" :key="index" class="m-swipe-item">
          <img :src="item.img" style="width:100%;height:100%" />
        </mt-swipe-item>
      </mt-swipe>
    </div>
    <mt-tab-container v-model="selected">
      <mt-tab-container-item id="recommend">
        <recommend></recommend>
      </mt-tab-container-item>

      <mt-tab-container-item id="2">
        2
      </mt-tab-container-item>
      <mt-tab-container-item id="3">
        3
      </mt-tab-container-item>
    </mt-tab-container>

  </div>
</template>
<script>

import { get_bannersIndex } from '@/api/common'
import recommend from '@/view/mobile_page/show/view/index/recommend/recommend.vue'
import search from '@/view/mobile_page/show/view/searchpage.vue'

export default {
  components: { recommend, search },
  data () {
    return {
      banner_list: [],
      selected: 'recommend',
      showsearch: false,
      allLoaded: false
    }
  },
  methods: {
    // loadTop () {
    //   // load more data
    //   this.$refs.loadmore.onTopLoaded();
    // },
    // loadBottom () {
    //   // load more data
    //   this.allLoaded = true;// if all data are loaded
    //   this.$refs.loadmore.onBottomLoaded();
    // },
    get_banners (path) {
      get_bannersIndex({ path: path }).then(res => {
        if (res.code === 200) {
          // 只要dom或者数据发生变化完成之后才会执行你定义的this.$nextTick方法
          this.$nextTick(function () {
            this.banner_list = res.data.list
          })
        }
      })
    },
    closemodal () {
      this.showsearch = false
    }
  },
  mounted () {
    this.get_banners('/news')
  }
}
</script>
<style>
</style>
