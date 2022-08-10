<script lang="ts" setup name="Homework">
import BasePage from '@/hooks/BasePage'
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Server from '@/utils/Server'

const { toggleNavBar, formatDate } = BasePage()
toggleNavBar({
  isShowLeftArrow: false,
  isShowNavBar: true,
  pageCName: '家庭作业',
})

const $router = useRouter()

const refreshing = ref(false)
const loading = ref(false)
const finished = ref(false)
const cursor = ref('')
const list = reactive({value: []})

const onLoad = () => {
    Server({
        url: '/api/homework/list',
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

const go2Detail = (row) => {
  $router.push({
    path: '/homework/detail',
    query: {
      id: row.id,
    },
  })
}

onMounted(() => {
  onRefresh()
})
</script>
<template>
  <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <van-cell-group v-for="item in list.value" :key="item.id">
        <van-cell @click.stop="go2Detail(item)">
          <template #title>
            <span style="font-size: 16px">{{ item.title }}</span>
            <span style="position: relative; float: right">{{ formatDate(item.updated_at) }}</span>
          </template>
          <template #label>
            <div>{{ item.content }}</div>
            <van-image width="60" height="60" lazy-load :src="item.pics && item.pics[0] ? item.pics[0].url : ''" />
          </template>
        </van-cell>
      </van-cell-group>
    </van-list>
  </van-pull-refresh>
</template>
<style lang="scss" scoped></style>
