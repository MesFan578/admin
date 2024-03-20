import request from '@/utils'
import type { TradeMarkResponseData, TradeMark } from './type'

enum API {
  //已有品牌接口
  TRADEMARK_URL = '/admin/product/baseTrademark/',
  //添加 ， post
  ADDTRADEMARK_URL = '/admin/product/baseTrademark/save',
  //修改 . put请求
  UPDATETRADEMARK_URL = '/admin/product/baseTrademark/update',
  //删除品牌
  DELETE_URL = '/admin/product/baseTrademark/remove/',
}

//page , 当前页码数 ， limit , 每页记录数

export const reqHasTrademark = (page: number, limit: number) =>
  request.get<TradeMarkResponseData>(API.TRADEMARK_URL + `${page}/${limit} `)

//添加与修改已有品牌的接口  ， 添加不需要传id , 修改需要传id

export const reqAddOrUpdate = (data: TradeMark) => {
  //没id,为添加
  if (!data.id) {
    //console.log('ll');

    return request.post(API.ADDTRADEMARK_URL)
  } else {
    //有传id ， 为修改
    return request.put(API.UPDATETRADEMARK_URL)
  }
}

export const reqDeleteTrademark = (id: number) => {
  //console.log(API.DELETE_URL + id);

  return request.delete<any, any>(API.DELETE_URL + id)
}
