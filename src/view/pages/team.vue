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
      <div style="display:flex;justify-content:space-between;width:100%">
        <div style="display:flex;width:100%">
          <span
            style="width:75px;height:30px;border-radius: 5px;cursor:pointer;display: flex;align-items:center;justify-content: center;"
            :class="{colortaem:ststus_color}" @click="handleSchoolList('全部')">全部</span>
          <div class="allschool_list" style="cursor:pointer">
            <span v-for="(item,index) in schoolList" :key="index" class="allschool_listItem2"
              :class="{colorIndex:index_color===index}">
              <span href="#" @click="handleSchoolList(index)">{{item.school_name}}</span>
            </span>
          </div>
        </div>
        <div ref="DropdownMenu2">
          <div @click="isshows=!isshows">
            <Icon type="md-arrow-dropup" size="24" v-if="isshows" />
            <Icon type="md-arrow-dropdown" size="24" v-else />
          </div>
          <div class="DropdownMenu" v-show="isshows">
            <div class="DropdownMenu_item">
              <span v-for="(v,i) in DropdownItem_schoolList" :key="i" class="allschool_listItem"
                :class="{coloritem:index_color===i}" @click="handleSchoolList(i)">{{v.school_name}}</span>
            </div>
          </div>
        </div>
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

        </div>
      </div>
      </col>
      <col>
      <div class="teacher_team_big">
        <div class="teacher_team_father">
          <div v-if="teacherList.length===0"> 暂无教师推荐！</div>
          <div class="teacher_team_item" v-for="(item,index) in teacherList" :key="index"
            @click="$router.push({ path: `/teacher_homepage/${item.id}`})">
            <div class="teacher_team_item_top">
              <div class="teacher_team_item_img">
                <img src="@/assets/images/u=3730772664,138405132&fm=26&gp=0.jpg" alt="" v-if="item.icon===''">
                <img :src="item.icon" v-else alt="">
              </div>
              <div class="teacher_team_item_r">
                <span>{{item.name}}</span>
                <span>专业：{{item.major_name}}</span>
                <span class="teacher_team_item_style">{{item.school_name}}</span>
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
      isshows: false,
      schoolList: [],
      majorList: [],
      model1: '',
      teacherList: [],
      moreteacherList: [],
      teacherSelect: [],
      searchvalue: '',
      DropdownItem_schoolList: [],
      index_color: null,
      ststus_color: false,
      id: ''

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
    handle_icon2 (e) {
      if (this.$refs.DropdownMenu2.contains(e.target)) {
        return
      } else {
        this.isshows = false
      }
    },
    handleSchoolList (index) {


      if (index === '全部') {
        this.ststus_color = true
        this.index_color = null
      } else {
        this.ststus_color = false
        this.index_color = index
        console.log(this.DropdownItem_schoolList[index]);

        if (this.DropdownItem_schoolList[index].id) {

          this.id = this.DropdownItem_schoolList[index].id

        }
        else if (this.schoolList[index].id) {
          this.id = this.schoolList[index].id
        }
        console.log(this.id);
        taecherList_nologin(
          this.id
        ).then(res => {
          console.log(res);

          if (res.data.teacher_list.length === 0) {
            this.$Message.error('该专业暂时没有课程推荐...')
          }
          if (res.data.teacher_list.length > 8) {
            this.teacherList = res.data.teacher_list.slice(0, 8)
          } else {
            this.teacherList = res.data.teacher_list
          }
          this.moreteacherList = res.data.teacher_list
          this.teacherSelect = res.data.teacher_list


        })
      }




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
            this.DropdownItem_schoolList = res.data.list
            if (res.data.list.length >= 6) {
              this.schoolList = res.data.list.slice(0, 6)
            } else {
              this.schoolList = res.data.list
            }

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
    document.addEventListener('click', this.handle_icon2)
    this.getMajor()
    this.getSchoolList()
    this.get_command_teacher()
  },
  destroyed () {

    document.removeEventListener('click', this.handle_icon2)
  }
}
</script>

<style lang="less" scoped>
// .colortaem {
//   background: #32b6ff;
//   color: #fff;
// }
.coloritem {
  color: #32b6ff;
}
.colorIndex {
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #32b6ff;
  border-radius: 5px;
}
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
  }
  .team_school {
    margin: 40px auto;
    width: 1200px;

    display: flex;
    align-items: center;
    .DropdownMenu {
      // width: 1200px;
      width: 100%;
      background-color: #ffffff;
      box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
      box-sizing: border-box;
      border-radius: 4px;
      z-index: 1000;
      position: absolute;
      left: 10px;
      top: 50px;
      padding: 10px;
      .DropdownMenu_item {
        display: flex;
        flex-wrap: wrap;
        cursor: pointer;
        span {
          width: 20%;
          padding: 5px 0;
        }
      }
    }
    .allschool_list {
      display: flex;
      align-items: center;
      width: 100%;
      .allschool_listItem2 {
        width: 16.6%;
        height: 30px;
        display: flex;
        padding: 0 7px;
        justify-content: center;
        align-items: center;
      }
    }
    .team_school_list {
      display: flex;
      flex-wrap: wrap;
      align-items: center;

      .allschool_listItem {
        height: 30px;
        margin: 0 30px;
        padding: 0 7px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }
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
              .teacher_team_item_style {
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
                overflow: hidden;
              }
              span:nth-child(1) {
                font-size: 16px;
                font-family: Microsoft YaHei;
                font-weight: bold;
                color: #333333;
              }
              span:nth-child(2) {
                font-size: 14px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: #666666;
              }
              span:nth-child(3) {
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
