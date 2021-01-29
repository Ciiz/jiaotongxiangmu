<template>
  <div ref="dom" class="chart-container"></div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'attendanceChart',
  props: {
    option_data: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      dom: null,
      option: {
        title: {
          text: '考勤统计',
          subtext: '统计',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          bottom: 10,
          left: 'center',
          data: ['缺勤', '迟到', '正常', '早退']
        },
        series: [
          {
            type: 'pie',
            radius: '65%',
            center: ['50%', '50%'],
            selectedMode: 'single',
            data: this.option_data,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
    }
  },
  watch: {
    option_data: {
      handler (newVal, oldVal) {
        if (this.dom) {
          if (newVal) {
            this.option.series[0].data = newVal
            this.dom.setOption(this.option)
          }
        }
      },
      deep: true // 对象内部属性的监听，关键。
    }
  },
  methods: {
    setOption (data) {

    }
  },
  mounted () {
    this.$nextTick(() => {
      this.dom = echarts.init(this.$refs.dom)
      this.option.series[0].data = this.option_data
      this.dom.setOption(this.option)
    })
  }
}
</script>
<style lang="less" scoped>
.chart-container {
  width: 300px;
  height: 300px;
  margin: 0px auto;
}
</style>
