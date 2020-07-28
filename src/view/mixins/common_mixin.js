import { examStatusMap, BMATypeMap } from './str_map'
export default {
  filters: {
    examStatus (val) { // 考试状态
      return examStatusMap[val]
    },

    BMAType (val) { // 课前,课中,课后
      return BMATypeMap[val]
    },

    dateTimeFormat (val, format) { // 日期时间格式化
      if (!format) {
        format = 'YYYY-MM-DD H:m:s'
      }
      return this.moment(val * 1000).format(format)
    },

    urlFileName (val) { // 获取文件url的文件名
      return (val.substr(val.lastIndexOf('/') + 1))
    }
  }
}
