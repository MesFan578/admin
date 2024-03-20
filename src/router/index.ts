import { createRouter, createWebHashHistory } from 'vue-router'

import { routesConst } from './routes'

let router = createRouter({
  history: createWebHashHistory(),
  routes: routesConst,
  //滚动行为
  scrollBehavior() {
    return {
      left: 0,
      top: 0,
    }
  },
})

//console.log(router.addRoute);

export default router
