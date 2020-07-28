<template>
  <div style="width: 100%; height: 100%">
    <Krpano :editable="false" :pano_id="pano_id" v-if="pano_type === 'pano'" :styleCls="{width: '100%', height:'100%'}"></Krpano>
    <KrpanoVideo :editable="false" :pano_id="pano_id" v-if="pano_type === 'pano_video'"></KrpanoVideo>
  </div>
</template>

<script>
import Krpano from '@/components/krpano'
import KrpanoVideo from '@/components/krpano-video'
export default {
  components: {
    KrpanoVideo,
    Krpano
  },
  data () {
    return {
      pano_id: this.$route.query.pano_id,
      pano_type: this.$route.query.pano_type
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
