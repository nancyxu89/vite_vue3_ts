import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router"
import PageRouter from '@/components/PageRouter'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:name/:name1/:name2/:name3/:name4/name5',
    component: PageRouter
  },
  {
    path: '/:name/:name1/:name2/:name3/:name4',
    component: PageRouter
  },
  {
    path: '/:name/:name1/:name2/:name3',
    component: PageRouter
  },
  {
    path: '/:name/:name1/:name2',
    component: PageRouter
  },
  {
    path: '/:name/:name1',
    component: PageRouter
  },
  {
    path: '/:name',
    component: PageRouter
  },
  {
    path: '/',
    component: PageRouter
  }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
    // 页面跳转页面再返回是，重新回到上次的滚动位置
    scrollBehavior(to, from, position) {
        console.log(position, '页面位置信息', to, from)
        if (position) {
            return position
        } else {
            return {
                top: 0,
                left: 0
            }
        }
    }
})

export default router