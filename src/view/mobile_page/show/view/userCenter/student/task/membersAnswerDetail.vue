<template>
  <div class="m-membersAnswer flex-contain">
    <mt-header title="xxx提交的"  style="border-bottom: 1px solid #E5E5E5">
      <router-link to slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
  </div>
</template>
<script>
export default {
  data () {
    return {

    }
  },
  computed: {
    info () {
      return this.$route.query.info
    }
  },
  methods: {
  },
  mounted () {
  }
}
</script>
