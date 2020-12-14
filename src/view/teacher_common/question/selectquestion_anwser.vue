<template>
  <div>
    <Tabs value="name2" @on-click='changeType'>
      <TabPane label="提问内容" name="name2">
        <div class="questionContain" style="background:#E7E7E7;min-height:340px">
          <p class="questionContain-question">
            {{selectQuestion.content}}
          </p>
          <p v-for="(item,index) in selectQuestion.detail" :key="index">
            <span>{{item.choose}}</span>、<span>{{item.choose_content}}</span>
          </p>
          <div style="clear:both"></div>
        </div>
        <div style="margin-top:16px;font-size:14px;color:#26282F;float:right">
          提问时间：{{getDate(selectQuestion.created_at)}}</div>
      </TabPane>
      <TabPane label="学生答案" name="name1">
        <Row style="height:380px">
          <Col :span="9" class="sq-anwser-l">
          <div class="selectJdt" v-for="(item,index) in selectList" :key="index" @click="getDetail(item)">
            <div class="totalShow"></div>
            <div>{{item.total}}</div>
            <div>{{item.choose}}</div>
          </div>
          </Col>
          <Col :span="15" style="height:100%">
          <Card class="select-card">
            <div style="font-size:14px;color:#26282F;margin-bottom:10px" v-show="choose!==''">选择{{choose}}的同学:</div>
            <ul class="select-student-list">
              <li v-for="(item2,index) in detailList" :key="index" style="margin:6px 4px">
                <div>
                  <img :src="item2.icon ===''? default_icon : item2.icon"
                    style="width:28px;height:28px;border-radius:50%" />

                </div>
                <div>
                  {{item2.name}}
                </div>
              </li>
            </ul>
          </Card>
          </Col>
        </Row>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
export default {
  props: ['selectQuestion'],
  data () {
    return {
      selectList: [],
      detailList: [],
      choose: '',
      default_icon: require('@/assets/images/new_img/default.jpg')
    }
  },
  watch: {
    selectQuestion: {
      handler (newValue, oldValue) {
        this.id = newValue.id
      },
      deep: true
    }
  },
  methods: {
    getDate (i) {
      return this.moment(i * 1000).format('YYYY-MM-DD')
    },
    changeType (i) {
      if (i === 'name1') {
        this.getAnswerList()
      }
    },
    getAnswerList () {
      this.axios
        .request({
          method: 'get',
          url: '/index.php/Teacher/Quiz/get_answer_list',
          params: {
            quiz_id: this.id,
            topic_type: 1
          }
        })
        .then(res => {
          console.log(res);
          this.selectList = res.data
          this.$nextTick(function () {
            this.getWidth(res.data[0].total, res.data[1].total, res.data[2].total, res.data[3].total, res.data[4].total)
          })
        })
    },
    getDetail (item) {
      this.choose = item.choose
      this.detailList = item.list
    },
    getWidth (a, b, c, d, o) {
      let total = document.getElementsByClassName('selectJdt')[0].offsetWidth
      let t = a + b + c + d + o
      a = a / t * total
      b = b / t * total
      c = c / t * total
      d = d / t * total
      o = o / t * total
      document.getElementsByClassName('selectJdt')[0].getElementsByClassName('totalShow')[0].style.width = a + 'px'
      document.getElementsByClassName('selectJdt')[1].getElementsByClassName('totalShow')[0].style.width = b + 'px'
      document.getElementsByClassName('selectJdt')[2].getElementsByClassName('totalShow')[0].style.width = c + 'px'
      document.getElementsByClassName('selectJdt')[3].getElementsByClassName('totalShow')[0].style.width = d + 'px'
      document.getElementsByClassName('selectJdt')[4].getElementsByClassName('totalShow')[0].style.width = o + 'px'
    }
  },
  mounted () {
  }
}
</script>

<style>
.sq-anwser-l > div {
  width: 234px;
  height: 27px;
  margin-bottom: 14px;
  background: rgba(237, 237, 237, 1);
  border-radius: 4px;
  position: relative;
  cursor: pointer;
}
.sq-anwser-l > div > div:nth-of-type(1) {
  position: absolute;
  height: 27px;
  border-radius: 4px;
}
.sq-anwser-l > div > div:nth-of-type(2) {
  position: absolute;
  right: 10px;
  top: 2px;
  color: #494949;
  font-size: 16px;
  font-weight: bold;
}
.sq-anwser-l > div > div:nth-of-type(3) {
  position: absolute;
  left: 16px;
  top: 2px;
  color: #494949;
  font-size: 16px;
  font-weight: bold;
}
.selectJdt:nth-of-type(1) > div:nth-of-type(1) {
  background: #56bdff;
}
.selectJdt:nth-of-type(2) > div:nth-of-type(1) {
  background: #97e26f;
}
.selectJdt:nth-of-type(3) > div:nth-of-type(1) {
  background: #ffad70;
}
.selectJdt:nth-of-type(4) > div:nth-of-type(1) {
  background: #ff94d3;
}
.selectJdt:nth-of-type(5) > div:nth-of-type(1) {
  background: gray;
}
.select-card {
  height: 100%;
}
.select-student-list > li {
  float: left;
  width: 16.6%;
  text-align: center;
}
</style>
