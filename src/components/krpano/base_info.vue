<template>
  <div>
    <Form :modal="value">
      <FormItem label="全景标题">
        <Input v-model="se"></Input>
      </FormItem>
    </Form>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {

    }
  },
  watch: {
    value (n, o) {
      this.$emit('input', this.value)
    }
  },
  methods: {

  },
  mounted () {

  }
}
</script>
<style lang="less">

</style>
