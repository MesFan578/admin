//全局路由守卫鉴权
import router from '@/router/index'

import nprogress from 'nprogress'
import 'nprogress/nprogress.css'

nprogress.configure({ showSpinner: false })
//引入大仓库
import pinia from '@/store/index'
import setting from '../settings'

//不能直接拿到大仓库
import useUserStore from '@/store/module/user'

//必须有大仓库，才有小仓库 ， 传入大仓库
const userStore = useUserStore(pinia)

//全部路由组件  登录 ， 404  ， 任意路由 ， 首页 ， 权限管理 ， 商品管理
router.beforeEach(async (to, from, next) => {
  document.title = `${setting.title} -  ${to.meta.title}`

  let token = userStore.token
  //获取用户的信息 ， 有用户信息才能访问该路由，因为重刷新和切换路由用户的store数据会消失, 即要重新发请求
  let username = userStore.username
  //进度条
  nprogress.start()

  //用户是否登录
  if (token) {
    //登录后不能去往login
    if (to.path == '/login') {
      next({ path: '/' })
    } else {
      //用户信息有没有
      if (username) {
        //有则放行
        next()
      } else {
        //没有则需要发请求获取
        //且刷新和切换用户信息会消失 ， 所以在路由鉴权发请求
        try {
          let res = await userStore.UserInfo()
          console.log(res, '111')
          //刷新的异步路由时 ， 获取到用户信息， 但异步路由还未加载完成 ， 待加载完才放行
          next({ ...to })
        } catch (error) {
          console.log('fail')

          //没拿到信息 ， 即token 过期  ， 或本地token被修改 ， 即token错误
          //清空数据 ， 回到Login

          //退出登录成功才会跳到login
          await userStore.userLoginOut()
          next({ path: '/login', query: { redirect: to.path } })
        }
      }
    }
  } else {
    //未登录 , 去往的是login页面则放行
    if (to.path == '/login') {
      next()
    } else {
      //去往的不是login ， 重定向 到login
      next({ path: '/login', query: { redirect: to.path } })
    }
  }
})

router.afterEach((to, from) => {
  nprogress.done()
})
