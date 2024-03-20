import request from '@/utils'
import type { RoleResponseData, RoleData, PermissionResponseData } from './type'

enum API {
  //获取当前用户的角色信息
  ALLROLE_URL = '/admin/acl/role/',
  ADDROLE_URL = '/admin/acl/role/save',
  UPDATEROLE_URL = '/admin/acl/role/update',
  //单个删除
  REMOVE_URL = '/admin/acl/role/remove/',

  //根据id 获取权限列表
  ALLPERMISSION_URL = '/admin/acl/permission/toAssign/',
  //给相应职位分配权限
  SETPERMISSION_URL = '/admin/acl/permission/doAssign',
}

//获取全部角色列表
export const reqAllRoleList = (
  currentPage: number,
  pageSize: number,
  roleName?: string,
) =>
  request.get<any, RoleResponseData>(
    API.ALLROLE_URL + `${currentPage}/${pageSize}?roleName=${roleName}`,
  )

export const reqAddOrUpdateRole = (data: RoleData) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATEROLE_URL, data)
  } else {
    return request.post<any, any>(API.ADDROLE_URL, data)
  }
}

export const reqRemove = (roleId: number) =>
  request.delete<any, any>(API.REMOVE_URL + roleId)

export const reqAllPermissionList = (roleId: number) =>
  request.get<any, PermissionResponseData>(API.ALLPERMISSION_URL + roleId)

export const reqSetPermission = (roleId: number, permissionId: number[]) =>
  request.post<any, any>(
    API.SETPERMISSION_URL + `/?roleId=${roleId}/?permissionId=${permissionId}`,
  )
