<template>
  <div class="m-taskIndex flex-contain">
    <div class="m-taskIndex-header">
      <mt-button icon="back" style="margin:auto" @click="toRouter()"></mt-button>
      <mt-navbar v-model="selected" class="m-taskIndex-navbar">
        <mt-tab-item id="0">未完成任务</mt-tab-item>
        <mt-tab-item id="1">已完成任务</mt-tab-item>
      </mt-navbar>
      <mt-button icon="search" slot="right" style="margin:auto"></mt-button>
    </div>
    <mt-tab-container v-model="selected" style="flex:1;overflow-y:scroll;margin-top:3px">
      <mt-tab-container-item id="0">
        <!-- <mt-cell
          @click.native="linkTo(item)"
          class="m-cell"
          v-for="(item,index) in list"
          :key="index"
          :title="item.task_name"
          :label="'发布老师：'+item.teacher+' 截止时间：'+moment(item.end_time * 1000).format('YYYY-MM-DD HH:mm')"
          is-link
          >

          {{item.submit_status}}
          {{item.score_status}}
        </mt-cell> -->
        <div v-for="(item,index) in list" :key="index" class="m-taskItem" @click="linkTo(item)">
          <div class="m-taskItem-h-l">
            <div style="line-height:0.4rem;display:flex">
              <span v-if="item.release_type===1" class="m-blue-tag">小组</span>
              <span v-if="item.release_type===2" class="m-green-tag">个人</span>
              <span class="m-taskItem-title">{{item.task_name}}</span>
            </div>
            <div class="m-taskItem-info">
              <span style="margin-right:0.35rem">发布老师：{{item.teacher}}</span>
              <span>截止时间：{{moment(item.end_time * 1000).format('YYYY-MM-DD HH:mm')}}</span>
            </div>
            <div style="color:#3B9BFF">
              {{item.task_progress}}
           </div>
          </div>
          <div>
            <Icon type="ios-arrow-forward" />
          </div>
        </div>
      </mt-tab-container-item>
      <mt-tab-container-item id="1">
        <div v-for="(item,index) in list" :key="index" class="m-taskItem" @click="linkTo(item)">
          <div class="m-taskItem-h-l">
            <div style="line-height:0.4rem;display:flex">
              <span v-if="item.release_type===1" class="m-blue-tag">小组</span>
              <span v-if="item.release_type===2" class="m-green-tag">个人</span>
              <span class="m-taskItem-title">{{item.task_name}}</span>
            </div>
            <div class="m-taskItem-info">
              <span style="margin-right:0.35rem">发布老师：{{item.teacher}}</span>
              <span>截止时间：{{moment(item.end_time * 1000).format('YYYY-MM-DD HH:mm')}}</span>
            </div>
            <div style="color:#3B9BFF">
              {{item.task_progress}}
            </div>
          </div>
          <div>
            <Icon type="ios-arrow-forward" />
          </div>
        </div>
      </mt-tab-container-item>
    </mt-tab-container>
  </div>
</template>
<script>
import { Indicator } from 'mint-ui'
export default {
  data () {
    return {
      selected: '0',
      list: []
    }
  },
  watch: {
    selected (n, o) {
      this.getData()
    }
  },
  methods: {
    linkTo (item) {
      this.$router.push({ name: 'taskInfo', query: { teacher_id: item.teacher_id, id: item.id, is_team_leader: item.is_team_leader, type: 'task' } })
    },
    getData () {
      Indicator.open({
        text: '加载中...',
        spinnerType: 'fading-circle'
      })
      this.axios.request({
        url: '/index.php/Student/Task/page',
        method: 'get',
        params: {
          page_size: 100000,
          page_no: 1,
          keyword: '',
          type: 0, // 0:全部，1：课前，2：课中，3课后
          // student_course_id: this.student_course_id,
          // courseware_id: this.courseware_id,
          // teacher_course_id: this.teacher_course_id,
          score_status: -1,
          finish: this.selected,
          submit_status: -1
        }
      }).then(res => {
        if (res.code === 200) {
          let data = res.data
          this.list = data.list
        }
        Indicator.close()
      })
    },
    toRouter () {
      this.$router.push({ name: 'mobileUserCenter' })
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
