<script setup lang="ts" name="app">
import BasePage from '@/hooks/BasePage'
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import $bus from "@/utils/mitt"
import { userInfoStoreForSetup } from '@/store/userInfo'
import { commonInfoStoreForSetup } from '@/store/common'
const userStore = userInfoStoreForSetup()
const commonStore = commonInfoStoreForSetup()

const $route = useRoute()
const $router = useRouter()

const noticeNum = computed(() => commonStore.noticeNum)
const homeworkNum = computed(() => commonStore.homeworkNum)
const isShowNavBar = computed(() => commonStore.isShowNavBar)
const isShowLeftArrow = computed(() => commonStore.isShowLeftArrow)
const navBarTitle = computed(() => commonStore.navBarTitle)
const leftText = computed(() => commonStore.leftText)
const tabBars = computed(() => userStore.tabBars)
const isLogin = computed(() => userStore.isLogin)
const isAdmin = computed(() => userStore.isAdmin)
const isShowTabbar = computed(() => {
  return isLogin.value && $route.path !== '/login'
})

const active = ref(0)
const isLoading = ref(false)

onMounted(() => {
  $bus.on('loading.show', () => {
    isLoading.value = true
  })
  $bus.on('loading.hide', () => {
    isLoading.value = false
  })
  $bus.on('logout', () => {
    $router.replace('/login')
    window.localStorage.setItem('userInfo', null)
    userStore.initUserInfo(<any>{})
  })
})
onUnmounted(() => {
  $bus.all.clear()
})

// onErrorCaptured((err) => {
//   console.log(err, 'App-onErrorCaptured')
// })

$router
  .isReady()
  .then((onSuccess) => {
    console.log('页面加载完回调1', onSuccess)
  })
  .catch((onError) => {
    console.log(onError)
  })

const setActiveIndex = () => {
  if ($route.path === '/') {
    active.value = 0
    return
  }
  const arr = isAdmin ? ['/publishJob', '/announce', 'jobList', '/userCenter'] : ['/notice', '/homework', '/userCenter']
  arr.forEach((item, idx) => {
    if ($route.path.indexOf(item) !== -1) {
      active.value = idx
    }
  })
}
setActiveIndex()

const { toggleNavBar } = BasePage()
watch(() => $route.path, () => {
  toggleNavBar()
  setActiveIndex()
})

const getBadge = (_p: any) => {
  if (_p.path === '/notice') {
    return noticeNum.value || ''
  }
  if (_p.path === '/homework') {
    return homeworkNum.value || ''
  }
  return ''
}

const handleLeftClick = () => {
  $router.go(-1)
}
</script>

<template>
  <div class="app-container">
    <van-nav-bar fixed v-if="isShowNavBar" :title="navBarTitle" :left-text="leftText" :left-arrow="isShowLeftArrow" @click-left="handleLeftClick" />
    <div class="content" :class="{ 'is-show-navbar': isShowNavBar }">
      <router-view ref="container" />
    </div>
    <van-tabbar v-show="isShowTabbar" v-model="active" fixed>
      <van-tabbar-item v-for="b in tabBars" replace :to="b['path']" :icon="b['icon']" :key="b['path']" :badge="getBadge(b)">{{ b['label'] }}</van-tabbar-item>
    </van-tabbar>
    <van-overlay :show="isLoading">
      <van-loading class="loading" size="24px" type="spinner" color="#1989fa" text-color="#0094ff">加载中...</van-loading>
    </van-overlay>
  </div>
</template>

<style lang="scss">
 @import "src/assets/style/_index.scss";

.app-container {
  position: absolute;
  width: 100%;
  background-color: #f2f3f5;
  font-size: 0.32rem;
  .content {
    box-sizing: border-box;
    margin-top: 0;
    padding-bottom: 50px;
    &.is-show-navbar {
      margin-top: 62px;
    }
  }
  .loading {
    position: absolute;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
  }
}
</style>
