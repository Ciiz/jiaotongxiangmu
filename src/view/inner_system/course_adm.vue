<template>
  <div class="course_adm">
    <Tabs value="name1">
      <TabPane label="我的课程" name="name1">
        <div class="training_search">
          <Input placeholder="输入课程关键字" style="width: auto">
          <Icon type="ios-search" slot="suffix" />
          </Input>
          <Button loading type="primary" style="margin-right:90px">刷新</Button>
        </div>
        <div class="training_content">
          <div class="training_contentL">
            <Table :columns="columns1" :data="list" @on-row-click='handleselect' :height="$store.state.app.tableHeight">
            </Table>
          </div>
          <div class="training_contentR">
            <Tabs value="name_detail">
              <TabPane label="课程详情" name="name_detail">
                <Form class="course-form">
                  <FormItem label="课程封面：" class="course-form-item">
                    <!-- <p>{{course.course_name}}</p> -->
                  </FormItem>
                  <FormItem label="课程班主任：" class="course-form-item">
                    <div class="course-cover">
                      <!-- <img :src="course.img" alt=""> -->
                    </div>
                  </FormItem>
                  <FormItem label="课程直播时间：" class="course-form-item">
                  </FormItem>
                  <FormItem label="课程标签：" class="course-form-item">
                    <!-- <p class="blue-c" v-show="course.course_type === 1">普通</p>
                      <p class="blue-c" :color="'green'" v-show="course.course_type === 2">全景</p> -->
                  </FormItem>
                  <FormItem label="课程类型：" class="course-form-item">
                    <!-- <div v-html="course.description"></div> -->
                  </FormItem>
                  <FormItem label="课程简介：" class="course-form-item">
                    <!-- <div v-html="course.description"></div> -->
                  </FormItem>
                </Form>
              </TabPane>
              <TabPane label="课程内容" name="name_content">课程内容</TabPane>
            </Tabs>
          </div>
        </div>
      </TabPane>
      <TabPane label="新建课程" name="name2">新建课程</TabPane>
    </Tabs>
  </div>
</template>

<script>
// import log from 'video.js/es5/utils/log'
export default {
  name: '',

  data () {
    return {
      loading: true,
      list: [],
      columns1: [
        {
          title: '序号',
          width: 100,
          key: 'num',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('a', {
                on: {
                  'click': () => {
                    this.modal2 = true
                    this.editor = false
                    this.target = 'showDetail'
                    this.detailInfo = params.row
                  }
                }
              }, params.row.exam_name)
            ])
          }
        },
        {
          title: '封面',
          width: 100,
          key: 'cover',
          align: 'center'
        },
        {

          title: '课程名称',
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
/deep/.ivu-table {
  width: 471px;
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
    }
  }
}
</style>
