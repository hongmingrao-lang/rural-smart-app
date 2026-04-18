<template>
  <view class="page-container">
    <!-- 欢迎卡片 -->
    <view class="welcome-card">
      <view class="welcome-info">
        <text class="welcome-text">欢迎回来</text>
        <text class="welcome-name">{{ username }}</text>
      </view>
      <text class="welcome-icon">🏡</text>
    </view>

    <!-- 实时数据统计 -->
    <view class="section-title">实时数据</view>
    <view class="stat-grid">
      <view class="stat-grid-item">
        <rs-stat-card icon="📱" :value="stats.onlineDevices" label="在线设备" bgColor="#f0f5ff" />
      </view>
      <view class="stat-grid-item">
        <rs-stat-card icon="🌡️" :value="temperature" label="当前温度" unit="°C" bgColor="#fff7f0" />
      </view>
      <view class="stat-grid-item">
        <rs-stat-card icon="💧" :value="humidity" label="当前湿度" unit="%" bgColor="#f0fff4" />
      </view>
      <view class="stat-grid-item">
        <rs-stat-card icon="🌱" :value="soilMoisture" label="土壤湿度" unit="%" bgColor="#fef0ff" />
      </view>
    </view>

    <!-- 快捷功能 -->
    <view class="section-title">快捷功能</view>
    <view class="quick-grid">
      <view class="quick-item" @click="navigateTo('/pages/sensor/sensor')">
        <view class="quick-icon-wrap" style="background: #e8f4fd;">
          <text class="quick-icon">📊</text>
        </view>
        <text class="quick-label">传感器数据</text>
      </view>
      <view class="quick-item" @click="navigateTo('/pages/irrigation/irrigation')">
        <view class="quick-icon-wrap" style="background: #e8fdf0;">
          <text class="quick-icon">🚿</text>
        </view>
        <text class="quick-label">灌溉管理</text>
      </view>
      <view class="quick-item" @click="navigateTo('/pages/automation/automation')">
        <view class="quick-icon-wrap" style="background: #fef3e8;">
          <text class="quick-icon">⚡</text>
        </view>
        <text class="quick-label">自动化规则</text>
      </view>
      <view class="quick-item" @click="navigateTo('/pages/system/system')">
        <view class="quick-icon-wrap" style="background: #f3e8fe;">
          <text class="quick-icon">⚙️</text>
        </view>
        <text class="quick-label">系统设置</text>
      </view>
    </view>

    <!-- 设备概览 -->
    <view class="section-title">设备概览</view>
    <view class="section-card">
      <view class="overview-row">
        <text class="overview-label">总设备数</text>
        <text class="overview-value">{{ stats.totalDevices }}</text>
      </view>
      <view class="overview-row">
        <text class="overview-label">在线设备</text>
        <text class="overview-value" style="color: #67C23A;">{{ stats.onlineDevices }}</text>
      </view>
      <view class="overview-row">
        <text class="overview-label">离线设备</text>
        <text class="overview-value" style="color: #F56C6C;">{{ stats.offlineDevices }}</text>
      </view>
      <view class="overview-row">
        <text class="overview-label">在线率</text>
        <text class="overview-value" style="color: #667eea;">{{ onlineRate }}%</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/store/user.js'
import { useAppStore } from '@/store/app.js'
import deviceApi from '@/api/device.js'
import sensorApi from '@/api/sensor.js'
import { onShow, onPullDownRefresh } from '@dcloudio/uni-app'

const userStore = useUserStore()
const appStore = useAppStore()

const username = computed(() => userStore.userInfo?.username || '用户')

const stats = ref({
  totalDevices: 0,
  onlineDevices: 0,
  offlineDevices: 0,
  onlineRate: 0
})

const temperature = ref('--')
const humidity = ref('--')
const soilMoisture = ref('--')

const onlineRate = computed(() => {
  return stats.value.onlineRate ? Number(stats.value.onlineRate).toFixed(1) : '0.0'
})

async function loadData() {
  try {
    const [statsRes, sensorRes] = await Promise.all([
      deviceApi.getDeviceStatistics().catch(() => null),
      sensorApi.getLatestData().catch(() => null)
    ])

    if (statsRes?.data) {
      stats.value = statsRes.data
    }

    if (sensorRes?.data) {
      const list = sensorRes.data
      list.forEach(item => {
        if (item.sensorType === 'temperature') temperature.value = Number(item.value).toFixed(1)
        if (item.sensorType === 'humidity') humidity.value = Number(item.value).toFixed(1)
        if (item.sensorType === 'soil') soilMoisture.value = Number(item.value).toFixed(1)
      })
      appStore.updateRealtimeData({
        temperature: temperature.value,
        humidity: humidity.value,
        soilMoisture: soilMoisture.value
      })
    }
  } catch (e) {
    console.error('加载数据失败', e)
  }
}

function navigateTo(url) {
  uni.navigateTo({ url })
}

onShow(() => {
  loadData()
})

onPullDownRefresh(() => {
  loadData().finally(() => uni.stopPullDownRefresh())
})
</script>

<style scoped>
.welcome-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 20rpx;
  padding: 32rpx;
  margin-bottom: 32rpx;
}

.welcome-text {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
  display: block;
  margin-bottom: 8rpx;
}

.welcome-name {
  font-size: 40rpx;
  font-weight: 700;
  color: #ffffff;
  display: block;
}

.welcome-icon {
  font-size: 64rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
  margin-bottom: 20rpx;
}

.stat-grid {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -8rpx 24rpx;
}

.stat-grid-item {
  width: 50%;
  padding: 8rpx;
  box-sizing: border-box;
}

.quick-grid {
  display: flex;
  flex-wrap: wrap;
  background: #ffffff;
  border-radius: 20rpx;
  padding: 24rpx 0;
  margin-bottom: 32rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.quick-item {
  width: 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16rpx 0;
}

.quick-icon-wrap {
  width: 96rpx;
  height: 96rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12rpx;
}

.quick-icon {
  font-size: 40rpx;
}

.quick-label {
  font-size: 24rpx;
  color: #666666;
}

.overview-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f5f7fa;
}

.overview-row:last-child {
  border-bottom: none;
}

.overview-label {
  font-size: 28rpx;
  color: #666666;
}

.overview-value {
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
}
</style>
