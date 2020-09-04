<template>
  <div>
    <Row>
      <Col class="record">
      <Row class="record_List" v-for="item in recordlist" :key="item.id">
        <Col>
        <div class="record_List_img">
          <img :src="item.img" alt="">
        </div>
        </Col>
        <Col>
        <div class="record_List_description" v-html="item.description">
        </div>
        </Col>
        <Col>
        <div class="record_List_show">
          <div class="record_List_show1">{{item.is_show}}</div>
          <div class="record_List_show2">{{item.is_mooc}}</div>
          <div class="record_List_show3">{{item.is_charge}}</div>
        </div>
        </Col>
        <Col>
        </Col>
        <Col>
        </Col>
        <Col>
        </Col>
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
      const recordData = {
        page: 1,
        pagesize: 8,
        status: this.status
      }
      get_record(recordData).then((result) => {
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
    .record_List_show {
      padding: 0 10px;
      margin: 10px 0;
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      font-family: SimSun;
      font-weight: 400;
      color: #adadad;
    }
  }
}
</style>
