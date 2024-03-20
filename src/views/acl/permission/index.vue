<template>
  <div>
    <el-table
      style="width: 100%; margin-bottom: 20px"
      :data="menuList"
      row-key="id"
      border
    >
      <el-table-column label="名称" prop="name"></el-table-column>
      <el-table-column label="权限值" prop="code"></el-table-column>
      <el-table-column label="修改时间" prop="updateTime"></el-table-column>
      <el-table-column label="操作">
        <!-- Row为已有的菜单对象 -->
        <template #="{ row, $index }">
          <el-button
            type="primary"
            size="small"
            @click="Addmenu(row)"
            :disabled="row.level == 4 ? true : false"
          >
            {{ row.level == 3 ? '添加功能' : '添加菜单' }}
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="Edit(row)"
            :disabled="row.level == 1 ? true : false"
          >
            编辑
          </el-button>
          <el-popconfirm
            @confirm="Delete(row)"
            :title="`你确定要删除${row.name}吗？`"
            width="200px"
          >
            <template #reference>
              <el-button
                type="primary"
                size="small"
                icon="Delete"
                :disabled="row.level == 1 ? true : false"
              >
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-model="dialogVisible"
      :title="menuInfo.id ? '修改菜单' : '添加菜单'"
      width="500"
    >
      <template #default>
        <el-form :model="menuInfo">
          <el-form-item label="名称" label-width="60px">
            <el-input
              placeholder="请输入名称"
              v-model="menuInfo.name"
            ></el-input>
          </el-form-item>
          <el-form-item label="权限" label-width="60px">
            <el-input
              placeholder="请输入权限值"
              v-model="menuInfo.code"
            ></el-input>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'

import {
  reqAllPermissionList,
  reqAddOrUpdateMenu,
  reqRemoveMenu,
} from '@/api/acl/permission/index.ts'
import type {
  PermissionResponseData,
  PermissionData,
  MenuParams,
} from '@/api/acl/permission/type'
import { ElMessage } from 'element-plus'

let menuList = ref<PermissionData[]>([])
let dialogVisible = ref<boolean>(false)

let menuInfo = reactive<MenuParams>({
  //名字
  name: '',
  //权限
  code: '',
  pid: 0,
  level: 0,
})

onMounted(() => {
  getHasPerssion()
})

const getHasPerssion = async () => {
  let res: PermissionResponseData = await reqAllPermissionList()

  //console.log(res);
  if (res.code == 200) {
    menuList.value = res.data
  }
}

const Addmenu = (row: PermissionData) => {
  Object.assign(menuInfo, {
    id: 0,
    //名字
    name: '',
    //权限
    code: '',
    pid: 0,
    level: 0,
  })

  dialogVisible.value = true
  menuInfo.level = row.level + 1
  menuInfo.pid = row.id as number
}

const Edit = (row: PermissionData) => {
  dialogVisible.value = true

  Object.assign(menuInfo, row)
}

const Delete = async (row: PermissionData) => {
  let res = await reqRemoveMenu(row.id as number)

  if (res.code == 200) {
    dialogVisible.value = false
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    getHasPerssion()
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}

const confirm = async () => {
  let res = await reqAddOrUpdateMenu(menuInfo)

  console.log(res)

  if (res.code == 200) {
    dialogVisible.value = false
    ElMessage({
      type: 'success',
      message: menuInfo.id ? '修改成功' : '添加成功',
    })
    getHasPerssion()
  } else {
    ElMessage({
      type: 'error',
      message: menuInfo.id ? '修改失败' : '添加失败',
    })
  }
}
</script>
