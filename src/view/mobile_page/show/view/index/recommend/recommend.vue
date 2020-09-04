<template>
  <div>
    <div class="recommend-choose">
      <div>
        <div>
          <Icon type="ios-bookmarks-outline"/>
        </div>
        <div>我的课程</div>
      </div>
      <div>
        <div>
          <Icon type="ios-time-outline" />
        </div>
        <div>历史记录</div>
      </div>
      <div>
        <div>
          <Icon type="ios-volume-up" />
        </div>
        <div>最新公告</div>
      </div>
      <div>
        <div>
          <Icon type="ios-chatboxes-outline" />
        </div>
        <div>问题讨论</div>
      </div>
    </div>
    <div class="recommendTeacher">
  <div class="recommendTeacher-header">
    <div class="recommendTeacher-header-left">教师推荐</div>
    <div class="recommendTeacher-header-right">更多</div>
  </div>
  <div class="recommendTeacher-center"></div>
  <div class="recommendTeacher-footer"></div>
    </div>
    <div></div>
  </div>
</template>
<script>
import { recommendTeacher } from '@/api/common'
export default {
  data () {
    return {

    }
  },
  methods: {

  },
  mounted () {
    recommendTeacher().then(res => {
      console.log()
    })
  }
}
</script>
<style lang='less' scoped>

</style>
