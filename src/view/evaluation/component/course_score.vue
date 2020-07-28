<template>
  <Row style="background:#ffffff;display:flex;flex:1;padding:24px 0">
    <!-- <div>
      <p style="text-align:center">总分: <span>{{course.course_score}}</span></p>
    </div> -->
    <div style="margin:20px 30px;width:174px">
      <div class="gray-c">本课程总成绩：</div>
      <div style="text-align:center"><span class="red-EE" style="font-size:54px">{{course.course_score}}</span><span class="red-EE">分</span></div>
      <div style="margin-bottom:6px"><span>课程进度：</span><span class="blue-c">{{course.class_hour_progress_info.is_finish}}/{{course.class_hour_progress_info.all}}</span></div>
      <!-- <div><span>当前排名：</span><span class="blue-c">8</span></div> -->
    </div>
    <div class="courseware_list_table_parent" style="margin-right:10px">
      <Table
        class="courseware_list_table"
        size="large"
        :loading="loading"
        :columns="columns"
        :data="list"
      ></Table>
    </div>
    <Modal v-model="modal" :title="title" width="800" footer-hide>
    </Modal>
  </Row>
</template>

<script>
import modal_mixin from '@/view/mixins/modal_mixin'
export default {
  mixins: [modal_mixin],
  components: {

  },
  data () {
    return {
      modal: false,
      loading: false,
      keyword: '',
      list: [],
      count: 0,
      course: {},
      total_weight: 100,
      columns: [
        {
          title: '课时',
          key: 'sort',
          align: 'center',
          width: 100,
          render: (h, params) => {
            return (
              <div>
                课时{params.row.sort}
              </div>
            )
          }
        },
        {
          title: '课件名',
          key: 'courseware_name',
          align: 'center',
          width: 200
        },
        // {
        //   title: '状态',
        //   key: 'has_score',
        //   width: 100,
        //   render: (h, params) => {
        //     return (
        //       <div>
        //         <Tag color="success" v-show={params.row.has_score}>需评</Tag>
        //         <Tag color="default" v-show={!params.row.has_score}>不需评</Tag>
        //       </div>
        //     )
        //   }
        // },
        {
          title: '课件分数',
          key: 'score',
          align: 'center',
          width: 100
        },
        {
          title: '权重',
          key: 'weidht',
          align: 'center',
          minWidth: 100,
          render: (h, params) => {
            return (
              <div>
                {params.row.weight} / {this.total_weight}
              </div>
            )
          }
        },
        {
          title: '前',
          key: 'mia_score.before',
          align: 'center',
          width: 100,
          render: (h, params) => {
            return (
              <div>
                {params.row.score_before}
              </div>
            )
          }
        },
        {
          title: '中',
          key: 'mia_score.in',
          align: 'center',
          width: 100,
          render: (h, params) => {
            return (
              <div>
                {params.row.score_in}
              </div>
            )
          }
        },
        {
          title: '后',
          key: 'mia_score.after',
          align: 'center',
          width: 200,
          render: (h, params) => {
            return (
              <div>
                {params.row.score_after}
              </div>
            )
          }
        },
        {
          title: '最终得分',
          key: 'real_score',
          minWidth: 100,
          align: 'center',
          render: (h, params) => {
            return (
              <div class="red-EE">
                {params.row.real_score}
              </div>
            )
          }
        }
      ]
    }
  },
  watch: {
    courseId (n, o) {
      this.getData()
    }
  },
  computed: {
    courseId () {
      return this.$store.state.user.courseData.student_course_id
    }
  },
  methods: {
    getData () {
      if (!this.courseId) return
      this.loading = true
      this.axios.request({
        method: 'get',
        url: '/index.php/Student/Evaluation/getCourseScore',
        params: {
          student_course_id: this.courseId
        }
      }).then(res => {
        if (res.code === 200) {
          this.course = res.data.course
          this.list = res.data.course.student_courseware_list
          this.total_weight = res.data.course.total_weight
        }
        this.loading = false
      })
    }
  },
  mounted () {
    this.getData()
  }
}
</script>

<style lang="less" scoped>
</style>
