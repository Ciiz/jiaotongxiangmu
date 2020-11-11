<template>
  <div class="team">
    <Row class="team_img">
      <col>
      <div class="team_img_img"></div>
      <!-- <img src="@/assets/images/login-bg.jpg" alt=""> -->
      <col>
    </Row>

    <Row class="team_school">
      <col>
      <Button type="info">
        <span>全部</span>
      </Button>
      <div class="team_school_list">
        <span v-for="(item,index) in schoolList" :key="index"><a href="#"
            @click="handleSchoolList(index)">{{item.school_name}}</a></span>
        <router-link to="partner">
          <Icon type="md-arrow-dropdown" size="20" color="#000" />
        </router-link>

      </div>
      </col>
    </Row>
    <div class="Divider">
      <Divider />
    </div>
    <Row class="teacher_team">
      <col>
      <div class="teacher_team_select">
        <div class="teacher_team_select_l">
          <Select v-model="model1" style="width:200px" placeholder="全部专业" @on-change='handle_major'>
            <Option v-for="item in majorList" :value="item.major_name" :key="item.major_id">{{ item.major_name }}
            </Option>
          </Select>

          <Input placeholder="" style="width: auto;margin-left:50px ;" v-model="searchvalue"
            @keyup.enter.native="handlesearch">
          <Icon type="ios-search" slot="suffix" @click.native="handlesearch" />
          </Input>
        </div>
        <div class="teacher_team_select_r">
          <!-- <div class="teacher_team_course">
            课程数量
            <div class="partner_icon1">
              <Icon type="md-arrow-dropup" color="red" size="8" />
              <Icon type="md-arrow-dropdown" size="8" />
            </div>
          </div>
          <div class="teacher_team_course">
            关注学生
            <div class="partner_icon1">
              <Icon type="md-arrow-dropup" color="red" size="8" />
              <Icon type="md-arrow-dropdown" size="8" />
            </div>
          </div> -->
        </div>
      </div>
      </col>
      <col>
      <div class="teacher_team_big">
        <div class="teacher_team_father">
          <div class="teacher_team_item" v-for="(item,index) in teacherList" :key="index"
            @click="$router.push({ path: `/teacher_homepage/${item.id}`})">
            <div class="teacher_team_item_top">
              <div class="teacher_team_item_img">
                <img :src="item.icon" alt="">
              </div>
              <div class="teacher_team_item_r">
                <span>{{item.name}}</span>
                <span>{{item.major_name}}</span>
                <span>{{item.school_name}}</span>
              </div>
            </div>
            <div class="teacher_team_item_buttom">
              <span class="teacher_team_item_buttom1">ta的课程：{{item.course_count}}</span>
              <span class="teacher_team_item_buttom2">ta的课程：{{item.student_count}}</span>
            </div>
          </div>
        </div>
        <div class="teacher_team_btn" v-if="moreteacherList.length>8" @click="handlemore">查看更多</div>
      </div>
      </col>

    </Row>

  </div>
</template>

<script>
import { get_recommend, get_search, taecherList_nologin } from '@/api/common.js'
import { get_taecherList } from '@/api/teacher'
export default {
  name: 'team',

  data () {
    return {
      schoolList: [],
      majorList: [],
      model1: '',
      teacherList: [],
      moreteacherList: [],
      teacherSelect: [],
      searchvalue: '',

    }
  },
  computed: {
    schoolId () {
      return this.$store.state.user.userInfo.schoolId
    },
    userType () {
      return this.$store.state.user.userInfo.userType
    },
  },
  methods: {
    handleSchoolList (index) {
      taecherList_nologin(this.schoolList[index].id).then(res => {
        console.log(res);

        if (res.data.teacher_list.length > 8) {
          this.teacherList = res.data.teacher_list.slice(0, 8)
        } else {
          this.teacherList = res.data.teacher_list
        }
        this.moreteacherList = res.data.teacher_list
        this.teacherSelect = res.data.teacher_list
      })



    },
    handlesearch () {
      get_search(this.searchvalue).then(res => {
        console.log(res);
        if (res.data.teaher_data.length !== 0) {
          this.teacherList = res.data.teaher_data
          this.moreteacherList.length = 8
        } else {
          this.teacherList = []
          this.$Message.info("暂无可搜的教师哦！")
          this.moreteacherList.length = 8
        }

      })
    },
    handlemore () {
      this.teacherList = this.moreteacherList
    },
    handle_major (value) {
      this.teacherList = this.teacherSelect.filter(v => {
        return v.major_name === value
      })
      this.moreteacherList.length = 8
      this.searchvalue = ''
    },
    // 获取教师列表
    get_command_teacher () {

      taecherList_nologin().then(res => {
        console.log(res);
        if (res.data.teacher_list.length > 8) {
          this.teacherList = res.data.teacher_list.slice(0, 8)
        } else {
          this.teacherList = res.data.teacher_list
        }
        this.moreteacherList = res.data.teacher_list
        this.teacherSelect = res.data.teacher_list


      })


    },
    // 获取学校列表
    getSchoolList () {
      this.schoolList = []
      this.axios
        .request({
          method: 'get',
          url: '/index.php/Home/Index/getSchoolList'
        })
        .then(res => {
          console.log(res);

          if (res.code === 200) {
            if (res.data.list.length >= 8) {
              res.data.list.length = 8
              this.schoolList = res.data.list
              console.log(res)
            }
            this.schoolList = res.data.list
          }
        })
    },
    getMajor () {
      // 获取所有学校所有专业信息
      this.axios
        .request({
          method: 'post',
          url: '/index.php/home/index/getAllMajor',
          data: {}
        })
        .then(res => {
          console.log(res)
          this.majorList = res.data.list
        })
    }
  },
  mounted () {
    this.getMajor()
    this.getSchoolList()
    this.get_command_teacher()
  }
}
</script>

<style lang="less" scoped>
.team {
  .Divider {
    width: 1200px;
    margin: 0 auto;
  }
  .team_img {
    display: flex;
    justify-content: center;
    //  align-items: center;
    margin: 20px auto;
    width: 1200px;
    height: 140px;

    .team_img_img {
      height: 100%;
      width: 100%;

      background: url(../../assets/images/login-bg.jpg) center center;
    }
    img {
      // border-radius: 4px;
      // // height: 100%;
      // width: 1200px;
      // width: 100%;
    }
  }
  .team_school {
    margin: 40px auto;
    width: 1200px;

    display: flex;
    align-items: center;
    // justify-content: space-around;
    // justify-content: space-between;

    .team_school_list {
      flex: 1;
      display: flex;
      align-items: center;
      // justify-content: space-around;
      justify-content: space-between;
      margin-left: 20px;

      span {
        a {
          color: #000;
          // font-size: 12px;
        }
        a:hover {
          color: #2ba4e7ff;
        }
      }
    }

    .ivu-btn-info {
      width: 61px;
      height: 24px;
      background: #32b6ff;
      border-radius: 12px;
      display: flex;
      align-items: center;
      text-align: center;
      justify-content: center;
      margin: 0;
      padding: 0;
    }
  }
  .teacher_team {
    .teacher_team_select {
      display: flex;
      margin: 0 auto;
      width: 1200px;
      justify-content: space-between;
      .teacher_team_select_r {
        display: flex;
        .teacher_team_course {
          display: flex;
          margin-left: 30px;
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
      /deep/.ivu-select-placeholder {
        text-align: center;
      }
    }
    .teacher_team_big {
      margin-top: 30px;
      background-color: #f8f8f8;
      padding: 20px 0;
      .teacher_team_father {
        width: 1200px;
        margin: 0 auto;
        display: flex;
        justify-content: flex-start;

        flex-wrap: wrap;
        .teacher_team_item:nth-child(4n) {
          margin-right: 0;
        }
        .teacher_team_item {
          width: 23%;
          // width: 280px;
          margin-right: 31px;
          background-color: #fff;
          margin-bottom: 20px;
          padding: 10px;
          border-radius: 5px;
          .teacher_team_item_top {
            display: flex;
            .teacher_team_item_img {
              width: 108px;
              height: 108px;
              border-radius: 8px;
              img {
                width: 108px;
                height: 108px;
                border-radius: 8px;
              }
            }
            .teacher_team_item_r {
              display: flex;
              flex-direction: column;
              margin-left: 15px;
              justify-content: space-around;
              span:nth-child(1) {
                font-size: 16px;
                font-family: Microsoft YaHei;
                font-weight: bold;
                color: #333333;
              }
              span:nth-child(2) {
                height: 12px;
                font-size: 14px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: #666666;
              }
              span:nth-child(3) {
                height: 13px;
                font-size: 14px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: #666666;
              }
            }
          }
          .teacher_team_item_buttom {
            margin-top: 10px;
            font-size: 12px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #919090;
            .teacher_team_item_buttom1 {
              margin-right: 40px;
            }
          }
        }
      }
      .teacher_team_btn {
        width: 187px;
        height: 48px;
        background: #2ba4e7;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #ffffff;
        margin: 20px auto;
      }
    }
  }
}
</style>
