<template>
  <div class="logo">
    <img :src="setting.logo" alt="" />
    <p>{{ setting.title }}</p>
  </div>
</template>

<script setup lang="ts">
import setting from '@/settings'
</script>

<style lang="scss" scoped>
.logo {
  width: 100%;
  height: 50px;
  display: flex;
  color: white;
  align-items: center;
  padding: 10px;
  img {
    width: 40px;
    height: 40px;
  }
  p {
    font-size: 20px;
  }
}
</style>
