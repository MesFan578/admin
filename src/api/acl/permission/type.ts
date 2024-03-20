export interface ResponseData {
  code: number
  message: string
  ok: string
}

export interface PermissionData {
  id?: number
  createTime: string
  updateTime: string
  pid: number
  name: string
  code: null
  toCode: null
  type: number
  status: null
  level: number
  children?: PermissionData[]
  select: boolean
}

export type menuList = PermissionData[]

export interface PermissionResponseData extends ResponseData {
  data: menuList
}

//添加和更新 菜单需要携带的参数类型
export interface MenuParams {
  id?: number
  name: string
  code: string //权限
  level: number // 新增的是几级菜单
  pid: number //已有的菜单Id，给谁加
}
