<template>
  <div class="m_cell">
    <slot class="left" name="left"> </slot>
    <div class="m_cell_title">{{title}}</div>
    <slot name="right"></slot>
  </div>
</template>

<script>
export default {
  props: ['title'],
  data () {
    return {
    }
  },

  methods: {}
}
</script>

<style lang='less' scoped>
.m_cell {
  .m_cell_title {
    font-size: 0.38rem;
    font-family: PingFang SC;
    font-weight: bold;
    color: #000000;
  }
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.3rem 0.2rem;
  img {
    width: 0.2rem;
    height: 0.4rem;
  }
}
</style>
