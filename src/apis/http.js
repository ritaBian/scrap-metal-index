import axios from 'axios'
import { myBrowser } from './common'
import 'url-search-params-polyfill'
// import { Message } from 'element-ui'
// 设置token
// 跨域请求携带cookie
axios.defaults.withCredentials = false
axios.defaults.baseURL = 'https://indices.oilchem.net'
// 请求时的拦截
axios.interceptors.request.use(
  config => {
    const { method, data, url } = config
    // get参数编码
    if (method === 'get' && data) {
      config.url =
        url +
        '?' +
        Object.keys(data)
          .map(key => `${key}=${encodeURIComponent(data[key])}`)
          .join('&')
      // 如果是IE浏览器，发送get请求时附加一个时间戳来禁用缓存
      if (myBrowser().includes('IE')) {
        config.url += 'timestamp=' + new Date().getTime()
      }
      delete config.data
    }
    return config
  },
  error => Promise.reject(error)
)

const common = options => {
  return new Promise((resolve, reject) => {
    axios({ ...options })
      .then(({ data, status }) => {
        if (status === 200 && data.status === '200') {
          resolve(data)
        } else {
          reject(data)
        }
      })
      .catch(err => {
        reject(err)
      })
  })
}

// 函数柯里化
// const createApi = ({ method = 'get', url, baseURL = 'https://indices.oilchem.net' }) => {
//   return data => common({ url, method, data, baseURL })
// }

export default common
