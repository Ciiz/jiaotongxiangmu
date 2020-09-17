<template>
  <div>
    <span class="like_all">共喜欢了{{like_list.length}}个课程:</span>
    <Row>
      <Col class="record">
      <Row class="record_List" v-for="(item,index) in like_list" :key="index">
        <Col>
        <div class="record_List_img">
          <img :src="item.img" alt="">
        </div>
        </Col>
        <Col>
        <div class="record_List_description" v-html="item.description" style="">
        </div>
        </Col>
        <Col>
        <div class="record_List_show">
          <div class="record_List_show1">{{item.delete_status}}</div>
          <div></div>
          <div>{{moment(item.created_at * 1000).format('HH:mm')}}</div>
        </div>
        <Divider />

        </Col>
        <Col class="like_teacher">
        <div class="like_teacher_name">
          <div class="like_teacher_name_icon"> <img :src="item.icon" alt=""></div>

          {{item.user_name}}
        </div>
        <div class="like_teacher_type">{{item.learn_price}}</div>
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
import { getMyCourseAttention } from '@/api/user'

export default {
  name: '',

  data () {
    return {
      like_list: []
    }
  },

  methods: {
    getMyCourseAttention () {
      getMyCourseAttention({ page: 1, pagesize: 8 }).then((result) => {
        console.log(result)
        this.like_list = result.data.data
      })
    }
  },
  mounted () {
    this.getMyCourseAttention()
  }
}
</script>

<style lang="less" scoped>
/deep/.ivu-divider-horizontal {
  margin: 10px 0;
}
.like_all {
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #666666;
}
.record {
  margin-top: 10px;
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
    .like_teacher {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 10px;
      .like_teacher_name {
        font-size: 12px;
        font-family: SimSun;
        font-weight: 400;
        color: #646464;
        display: flex;
        align-items: center;
        .like_teacher_name_icon {
          width: 20px;
          height: 20px;
          margin-right: 6px;
          img {
            width: 20px;
            height: 20px;
            border-radius: 50%;
          }
        }
      }
    }
  }
}
</style>
