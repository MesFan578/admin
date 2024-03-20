//二次封装axios
import axios from 'axios'
import { ElMessage } from 'element-plus'

import useUserStore from '@/store/module/user'

//创建axios实例
let request = axios.create({
  //配置请求基础路劲
  baseURL: '/api',
  // timeout : 5000
})
//添加请求和响应拦截器
request.interceptors.request.use((config) => {
  let userStore = useUserStore()
  //配置token请求头
  config.headers.token = userStore.token

  return config
})

request.interceptors.response.use(
  (res) => {
    //console.log(res);

    return res.data
  },
  (err) => {
    let Message = ''
    console.log(err)

    let status = err.response.status
    console.log(status)

    switch (status) {
      case 401:
        Message = 'token过期'
        break
      case 403:
        Message = '无权访问'
        break
      case 404:
        Message = '请求地址错误'
        break
      case 500:
        Message = '服务器出现问题'
        break
      default:
        Message = '网络出现问题'
        break
    }

    ElMessage({
      type: 'error',
      message: Message,
    })

    return Promise.reject(err)
  },
)

export default request
