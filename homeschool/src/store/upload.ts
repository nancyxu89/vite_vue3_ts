import { defineStore } from "pinia"
import axios from 'axios'
import Config from 'src/config'
axios.defaults.withCredentials = true

export const uploadStoreForSetup = defineStore('upload', () => {
    const uploadFile = async (data: any) => {
        const param = new FormData()
        param.append('file', data.file)
        const config = {
            headers: { 'Content-Type': 'multipart/form-data' },
        }

        const result = await axios.post(Config.host + 'upload', param, config)
        if (result?.data?.code === 0) {
            return Promise.resolve({ url: result.data.data?.url })
        } else {
            console.log('上传失败:' + data.file)
            return Promise.resolve({ url: '' })
        }
    }
    
    return { uploadFile }
})