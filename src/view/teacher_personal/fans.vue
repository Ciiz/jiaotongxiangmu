<template>
  <div class="attention_main">

    <div class="analyzeSystem">
      <div :class="className" :id="id" :style="{height:height,width:width}" ref="myEchart" style="
box-shadow: 0px 6px 15px 3px rgba(64, 63, 63, 0.18); margin-bottom: 40px;margin-right: 20px;"></div>
      <div id="sex" style="width:400px;height:361px;" ref="sexs">
      </div>
    </div>
    <div id="main" style="width:400px;height:361px;margin-bottom: 20px;" ref="pillar"></div>
    <div v-if="fanList.length===0">还没有粉丝</div>
    <Row class="attention" v-for="(item,index) in fanList" :key="item.id">
      <Col class="attention_img">
      <img :src="item.icon" alt="">
      </Col>
      <Col class="attention_message">
      <div class="attention_message_header">
        <div class="attention_message_header_name">{{item.name}}</div>
        <span class="attention_message_header_name2" style="cursor:pointer"
          @click="$router.push({path:`/student_homepage/${item.id}`})">查看主页>></span>
      </div>
      <div class="attention_message_footer">
        <span>院校:{{item.school_name}} </span>
        <span>职业:{{item.major_name}}</span>
        <!-- <span>Ta的课程:&nbsp&nbsp{{item.course_count}}</span> -->
        <span v-if="item.course_count">Ta的课程:{{item.course_count}}</span>
        <span v-else style="width:66.5px;"></span>
      </div>
      </Col>
      <Col style="cursor:pointer" class="attention_cancel_f">
      <div @click="handle_unfollow(index)" class="attention_cancel">移除粉丝</div>
      </Col>
    </Row>
  </div>
</template>

<script>
import echarts from "echarts";
import { loveMe, unfollow_Attention } from '@/api/user'
export default {
  props: {
    className: {
      type: String,
      default: "yourClassName"
    },
    id: {
      type: String,
      default: "yourID"
    },
    width: {
      type: String,
      default: "430px"
    },
    height: {
      type: String,
      default: "317px"
    }
  },
  data () {
    return {
      fanList: [],
      chart: null,
      pillar: null,
      sex: null,
      class: [],
      major: [],
      majorlist: [],
      classlist: [],
      class_num: [],
      sexarr: [],
      sexname: []

    }
  },
  // beforeDestroy () {
  //   if (!this.chart) {
  //     return;
  //   }
  //   this.chart.dispose();
  //   this.chart = null;
  // },
  methods: {
    hh () {
      console.log(22);
    },
    // // 取消关注
    handle_unfollow (index) {
      this.fanList.forEach((v, i) => {
        if (i === index && this.fanList[index].attention_id !== '') {
          unfollow_Attention(this.fanList[index].attention_id).then(res => {
            console.log(res)
            if (res.message === '取消成功！') {
              this.$Message.success('移除成功！')
              this.fanList.splice(index, 1)
              console.log(this.fanList);
            } else {
              this.$Message.error('移除失败！')
            }
          })
        }
      })
    },
    initChart () {
      this.pillar = echarts.init(this.$refs.pillar);
      this.chart = echarts.init(this.$refs.myEchart);
      this.sex = echarts.init(this.$refs.sexs);
      this.sex.setOption({
        title: {
          text: '男女统计',
          // subtext: '纯属虚构',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 10,
          data: this.sexname
          // data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
        },
        series: [
          {
            name: '性别比例',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '30',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: this.sexarr
          }
        ]
      })
      this.chart.setOption({
        title: {
          text: '专业统计',
          // subtext: '纯属虚构',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: 'right',
          // bottom: 10,
          // data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
          data: this.major
        },
        series: [
          {
            name: '专业名称',
            type: 'pie',
            radius: '55%',
            center: ['40%', '50%'],
            data: this.majorlist,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
      this.pillar.setOption({
        title: {
          text: '班级统计'
        },
        color: ['#3398DB'],
        tooltip: {},
        legend: {
          data: ['数量']
        },
        xAxis: {
          // data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
          data: this.class
        },
        yAxis: {},
        series: [{
          name: '数量',
          type: 'bar',
          barWidth: 30,
          // data: [5, 20, 36, 10, 10, 20],
          data: this.class_num

        }]
      })
      // 把配置和数据放这里

    }
  },
  mounted () {

    loveMe().then(res => {
      console.log(res)
      this.fanList = res.data.data.student
      this.majorlist = res.data.data.major.map(v => {
        return {
          value: v.major_num,
          name: v.major_name
        }
      })
      console.log(this.majorlist);
      this.sexarr = res.data.data.sex.map(v => {
        return {
          value: v.sex_num,
          name: v.sex === 1 ? '男' : '女',
        }
      })
      this.major = res.data.data.major.map(v => {
        return v.major_name
      })
      this.sexname = this.sexarr.map(v => {
        return v.name
      })
      this.class = res.data.data.class.map(v => {
        return v.class_name
      })
      this.class_num = res.data.data.class.map(v => {
        return v.class_num
      })
      this.initChart();
    })
  }
}
</script>

<style lang='less' socped>
.attention_main {
  margin: 20px 0;
  .analyzeSystem {
    display: flex;
  }
}
.attention {
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  // align-items: center;

  .attention_img {
    width: 73px;
    height: 73px;
    img {
      width: 73px;
      height: 73px;
      border-radius: 50%;
    }
  }
  .attention_message {
    flex: 1;
    padding: 0 150px 40px 30px;

    border-bottom: 1px solid #eeeeee;
    .attention_message_header {
      display: flex;
      .attention_message_header_name {
        margin-right: 40px;
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: #444444;
      }
      .attention_message_header_name2 {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #3d92e2;
      }
    }
    .attention_message_footer {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #888888;
    }
  }
  .attention_cancel_f {
    padding-bottom: 69px;
    border-bottom: 1px solid #eeeeee;
    // background-color: red;
    .attention_cancel {
      width: 70px;
      height: 24px;
      line-height: 24px;
      text-align: center;
      background: #ffffff;
      border: 1px solid #cccccc;
      border-radius: 12px;
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #aaaaaa;
    }
  }
}
</style>
