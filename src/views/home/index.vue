<template>
  <div>
    <el-card>
      <div class="box">
        <img :src="userStore.avatar" alt="" class="avatar" />
        <h3 class="title">{{ userStore.username + getTime() + '好' }}</h3>
      </div>
    </el-card>
    <div class="bottom">
      <IconSvg name="welcome" width="600px" height="300px"></IconSvg>
    </div>
  </div>
</template>

<script setup lang="ts">
import useuserStore from '@/store/module/user'
import { getTime } from '@/utils/time'

let userStore = useuserStore()
</script>

<style scoped lang="scss">
.box {
  display: flex;
  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
  .title {
    margin-top: 30px;
    font-size: 20px;
    margin-left: 20px;
    font-weight: 800;
  }
}

.bottom {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
