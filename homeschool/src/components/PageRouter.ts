import { userInfoStoreForSetup } from '@/store/userInfo'
import { defineComponent, defineAsyncComponent, reactive, ref, computed, watch, shallowRef, h } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
    setup() {
        const currentPage = reactive({} as any)
        const routerKey = ref('')

        const $route = useRoute()

        const userStore = userInfoStoreForSetup()
        const isAdmin = computed(() => userStore.isAdmin)

        const getPath = () => {
            let params = $route.params
            let arr = Object.values(params)
            return arr.join('/')
        }
        const allViewModules = import.meta.glob('@/views/**/*.vue')
        if (!window.allViewModules) {
            window.allViewModules = allViewModules
        }
        
        const loader = async () => {
            const path = getPath() || (isAdmin.value ? 'publishJob' : 'notice')
            const p1 = '/src/views/' + path + '/index.vue'
            const p2 = '/src/views/' + path + '.vue'
            routerKey.value = path.replace(/\//g, '_')
            console.log(routerKey.value)
                
            return (window.allViewModules[p1] || window.allViewModules[p2] || window.allViewModules['/src/views/404.vue'])()
        }
        const getAsyncComponent = () => {
            return defineAsyncComponent(
                {
                    loader: loader,
                    delay: 20000,
                    timeout: 1000,
                    errorComponent: window.allViewModules['/src/views/404.vue']
                    // errorComponent: !hasPower(`${getPath()}`) ? noPowerPage : noPage,
                    // loadingComponent: Skeleton,
                }
            )
        }

        const loadPage = () => {
            currentPage.value = shallowRef(getAsyncComponent())
            console.log('loadPage', currentPage.value)
        }
        loadPage()

        watch(() => $route.path, () => {
            loadPage()
        })

        return { currentPage, routerKey, loadPage }
    },
    render(ctx) {
        console.log(ctx.currentPage.value, 'PageRouter-render')
        return h(ctx.currentPage.value)
    }
})
