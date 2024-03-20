import request from '@/utils'
import type {
  UserInfoResponseData,
  userInfo,
  AllRoleResponseData,
  setRoleData,
  idList,
} from './type'

enum API {
  GETUSER_URL = '/admin/acl/user/',
  ADDUSER_URL = '/admin/acl/user/save',
  UPDATEUSER_URL = '/admin/acl/user/update',

  //获取全部职位和当前角色拥有的职位
  ALLROLE_URL = '/admin/acl/user/toAssign/',
  //更新某用户的角色
  SETROLE_URL = '/admin/acl/user/doAssignRole',
  //批量删除
  BATCHDELETE_URL = '/admin/acl/user/batchRemove',
  //单个删除
  REMOVE_URL = '/admin/acl/user/remove/',
}

export const reqUserList = (
  currentPage: number,
  pageSize: number,
  username?: string,
) =>
  request.get<any, UserInfoResponseData>(
    API.GETUSER_URL + `${currentPage}/${pageSize}/?username=${username}`,
  )

export const reqAddOrUpdateUser = (data: userInfo) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATEUSER_URL, data)
  } else {
    return request.post<any, any>(API.ADDUSER_URL, data)
  }
}

export const reqAllRole = (userId: number) =>
  request.get<any, AllRoleResponseData>(API.ALLROLE_URL + userId)

export const reqSetUserRole = (data: setRoleData) =>
  request.post<any, any>(API.SETROLE_URL, data)

export const reqBatchRemove = (idList: number[]) =>
  request.delete<any, any>(API.BATCHDELETE_URL, { data: idList })

export const reqRemove = (userId: number) =>
  request.delete<any, any>(API.REMOVE_URL + userId)
