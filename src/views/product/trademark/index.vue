<template>
  <div>
    <el-card>
      <el-button
        type="primary"
        size="default"
        @click="addTrademark"
        icon="Plus"
        v-has="`btn.Trademark.add`"
      >
        添加品牌
      </el-button>
      <el-table style="margin: 10px 0px" border :data="trademarkArr">
        <el-table-column
          label="序号"
          width="80px"
          align="center"
          type="index"
        ></el-table-column>
        <el-table-column label="品牌名称" prop="tmName"></el-table-column>
        <el-table-column label="品牌LOGO">
          <template #="{ row, $index }">
            <img :src="row.logoUrl" style="height: 100px; width: 100px" />
          </template>
        </el-table-column>
        <el-table-column label="品牌操作">
          <template #="{ row, $index }">
            <el-button
              type="primary"
              size="small"
              @click="updateTrademark(row)"
              icon="Edit"
            ></el-button>
            <el-popconfirm
              :title="`你确认要删除${row.tmName}`"
              width="250px"
              icon="Delete"
              @confirm="removeTrademark(row.id)"
            >
              <template #reference>
                <el-button type="danger" size="small" icon="Delete"></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
        <!-- <el-table-column v-for="col in columns"
                :prop="col.id"
                :key="col.id"
                :label="col.label"
                :width="col.width">
            </el-table-column> -->
      </el-table>

      <!-- layout : 整体分页器的再拆分组件的次序  -->
      <div class="demo-pagination-block">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[3, 5, 7, 9]"
          :background="true"
          layout="prev, pager, next, jumper, -> , sizes , total"
          :total="total"
          @current-change="getHasTradeMark"
          @size-change="sizeChange"
        />
      </div>
    </el-card>

    <!-- 对话框 -->
    <!-- v-model控制对话框显示和隐藏 -->
    <el-dialog
      v-model="dialogFormVisible"
      :title="trademarkParams.id ? '修改品牌' : '添加品牌'"
    >
      <el-form
        style="width: 80%"
        :model="trademarkParams"
        :rules="rules"
        ref="formRef"
      >
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input
            placeholder="请输入你的品牌名称"
            v-model="trademarkParams.tmName"
          ></el-input>
        </el-form-item>
        <el-form-item label="品牌logo" label-width="100px" prop="logoUrl">
          <!-- action 为上传文件的请求接口  -->
          <el-upload
            class="avatar-uploader"
            action="/api/admin/product/fileUpload"
            :show-file-list="true"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="trademarkParams.logoUrl"
              :src="trademarkParams.logoUrl"
              class="avatar"
              style="height: 200px; width: 200px"
            />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- 插槽 -->
      <template #footer>
        <el-button type="primary" size="default" @click="confirm">
          确定
        </el-button>
        <el-button type="primary" size="default" @click="cancel">
          取消
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import {
  reqHasTrademark,
  reqAddOrUpdate,
  reqDeleteTrademark,
} from '@/api/product/trademark/index.ts'
import type {
  Records,
  TradeMark,
  TradeMarkResponseData,
} from '@/api/product/trademark/type'
import type { UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus'

let currentPage = ref<number>(1)
let pageSize = ref<number>(3)
let total = ref<number>(0)
//已有品牌
let trademarkArr = ref<Records>([])
//控制对话框的显示
let dialogFormVisible = ref<boolean>(false)

//收集新增品牌的数据
let trademarkParams = reactive<TradeMark>({
  tmName: '',
  logoUrl: '',
})

let formRef = ref()

//发请求获取品牌信息的函数
const getHasTradeMark = async () => {
  let res: TradeMarkResponseData = await reqHasTrademark(
    currentPage.value,
    pageSize.value,
  )
  //console.log(res);
  total.value = res.data.total
  trademarkArr = res.data.records
}

//当修改一个显示多少条数据时触发  , 自定义事件 回调注入pageSize
const sizeChange = (pageSize) => {
  //当前页码归一 ， 防止改变pagesize大小后没有改变前的页码
  currentPage.value = 1

  getHasTradeMark()
}

//添加品牌按钮
const addTrademark = () => {
  dialogFormVisible.value = true
  //清除一下上次残留的校验提示信息
  nextTick(() => {
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
  })

  //先清理一下数据
  //清空数据
  trademarkParams.logoUrl = ''
  trademarkParams.tmName = ''
  trademarkParams.id = 0
}

//修改按钮
const updateTrademark = (row: TradeMark) => {
  dialogFormVisible.value = true
  //清除一下上次残留的校验提示信息
  nextTick(() => {
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
  })

  //展示数据
  trademarkParams.tmName = row.tmName
  trademarkParams.logoUrl = row.logoUrl
  //添加id
  trademarkParams.id = row.id

  //Object.assign(trademarkParams,row)
}

//确定按钮
const confirm = async () => {
  //触发form组件的表单校验validate函数 , 用于校验logo上传图片表单
  //校验成功下面的代码才会执行
  await formRef.value.validate()

  let result = await reqAddOrUpdate(trademarkParams)

  if (result.code == 201) {
    dialogFormVisible.value = false
    ElMessage({
      type: 'success',
      message: trademarkParams.id ? '修改品牌成功' : '添加品牌成功',
    })

    //发请求刷新品牌
    getHasTradeMark()
  } else {
    ElMessage({
      type: 'error',
      message: trademarkParams.id ? '修改品牌失败' : '添加品牌失败',
    })
    dialogFormVisible.value = false
  }
}

const cancel = () => {
  dialogFormVisible.value = false
}

//上传成功的钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
  //console.log(response);

  //收集上传成功的图片地址
  trademarkParams.logoUrl = response.data

  //图片上传成功，删除上传图片的校验的提示文字
  formRef.value.clearValidate('logoUrl')
}

//上传约束函数
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  //约束格式
  if (
    rawFile.type == 'image/jpeg' ||
    rawFile.type == 'image/png' ||
    rawFile.type == 'image/jpeg'
  ) {
    //大小约束 , 不超4M
    if (rawFile.size / 1024 / 1024 < 4) {
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

const validatorTmname = (rule: any, value: any, callback: any) => {
  //rule即校验对象 ，  value即输入的文本 ， callback表放行函数
  if (value.trim().length >= 2) {
    callback()
  } else {
    callback(new Error('品牌名称位数大于等于俩位'))
  }
}

//校验图片是否上传的函数
const validatorlogoUrl = (rule: any, value: any, callback: any) => {
  if (value) {
    callback()
  } else {
    callback(new Error('LOGO未上传'))
  }
}

//校验规则
const rules = {
  tmName: [{ required: true, trigger: 'blur', validator: validatorTmname }],
  logoUrl: [{ required: true, validator: validatorlogoUrl }],
}

//删除已有品牌
const removeTrademark = async (id: number) => {
  let res = await reqDeleteTrademark(id)

  if (res.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除品牌成功',
    })

    //再次获得全部品牌
    getHasTradeMark()
  } else {
    ElMessage({
      type: 'error',
      message: '删除品牌失败',
    })
  }
}

onMounted(() => {
  getHasTradeMark()
})
</script>

<style lang="scss">
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
