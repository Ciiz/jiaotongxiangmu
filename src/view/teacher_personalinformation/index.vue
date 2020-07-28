<template>
<div>
  <div style="margin-top:20px;">
    <basicinformation-modification ></basicinformation-modification>
  </div>
</div>
</template>
<script>
import basicinformationModification from './components/basicinformation_modification.vue'
export default {
  components: { basicinformationModification },
  data () {
    return {
      infochoose: 'infochoose1'
    }
  },
  created () {
    if (this.$route.query.type !== undefined) {
      this.infochoose = 'infochoose2'
    }
  }
}
</script>
