<template>
  <view class="page-container">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <text class="search-icon">🔍</text>
      <input v-model="keyword" class="search-input" placeholder="搜索设备名称" @input="onSearch" />
    </view>

    <!-- 设备列表 -->
    <view v-if="filteredDevices.length > 0">
      <rs-device-item
        v-for="item in filteredDevices"
        :key="item.id"
        :device="item"
        @click="goDetail(item)"
      />
    </view>
    <rs-empty v-else text="暂无设备" :showAction="true" actionText="添加设备" @action="goAdd" />

    <!-- 浮动添加按钮 -->
    <view class="float-btn" @click="goAdd">
      <text>+</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import deviceApi from '@/api/device.js'
import { onShow, onPullDownRefresh } from '@dcloudio/uni-app'

const devices = ref([])
const keyword = ref('')

const filteredDevices = computed(() => {
  if (!keyword.value) return devices.value
  const kw = keyword.value.toLowerCase()
  return devices.value.filter(d =>
    d.name.toLowerCase().includes(kw) ||
    (d.location && d.location.toLowerCase().includes(kw))
  )
})

async function loadDevices() {
  try {
    const res = await deviceApi.getDevices()
    devices.value = res.data || []
  } catch (e) {
    console.error('加载设备失败', e)
  }
}

function goDetail(item) {
  // 跳转编辑
  uni.navigateTo({ url: `/pages/device/device-add?id=${item.id}` })
}

function goAdd() {
  uni.navigateTo({ url: '/pages/device/device-add' })
}

function onSearch() {
  // 搜索由 computed 自动处理
}

onShow(() => {
  loadDevices()
})

onPullDownRefresh(() => {
  loadDevices().finally(() => uni.stopPullDownRefresh())
})
</script>

<style scoped>
.search-bar {
  display: flex;
  align-items: center;
  background: #ffffff;
  border-radius: 16rpx;
  padding: 0 24rpx;
  height: 80rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.search-icon {
  font-size: 28rpx;
  margin-right: 16rpx;
}

.search-input {
  flex: 1;
  height: 80rpx;
  font-size: 28rpx;
}
</style>
