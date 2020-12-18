<template>
  <div style="margin-bottom:37px;padding:5px;overflow:auto">
    <CheckboxGroup v-model="class_id">
      <div v-for="item in classList" :key="item.class_id">
        <Checkbox :label="item.class_id">{{item.class_name}}</Checkbox>
      </div>
    </CheckboxGroup>
    <div class="modal-footer">
      <Button @click='confirm()' type="primary">确定</Button>
    </div>
  </div>
</template>
<script>
import modal_mixin from '@/view/mixins/modal_mixin'
export default {
  mixins: [modal_mixin],
  components: {
  },
  props: {
    courseware_id: '',
    classList: {
      type: Array,
      default: () => {
        return []
      }
    },
    live_status: '',
    course_status: ''
  },
  data () {
    return {
      class_id: []
    }
  },
  methods: {
    confirm () {
      console.log(this.course_status);
      this.$router.push({ path: '/live_teacher', query: { courseware_id: this.courseware_id, class_id: this.class_id, live_status: this.live_status, course_status: this.course_status } })
    },
    handleVisiableChange (isShow) {
      if (!isShow) {
        this.target = ''
        this.$emit('finished')
      }
    },
    closePage () {
      this.$refs.coursewareLive.finnishClass()
    }
  },
  mounted () {
  }
}
</script>
