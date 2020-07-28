<template>
<Row type="flex" style="position:absolute;height:100%;width:100%">
  <Col style="flex:1;padding:20px;overflow-y:scroll;height:100%">
    <ul>
      <li v-for="(item,index) in chapter_class_list" :key="index" class="courItem">
        <img :src="item.icon"/>
        <span>{{item.name}}</span>
        <Progress class="newprogress2" :percent="item.percent"/>
      </li>
    </ul>
  </Col>
  <Col :span="12">
    <div id="pie1" class="pie">
      <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
      <div id="main1" style="float:left;width:100%;height: 450px" />
    </div>
  </Col>
  <Spin fix v-show="loading"> </Spin>
</Row>
</template>

<script>
import modal_mixin from '@/view/mixins/modal_mixin'
import echarts from 'echarts'
export default {
  mixins: [modal_mixin],
  props: {
    chapter_class_id: ''
  },
  data () {
    return {
      chapter_class_list: [],
      grade: [],
      loading: false
    }
  },
  computed: {
    teacher_course_id () {
      return this.$store.state.user.courseData.teacher_course_id
    }
  },
  methods: {
    initData () {
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(document.getElementById('main1'))
      myChart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)' // 具体a b c d 代表的属性看下面注释啦
        },
        series: [
          {
            name: '课程进度总览', // formatter 中的a
            type: 'pie',
            radius: '50%',
            center: ['50%', '60%'],
            data: [
              { value: this.grade.grade4, name: '0-25%', itemStyle: { color: '#D8ECFF' }, label: { color: '#666666' }, labelLine: { lineStyle: { color: '#666666' } } },
              { value: this.grade.grade3, name: '25%-50%', itemStyle: { color: '#F5A623' } },
              { value: this.grade.grade2, name: '50-75%', itemStyle: { color: '#339DFF' } },
              { value: this.grade.grade1, name: '75%-100%', itemStyle: { color: 'red' } }
            ], // data 中的name为formatter中的 b；data中的value呢就是formatter中c；至于d就是Echarts计算出来的百分比啦；itemStyle:为饼图每个扇形的颜色；label为指示线后面的文字的样式，labelLine为指示线的颜色
            label: {
              normal: {
                show: true,
                textStyle: {
                  fontWeight: 400,
                  fontSize: 12 // 文字的字体大小
                },
                formatter: '{b} \n {c}人' // 这里为指示线后面的提示信息，这里的换行要用\n 与上面tooltips中的formatter换行不同滴
              }
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
      window.onresize = myChart.resize // 自适应浏览器窗口的大小
    },
    getData (c) {
      this.loading = true
      this.getStudentData(c)
      this.getStudentDataTotal(c)
      this.loading = false
    },
    getStudentData (c) {
      this.axios.request({
        method: 'post',
        url: '/index.php/Teacher/Course/studentProgress',
        data: {
          teacher_course_id: this.teacher_course_id,
          chapter_class_id: this.chapter_class_id,
          class: c
        }
      }).then(res => {
        if (res.code === 200) {
          this.chapter_class_list = res.data
        }
      })
    },
    getStudentDataTotal (c) {
      this.axios.request({
        method: 'post',
        url: '/index.php/Teacher/Course/gradeProgress',
        data: {
          teacher_course_id: this.teacher_course_id,
          chapter_class_id: this.chapter_class_id,
          class: c
        }
      }).then(res => {
        if (res.code === 200) {
          this.grade = res.data
          this.initData()
        }
      })
    }
  },
  mounted () {
  }
}
</script>

<style lang="less">
.newprogress2 .ivu-progress-bg{
  height: 6px!important;
}
.newprogress2 .ivu-progress-outer{
  margin-left: 36px;
}
.newprogress2.ivu-progress-show-info .ivu-progress-outer{
  padding-right: 62px;
  margin-right: -62px;
}
.courItem img{
  width: 30px;
  border-radius: 50%;
  vertical-align: middle;
  margin-right: 10px;
}
.courItem{
  padding: 10px 0;
}
</style>
