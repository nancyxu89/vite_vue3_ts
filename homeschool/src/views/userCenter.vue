<script setup lang="ts" name="UserCenter">
import BasePage from '@/hooks/BasePage'
import { reactive, ref, computed } from 'vue'
import $bus from "@/utils/mitt"
import { Toast } from "vant"
import { userInfoStoreForSetup } from '@/store/userInfo'

const { toggleNavBar } = BasePage()
toggleNavBar({
  isShowLeftArrow: false,
  isShowNavBar: true,
  pageCName: '个人中心',
})

const userStore = userInfoStoreForSetup()
const userInfo = computed(() => userStore.userInfo)
const showShare = ref(false)
const options = reactive([
        [
          { name: '微信', icon: 'wechat' },
          { name: '微博', icon: 'weibo' },
          { name: 'QQ', icon: 'qq' },
        ],
        [
          { name: '复制链接', icon: 'link' },
          { name: '二维码', icon: 'qrcode' },
          { name: '小程序码', icon: 'weapp-qrcode' },
        ],
      ])

 const onSelect = (option) => {
  Toast(option.name)
  showShare.value = false
}
 const logout = () => {
  $bus.emit('logout')
}

</script>

<template>
  <div class="user-center">
    <section class="user-info">
      <div class="header-img">
        <van-image round width="1rem" height="1rem" :src="userInfo.avatar" />
      </div>
      <div class="brief">
        <div class="user-name">{{ userInfo.nickname }}</div>
        <div>{{ userInfo.mobile }}</div>
      </div>
    </section>
    <section class="sub-column">
      <van-cell icon="shop-o" title="意见反馈" is-link @click="$toast('意见反馈')" />
      <van-divider />
      <van-cell icon="shop-o" title="关于我们" is-link @click="$toast('关于我们')" />
      <van-divider />
      <van-cell icon="shop-o" title="分享" is-link @click="showShare = true" />
      <van-divider />
    </section>
    <div style="margin: 30px">
      <van-button round block type="primary" @click="logout">退出</van-button>
    </div>
    <van-share-sheet v-model="showShare" title="立即分享给好友" :options="options" @select="onSelect" />
  </div>
</template>

<style lang="scss">
.user-center {
  .user-info {
    background-color: #fff;
    padding: 16px 0;
    height: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .header-img {
      width: 1.5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-shrink: 0;
    }
    .brief {
      width: 100%;
    }
  }
  .user-name {
    font-size: 0.48rem;
    font-weight: 700;
  }
  .sub-column {
    margin: 12px 0;
  }
  .van-divider {
    margin: 0;
  }
  :deep .van-share-sheet__options {
    justify-content: space-evenly;
  }
}
</style>
