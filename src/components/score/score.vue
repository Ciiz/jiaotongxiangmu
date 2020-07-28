<template>
<div class="score-option">
  <label for="" v-if="label">{{label}}:</label>
  <div style="width:152px;display:inline-block">
    <InputNumber style="width:100%" size="small" :readonly="disabled" v-if="!disabled" :min="0" :max="100" :step="10"  v-model="score" :formatter="value => `${value}分`" :parser="value => value.replace('分', '')" placeholder=""></InputNumber>
    <Tag v-else>{{`${value}分`}}</Tag>
  </div>
</div>
</template>
<script>
export default {
  props: {
    value: {
      type: Number,
      default: 0
    },
    disabled: {
      type: Boolean,
      default: false
    },
    label: '',
    data: {
      type: Array,
      default: function () {
        return [
          { value: 1, label: '差' },
          { value: 2, label: '中' },
          { value: 3, label: '良' },
          { value: 4, label: '优' }
        ]
      }
    }
  },
  data () {
    return {
      score: 0
    }
  },
  watch: {
    score (n, o) {
      this.$emit('input', n)
    }
  },
  methods: {
  },
  mounted () {
    this.score = this.value
  }
}
</script>
<style scoped lang="less">
.score-option{
  display: inline-block;
  margin: 5px;
  display: flex;
  align-items: center;
  label{
    color: #333;
    width: 80px;
    display: inline-block;
    text-align: center;
  }
  .checked {
    background:#0084FF!important;
    border: 1px solid #0084FF!important;
    transition: all 0.3s ease-in;
  }
  .item{
    font-size: 12px;
    background: #ccc;
    color: #fff;
    border: 1px solid #ccc;
    border-radius: 100%;
    margin: 4px;
    width: 30px;
    display: inline-block;
    box-sizing: border-box;
    height: 30px;
    line-height: 29px;
    text-align: center;
    padding-right: 3px;
    transition: all 0.3s ease-out;
  }
}
</style>
