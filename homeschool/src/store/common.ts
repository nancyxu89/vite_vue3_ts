import { defineStore } from "pinia"
import { ref } from 'vue'

export const commonInfoStoreForSetup = defineStore('commonInfo', () => {
    const noticeNum = ref<number>(0)
    const homeworkNum = ref<number>(0)
    const isShowNavBar = ref<boolean>(false)
    const isShowLeftArrow = ref<boolean>(false)
    const navBarTitle = ref<string>('')
    const leftText = ref<string>('')

    function toggleNavBar(data: any) {
        noticeNum.value = data.noticeNum || 0
        homeworkNum.value = data.homeworkNum || 0
        isShowNavBar.value = data.isShowNavBar || false
        isShowLeftArrow.value = data.isShowLeftArrow || false
        navBarTitle.value = data.navBarTitle  || ''
        leftText.value = data.leftText  || ''
    }
    
    return { noticeNum, homeworkNum, isShowNavBar, isShowLeftArrow, navBarTitle, leftText, toggleNavBar }
})