export default {
  computed: {
    action_url () {
      // return this.action ? this.action : `${this.baseUrl}/server/api/upload/upload_file`
      return this.action ? this.action : `${this.fileDomain}/Service/index.php/api/upload/upload_file`
    }
  }
}
