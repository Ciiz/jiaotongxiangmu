export default {
  /**
   * @description 配置显示在浏览器标签的title
   */
  title: '职教沃云',
  /**
   * @description token在Cookie中存储的天数，默认1天
   */
  cookieExpires: 1,
  /**
   * @description 是否使用国际化，默认为false
   *              如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: 'xxx'}
   *              用来在菜单中显示文字
   */
  useI18n: false,
  /**
   * @description api请求基础路径
   */
  baseUrl: {
    dev: '/dev_api',
    pro: '/'
  },
  /**
   * @description 默认打开的首页的路由name值，默认为home
   */
  homeName: 'index',
  /**
   * @description 需要加载的插件
   */
  plugin: {
    // 'error-store': {
    //   showInHeader: false, // 设为false后不会在顶部显示错误日志徽标
    //   developmentOff: false // 设为true后在开发环境不会收集错误信息，方便开发中排查错误
    // }
  },
  portalDomain: process.env.VUE_APP_PORTAL_DOMAIN, // 正式环境的域名
  gatewayWrokerHost: process.env.VUE_APP_GATEWAYWORKER, // 直播，聊天的gatewayworker地址
  fileDomain: process.env.VUE_APP_FILE_DOMAIN || 'http://file.zhijiao.com'// 文件域名
}
