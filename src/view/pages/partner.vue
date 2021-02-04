<template>
  <div class="partner">
    <div class="partner_img">
      <img src="@/assets/images/login-bg.jpg" alt />
    </div>
    <div class="partner_lists">
      <Row>
        <Col>
        <div class="partner_lists_header">
          <div class="partner_lists_header_left">合作院校</div>
          <div class="partner_lists_header_right">
            <div class="partner_lists_header_right1">综合排序</div>
            <div class="partner_lists_header_right2">
              教师数量
              <div class="partner_icon1">
                <Icon type="md-arrow-dropup" color="red" size="8" @click="handledropup_teacher(3)" />
                <Icon type="md-arrow-dropdown" size="8" @click="handledropup_teacher(4)" />
              </div>
            </div>
            <div class="partner_lists_header_right3">课程数量
              <div class="partner_icon2">
                <Icon type="md-arrow-dropup" color="red" size="8" @click="handledropup(1)" />
                <Icon type="md-arrow-dropdown" size="8" @click="handledropup(2)" />
              </div>
            </div>
          </div>
        </div>
        </Col>
      </Row>
    </div>

    <Row class="partner_lists_content">

      <ul>
        <li v-for="(item,index) in schoolList" :key="index">

          <Row type="flex">

            <Col class="li_img" type="flex">
            <img :src="item.school_icon" style="width:73px;height:73px;margin-right:10px;border-radius:50%;" />
            </Col>
            <Col style="flex:1">
            <div class="index-school-name" style="font-size:18px;">{{item.school_name}}</div>
            <Row>
              <Col>
              <span style="font-size:14px;">拥有课程：{{item.course_num}}</span>
              </Col>
              <Col>
              <span style="font-size:14px;">拥有教师：{{item.teacher_num}}</span>
              </Col>
            </Row>
            </Col>

          </Row>
        </li>
      </ul>

    </Row>
  </div>
</template>

<script>
import vPinyin from '@/view/mobile_page/components/m_index/vue-py2'
export default {
  name: 'partner',

  data () {
    return {
      schoolList: [],
      value_type: 1
    }
  },

  methods: {
    handledropup (value) {
      this.getSchoolList(value)
    },
    handledropup_teacher (value) {
      this.getSchoolList(value)
    },
    compare (property) {
      if (this.value_type == 1) {
        return function (a, b) {
          var value1 = a[property]
          var value2 = b[property]
          return value2 - value1 // value2>value1---降序  value1>value2 ---升序
        }
      } else if (this.value_type == 2) {
        return function (a, b) {
          var value1 = a[property]
          var value2 = b[property]
          return value1 - value2
        }
      } else if (this.value_type == 3) {
        return function (a, b) {
          var value1 = a[property]
          var value2 = b[property]
          return value2 - value1 // value2>value1---降序  value1>value2 ---升序
        }
      } else if (this.value_type == 4) {
        return function (a, b) {
          var value1 = a[property]
          var value2 = b[property]
          return value1 - value2 // value2>value1---降序  value1>value2 ---升序
        }
      }

    },
    getSchoolList (value) {
      // 获取学校列表 
      this.schoolList = []
      this.axios
        .request({
          method: 'get',
          url: '/index.php/Home/Index/getSchoolList'
        })
        .then(res => {
          console.log(res);
          if (res.code === 200) {
            let arr = []
            let blocks = [] // 新列表
            let p, c
            let d = {}
            res.data.list.forEach(item => {
              p = vPinyin.chineseToPinYin(item.school_name)
              c = p.charCodeAt(0) // charCodeAt() 方法可返回指定位置的字符的 Unicode 编码。这个返回值是 0 - 65535 之间的整数。
              if (c > 97 && c < 123) {
                if (!d[p]) {
                  d[p] = []
                }
                d[p].push(item)
              }
            })
            for (let [k, v] of Object.entries(d)) { blocks.push({ title: k.toUpperCase(), city: v }) } blocks.sort((a, b) => a.title.charCodeAt(0) - b.title.charCodeAt(0))
            console.log(blocks);
            blocks.forEach((v) => {
              arr.push(...v.city)
            })
            this.schoolList = arr
            var course_num = []
            var course_num = res.data.list.map(v => {
              return v
            })

            if (value === 1) {
              this.value_type = 1
              this.schoolList = course_num.sort(this.compare('course_num')) // 排序

            } else if (value === 2) {
              this.value_type = 2
              this.schoolList = course_num.sort(this.compare('course_num')) // 排序

            } else if (value === 3) {
              this.value_type = 3
              this.schoolList = course_num.sort(this.compare('teacher_num')) // 排序
            } else if (value === 4) {
              this.value_type = 4
              this.schoolList = course_num.sort(this.compare('teacher_num')) // 排序
            }


          }
        })
    }
  },
  mounted () {
    this.getSchoolList()
  }
}
</script>

<style lang='less' scoped>
.partner {
  .partner_img {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 31px 0;
    img {
      width: 1200px;
      height: 320px;
      border-radius: 4px;
    }
  }
  .partner_lists {
    display: flex;

    justify-content: center;
    .partner_lists_header {
      width: 1200px;
      padding: 14px 0;
      margin-bottom: 34px;
      border-bottom: 1px solid #000000;
      display: flex;
      justify-content: space-between;
      .partner_lists_header_left {
        font-size: 20px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: rgba(44, 164, 231, 1);
        line-height: 24px;
      }
      .partner_lists_header_right {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(136, 136, 136, 1);
        line-height: 19px;
        display: flex;
        justify-content: space-between;
        .partner_lists_header_right2 {
          margin: 0 39px;
        }
        .partner_lists_header_right2,
        .partner_lists_header_right3 {
          display: flex;
          .partner_icon1,
          .partner_icon2 {
            display: flex;
            flex-direction: column;
            .ivu-icon-md-arrow-dropup {
              line-height: 0.8;
              padding: 0;
              margin: 0;
            }
          }
        }
      }
    }
  }
  .partner_lists_content {
    display: flex;
    justify-content: center;
    align-items: center;

    ul {
      width: 1200px;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;

      li {
        &:hover {
          box-shadow: 1px 1px 9px #ccc;
        }
        .li_img {
          margin: auto 0;
        }
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        margin-right: 21px;
        width: 284px;
        padding-left: 9px;
        height: 100px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.06);
        border-radius: 5px;
      }
      li:nth-child(4n) {
        margin-right: 0 !important;
      }
    }
  }
}
</style>
