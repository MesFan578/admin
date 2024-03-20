import pinia from '@/store/index'
import useUserstore from '@/store/module/user'

let UserStore = useUserstore(pinia)

export const isHasbutton = (app: any) => {
  app.directive('has', {
    //使用这个全局自定义指令 的组件挂载完毕会执行
    //el是绑定的dom , option 包含了传进来的值
    mounted(el: any, option: any) {
      //console.log(el ,option);
      if (!UserStore.buttons.includes(option.value)) {
        el.parentNode.removeChild(el)
      }
    },
  })
}
