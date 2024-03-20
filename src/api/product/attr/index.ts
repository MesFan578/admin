import request from '@/utils'
import type { CategoryResponseData, AttrResponse, Attr } from './type'

enum API {
  CATEGORY_1_URL = 'admin/product/getCategory1',
  CATEGORY_2_URL = 'admin/product/getCategory2/',
  CATEGORY_3_URL = 'admin/product/getCategory3/',

  ATTRLIST_URL = '/admin/product/attrInfoList/',
  ADDORUPDATE_URL = '/admin/product/saveAttrInfo',

  DELETEATTR = '/admin/product/deleteAttr/',
}

export const reqC1 = () =>
  request.get<any, CategoryResponseData>(API.CATEGORY_1_URL)
export const reqC2 = (id: string | number) =>
  request.get<any, CategoryResponseData>(API.CATEGORY_2_URL + id)
export const reqC3 = (id: string | number) =>
  request.get<any, CategoryResponseData>(API.CATEGORY_3_URL + id)
//获取分类下已有的属性和属性值
export const reqAttrList = (
  Categoryq1Id: string | number,
  Categoryq2Id: string | number,
  Categoryq3Id: string | number,
) =>
  request.get<any, AttrResponse>(
    API.ATTRLIST_URL + `${Categoryq1Id}/${Categoryq2Id}/${Categoryq3Id}`,
  )

//新增或修改已有的属性
export const reqAddOrUpdateAttr = (data: Attr) =>
  request.post<any, any>(API.ADDORUPDATE_URL, data)

export const reqDeteleAttr = (attrId) =>
  request.delete<any, any>(API.DELETEATTR + attrId)
