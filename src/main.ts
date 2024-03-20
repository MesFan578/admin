//@ts-ignore
import { createApp } from 'vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//@ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

import App from './App.vue'
import 'virtual:svg-icons-register'
//import iconSvg from "@/components/IconSvg/index.vue"
import Myplugin from './components/index'
import '@/styles/index.scss'
import router from './router'
import pinia from './store'

import '@/router/permission'
//暗黑模式样式
import 'element-plus/theme-chalk/dark/css-vars.css'
const app = createApp(App)

app.use(ElementPlus, {
  locale: zhCn,
})
app.use(pinia)
app.use(Myplugin)
app.use(router)
//app.component('svg-icon',iconSvg)

//自定义指令
import { isHasbutton } from './directive/hasButton'
isHasbutton(app)

app.mount('#app')
