export default {
  data () {
    return {
      modal: false,
      title: '',
      target: '',
      target_id: '',
      modal_width: 1000,
      fullscreen: false,
      footerHide: false,
      modal_top: '100px'
    }
  },
  methods: {
    open (target, target_id, title, modal_width = 1000, footerHide = true, fullscreen = false, modal_top = '100px') {
      this.target = target
      this.modal = true
      this.title = title
      this.target_id = target_id
      this.modal_width = modal_width
      this.fullscreen = fullscreen
      this.footerHide = footerHide
      this.modal_top = modal_top
    }
  }
}
// 打开窗口的公用方法
