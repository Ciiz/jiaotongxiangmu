<template>
  <div class="cheskDetails">
    <cell title="学生考勤">
      <span slot="left"><img src="@/assets/images/mobile_teacher/back.png" alt="" @click="$router.back(-1)"></span>
      <span slot="right"></span>
    </cell>
    <div class="cheskDetails_list">
      <div class="cheskDetails_list_item">
        <select id="select1" @change="chooseCore">
          <option style="display: none">请选择班级</option>
          <option class="option" value="" v-for="(v,i) in myclassList" :key="i" @click="handleclass(i)">{{v.class_name}}
          </option>
        </select>
        <select id="select2" v-if="isdisabled">
          <option style="display: none">暂无数据</option>
        </select>
        <select id="select2" @change="chooseCore2" v-else>
          <option style="display: none">请选择学期</option>
          <option class="option" value=""> 第一学期</option>
          <option class="option" value="2">第二学期 </option>

        </select>

        <!-- <span style="margin-left: 0.2rem;color:#707070;font-weight: 500;font-family: PingFang SC;">切换</span> -->
      </div>
      <div class="cheskDetails_listText">
        <ul>
          <li v-for="(v,i) in checklist" :key="i">
            <div class="cheskDetails_listText_time">上课时间 {{v.courseware_begin_time}}</div>
            <div class="cheskDetails_listText_coursetime">课时安排 第{{v.week}}周 星期{{v.day}} 第{{v.class_no}}节</div>
            <div class="cheskDetails_listText_footer">
              <div>
                <span>{{v.expected}}</span>
                <span>应到</span>
              </div>
              <div>
                <span>{{v.arrived}}</span>
                <span>已到</span>
              </div>
              <div>
                <span>{{v.normal}}</span>
                <span>正常</span>
              </div>
              <div>
                <span>{{v.late}}</span>
                <span>迟到</span>
              </div>
              <div>
                <span>{{v.leave_early}}</span>
                <span>早退</span>
              </div>
              <div>
                <span>{{v.obsent}}</span>
                <span>缺勤</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from 'mint-ui'
import cell from '@/view/mobile_page/components/public_cell'
import { get_mycalss } from "@/api/teacher"
export default {

  components: {
    cell
  },
  data () {
    return {
      checklist: [],
      myclassList: [],
      semesterList: [],
      status: false,
      isdisabled: true

    }
  },
  computed: {
    id () {
      return this.$route.params.id
    }
  },
  methods: {
    chooseCore () {
      // console.log(select1.options.selectedIndex);
      var id = this.myclassList[select1.options.selectedIndex - 1].id
      this.axios.request({
        url: '/index.php/teacher/attendance/get_attendance_list',
        method: 'get',
        params: {
          class_id: id,
          teacher_course_id: this.id,
        }
      }).then(res => {
        console.log(res);
        if (res.code === 200) {
          this.status = true
          this.isdisabled = false
          this.checklist = res.data.list
          this.semesterList = res.data.list
        }

      })
    },
    chooseCore2 () {
      if (this.status === true) {

        var id2 = this.myclassList[select2.options.selectedIndex - 1].id
        if (id2 === 1) {
          this.checklist = this.semesterList.filter(v => {

            return v.semester === 1
          })

        } else {
          this.checklist = this.semesterList.filter(v => {
            return v.semester === 2
          })


        }
      } else {
        Toast({
          message: '请先选择班级',
          duration: 2000
        })
        return
      }




    },
    handleclass (i) {
      console.log(i);

    },
    async getclass () {
      let res = await get_mycalss()
      console.log(res);
      this.myclassList = res.data
    }
  },
  mounted () {
    console.log(this.id);

    this.getclass()
    this.axios.request({
      url: '/index.php/teacher/attendance/get_attendance_list',
      method: 'get',
      params: {
        teacher_course_id: this.id,
      }
    }).then(res => {
      console.log(res);
      this.checklist = res.data.list

    })
  }
}
</script>

<style lang='less'>
.cheskDetails {
  .cheskDetails_list {
    height: 100vh;
    background-color: #f3f3f3ff;
    padding: 0.3rem 0;
    .cheskDetails_list_item {
      margin: 0 auto;
      width: 6.86rem;
      padding: 0 0.2rem;
      font-size: 0.28rem;
      font-family: PingFang SC;
      font-weight: 500;
      color: #333333;
      background: #ffffff;
      box-shadow: 0px 6px 15px 3px rgba(64, 63, 63, 0.04);
      border-radius: 8px;
      .option {
        border: none;
        outline: none;
      }
      #select1,
      #select2 {
        width: 3rem;
        height: 0.8rem;
        border: none;
        outline: none;
      }
    }
    .cheskDetails_listText {
      ul {
        width: 6.86rem;
        margin: 0 auto;
        li {
          width: 6.86rem;
          height: 2.19rem;
          background: #ffffff;
          box-shadow: 0px 6px 15px 3px rgba(64, 63, 63, 0.04);
          border-radius: 8px;
          margin-top: 0.5rem;
          padding: 0.2rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .cheskDetails_listText_time {
            font-size: 0.28rem;
            font-family: PingFang SC;
            font-weight: 400;
            color: #5b5b5b;
          }
          .cheskDetails_listText_coursetime {
            font-size: 0.28rem;
            font-family: PingFang SC;
            font-weight: 400;
            color: #333333;
          }
          .cheskDetails_listText_footer {
            display: flex;
            justify-content: space-between;
            div {
              display: flex;
              flex-direction: column;
              align-items: center;
              span:nth-child(1) {
                font-size: 0.28rem;
                font-family: PingFang SC;
                font-weight: 500;
                color: #0d0d0d;
              }
              span:nth-child(2) {
                font-size: 0.24rem;
                font-family: PingFang SC;
                font-weight: 400;
                color: #5b5b5b;
              }
            }
          }
        }
      }
    }
  }
}
</style>
