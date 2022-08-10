import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router"

// 通过Vite的import.meta.glob()方法实现自动化导入路由
const mainRouterModules: any = import.meta.glob('./views/**/*.vue', { eager: true })

// 路由
const rootRoutes = Object.keys(mainRouterModules).map((path) => {
    const name = path.match(/\.\/views\/(.*)\.vue$/)?.[1].toLowerCase()
    return {
        path: `/${name?.toLowerCase()}`,
        name: name,
        component: mainRouterModules[path].default
    }
}).filter(r => r.name !== 'app')

const routes: Array<RouteRecordRaw> = rootRoutes

routes.push({
  path: '/:pathMatch(.*)*', // 此处需特别注意至于最底部
  redirect: '/404'
})

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