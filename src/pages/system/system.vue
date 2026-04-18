<template>
  <view class="page-container">
    <!-- 服务器配置 -->
    <view class="section-card">
      <text class="section-title">服务器配置</text>
      <view class="form-item">
        <text class="form-label">后端地址</text>
        <input v-model="serverUrl" class="form-input" placeholder="http://192.168.x.x:8080" />
      </view>
      <view class="flex-between" style="gap: 16rpx;">
        <button class="btn-primary" style="flex: 1; height: 80rpx; line-height: 80rpx; font-size: 28rpx;" @click="saveServerUrl">
          保存地址
        </button>
        <button style="flex: 1; height: 80rpx; line-height: 80rpx; font-size: 28rpx; background: #f5f7fa; color: #333; border: none;" @click="testConnection">
          测试连接
        </button>
      </view>
    </view>

    <!-- 系统信息 -->
    <view class="section-card">
      <text class="section-title">系统信息</text>
      <view class="info-row">
        <text class="info-label">系统名称</text>
        <text class="info-value">乡村颐养家居系统</text>
      </view>
      <view class="info-row">
        <text class="info-label">App版本</text>
        <text class="info-value">1.0.0</text>
      </view>
      <view class="info-row">
        <text class="info-label">运行平台</text>
        <text class="info-value">{{ platform }}</text>
      </view>
      <view class="info-row">
        <text class="info-label">连接状态</text>
        <text class="info-value" :style="{ color: connected ? '#67C23A' : '#F56C6C' }">
          {{ connected ? '已连接' : '未连接' }}
        </text>
      </view>
    </view>

    <!-- 缓存管理 -->
    <view class="section-card">
      <text class="section-title">缓存管理</text>
      <view class="info-row">
        <text class="info-label">缓存大小</text>
        <text class="info-value">{{ cacheSize }}</text>
      </view>
      <button style="margin-top: 16rpx; background: #f5f7fa; color: #333; border: none; height: 80rpx; line-height: 80rpx; font-size: 28rpx;" @click="clearCache">
        清理缓存
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAppStore } from '@/store/app.js'
import authApi from '@/api/auth.js'

const appStore = useAppStore()

const serverUrl = ref('')
const connected = ref(false)
const platform = ref('')
const cacheSize = ref('计算中...')

onMounted(() => {
  serverUrl.value = uni.getStorageSync('serverUrl') || 'http://localhost:8080'

  const sysInfo = uni.getSystemInfoSync()
  platform.value = sysInfo.platform || 'unknown'

  testConnection()
  calcCacheSize()
})

function saveServerUrl() {
  if (!serverUrl.value.trim()) {
    uni.showToast({ title: '请输入服务器地址', icon: 'none' }); return
  }
  appStore.setServerUrl(serverUrl.value.trim())
  uni.showToast({ title: '保存成功', icon: 'success' })
}

async function testConnection() {
  try {
    await authApi.getCurrentUser()
    connected.value = true
    uni.showToast({ title: '连接成功', icon: 'success' })
  } catch (e) {
    connected.value = false
    uni.showToast({ title: '连接失败', icon: 'none' })
  }
}

function calcCacheSize() {
  try {
    const res = uni.getStorageInfoSync()
    cacheSize.value = `${res.currentSize} KB`
  } catch (e) {
    cacheSize.value = '未知'
  }
}

function clearCache() {
  uni.showModal({
    title: '确认清理',
    content: '清理缓存不会清除登录信息，确定继续？',
    success: (res) => {
      if (res.confirm) {
        // 保留登录相关信息
        const userInfo = uni.getStorageSync('userInfo')
        const cookie = uni.getStorageSync('app_cookie_jsessionid')
        const server = uni.getStorageSync('serverUrl')
        const remember = uni.getStorageSync('remember_credentials')

        uni.clearStorageSync()

        // 恢复关键数据
        if (userInfo) uni.setStorageSync('userInfo', userInfo)
        if (cookie) uni.setStorageSync('app_cookie_jsessionid', cookie)
        if (server) uni.setStorageSync('serverUrl', server)
        if (remember) uni.setStorageSync('remember_credentials', remember)

        calcCacheSize()
        uni.showToast({ title: '清理完成', icon: 'success' })
      }
    }
  })
}
</script>

<style scoped>
.form-item { margin-bottom: 24rpx; }
.form-label { display: block; font-size: 28rpx; color: #333; font-weight: 500; margin-bottom: 12rpx; }
.form-input { background: #f5f7fa; border-radius: 12rpx; padding: 0 24rpx; height: 88rpx; font-size: 28rpx; color: #333; }

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f5f7fa;
}
.info-row:last-child { border-bottom: none; }
.info-label { font-size: 28rpx; color: #666; }
.info-value { font-size: 28rpx; color: #333; font-weight: 500; }
</style>
