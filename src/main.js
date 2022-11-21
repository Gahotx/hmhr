import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ELEMENT from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss' // global css
import App from './App'
import store from './store'
import router from './router'
import '@/icons' // icon
import '@/permission' // permission control
import Directives from './directives'
import GlobalComponents from '@/components'
import i18n from '@/lang'

Vue.use(GlobalComponents) // 自定义全局组件
Vue.use(Directives) // 自定义全局指令
Vue.use(ELEMENT)

ELEMENT.Dialog.props.lockScroll.default = false
ELEMENT.MessageBox.setDefaults({
  lockScroll: false
})
ELEMENT.TableColumn.props.align.default = 'center'

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
