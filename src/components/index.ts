import IconSvg from './IconSvg/index.vue'
//注入全部icon组件
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import Category from './category/index.vue'

const allGlobalComponent = { IconSvg, Category }
export default {
  install(app) {
    Object.keys(allGlobalComponent).forEach((item) => {
      app.component(item, allGlobalComponent[item])
    })
    //组成全部icon组件为全局组件
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  },
}
