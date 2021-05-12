<template>
  <div class="traning_adm">
    <Tabs value="name1">
      <TabPane label="我的培训班" name="name1">
        <div class="training_search">
          <Input placeholder="输入课程关键字" style="width: auto">
          <Icon type="ios-search" slot="suffix" />
          </Input>
          <Button loading type="primary" style="margin-right:90px">刷新</Button>
        </div>
        <div class="training_content">
          <div class="training_contentL">
            <Table :columns="columns1" :data="list" @on-row-click='handleselect' width='471' height='740'>
            </Table>
          </div>
          <div class="training_contentR">
            <Tabs value="name_detail">
              <!-- 培训班详情 -->
              <TabPane label="培训班详情" name="name_detail">
                <Form class="course-form">
                  <FormItem label="培训班名称：" class="course-form-item">

                  </FormItem>
                  <FormItem label="培训班封面：" class="course-form-item">
                    <!-- <p>{{course.course_name}}</p> -->
                  </FormItem>
                  <FormItem label="培训班班主任：" class="course-form-item">
                    <div class="course-cover">
                      <!-- <img :src="course.img" alt=""> -->
                    </div>
                  </FormItem>
                  <FormItem label="报名人数" class="course-form-item">
                  </FormItem>
                  <FormItem label="培训班标签：" class="course-form-item">
                  </FormItem>
                  <FormItem label="培训班类型：" class="course-form-item">
                    <!-- <div v-html="course.description"></div> -->
                  </FormItem>
                  <FormItem label="培训班简介：" class="course-form-item">
                    <!-- <div v-html="course.description"></div> -->
                  </FormItem>
                </Form>
              </TabPane>
              <!-- 培训班安排 -->
              <TabPane label="培训班安排" name="name_content">

                <Row class="training_arrange" :gutter="10">
                  <Col span="14" class="training_arrangeL">
                  <span>学习进度</span>
                  <Button type="info">全部催学</Button>
                  </Col>
                  <Col span="8" class="training_arrangeR">
                  6666
                  </Col>
                </Row>

              </TabPane>
              <!-- 查看考勤 -->
              <TabPane label="查看考勤" name="name_check">
                <Row class="name_check" :gutter="10">
                  <Col span="14" class="name_checkL">
                  <div class="name_checkL_selct">
                    <Cascader :data="data4" :load-data="loadData" placeholder='线下课程名称' style="width:300px"></Cascader>
                    <Cascader :data="data4" :load-data="loadData" placeholder='签到名称查询' style="width:300px"></Cascader>
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
                  <Table border :columns="columns2" :data="data2" width='1082'></Table>
                  <!-- <Table :columns="columns2" :data="list2" height="200" width='100%' border> -->
                  </Table>
                </div>
              </TabPane>
              <!-- 查看学生相册 -->
              <TabPane label="查看学生相册" name="name_photo">

              </TabPane>

            </Tabs>
          </div>
        </div>
      </TabPane>
      <TabPane label="考核评价" name="name2">
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
// import log from 'video.js/es5/utils/log'
export default {
  name: '',

  data () {
    return {
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
      columns1: [
        {
          title: '序号',
          width: 100,
          key: 'num',
          align: 'center',
          render: (h, params) => {
            // return h('div', [
            //   h('a', {
            //     on: {
            //       'click': () => {
            //         this.modal2 = true
            //         this.editor = false
            //         this.target = 'showDetail'
            //         this.detailInfo = params.row
            //       }
            //     }
            //   }, params.row.exam_name)
            // ])
          }
        },
        {
          title: '封面',
          width: 100,
          key: 'cover',
          align: 'center'
        },
        {

          title: '培训班名称',
          key: 'course_name',
          align: 'center'
        },
        {
          title: '状态',
          key: 'status',
          render: (h, params) => {
            // return (
            //   <div style="min-width:137px;text-align:center">
            //     <Button type="primary" size="small" style={{ margin: '10px' }} onClick={() => { this.addTest(params.row.course_id, params.row.exam_time, params.row.batch) }}>导入试题</Button>
            //     <Button type="primary" size="small" style={{ margin: '10px' }}
            //       onClick={() => {
            //         this.modal2 = true
            //         this.target = 'showDetail'
            //         this.editor = true
            //         this.detailInfo = params.row
            //       }}>编辑</Button>
            //     <Button type="error" size="small" onClick={() => { this.modal = true; this.delId = params.row.batch }}>删除</Button>
            //   </div>
            // )
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
    handleselect (data) {
      console.log(data);

    }
  }
}
</script>

<style lang='less' scoped>
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
  width: 100%;
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
      // height: 100vh;
      margin-right: 10px;
    }
    .training_contentR {
      width: 100%;
      background-color: #fff;
      padding: 10px 15px;
      .course-form {
        margin-left: 15px;
        .course-form-item {
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          color: #555555;
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
