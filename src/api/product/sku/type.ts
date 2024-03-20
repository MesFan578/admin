export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

export interface attr {
  attrId: number | string
  valueId: number | string
}

export interface saleAttr {
  saleAttrId: number | string
  saleAttrValueId: number | string
}

//添加sku所要携带的数据
export interface SkuData {
  category3Id?: number | string //三级分类Id
  spuId?: number | string //已有spu的ID
  tmId?: number | string //spu品牌的Id
  skuName?: string //sku的名字
  price?: number | string //sku价格
  weight?: number | string //sku重量
  skuDesc?: string //sku描述
  skuAttrValueList?: attr[] //平台属性的收集
  skuSaleAttrValueList?: saleAttr[] //销售属性 的收集
  skeDefaultImg?: string
  isSale?: number // 控制是否上架
  id?: number //skuid
}

//返回的sku
export interface skuInfoResponseData extends ResponseData {
  data: SkuData[]
}

export interface skuResponseData extends ResponseData {
  data: {
    records: SkuData[]
    total: number
    size: number
    current: number
    orders: []
    optimizeCountSql: boolean
    hitCount: boolean
    countId: null
    maxLimit: null
    searchCount: boolean
    pages: number
  }
}
