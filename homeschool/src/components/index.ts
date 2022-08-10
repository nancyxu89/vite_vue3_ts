const modules = import.meta.glob('@/components/*.vue', { eager: true }) 

export default {
    install(app: any) {
        Object.keys(modules).forEach(componentPath => {
            // 获取遍历的当前组件实例对象
            let curComponent = (modules[componentPath] as any).default

            app.component(curComponent.name, curComponent)
        })
    }
}