//服务器返回的类型

export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

//spu数据类型
export interface SpuData {
  id?: number
  spuName: string
  description: string
  category3Id: number | string
  tmId: number | string //品牌Id
  spuSaleAttrlist: null | SpuSaleAttr[]
  spuImageList: null | SpuImg[]
}

export type Records = SpuData[]

export interface HasSpuResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    searchCount: boolean
    pages: number
  }
}

//品牌数据的类型
export interface TradeMark {
  id: number
  tmName: string
  logoUrl: string
}

//品牌接口返回的类型

export interface AllTrademarkResponseData extends TradeMark {
  data: TradeMark[]
}

//商品图片的ts
export interface SpuImg {
  id?: number
  createTime?: string
  updateTime?: string
  spuId?: string
  imgName: string
  imgUrl: string
}

export interface spuImgResponseData extends ResponseData {
  data: SpuImg[]
}

//商品已有销售属性对象类型
export interface SpuSaleAttr {
  id?: number
  createTime?: null
  updateTime?: null
  spuId?: number
  baseSaleAttrId: number | string //销售属性Id
  saleAttrName: string
  spuSaleAttrValueList: spuSaleAttrValueList
  //后序新添加的字段，可有可无
  flag?: boolean
  saleAttrValue?: string //收集用
}

//每个销售属性下的销售属性值对象的类型
export interface SpuSaleAttrValue {
  id?: number
  createTime?: null
  updateTime?: null
  spuId?: number
  baseSaleAttrId: number
  saleAttrValueName: string
  saleAttrName?: string
  isChecked?: null
}
//已有销售属性值的类型
export type spuSaleAttrValueList = SpuSaleAttrValue[]

export interface spuSaleAttrResponseData extends ResponseData {
  data: SpuSaleAttr[]
}

export interface SaleAttr {
  id: number
  name: string
}

export interface AllSaleAttrResponseData extends ResponseData {
  data: SaleAttr[]
}
