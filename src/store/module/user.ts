//用户相关的仓库

import { defineStore } from 'pinia'

import { reqLogin, reqLoginOut, reqUserInfo } from '@/api/user'
import type {
  loginFormData,
  loginResponseData,
  userInfoReponseData,
} from '@/api/user/type'

import type { UserState } from './type/types'
import { routesConst, asyncRoutes, anyRoute } from '@/router/routes'
import router from '@/router/index.ts'

import { cloneDeep } from 'lodash'

//过滤函数
let filterRoute = (routes: any, asyncRoutes: any) => {
  let arr = asyncRoutes.filter((item: any) => {
    if (routes.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        item.children = filterRoute(routes, item.children)
      }
      return true
    }
  })

  return arr
}

let userStore = defineStore('User', {
  state: (): UserState => {
    return {
      token: localStorage.getItem('token'),
      menuRoutes: routesConst,
      username: '',
      avatar: '',
      buttons: [],
    }
  },
  actions: {
    async userLogin(data: loginFormData) {
      //登录请求
      let result: loginResponseData = await reqLogin(data)
      console.log(result)

      //登录请求:成功200->token
      //登录请求:失败201->登录失败错误的信息
      if (result.code == 200) {
        //pinia仓库存储一下token
        //由于pinia|vuex存储数据其实利用js对象
        this.token = result.data as string
        //本地存储持久化存储一份
        localStorage.setItem('token', result.data as string)
        //能保证当前async函数返回一个成功的promise
        return 'ok'
      } else {
        return Promise.reject(new Error(result.data))
      }
    },
    async UserInfo() {
      let res: userInfoReponseData = await reqUserInfo()
      //console.log(res);

      if (res.code == 200) {
        this.username = res.data.name
        this.avatar = res.data.avatar
        this.buttons = res.data.buttons

        console.log(this.buttons)

        let routes = res.data.routes
        //深拷贝一份
        let clone = cloneDeep(asyncRoutes)

        //拿到过滤后的数组
        let filterRoutes = filterRoute(routes, clone)
        //合并可访问到的菜单权限
        this.menuRoutes = [...routesConst, ...filterRoutes, ...anyRoute]
        //console.log(this.menuRoutes);

        //动态追加路由
        ;[...filterRoutes, ...anyRoute].forEach((route: any) => {
          router.addRoute(route)
        })

        //获取信息成功  ， 返回一个成功的Promise
        return 'ok'
      } else {
        return Promise.reject(new Error(res.message))
      }
    },
    //退出登录 ， 清除仓库数据
    async userLoginOut() {
      let res = await reqLoginOut()
      //console.log(res);

      if (res.code == 200) {
        this.token = ''
        ;(this.username = ''), (this.avatar = '')
        localStorage.removeItem('token')

        return 'ok'
      } else {
        return Promise.reject(new Error(res.message))
      }
    },
  },
  getters: {},
})

export default userStore
