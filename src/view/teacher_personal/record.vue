<template>
  <div>
    <div v-if="recordlist.length===0">没有任何购买记录</div>
    <Row>
      <Col class="record">
      <Row class="record_List" v-for="item in recordlist" :key="item.id">
        <Col>
        <div class="record_List_img">
          <img :src="item.img" alt="">
        </div>
        </Col>
        <Col>
        <div class="record_List_description">
          {{item.course_name}}
        </div>
        </Col>
        <div class="record_List_schoolandmajor">
          <span>{{item.school_name}}</span>
          <span>{{item.major_name}}</span>
        </div>
        <Col>
        <div class="record_List_show">
          <div class="record_List_show1" v-if="item.play_count===null">0</div>
          <div class="record_List_show1" v-else>{{item.play_count}}</div>
          <div class="record_List_show2"></div>
          <div class="record_List_show3"></div>
        </div>
        </Col>
        <div class="record_List_user">
          <div class="record_List_user_icon"><img :src="item.icon" alt=""></div>
          <div class="record_List_user_icon" v-if="item.icon===''">
            <Icon type="md-person" />
          </div>
          <div class="record_List_user_name">{{item.user_name}}</div>
        </div>
      </Row>
      </Col>
    </Row>
  </div>
</template>

<script>
import { get_record } from '@/api/user'
// import log from 'video.js/es5/utils/log';
export default {

  name: '',
  data () {
    return {
      recordlist: []
    }
  },
  computed: {
    status () {
      return this.$store.state.user.hasGetInfo ? '1' : '0'
    }
  },
  methods: {
    get_record () {
      get_record(this.status).then((result) => {
        console.log(result)
        this.recordlist = result.data.data.order
      })
    }
  },
  mounted () {
    this.get_record()
  }
}
</script>

<style lang="less" scoped>
.record {
  display: flex;
  flex-wrap: wrap;

  justify-content: flex-start;
  .record_List {
    width: 22.3%;
    height: 260px;
    margin-right: 20px;
    margin-bottom: 20px;
    background: #ffffff;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.06);
    border-radius: 4px;
    .record_List_img {
      // width: 25%;
      height: 150px;
      img {
        width: 100%;
        height: 150px;
        border-radius: 4px 4px 0px 0px;
      }
    }
    .record_List_description {
      margin-top: 10px;
      margin-left: 10px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #030303;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
    }
    .record_List_schoolandmajor {
      display: flex;
      justify-content: space-between;
      padding: 5px 10px;
    }
    .record_List_show {
      padding: 0 10px;

      display: flex;
      justify-content: space-between;
      font-size: 12px;
      font-family: SimSun;
      font-weight: 400;
      color: #adadad;
      border-bottom: 1px solid #f1f1f1ff;
    }
    .record_List_user {
      display: flex;
      text-align: center;
      padding: 2px 3px;
      /deep/.ivu-icon {
        font-size: 20px;
      }
      .record_List_user_name {
        margin-left: 10px;
        font-size: 12px;
        font-family: SimSun;
        font-weight: 400;
        color: #646464;

        line-height: 24px;
      }
    }
  }
}
</style>
