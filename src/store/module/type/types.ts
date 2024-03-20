import type { RouteRecordRaw } from 'vue-router'
//定义小仓库state的类型

export interface UserState {
  token: string | null
  menuRoutes: RouteRecordRaw[]
  username: string
  avatar: string
  buttons: string[]
}
