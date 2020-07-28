<template>
  <div>
    <div id="myChartsub" :style="{width: '1100px', height: '600px'}"></div>
    <div id="myChartobj" :style="{width: '1100px', height: '600px'}"></div>
  </div>
</template>
<script>
let echarts = require('echarts/lib/echarts')
// 引入柱状图组件
require('echarts/lib/chart/bar')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
export default {
  props: ['analyzelist'],
  data () {
    return {
      subledata: ['主观题平均分'], // 图例显示
      objledata: ['客观题平均分'], // 图例显示
      subxdata: [], // x轴显示
      subydata: [], // y轴显示
      objxdata: [], // x轴显示
      objydata: [], // y轴显示
      testdata: [],
      datalist: {},
      max: 0
    }
  },
  created () {
    this.datalist = this.analyzelist
    this.$nextTick(() => {
      if (!Array.isArray(this.datalist.data.list)) {
        let objective = this.datalist.data.list.objective
        let subjective = this.datalist.data.list.subjective
        for (let item in subjective) {
          this.objxdata.push(`第${item}题`)
          this.objydata.push(subjective[item])
        }
        for (let item in objective) {
          this.subxdata.push(`第${item}题`)
          this.subydata.push(objective[item])
        }
      }
    })
  },
  watch: {
    testvalue (newvalue) {
      this.datalist = this.analyzelist
    }
  },
  computed: {
    testvalue () {
      return this.analyzelist
    }
  },
  methods: {
    drawLine () {
      let myChartsub = echarts.init(document.getElementById('myChartsub'))
      myChartsub.setOption({
        title: {
          text: '主观题平均分',
          subtext: '如果需要，可以点击右边按钮切换显示模式或者保存为图片'
        },
        legend: {
          data: this.subledata,
          y: '80px'
        },
        grid: {
          left: '8%',
          right: '4%',
          bottom: '3%',
          top: '20%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis'
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            magicType: { show: true, type: ['line', 'bar'] },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            boundaryGap: true,
            data: this.subxdata,
            name: '题号',
            nameTextStyle: {
              fontWeight: 'bold',
              fontSize: 14
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '平均分',
            nameTextStyle: {
              fontWeight: 'bold',
              fontSize: 14
            }
          }
        ],
        series: [
          {
            name: '主观题平均分',
            type: 'line',
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  fontSize: 14,
                  textStyle: {
                  }
                }
              }
            },
            data: this.subydata,
            symbol: 'circle',
            symbolSize: 8
          }
        ]
      })
      let myChartobj = echarts.init(document.getElementById('myChartobj'))
      myChartobj.setOption({
        title: {
          text: '客观题平均分',
          subtext: '如果需要，可以点击右边按钮切换显示模式或者保存为图片'
        },
        legend: {
          data: this.objledata,
          y: '80px'
        },
        grid: {
          left: '8%',
          right: '4%',
          bottom: '3%',
          top: '20%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis'
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            magicType: { show: true, type: ['line', 'bar'] },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            boundaryGap: true,
            data: this.objxdata,
            name: '题号',
            nameTextStyle: {
              fontWeight: 'bold',
              fontSize: 14
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '平均分',
            nameTextStyle: {
              fontWeight: 'bold',
              fontSize: 14
            }
          }
        ],
        series: [
          {
            name: '客观题平均分',
            type: 'line',
            itemStyle: {
              normal: {
                lineStyle: {
                },
                label: {
                  show: true,
                  fontSize: 14,
                  textStyle: {
                  }
                }
              }
            },
            data: this.objydata,
            symbol: 'circle',
            symbolSize: 5
          }
        ]
      })
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.drawLine()
    })
  }
}
</script>
<style>

</style>
