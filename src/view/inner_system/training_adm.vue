<template>
  <div class="traning_adm">
    <Tabs value="name1" name='name1'>
      <TabPane label="我的培训班" name="name1" tab='name1'>
        <div class="training_search">
          <Input placeholder="输入课程关键字" style="width: auto">
          <Icon type="ios-search" slot="suffix" />
          </Input>
          <Button loading type="primary" style="margin-right:90px">刷新</Button>
        </div>
        <Row class="training_content" :gutter="16">
          <Col span="6" class="training_contentL">
          <Table :columns="columns" :data="list" @on-row-click='handleselect' :row-class-name='rowName' width='471'
            height='740'>
          </Table>
          </Col>
          <Col span="17" class="training_contentR">
          <Tabs value="name_detail" name='name_detai'>
            <!-- 培训班详情 -->
            <TabPane label="培训班详情" name="name_detail" tab='name_detai'>
              <Row>
                <Col span="12">
                <Form class="course-form">
                  <FormItem label="培训班名称：" class="course-form-item">
                    《{{ trainingDetials.class_name }}》
                  </FormItem>
                  <FormItem label="培训班封面：" class="course-form-item">
                    <img :src="trainingDetials.img" alt=""
                      style="width:80px;height:80px;border-radius: 4px;margin-left:15px">
                  </FormItem>
                  <FormItem label="培训班班主任：" class="course-form-item">
                    <div style="display: flex;">
                      <div class="training_adviser_name">
                        {{trainingDetials.class_main_adviser_name}}
                      </div>
                      <p>
                        <span>讲师：</span>
                        <span style="padding:0 5px" v-for="(v,i) in trainingDetials.class_adviser_list"
                          :key="i">{{v.name}}</span>
                      </p>
                    </div>
                  </FormItem>
                  <FormItem label="报名人数:" class="course-form-item">
                    <div style="display:flex;">
                      <div class="training_enroll_num">
                        {{trainingDetials.enroll_num}}
                      </div>
                      <p class="training_enroll_num2">
                        <span>实际人数：</span>
                        <span>{{trainingDetials.actuality_num}}</span>
                      </p>
                    </div>
                  </FormItem>
                  <FormItem label="培训班标签：" class="course-form-item">
                    <span v-for="(v,i) in trainingDetials.label" :key="i" style="color:#00AEFF;margin-right:5px">
                      {{v}}
                    </span>
                  </FormItem>
                  <FormItem label="培训班类型：" class="course-form-item">
                    <span style="color:#00AEFF;">{{trainingDetials.category_name}}</span>
                  </FormItem>
                  <FormItem label="培训班简介：" class="course-form-item">
                    <!-- <div v-html="course.description"></div> -->
                  </FormItem>
                </Form>
                </Col>
                <Col span="12">
                <div class="course_grade"
                  style="height: 100%;width: 518px;background: #F7F7F7;border-radius: 6px;padding: 10px;">
                  <span
                    style="color: #5B5B5B;font-size: 13px;font-weight: 400;font-family: Microsoft YaHei;margin-bottom:20px">培训班评分</span>
                  <div style="margin-top:10px;display: flex; ">
                    <div
                      style="font-size: 25px;font-weight: bold;color: #FEB922;display: flex ;align-items: center;width:40%"
                      v-if="trainingDetials.student_rate==0">暂未评分！</div>
                    <div
                      style="font-size: 25px;font-weight: bold;color: #FEB922;display: flex ;align-items: center;width:40%"
                      v-else>

                      {{trainingDetials.student_rate}}分</div>
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
            <!-- 培训班安排 -->
            <TabPane label="培训班安排" name="name_content" tab='name_detai'>
              <progressLook @handle_back='handle_back' v-if="show_id"></progressLook>
              <trainingArrange @handleclick='handleclick' v-else></trainingArrange>
            </TabPane>
            <!-- 查看考勤 -->
            <TabPane label="查看考勤" name="name_check" tab='name_detai'>
              <Row class="name_check" :gutter="10">
                <Col span="12" class="name_checkL">
                <div class="name_checkL_selct">
                  <!-- :load-data="loadData" -->
                  <Cascader :data="data4" placeholder='线下课程名称' style="width:300px"></Cascader>
                  <Cascader :data="data4" placeholder='签到名称查询' style="width:300px"></Cascader>
                </div>
                <Row class="name_checkL_content">
                  <Col span="12" style="display:flex; flex-direction: column;">
                  <span>学生人数：0</span>
                  <span style="margin-top:10px">缺勤人数：0</span>
                  </Col>
                  <Col span="12">
                  <div style="float:right;clear:both;display:flex; flex-direction: column">
                    <span>实到人数：0</span>
                    <span style="margin-top:10px">迟到人数：0</span>
                  </div>
                  </Col>
                </Row>

                <div class="name_checkL_chart">
                  <span>考勤统计图</span>
                  <div>
                    39288888888888888888888884
                  </div>
                </div>

                </Col>

                <Col span="6" class="name_checkR">
                二维码
                </Col>
              </Row>
              <div class="name_checkL_table">
                <Table border :columns="columns2" :data="arrangeList" width='1082'></Table>
                <!-- <Table :columns="columns2" :data="list2" height="200" width='100%' border> -->
                </Table>
              </div>
            </TabPane>
            <!-- 查看学生相册 -->
            <TabPane label="查看学生相册" name="name_photo" tab='name_detai'>

            </TabPane>

          </Tabs>

          </Col>
        </Row>
      </TabPane>

      <TabPane label="考核评价" name="name2" tab='name1'>
        <div>kaowqardswa</div>
        <div>kaowqardswa</div>
        <div>kaowqardswa</div>
        <div>kaowqardswa</div>
        <div>kaowqardswa</div>
        <div>kaowqardswa</div>
        <div>kaowqardswa</div>
        <div>kaowqardswa</div>
        <div>kaowqardswa</div>
        <div>kaowqardswa</div>
        <div>kaowqardswa</div>
        <div>kaowqardswa</div>
        <div>kaowqardswa</div>
        <div>kaowqardswa</div>
        <div>kaowqardswa</div>
        <div>kaowqardswa</div>
        <div>kaowqardswa</div>
        <div>kaowqardswa</div>
        <div>kaowqardswa</div>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import { get_Traininglist } from '@/api/system'
import trainingArrange from '@/view/components/training_arrange'
import progressLook from '@/view/components/progress_look'
// import log from 'video.js/es5/utils/log'
export default {
  name: '',
  components: { trainingArrange, progressLook },
  data () {
    return {
      arrangeList: [],
      precent: {
        precent1: 0,
        precent2: 0,
        precent3: 0,
        precent4: 0,
        precent5: 0
      },
      trainingDetials: {},
      index: '',
      show_id: '',
      value: '8888',
      data4: [
        {
          value: 'beijing',
          label: '北京',
          children: [],
          loading: false
        },
        {
          value: 'hangzhou',
          label: '杭州',
          children: [],
          loading: false
        }
      ],
      loading: true,
      list: [],
      columns: [
        {
          title: '序号',
          width: 100,
          key: 'num',
          align: 'center',
          render: (h, params) => {

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
                <img src={params.row.img} alt="" style='width:60px;height:60px'></img>
              </div>
            )
          }
        },
        {

          title: '培训班名称',
          key: 'class_name',
          align: 'center',
          render: (h, params) => {
            return (
              <div >
                <span style='margin-bottom: 4px;'>《{params.row.class_name}》</span>

              </div>
            )
          }
        },
        {
          title: '状态',
          key: 'status',
          render: (h, params) => {
            return (
              <div >
                <span v-show={params.row.release_status === 0} style='margin-bottom: 4px;'>未发布</span>
                <span v-show={params.row.release_status === 1} style='margin-bottom: 4px;'>已发布</span>

              </div>
            )
          }
        }
      ],
      columns2: [
        {
          title: '序号',
          key: 'name'
        },
        {
          title: '学生姓名',
          key: 'age'
        },
        {
          title: '考勤地点',
          key: 'address'
        },
        {
          title: '考勤名称',
          key: 'address'
        },
        {
          title: '考勤时间',
          key: 'address'
        },
        {
          title: '考勤情况',
          key: 'address'
        }
      ],
      data2: [
        {
          name: 'John Brown',
          age: 18,
          address: 'New York No. 1 Lake Park',
          date: '2016-10-03'
        },
        {
          name: 'Jim Green',
          age: 24,
          address: 'London No. 1 Lake Park',
          date: '2016-10-01'
        },
        {
          name: 'Joe Black',
          age: 30,
          address: 'Sydney No. 1 Lake Park',
          date: '2016-10-02'
        },
        {
          name: 'Jon Snow',
          age: 26,
          address: 'Ottawa No. 2 Lake Park',
          date: '2016-10-04'
        }
      ]
    }
  },
  methods: {
    rowName (row, index) {
      if (index == this.index) {
        return 'table-select-row'
      }
    },
    async get_Traininglist () {
      let res = await get_Traininglist()
      console.log(res);
      this.list = res.data
    },
    handleselect (data, index) {
      this.index = index
      // console.log(data);
      this.trainingDetials = data
      this.precent.precent1 = this.trainingDetials.student_rate_list.precent1 * 100
      this.precent.precent2 = this.trainingDetials.student_rate_list.precent2 * 100
      this.precent.precent3 = this.trainingDetials.student_rate_list.precent3 * 100
      this.precent.precent4 = this.trainingDetials.student_rate_list.precent4 * 100
      this.precent.precent5 = this.trainingDetials.student_rate_list.precent5 * 100
      if (this.trainingDetials.student_rate !== null) this.trainingDetials.student_rate = Math.round(this.trainingDetials.student_rate * 100) / 100
    },
    handleclick (id) {
      console.log(id);
      this.show_id = id
    },
    handle_back (data) {
      this.show_id = data
    }
  },
  mounted () {
    this.get_Traininglist()
    setTimeout(() => {
      this.handleselect(this.list[0], 0)
    }, 1500)
  }
}
</script>

<style lang='less' scoped>
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
/deep/.table-select-row td {
  background-color: #bbe2ff !important;
  color: #00aeff !important;
}
/deep/.ivu-tabs-bar {
  background-color: #fff;
  height: 48px;
}
/deep/.ivu-table-header table thead tr th {
  background-color: #fff;
  color: #666666;
}
/deep/.ivu-tabs-tab {
  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: bold;
  color: #666666;
}

.traning_adm {
  height: 100%;
  .training_search {
    background-color: #fff;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .training_content {
    margin-top: 10px;
    display: flex;
    height: 100%;
    .training_contentL {
      width: 471px;
      margin-right: 15px;
    }
    .training_contentR {
      background-color: #fff;
      padding: 10px 15px;
      .course-form {
        margin-left: 15px;
        .course-form-item {
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          color: #555555;
          .training_adviser_name,
          .training_enroll_num {
            padding: 0 5px;
            margin-right: 50px;
          }
        }
      }
      .training_arrange {
        .training_arrangeL {
          display: flex;
          justify-content: space-between;
          span {
            font-size: 16px;
            font-family: Microsoft YaHei;
            font-weight: bold;
            color: #333333;
          }
        }
      }
      .name_check {
        .name_checkL {
          .name_checkL_selct {
            display: flex;
            justify-content: space-between;
          }
          .name_checkL_content {
            margin-top: 20px;
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #333333;
          }
          .name_checkL_chart {
            margin-top: 20px;
            span {
              font-size: 14px;
              font-family: Microsoft YaHei;
              font-weight: bold;
              color: #333333;
            }
          }
        }
      }
      .name_checkL_table {
        /deep/.ivu-table-header th {
          background-color: #00aeff !important;
          color: #fff;
          text-align: center;
        }
      }
    }
  }
}
</style>
