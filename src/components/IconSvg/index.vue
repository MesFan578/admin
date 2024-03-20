<template>
  <div>
    <svg :style="{ width, height }">
      <use :xlink:href="prefix + name" fill="pink"></use>
    </svg>
  </div>
</template>

<script setup lang="ts">
defineProps({
  //前缀
  prefix: {
    type: String,
    default: '#icon-',
  },
  color: {
    type: String,
    default: '',
  },
  width: {
    type: String,
    default: '16px',
  },
  height: {
    type: String,
    default: '16px',
  },
  name: String,
})
</script>
