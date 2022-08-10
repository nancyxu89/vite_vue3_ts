<script lang="ts" setup name="PublishJob">
import BasePage from '@/hooks/BasePage'
import { reactive, onMounted, onBeforeMount } from 'vue'
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
  isShowLeftArrow: false,
  isShowNavBar: true,
  pageCName: '发布作业',
})

onBeforeMount(() => {
  console.log('PublishJob--onBeforeMount')
})

onMounted(() => {
  console.log('PublishJob--onMounted')
})

const form = reactive(<FormInfo>{
  title: '',
  content: '',
  pics: [],
  fileList: []
})

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

</script>
<template>
  <div class="publish-job">
    <van-form @submit="onSubmit">
      <van-field
        v-model="form.title"
        name="标题" 
        label="标题"
        placeholder="标题"
        :rules="[{ required: true, message: '请填写标题' }]" />
      <van-field
        v-model="form.content"
        name="内容"
        label="内容"
        placeholder="内容"
        :rules="[{ required: true, message: '请填写内容' }]"
        :rows="4"
        type="textarea"
      />
      <van-field name="uploader" label="图片上传" :rules="[{ required: true, message: '请上传图片' }]">
        <template #input>
          <van-uploader v-model="form.fileList" :after-read="afterRead" @delete="onDelete" multiple :max-count="9" />
        </template>
      </van-field>
      <div style="margin: 16px">
        <van-button round block type="primary" native-type="submit">提交</van-button>
      </div>
    </van-form>
  </div>
</template>
<style lang="scss" scoped></style>
