<template>
  <div class="courseChapter" style="overflow-x: auto; overflow-y: auto; height: 572px;">
    <div class="courseChapter_list" v-for="(item,index) in list" :key="index">
      <div>
        <div class="courseChapter_title" @click="handleIsshow(index)">
          <div class="courseChapter_title1"> {{item.title}}</div>
          <div class="courseChapter_title2">
            <img src="@/assets/images/new_img/top.png" alt=""></div>
        </div>
        <div id="courseChapter_item" :class="`courseChapter_item ${active==v.id ? 'addcolor ' :''}` "
          ref="courseChapter_item" v-if="v.expand" v-for="(v,i) in item.child" :key="i" v-show="item.show_child"
          @click="handlevideo(v,i)">
          <span :class="`courseChapter_item_num ${active==v.id ? 'addcolor ' :''}`">{{i+1}}</span>
          <div class="courseChapter_item_r">
            <div :class="`courseChapter_item_rTop`">
              <span :class="`courseChapter_item_title ${active==v.id ? 'addcolor ' :''}`">{{v.title}}</span>
              <span :class="active==v.id ? 'addcolor ' :''">{{moment(v.created_at * 1000).format('YYYY.MM.DD')}}</span>
            </div>
            <div class="courseChapter_item_rFooter">
              <div class="courseChapter_item_rFooter1">
                <span v-if="v.play_count===null || v.play_count===undefined">0</span>
                <span v-else>{{v.play_count}}</span>
                <span class="video_length">{{moment(v.video_length * 1000).format('mm:ss')}}</span>
              </div>
              <span class="addcolor" v-if="active==v.id"> 播放中...</span>
              <span class="courseChapter_item_rFooter3" v-else><img src="@/assets/images/new_img/ing.png" alt=""></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default () {
        return {}
      }
    }
  },

  data () {
    return {
      active: -1,
    }
  },

  methods: {
    handlevideo (v, i) {
      var data = {
        file_url: v.file_url,
        stutas: false
      }
      if (v.file_url) {

        this.$emit("handlevideo", data)
      }
      this.active = v.id
      // scrollTo(0, 0);
    },
    handleIsshow (index) {
      console.log(this.list[index].show_child);
      this.list[index].show_child = !this.list[index].show_child

    }
  },
  mounted () {
    setTimeout(() => {
      console.log(this.list);
      if (this.list[0] && this.list[0].child) this.active = this.list[0].child[0].id
    }, 1200)
  }
}
</script>

<style lang="less" scoped>
.addcolor {
  color: #3b9bffff !important;
}
.courseChapter {
  padding: 0 10px;
  background-color: #fff;

  .courseChapter_list {
    padding: 10px 15px;
    .courseChapter_title {
      padding: 10px 0;
      border-bottom: 1px solid #eeeeeeff;
      display: flex;
      justify-content: space-between;
      .courseChapter_title1 {
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #333333;
      }
      .courseChapter_title2 {
        img {
          width: 10px;
        }
      }
    }
  }
  .courseChapter_item {
    display: flex;
    margin-top: 10px;
    .courseChapter_item_num {
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #000000;
      margin-right: 30px;
    }
    .courseChapter_item_r {
      flex: 1;
      border-bottom: 1px solid #e5e5e5ff;
      .courseChapter_item_rTop {
        display: flex;
        justify-content: space-between;
        span:nth-child(1) {
          font-size: 12px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #333333;
        }
        span:nth-child(2) {
          font-size: 12px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #bbbbbb;
        }
      }
      .courseChapter_item_rFooter {
        display: flex;
        justify-content: space-between;
        margin: 0.2rem 0;
        .courseChapter_item_rFooter1 {
          .video_length {
            margin-left: 0.4rem;
          }
        }
        .courseChapter_item_rFooter3 {
          img {
            width: 0.22rem;
            height: 0.2rem;
          }
        }
      }
    }
  }
}
</style>
