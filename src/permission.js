import router, { variableRoutes } from './router'
import store from '@/store'
import getPageTitle from '@/utils/get-page-title'
// 导入进度条插件
import NProgress from 'nprogress'
// 导入进度条样式
import 'nprogress/nprogress.css'

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
      // 防止刷新页面时获取不到vuex中用户信息
      if (!store.getters.name) {
        await store.dispatch('user/getUserInfoActions')
        const menus = store.state.user.userInfo.roles.menus
        const filterRoutes = variableRoutes.filter(obj => {
          const name = obj.children[0].name.toLowerCase()
          return menus.includes(name)
        })
        // 保证404在路由表最末尾
        filterRoutes.push({ path: '*', redirect: '/404', hidden: true })
        // 将过滤后动态路由添加进路由表（未添加进路由表的动态路由无权访问）
        router.addRoutes(filterRoutes)
        store.commit('permission/setRoutes', filterRoutes)
        // 解决刷新出现的白屏
        next({
          path: to.path, // 保证路由添加完了再进入页面 (可以理解为重进一次)
          replace: true // 重进一次, 不保留重复历史
        })
        NProgress.done()
      }
      // vux中已有用户信息则直接放行
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
router.afterEach((to, from) => {
  // 正常 next() 跳转才走后置守卫
  document.title = getPageTitle(to.meta.title)
  NProgress.done()
})
