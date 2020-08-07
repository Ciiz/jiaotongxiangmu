<template>
  <div class="flex-contain">
    <mt-header title="指定的班级">
      <router-link to slot="left">
        <mt-button icon="back" @click="back"></mt-button>
      </router-link>
    </mt-header>
    <div class="m-classList-contain hideScroll">
      <div v-for="(item,index) in class_list" :key="index" class="m-classList-item" @click="tolink(item)">
        <div class="m-classList-item-name">{{item.class_name}}</div>
        <div class="m-classList-item-info">
          <span>学生：</span>
          <span style="color:#222222;margin-right:0.5rem">xx</span>
          <span>状态：</span>
          <span style="color:#222222">{{item.release_staus===0?'未发布':'已发布'}}</span>
        </div>
      </div>
    </div>
    <div class="m-courseInfo-btn" style="background:#3699FF;padding:0.3rem 0">课件预览</div>
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
  computed: {
    class_list () {
      return JSON.parse(this.$route.query.class_list)
    },
    id () {
      return JSON.parse(this.$route.query.id)
    }
  },
  methods: {
    back () {
      window.history.go(-1)
    },
    tolink (item) {
      this.$router.push({ name: 'mobileTaskListT', query: { timetable_id: item.timetable_id, id: this.id } })
    }
  },
  mounted () {
  }
}
</script>
