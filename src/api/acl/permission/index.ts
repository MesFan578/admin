import request from '@/utils'
import type { PermissionResponseData, MenuParams } from './type'

enum API {
  //获取权限列表
  ALLPERMISSION_URL = '/admin/acl/permission',
  ADDMENU_URL = '/admin/acl/permission/save',
  UPDATEMENU_URL = '/admin/acl/permission/update',
  REMOVE_URL = '/admin/acl/permission/remove/',
}

export const reqAllPermissionList = () =>
  request.get<any, PermissionResponseData>(API.ALLPERMISSION_URL)

export const reqAddOrUpdateMenu = (data: MenuParams) => {
  if (data.id) {
    //console.log(11);
    return request.put<any, any>(API.UPDATEMENU_URL, data)
  } else {
    return request.post<any, any>(API.ADDMENU_URL, data)
  }
}

export const reqRemoveMenu = (id: number) =>
  request.delete<any, any>(API.REMOVE_URL + `${id}`)
