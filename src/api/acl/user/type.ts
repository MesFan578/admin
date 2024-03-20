export interface ResponseData {
  code: number
  message: string
  ok: string
}

export interface userInfo {
  id?: number
  createTime?: string
  updateTime?: string
  username: string
  password: string
  name: string
  phone?: null
  roleName?: string
}

export type records = userInfo[]

export interface UserInfoResponseData extends ResponseData {
  data: {
    records: records
    total: number
    size: number
    current: number
    pages: number
  }
}

//职位类型
export interface RoleData {
  id?: number
  createTime?: string
  updateTime?: string
  roleName: string
  remark: null
}

export type roleList = RoleData[]

export interface AllRoleResponseData extends ResponseData {
  data: {
    assignRoles: roleList
    allRolesList: roleList
  }
}

//给用户分配职位的接口参数的类型
export interface setRoleData {
  roleIdList: number[]
  userId: number
}

//批量删除的id列表参数
export interface idList {
  idList: number[]
}
