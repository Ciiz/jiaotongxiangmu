<template>
  <div class="m-coursewareInfo flex-contain">
    <mt-header title="课件信息">
      <router-link to slot="left">
        <mt-button icon="back" @click="$router.back(-1)"></mt-button>
      </router-link>
    </mt-header>
    <div class="m-coursewareInfo-contain hideScroll">
      <div>
        <div class="m-coursewareInfo-title">{{courseware_name}}</div>
        <div style="display:flex" class="m-coursewareInfo-info">
          <div style="flex:1">上课时间：{{class_time}}</div>
          <div>{{live_status===0?'未上课':(live_status===2?'已结束':'正在上课')}}</div>
        </div>
        <div><button class="m-b-btn-b" v-if="live_status.toString()==='2'">课堂回顾</button></div>
        <div><button class="m-b-btn-b" v-if="live_status.toString()==='1'||live_status.toString()==='3'" @click="entryLive(1)">进入</button></div>
        <div><button class="m-w-btn-b2" v-if="live_status.toString()==='0'||live_status.toString()==='2'" @click="entryLive(2)">查看PDF课件</button></div>
      </div>
      <div class="courseTask">
        <div>课前</div>
        <div>
          <div v-for="(item,index) in list.before" :key="index" class="courseTask-item">
            <div style="flex:1">{{item.name}}</div>
            <div>课前{{item.table_type===1?'任务':(item.table_type===2?'作业':'测试')}}</div>
          </div>
          <div v-if="list.before.length===0" class="unList">暂无课前安排</div>
        </div>
      </div>
      <div class="courseTask">
        <div>课中</div>
        <div>
          <div v-for="(item,index) in list.between" :key="index" class="courseTask-item">
            <div style="flex:1">{{item.name}}</div>
            <div>课中{{item.table_type===1?'任务':(item.table_type===2?'作业':'测试')}}</div>
          </div>
          <div v-if="list.between.length===0" class="unList">暂无课中安排</div>
        </div>
      </div>
      <div class="courseTask">
        <div>课后</div>
        <div>
          <div v-for="(item,index) in list.after" :key="index" class="courseTask-item">
            <div style="flex:1">{{item.name}}</div>
            <div>课后{{item.table_type===1?'任务':(item.table_type===2?'作业':'测试')}}</div>
          </div>
          <div v-if="list.after.length===0" class="unList">暂无课后安排</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import { Indicator } from 'mint-ui'
export default {
  data () {
    return {
      id: this.$route.query.id,
      courseware_name: this.$route.query.courseware_name,
      class_time: this.$route.query.class_time,
      live_status: this.$route.query.live_status,
      list: []
    }
  },
  computed: {
    student_courseware_id () {
      return this.$route.query.student_courseware_id
    },
  },
  watch: {

  },
  methods: {
    getData () {
      Indicator.open({
        text: '加载中...',
        spinnerType: 'fading-circle'
      })
      this.axios.request({
        url: '/index.php/Student/Courseware/subsidiary',
        method: 'get',
        params: {
          courseware_id: this.id
        }
      }).then(res => {
        if (res.code === 200) {
          this.list = res.data
        }
        Indicator.close()
      })
    },
    entryLive(i){
      if(i===1){
        this.$router.push({ name: 'mobileLiveStudent',query: { student_courseware_id: this.student_courseware_id, mode:this.live_status === 3 ? 'live' : 'pdf' } })
      }else if(i===2){
        this.$router.push({ name: 'mobileLiveStudent',query: { student_courseware_id: this.student_courseware_id, mode: 'pdf' } })
      }
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
<style>

</style>
