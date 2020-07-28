<template>
<Row>
  <div style="margin-bottom:15px">
    搜索字段：
    <Select v-model="searchType" size="small" style="width:100px">
        <Option v-for="item in searchTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
    <Input type="text" v-model="keyword" placeholder="请输入搜索内容" size="small" style="width:150px"></Input>

    <Button type="primary" size="small" @click="getData(true)" style="margin-left:15px;">搜索</Button>
  </div>
  <Table :loading="loading" ref="selection" :columns="columns" :data="list" @on-sort-change="handleSortChange">
  </Table>
  <Row>
    <page :total="count" :current="page_no" :page-size="page_size"  size="small" show-elevator show-total show-sizer @on-change="handlePageChange" @on-page-size-change="handleSizeChange" :placement="'top'"></page>
  </Row>
</Row>
</template>

<script>
export default {
  components: {
  },
  data () {
    return {
      imgName: '', // 预览媒体的name
      mediaType: '', // 预览媒体的类型
      loading: false,
      keyword: '',
      searchType: 0,
      sortType: 'create_at',
      sortOrder: 'desc',
      list: [],
      count: 0,
      page_no: 1,
      page_size: 20,
      searchTypeList: [
        {
          value: 0,
          label: '课程名称'
        }
      ],
      columns: [
        {
          title: '课程封面',
          key: 'img',
          width: 200,
          align: 'left',
          render: (h, params) => {
            return (
              <div style={{ width: '150px', height: '100px', margin: '10px', overflow: 'hidden' }}>
                <img src={params.row.img} style={{ width: '100%' }}/>
              </div>
            )
          }
        },
        {
          title: '课件名称',
          key: 'course_name',
          width: 150,
          render: (h, params) => {
            return (
              <div>
                <p style={{ marginBottom: '12px' }}>{params.row.courseware_name}</p>
                <span>{params.row.create_time}</span>
              </div>
            )
          }
        },
        {
          title: '课程名称',
          key: 'course_name',
          width: 150
        },
        {
          title: '状态',
          key: '',
          render: (h, params) => {
            let status = params.row.live_status
            return (
              <div>
                <span style={{ color: 'green' }} v-show={status === 1}>直播中</span>
                <span style={{ color: '#ccc' }} v-show={status === 2}>已结束</span>
              </div>
            )
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 180,
          align: 'center',
          fixed: 'right',
          render: (h, params) => {
            let status = params.row.live_status
            return (
              <div>
                <Button size="small" type="primary"
                  onClick={() => { this.$router.push({ name: 'middle_courseware_play', query: { student_courseware_id: params.row.student_courseware_id } }) }}
                  v-show={status === 1}
                >
                进入
                </Button>
                <Button size="small" type="default"
                  onClick={() => { this.$router.push({ name: 'middle_courseware_evaluate_score', params: { courseware_id: params.row.id } }) }}
                  v-show={status === 2}
                >
                评价
                </Button>
              </div>
            )
          }
        }
      ]
    }
  },
  methods: {
    getData (isSearch) {
      let _this = this
      if (isSearch) {
        _this.page_no = 1
      }
      _this.loading = true
      // 获取课件直播状态为直播中和已结束的？按照直播状态排序
      _this.axios.request({
        url: '/index.php/Student/Courseware/page',
        method: 'get',
        params: {
          page_size: _this.page_size,
          page_no: _this.page_no,
          searchType: parseInt(_this.searchType),
          sortType: _this.sortType,
          sortOrder: _this.sortOrder,
          keyword: _this.keyword,
          type: 2
        }
      }).then(res => {
        if (res.code === 200) {
          let data = res.data
          this.list = data.list
          this.count = data.count
        }
        _this.loading = false
      })
    },
    del (isSingle, item, index) {
      this.$Message.success('还没做')
    },
    handleSortChange (sort) { // 排序
      this.sortType = sort.key
      this.sortOrder = sort.order
      this.getData()
    },
    handlePageChange: function (val) {
      this.page_no = val
      this.getData()
    },
    handleSizeChange: function (val) {
      this.page_size = val
      this.getData(true)
    }
  },
  mounted () {
    this.getData()
  }

}
</script>

<style lang="less">

</style>
