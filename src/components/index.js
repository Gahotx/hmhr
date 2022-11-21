// 导入组件
import PageTools from '@/components/PageTools'
import UploadExcel from '@/components/UploadExcel'
import UploadImg from '@/components/UploadImg'
import Lang from './Lang'
import ScreenFull from './ScreenFull'

// 注册组件
export default {
  install(Vue) {
    Vue.component('PageTools', PageTools)
    Vue.component('UploadExcel', UploadExcel)
    Vue.component('UploadImg', UploadImg)
    Vue.component('Lang', Lang)
    Vue.component('ScreenFull', ScreenFull)
  }
}
