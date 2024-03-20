<template>
  <div>
    <Category :scene="scene" @getCategoryId="getId" />

    <el-card style="margin: 10px 0px">
      <div v-show="scene == 0">
        <el-button
          type="primary"
          icon="Plus"
          size="default"
          @click="addSPU"
          :disabled="category3Id ? false : true"
        >
          添加SPU
        </el-button>

        <el-table style="margin: 10px 0px" border :data="records">
          <el-table-column
            label="序号"
            width="80px"
            type="index"
            align="center"
          ></el-table-column>
          <el-table-column label="SPU名称" prop="spuName"></el-table-column>
          <el-table-column
            label="SPU描述"
            prop="description"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="操作">
            <template #="row, $index">
              <el-button
                type="primary"
                size="small"
                @click="addSku(row)"
                title="添加sku"
                icon="Plus"
              ></el-button>
              <el-button
                type="primary"
                size="small"
                @click="updateSPU(row)"
                icon="Edit"
                title="修改sku"
              ></el-button>
              <el-button
                type="primary"
                size="small"
                @click="showSku(row)"
                title="查看sku列表"
                icon="View"
              ></el-button>
              <el-popconfirm
                :title="`你确定要删除${row.row.spuName}吗？ `"
                @confirm="DeleteSpu(row)"
                width="200px"
              >
                <template #reference>
                  <el-button
                    type="primary"
                    size="small"
                    icon="Delete"
                  ></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[3, 5, 7]"
          :background="true"
          layout="prev, pager, next, jumper,->,sizes,total"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <!-- 添加spu|修改spu -->
      <SpuForm
        ref="spu"
        v-show="scene == 1"
        @changeScene="changeScene"
      ></SpuForm>
      <!-- 添加sku 的子组件 -->
      <SkuForm
        ref="sku"
        v-show="scene == 2"
        @changeScene="changeScene"
      ></SkuForm>

      <el-dialog v-model="show" title="Sku列表">
        <el-table border :data="skuArr">
          <el-table-column label="SKU名字" prop="skuName"></el-table-column>
          <el-table-column label="SKU价格" prop="price"></el-table-column>
          <el-table-column label="SKU重量" prop="weight"></el-table-column>
          <el-table-column label="SKU图片">
            <template #="{ row, $index }">
              <img
                :src="row.skuDefaultImg"
                alt=""
                style="width: 150px; height: 150px"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { reqHasSpu, reqDeleteSpu } from '@/api/product/spu/index.ts'
import type { SkuData } from '@/api/product/sku/type'
import type { HasSpuResponseData, SpuData } from '@/api/product/spu/type.ts'
import SpuForm from './spuForm.vue'
import SkuForm from './skuForm.vue'
import { reqSkuInfo } from '@/api/product/sku/index.ts'
import { ElMessage } from 'element-plus'

//子组件的实例对象
let spu = ref<any>()
let sku = ref<any>()

let scene = ref<number>(0) //0 ； 显示已有的spu , 1 ： 添加spu|修改spu 2 :  添加sku 的子组件

let currentPage = ref<number>(1)
let pageSize = ref<number>(3)

let category3Id = ref<number>(0)
let category2Id = ref<number>(0)
let category1Id = ref<number>(0)

let records = ref<SpuData[]>([])
let total = ref<number>(0)

let skuArr = ref<SkuData[]>([])
let show = ref<boolean>(false)
//拿到category3Id的回调
const getId = (idArr: any) => {
  //console.log(idArr);

  category1Id.value = idArr[0].value
  category2Id.value = idArr[1].value
  category3Id.value = idArr[2].value

  getHasSpu()
}

//拿到已有SPU
const getHasSpu = async (pager = 1) => {
  //默认捞到第一页数据
  currentPage.value = pager

  let res: HasSpuResponseData = await reqHasSpu(
    currentPage.value,
    pageSize.value,
    category3Id.value,
  )

  if (res.code == 200) {
    records.value = res.data.records
    total.value = res.data.total
  }
}

//pagesize发生变化的回调
const handleSizeChange = () => {
  getHasSpu()
}

//当前页码发生变化的回调 , 回调注入页码
const handleCurrentChange = (pager: number) => {
  //console.log(pager);

  //请求数据
  getHasSpu(pager)
}

const addSPU = () => {
  scene.value = 1

  //当添加一个spu时
  spu.value.initAddSpu(category3Id.value)
}

//修改spu
const updateSPU = (row: SpuData) => {
  scene.value = 1

  //console.log(spu.value);
  //调用子组件暴露的方法获取完整的spu数据
  spu.value.initHasSpuData(row)
}

const changeScene = (obj: Object) => {
  scene.value = obj.flag
  //更新数据，区分修改还是添加spu的操作 ， 留在当前页还是第一页
  if (obj.params == 'add') {
    getHasSpu()
  } else if (obj.params == 'update') {
    //留在当前页
    getHasSpu(currentPage.value)
  } else {
    //空串 ， 取消按钮的情况 ， 留在当前页
    getHasSpu(currentPage.value)
  }
}

const addSku = ({ row }: any) => {
  scene.value = 2
  //console.log(row);

  sku.value.initSkuData(category1Id.value, category2Id.value, row)
}

//展示spu下的sku
const showSku = async (row: any) => {
  let res = await reqSkuInfo(row.row.id)
  //console.log(res);
  if (res.code == 200) {
    skuArr.value = res.data
    //展示对话框
    show.value = true
  }
}

const DeleteSpu = async (row: SkuData) => {
  let res = await reqDeleteSpu(row.row.id)

  if (res.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    //records.value.length > 1 ? currentPage : currentPage - 1

    getHasSpu(
      records.value.length > 1 ? currentPage.value : currentPage.value - 1,
    )
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}
</script>
