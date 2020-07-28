<template>
  <div class="m-membersAnswer flex-contain">
    <mt-header title="组员答案"  style="border-bottom: 1px solid #E5E5E5">
      <router-link to slot="left">
        <mt-button icon="back" @click="back"></mt-button>
      </router-link>
    </mt-header>
    <div class="m-membersAnswer-contain hideScroll">
      <div v-for="(item,index) in members" :key="index" class="m-task-members" v-if="item.submit_status===1" @click="detail(item)">
        <div class="m-task-members-header">
          <img :src="item.icon"/>
          <span style="flex:1">{{item.student_name}}</span>
          <span>{{moment(item.submitted_at * 1000).format('YYYY-MM-DD HH:mm')}}</span>
          <!-- <span>{{item.submit_status}}</span> -->
        </div>
        <div v-html="item.submit_content" class="m-membersAnswer-content"></div>
        <div>
          <span>附件：</span><span>{{item.file_url===null?'无':'1'}}</span>
        </div>
      </div>
      <div class="m-membersAnswer-un">
        <div>未提交：</div>
        <div style="display:flex;flex-wrap:wrap">
          <div v-for="(item,index) in members" :key="index"  v-if="item.submit_status===0" style="text-align:center;margin:0.25rem 0.35rem">
            <div>
              <img :src="item.icon"/>
            </div>
            <div style="color：#666666;font-size:0.26rem">
              {{item.student_name}}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {

    }
  },
  computed: {
    members () {
      return this.$route.query.members
    }
  },
  methods: {
    back () {
      history.go(-1)
    },
    detail (item) {
      this.$router.push({ name: 'membersAnswerDetail', query: { info: item } })
    }
  },
  mounted () {
  }
}
</script>
