<script setup lang="ts" name="login">
import { userInfoStoreForSetup } from '../store/userInfo'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Server from '@/utils/Server'
const account = ref('')
const password = ref('')
const userStoreForSetup = userInfoStoreForSetup()
const $router = useRouter()

const onSubmit = () => {
  Server({
    url: 'login',
    method: 'post',
    needLoading: true,
    data: {
      account: account.value,
      password: password.value,
   },
  }).then((data: any) => {
    const info = {
      token: data.token,
      permission: data.permission,
      permissionName: data.permission_name,
      ...data.user,
    }
    window.localStorage.setItem('userInfo', JSON.stringify(info))
    userStoreForSetup.initUserInfo(info)
    $router.replace({ path: '/' })
    console.log(data)
  })
}
</script>
<template>
<div class="login-box">
    <h1 class="app-name">家校互联</h1>
    <van-form @submit="onSubmit">
      <van-field v-model="account" name="用户名" label="用户名" placeholder="用户名" :rules="[{ required: true, message: '请填写用户名' }]" />
      <van-field v-model="password" type="password" name="密码" label="密码" placeholder="密码" :rules="[{ required: true, message: '请填写密码' }]" />
      <div style="margin: 30px 0">
        <van-button round block type="primary" native-type="submit">登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<style lang="scss" scoped>
.login-box {
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  flex-direction: column;
  margin-top: 30vh;
  .app-name {
    font-size: 0.36rem;
    margin-top: 0;
    margin-bottom: 10vh;
  }
}
</style>
