import axios, { AxiosResponse, AxiosRequestConfig, AxiosPromise, Axios } from 'axios'
import Config from 'src/config'
import $bus from "@/utils/mitt"
import { Dialog } from 'vant'

interface RequestConfig extends AxiosRequestConfig {
  trimNull?: boolean;
  needLoading?: boolean;
  ignoreCode?: boolean;
  mock?: boolean;
  mockhost?: string;
}

interface ResponseDetail extends AxiosResponse {
  config: RequestConfig;
  [propName: string]: any;
}

interface DefAxiosInstance extends Axios {
  (config: RequestConfig): AxiosPromise;
  (url: string, config?: RequestConfig): AxiosPromise;
}

const defaultConfig: RequestConfig = {
  baseURL: Config.host,
  headers: {},
  trimNull: true, // 是否去除空值
  withCredentials: true, // default
  needLoading: false, // 是否需要加载效果
  ignoreCode: false, // 是否忽略服务端的错误提示
  timeout: 5000
}
const axiosInstance: DefAxiosInstance = axios.create(defaultConfig)

function isNull (obj: any) {
  if (obj !== undefined && obj !== null) {
    for (let [key, value] of Object.entries(obj)) {
      if (typeof value == 'object' && !(value instanceof Date)) isNull(value)
      if (typeof value != 'boolean' && !value && typeof value != 'number') {
        delete obj[key]
      }
    }
  }
}

axiosInstance.interceptors.request.use(function (config: RequestConfig) {
  if (config.needLoading) {
    $bus.emit('loading.show')
  }
  const timeStamp = {
    _t: new Date().getTime()
  }
  if (config.params) {
    Object.assign(config.params, timeStamp)
  } else {
    config.params = timeStamp
  }
  const userInfo = JSON.parse(window.localStorage.getItem('userInfo') || '{}')
  const token = userInfo?.token
  console.log('token', token)
  if (token) {
    config.headers.Authorization = 'Bearer ' + token
  }
  
  config.data = config.data || {}
  if (config.trimNull && !(config.data instanceof window.FormData)) {
    let _data = Object.assign({}, config?.data)
    isNull(_data)
    config.data = _data
  }
  if (Config.mock) {
    config.withCredentials = false
    config.url = config.url.replace(Config.host, Config.mockhost)
  }
  console.log(config)
  return config
}, function (error) {
  return Promise.reject(error)
})

axiosInstance.interceptors.response.use(function (response: ResponseDetail) {
  console.log(response)
  if (response.config.needLoading) {
    $bus.emit('loading.hide')
  }
  const code = response.data.code
  if (code !== 0 && !response.config.ignoreCode) {
    return Promise.reject(response)
  } else {
    const resData: any = response.data?.data || {}
    return resData
  }
}, function (error) {
  let status = error.response && error.response.status
  let message = error.message
  $bus.emit('loading.hide')
  if (status == 401) {
    Dialog.alert({
      message: '认证失败, 请重新登录'
    }).then(() => {
      $bus.emit('logout')
    })
  } else {
    Dialog.alert({
      message: message,
    })
  }
  
  console.log(status, message, error)
  return Promise.reject(error)
})

export default axiosInstance
