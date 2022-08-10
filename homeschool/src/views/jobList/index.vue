<script lang="ts" setup name="JobList">
import BasePage from '@/hooks/BasePage'
import { ref, reactive, onMounted } from 'vue'
import Server from '@/utils/Server'

const { toggleNavBar, formatDate } = BasePage()
toggleNavBar({
  isShowLeftArrow: false,
  isShowNavBar: true,
  pageCName: '作业列表',
})

const refreshing = ref(false)
const loading = ref(false)
const finished = ref(false)
const show = ref(false)
const cursor = ref('')
const imgIndex = ref(0)
const list = reactive({value: []})
const images = reactive({value: []})

const onLoad = () => {
    Server({
        url: '/cms/homework/user/list',
        method: 'post',
        data: {
          cursor: cursor.value,
        },
      })
        .then((data: any) => {
          cursor.value = data.cursor
          if (refreshing.value) {
            list.value = []
            refreshing.value = false
          }
          const arr = data?.list || []
          list.value.push(...arr)
          loading.value = false

          if (!arr.length) {
            finished.value = true
          }
          console.log(list.value)
        })
        .catch(() => {
          loading.value = false
          finished.value = true
        })
}

const onRefresh = () => {
    cursor.value = ''
    // 清空列表数据
    finished.value = false

    // 重新加载数据
    // 将 loading 设置为 true，表示处于加载状态
    loading.value = true
    onLoad()
}

const previewImg = (it) => {
    show.value = true
    images.value = it?.pics?.map(p => p.url) || []
}
const onChange = (index) => {
    imgIndex.value = index
}
const onClose = () => {
    imgIndex.value = 0
    images.value = []
}

onMounted(() => {
  onRefresh()
  console.log('onMounted--JobList')
})

</script>
<template>
  <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <van-cell-group v-for="item in list.value" :key="item.id">
        <van-cell>
          <template #title>
            <span style="font-size: 16px">{{ item.title }}</span>
            <span style="position: relative; float: right">{{ formatDate(item.updated_at) }}</span>
          </template>
          <template #label>
            <div>{{ item.content }}</div>
            <van-image @click="previewImg(item)" width="60" height="60" lazy-load :src="item.pics && item.pics[0] ? item.pics[0].url : ''" />
          </template>
        </van-cell>
      </van-cell-group>
    </van-list>
    <van-image-preview v-model="show" :images="images.value" @change="onChange" @close="onClose">
      <template #index>第{{ imgIndex + 1 }}页</template>
    </van-image-preview>
  </van-pull-refresh>
</template>
<style lang="scss" scoped></style>
