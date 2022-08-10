<script lang="ts" setup name="HomeworkDetail">
import BasePage from '@/hooks/BasePage'
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Server from '@/utils/Server'
import { Dialog } from 'vant'
import { uploadStoreForSetup } from '@/store/upload'
const store = uploadStoreForSetup()

interface FormInfo {
    title: string;
    content: string;
    pics: any[];
    fileList: any[];
}

const { toggleNavBar } = BasePage()
toggleNavBar({
  isShowLeftArrow: true,
  isShowNavBar: true,
  pageCName: '作业详情',
})

const $route = useRoute()

const activeNames = reactive(['1'])
const show = ref(false)
const imgIndex = ref(0)
let images = reactive([])
let form = reactive(<FormInfo>{
  title: '',
  content: '',
  pics: [],
  fileList: []
})
let homework = reactive(<any>{value: null})
let userHomework = reactive(<any>{value: null})

const onSubmit = () => {
  Server({
    url: '/cms/homework/publish',
    method: 'post',
    data: {
      title: form.title,
      content: form.content,
      pics: form.pics?.filter(p => !!p.url),
    },
    needLoading: true,
  }).then(() => {
    Dialog.alert({
      message: '提交成功',
    })
  })
}

const afterRead = (file) => {
  if (Object.prototype.toString.call(file) === '[object Array]') {
    const arr = []
    file.forEach(f => {
      arr.push(store.uploadFile(f))
    })
    Promise.all(arr).then(result => {
      form.pics = form.pics.concat(result)
    })
  } else {
    store.uploadFile(file).then(r => {
      form.pics.push(r)
    })
  }
}
const onDelete = (_, detail) => {
  console.log(form.pics)
  form.pics.splice(detail.index, 1)
}

const previewImg = (it) => {
    show.value = true
    images = it?.pics?.map(p => p.url) || []
}
const onChange = (index) => {
    imgIndex.value = index
}
const onClose = () => {
    imgIndex.value = 0
    images = []
}

const getDetail = () => {
  Server({
    url: '/api/homework/user/detail',
    method: 'post',
    data: {
      homework_id: ~~$route.query?.id,
    },
  }).then((data: any) => {
    homework.value = data.homework
    userHomework.value = data.user_homework
    console.log(homework, userHomework)
  })    
}

onMounted(() => {
  getDetail()
})

</script>
<template>
  <div class="homework-detail">
    <van-collapse v-model="activeNames">
      <van-collapse-item v-if="homework.value" :title="homework.value.title || ''" name="1">
        <div class="content">{{ homework.value.content }}</div>
        <van-image @click="previewImg(homework.value)" width="100" height="100" lazy-load :src="homework.value.pics && homework.value.pics[0] ? homework.value.pics[0].url : ''" />
      </van-collapse-item>
      <van-collapse-item style="margin-top: 16px" v-if="userHomework.value" :title="userHomework.value.title" name="1">
        <div class="content">{{ userHomework.value.content }}</div>
        <van-image
          @click="previewImg(userHomework.value)"
          width="100"
          height="100"
          lazy-load
          :src="userHomework.value.pics && userHomework.value.pics[0] ? userHomework.value.pics[0].url : ''"
        />
      </van-collapse-item>
    </van-collapse>
    <van-form v-if="!userHomework.value" style="margin-top: 24px" @submit="onSubmit">
      <van-field v-model="form.title" name="标题" label="标题" placeholder="标题" :rules="[{ required: true, message: '请填写标题' }]" />
      <van-field
        v-model="form.content"
        :rows="4"
        type="textarea"
        name="内容"
        label="内容"
        placeholder="内容"
        :rules="[{ required: true, message: '请填写内容' }]"
      />
      <van-field name="uploader" label="图片上传">
        <template #input>
          <van-uploader v-model="form.fileList" :after-read="afterRead" @delete="onDelete" multiple :max-count="9" />
        </template>
      </van-field>
      <div style="margin: 16px 20vw">
        <van-button round block type="primary" native-type="submit">提交</van-button>
      </div>
    </van-form>
    <van-image-preview v-model="show" :images="images" @change="onChange" @close="onClose">
      <template v-slot:index>第{{ imgIndex + 1 }}页</template>
    </van-image-preview>
  </div>
</template>
<style lang="scss" scoped></style>
