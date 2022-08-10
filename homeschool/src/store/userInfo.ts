import { defineStore } from "pinia"
import { ref, reactive } from 'vue'

interface UserInfo {
    userName: string;
    token: string;
    [propName: string]: any;
}

export const userInfoStoreForSetup = defineStore('userInfo', () => {
    const bars = {
        0: [
          { path: '/notice', label: '学校通知', icon: 'comment-o' },
          { path: '/homework', label: '家庭作业', icon: 'shopping-cart-o' },
          { path: '/userCenter', label: '个人中心', icon: 'contact' },
        ],
        1: [
          { path: '/publishJob', label: '发布作业', icon: 'home-o' },
          { path: '/announce', label: '发布通知', icon: 'comment-circle-o' },
          { path: '/jobList', label: '作业列表', icon: 'todo-list-o' },
          { path: '/userCenter', label: '个人中心', icon: 'contact' },
        ],
      }

    let userInfo = reactive(<UserInfo>{})
    const isLogin = ref<boolean>(false)
    const isAdmin = ref<boolean>(false)
    const tabBars = ref<any[]>([])

    function initUserInfo (_data: UserInfo) {
        userInfo = _data
        isLogin.value = !!_data.token
        isAdmin.value = _data.permission === 2
        tabBars.value = bars[_data.permission === 2 ? 1 : 0]
        window.localStorage.setItem('isLogin', JSON.stringify(isLogin.value))
    }
    try {
        const defaultUserInfo = JSON.parse(window.localStorage.getItem('userInfo') || '{}')
        if (Object.keys(defaultUserInfo).length) {
            initUserInfo(defaultUserInfo)
        }
    }catch {
    }
    
    return { userInfo, isLogin, isAdmin, tabBars, initUserInfo }
})