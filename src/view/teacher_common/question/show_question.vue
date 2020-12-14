<template>
  <div>
    <Button type="success" @click="$emit('closeQuestionModal'),isshowAddquestion=true">添加问题</Button>
    <List style="font-size:14px;max-height:500px;overflow-y:scroll">
      <ListItem v-for="(item,index) in problemList" :key="index" style="display:felx">
        <span style="flex:1">
          <span>{{index+1}}、</span>
          <span v-if="item.topic_type===2" style="color:#547A63;margin-right:10px">主观题</span>
          <span v-if="item.topic_type===1" style="color:#7A9AB7;margin-right:10px">客观题</span>
          <span style="word-break:break-all">{{item.content}}</span>
        </span>
        <span style="margin: 0 10px">
          <Button type="error" size="small" @click="showDeleteModel(item.id)">删除</Button>
        </span>
      </ListItem>
    </List>
    <!-- 删除问题 -->
    <Modal v-model="isshowDeleteModel" @on-ok="sureDelete" title="删除" class="question-modal">
      是否确认删除问题
    </Modal>
    <!-- 添加问题 -->
    <Modal v-model="isshowAddquestion" :width="600" footer-hide class="question-modal">
      <coursewareQuestion :add_type="'save'" :courseware_id='courseware_id' @closeModal="closeModal">
      </coursewareQuestion>
    </Modal>
  </div>
</template>

<script>
import coursewareQuestion from '@/view/teacher_common/question/courseware_question.vue'
export default {
  components: { coursewareQuestion },
  props: ['courseware_id'],
  data () {
    return {
      isshowAddquestion: false,
      problemList: [],
      isshowDeleteModel: false,
      delId: ''
    }
  },
  watch: {
    courseware_id (n, i) {
      this.getProblem()
    }
  },
  methods: {
    getProblem () {
      this.axios.request({
        method: 'get',
        url: '/index.php/Teacher/Quiz/get_list',
        params: {
          group: '',
          courseware_id: this.courseware_id,
          type: 1
        }
      }).then(res => {
        if (res.code === 200) {
          this.problemList = res.data.list
        }
      })
    },
    showDeleteModel (i) {
      this.delId = i
      this.isshowDeleteModel = true
    },
    sureDelete () {
      this.axios.request({
        method: 'get',
        url: 'index.php/Teacher/Quiz/delete',
        params: {
          id: this.delId
        }
      }).then(res => {
        if (res.code === 200) {
          this.$Message.success(res.message)
          this.getProblem()
        } else {
          this.$Message.error(res.message)
        }
      })
    },
    closeModal () {
      this.getProblem()
      this.isshowAddquestion = false
    }
  },
  mounted () {
  }
}
</script>

<style>
.question-modal .ivu-modal-wrap {
  z-index: 5010 !important;
}
.question-modal .ivu-modal-mask {
  z-index: 2000 !important;
}
</style>
