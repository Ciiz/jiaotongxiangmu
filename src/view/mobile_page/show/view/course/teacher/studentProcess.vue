<template>
  <div class="m-chapterInfoT flex-contain">
    <mt-header title="查看学习进度">
      <router-link to slot="left">
        <mt-button icon="back" @click="back"></mt-button>
      </router-link>
    </mt-header>
    <div class="m-chapterInfoT-contain">
      <div class="m-chapterInfoT-name">{{course_name}}</div>
      <div id="myChart" :style="{width: '100%', height: '300px'}"></div>
      <div>
        <div class="m-chapterInfoT-title">
          {{title}}
        </div>
        <div>
          <div v-for="(item,index) in chapter_class_list" :key="index" class="m-chapterInfoT-item">
            <img :src="item.icon" />
            <span>{{item.name}}</span>
            <span>学号{{item.s_no}}</span>
            <span>完成度{{item.percent}}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import echarts from 'echarts'
export default {
  data () {
    return {
      grade: [],
      chapter_class_list: [],
      opinion: [],
      opinionData: [

      ]
    }
  },
  watch: {

  },
  computed: {
    teacher_course_id () {
      return this.$route.query.teacher_course_id
    },
    chapter_class_id () {
      return this.$route.query.chapter_class_id
    },
    course_name () {
      return this.$route.query.course_name
    },
    title () {
      return this.$route.query.title
    }
  },
  methods: {
    back () {
      history.go(-1)
    },
    getStudentData (c) {
      this.axios.request({
        method: 'post',
        url: '/index.php/Teacher/Course/studentProgress',
        data: {
          teacher_course_id: this.teacher_course_id,
          chapter_class_id: this.chapter_class_id
        }
      }).then(res => {
        if (res.code === 200) {
          this.chapter_class_list = res.data
        }
      })
    },
    getStudentDataTotal () {
      this.axios.request({
        method: 'post',
        url: '/index.php/Teacher/Course/gradeProgress',
        data: {
          teacher_course_id: this.teacher_course_id,
          chapter_class_id: this.chapter_class_id
        }
      }).then(res => {
        if (res.code === 200) {
          this.grade = res.data
          this.opinion =
          this.opinionData = [
            { value: this.grade.grade4, name: '0-25%', itemStyle: { color: '#D8ECFF' }, label: { color: '#666666' }, labelLine: { lineStyle: { color: '#666666' } } },
            { value: this.grade.grade3, name: '25%-50%', itemStyle: { color: '#F5A623' } },
            { value: this.grade.grade2, name: '50-75%', itemStyle: { color: '#339DFF' } },
            { value: this.grade.grade1, name: '75%-100%', itemStyle: { color: 'red' } }
          ]
          this.initData()
        }
      })
    },
    initData () {
      const charts = echarts.init(document.getElementById('myChart'))
      charts.setOption({
        tooltip: {
          trigger: 'item'

        },
        legend: {
          orient: 'vertical',
          x: 'right',
          y: 'bottom',
          data: this.opinion
        },
        series: [
          {
            name: '性别',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '30',
                  fontWeight: 'blod'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: this.opinionData
          }
        ]
      })
    }
  },
  mounted () {
    this.getStudentData()
    this.getStudentDataTotal()
  }
}
</script>
<style>

</style>
