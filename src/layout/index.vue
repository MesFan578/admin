<template>
  <div class="layout_container">
    <!-- 左侧菜单 -->
    <div class="layout_slider">
      <Logo></Logo>
      <el-scrollbar class="scroller">
        <el-menu
          :collapse="LayoutStore.fold ? true : false"
          background-color="#001529"
          text-color="white"
          :default-active="$route.path"
        >
          <Menu :menuList="useStore.menuRoutes"></Menu>
        </el-menu>
      </el-scrollbar>
      <!-- <el-scrollbar class="scroller">
          <el-menu background-color="#001529" text-color="white" >
              <el-menu-item index="1">首页</el-menu-item>
              <el-menu-item index="2">数据大屏</el-menu-item>
              <el-sub-menu index="3">
                <template #title>
                  <span>
                    权限管理
                  </span>
                </template>
                <el-menu-item index="2-1">item 1</el-menu-item>
                <el-menu-item index="2-2">item 2</el-menu-item>
              </el-sub-menu>
          </el-menu>
      </el-scrollbar> -->
    </div>
    <!-- 顶部导航 -->
    <div
      class="layout_tabbar"
      :class="{ fold: LayoutStore.fold ? true : false }"
    >
      <Tabbar></Tabbar>
    </div>
    <!-- 内容展示区域  -->
    <div class="layout_main" :class="{ fold: LayoutStore.fold ? true : false }">
      <Main></Main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

import Main from '@/layout/main/index.vue'

import Logo from '@/layout/logo.vue'

import Menu from './menu/index.vue'

import userStore from '@/store/module/user'

import Tabbar from '@/layout/tabbar/index.vue'

import useLayoutStore from '@/store/module/setting.ts'

let $route = useRoute()
let useStore = userStore()

let LayoutStore = useLayoutStore()
</script>

<script lang="ts">
export default {
  name: 'Layout',
}
</script>

<style lang="scss" scoped>
.layout_container {
  width: 100%;
  height: 100vh;
  .layout_slider {
    background: $base-menu-bgc;
    width: $base-menu-width;
    height: 100vh;
    color: white;

    .scroller {
      width: 100%;
      height: calc(100vh - 50px);
      .el-menu {
        border-right: none;
      }
    }
  }

  .layout_tabbar {
    position: fixed;
    width: calc(100% - $base-menu-width);
    height: $base-tabbar-height;
    top: 0px;
    left: $base-menu-width;
    transition: all 0.3s;

    &.fold {
      width: calc(100vw - 50px);
      left: 50px;
    }
  }

  .layout_main {
    position: absolute;
    width: calc(100% - $base-menu-width);
    height: calc(100vh - $base-tabbar-height);
    background: white;
    left: $base-menu-width;
    top: $base-tabbar-height;
    padding: 20px;
    overflow: auto;
    transition: all 0.3s;
    &.fold {
      width: calc(100vw - 50px);
      left: 50px;
    }
  }
}
</style>
