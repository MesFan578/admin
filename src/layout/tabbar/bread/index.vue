<template>
  <el-icon style="margin: 0px 10px" @click="changeIcon">
    <component :is="layoutStore.fold ? 'Fold' : 'Expand'"></component>
  </el-icon>
  <!-- 面包屑 -->
  <el-breadcrumb separator-icon="ArrowRight">
    <el-breadcrumb-item
      v-for="(item, index) in $router.matched"
      :key="index"
      v-show="item.meta.title"
      :to="item.path"
    >
      <el-icon style="margin: 0px 5px">
        <component :is="item.meta.icon"></component>
      </el-icon>
      <span>{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import UseLayoutStore from '@/store/module/setting.ts'

import { useRoute } from 'vue-router'
const layoutStore = UseLayoutStore()

const $router = useRoute()

const changeIcon = () => {
  layoutStore.fold = !layoutStore.fold
}
</script>

<script lang="ts">
export default {
  name: 'Bread',
}
</script>
