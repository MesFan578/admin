<template>
  <div>
    <el-card style="margin: 10px 0px; height: 80px">
      <el-form :inline="true" class="form">
        <el-form-item label="角色名称">
          <el-input
            placeholder="输入角色名称"
            width="200px"
            v-model="keyword"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="default"
            @click="search"
            :disabled="keyword.trim().length > 0 ? false : true"
          >
            搜索
          </el-button>
          <el-button size="default" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card>
      <el-button type="primary" size="default" @click="addRole">
        添加职位
      </el-button>

      <el-table style="margin: 10px 0px" border :data="roleList">
        <el-table-column
          type="index"
          align="center"
          label="#"
        ></el-table-column>
        <el-table-column
          label="id"
          align="center"
          width="80px"
          prop="id"
        ></el-table-column>
        <el-table-column
          label="角色名称"
          show-overflow-tooltip
          align="center"
          prop="roleName"
          width="120px"
        ></el-table-column>
        <el-table-column
          label="创建时间"
          show-overflow-tooltip
          align="center"
          prop="createTime"
        ></el-table-column>
        <el-table-column
          label="更新时间"
          show-overflow-tooltip
          align="center"
          prop="updateTime"
        ></el-table-column>
        <el-table-column label="操作" width="290px" align="center">
          <template #="{ row, $index }">
            <el-button
              type="primary"
              size="small"
              @click="assignRuler(row)"
              icon="User"
            >
              分配权限
            </el-button>
            <el-button
              type="primary"
              size="small"
              @click="EditRole(row)"
              icon="Edit"
            >
              编辑
            </el-button>
            <el-popconfirm
              @confirm="Remove(row)"
              :title="`你确定要删除${row.roleName}吗？`"
              width="200px"
            >
              <template #reference>
                <el-button type="primary" size="small" icon="Delete">
                  删除
                </el-button>
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
        layout="prev, pager, next, jumper,->,sizes,total"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="roleInfo.id ? '修改职位' : '添加职位'"
      width="500"
    >
      <template #default>
        <el-form :model="roleInfo" :rules="rules" ref="form">
          <el-form-item label="职位名称" prop="roleName">
            <el-input
              placeholder="请输入职位名"
              v-model="roleInfo.roleName"
            ></el-input>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="drawer">
      <template #header>
        <h3>分配权限</h3>
      </template>
      <template #default>
        <el-tree
          style="max-width: 600px"
          :data="menuArr"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="selectArr"
          :props="defaultProps"
          ref="tree"
        />
      </template>
      <template #footer>
        <el-button size="default" @click="denial">取消</el-button>
        <el-button type="primary" size="default" @click="save">确定</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import {
  reqAllRoleList,
  reqAddOrUpdateRole,
  reqRemove,
  reqAllPermissionList,
  reqSetPermission,
} from '@/api/acl/role/index.ts'
import type {
  RoleData,
  RoleResponseData,
  PermissionResponseData,
  PermissionData,
} from '@/api/acl/role/type.ts'
import layoutStore from '@/store/module/setting'
import { ElMessage } from 'element-plus'
let settingStore = layoutStore()

let drawer = ref<boolean>(false)
let currentPage = ref<number>(1)
let pageSize = ref<number>(3)
let total = ref<number>(10)
let keyword = ref<string>('')

let roleList = ref<RoleData[]>([])
let roleInfo = reactive<RoleData>({
  roleName: '',
})
const form = ref<any>()
let dialogVisible = ref<boolean>(false)

const tree = ref<any>()
let menuArr = ref<PermissionData[]>([])
const defaultProps = {
  children: 'children',
  label: 'name',
}
//勾选的数组id
let selectArr = ref<number[]>([])

const vadidatorRoleName = (rule: any, value: any, callBack: any) => {
  //console.log(value);

  if (value.trim().length >= 2) {
    callBack()
  } else {
    callBack(new Error('职位名称至少俩位'))
  }
}

const rules = {
  roleName: [{ required: true, trigger: 'blur', validator: vadidatorRoleName }],
}
onMounted(() => {
  getHasRole()
})

const getHasRole = async (pager = 1) => {
  currentPage.value = pager
  let res: RoleResponseData = await reqAllRoleList(
    currentPage.value,
    pageSize.value,
    keyword.value,
  )

  //console.log(res);
  if (res.code == 200) {
    roleList.value = res.data.records
    total.value = res.data.total
  }
}

const handleSizeChange = () => {
  getHasRole()
}

const handleCurrentChange = () => {
  getHasRole(currentPage.value)
}

const search = () => {
  //console.log(11);

  getHasRole()
}

const reset = () => {
  settingStore.refsh = !settingStore.refsh
}

const addRole = () => {
  dialogVisible.value = true
  //console.log(form.value);
  Object.assign(roleInfo, {
    roleName: '',
    id: '',
  })

  nextTick(() => {
    form.value.clearValidate('roleName')
  })
}

const confirm = async () => {
  console.log(form.value)

  //校验
  await form.value.validate()
  //console.log(form.value);

  let res = await reqAddOrUpdateRole(roleInfo)
  //console.log(res);

  if (res.code == 200) {
    ElMessage({
      type: 'success',
      message: roleInfo.id ? '修改成功' : '添加成功',
    })
    getHasRole(roleInfo.id ? currentPage.value : 1)
    dialogVisible.value = false
  } else {
    ElMessage({
      type: 'error',
      message: roleInfo.id ? '修改失败' : '添加失败',
    })
  }
}

const EditRole = (row: RoleData) => {
  Object.assign(roleInfo, row)
  dialogVisible.value = true

  nextTick(() => {
    form.value.clearValidate('roleName')
  })
}

const Remove = async (row: RoleData) => {
  let res = await reqRemove(row.id as number)

  if (res.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    getHasRole(
      roleList.value.length > 0 ? currentPage.value : currentPage.value - 1,
    )
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}

const assignRuler = async (row: RoleData) => {
  drawer.value = true
  Object.assign(roleInfo, row)

  let res: PermissionResponseData = await reqAllPermissionList(row.id as number)

  if (res.code == 200) {
    menuArr.value = res.data
    //console.log(res.data);

    selectArr.value = filterSelect(res.data, [])
    //console.log(selectArr.value);
  }
}

const denial = () => {
  drawer.value = false
}

const save = async () => {
  //整理数据
  const roleId = roleInfo.id
  //选中节点的id数组
  let arr = tree.value.getCheckedKeys()
  //半选中的id数组
  let arr1 = tree.value.getHalfCheckedKeys()
  let permissionId = arr.concat(arr1)
  //console.log(arr,arr1,permissionId);

  let res = await reqSetPermission(roleId, permissionId)

  if (res.code == 200) {
    drawer.value = false
    ElMessage({
      type: 'success',
      message: '分配成功',
    })
    window.location.reload()
  } else {
    ElMessage({
      type: 'error',
      message: '分配失败',
    })
  }
}

//过滤勾选的id , 只需要过滤出第四级
const filterSelect = (AllMenu: any, initArr: any) => {
  //console.log(AllMenu);

  AllMenu.forEach((item) => {
    if (item.select && item.level == 4) {
      initArr.push(item.id)
    }
    if (item.children && item.children.length > 0) {
      filterSelect(item.children, initArr)
    }
  })
  //console.log(initArr);

  return initArr
}
</script>

<style scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
