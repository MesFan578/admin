<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form
          class="login_form"
          :model="loginForm"
          :rules="rules"
          ref="loginForms"
        >
          <h1>Hello</h1>
          <h2>欢迎来到Leaf甄选</h2>
          <el-form-item prop="username">
            <el-input
              :prefix-icon="User"
              v-model="loginForm.username"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              :prefix-icon="Lock"
              v-model="loginForm.password"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              :loading="loading"
              type="primary"
              class="login_btn"
              size="default"
              @click="login"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import UserStore from '@/store/module/user'
import { ElNotification } from 'element-plus'
import { getTime } from '@/utils/time.ts'
let userStore = UserStore()
let $router = useRouter()
let $route = useRoute()
//按钮加载
let loading = ref(false)

//拿到form组件实例
let loginForms = ref()

let loginForm = reactive({
  username: 'admin',
  password: '111111',
})

const validateUsername = (rule: any, value: any, callback: any) => {
  //rule即校验对象 ，  value即输入的文本 ， callback表放行函数
  if (value.length >= 5) {
    callback()
  } else {
    callback(new Error('账号长度至少5位'))
  }
}

const validatePassword = (rule: any, value: any, callback: any) => {
  if (value.length >= 6) {
    callback()
  } else {
    callback(new Error('密码长度至少6位'))
  }
}

//表单校验配置对象
const rules = {
  username: [
    //一条规则对应一个对象
    // {
    //   required: true,
    //   min : 6 ,
    //   max : 10,
    //   message: '账号长度至少6位,至多10位',
    //   trigger : 'change'  //失去焦点时触发
    // }

    //自定义校验规则
    { required: true, validator: validateUsername },
  ],
  password: [
    // {
    //     required : true ,
    //     min : 6 ,
    //     max : 15 ,
    //     message : '密码长度至少6位,至多15位',
    //     trigger : 'change'
    // }

    { required: true, validator: validatePassword },
  ],
}

const login = async () => {
  try {
    //只有当表单校验成功才会发请求
    //校验成功，返回一个成功promise
    await loginForms.value.validate()

    //按钮加载效果
    loading.value = true

    //登录成功
    await userStore.userLogin(loginForm)

    let redirect = $route.query.redirect
    //跳转 , 路由路径中有query参数 ，就往query参数跳转 ， 否则跳转到首页
    $router.push({ path: redirect || '/' })

    //登录的提示信息
    ElNotification({
      type: 'success',
      message: '欢迎回来',
      title: `Hi , ${getTime()}好`,
    })

    //登录成功消失
    loading.value = false
  } catch (error) {
    //console.log(error);

    //登录失败消失
    loading.value = false
    ElNotification({
      type: 'error',
      message: (error as Error).message,
    })
  }
}
</script>

<style lang="scss" scoped>
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;
}

.login_form {
  position: relative;
  width: 80%;
  top: 30vh;
  background: url('@/assets/images/login_form.png') no-repeat;
  background-size: cover;
  padding: 40px;

  h1 {
    color: white;
    font-size: 40px;
  }
  h2 {
    color: white;
    font-size: 20px;
    margin: 20px 0px;
  }

  .login_btn {
    width: 100%;
  }
}
</style>
