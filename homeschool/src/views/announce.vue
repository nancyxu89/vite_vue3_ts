<script lang="ts" setup name="Announce">
import BasePage from '@/hooks/BasePage'
import { reactive, onMounted, onBeforeMount } from 'vue'
import Server from '@/utils/Server'
import { Dialog } from 'vant'

interface FormInfo {
    title: string;
    content: string;
    level: number;
}

const { toggleNavBar } = BasePage()
toggleNavBar({
  isShowLeftArrow: false,
  isShowNavBar: true,
  pageCName: '发布通知',
})

const form = reactive(<FormInfo>{
  title: '',
  content: '',
  level: null
})

const onSubmit = () => {
  Server({
    url: '/cms/notice/publish',
    method: 'post',
    data: {
      title: form.title,
      content: form.content,
      level: form.level,
    },
    needLoading: true,
  }).then(() => {
    Dialog.alert({
      message: '提交成功',
    })
  })
}

onBeforeMount(() => {
  console.log('Announce--onBeforeMount')
})

onMounted(() => {
  console.log('Announce--onMounted')
})

</script>
<template>
  <div class="announce">
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
      <van-field name="radio" label="等级">
        <template #input>
          <van-radio-group v-model="form.level" direction="horizontal">
            <van-radio :name="1">高</van-radio>
            <van-radio :name="2">中</van-radio>
            <van-radio :name="3">低</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <div style="margin: 16px">
        <van-button round block type="primary" native-type="submit">提交</van-button>
      </div>
    </van-form>
  </div>
</template>
<style lang="scss" scoped></style>
