<template>
  <div class="searchpage">
    <Icon type="ios-arrow-back"  class="search-back-btn" @click="closemodal"/>
    <mt-search v-model="value" class="m-search">
      <mt-cell
        v-for="(item,index) in result"
        :title="item.title"
        :value="item.value"
        :key="index"
        placeholder="搜索">
      </mt-cell>
    </mt-search>
  </div>
</template>
<script>
export default {
  data () {
    return {

    }
  },
  watch: {

  },
  methods: {
    closemodal () {
      this.$emit('closemodal')
    }
  },
  mounted () {
  }
}
</script>
