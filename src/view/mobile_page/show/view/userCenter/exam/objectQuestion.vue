<template>
<div class="m-objectQuetion flex-contain">
  <mt-header title="选择题" style="border-bottom:1px solid #CCCCCC">
    <router-link to slot="left">
      <mt-button icon="back" @click="back"></mt-button>
    </router-link>
    <span slot="right">{{currentIndex+1}}/{{objectList.length}}</span>
  </mt-header>
  {{exam_status}}
  <div class="m-object-contain hideScroll">
    <div class="m-object-title">
      <span>{{currentIndex+1}}【{{objectInfo.object_typ===1?'单选题':'多选题'}}】{{objectInfo.content}}</span>
      <span style="font-weight:400">（{{objectInfo.score}}分）</span>
    </div>
    <div class="m-object-item">
      <div v-for="(item,index) in optionList" :key="index" @click="selectItem(item,index)">
        {{changeSel(index)}}、{{item}}
      </div>
    </div>
  </div>
  <div class="m-object-bottom">
    <div @click="changeQuetion(-1)">上一题</div>
    <div @click="changeQuetion(1)">下一题</div>
  </div>
</div>
</template>
<script>

import { Toast } from 'mint-ui'
export default {
  data () {
    return {
      objectInfo:{},
      optionList:[],
      currentIndex:''
    }
  },
  computed: {
    questionIndex () {
      return this.$route.query.questionIndex
    },
    objectList () {
      return this.$route.query.objectList
    },
    exam_status(){
      return this.$route.query.exam_status
    }
  },
  methods: {
    back(){
      this.submit()
      window.history.go(-1)
    },
    changeSel (i) {
      if (i === 0) {
        return 'A'
      } else if (i === 1) {
        return 'B'
      } else if (i === 2) {
        return 'C'
      } else if (i === 3) {
        return 'D'
      } else if (i === 4) {
        return 'E'
      } else if (i === 5) {
        return 'F'
      }
    },
    changeIndex (i) {
      if (i === 'A') {
        return 0
      } else if (i === 'B') {
        return 1
      } else if (i === 'C') {
        return 2
      } else if (i === 'D') {
        return 3
      } else if (i === 'E') {
        return 4
      } else if (i === 'F') {
        return 5
      }
    },
    selectItem(item,i){
      if(this.exam_status===0||this.exam_status===1){
        let not = document.getElementsByClassName('m-object-item')[0].childNodes[i]
        if(not.className!=='m-object-select'){
          not.classList.add("m-object-select")
        } else{
          not.classList.remove("m-object-select")
        }
      } 
    },
    getInfo(){   //获取问题
      let dicNode = document.getElementsByClassName('m-object-item')[0]
      for(let i=0;i<dicNode.childNodes.length;i++){
        dicNode.childNodes[i].className=''
      }
      this.objectInfo = this.objectList[this.currentIndex]
      this.optionList = this.objectInfo.option.split(',')
      if(this.objectInfo.student_answer.content!==''){
        let ar = this.objectInfo.student_answer.content.split(',')
        for(let i=0;i<ar.length;i++){
          let a = this.changeIndex(ar[i])
          this.$nextTick(()=>{
            dicNode.childNodes[a].className='m-object-select'
          })
        }
      }
    },
    changeQuetion(i){   //切换问题
      if(this.currentIndex+i<0){
        Toast({
          message: '前面没有题目了',
          duration: 2000
        })
      } else if(this.currentIndex+i>this.objectList.length-1){
        Toast({
          message: '后面没有题目了',
          duration: 2000
        })
      } else{
        if(this.exam_status===0||this.exam_status===1){
          this.submit()
        }
        this.currentIndex+=i
        this.getInfo()
      }
    },
    submit(){   //保存答案
      let arr=''
      let not = document.getElementsByClassName('m-object-item')[0].childNodes
      for(let i=0;i<not.length;i++){
        if(not[i].className==='m-object-select'){
          arr+=this.changeSel (i)+','
        }
      }
      arr=arr.substring(0,arr.length-1)
      this.objectInfo.student_answer.content = arr
       this.axios.request({
        method: 'post',
        url: '/index.php/Student/Exam/singleSave',
        data: {
          student_examination_id:this.objectInfo.student_answer.student_examination_id,
          examination_detail_id:this.objectInfo.student_answer.examination_detail_id,
          content:this.objectInfo.student_answer.content,
          video_url:this.objectInfo.student_answer.video_url
        }
      }).then(res => {
        if (res.code === 200) {
        }
      })
    }
  },
  mounted () {
    this.currentIndex = this.questionIndex
    this.getInfo()
  }
}
</script>

