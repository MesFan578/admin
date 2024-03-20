<template>
  <el-card>
    <el-table border style="margin: 10px 0px" :data="records">
      <el-table-column
        width="80px"
        type="index"
        align="center"
        label="序号"
      ></el-table-column>
      <el-table-column
        width="150px"
        label="名称"
        show-overflow-tooltip
        prop="skuName"
      ></el-table-column>
      <el-table-column
        width="150px"
        label="描述"
        show-overflow-tooltip
        prop="skuDesc"
      ></el-table-column>
      <el-table-column width="150px" label="图片">
        <template #="{ row, $index }">
          <img :src="row.skuDefaultImg" alt="" height="100px" width="100px" />
        </template>
      </el-table-column>
      <el-table-column
        width="150px"
        label="重量"
        prop="weight"
      ></el-table-column>
      <el-table-column
        width="150px"
        label="价格"
        prop="price"
      ></el-table-column>
      <el-table-column width="250px" label="操作" fixed="right">
        <template #="{ row, $index }">
          <el-button
            type="primary"
            size="small"
            @click="updateSale(row)"
            :icon="row.isSale == 0 ? 'Top' : 'Bottom'"
          ></el-button>
          <el-button
            type="primary"
            size="small"
            @click="siu"
            icon="Edit"
          ></el-button>
          <el-button
            type="primary"
            size="small"
            @click="showDetail(row)"
            icon="InfoFilled"
          ></el-button>
          <el-popconfirm
            :title="`你确定要删除${row.skuName}吗?`"
            @confirm="deleteSku(row)"
          >
            <template #reference>
              <el-button type="primary" size="small" icon="Delete"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[3, 5, 7, 9]"
      :background="true"
      layout="  prev, pager, next, jumper , -> ,sizes, total"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 抽屉 ， 展示详情 -->
    <el-drawer v-model="drawer">
      <template #header>
        <h4>查看商品详情</h4>
      </template>
      <template #default>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">名称：</el-col>
          <el-col :span="18">{{ skuInfo.skuName }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">描述：</el-col>
          <el-col :span="18">{{ skuInfo.skuDesc }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">价格：</el-col>
          <el-col :span="18">{{ skuInfo.price }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">平台属性：</el-col>
          <el-col :span="18">
            <el-tag
              v-for="item in skuInfo.skuAttrValueList"
              :key="item.id"
              style="margin: 0px 5px"
            >
              {{ item.valueName }}
            </el-tag>
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">销售属性：</el-col>
          <el-col :span="18">
            <el-tag
              v-for="item in skuInfo.skuSaleAttrValueList"
              :key="item.id"
              style="margin: 0px 5px"
            >
              {{ item.saleAttrValueName }}
            </el-tag>
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">商品图片：</el-col>
          <el-col :span="18">
            <el-carousel :interval="4000" type="card" height="200px">
              <el-carousel-item
                v-for="item in skuInfo.skuImageList"
                :key="item.id"
              >
                <img :src="item.imgUrl" alt="" width="100%" height="100%" />
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </template>
      <template #footer></template>
    </el-drawer>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  reqSkuList,
  reqOnSale,
  reqCancelSale,
  reqGetSkuInfo,
  reqDeleteSku,
} from '@/api/product/sku/index'
import type {
  skuResponseData,
  skuInfoResponseData,
  SkuData,
} from '@/api/product/sku/type'
import { ElMessage } from 'element-plus'

let currentPage = ref<number>(1)
let pageSize = ref<number>(9)
let total = ref<number>(0)

let records = ref<SkuData[]>([])

let skuInfo = ref<any>({})
//抽屉显示与隐藏
let drawer = ref<boolean>(false)

let getHasSku = async (pager = 1) => {
  currentPage.value = pager

  let res: skuResponseData = await reqSkuList(currentPage.value, pageSize.value)

  //console.log(res);

  if (res.code == 200) {
    records.value = res.data.records
    total.value = res.data.total
  }
}

onMounted(() => {
  getHasSku()
})

const handleSizeChange = () => {
  getHasSku()
}

const handleCurrentChange = (num: number) => {
  getHasSku(num)
}

const updateSale = async (row: SkuData) => {
  console.log(row)

  if (row.isSale == 0) {
    //发请求更改为上架状态
    let res = await reqOnSale(row.id as number)
    console.log(res)

    ElMessage({
      type: 'success',
      message: '上架成功',
    })
    getHasSku(currentPage.value)
  } else {
    let res = await reqCancelSale(row.id as number)
    console.log(res)

    ElMessage({
      type: 'success',
      message: '下架成功',
    })
    getHasSku(currentPage.value)
  }
}

const siu = () => {
  ElMessage({
    type: 'success',
    message: 'SIU~~~~~~~~',
  })
}

//展示详情
const showDetail = async (row: SkuData) => {
  drawer.value = true

  let res: skuInfoResponseData = await reqGetSkuInfo(row.id as number)

  if (res.code == 200) {
    skuInfo.value = res.data
  }
}

const deleteSku = async (row: SkuData) => {
  let res = await reqDeleteSku(row.id as number)

  console.log(res)

  if (res.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    getHasSku(
      skuInfo.value.length > 1 ? currentPage.value : currentPage.value - 1,
    )
  } else {
    ElMessage({
      type: 'error',
      message: '系统数据不能删除',
    })
  }
}
</script>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
