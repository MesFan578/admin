//layout组件共用的一个仓库

import { defineStore } from 'pinia'

const layoutStore = defineStore('LayOutStore', {
  state: () => {
    return {
      //不折叠
      fold: false,
      refsh: false, // 刷新按钮
    }
  },
})

export default layoutStore
