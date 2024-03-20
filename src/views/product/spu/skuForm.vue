<template>
  <div>
    <el-form>
      <el-form-item label="SKU名称">
        <el-input placeholder="SKU名称" v-model="skuParmas.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input
          placeholder="价格(元)"
          type="number"
          v-model="skuParmas.price"
        ></el-input>
      </el-form-item>
      <el-form-item label="重量(克)">
        <el-input placeholder="重量(g)" v-model="skuParmas.weight"></el-input>
      </el-form-item>
      <el-form-item label="sku描述">
        <el-input
          type="textarea"
          placeholder="sku描述"
          v-model="skuParmas.skuDesc"
        ></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true">
          <el-form-item
            :label="item.attrName"
            v-for="item in attrArr"
            :key="item.id"
          >
            <!-- 收集到属性对象的身上 -->
            <el-select style="width: 130px" v-model="item.attrIdAndValueId">
              <!-- 收集属性id和属性值id -->
              <el-option
                :value="`${item.id}:${attrValue.id}`"
                :label="attrValue.valueName"
                v-for="attrValue in item.attrValueList"
                :key="attrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true">
          <el-form-item
            :label="item.saleAttrName"
            v-for="item in saleAttr"
            :key="item.id"
          >
            <el-select style="width: 150px" v-model="item.saleIdAndValueId">
              <el-option
                :label="saleAttrValue.saleAttrValueName"
                :value="`${item.id}:${saleAttrValue.id}`"
                v-for="saleAttrValue in item.spuSaleAttrValueList"
                :key="saleAttrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片名称">
        <el-table border :data="imageList" ref="table">
          <el-table-column
            type="selection"
            width="80"
            align="center"
          ></el-table-column>
          <el-table-column label="图片">
            <template #="{ row, $index }">
              <img
                :src="row.imgUrl"
                alt=""
                style="width: 100px; height: 100px"
              />
            </template>
          </el-table-column>
          <el-table-column label="名称"></el-table-column>
          <el-table-column label="操作">
            <template #="{ row, $index }">
              <el-button type="primary" size="small" @click="handler(row)">
                设置默认
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default" @click="save">保存</el-button>
        <el-button type="primary" size="default" @click="cancel">
          取消
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reqAttrList } from '@/api/product/attr'
import { reqSpuImageList, reqSpuSaleAttrList } from '@/api/product/spu'
import { ref, reactive } from 'vue'
import { SkuData } from '@/api/product/sku/type'
import { reqAddSku } from '@/api/product/sku/index'
import { ElMessage } from 'element-plus'

let table = ref<any>()
let emit = defineEmits(['changeScene'])

let attrArr = ref<any>([])
let imageList = ref<any>([])
let saleAttr = ref<any>([])

let skuParmas = reactive<SkuData>({
  category3Id: '', //三级分类Id
  spuId: '', //已有spu的ID
  tmId: '', //spu品牌的Id
  skuName: '', //sku的名字
  price: '', //sku价格
  weight: '', //sku重量
  skuDesc: '', //sku描述
  skuAttrValueList: [
    // {
    //     attrId :''  ,
    //     valueId : ''
    // }
  ], //平台属性的收集
  skuSaleAttrValueList: [
    // {
    //     saleAttrId : '' ,
    //     saleAttrValueId : ''
    // }
  ], //销售属性 的收集
  skeDefaultImg: '',
})

//取消
const cancel = () => {
  emit('changeScene', { flag: 0, params: '' })
}

const initSkuData = async (
  c1Id: string | number,
  c2Id: number | string,
  spu: any,
) => {
  //console.log(spu);
  //收集数据
  skuParmas.tmId = spu.tmId
  skuParmas.category3Id = spu.category3Id
  skuParmas.spuId = spu.id

  try {
    let res = await reqAttrList(c1Id, c2Id, spu.category3Id)
    let res2 = await reqSpuImageList(spu.id)
    let res3 = await reqSpuSaleAttrList(spu.id)

    attrArr.value = res.data
    imageList.value = res2.data
    saleAttr.value = res3.data
  } catch (error) {}
}

const handler = (row: any) => {
  //复选框只能勾一个
  //排他
  imageList.value.forEach((item: any) => {
    table.value.toggleRowSelection(item, false)
  })
  //复选框被选中
  table.value.toggleRowSelection(row, true)

  skuParmas.skeDefaultImg = row.imgUrl
}

const save = async () => {
  //整理数据

  //平台属性
  skuParmas.skuAttrValueList = attrArr.value.reduce((pre: any, next: any) => {
    if (next.attrIdAndValueId) {
      let [attrId, valueId] = next.attrIdAndValueId.split(':')
      pre.push({
        attrId,
        valueId,
      })
    }
    return pre
  }, [])
  //销售属性
  skuParmas.skuSaleAttrValueList = saleAttr.value.reduce(
    (pre: any, next: any) => {
      if (next.saleIdAndValueId) {
        let [saleAttrId, saleAttrValueId] = next.saleIdAndValueId.split(':')
        pre.push({
          saleAttrId,
          saleAttrValueId,
        })
      }
      return pre
    },
    [],
  )

  //发请求
  let res = await reqAddSku(skuParmas)

  if (res.code == 200) {
    ElMessage({
      type: 'success',
      message: '添加sku成功',
    })
    emit('changeScene', { flag: 0, params: '' })
  } else {
    ElMessage({
      type: 'error',
      message: '添加sku失败',
    })
  }
}

defineExpose({ initSkuData })
</script>
