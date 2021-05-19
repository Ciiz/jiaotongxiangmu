<template>
  <div class="course_adm">
    <Tabs value="name1" name='name_coures'>
      <TabPane label="我的课程" name="name1" tab='name_coures'>
        <div class="training_search">
          <Input placeholder="输入课程关键字" style="width: auto">
          <Icon type="ios-search" slot="suffix" />
          </Input>
          <Button loading type="primary" style="margin-right:90px">刷新</Button>
        </div>
        <div class="training_content">
          <div class="training_contentL">
            <Table :columns="columns1" :data="list" @on-row-click='handleselect' :row-class-name='rowName'>
            </Table>
          </div>
          <div class="training_contentR">
            <Tabs value="name_detail" name='name_child'>
              <!-- 课程详情 -->
              <TabPane label="课程详情" name="name_detail" tab='name_child'>
                <Row>
                  <Col span="12">
                  <Form class="course-form">
                    <FormItem label="课程封面" class="course-form-item">
                      <img :src="getCourseDetial.img" alt=""
                        style="width:80px;height:80px;border-radius: 4px;margin-left:15px">
                    </FormItem>
                    <FormItem label="课程班主任：" class="course-form-item">
                      <span>{{getCourseDetial.teacher_name}}</span>
                    </FormItem>
                    <FormItem label="课程直播时间：" class="course-form-item" v-if="getCourseDetial.is_live_course">
                      <span>{{moment(getCourseDetial.live_time[0].live_start_time * 1000).format('YYYY-MM-DD')}} -
                        {{moment(getCourseDetial.live_time[0].live_end_time * 1000).format('YYYY-MM-DD')}}</span>
                    </FormItem>
                    <FormItem label="课程标签：" class="course-form-item">
                      <span v-for="(v,i) in getCourseDetial.course_label" :key="i"
                        style="color:#00AEFF;margin-right:5px">
                        {{v}}
                      </span>
                    </FormItem>
                    <FormItem label="课程类型：" class="course-form-item">
                      <span style="color:#00AEFF;">{{getCourseDetial.course_type}}</span>

                    </FormItem>
                    <FormItem label="课程简介：" class="course-form-item">
                      <p> &nbsp</p>
                      <p style="text-indent:25px;">
                        {{getCourseDetial.description}}
                      </p>
                    </FormItem>
                  </Form>
                  </Col>
                  <Col span="12">
                  <div class="course_grade"
                    style="height: 100%;width: 518px;background: #F7F7F7;border-radius: 6px;padding: 10px;">
                    <span
                      style="color: #5B5B5B;font-size: 13px;font-weight: 400;font-family: Microsoft YaHei;margin-bottom:20px">课程评分</span>
                    <div style="margin-top:10px;display: flex; ">
                      <div
                        style="font-size: 25px;font-weight: bold;color: #FEB922;display: flex ;align-items: center;width:40%"
                        v-if="getCourseDetial.course_grade==null">暂未评分！</div>

                      <div
                        style="font-size: 25px;font-weight: bold;color: #FEB922;display: flex ;align-items: center;width:40%"
                        v-else>

                        {{getCourseDetial.course_grade}}分</div>
                      <div class="course_grade_img" style="display: flex;justify-content: space-between;width:70%;">
                        <div style="display: flex; flex-direction: column;">

                          <Rate disabled allow-half :value='5' />

                          <Rate disabled allow-half :value='4' />

                          <Rate disabled allow-half :value='3' />

                          <Rate disabled allow-half :value='2' />

                          <Rate disabled allow-half :value='1' />
                        </div>
                        <div class="course_grade_img2"
                          style="width: 100%;display: flex;flex-direction: column;justify-content: space-between;padding: 5px 0;">

                          <Progress :percent="precent.precent1" />
                          <Progress :percent="precent.precent2" />
                          <Progress :percent="precent.precent3" />
                          <Progress :percent="precent.precent4" />
                          <Progress :percent="precent.precent5" />

                        </div>
                      </div>
                    </div>
                  </div>
                  </Col>
                </Row>
              </TabPane>
              <!-- 课程内容 -->
              <TabPane label="课程内容" name="name_content" tab='name_child'>
                <Row style="padding-left: 15px;">
                  <Col span="15">
                  <div class="catalogue_course">

                    <div>
                      <span
                        style="color: #333333;font-weight: bold;font-family: Microsoft YaHei;font-size: 14px;margin-right:15px;">课程目录
                      </span>
                      <span v-if="chapterData.chapter !==[]">共{{chapterData.chapter.length}}节</span>
                    </div>

                    <div class="catalogue_list" style="cursor:pointer;padding:10px">
                      <div v-for="(v,i) in chapterData.chapter" :key="i">
                        <div @click="handleclick(i)">
                          <div
                            style="color: #333333;font-size: 14px;font-weight: 400;font-family: Microsoft YaHei;margin-top:10px;display: flex;justify-content: space-between; align-items: center;">
                            <div>
                              <span>{{i+1}},</span>
                              <span> {{v.title}}</span>
                            </div>
                            <img v-if="chapterData.chapter[i].expand" src="@/assets/images/system_inter/top.png" alt=""
                              style="width:16px;height:14px">
                            <img v-else src="@/assets/images/system_inter/btn.png" alt=""
                              style="width:16px;height:14px">
                          </div>
                        </div>
                        <ul>
                          <li v-if="v.child" v-for="(item,index) in v.child" :key="index"
                            v-show="chapterData.chapter[i].expand"
                            style="color: #333333;font-size: 14px;font-weight: 400;font-family: Microsoft YaHei;margin-top:10px;padding:10px">

                            <div style="display: flex;justify-content: space-between;">
                              <div>
                                <span>{{i+1}}.{{index+1}}</span>
                                <span>{{item.title}}</span>
                              </div>
                              <span>{{item.video_length}}</span>
                            </div>

                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div class="download_class">
                    <div class="download_classH">
                      <span
                        style="color: #333333;font-weight: bold;font-family:Microsoft YaHei;font-size: 14px;margin-right:15px;">附件下载</span>

                      <span v-if="chapterData.course_annex !==[]">共{{chapterData.course_annex.length}}个</span>
                    </div>
                    <div class="download_classF" v-for="(v,i) in chapterData.course_annex" :key="i"
                      style="color: #333333;font-size: 14px;font-family: Microsoft YaHei;font-weight: 400;">
                      <span>{{i+1}}, {{v.annex_name}}.{{v.Suffix}}</span>
                      <!-- <span style="color:#00AEFF">下载</span> -->
                      <a :href="v.file_url" download="MATERIAL.xls" class="download_btn">下载
                      </a>
                    </div>
                  </div>
                  </Col>

                  <Col span="9" style="display: flex;justify-content: center;align-items:center;margin-top:120px">
                  <div v-if="getCourseDetial.is_live_course"
                    style="display: flex;align-items:center;flex-direction: column;background-color: #00AEFF;color: #fff;padding: 20px;border-radius: 4px;">
                    <span>距离直播上课</span>
                    <p style="line-height: 50px;" class="time_list" v-html="countTxt"></p>
                    <Button v-if="live_time<0" style="background:#D0D0D0;border-radius: 4px;color:#fff">开启直播</Button>
                    <Button v-else>开启直播</Button>

                  </div>
                  </Col>
                </Row>
              </TabPane>
            </Tabs>

          </div>
        </div>
      </TabPane>
      <TabPane label="新建课程" name="name2" tab='name_coures'>新建课程</TabPane>
    </Tabs>
  </div>
</template>

<script>
import { getSuffix } from '@/libs/util'
// import log from 'video.js/es5/utils/log'
import { formateTimeStamp } from '@/view/inner_system/tools_time.js'
import { getCourse, getCourseDetial, get_Coursedetails } from '@/api/system'
import log from 'video.js/es5/utils/log'
export default {
  name: '',
  data () {
    return {
      index: '',
      precent: {
        precent1: 0,
        precent2: 0,
        precent3: 0,
        precent4: 0,
        precent5: 0
      },
      live_time: '',
      chapterData: {
        chapter: [],
        course_annex: []
      },
      TimeDown: null,
      isshow: false,
      getCourseDetial: {},
      course_id: '',
      timeStamp: '',
      time_now: '',
      times: {},
      countTxt: '',
      loading: true,
      list: [],
      columns1: [
        {
          title: '序号',
          width: 100,
          key: 'num',
          align: 'center',
          render: (h, params) => {
            // console.log(params);
            return (
              <div>
                {params.index + 1}
              </div>
            )
          }
        },
        {
          title: '封面',
          width: 100,
          key: 'cover',
          align: 'center',
          render: (h, params) => {

            return (
              <div>
                <img src={params.row.course_img} alt="" style='width:60px;height:60px'></img>
              </div>
            )
          }
        },
        {

          title: '课程名称',
          key: 'course_name',
          align: 'center',
          render: (h, params) => {
            return (
              <div style='display: flex;flex-direction: column;'>
                <span style='margin-bottom: 4px;'>《{params.row.course_name}》</span>
                <span v-show={params.row.is_live_course}>直播课</span>
                <span v-show={params.row.is_face_to_face}>面授课</span>
                <span v-show={params.row.is_live_course == 0 && params.row.is_face_to_face == 0}>自主课</span>

              </div>
            )
          }
        },
        {
          title: '状态',
          key: 'status',
          render: (h, params) => {
            return (
              <div>
                <span v-show={params.row.status == '未审核'} style='color:#FF787A'>{params.row.status}</span>
                <span v-show={params.row.status == '审核通过'} style='color:#00AEFF'>{params.row.status}</span>
                <span v-show={params.row.status == '审核不通过'} style='color:#19AB11'>{params.row.status}</span>
                <span v-show={params.row.status == '已提交审核'} style='color:#FEB922'>{params.row.status}</span>
                <div v-show={params.row.is_live_course === 1} style='color:#00AEFF'> {params.row.live_time}</div>
              </div>
            )
          }
        }
      ]
    }
  },
  computed: {
    time_down () {
      return this.$store.state.time_down
    },
  },
  methods: {

    rowName (row, index) {
      if (index == this.index) {

        return 'table-select-row'
      }
    },
    handleclick (i) {
      this.chapterData.chapter[i].expand = !this.chapterData.chapter[i].expand

    },
    async get_Coursedetails (id) {
      let res = await get_Coursedetails(id)
      console.log(res);
      this.chapterData = res.data
      this.live_time = res.data.live_time
      this.mistiming();
      this.chapterData.course_annex.map(v => {
        return v.Suffix = getSuffix(v.file_url)
      });
    },
    async getCourse () {
      let data = {
        search_word: '',
        page: '1',
        pagesize: '1000'
      }
      let res = await getCourse(data)
      // console.log(res);
      this.list = res.data.course
    },
    // 获得距离活动开始还剩余的时间
    mistiming () {
      this.timeStamp = this.live_time
      this.times = formateTimeStamp(this.timeStamp);
      // const str = `<span>${this.times.day}</span>天<span>${this.times.hour}</span>时<span>${this.times.min}</span>分<span>${this.times.seconds}</span>秒`
      // this.countTxt = str;
      this.TimeDown = setInterval(() => {
        if (this.timeStamp > 0) {
          this.timeStamp--;
          const newTime = formateTimeStamp(this.timeStamp);
          const str = `<span >${newTime.day}</span> <span  >天 </span><span >${newTime.hour}</span > <span >时</span><span >${newTime.min}</span> <span >分</span><span >${newTime.seconds}</span> <span >秒</span>`
          this.countTxt = str;
        } else {
          this.countTxt = '直播已开始'
          clearInterval(this.TimeDown);
        }
      }, 1000)
    },
    async handleselect (data, index) {
      this.index = index
      clearInterval(this.TimeDown);
      console.log(data);
      this.course_id = data.id
      let res = await getCourseDetial(this.course_id)
      this.getCourseDetial = res.data
      this.precent.precent1 = this.getCourseDetial.student_rate[0].precent1 * 100
      this.precent.precent2 = this.getCourseDetial.student_rate[0].precent2 * 100
      this.precent.precent3 = this.getCourseDetial.student_rate[0].precent3 * 100
      this.precent.precent4 = this.getCourseDetial.student_rate[0].precent4 * 100
      this.precent.precent5 = this.getCourseDetial.student_rate[0].precent5 * 100
      if (this.getCourseDetial.course_grade !== null) this.getCourseDetial.course_grade = Math.round(this.getCourseDetial.course_grade * 100) / 100
      this.get_Coursedetails(this.course_id)
    }
  },
  mounted () {
    setTimeout(() => {
      this.handleselect(this.list[0], 0)
    }, 1500)
    this.getCourse()

  }
}
</script>

<style lang='less' scoped>
/deep/.table-select-row td {
  background-color: #bbe2ff !important;
  color: #00aeff !important;
}
/deep/.ivu-progress-bg {
  background-color: #ffbc2e;
}
/deep/.ivu-progress-inner {
  background-color: #ffecc2;
}
/deep/.ivu-rate {
  display: flex;
  justify-content: flex-end;
}

/deep/.ivu-rate-star-zero {
  display: none;
}
/deep/.time_list {
  span {
    width: 30px;
    height: 30px;
    background: #ffffff;
    border-radius: 4px;
    color: #00aeff;
    padding: 2px;

    margin: 0 2px;
  }
}

/deep/.ivu-btn-default {
  color: #00aeff;
}
/deep/.ivu-table {
  width: 471px;
  overflow-y: scroll;
}
/deep/.ivu-tabs-bar {
  background-color: #fff;
  height: 48px;
}
/deep/.ivu-table-header table thead tr th {
  background-color: #fff;
  color: #666666;
}
/deep/.ivu-table-wrapper {
  height: 747px !important;
}
/deep/.ivu-tabs-tab {
  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: bold;
  color: #666666;
}
.course_adm {
  // background-color: #ececef;
  .training_search {
    background-color: #fff;
    // width: 1588px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    // margin-top: 5px;
  }
  .training_content {
    margin-top: 10px;
    display: flex;
    height: 100%;
    .training_contentL {
      width: 471px;
      height: 100%;
      margin-right: 10px;
    }
    .training_contentR {
      width: 100%;
      height: 750px;
      background-color: #fff;
      padding: 10px 15px;
      overflow-y: auto;
      .course-form {
        margin-left: 15px;
        .course-form-item {
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          color: #555555;
        }
      }
      .download_class {
        .download_classF {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
        }
      }
    }
  }
  .catalogue_course {
    .catalogue_list {
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
