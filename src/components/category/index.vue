<template>
  <div>
    <el-card style="margin: 10px 0px">
      <el-form :inline="true">
        <el-form-item label="一级分类">
          <el-select
            class="select"
            v-model="c1Id"
            @change="sel1Change"
            :disabled="scene == 0 ? false : true"
          >
            <!-- value属性为select收集的数据 -->
            <el-option
              :label="item.name"
              v-for="item in c1Arr"
              :key="item.id"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select
            class="select"
            v-model="c2Id"
            @change="sel2Change"
            :disabled="scene == 0 ? false : true"
          >
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="item in c2Arr"
              :key="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="三级分类">
          <el-select
            class="select"
            v-model="c3Id"
            @change="sel3Change"
            :disabled="scene == 0 ? false : true"
          >
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="item in c3Arr"
              :key="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, defineEmits, defineProps } from 'vue'
import { reqC1, reqC2, reqC3 } from '@/api/product/attr'

import type { CategoryObj, CategoryResponseData } from '@/api/product/attr/type'

let c1Arr = ref<CategoryObj[]>([])
let c2Arr = ref<CategoryObj[]>([])
let c3Arr = ref<CategoryObj[]>([])

//收集分类一的id
let c1Id = ref<number | string>()
let c2Id = ref<number | string>()
let c3Id = ref<number | string>()

let emit = defineEmits(['getCategoryId', 'change'])
//接收props , 用于禁用下拉列表
defineProps(['scene'])

onMounted(() => {
  getC1()
})

//获取一级分类数据
const getC1 = async () => {
  let res: CategoryResponseData = await reqC1()
  //console.log(res);

  if (res.code == 200) {
    c1Arr.value = res.data
  } else {
  }
}

//分类数据二
const getC2 = async () => {
  let res: CategoryResponseData = await reqC2(c1Id.value as string | number)

  if (res.code == 200) {
    c2Arr.value = res.data
  } else {
  }
}

const getC3 = async () => {
  let res: CategoryResponseData = await reqC3(c1Id.value as string | number)

  if (res.code == 200) {
    c3Arr.value = res.data
  } else {
  }
}

//一级分类发送变化的回调
const sel1Change = () => {
  //每当一级分类变化时要清除二级分类的id 和三级分类的数据和id  ， 防止二级和三级分类的展示残留
  c2Id.value = ''
  c3Arr.value = []
  c3Id.value = ''
  //触发自定义事件
  emit('change')

  //拿到二级分类数据
  getC2()
}

const sel2Change = () => {
  //每当二级分类发生变化 ， 应该清理 三级数据的id
  c3Id.value = ''

  //console.log(123);
  getC3()
}

const sel3Change = () => {
  emit('getCategoryId', [c1Id, c2Id, c3Id])
}
</script>

<style lang="scss">
.select {
  width: 100px;
}
</style>
