<template>
  <el-button
    size="small"
    @click="updateRefsh"
    icon="Refresh"
    circle
  ></el-button>
  <el-button
    size="small"
    @click="fullScreen"
    icon="FullScreen"
    circle
  ></el-button>

  <el-popover
    placement="bottom"
    title="主题设置"
    :width="300"
    trigger="hover"
    hide-after="5000"
  >
    <el-form>
      <el-form-item label="主题颜色">
        <el-color-picker
          v-model="color"
          show-alpha
          :predefine="predefineColors"
          @change="changestyle"
        />
      </el-form-item>
      <el-form-item label="暗黑模式">
        <el-switch
          v-model="value2"
          class="ml-2"
          style="
            --el-switch-on-color: #13ce66;
            --el-switch-off-color: #ff4949;
            margin-left: 24px;
          "
          inline-prompt
          active-icon="Sunny"
          inactive-icon="MoonNight"
          @change="changeDark"
        />
      </el-form-item>
    </el-form>
    <template #reference>
      <el-button size="small" icon="Setting" circle></el-button>
    </template>
  </el-popover>

  <img
    :src="userStore.avatar"
    style="width: 24px; height: 24px; margin: 0px 10px; borderradius: 50%"
  />
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.username }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="LoginOut">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import UseLayoutStore from '@/store/module/setting.ts'
import useUserStore from '@/store/module/user.ts'
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

//路由器对象
let $router = useRouter()

//路由对象
let $route = useRoute()

let userStore = useUserStore()

const LayoutStore = UseLayoutStore()

//点击了刷新按钮
const updateRefsh = () => {
  LayoutStore.refsh = !LayoutStore.refsh
}

//全屏函数
const fullScreen = () => {
  let full = document.fullscreenElement

  if (!full) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

//退出登录
const LoginOut = async () => {
  try {
    //清除数据
    await userStore.userLoginOut()

    //回到登录页 , 并将退出前的路哟传给login , 方便登录时重定向
    $router.push({ path: '/login', query: { redirect: $route.path } })
  } catch (error) {
    console.log(error)
  }
}

const color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])

//收集开关
const value2 = ref<boolean>(true)

const changeDark = () => {
  let html = document.documentElement
  value2.value == true ? (html.className = 'dark') : (html.className = '')
}

const changestyle = () => {
  const html = document.documentElement
  html.style.setProperty('--el-color-primary', color.value)
}
</script>

<script lang="ts">
export default {
  name: 'Icon',
}
</script>
