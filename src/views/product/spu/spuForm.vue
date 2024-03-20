<template>
  <div>
    <el-form label-width="100px">
      <el-form-item label="SPU名称">
        <el-input
          placeholder="请输入SPU名称"
          v-model="spuParams.spuName"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU品牌">
        <el-select v-model="spuParams.tmId" style="width: 150px">
          <el-option
            :label="item.tmName"
            :value="item.id"
            v-for="item in AllTrademark"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          placeholder="请你输入描述"
          v-model="spuParams.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload
          v-model:file-list="spuImgList as UploadUserFile[]"
          action="/api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :before-upload="beforeAvatarUpload"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>

        <el-dialog v-model="dialogVisible">
          <img
            w-full
            :src="dialogImageUrl"
            alt="Preview Image"
            style="width: 100%; height: 100%"
          />
        </el-dialog>
      </el-form-item>
      <el-form-item label="SPU销售属性">
        <el-select
          v-model="SalNameAndId"
          style="width: 150px"
          :placeholder="
            unSelectSaleAttr.length
              ? `还未选择${unSelectSaleAttr.length}个`
              : '无'
          "
        >
          <el-option
            :label="item.name"
            :value="`${item.id}:${item.name}`"
            v-for="(item, index) in unSelectSaleAttr"
            :key="item.id"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          size="small"
          @click="addSaleAttr"
          icon="Plus"
          style="margin-left: 10px"
          :disabled="SalNameAndId ? false : true"
        >
          添加属性值
        </el-button>
        <el-table style="margin: 10px 0px" :data="spuAttrList">
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80px"
          ></el-table-column>
          <el-table-column
            label="销售属性名字"
            width="120px"
            prop="saleAttrName"
          ></el-table-column>
          <el-table-column label="销售属性值">
            <!-- row为每个销售属性对象 -->
            <template #="{ row, $index }">
              <div>
                <el-tag
                  style="margin: 0px 5px"
                  v-for="tag in row.spuSaleAttrValueList"
                  :key="tag.index"
                  closable
                  @close="row.spuSaleAttrValueList.splice($index, 1)"
                >
                  {{ tag.saleAttrValueName }}
                </el-tag>
                <el-input
                  v-model="row.saleAttrValue"
                  v-if="row.flag == true"
                  @blur="toLook(row)"
                  placeholder="请输入属性值"
                  size="small"
                  style="width: 100px"
                ></el-input>
                <el-button
                  v-else
                  type="primary"
                  size="small"
                  @click="toEdit(row)"
                  icon="Plus"
                ></el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120px">
            <template #="{ row, $index }">
              <el-button
                type="danger"
                size="small"
                icon="Delete"
                @click="spuAttrList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          size="default"
          @click="save"
          :disabled="spuAttrList.length > 0 ? false : true"
        >
          保存
        </el-button>
        <el-button type="primary" size="default" @click="cancel">
          取消
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import type {
  SpuData,
  AllTrademarkResponseData,
  spuImgResponseData,
  spuSaleAttrResponseData,
  AllSaleAttrResponseData,
  TradeMark,
  SpuImg,
  SpuSaleAttr,
  SaleAttr,
} from '@/api/product/spu/type.ts'
import { defineEmits, defineExpose, computed } from 'vue'
import {
  reqAllTrademark,
  reqSpuImageList,
  reqSpuSaleAttrList,
  reqAllSpuSaleAttr,
  reqAddOrUpdateSpu,
} from '@/api/product/spu/index.ts'

import { ref } from 'vue'
import { ElMessage, type UploadUserFile } from 'element-plus'
let emit = defineEmits(['changeScene'])
let dialogVisible = ref<boolean>(false)
let dialogImageUrl = ref<string>('')

let AllTrademark = ref<TradeMark[]>([])
let spuImgList = ref<SpuImg[] | UploadUserFile[]>([])
let spuAttrList = ref<SpuSaleAttr[]>([])
let AllSaleAttr = ref<SaleAttr[]>([])
let spuParams = ref<SpuData>({
  spuName: '',
  description: '',
  category3Id: 0,
  tmId: '', //品牌Id
  spuSaleAttrlist: [],
  spuImageList: [],
})
//收集还未选择的销售属性名和Id
const SalNameAndId = ref<string>('')

const cancel = () => {
  //触发,变为0场景
  emit('changeScene', { flag: 0, params: '' })
}

//发请求初始化spu的数据
const initHasSpuData = async (spu: SpuData) => {
  //获取全部品牌的数据
  try {
    spuParams.value = spu.row

    let res: AllTrademarkResponseData = await reqAllTrademark()

    let res2: spuImgResponseData = await reqSpuImageList(spu.row.id)

    let res3: spuSaleAttrResponseData = await reqSpuSaleAttrList(spu.row.id)

    let res4: AllSaleAttrResponseData = await reqAllSpuSaleAttr()

    AllTrademark.value = res.data
    spuImgList.value = res2.data.map((item) => {
      return {
        name: item.imgName,
        url: item.imgUrl,
      }
    })
    spuAttrList.value = res3.data
    AllSaleAttr.value = res4.data
  } catch (error) {
    console.log(error)
  }
}

//照片墙点击预览的钩子
const handlePictureCardPreview = (uploadFile: any) => {
  //console.log(uploadFile);
  dialogImageUrl.value = uploadFile.url
  dialogVisible.value = true
}

//删除图片的钩子
const handleRemove = () => {}
//上传约束函数
const beforeAvatarUpload = (uploadFile: any) => {
  //约束格式
  if (
    uploadFile.type == 'image/jpeg' ||
    uploadFile.type == 'image/png' ||
    uploadFile.type == 'image/jpeg'
  ) {
    //大小约束 , 不超4M
    if (uploadFile.size / 1024 / 1024 < 4) {
      return true
    }
  } else {
    ElMessage({
      type: 'error',
      message: '请上传文件为PNG|JPG|GIF格式',
    })
    return false
  }
}

//计算出未选择的销售属性
let unSelectSaleAttr = computed(() => {
  let unselArr = AllSaleAttr.value.filter((item) => {
    return spuAttrList.value.every((item1) => {
      return item.name != item1.saleAttrName
    })
  })
  return unselArr
})

//添加销售属性
const addSaleAttr = () => {
  let [baseSaleAttrId, saleAttrName] = SalNameAndId.value.split(':')

  spuAttrList.value.push({
    baseSaleAttrId, //销售属性Id
    saleAttrName,
    spuSaleAttrValueList: [],
  })

  //清空收集到的属性 id和name
  SalNameAndId.value = ''
}

const toEdit = (row: SpuSaleAttr) => {
  row.saleAttrValue = ''
  //点击按钮 ，input组件展示
  row.flag = true
}

//blur展示
const toLook = (row: SpuSaleAttr) => {
  const { baseSaleAttrId, saleAttrValue } = row

  //输入属性值不能为空
  if ((saleAttrValue as string).trim() == '') {
    ElMessage({
      type: 'error',
      message: '输入的属性值不能为空',
    })
    return
  }
  //输入的属性值不能重复
  let res = row.spuSaleAttrValueList.find((item) => {
    return item.saleAttrValueName == saleAttrValue
  })

  if (res) {
    ElMessage({
      type: 'error',
      message: '输入的属性值不能重复',
    })
    return
  }

  //往属性值数组push
  row.spuSaleAttrValueList.push({
    baseSaleAttrId,
    saleAttrValueName: saleAttrValue,
  })

  row.flag = false
}

//保存修改的回调
const save = async () => {
  //整理数据
  //图片数据
  spuParams.value.spuImageList = spuImgList.value.map((item: any) => {
    return {
      imgName: item.name,
      imgUrl: (item.response && item.response.data) || item.url, //是否是用户上传的图片
    }
  })
  //属性数据
  spuParams.value.spuSaleAttrList = spuAttrList.value

  let res: any = await reqAddOrUpdateSpu(spuParams.value)

  if (res.code == 200) {
    ElMessage({
      type: 'success',
      message: spuParams.value.id ? '修改成功' : '添加成功',
    })
    //切换场景
    emit('changeScene', {
      flag: 0,
      params: spuParams.value.id ? 'update' : 'add',
    })

    //清除数据
  } else {
    ElMessage({
      type: 'error',
      message: spuParams.value.id ? '修改失败' : '添加失败',
    })
  }
}

//增加一个新的spu的初始化数据
const initAddSpu = async (category3Id: number | string) => {
  //清除残留数据
  Object.assign(spuParams.value, {
    spuName: '',
    description: '',
    category3Id: 0,
    tmId: '', //品牌Id
    spuSaleAttrlist: [],
    spuImageList: [],
  })
  //清空照片墙
  spuImgList.value = []
  //清空销售属性
  spuAttrList.value = []
  SalNameAndId.value = ''
  //清理id , 否则无法区分修改还是添加
  spuParams.value.id = ''

  //console.log(123);
  try {
    let res: AllTrademarkResponseData = await reqAllTrademark()
    let res4: AllSaleAttrResponseData = await reqAllSpuSaleAttr()

    AllTrademark.value = res.data
    AllSaleAttr.value = res4.data
    spuParams.value.category3Id = category3Id
  } catch (error) {
    ElMessage({
      type: 'error',
      message: '初始化失败',
    })
  }
}

//对外暴露
defineExpose({ initHasSpuData, initAddSpu })
</script>
