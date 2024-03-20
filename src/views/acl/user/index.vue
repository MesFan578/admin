<template>
  <div>
    <el-card style="margin: 10px 0px">
      <el-form :inline="true" class="form">
        <el-form-item label="用户名">
          <el-input placeholder="请输入用户名" v-model="keyword"></el-input>
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
          <el-button type="primary" size="default" @click="reset">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <el-button type="primary" size="small" @click="addUSer">
        添加用户
      </el-button>
      <el-button
        type="primary"
        size="small"
        @click="batchRemove"
        :disabled="selectIdList.length > 0 ? false : true"
      >
        批量删除
      </el-button>
      <el-table
        style="margin: 10px 0px"
        border
        :data="UserList"
        @selection-change="batchSelect"
      >
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column
          label="#"
          type="index"
          align="center"
        ></el-table-column>
        <el-table-column label="id" align="center" prop="id"></el-table-column>
        <el-table-column
          label="用户名"
          align="center"
          prop="username"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="用户昵称"
          align="center"
          prop="name"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="用户角色"
          align="center"
          prop="roleName"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="更新时间"
          align="center"
          prop="updateTime"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="操作" width="290px" align="center">
          <template #="{ row, $index }">
            <el-button
              type="primary"
              size="small"
              @click="setRole(row)"
              icon="User"
            >
              分配角色
            </el-button>
            <el-button
              type="primary"
              size="small"
              @click="editUser(row)"
              icon="Edit"
            >
              编辑
            </el-button>
            <el-popconfirm
              @confirm="Remove(row)"
              :title="`你确定要删除${row.username}吗？`"
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
    <!-- 添加和编辑的抽屉 -->
    <el-drawer v-model="drawer">
      <template #header>
        <h4>{{ userParams.id ? '修改用户' : '添加用户' }}</h4>
      </template>
      <template #default>
        <el-form :model="userParams" :rules="rules" ref="form">
          <el-form-item label="用户姓名:" prop="username">
            <el-input
              placeholder="请填写用户名字"
              v-model="userParams.username"
            ></el-input>
          </el-form-item>
          <el-form-item label="用户昵称:" prop="name">
            <el-input
              placeholder="请填写用户昵称"
              v-model="userParams.name"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="用户密码:"
            prop="password"
            v-if="userParams.id ? false : true"
          >
            <el-input
              placeholder="请填写用户名密码"
              v-model="userParams.password"
            ></el-input>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="confirm">确定</el-button>
        </div>
      </template>
    </el-drawer>
    <!-- 分配角色抽屉 -->
    <el-drawer v-model="drawer1">
      <template #header>
        <h4>分配角色</h4>
      </template>
      <template #default>
        <el-form>
          <el-form-item label="用户姓名:">
            <el-input v-model="userParams.username" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="角色列表">
            <el-checkbox
              v-model="checkAll"
              :indeterminate="isIndeterminate"
              @change="handleCheckAllChange"
            >
              全选
            </el-checkbox>
            <el-checkbox-group
              v-model="userRole"
              @change="handleCheckedCitiesChange"
            >
              <el-checkbox
                v-for="(item, index) in allRole"
                :key="item.id"
                :label="item"
                :value="item"
              >
                {{ item.roleName }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <el-button size="default" @click="drawer1 = false">取消</el-button>
        <el-button type="primary" size="default" @click="confirmRole">
          确定
        </el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import {
  reqUserList,
  reqAddOrUpdateUser,
  reqAllRole,
  reqSetUserRole,
  reqBatchRemove,
  reqRemove,
} from '@/api/acl/user/index'
import type {
  userInfo,
  AllRoleResponseData,
  RoleData,
  setRoleData,
} from '@/api/acl/user/type'
import { ElMessage } from 'element-plus'
import layoutStore from '@/store/module/setting'
let settingStore = layoutStore()

let keyword = ref<string>('')
let currentPage = ref<number>(1)
let pageSize = ref<number>(3)
let total = ref<number>(10)

let UserList = ref<userInfo[]>([])

let drawer = ref<boolean>(false)
let drawer1 = ref<boolean>(false)

//收集信息
let userParams = reactive<userInfo>({
  username: '',
  name: '',
  password: '',
})

let form = ref()
//自定义校验规则
const validatorUserName = (rule: any, value: any, callBack: any) => {
  //console.log(111);
  if (value.trim().length >= 5) {
    callBack()
  } else {
    callBack(new Error('用户名至少五位'))
  }
}

const validatorName = (rule: any, value: any, callBack: any) => {
  //console.log(111);
  if (value.trim().length >= 5) {
    callBack()
  } else {
    callBack(new Error('用户昵称至少五位'))
  }
}

const validatorPassword = (rule: any, value: any, callBack: any) => {
  //console.log(111);
  if (value.trim().length >= 6) {
    callBack()
  } else {
    callBack(new Error('密码至少六位'))
  }
}

const rules = {
  username: [{ required: true, trigger: 'blur', validator: validatorUserName }],
  name: [{ required: true, trigger: 'blur', validator: validatorName }],
  password: [{ required: true, trigger: 'blur', validator: validatorPassword }],
}
const getHasUser = async (pager = 1) => {
  currentPage.value = pager

  let res = await reqUserList(currentPage.value, pageSize.value, keyword.value)
  //console.log(res);

  if (res.code == 200) {
    UserList.value = res.data.records
    total.value = res.data.total
  }
}

onMounted(() => {
  getHasUser()
})

const handleSizeChange = () => {
  getHasUser()
}

const handleCurrentChange = () => {
  getHasUser(currentPage.value)
}

const addUSer = () => {
  drawer.value = true

  Object.assign(userParams, {
    id: '',
    username: '',
    name: '',
    password: '',
  })

  //清理表单校验残留信息
  nextTick(() => {
    form.value.clearValidate('username')
    form.value.clearValidate('name')
    form.value.clearValidate('password')
  })
}

const editUser = (row: userInfo) => {
  drawer.value = true

  //console.log(row);
  Object.assign(userParams, row)

  //清理表单校验残留信息
  nextTick(() => {
    form.value.clearValidate('username')
    form.value.clearValidate('name')
  })
}

const cancel = () => {
  drawer.value = false
}

const confirm = async () => {
  //表单校验过才能完成更新或添加
  await form.value.validate()

  let res: any = await reqAddOrUpdateUser(userParams)

  console.log(res)

  if (res.code == 200) {
    ElMessage({
      type: 'success',
      message: userParams.id ? '修改成功' : '添加成功',
    })
    drawer.value = false
    getHasUser(userParams.id ? currentPage.value : 1)
    //如果修改当前登录的账号,浏览器应该自动刷新
    window.location.reload()
  } else {
    ElMessage({
      type: 'error',
      message: userParams.id ? '修改失败' : '添加失败',
    })
  }
}

//分配角色
const setRole = async (row: userInfo) => {
  Object.assign(userParams, row)
  let res: AllRoleResponseData = await reqAllRole(row.id as number)

  //console.log(res);

  if (res.code == 200) {
    allRole.value = res.data.allRolesList
    userRole.value = res.data.assignRoles
    drawer1.value = true
  }
}

//控制是否全选
let checkAll = ref<boolean>(false)
let allRole = ref<RoleData[]>([])
let userRole = ref<RoleData[]>([])
//设置不确定状态，仅负责样式控制
let isIndeterminate = ref<boolean>(true)

let handleCheckAllChange = (val: boolean) => {
  userRole.value = val ? allRole.value : []
  isIndeterminate.value = false
}

const handleCheckedCitiesChange = (value: string[]) => {
  console.log(value)
  //console.log(1 < 0 && 2>1);

  const checkedCount = value.length
  checkAll.value = checkedCount === allRole.value.length
  //修改不确定
  isIndeterminate.value =
    checkedCount > 0 && checkedCount < allRole.value.length
}

const confirmRole = async () => {
  //整理数据
  let data: setRoleData = {
    userId: userParams.id as number,
    roleIdList: userRole.value.map((item) => item.id) as number[],
  }
  //console.log(data);

  let res = await reqSetUserRole(data)

  //console.log(res);
  if (res.code == 200) {
    ElMessage({
      type: 'success',
      message: '分配成功',
    })
    drawer1.value = false
    getHasUser(currentPage.value)
  } else {
    ElMessage({
      type: 'success',
      message: '分配失败',
    })
  }
}

const Remove = async (row) => {
  let res: any = await reqRemove(row.id)

  //console.log(res);
  if (res.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    getHasUser(
      UserList.value.length > 1 ? currentPage.value : currentPage.value - 1,
    )
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}

let selectIdList = ref<number[]>([])

const batchSelect = (value: any) => {
  //console.log(value);
  //已选的id收集数组
  selectIdList.value = value.map((item) => item.id)
}

//批量删除
const batchRemove = async () => {
  let res = await reqBatchRemove(selectIdList.value)
  if (res.code == 200) {
    ElMessage({
      type: 'success',
      message: '批量删除成功',
    })
    getHasUser(
      UserList.value.length > 1 ? currentPage.value : currentPage.value - 1,
    )
  } else {
    ElMessage({
      type: 'error',
      message: '批量删除失败',
    })
  }
}

const search = async () => {
  getHasUser()
  keyword.value = ''
}

const reset = () => {
  settingStore.refsh = !settingStore.refsh
}
</script>

<style scoped>
.form {
  display: flex;
  justify-content: space-between;
}
</style>
