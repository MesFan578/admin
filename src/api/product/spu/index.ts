import request from '@/utils'

import type {
  HasSpuResponseData,
  AllTrademarkResponseData,
  spuImgResponseData,
  spuSaleAttrResponseData,
  AllSaleAttrResponseData,
  SpuData,
} from './type'

enum API {
  HASSPU_URL = '/admin/product/',
  //获取全部品牌的数据
  ALLTRADEMARK_URL = '/admin/product/baseTrademark/getTrademarkList',
  //某个spu全部售卖的商品的图片
  IMAGE_URL = '/admin/product/spuImageList/',
  //某个spu全部的已有销售属性
  SALEATTR_URL = '/admin/product/spuSaleAttrList/',
  //获取全部可供选择的销售属性【仅有 颜色， 版本 ，尺码】
  ALLSALEATTR_URL = '/admin/product/baseSaleAttrList',

  //添加一个新的spu
  ADDSPU_URL = '/admin/product/saveSpuInfo',
  //更新已有的spu
  UPDATASPU_URL = '/admin/product/updateSpuInfo',

  DELETESPU_URL = '/admin/product/deleteSpu/',
}

export const reqHasSpu = (
  currentPage: number,
  pageSize: number,
  category3Id: string | number,
) =>
  request.get<any, HasSpuResponseData>(
    API.HASSPU_URL + `${currentPage}/${pageSize}?category3Id=${category3Id}`,
  )

//获取全部SPU品牌
export const reqAllTrademark = () =>
  request.get<any, AllTrademarkResponseData>(API.ALLTRADEMARK_URL)

export const reqSpuImageList = (spuId: number) =>
  request.get<any, spuImgResponseData>(API.IMAGE_URL + spuId)

export const reqSpuSaleAttrList = (spuId: number) =>
  request.get<any, spuSaleAttrResponseData>(API.SALEATTR_URL + spuId)

export const reqAllSpuSaleAttr = () =>
  request.get<any, AllSaleAttrResponseData>(API.ALLSALEATTR_URL)

export const reqAddOrUpdateSpu = (data: SpuData) => {
  if (data.id) {
    return request.post(API.UPDATASPU_URL, data)
  } else {
    return request.post(API.ADDSPU_URL, data)
  }
}

export const reqDeleteSpu = (spuId: number | string) =>
  request.delete<any, any>(API.DELETESPU_URL + spuId)
