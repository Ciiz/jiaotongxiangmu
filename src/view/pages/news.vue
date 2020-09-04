<template>
  <div>

    <Row style="background: #424242;">
      <Col :span="14" :offset='5'>
      <swiper :options="swiperOption" ref="mySwiper">
        <!-- slides -->
        <swiper-slide v-for="banner in banner_list" :key="banner.id" class="swiper-slide-news">
          <!-- <div class="slide-item" @click="openBanner(banner)"> -->
          <div class="slide-item">
            <img :src="banner.img" alt="">
            <div class="content">
              <h2>{{banner.title}}</h2>
              <p>{{banner.desc}}</p>
            </div>
          </div>
        </swiper-slide>
        <!-- Optional controls -->
        <div class="swiper-pagination" slot="pagination"></div>
        <div class="swiper-button-prev swiper-button-white" slot="button-prev"></div>
        <div class="swiper-button-next swiper-button-white" slot="button-next"></div>
      </swiper>
      </Col>
    </Row>

    <Row>
      <Col :span="9" :offset="5" style="margin-right: 10px;">
      <div class="newsContain">
        <h2>校内资讯</h2>
        <div class="newsList">
          <Spin v-show="loading" fix></Spin>
          <Tabs value="0" @on-click="changeType">
            <TabPane label="新闻" name="0">
              <ul class="news-list">
                <li v-for="(item) in newsList" :key="item.id" @click="showContent(item.id)" class="news-item">
                  <div class="img">
                    <div v-if="item.cover!==''">
                      <img :src="item.cover" />
                    </div>
                  </div>
                  <div class="news-item-content">
                    <h3>{{item.title}}</h3>
                    <p class="desc">{{item.describe}}</p>
                    <div class="desc">
                      <span>
                        <Icon type="md-calendar" class="desc-ico" />{{getDate(item.created_at)}}</span>
                      <span style="float:right">
                        <Icon type="md-eye" :size="16" class="desc-ico" />{{item.views}}
                      </span>
                    </div>
                  </div>
                </li>
              </ul>
            </TabPane>
            <TabPane label="公告" name="1">
              <ul class="news-list">
                <li v-for="(item) in newsList" :key="item.id" @click="showContent(item.id)" class="news-item">
                  <div class="img">
                    <img :src="item.cover" />
                  </div>
                  <div class="news-item-content">
                    <h3>{{item.title}}</h3>
                    <p class="desc">{{item.describe}}</p>
                    <div class="desc">
                      <span>
                        <Icon type="md-calendar" class="desc-ico" />{{getDate(item.created_at)}}</span>
                      <span style="float:right">
                        <Icon type="md-eye" :size="16" class="desc-ico" />{{item.views}}
                      </span>
                    </div>
                  </div>
                </li>
              </ul>
            </TabPane>
          </Tabs>
        </div>
        <Page :total="this.total" :page-size="this.page_size" :current="this.page" @on-change="changePage"
          @on-page-size-change="changeSize" show-sizer size="small" show-total
          style="text-align:center;margin:0 0 10px 0" />
      </div>
      </Col>
      <Col :span="5">
      <div class="newsContain">
        <h2>最新资讯</h2>
        <div class="newsList">
          <Tabs value="0" @on-click="changeType2">
            <TabPane label="新闻" name="0">
              <ul>
                <li v-for="(item) in newsList2" :key="item.id" class="schoolnews-item">
                  <div style="display:flex;margin:10px 0">
                    <span class="Sdes" @click="showContent(item.id)">{{item.title}}</span>
                    <span class="Sfr">{{getDate(item.created_at)}}</span>
                  </div>
                </li>
              </ul>
            </TabPane>
            <TabPane label="公告" name="1">
              <ul>
                <li v-for="(item) in newsList2" :key="item.id" class="schoolnews-item">
                  <div style="display:flex;margin:10px 0">
                    <span class="Sdes" @click="showContent(item.id)">{{item.title}}</span>
                    <span class="Sfr">{{getDate(item.created_at)}}</span>
                  </div>
                </li>
              </ul>
            </TabPane>
          </Tabs>
          <Spin v-show="loading2" fix></Spin>
        </div>
      </div>
      </Col>
    </Row>
    <Modal v-model="modal" :title="title" width="1000" footer-hide :mask-closable="false">
      <newsContent :id="target_id" v-if="target === 'news'"></newsContent>
      <course-detail :teacher_course_id="target_id" v-if="target === 'course'"></course-detail>
    </Modal>
  </div>
</template>
<script>
import newsContent from '@/view/news/newsContent'
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { get_bannersIndex } from '@/api/common'
import modal_mixin from '@/view/mixins/modal_mixin'
export default {
  mixins: [modal_mixin],
  components: {
    newsContent,
    swiper,
    swiperSlide
  },
  data () {
    return {
      page: 1,
      page_size: 10,
      total: 0,
      modal: false,
      newsList: {},
      newsList2: {},
      title: '',
      id: '',
      type: 0,
      type2: 0,
      loading: false,
      loading2: false,
      banner_list: [],
      swiperOption: {
        spaceBetween: 30,
        // freeMode: true,
        observeParents: true,
        effect: 'coverflow',
        coverflowEffect: {
          rotate: 0,
          stretch: 10,
          depth: 160,
          modifier: 2,
          slideShadows: true
        },
        slidesPerView: 3,
        observer: true,
        observeSlideChildren: true,
        loop: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      }
    }
  },
  computed: {
    swiper () {
      return this.$refs.mySwiper.swiper
    }
  },
  methods: {
    getNewsData (p, z, t) {
      let _this = this
      _this.loading = true
      _this.axios
        .request({
          method: 'get',
          url: '/index.php/home/index/getNews',
          params: {
            page: p,
            page_size: z,
            type: t
          }
        })
        .then(res => {
          this.newsList = res.data.list
          this.total = res.data.count
          _this.loading = false
        })
    },
    getNewsData2 (t) {
      let _this = this
      _this.loading2 = true
      _this.axios
        .request({
          method: 'get',
          url: '/index.php/home/index/getNews',
          params: {
            page: 1,
            page_size: 10,
            type: t
          }
        })
        .then(res => {
          this.newsList2 = res.data.list
          _this.loading2 = false
        })
    },
    changePage (page) {
      this.page = page
      this.getNewsData(this.page, this.page_size, this.type)
    },
    changeSize (size) {
      this.page_size = size
      this.getNewsData(this.page, this.page_size, this.type)
    },
    showContent (id) {
      this.open('news', id, '新闻详情')
    },
    getDate (i) {
      return this.moment(i * 1000).format('YYYY-MM-DD')
    },
    changeType (val) {
      this.type = val
      this.page = 1
      this.getNewsData(this.page, this.page_size, this.type)
    },
    changeType2 (val) {
      this.type2 = val
      this.getNewsData2(this.type2)
    },
    get_banners (path) {
      get_bannersIndex({ path: path }).then(res => {
        if (res.code === 200) {
          this.$nextTick(function () {
            this.banner_list = res.data.list
          })
        }
      })
    },
    openBanner (banner) {
      switch (banner.redirect_type) {
        case 0: { // 新标签页打开
          window.open(banner.link)
          break
        }
        case 1: {
          this.open('course', banner.obj_id, banner.title)
          break
        }
        case 2: {
          this.open('course', banner.obj_id, banner.title)
          break
        }
      }
    }
  },
  mounted () {
    this.getNewsData(this.page, this.page_size, this.type)
    this.getNewsData2()
    this.get_banners('/news')
  }
}
</script>
<style lang="less">
.newsContain {
  min-height: 522px;
  background: #fff;
  padding: 10px;
}
.showImg {
  width: 60px;
  margin-right: 20px;
}
.newsTitle {
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
}
.Sdes {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}
.Sfr {
  width: 75px;
  float: right;
}

.news-item {
  cursor: pointer;
  margin: 5px;
  position: relative;
  padding: 8px;
  display: flex;
  transition: all 0.1s;
  &:hover {
    color: #1586b1;
    transition: all 0.1s;
    img {
      transform: scale(1.2);
    }
  }
  .img {
    width: 100px;
    overflow: hidden;
    display: inline-block;
    height: 70px;
    img {
      transition: all 0.1s;
      width: 100%;
    }
  }
  .news-item-content {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    flex: 1;
    margin-left: 10px;
    .desc {
      color: #999;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      word-wrap: break-word;
      word-break: break-all;
      .desc-ico {
        line-height: 15px;
        margin-right: 5px;
      }
    }
  }

  // ::after {
  //   content: "";
  //   position: absolute;
  //   bottom: 0;
  //   left: 120px;
  //   background: #000;
  //   width: 100%;
  //   height: 1px;
  //   background: #ccc;
  //   transform: scaleY(0.5);
  // }
}

.swiper-slide-news {
  width: auto;
}
.slide-item {
  height: 300px;
  overflow: hidden;
  cursor: pointer;
  margin: 5px;
  position: relative;
  .content {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 10px;
    color: #fff;
    background-image: linear-gradient(
      to top,
      rgba(0, 0, 0, 1),
      rgba(255, 255, 255, 0)
    );
  }
  &:hover {
    box-shadow: 1px 1px 9px #222;
  }
  img {
    height: 100%;
  }
}
.Sdes {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  cursor: pointer;
  &:hover {
    color: #1586b1;
  }
}
.schoolnews-item {
  margin: 15px 0;
  // border-bottom: 1px solid #e8eaec
}
.swiper-btn {
}
</style>
