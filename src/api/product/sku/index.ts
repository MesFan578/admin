import request from '@/utils'
import type { SkuData, skuInfoResponseData, skuResponseData } from './type'

enum API {
  //spu下新增sku
  ADDSKU_URL = '/admin/product/saveSkuInfo',
  //获取该spu下的sku的信息
  SKUINFO_URL = '/admin/product/findBySpuId/',

  //获取Sku
  SKU_URL = '/admin/product/list/',
  //下架
  CANCELSALE_URL = '/admin/product/cancelSale/',
  ONSALE_URL = '/admin/product/onSale/',
  //获取sku商品信息展示
  GETSKUINFO_URL = '/admin/product/getSkuInfo/',
  DELETESKU_URL = '/admin/product/deleteSku/',
}

export const reqAddSku = (data: SkuData) =>
  request.post<any, any>(API.ADDSKU_URL, data)

export const reqSkuInfo = (spuId: number | string) =>
  request.get<any, skuInfoResponseData>(API.SKUINFO_URL + spuId)

export const reqSkuList = (
  currentPage: number | string,
  pageSize: number | string,
) => request<any, skuResponseData>(API.SKU_URL + `${currentPage}/${pageSize}`)

export const reqCancelSale = (skuId: number) =>
  request.get<any, any>(API.CANCELSALE_URL + skuId)

export const reqOnSale = (skuId: number) =>
  request.get<any, any>(API.ONSALE_URL + skuId)

export const reqGetSkuInfo = (skuId: number) =>
  request.get<any, skuInfoResponseData>(API.GETSKUINFO_URL + skuId)

export const reqDeleteSku = (skuId: number) =>
  request.delete<any, any>(API.DELETESKU_URL + skuId)
