<template>
<div style="height:100%;flex-direction:column;display:flex">
  <div style="margin-bottom: 10px;">
    <json-excel
        class="export-excel-wrapper"
        :data="json_data"
        :fields="json_fields"
        :title="`考勤     √：正常、 △: 迟到、 ○：早退、 ×：缺勤、 -：不用考勤`"
        name="attendance.xls">
        <button class="blueC-btn" style="width:88px">导出</button>
    </json-excel>
  </div>
  <div class="courseware_list_table_parent" style="flex:1">
    <Table :loading="loading" class="courseware_list_table" :columns="columns" :data="list" :height="600" stripe border></Table>
  </div>
  <Spin v-if="loading" fix></Spin>
  </div>
</template>
<script>
import { get_student_attendance_records } from '@/api/data'
import JsonExcel from 'vue-json-excel'
export default{
  props: {
    teacher_course_id: '',
    class_id: '',
    showTime: ''
  },
  components: {
    JsonExcel
  },
  data () {
    return {
      list: [],
      table_header: {},
      loading: false,
      json_data: [],
      json_fields: {},
      json_meta: [
        [
          {
            ' key ': ' charset ',
            ' value ': ' utf-8 '
          }
        ]
      ],
      columns: [
        {
          title: '班级',
          key: 'class_name',
          align: 'center',
          minWidth: 300
        },
        {
          title: '姓名',
          key: 'name',
          align: 'center'
        },
        {
          title: '应到',
          key: 'expected',
          align: 'center'
        },
        {
          title: '实到',
          key: 'arrived',
          align: 'center'
        },
        {
          title: '迟到',
          key: 'late',
          align: 'center'
        },
        {
          title: '缺勤',
          key: 'obsent',
          align: 'center'
        },
        {
          title: '正常',
          key: 'normal',
          align: 'center'
        },
        {
          title: '早退',
          key: 'leave_early',
          align: 'center'
        }
      ]
    }
  },
  computed: {
    refreshFlag () {
      return this.teacher_course_id + this.class_id + this.showTime
    }
  },
  filters: {
    filtStatus (val) {
      let str = ''
      switch (val) {
        case -1: {
          str = '-'
          break
        }
        case 0: {
          str = '×'
          break
        }
        case 1: {
          str = '√'
          break
        }
        case 2: {
          str = '△'
          break
        }
        case 3: {
          str = '○'
          break
        }
      }
      return str
    }
  },
  watch: {
    refreshFlag (n) {
      this.getData()
    }
  },
  methods: {
    getData () {
      let _this = this
      this.loading = true
      get_student_attendance_records({
        teacher_course_id: this.teacher_course_id,
        class_id: this.class_id,
        time: this.showTime
      }).then(res => {
        if (res.code === 200) {
          this.list = res.data.list
          this.table_header = res.data.table_header

          let th = res.data.table_header
          for (let i = 0; i <= th.length - 1; i++) {
            if (i === 0) {
              this.json_fields[th[i]] = 'class_name'
            } else if (i === 1) {
              this.json_fields[th[i]] = 'name'
            } else if (i === (th.length - 6)) {
              this.json_fields[th[i]] = 'expected'
            } else if (i === (th.length - 5)) {
              this.json_fields[th[i]] = 'arrived'
            } else if (i === (th.length - 4)) {
              this.json_fields[th[i]] = 'late'
            } else if (i === (th.length - 3)) {
              this.json_fields[th[i]] = 'obsent'
            } else if (i === (th.length - 2)) {
              this.json_fields[th[i]] = 'normal'
            } else if (i === (th.length - 1)) {
              this.json_fields[th[i]] = 'leave_early'
            } else {
              this.json_fields[th[i]] = {
                field: `records.${i - 2}`,
                callback: value => {
                  return _this.$options.filters['filtStatus'](value)
                }
              }
            }
          }

          let tmp_data = res.data.list
          tmp_data.forEach(item => {
            let tmp = {}
            item.records.forEach((el, index) => {
              tmp[index] = el
            })
            item.at_records = tmp
          })
          this.json_data = tmp_data
        }
        this.loading = false
      })
    },
    export_records () {

    }
  },
  mounted () {
    this.getData()
  }
}
</script>
<style lang="less" >
.attendance-table-container{
  width: 100%;
  text-align: center;
  border: 1px solid #ccc;
  font-size: 14px;
  td{
    border-top: 1px solid #ccc;
    border-right: 1px solid #ccc;
  }
  th{
    border-right: 1px solid #ccc;
  }
}

.attendance-tips{
  font-size: 14px;
  margin-left: 15px;
}
.export-excel-wrapper{
  display: inline-block;
}
</style>
