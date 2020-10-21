<template>
  <div class="m_school_teachers">
    <mt-index-list>
      <mt-index-section v-for="(value,key) in firstNames" :key="key" :index="key">
        <div v-for="(i,ind) in value" :key="ind">
          <div class="m_address" @click="$router.push({path: `/m_index_school_teacherUser/${i.id}`})">
            <div class="m_address_icon"> <img :src="i.icon" alt=""></div>
            <div class="m_address_r">
              <div class="m_address_r_title">{{i.name}}</div>
              <div class="m_address_r_bt">
                <div class="m_address_r_bt1">职业：{{i.major_name}}</div>
                <div class="m_address_r_bt2">ta的课程：{{i.course_count}}</div>
              </div>
            </div>
          </div>
        </div>
      </mt-index-section>
    </mt-index-list>
  </div>
</template>

<script>
import vPinyin from './vue-py.js'
import { Indicator } from 'mint-ui'
import { get_taecherList } from '@/api/teacher'
export default {
  data () {
    return {
      firstNames: [],
      AlphabetList: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    }
  },
  computed: {

  },
  methods: {

  },
  mounted () {
    Indicator.open({
      text: '加载中...',
      spinnerType: 'fading-circle'
    })
    var elem_li = document.createElement('li')
    elem_li.innerHTML = '#'
    document.querySelector('.mint-indexlist-navlist', 'ul').appendChild(elem_li)
    // 数据改造'li
    // teacher_list.map((item, index) => {
    //   return {
    //      "index": index,
    //     "users": [
    //       {
    //         "name": item.name,
    //         "icon": item.id
    //       }
    //     ]
    //   }
    // })
    get_taecherList(this.$route.params.id).then(res => {
      console.log(res)
      this.taecherList = res.data.teacher_list
      let employeeNameList = []
      for (let k in res.data.teacher_list) {
        employeeNameList.push(res.data.teacher_list[k])
      }
      let firstName = {}
      this.AlphabetList.forEach((item) => {
        firstName[item] = []
        employeeNameList.forEach((el) => {
          let first = vPinyin.chineseToPinYin(el.name)
          if (first === item) {
            firstName[item].push(el)
          }
        })
      })
      this.firstNames = firstName
      console.log(this.firstNames)
      Indicator.close()
    })
  }
}
</script>

<style lang='less' scoped>
/deep/.mint-indexlist-nav {
  position: absolute;
}
/deep/.mint-indexlist-navitem {
  padding: 1.5px 6px;
}
/deep/.mint-indexsection-index {
  background-color: #fff;
}
/deep/.mint-indexlist {
  background-color: #f7f7f7;

  /deep/.mint-indexlist-content {
    margin-right: 0 !important;
  }
}
/deep/.mint-indexsection {
  margin-bottom: 0.2rem;
}
.m_school_teachers {
  .m_address {
    background-color: #fff;

    display: flex;
    padding: 0.3rem 0.3rem;
    align-items: center;
    .m_address_icon {
      width: 1.2rem;
      height: 1.2rem;
      border-radius: 50%;
      img {
        width: 1.2rem;
        height: 1.2rem;
        border-radius: 50%;
      }
    }
    .m_address_r {
      margin-left: 0.2rem;
      flex: 1;
      padding: 0.4rem 0;
      border-bottom: 1px solid #ccc;
      .m_address_r_title {
        font-size: 0.36rem;
        font-family: PingFang SC;
        font-weight: 500;
        color: #000000;
      }
      .m_address_r_bt {
        display: flex;
        align-items: center;
        font-size: 0.26rem;
        font-family: PingFang SC;
        font-weight: 500;
        color: #787878;
        .m_address_r_bt2 {
          margin-left: 0.8rem;
        }
      }
    }
  }
}
</style>
