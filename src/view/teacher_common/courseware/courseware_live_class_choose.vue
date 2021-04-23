<template>
  <div style="padding:5px;overflow:auto">
    <CheckboxGroup v-model="class_id" @on-change="checkAllGroupChange($event)">
      <div v-for="item in classList" :key="item.class_id">
        <Checkbox :label="item.class_id">{{item.class_name}}</Checkbox>
      </div>
    </CheckboxGroup>
    <div class="modal-footer">
      <Button @click='confirm()' type="primary">确定</Button>
    </div>
    <div class="download_footer" v-if="live_status===3">
      <p> 直播上课需要开启 <a href="">职教沃云.exe </a>下载地址 <a href="">download <img style="width:11px"
            src="@/assets/images/xiazai.svg" alt=""></a>
      </p>
      <p style="margin-top: 10px;">下载安装后在桌面打开即可开始直播上课</p>
    </div>
    <Spin fix v-if="loading">
      <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
      <div>加载直播工具中...</div>
    </Spin>
    <!-- <Spin size="large" v-if="loading" fix></Spin> -->
  </div>
</template>
<script>
import { save_timetable } from '@/api/data'
import { getLoginExe } from '@/api/user'
import modal_mixin from '@/view/mixins/modal_mixin'
import log from 'video.js/es5/utils/log'
export default {
  mixins: [modal_mixin],
  components: {
  },
  props: {
    courseware_id: '',
    classList: {
      type: Array,
      default: () => {
        return []
      }
    },
    live_status: '',
    course_status: '',



  },
  data () {
    return {
      class_id: [],
      timer: null,
      loading: false,
      cur_timetable_list: [],
      timetable_id_list: []
    }
  },
  watch: {

  },
  methods: {
    checkAllGroupChange (value) {
      var arr = []
      this.classList.forEach(v => {
        if (value.length !== 0) {
          value.forEach(item => {
            if (v.class_id === item) {
              arr.push(v.timetable_id)

            }
          })
        }
      })
      this.timetable_id_list = arr

    },
    confirm () {
      let daylist = []
      let timetable_data_arr = this.$store.state.user.timetable_data
      let timetable_data = timetable_data_arr[0]
      console.log(timetable_data);
      if (timetable_data !== undefined && timetable_data !== []) {
        timetable_data_arr.forEach(v => {
          daylist.push(v.day)
        })
        this.cur_timetable_list.push({
          year: timetable_data.year,
          semester: timetable_data.semester,
          week: this.$store.state.user.week_table,
          day: daylist,
          class: timetable_data.class_no,
          timetable_id: this.timetable_id_list
        })
        save_timetable(
          {
            timetable_id: this.timetable_id_list,
            timetable_time_list: this.cur_timetable_list
          }
        ).then(res2 => {
        })
      }

      let id = this.$store.state.user.userInfo.schoolId
      let userType = this.$store.state.user.userInfo.userType
      let account = this.$store.state.user.userInfo.account
      let data = {
        class_type: '1',
        is_class: account + '_' + userType + '_' + id

      }
      // this.$router.push({ path: '/live_teacher', query: { courseware_id: this.courseware_id, class_id: this.class_id, live_status: this.live_status, course_status: this.course_status } })
      if (this.live_status === 3) {
        getLoginExe(data).then(res => {
          console.log(res);
          this.loading = true
          if (res.data.login_status === false) {
            this.$Message.success('需要开启直播工具直播！');
            this.timer = setInterval(() => {
              getLoginExe(data).then(res => {
                if (res.data.login_status === false) {
                } else {
                  this.loading = false
                  clearInterval(this.timer)
                  this.$router.push({ path: '/live_teacher', query: { courseware_id: this.courseware_id, class_id: this.class_id, live_status: this.live_status, course_status: this.course_status } })
                }
              })
            }, 10000)
          } else {
            this.loading = false
            clearInterval(this.timer)
            this.$router.push({ path: '/live_teacher', query: { courseware_id: this.courseware_id, class_id: this.class_id, live_status: this.live_status, course_status: this.course_status } })
          }
        })
      } else {
        this.$router.push({ path: '/live_teacher', query: { courseware_id: this.courseware_id, class_id: this.class_id, live_status: this.live_status, course_status: this.course_status } })
      }
    },
    handleVisiableChange (isShow) {
      if (!isShow) {
        this.target = ''
        this.$emit('finished')
      }
    },
    closePage () {
      this.$refs.coursewareLive.finnishClass()
    }
  },
  mounted () {
    console.log(this.classList);

  },
  destroyed () {
    clearInterval(this.timer)
  }
}
</script>
<style lang="less" scoped>
.demo-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}
</style>