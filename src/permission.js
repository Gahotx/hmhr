import router from './router'
// 导入进度条插件
import NProgress from 'nprogress'
// 导入进度条样式
import 'nprogress/nprogress.css'
import store from '@/store'

const whiteList = ['/login'] // no redirect whitelist

NProgress.configure({ showSpinner: false })

// 前置守卫
router.beforeEach(async(to, from, next) => {
  NProgress.start()
  const token = store.getters.token
  if (token) {
    // 已登录
    if (to.path === '/login') {
      next('/')
      NProgress.done()
    } else {
      if (!store.getters.name) {
        store.dispatch('user/getUserInfoActions')
      }
      next()
    }
  } else {
    // 未登录
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

// 后置守卫
router.afterEach(() => {
  // 正常 next() 跳转才走后置守卫
  NProgress.done()
})
