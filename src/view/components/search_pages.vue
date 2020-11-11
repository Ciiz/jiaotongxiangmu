<template>
  <div class="search">
    {{this.$store.state.user.searchResult}}
  </div>
</template>

<script>
import { get_search } from "@/api/common"
export default {
  name: '',

  data () {
    return {
    }
  },
  computed: {
    key () {
      return this.$store.state.user.searchResult
    }
  },

  methods: {},
  mounted () {
  }
}
</script>

<style lang='less' scoped>
.search {
  z-index: 999;
  width: 100%;
  height: 100%;
  background-color: #fff;
}
</style>
