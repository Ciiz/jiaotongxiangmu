<template>
  <div class="modal-content" style="height: 70vh;">
    <Row style="margin-bottom:20px;">
    <InputNumber v-model="year" style="width: 100px" size="small" @on-change="getCourseTable()"></InputNumber>&nbsp;年&nbsp;
    <Select v-model="semester" size="small" style="width:100px;" @on-change="getCourseTable()">
      <Option :value="2">上半年</Option>`
      <Option :value="1">下半年</Option>`
    </Select>
    <div style="float:right;">
      <Button @click="handleWeekChange('minus')" size="small">上一周</Button>
        <InputNumber v-model="week" :max="maxWeek" :min="1" size="small"></InputNumber>
      <Button @click="handleWeekChange('plus')" size="small">下一周</Button>
    </div>
    </Row>
    <table class="timetable" border="1px;" rules="all"  cellpadding="10">
      <caption>课表（第{{week}}周）&nbsp;当前日期:{{curDate}} <span style="float:right">当前课时安排的周：<Button size="small" v-for="w in cur_timetable_time_weeks" :key="w" @click="week = w">{{w}}</Button></span></caption>
      <thead>
          <th v-for="(item,index) in tableHead" :key="index" class="bg-gray" :class="{'day-active': (index === curDay && curDate === item.date)}">{{item.label}}</br>{{item.date}}</th>
      </thead>
      <tbody>
        <tr v-for="(row,index) in rowData" :key="index">
          <td v-for="(col,index1) in row" :rowspan="col.rowspan" :colspan="col.colspan" :key="index1" :class="col.style" >
            <div class="item">
              <div v-if="col.col === 1" v-html="col.class_no ? `第${col.class_no}节` : '&nbsp;'" :class="{item: row.class_no ? ture : false}"> </div>
              <div v-else>
                <div v-if="col.desc.length !== 0">
                  <div v-for="(course,index1) in col.desc" :key="index1" @click="changeTimetable(course)">
                    <h4 >{{course.course_name}}</h4>
                    <p>{{course.address}}</p>
                    <p>{{course.class_name}}</p>
                    <div v-for="(courseware,index2) in course.coursewares" :key="index2">
                      <p>{{courseware.sort}}: {{courseware.courseware_name}}</p>
                    </div>
                    <Tag v-if="course.cur_timetable">当前课时安排</Tag>
                  </div>
                </div>
                <div v-else>
                  <p>&nbsp;</p>
                </div>
              </div>

              <!-- <render-desc v-else :cur_timetable_list="cur_timetable_list" :teacher_course_id="teacher_course_id" @success="getCourseTable" :timetable_id="timetable_id" :desc="col.desc" class="item"></render-desc> -->
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>

import renderDesc from './desc'
import { get_term_begin, get_course_table } from '@/api/common'
import { get_class_by_teacher_course, save_timetable } from '@/api/data'
// TODO: 添加获取学校的开学日期，根据当前日期设置当前周
function getWeekDay (dateString) {
  let dateStringReg = /^\d{4}[/-]\d{1,2}[/-]\d{1,2}$/

  if (dateString.match(dateStringReg)) {
    let presentDate = new Date(dateString)
    let today = presentDate.getDay() !== 0 ? presentDate.getDay() : 7

    return Array.from(new Array(7), function (val, index) {
      return formatDate(new Date(presentDate.getTime() - (today - index - 1) * 24 * 60 * 60 * 1000))
    })
  } else {
    throw new Error('dateString should be like "yyyy-mm-dd" or "yyyy/mm/dd"')
  }

  function formatDate (date) {
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
  }
}
// eslint-disable-next-line standard/array-bracket-even-spacing
const colors = ['color1', 'color2', 'color3', 'color4', 'color5', 'color6', 'color7', 'color8', 'color9', 'color10' ]
export default {
  props: ['teacher_course_id', 'timetable_id', 'class_id'],
  components: {
    renderDesc
  },
  data () {
    return {
      week: 1,
      tableHead: [
        '节/星期', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'
      ],
      tableData: [],
      rowData: [], // 课表绘制数据
      weekData: [], // 当前周的数据
      maxWeek: 30,
      year: (new Date().getMonth() + 1) < 3 ? (new Date().getFullYear() - 1) : new Date().getFullYear(),
      semester: (new Date().getMonth() + 1) > 8 || (new Date().getMonth() + 1) < 3 ? 1 : 2,
      loading: false,
      curDate: this.moment().format('YYYY-M-D'),
      curDay: new Date().getDay(),
      curWeek: 0,
      colorMap: [],
      color_arr: {},
      course_table: [],
      classList: [],
      teacher_course_list: [],
      timetable_data: [],
      teacher_course: {},
      cur_timetable_list: [], // 当前timetable的时间安排
      is_refresh: true, // 用来判断是否改变当前周
      cur_timetable_time_weeks: [] // 当前课程已经设置的周
    }
  },
  computed: {
  },
  watch: {
    week (n, o) {
      this.rowData = this.getRowData()
      this.weekData = this.getWeekData(this.tableData, n)
      this.dealTableHeader(n)
      this.dealTimetableData()
    },
    teacher_course_id (n, o) {
      this.getCourseTable()
      this.getClassList()
    }
  },
  methods: {
    handleWeekChange (action) {
      if (action === 'minus' && this.week > 1) {
        this.week--
      } else if (action === 'plus' && this.week < this.maxWeek) {
        this.week++
      }
    },
    handlecourseTableChange () {
      this.getData(this.formatData(this.course_table, this.timetable_data))
    },
    getCourseTable () {
      let _this = this
      _this.loading = true
      get_course_table(this.teacher_course_id, this.year, this.semester, this.class_id).then(res => {
        if (res.code === 200) {
          this.course_table = res.data.course_table
          this.timetable_data = res.data.timetable_data
          _this.getDateWeek(_this.semester).then(week => {
            if (_this.is_refresh) { _this.week = week }
            _this.getData(this.formatData(this.course_table, this.timetable_data))
            _this.loading = false
          })
        }
      })
    },
    formatData (course_table, timetable_data) {
      let _this = this
      let arr = []
      _this.cur_timetable_list = []
      _this.cur_timetable_time_weeks = []
      course_table.forEach(item => {
        for (let week_start = item.week_start; week_start <= item.week_end; week_start++) {
          let obj = {
            week: week_start,
            day: item.day,
            class_no: item.class_no,
            class_name: item.class_name,
            class: item.class,
            address: item.address,
            course_name: item.course_name,
            course_id: item.course_id
          }
          let desc = {
            ...obj,
            course_name: item.course_name,
            address: item.address,
            year: item.year,
            semester: item.semester,
            week: week_start,
            day: item.day,
            class_no: item.class_no,
            coursewares: []
          }
          timetable_data.forEach(val => {
            if (val.day === obj.day && val.class_id === obj.class && obj.class_no.sort().join(',') === val.class.sort().join(',') && val.week === obj.week && val.course_id === item.course_id) { // 课程打入课时信息
              if (val.timetable_id === _this.timetable_id) { // 当前课件的课时安排列表
                _this.cur_timetable_list.push(val)
              }
              if (_this.timetable_id === val.timetable_id) {
                // this.week = obj.week
                _this.cur_timetable_time_weeks.push(obj.week)
                _this.cur_timetable_time_weeks = Array.from(new Set(_this.cur_timetable_time_weeks))

                desc.cur_timetable = true
              }
              let courseware_index = desc.coursewares.findIndex((el) => { return el.courseware_name === obj.courseware_name })
              if (courseware_index === -1) {
                desc.coursewares.push({
                  sort: val.sort,
                  courseware_name: val.courseware_name,
                  class_names: [{
                    id: val.class_id,
                    class_name: val.class_name,
                    timetable_id: val.timetable_id
                  }]
                })
              } else {
                let class_name_index = desc.coursewares[courseware_index].class_names.findIndex((el) => { return el.id === val.class_id })
                if (class_name_index === -1) {
                  desc.coursewares[courseware_index].class_names.push({
                    id: val.class_id,
                    class_name: val.class_name,
                    timetable_id: val.timetable_id
                  })
                }
              }
            }
          })
          obj.desc = desc
          switch (item.week_type) {
            case 0: { // 连续
              arr.push(obj)
              break
            }
            case 1: {
              if (week_start % 2 === 1) { // 单周
                arr.push(obj)
              }
              break
            }
            case 2: {
              if (week_start % 2 === 0) { // 双周
                arr.push(obj)
              }
              break
            }
          }
        }
      })
      return arr
    },
    getData (timetable_data) {
      let _this = this
      _this.tableData = timetable_data
      // 处理颜色
      let arr = timetable_data.map(item => {
        return item.course_id
      })
      this.CourseMap = Array.from(new Set(arr))
      this.color_arr = {}
      this.CourseMap.forEach((item, index) => {
        this.color_arr[item] = index
      })
      _this.weekData = _this.getWeekData(_this.tableData, this.week)
      _this.rowData = _this.getRowData()
      _this.dealTimetableData()
    },
    getDateWeek (semester) {
      /*
      date1是当前日期
      date2是当年第一天
      d是当前日期是今年第多少天
      用d + 当前年的第一天的周差距的和在除以7就是本年第几周
      */
      return new Promise((resolve, reject) => {
        get_term_begin(this.teacher_course_id, this.year, semester).then(res => {
          if (res.code === 200 && res.data.term_begins) {
            let yy = this.year
            let mm = new Date().getMonth() + 1
            let dd = new Date().getDate()
            let date1 = new Date(yy + '-' + mm + '-' + dd)
            let date2 = new Date(res.data.term_begins * 1000)
            let d
            if (this.semester === 1) {
              if (mm > 9 || mm < 3) {
                d = Math.round((date1.valueOf() - date2.valueOf()) / 86400000)
              } else {
                d = 1
              }
            } else {
              if (mm <= 9 && mm >= 3) {
                d = Math.round((date1.valueOf() - date2.valueOf()) / 86400000)
              } else {
                d = 1
              }
            }
            let week = Math.ceil((d + ((date2.getDay() + 1) - 1)) / 7)
            this.curWeek = week
            this.term_begins = res.data.term_begins
            this.dealTableHeader(this.curWeek)
            resolve(week)
          } else {
            this.$Notice.warning({
              title: '警告！',
              desc: '获取开学日期失败,请联系学校管理员，在学校后台设置学期开始日期。',
              duration: 0
            })
            this.$emit('error')
            // eslint-disable-next-line prefer-promise-reject-errors
            reject('获取开学日期失败,默认第一周')
          }
        })
      })
    },
    getRowData () {
      let arr = []
      for (let row = 1; row <= 14; row++) {
        if (row % 5 === 0) { // 下午晚上分割
          arr.push([
            { row: row, col: 1, colspan: 8, day: 0, desc: '&nbsp;', class_no: 0 }
          ])
        } else {
          let col_arr = []
          for (let col = 1; col <= 8; col++) {
            let round_number = parseInt(row / 5)
            let no = row % 5// 上下晚
            let class_no = Number(round_number * 4) + Number(no)
            col_arr.push({
              row: row,
              col: col,
              rowspan: 1,
              desc: col === 1 ? [] : [],
              day: col - 1,
              style: col === 1 ? { 'bg-gray': true, 'text-center': true } : {},
              color: {},
              class_no: class_no
            })
          }
          arr.push(col_arr)
        }
      }
      return arr
    },
    getWeekData (data, week) {
      let map = {}
      let dest = []
      for (var i = 0; i < data.length; i++) {
        var ai = data[i]
        ai.class_no = ai.class_no.sort((a, b) => {
          return parseInt(a) - parseInt(b)
        }).map(item => {
          return parseInt(item)
        })
        if (!map[ai.week]) {
          dest.push({
            week: ai.week,
            item: [ai]
          })
          map[ai.week] = ai
        } else {
          for (var j = 0; j < dest.length; j++) {
            var dj = dest[j]
            if (dj.week === ai.week) {
              dj.item.push(ai)
              break
            }
          }
        }
      }
      for (let item of dest) { // 排序
        if (item.week === week) {
          let res = item.item.sort((a, b) => {
            return a.day - b.day
          })
          return res
        }
      }
      return []
    },
    dealTimetableData () { // 处理后的课表数据
      let _this = this
      function getMnn (cl) {
        return (cl % 4 === 0) ? parseInt(parseInt(cl / 4) - 2) : parseInt(parseInt(cl / 4) - 1)
      }
      function getCol (row, day) {
        for (let u = 0; u <= _this.rowData[row].length - 1; u++) {
          if (_this.rowData[row][u].day === day) {
            return u
          }
        }
      }
      function dealRowSpan (row, rowspan, day) { // 处理跨节
        for (let k = 1; k < rowspan; k++) {
          for (let u = 0; u <= _this.rowData[row + k].length - 1; u++) {
            if (_this.rowData[row + k][u].day === day) {
              _this.rowData[row + k].splice(u, 1)
              u--
            }
          }
        }
      }

      function dealDesc (col, item, rowspan) {
        col.rowspan = rowspan
        col.style.clitem = true
        let color = colors[_this.color_arr[item.course_id]] ? colors[_this.color_arr[item.course_id]] : 'color1'
        col.style[color] = true
        col.desc.push(item.desc)
      }

      for (let w = 0; w < this.weekData.length; w++) {
        for (let r = 0; r < this.rowData.length; r++) {
          for (let c = 0; c < this.rowData[r].length; c++) {
            let item = this.weekData[w]
            // 判断class的长度length，设置当前col的colspan，删除相对于当前行的下length行的td数据（）
            if (parseInt(item.day) === this.rowData[r][c].day && parseInt(item.class_no[0]) === this.rowData[r][c].class_no) {
              // 找出下面还有几个连节的。并且把连节数据删掉
              let mnn = getMnn(parseInt(item.class_no[0]))// 起始节的时段
              let rowspan = 1// 跨多少节
              let row = r
              let col = c
              let init_class = item.class_no[0]
              if (item.class_no.length === 1) {
                dealDesc(this.rowData[row][col], item, rowspan)
                dealRowSpan(row, rowspan, item.day)
              } else {
                for (let i = 1; i < item.class_no.length; i++) {
                  let cur_class = parseInt(item.class_no[i]) // 下一节
                  let cur_mnn = getMnn(cur_class)
                  let is_cross_mnn = cur_mnn !== mnn// 是否跨时间段（上午，中午，晚上）

                  if (cur_class === parseInt(init_class) + parseInt(rowspan) && !is_cross_mnn) { // 连下一节 不跨时段
                    rowspan++
                  } else { // 下一个时段
                    col = getCol(row, item.day)
                    dealDesc(this.rowData[row][col], item, rowspan)
                    dealRowSpan(row, rowspan, item.day)// 先把上个时段的处理好
                    // 重置数据
                    rowspan = 1
                    mnn = getMnn(cur_class)
                    row = parseInt(mnn + cur_class)
                    init_class = cur_class
                    col = getCol(row, item.day)
                  }
                  if (parseInt(i + 1) >= item.class_no.length) { // 后面没有数据就立刻处理
                    dealDesc(this.rowData[row][col], item, rowspan)
                    dealRowSpan(row, rowspan, item.day)
                  }
                }
              }
            }
          }
        }
      }
    },
    dealTableHeader (week) {
      // 根据周的第一天的日期处理表头
      let firstWeekDate = this.moment(this.term_begins * 1000).add((week - 1) * 7, 'days').format('YYYY-M-D')
      let dayArr = getWeekDay(firstWeekDate)
      dayArr.unshift('')
      this.tableHead = []
      let strArr = [
        '节/星期', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'
      ]
      dayArr.forEach((item, index) => {
        this.tableHead.push({
          label: strArr[index],
          date: item
        })
      })
    },
    getClassList () {
      get_class_by_teacher_course(this.teacher_course_id).then(res => {
        if (res.code === 200) {
          this.classList = res.data
        }
      })
    },
    changeTimetable (course) {
      this.is_refresh = false
      let index = this.cur_timetable_list.findIndex((val) => {
        return (val.week === course.week && val.day === course.day && val.class.sort().join(',') === course.class_no.sort().join(','))
      })
      if (index !== -1) { // 取消
        this.cur_timetable_list.splice(index, 1)
      } else { // 新增
        this.cur_timetable_list.push({
          year: course.year,
          semester: course.semester,
          week: course.week,
          day: course.day,
          class: course.class_no
        })
      }
      this.cur_timetable_list.forEach(item => {
        item.timetable_id = this.timetable_id
      })
      save_timetable({
        timetable_id: this.timetable_id,
        timetable_time_list: this.cur_timetable_list
      }).then(res => {
        if (res.code === 200) {
          this.$Message.success(res.message)
          this.getCourseTable()
          setTimeout(() => {
            this.rowData = this.getRowData()
            this.weekData = this.getWeekData(this.tableData, this.week)
            this.dealTableHeader(this.week)
            this.dealTimetableData()
          }, 1000)
        }
      })
    }
  },
  mounted () {
    this.getCourseTable()
  }
}
</script>
