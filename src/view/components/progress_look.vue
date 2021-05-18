<template>
  <div class="proress_lool">
    <Row class="training_arrange" :gutter="10">
      <Col span="14" class="training_arrangeL">
      <span>学习进度</span>
      <Button type="info">全部催学</Button>
      </Col>

      <Col span="8" class="training_arrangeR">
      <Button type="info" style="float:right;clear:both;" @click.native="back">返回</Button>
      </Col>
    </Row>
  </div>
</template>

<script>
export default {
  name: '',

  data () {
    return {
    }
  },

  methods: {
    back () {
      this.$emit('handle_back', '')
    }
  }
}
</script>

<style lang='less' scoped>
.training_arrange {
  .training_arrangeL {
    display: flex;
    justify-content: space-between;
    span {
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #333333;
    }
  }
}
</style>
