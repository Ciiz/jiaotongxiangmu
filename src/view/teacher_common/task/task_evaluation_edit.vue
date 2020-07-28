<template>
  <div>
    <Form :label-width="80">
      <FormItem label="模板列表">
        <Select @on-change="handleTemplateChange"  placeholder="选择其他模板">
          <Option :value="index1" v-for="(item,index1) in templateList" :key="item.id">
            <p>{{item.name}}</p>
            <div class="template-option">
              <span v-for="(option,index) in item.score_options" :key="index">{{option.dimension}}&nbsp;&nbsp;&nbsp;</span>
            </div>
          </Option>
        </Select>
      </FormItem>
      <FormItem label="评分维度:">
      <Alert>请输入1-100的数字</Alert>
        <Row>
          <table class="score-table" border="1px;" rules="all"  cellpadding="10">
            <thead>
              <th>维度名称</th>
              <th>权重</th>
              <th>操作</th>
            </thead>
            <tbody>
              <tr  v-for="(item,index) in score_option" :key="index">
                <td>
                  <Input v-model="item.option_name"></Input>
                </td>
                <td>
                  <Input v-model="item.weight"></Input>
                </td>
                <td style="width:50px">
                  <Button @click="score_option.splice(index,1)" icon="md-minus">删除</Button>
                </td>
              </tr>
            </tbody>
          </table>
          <Button long type="dashed" icon="md-add" @click="score_option.push({option_name: '新增维度', weight: 0})">添加维度</Button>
        </Row>
      </FormItem>
      <FormItem label="">
        <Button type="primary" @click="submit">保存</Button>
      </FormItem>
    </Form>
    <Spin fix v-if="loading"></Spin>
  </div>
</template>
<script>
export default{
  props: {
    id: ''
  },
  data () {
    return {
      templateList: [],
      score_option: [],
      loading: false
    }
  },
  watch: {
    id (n, o) {
      this.getInfo()
    }
  },
  methods: {
    getInfo () {
      this.loading = true
      this.axios.request({
        method: 'get',
        url: '/index.php/Teacher/Task/score_option_info',
        params: {
          id: this.id
        }
      }).then(res => {
        if (res.code === 200) {
          // 处理返回结果
          let data = res.data
          this.score_option = Object.values(data.score_option_list)
          let template_arr = Object.values(data.score_template)
          let template_list = []
          template_arr.forEach(item => {
            let name = item.name
            delete item.name
            template_list.push({ name: name, score_options: Object.values(item) })
          })
          this.templateList = template_list
          this.templateList.unshift({ name: '自定义模板', score_options: [] })
        }
        this.loading = false
      })
    },
    handleTemplateChange (index) {
      this.score_option = this.templateList[index].score_options.map(item => { return { option_name: item.dimension, weight: item.weight } })
    },
    submit () {
      let dimensions = []
      let weights = []
      for (let i in this.score_option) {
        dimensions.push(this.score_option[i].option_name)
        weights.push(this.score_option[i].weight)
      }
      this.axios.request({
        method: 'post',
        url: '/index.php/Teacher/Task/score_option_save',
        params: {
          id: this.id
        },
        data: {
          dimensions,
          weights
        }
      }).then(res => {
        if (res.code === 200) {
          this.$Message.success(res.message)
          this.$emit('success')
        }
      })
    }
  },
  mounted () {
    this.getInfo()
  }
}
</script>
<style lang="less" scoped>
.template-option{
  span{
    color: #999;
  }
}
.score-table{
  width: 100%;
  border-color: #ccc;
  td{
    width: 50%;
    text-align: center;
    padding: 5px;
  }
}
</style>
