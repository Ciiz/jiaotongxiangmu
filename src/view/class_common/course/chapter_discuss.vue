<template>
  <div>
    <div>
      <div v-if="Object.keys(discussInfo).length===0">暂无评论</div>
      <div v-for="(item,index) in discussInfo" :key="index" class="discuss_list">
        <Row>
          <Col :span="1">
            <img :src="item.icon" width="40px" class="dis_ico"/>
          </Col>
          <Col :span="23" style="padding-left:20px">
            <div class="dis_name">{{item.name}}</div>
            <div class="dis_time">{{changeTime(item.created_at)}}</div>
            <div v-html="item.content" class="dis_content"></div>
            <div class="dis_del" @click="delDis(item.id)" v-if="item.student_id===$store.state.user.userInfo.userId&&$store.state.user.userInfo.userType===2">删除</div>
          </Col>
        </Row>
      </div>
    </div>
    <Page :total="total" size="small" @on-change="changePage" show-elevator style="text-align:center;margin:20px 0"/>
    <!-- <Input v-model="writeDiscuss" :rows="4" type="textarea" placeholder="请填写评论" /> -->
    <div v-if="$store.state.user.userInfo.userType===2">
      <editor v-model="writeDiscuss" ref="editor" :height="300"  is_init='true'></editor>
      <Button type="primary" @click="addDiscuss()" style="margin-top:10px">评论</Button>
    </div>
    <Spin v-show="loading" fix></Spin>
  </div>
</template>
<script>
import editor from '@/components/editor'
export default {
  props: { chapter_id: '', type: '' },
  components: {
    editor
  },
  data () {
    return {
      page: 1,
      total: 0,
      writeDiscuss: '',
      loading: false,
      discussInfo: []
    }
  },
  watch: {
    chapter_id (n) {
      this.getInfo()
    }
  },
  methods: {
    getInfo () {
      if (this.$store.state.user.userInfo.userType === 1) {
        this.loading = true
        this.axios
          .request({
            method: 'get',
            url: '/index.php/Teacher/ChapterClass/discuss_list',
            params: {
              page: this.page,
              chapter_class_id: this.chapter_id,
              comment_course_type: this.type
            }
          }).then(res => {
            if (res.code === 200) {
              this.discussInfo = res.data.list
              this.total = res.data.total
            }
            this.loading = false
          })
      } else if (this.$store.state.user.userInfo.userType === 2) {
        this.loading = true
        this.axios
          .request({
            method: 'get',
            url: '/index.php/Student/ChapterClass/discuss_list',
            params: {
              page: this.page,
              chapter_class_id: this.chapter_id,
              comment_course_type: this.type
            }
          }).then(res => {
            if (res.code === 200) {
              this.discussInfo = res.data.list
              this.total = res.data.total
            }
            this.loading = false
          })
      }
    },
    changePage (v) {
      this.page = v
      this.getInfo()
    },
    delDis (val) {
      this.axios
        .request({
          method: 'post',
          url: '/index.php/Student/ChapterClass/delete_discuss',
          data: {
            id: val
          }
        }).then(res => {
          if (res.code === 200) {
            this.$Message.success(res.message)
            this.getInfo()
          } else {
            this.$Message.error(res.message)
          }
          this.loading = false
        })
    },
    addDiscuss () {
      if (this.writeDiscuss === '') {
        this.$Message.error('请输入你要发表的内容')
      } else {
        this.axios
          .request({
            method: 'post',
            url: '/index.php/Student/ChapterClass/add_discuss',
            data: {
              chapter_class_id: this.chapter_id,
              parent_id: 0,
              content: this.writeDiscuss,
              comment_course_type: this.type
            }
          }).then(res => {
            if (res.code === 200) {
              this.$Message.success('评论成功')
              this.getInfo()
              this.writeDiscuss = ''
            }
          })
      }
    },
    changeTime (v) {
      return this.moment(v * 1000).format('YYYY-MM-DD')
    }
  },
  mounted () {
    this.getInfo()
  }
}
</script>
<style>
  .discuss_list{
    border-bottom: 1px solid rgb(232, 234, 236);
    padding: 5px 10px
  }
  .dis_ico{
    vertical-align:middle;
    border-radius:50%
  }
  .dis_name{
    font-size:16px;
    font-weight:bold
  }
  .dis_time{
    color:gray
  }
  .dis_content{
    font-size:16px;
    margin-top:5px
  }
  .dis_del{
    color:red;
    float:right;
    cursor: pointer;
  }
</style>
