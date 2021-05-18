import axios from 'axios'
import store from '@/store'
import { Message } from 'view-design'
import qs from 'qs'
// import config from '@/config'
import Cookies from 'js-cookie'
import { TOKEN_KEY } from '@/libs/util'
// const IndexPage = process.env.NODE_ENV === 'development' ? '/' : config.portalDomain
const addErrorLog = errorInfo => {
  const { statusText, status, request: { responseURL } } = errorInfo
  let info = {
    type: 'ajax',
    code: status,
    mes: statusText,
    url: responseURL
  }
  if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)
}

class HttpRequest {
  constructor(baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        //
      }
      // auth: 'Bearer ' + Cookies.get(TOKEN_KEY)
    }
    return config
  }
  destroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
    }
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
      }
      this.queue[url] = true
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      this.destroy(url)
      const { data } = res
      if (data.code !== 200) {
        // 后端服务在个别情况下回报201，待确认
        if (data.code === 401) {
          Cookies.remove(TOKEN_KEY)
          store.commit('setToken', '')
          store.commit('setAccess', [])
          setTimeout(() => {
            window.location.href = '/'
          }, 1000)
          Message.error('未登录，或登录失效，请登录', 3000)
        } if (data.code === 403) {
          Message.warning({
            content: '权限不足，请联系系统管理员赋予相关权限',
            duration: 10
          })
        } if (data.code === 405) {
          store.commit('setToken', '')
          store.commit('setAccess', [])
          setTimeout(() => {
            window.location.href = '/'
          }, 1000)
        } else {
          if (data.message) {
            Message.error({
              content: data.message,
              duration: 2,
              closable: true
            })
          }
          return data
        }
        return false
      }
      return data
    }, error => {
      this.destroy(url)
      let errorInfo = error.response
      Message.error('服务器异常!')
      if (!errorInfo) {
        const { request: { statusText, status }, config } = JSON.parse(JSON.stringify(error))
        errorInfo = {
          statusText,
          status,
          request: { responseURL: config.url }
        }
      }
      addErrorLog(errorInfo)
      return Promise.resolve(error)
      // return Promise.reject(error)
    })
  }
  request (options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    if (options.method.toUpperCase() === 'POST' && options.headers['Content-Type'] !== 'multipart/form-data') {
      options.data = qs.stringify({ ...options.data })
    }
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
