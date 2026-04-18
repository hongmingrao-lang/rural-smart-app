<template>
  <view class="page-container">
    <!-- 用户信息卡片 -->
    <view class="user-card">
      <view class="avatar-wrap">
        <text class="avatar-text">{{ avatarChar }}</text>
      </view>
      <view class="user-info">
        <text class="user-name">{{ userInfo?.username || '未登录' }}</text>
        <text class="user-role tag" :class="userInfo?.role === 'admin' ? 'tag-primary' : 'tag-info'">
          {{ userInfo?.role === 'admin' ? '管理员' : '普通用户' }}
        </text>
      </view>
    </view>

    <!-- 功能列表 -->
    <view class="menu-card">
      <view class="menu-item" @click="navigateTo('/pages/sensor/sensor')">
        <text class="menu-icon">📊</text>
        <text class="menu-text">传感器数据</text>
        <text class="menu-arrow">▸</text>
      </view>
      <view class="menu-item" @click="navigateTo('/pages/irrigation/irrigation')">
        <text class="menu-icon">🚿</text>
        <text class="menu-text">灌溉管理</text>
        <text class="menu-arrow">▸</text>
      </view>
      <view class="menu-item" @click="navigateTo('/pages/automation/automation')">
        <text class="menu-icon">⚡</text>
        <text class="menu-text">自动化规则</text>
        <text class="menu-arrow">▸</text>
      </view>
      <view class="menu-item" @click="navigateTo('/pages/system/system')">
        <text class="menu-icon">⚙️</text>
        <text class="menu-text">系统设置</text>
        <text class="menu-arrow">▸</text>
      </view>
    </view>

    <!-- 退出登录 -->
    <button class="btn-logout" @click="handleLogout">退出登录</button>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/store/user.js'
import { onShow } from '@dcloudio/uni-app'

const userStore = useUserStore()

const userInfo = computed(() => userStore.userInfo)
const avatarChar = computed(() => {
  const name = userStore.userInfo?.username
  return name ? name.charAt(0).toUpperCase() : '?'
})

function navigateTo(url) {
  uni.navigateTo({ url })
}

function handleLogout() {
  uni.showModal({
    title: '确认退出',
    content: '确定要退出登录吗？',
    success: async (res) => {
      if (res.confirm) {
        await userStore.logout()
        uni.reLaunch({ url: '/pages/login/login' })
      }
    }
  })
}

onShow(() => {
  userStore.loadFromStorage()
})
</script>

<style scoped>
.user-card {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 20rpx;
  padding: 40rpx 32rpx;
  margin-bottom: 32rpx;
}

.avatar-wrap {
  width: 110rpx;
  height: 110rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 28rpx;
}

.avatar-text {
  font-size: 48rpx;
  font-weight: 700;
  color: #ffffff;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 36rpx;
  font-weight: 600;
  color: #ffffff;
  display: block;
  margin-bottom: 8rpx;
}

.user-role {
  display: inline-block;
  padding: 4rpx 16rpx;
  border-radius: 999rpx;
  font-size: 22rpx;
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.menu-card {
  background: #ffffff;
  border-radius: 20rpx;
  overflow: hidden;
  margin-bottom: 40rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 32rpx 28rpx;
  border-bottom: 1rpx solid #f5f7fa;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-icon {
  font-size: 36rpx;
  margin-right: 20rpx;
}

.menu-text {
  flex: 1;
  font-size: 30rpx;
  color: #333333;
}

.menu-arrow {
  font-size: 26rpx;
  color: #cccccc;
}

.btn-logout {
  width: 100%;
  height: 96rpx;
  line-height: 96rpx;
  background: #ffffff;
  color: #F56C6C;
  font-size: 32rpx;
  font-weight: 500;
  border: none;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.btn-logout::after {
  border: none;
}
</style>
