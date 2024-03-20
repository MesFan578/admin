//统一管理用户接口

import request from '@/utils'
import type {
  loginFormData,
  loginResponseData,
  userInfoReponseData,
} from '@/api/user/type'

enum API {
  LOGIN_URL = 'http://114.115.179.162:8022/prod-api/admin/acl/index/login',
  USERINFO_URL = '/admin/acl/index/info',
  LOGINOT_URL = '/admin/acl/index/logout',
}

//http://114.115.179.162:8022/prod-api/admin/acl/index/login

export const reqLogin = (data: loginFormData) =>
  request.post<any, loginResponseData>(API.LOGIN_URL, data)

export const reqUserInfo = () =>
  request.get<any, userInfoReponseData>(API.USERINFO_URL)

export const reqLoginOut = () => request.post<any, any>(API.LOGINOT_URL)
