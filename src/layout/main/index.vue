<template>
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <component :is="Component" v-if="flag"></component>
    </transition>
  </router-view>
</template>

<script setup lang="ts">
import UseLayoutStore from '@/store/module/setting.ts'

import { watch, ref, nextTick } from 'vue'
const LayoutStore = UseLayoutStore()

let flag = ref(true)

//监视refsh
watch(
  () => LayoutStore.refsh,
  () => {
    //console.log('1111')

    //console.log(flag.value)

    //不展示，销毁
    flag.value = false

    console.log(flag.value)

    //重新创建
    nextTick(() => {
      flag.value = true
    })
  },
)
</script>

<script lang="ts">
export default {
  name: 'Main',
}
</script>

<style lang="scss" scoped>
.fade-enter-from {
  opacity: 0;
  transform: scale(0);
}

.fade-enter-active {
  transition: all 0.3s;
}

.fade-enter-to {
  opacity: 1;
  transform: scale(1);
}
</style>
