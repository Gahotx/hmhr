// 导入 Vue
import Vue from 'vue'

// 导入 vue-i18n 插件
import VueI18n from 'vue-i18n'
import locale from 'element-ui/lib/locale' // 导入 Element 语言配置插件
import enLocale from 'element-ui/lib/locale/lang/en' // 导入 Element 英文包
import zhLocale from 'element-ui/lib/locale/lang/zh-CN' // 导入 Element 中文包
import customZh from './zh'
import customEn from './en'

Vue.use(VueI18n)

// 创建国际化插件的实例
const i18n = new VueI18n({
  locale: 'zh', // 设置地区，zh 表示中国地区
  // 设置地区信息
  messages: {
    en: {
      ...enLocale,
      ...customEn
    },
    zh: {
      ...zhLocale,
      ...customZh
    }
  }
})

// 配置 Element 语言转换关系
locale.i18n((key, value) => i18n.t(key, value))

export default i18n
