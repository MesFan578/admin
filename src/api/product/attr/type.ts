export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

export interface CategoryObj {
  id: number | string
  name: string
  category1Id?: number
  categroy2Id?: number
}

export interface CategoryResponseData extends ResponseData {
  data: CategoryObj[]
}

//属性值对象 的类型
export interface AttrValue {
  id?: number
  valueName: string
  attrId?: number
  flag?: boolean
}

export type AttrValueList = AttrValue[]

export interface Attr {
  id?: number //三级分类id
  attrName: string //三级分类名
  categoryId: number | string //所属的三级分类Id
  categoryLevel: number // 分类等级
  attrValueList: AttrValueList
}

export type AttrList = Attr[]

export interface AttrResponse {
  data: Attr[]
}
