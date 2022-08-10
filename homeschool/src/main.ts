import { piniaStore } from '@/store/index'
import { vantPlugins } from '@/plugins/vant'
import { createApp } from 'vue'
import '@/components'
import App from '@/views/App.vue'
import router from '@/router'

router.beforeEach(async (to, _, next) => {
    const isAuthenticated = window.localStorage.getItem('isLogin')
     // 检查用户是否已登录, 避免无限重定向
    if (isAuthenticated !== 'true' && to.path !== '/login') {
      // 将用户重定向到登录页面
      next({ path: '/login', replace: true })
    } else {
      next()
    }
})

createApp(App).use(router).use(piniaStore).use(vantPlugins).mount('#app')
