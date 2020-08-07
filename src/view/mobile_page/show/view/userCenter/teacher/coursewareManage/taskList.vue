<template>
  <div class="flex-contain">
    <mt-header title="任务管理">
      <router-link to slot="left">
        <mt-button icon="back" @click="back"></mt-button>
      </router-link>
    </mt-header>
    <div class="m-taskList-contain hideScroll">
      <Collapse v-model="value1" class="m-Collapse">
        <Panel name="1">
            课前
            <div slot="content">
              <div v-for="(item,index) in beforeList" :key="index" class="m-taskList-item" @click="showDetail(item.task_release_id)">
                <div class="m-taskList-item-name">{{item.task_name}}</div>
                <div class="m-taskList-item-bottom">
                  <span>开始：{{moment(item.start_time * 1000).format('YYYY-MM-DD HH:mm')}}</span>
                  <span>截止：{{moment(item.end_time * 1000).format('YYYY-MM-DD HH:mm')}}</span>
                </div>
              </div>
            </div>
        </Panel>
        <Panel name="2">
            课中
            <div slot="content">
              <div v-for="(item,index) in inList" :key="index" class="m-taskList-item" @click="showDetail(item.task_release_id)">
                <div class="m-taskList-item-name">{{item.task_name}}</div>
                <div class="m-taskList-item-bottom">
                  <span>开始：{{moment(item.start_time * 1000).format('YYYY-MM-DD HH:mm')}}</span>
                  <span>截止：{{moment(item.end_time * 1000).format('YYYY-MM-DD HH:mm')}}</span>
                </div>
              </div>
            </div>
        </Panel>
        <Panel name="3">
            课后
            <div slot="content">
              <div v-for="(item,index) in afterList" :key="index" class="m-taskList-item" @click="showDetail(item.task_release_id)">
                <div class="m-taskList-item-name">{{item.task_name}}</div>
                <div class="m-taskList-item-bottom">
                  <span>开始：{{moment(item.start_time * 1000).format('YYYY-MM-DD HH:mm')}}</span>
                  <span>截止：{{moment(item.end_time * 1000).format('YYYY-MM-DD HH:mm')}}</span>
                </div>
              </div>
            </div>
        </Panel>
      </Collapse>
    </div>
  </div>
</template>
<script>

export default {
  data () {
    return {
      value1: ['1', '2', '3'],
      beforeList: [],
      inList: [],
      afterList: []
    }
  },
  watch: {

  },
  computed: {
    timetable_id () {
      return this.$route.query.timetable_id
    },
    id () {
      return JSON.parse(this.$route.query.id)
    }
  },
  methods: {
    back () {
      window.history.go(-1)
    },
    getData () { // 课前
      this.axios.request({
        url: '/index.php/Teacher/Task/index',
        method: 'get',
        params: {
          type: 1, // 1:课前, 2课中 课后  任务
          page: 1,
          courseware_id: this.id,
          timetable_id: this.timetable_id,
          release: 2
        }
      }).then(res => {
        if (res.code === 200) {
          this.beforeList = res.data.task_list
        }
      })
    },
    getData2 () { // 课中
      this.axios.request({
        url: '/index.php/Teacher/Task/index',
        method: 'get',
        params: {
          type: 2, // 1:课前, 2课中 课后  任务
          page: 1,
          courseware_id: this.id,
          timetable_id: this.timetable_id,
          release: 2
        }
      }).then(res => {
        if (res.code === 200) {
          this.inList = res.data.task_list
        }
      })
    },
    getData3 () { // 课后
      this.axios.request({
        url: '/index.php/Teacher/Task/index',
        method: 'get',
        params: {
          type: 3, // 1:课前, 2课中 课后  任务
          page: 1,
          courseware_id: this.id,
          timetable_id: this.timetable_id,
          release: 2
        }
      }).then(res => {
        if (res.code === 200) {
          this.afterList = res.data.task_list
        }
      })
    },
    showDetail (i) {
      this.$router.push({ name: 'mobileTaskDetailT', query: { task_release_id: i } })
    }
  },
  mounted () {
    this.getData()
    this.getData2()
    this.getData3()
  }
}
</script>
