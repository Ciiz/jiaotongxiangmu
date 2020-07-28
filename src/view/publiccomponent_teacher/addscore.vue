<template>
  <div>
    <Form  :label-width="80">
      <FormItem label="评价维度" required>
        <Select v-model="formValidate.score" placeholder="选择评分维度">
          <Option   v-for="item in formValidate.scorelist" :key="item.value" :value='item.value'>{{item.label}}</Option>
        </Select>
      </FormItem>
      <FormItem>
        <div class="homelist_radio"  v-for=" (taskitem,index) in taskscorelist" :key="index + '001'" style="margin-bottom:5px;">
          <span>维度名称：
             <Input type="text" placeholder="请输入维度名称" style="width:200px;" v-model="taskitem.editorvalue" />
          </span>
          <span> 维度分值:</span>
            <RadioGroup type="button" size="large">
              <span style="margin-left:5px;">
                <Input type="text" placeholder="权重分值" :maxlength="5" number style="width:100px;margin-right:5px;" v-model="taskitem.weightvalue"/>
                <Tag color="warning">只能输入1-100的数字</Tag>
              </span>
            <Button style="" @click="remove(index)" size="small" type="error">删除</Button>
            </RadioGroup><br>
        </div>
      </FormItem>
      <FormItem>
        <Button style="font-size:30px;" @click="isadd()">+</Button>
      </FormItem>
      <FormItem  v-if="isshow">
       <Button style="" @click="submit()">提交</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
export default {
  props: ['taskid', 'isshowsubmit', 'type_option'],
  data () {
    return {
      isshow: true,
      axiosdata: {
        id: 0,
        dimensions: [],
        descriptions: [],
        weights: []
      },
      weightcomputed: 0,
      taskscorelist: [],
      datatest: [],
      datalist: [],
      showok: false,
      teamevascore1: '',
      teamevascore2: '',
      teamevascore3: '',
      teamevascore: [],
      formValidate: {
        score: 0,
        scorelist: [
        ]
      },
      scorelist: []
    }
  },
  created () {
    if (this.isshowsubmit === false) {
      this.isshow = this.isshowsubmit
    } else {
      this.isshow = true
    }
    this.getInfo()
  },
  watch: {
    scorelistvalue (newvalue) {
      this.taskscorelist.splice(0, this.taskscorelist.length)
      if (newvalue.toString() === '自定义模板') {
        let dataclone = this.datatest.data.score_option_list
        for (let item in dataclone) {
          this.taskscorelist.push(
            {
              dimension: dataclone[item].option_name,
              weight: dataclone[item].weight,
              editorvalue: dataclone[item].option_name,
              weightvalue: dataclone[item].weight
            })
        }
      } else {
        for (let item in this.datalist) {
          let clonelist = this.datalist[item]
          for (let i in clonelist) {
            if (i === this.formValidate.score) {
              for (let ii in clonelist[i]) {
                this.taskscorelist.push(
                  {
                    dimension: clonelist[i][ii].dimension,
                    weight: clonelist[i][ii].weight,
                    editorvalue: clonelist[i][ii].dimension,
                    weightvalue: clonelist[i][ii].weight
                  })
              }
              break
            }
          }
        }
      }

      for (let item in this.taskscorelist) {
        if (typeof this.taskscorelist[item].dimension === 'undefined') {
          this.taskscorelist.splice(this.taskscorelist.indexOf(this.taskscorelist[item]))
        }
      }
    }
  },
  computed: {
    scorelistvalue () {
      return this.formValidate.score
    }
  },
  methods: {
    submit () {
      this.axiosdata.id = this.taskid
      this.axiosdata.dimensions.splice(0, this.axiosdata.dimensions.length)
      this.axiosdata.descriptions.splice(0, this.axiosdata.descriptions.length)
      this.axiosdata.weights.splice(0, this.axiosdata.weights.length)
      let weighttotal = 0
      for (let item in this.taskscorelist) {
        this.axiosdata.dimensions.push(this.taskscorelist[item].editorvalue)
        this.axiosdata.descriptions = []
        this.axiosdata.weights.push(this.taskscorelist[item].weightvalue)
        weighttotal += Number(this.taskscorelist[item].weightvalue)
      }
      if (Number(weighttotal) !== 100) {
        this.$Message.error({
          content: `各评分维度之和需为100,当前维度总和为${weighttotal}`,
          duration: 5
        })
        return false
      }
      let url = ''
      if (this.type_option === 'task') {
        url = '/index.php/Teacher/Task/score_option_save'
      } else if (this.type_option === 'homework') {
        url = '/index.php/Teacher/Homework/score_option_save'
      }
      this.axios.request({
        method: 'post',
        url,
        params: {
          id: this.axiosdata.id
        },
        data: {
          dimensions: this.axiosdata.dimensions,
          descriptions: this.axiosdata.descriptions,
          weights: this.axiosdata.weights
        }
      }).then(res => {
        if (res.code === 200) {
          this.$Message.success(res.message)
          this.$emit('closeeditor', false)
        }
      })
    },
    weightonchange (index) {
      this.taskscorelist[index].weight = this.taskscorelist[index].weightvalue
    },
    remove (index) {
      this.taskscorelist.splice(index, 1)
    },
    isadd () {
      if (this.formValidate.score !== 0) {
        this.taskscorelist.push(
          {
            dimension: '新增维度',
            weight: 0,
            editorvalue: '新增维度',
            weightvalue: 0
          }
        )
      } else {
        this.$Message.error('请先选择模板才能使用新增功能')
      }
    },
    getInfo () {
      let url = ''
      if (this.type_option === 'task') {
        url = '/index.php/Teacher/Task/score_option_info'
      } else if (this.type_option === 'homework') {
        url = '/index.php/Teacher/Homework/score_option_info'
      }
      this.axios.request({
        method: 'get',
        url,
        params: {
          id: this.taskid
        }
      }).then(res => {
        if (res.code === 200) {
          this.datatest = res
          let scoretemplate = res.data.score_template
          for (let item in scoretemplate) {
            this.formValidate.scorelist.push({ label: scoretemplate[item].name, value: item })
            this.datalist.push(scoretemplate)
          }
          if (res.data.score_option_list) {
            this.formValidate.scorelist.push({ label: '自定义模板', value: '自定义模板' })
            this.formValidate.score = '自定义模板'
          }
        }
      })
    }
  }
}
</script>
