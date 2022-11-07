import store from '@/store'
import axios from 'axios'
import { Message } from 'element-ui'
import router from '@/router'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    const token = store.getters.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const { success, message } = response.data
    if (success) {
      return response.data
    } else {
      // 如：用户名或密码错误
      Message.error(message)
      return Promise.reject(message)
    }
  },
  error => {
    // 如：token超时
    Message.error(error?.response?.data?.message + '，请重新登录！')
    if (error?.response?.data?.code === 10002) {
      store.dispatch('user/logoutActions')
      router.replace(`/login?redirect=${encodeURIComponent(router.currentRoute.fullPath)}`)
    }
    return Promise.reject(error)
  }
)

export default service
