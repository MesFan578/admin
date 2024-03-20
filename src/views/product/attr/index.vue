<template>
  <div>
    <!-- 三级分类全局组件 -->
    <Category @getCategoryId="getID" @change="clear" :scene="scene" />
    <el-card>
      <div v-show="scene == 0">
        <el-button
          type="primary"
          size="default"
          @click="addAttr"
          :disabled="id.category3Id ? false : true"
          icon="Plus"
        >
          添加属性
        </el-button>
        <el-table border style="margin: 10px 0px" :data="attrArr">
          <el-table-column
            prop=""
            label="序号"
            width="80px"
            type="index"
            align="center"
          />
          <el-table-column prop="attrName" label="属性名称" width="120px" />
          <el-table-column prop="" label="属性值名称">
            <template #="{ row, $index }">
              <el-tag
                v-for="item in row.attrValueList"
                :key="item.id"
                style="margin: 0px 5px"
              >
                {{ item.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="" label="操作" align="center" width="120px">
            <template #="{ row }">
              <el-button
                type="primary"
                size="small"
                icon="Edit"
                @click="updateAttr(row, $index)"
              ></el-button>
              <el-popconfirm
                :title="`您确认删除 ${row.attrName} ?`"
                width="200px"
                @confirm="deleteAttr(row)"
              >
                <template #reference>
                  <el-button
                    type="danger"
                    size="small"
                    icon="Delete"
                  ></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div v-show="scene == 1">
        <el-form :inline="true" style="margin: 10px 0px">
          <el-from-item label="属性名称">
            <el-input
              placeholder="请输入属性名称"
              v-model="attrParams.attrName"
            ></el-input>
          </el-from-item>
        </el-form>
        <el-button
          @click="addAttrValue"
          size="small"
          icon="Plus"
          type="primary"
          :disabled="attrParams.attrName ? false : true"
        >
          添加属性值
        </el-button>
        <el-button @click="cancel" size="small" type="primary">取消</el-button>

        <el-table
          border
          style="margin: 10px 0px"
          :data="attrParams.attrValueList"
        >
          <el-table-column
            width="00px"
            type="index"
            align="center"
            label="序号"
          ></el-table-column>
          <el-table-column label="属性值名称">
            <!-- row为当前属性值对象  -->
            <template #="{ row, $index }">
              <el-input
                :ref="(vc: any) => (inputArr[$index] = vc)"
                placeholder="请你输入属性值名称"
                v-model="row.valueName"
                v-if="row.flag"
                @blur="Look(row, $index)"
              ></el-input>
              <div v-else @click="toEdit(row, $index)">{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="属性值操作">
            <template #="{ row, $index }">
              <el-button
                type="danger"
                size="small"
                icon="Delete"
                @click="attrParams.attrValueList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-button
          @click="save"
          size="small"
          type="primary"
          :disabled="attrParams.attrValueList.length == 0 ? true : false"
        >
          保存
        </el-button>
        <el-button @click="cancel" size="small" type="primary">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue'
import {
  reqAddOrUpdateAttr,
  reqAttrList,
  reqDeteleAttr,
} from '@/api/product/attr/index.ts'
import type { Attr } from '@/api/product/attr/type'
import { ElMessage } from 'element-plus'

let scene = ref<number>(0)
let attrArr = ref<Attr[]>([])
//收集新增属性的数据
let attrParams = reactive<Attr>({
  attrName: '', //新增属性名
  attrValueList: [], //新增属性值的数组
  categoryId: '',
  categoryLevel: 3,
})
let id = ref({
  category1Id: '',
  category2Id: '',
  category3Id: '',
})

//收集input组件实例的数组
let inputArr = ref<any>([])

//获取id
const getID = async (CategoryId: any) => {
  id.value.category1Id = CategoryId[0].value
  id.value.category2Id = CategoryId[1].value
  id.value.category3Id = CategoryId[2].value
  //获取属性
  getAttr()
}

//获取属性
const getAttr = async () => {
  const { category1Id, category2Id, category3Id } = id.value

  //console.log(category1Id,category2Id,category3Id);

  try {
    let res = await reqAttrList(category1Id, category2Id, category3Id)

    console.log(res)

    attrArr.value = res.data
  } catch (error) {
    console.log(error)
  }
}

//当分类一发送变化的回调
const clear = () => {
  //清理残留的数据
  attrArr.value = []
}

//添加属性按钮
const addAttr = () => {
  //每次点击时 , 清理上次残留的数据
  Object.assign(attrParams, {
    attrName: '', //新增属性名
    attrValueList: [], //新增属性值的数组
    categoryId: id.value.category3Id,
    categoryLevel: 3,
  })

  scene.value = 1

  //收集第三级分类的id
  attrParams.categoryId = id.value.category3Id
}

//修改按钮
const updateAttr = (row: Attr) => {
  scene.value = 1

  //将要修改的row过来，与attrParams 进行合并展示数据 , 深拷贝row
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
}

//取消按钮
const cancel = () => {
  scene.value = 0
}

//添加属性值的回调
const addAttrValue = () => {
  //每点一次向属性数组push一个属性值对象
  attrParams.attrValueList.push({
    valueName: '',
    flag: true,
  })

  //最后的一个input自动聚焦
  nextTick(() => {
    inputArr.value[attrParams.attrValueList.length - 1].focus()
  })
}

//保存按钮 的回调
const save = async () => {
  let res = await reqAddOrUpdateAttr(attrParams)

  //console.log(res);

  if (res.code == 200) {
    //切换场景
    scene.value = 0
    ElMessage({
      type: 'success',
      message: attrParams.id ? '修改成功' : '添加成功',
    })

    //获取所有的属性
    getAttr()
  } else {
    ElMessage({
      type: 'success',
      message: attrParams.id ? '修改失败' : '添加失败',
    })
  }
}

//input失去焦点的回调
const Look = (row, index) => {
  //非法情况一 ， 输入空串
  if (row.valueName.trim() == '') {
    //删除该对象
    attrParams.attrValueList.splice(index, 1)
    ElMessage({
      type: 'error',
      message: '输入的属性值不能为空',
    })
    return
  }

  //非法情况二
  //查找输入的属性值有重复输入 ， 不允许重复的属性值
  let repeat = attrParams.attrValueList.find((item) => {
    //把自己先排除
    if (item != row) {
      //重复属性值
      return item.valueName == row.valueName
    }
  })

  if (repeat) {
    //将重复的从数组中删除
    attrParams.attrValueList.splice(index, 1)

    ElMessage({
      type: 'error',
      message: '勿输入重复的属性值',
    })

    return
  }

  row.flag = false
}

const toEdit = (row, index) => {
  row.flag = true

  //console.log(inputArr.value);

  //让input自动聚焦
  nextTick(() => {
    inputArr.value[index].focus()
  })
}

const deleteAttr = async (row: Attr) => {
  let res = await reqDeteleAttr(row.id)

  if (res.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    //更新
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: '删除成功',
    })
  }
}
</script>
