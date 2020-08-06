<template>
  <div class="m-taskIndex flex-contain">
    <div class="m-taskIndex-header">
      <mt-button icon="back" style="margin:auto" @click="toRouter()"></mt-button>
      <mt-navbar v-model="submit_status" class="m-taskIndex-navbar">
        <mt-tab-item id="0">未完成</mt-tab-item>
        <mt-tab-item id="1">已完成</mt-tab-item>
      </mt-navbar>
      <mt-button icon="search" slot="right" style="margin:auto"></mt-button>
    </div>
    <mt-tab-container v-model="submit_status" style="flex:1;overflow-y:scroll;margin-top:3px">
      <mt-tab-container-item id="0">
        <mt-cell
          class="m-homework-cell"
          @click.native="linkTo(item,'homework')"
          v-for="(item,index) in homeworkList"
          :key="index"
          :title="item.homework_name"
          :label="'发布老师：'+' '+' 截止时间：'+moment(item.end_time * 1000).format('YYYY-MM-DD HH:mm')"
          is-link
          >
          <span slot="icon" class="m-blue-tag">作业</span>
        </mt-cell>
        <mt-cell
          @click.native="linkTo2(item)"
          class="m-homework-cell"
          v-for="(item,index) in examlist"
          :key="index"
          :title="item.exam_name"
          :label="'发布老师：'+' '+' 截止时间：'+moment(item.end_time * 1000).format('YYYY-MM-DD HH:mm')"
          is-link
          >
          <span slot="icon" class="m-blue-tag" style="background:#FF7272">测试</span>
        </mt-cell>
      </mt-tab-container-item>
      <mt-tab-container-item id="1">
        <mt-cell
          class="m-homework-cell"
          @click.native="linkTo(item,'homework')"
          v-for="(item,index) in homeworkList"
          :key="index"
          :title="item.homework_name"
          :label="'发布老师：'+' '+' 截止时间：'+moment(item.end_time * 1000).format('YYYY-MM-DD HH:mm')"
          is-link
          >
          <span slot="icon" class="m-blue-tag">作业</span>
        </mt-cell>
        <mt-cell
          class="m-homework-cell"
          @click.native="linkTo2(item)"
          v-for="(item,index) in examlist"
          :key="index"
          :title="item.exam_name"
          :label="'发布老师：'+' '+' 截止时间：'+moment(item.end_time * 1000).format('YYYY-MM-DD HH:mm')"
          is-link
          >
          <span slot="icon" class="m-blue-tag" style="background:#FF7272">测试</span>
        </mt-cell>
      </mt-tab-container-item>
    </mt-tab-container>
  </div>
</template>
<script>
import { Indicator } from 'mint-ui'
export default {
  data () {
    return {
      submit_status: '0',
      homeworkList: [],
      examlist: []
    }
  },
  watch: {
    submit_status (n, o) {
      this.getData()
    }
  },
  methods: {
    linkTo (item, type) {
      this.$router.push({ name: 'taskInfo', query: { id: item.id, type: type } })
    },
    linkTo2 (item) {
      this.$router.push({ name: 'examInfo', query: { examInfoId: item.id } })
    },
    getHomework () {
      this.axios.request({
        url: '/index.php/Student/Homework/page',
        method: 'get',
        params: {
          page_size: 100000,
          page_no: 1,
          score_status: -1,
          submit_status: this.submit_status
        }
      }).then(res => {
        if (res.code === 200) {
          let data = res.data
          this.homeworkList = data.list
        }
      })
    },
    getExam () {
      this.axios.request({
        url: '/index.php/Student/Exam/page',
        method: 'get',
        params: {
          page_size: 10000,
          page_no: 1,
          submit_status: this.submit_status
        }
      }).then(res => {
        if (res.code === 200) {
          let data = res.data
          this.examlist = data.list
        }
        Indicator.close()
      })
    },
    getData () {
      Indicator.open({
        text: '加载中...',
        spinnerType: 'fading-circle'
      })
      this.getHomework()
      this.getExam()
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
