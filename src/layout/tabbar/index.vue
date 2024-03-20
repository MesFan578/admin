<template>
  <div class="tabbar">
    <div class="tabbar_Left">
      <Bread></Bread>
    </div>

    <div class="tabbar_right">
      <Button></Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import Bread from './bread/index.vue'
import Button from './button/index.vue'
</script>

<script lang="ts">
export default {
  name: 'Tabbar',
}
</script>

<style lang="scss" scoped>
.tabbar {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  background-image: linear-gradient(
    to right,
    rgb(171, 175, 161),
    rgb(218, 183, 55)
  );
  .tabbar_Left {
    display: flex;
    align-items: center;
  }
  .tabbar_right {
    display: flex;
    align-items: center;
  }
}
</style>
