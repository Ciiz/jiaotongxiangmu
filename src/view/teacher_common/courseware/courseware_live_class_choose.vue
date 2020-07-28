<template>
  <div style="margin-bottom:37px;padding:5px;overflow:auto">
    <CheckboxGroup v-model="class_id">
      <div v-for="item in classList" :key="item.class_id">
        <Checkbox :label="item.class_id" >{{item.class_name}}</Checkbox>
      </div>
    </CheckboxGroup>
    <div class="modal-footer">
      <Button @click='confirm()' type="primary">确定</Button>
    </div>
  </div>
</template>
<script>
import modal_mixin from '@/view/mixins/modal_mixin'
export default{
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
      class_id: [],
      t_id: []
    }
  },
  methods: {
    confirm () {
      this.t_id = []
      for (let i = 0; i < this.class_id.length; i++) {
        for (let j = 0; j < this.classList.length; j++) {
          if (this.class_id[i] === this.classList[j].class_id) {
            this.t_id.push(this.classList[j].timetable_id)
          }
        }
      }
      this.$router.push({ path: '/live_teacher', query: { t_id: this.t_id, courseware_id: this.courseware_id, class_id: this.class_id, live_status: this.live_status, course_status: this.course_status } })
      // this.open('courseware_live', {}, '课件直播', 1000, true, true)
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
    this.t_id = []
    for (let i = 0; i < this.classList.length; i++) {
      this.t_id.push(this.classList[i].timetable_id)
    }
  }
}
</script>
