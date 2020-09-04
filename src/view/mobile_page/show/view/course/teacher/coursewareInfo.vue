<template>
  <div class="m-coursewareInfo flex-contain">
    <mt-header title="课件信息">
      <router-link to slot="left">
        <mt-button icon="back" @click="$router.back(-1)"></mt-button>
      </router-link>
    </mt-header>
    <div class="m-coursewareInfo-contain hideScroll" style="background:#ffffff">
      <div class="m-coursewareInfo-title">{{sort}} {{courseware_name}}</div>

      <div class="m-coursewareInfo-class">
        <div class="m-coursewareInfo-class-h">已绑定班级</div>
        <div v-for="(item,index) in class_list" :key="index" class="m-coursewareInfo-class-item">
          {{item.class_name}}
        </div>
      </div>
    </div>
    <div class="m-coursewareInfo-liveBtn" @click="popupVisible=true">
      <img src="@/assets/images/mobile_teacher/live.png" />
      <span>直播上课</span>
    </div>
    <mt-popup v-model="popupVisible" v-if="popupVisible===true" popup-transition="popup-fade" closeOnClickModal="true"  style="width:80%">
      <mt-checklist
        title="请选择上课班级"
        v-model="classid"
        :options="options">
      </mt-checklist>
      <div class="entryClass-btn" @click="entryLive()">上课</div>
    </mt-popup>
  </div>
</template>
<script>

export default {
  data () {
    return {
      popupVisible: false,
      options: [],
      classid: [],
      courseware_name: this.$route.query.courseware_name,
      sort: this.$route.query.sort,
      courseware_id: this.$route.query.courseware_id
    }
  },
  computed: {
    class_list () {
      return JSON.parse(this.$route.query.class_list)
    }
  },
  watch: {

  },
  methods: {
    entryLive () {
      this.$router.push({ path: '/mobileLiveTeacher', query: { courseware_id: this.courseware_id, class_id: this.classid } })
    },
    getOptions () {
      this.options = []
      // 去重
      for (let i = 0; i < this.class_list.length; i++) {
        let item = {}
        item.value = this.class_list[i].class_id
        item.label = this.class_list[i].class_name
        this.options.push(item)
      }
    }
  },
  mounted () {
    this.getOptions()
  }
}
</script>
<style>

</style>
