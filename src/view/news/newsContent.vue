<template>
  <div class="modal-content">
    <h1 class="news_info_title">{{title}}</h1>
    <p class="news_info_time">发布时间：{{time}}</p>
    <div class="news_info_img">
      <img :src="file_url" alt="" width="100%">
    </div>
    <p v-html="content"></p>
    <a :href="file_url" target="_blank">{{file_name}}</a>
    <Spin v-show="loading" fix></Spin>
  </div>
</template>

<script>
export default {
  props: {
    id: ''
  },
  data () {
    return {
      title: '',
      content: '',
      time: '',
      file_url: '',
      file_name: '',
      loading: false
    }
  },
  watch: {
    id (n) {
      this.showNews(n)
    }
  },
  created () {
  },
  methods: {
    showNews (id) {
      if (!id) return
      this.loading = true
      this.axios.request({
        method: 'get',
        url: '/index.php/home/index/newsShow',
        params: {
          id
        }
      }).then(res => {
        if (res.code === 200) {
          this.title = res.data.school_news.title
          this.content = res.data.school_news.content
          this.time = this.moment(res.data.school_news.created_at * 1000).format('YYYY-MM-DD HH:mm')
          this.file_url = res.data.school_news.files[0].file_url
          this.file_name = res.data.school_news.files[0].file_name
        }
        this.loading = false
      })
    }
  },
  mounted () {
    this.showNews(this.id)
  }
}
</script>
<style>
</style>
