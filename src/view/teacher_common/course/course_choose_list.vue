<template>
  <Row>
    <!-- <div class="">
      搜索课程：
      <Input type="text" v-model="keyword" placeholder="请输入搜索内容"  style="width:200px">
        <Icon type="ios-search" slot="suffix" @click="selectbtn"/>
      </Input>
    </div>
    <Table
      size="small"
      ref="selection"
      :columns="columns"
      :data="course_list"
      @on-selection-change="handleSelectionChange"
      :loading="loading"
      :height="$store.state.app.tableHeight - 30"
    ></Table>
    <div>
      <Button @click="handleSelectAll" >全选 / 全不选</Button>
      <Button @click="handlebind"  type="primary" >绑定课程</Button>
      <Page :total="pagetotal" @on-change="pageonchage" :page-size="7" size="small" style="float:right;"/>
    </div> -->
    <Modal v-model="modal" title="课程详情" width="1000" :footer-hide="true">
      <courseDetail :course_id="target_id" v-if="modal"></courseDetail>
    </Modal>
  </Row>
</template>

<script>
import courseDetail from '@/view/teacher_common/course/course_detail.vue'
export default {
  components: {
    courseDetail
  },
  data () {
    return {
      target_id: 0,
      modal: false,
      pagetotal: 7,
      pagenumber: 1,
      keyword: '',
      loading: false,
      courseids: [],
      isture: false,
      course_list: [],
      columns: [
        {
          type: 'selection',
          minWidth: 10,
          width: 50,
          align: 'center'
        },
        {
          title: '课程封面',
          minWidth: 100,
          render: (h, params) => {
            return (
              <div>
                <img src={params.row.img} width='50' height='50' style='margin-top:5px;'/>
              </div>
            )
          }
        },
        {
          title: '课程名称',
          width: 200,
          render: (h, params) => {
            return (
              <div>
                <p>{params.row.course_name}</p>
                <p>{this.moment(params.row.created_at * 1000).format('YYYY-MM-DD HH:mm')}</p>
              </div>
            )
          }
        },
        {
          title: '状态',
          minWidth: 450,
          key: 'type',
          render: (h, params) => {
            return (
              <div>
                {params.row.release_status === '0' ? ' 需要审核' : '无需审核'}
              </div>
            )
          }
        },
        {
          title: '操作',
          key: 'action',
          minWidth: 200,
          align: 'center',
          fixed: 'right',
          render: (h, params) => {
            return (
              <div>
                <Button type="info" size="small" onClick={() => { this.show(params.row) }}>详情</Button>
                <Button type="primary" size="small" onClick={() => { this.choose(params.row) }}>选课</Button>
              </div>
            )
          }
        }
      ]
    }
  },
  created () {
    this.getInfo()
    window.localStorage.setItem('search', new Date().getTime().toString().slice(8) - 50000)
  },
  methods: {
    back () {
      this.$router.push({
        name: 'teacher',
        query: {
          history: 'choose_class'
        }
      })
    },
    selectbtn () {
      let local = window.localStorage.getItem('search')
      let num = Number(new Date().getTime().toString().slice(8))
      this.sendloading = false
      if (num - local < 5000 && num - local > 0) {
        this.$Message.error('搜索太频繁，请稍后再试')
        return false
      }
      if (num - local < -95000 && num - local < 0) {
        this.$Message.error('搜索太频繁，请稍后再试')
        return false
      }
      if (this.loading === false) {
        this.course_list = []
        this.loading = true
        this.getInfo(1, this.keyword)
        window.localStorage.setItem('search', new Date().getTime().toString().slice(8))
      }
    },
    pageonchage (val) {
      this.pagenumber = val
      this.loading = true
      this.course_list = []
      this.getInfo(val)
    },
    handlebind () {
      if (this.courseids.length === 0) {
        this.$Message.error('请选择你要绑定的课程')
      } else if (this.courseids.length > 0) {
        this.axios.request({
          method: 'post',
          url: 'index.php/Teacher/Course/choose',
          data: {
            course_ids: this.courseids
          }
        }).then(res => {
          if (res.code === 200) {
            this.$Message.success('绑定成功')
            this.course_list = []
            this.getInfo(this.pagenumber)
            this.$emit('bind-success')
          } else {
            let name = []
            let data = res.data
            for (let item in this.course_list) {
              for (let i in data) {
                if (this.course_list[item].id === data[i]) {
                  name.push(this.course_list[item].course_name)
                }
              }
            }
            this.$Message.error({
              content: `课程     ${name.join('  /  ')}    已经绑定`,
              duration: 5
            })
          }
        })
      }
    },
    handleSelectionChange (selection) {
      let clonearr = []
      for (let i in selection) {
        clonearr.push(selection[i].id)
      }
      this.courseids = clonearr
    },
    handleSelectAll () {
      this.$refs.selection.selectAll(!this.isture)
      this.isture = !this.isture
    },
    show (row) {
      this.target_id = row.id
      this.modal = true
    },
    getInfo (page = 1, keyword) {
      this.axios.request({
        method: 'get',
        url: '/index.php/Teacher/Course/optional_index',
        params: {
          page,
          keyword
        }
      }).then(res => {
        if (res.code === 200 && res.data.course_list !== null) {
          this.course_list = res.data.course_list
          this.pagetotal = res.data.pages * 7
          this.loading = false
        }
      })
    },
    choose (item) {
      this.$refs.selection.selectAll(false)
      this.courseids = [item.id]
      this.handlebind()
    }
  }
}
</script>
