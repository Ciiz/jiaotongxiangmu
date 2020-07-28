<template>
  <div>
    <Form :modal="special_effect" :label-width="100">
      <FormItem label="名称">
        <Input v-model="special_effect.label"></Input>
      </FormItem>
      <!-- <FormItem label="图像">
        <Input v-model="special_effect.value"></Input>
      </FormItem> -->
      <FormItem label="下落速度">
        <InputNumber v-model="special_effect.speed"></InputNumber>
      </FormItem>
      <FormItem label="晃动频率">
        <InputNumber v-model="special_effect.shake"></InputNumber>
      </FormItem>
      <FormItem label="数量">
        <InputNumber v-model="special_effect.flakes"></InputNumber>
      </FormItem>
      <FormItem label="缩放">
        <InputNumber v-model="special_effect.imagescale"></InputNumber>
      </FormItem>
      <FormItem label="风力">
        <InputNumber v-model="special_effect.wind"></InputNumber>
      </FormItem>
      <FormItem label="风向">
        <InputNumber v-model="special_effect.winddir"></InputNumber>
      </FormItem>
    </Form>
    <RadioGroup v-model="special_effect.value" @on-change="handleChange">
      <Radio :label="item.value" v-for="(item,index) in specialList" :key="index" >{{item.label}}</Radio>
    </RadioGroup>
  </div>
</template>
<script>
import { specialList } from './data'
export default {
  props: {
    value: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      specialList: specialList,
      special_effect: {}
    }
  },
  watch: {
    special_effect: {
      handler (n, o) {
        this.$emit('input', n)
        this.$emit('on-change', n)
      },
      deep: true,
      immediate: true
    },
    value: {
      handler (n, o) {
        this.special_effect = n
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleChange (val) {
      let arr = JSON.parse(JSON.stringify(this.specialList))
      for (let i in arr) {
        if (arr[i].value === val) {
          this.special_effect = arr[i]
          break
        }
      }
    }
  },
  mounted () {
    this.special_effect = this.value
  }
}
</script>
<style lang="less">

</style>
