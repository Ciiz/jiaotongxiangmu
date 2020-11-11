<template>
  <div class="partner">
    <div class="partner_img">
      <img src="@/assets/images/login-bg.jpg" alt />
    </div>
    <div class="partner_lists">
      <Row>
        <Col>
        <div class="partner_lists_header">
          <div class="partner_lists_header_left">合作院校</div>
          <div class="partner_lists_header_right">
            <div class="partner_lists_header_right1">综合排序</div>
            <div class="partner_lists_header_right2">
              教师数量
              <div class="partner_icon1">
                <Icon type="md-arrow-dropup" color="red" size="8" />
                <Icon type="md-arrow-dropdown" size="8" />
              </div>
            </div>
            <div class="partner_lists_header_right3">课程数量
              <div class="partner_icon2">
                <Icon type="md-arrow-dropup" color="red" size="8" />
                <Icon type="md-arrow-dropdown" size="8" />
              </div>
            </div>
          </div>
        </div>
        </Col>
      </Row>
    </div>

    <Row class="partner_lists_content">

      <ul>
        <li v-for="(item,index) in schoolList" :key="index">

          <Row type="flex">

            <Col class="li_img" type="flex">
            <img :src="item.school_icon" style="width:73px;height:73px;margin-right:10px;border-radius:50%;" />
            </Col>
            <Col style="flex:1">
            <div class="index-school-name" style="font-size:18px;">{{item.school_name}}</div>
            <Row>
              <Col>
              <span style="font-size:14px;">拥有课程：{{item.course_num}}</span>
              </Col>
              <Col>
              <span style="font-size:14px;">拥有教师：{{item.teacher_num}}</span>
              </Col>
            </Row>
            </Col>

          </Row>
        </li>
      </ul>

    </Row>
  </div>
</template>

<script>
export default {
  name: 'partner',

  data () {
    return {
      schoolList: []
    }
  },

  methods: {
    getSchoolList () {
      // 获取学校列表
      this.schoolList = []
      this.axios
        .request({
          method: 'get',
          url: '/index.php/Home/Index/getSchoolList'
        })
        .then(res => {
          if (res.code === 200) {
            this.schoolList = res.data.list
          }
        })
    }
  },
  mounted () {
    this.getSchoolList()
  }
}
</script>

<style lang='less' scoped>
.partner {
  .partner_img {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 31px 0;
    img {
      width: 1200px;
      height: 320px;
      border-radius: 4px;
    }
  }
  .partner_lists {
    display: flex;

    justify-content: center;
    .partner_lists_header {
      width: 1200px;
      padding: 14px 0;
      margin-bottom: 34px;
      border-bottom: 1px solid #000000;
      display: flex;
      justify-content: space-between;
      .partner_lists_header_left {
        font-size: 20px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: rgba(44, 164, 231, 1);
        line-height: 24px;
      }
      .partner_lists_header_right {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(136, 136, 136, 1);
        line-height: 19px;
        display: flex;
        justify-content: space-between;
        .partner_lists_header_right2 {
          margin: 0 39px;
        }
        .partner_lists_header_right2,
        .partner_lists_header_right3 {
          display: flex;
          .partner_icon1,
          .partner_icon2 {
            display: flex;
            flex-direction: column;
            .ivu-icon-md-arrow-dropup {
              line-height: 0.8;
              padding: 0;
              margin: 0;
            }
          }
        }
      }
    }
  }
  .partner_lists_content {
    display: flex;
    justify-content: center;
    align-items: center;

    ul {
      width: 1200px;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;

      li {
        &:hover {
          box-shadow: 1px 1px 9px #ccc;
        }
        .li_img {
          margin: auto 0;
        }
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        margin-right: 21px;
        width: 284px;
        padding-left: 9px;
        height: 100px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.06);
        border-radius: 5px;
      }
      li:nth-child(4n) {
        margin-right: 0 !important;
      }
    }
  }
}
</style>
