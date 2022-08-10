import dayjs from 'dayjs'
import { commonInfoStoreForSetup } from '@/store/common'
import { ref, onBeforeMount, onMounted } from 'vue'

export default function() {
    const commonStore = commonInfoStoreForSetup()
    interface Setting {
        isShowNavBar: boolean;
        isShowLeftArrow?: boolean;
        leftText?: string;
        pageCName?: string;
    }

    const isShowNavBar = ref(false)
    const isShowLeftArrow = ref(false)
    const leftText = ref('')
    
    const toggleNavBar = (data: Setting = { isShowNavBar: isShowNavBar.value, isShowLeftArrow: isShowLeftArrow.value, leftText: leftText.value }) => {
        console.log('BasePage', data)
        commonStore.toggleNavBar({
            isShowNavBar: data.isShowNavBar,
            isShowLeftArrow: data.isShowLeftArrow,
            leftText: data.leftText,
            navBarTitle: data.pageCName
        })
    }

    const formatDate = (value, format: string = '') => {
        if (!value) return ''
        return dayjs(value).format(format || 'YYYY-MM-DD HH:mm:ss')
    }
    
    onBeforeMount(() => {
        console.log('BasePage--onBeforeMount')
    })
    
    onMounted(() => {
        console.log('BasePage--onMounted')
    })
    return { toggleNavBar, formatDate }
}