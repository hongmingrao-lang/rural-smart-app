<template>
  <view class="stat-card" :style="{ background: bgColor }">
    <view class="stat-icon">{{ icon }}</view>
    <view class="stat-value">{{ value }}</view>
    <view class="stat-label">{{ label }}</view>
    <view v-if="unit" class="stat-unit">{{ unit }}</view>
  </view>
</template>

<script setup>
defineProps({
  icon: { type: String, default: '' },
  value: { type: [String, Number], default: '--' },
  label: { type: String, default: '' },
  unit: { type: String, default: '' },
  bgColor: { type: String, default: '#ffffff' }
})
</script>

<style scoped>
.stat-card {
  border-radius: 16rpx;
  padding: 24rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.stat-icon {
  font-size: 48rpx;
  margin-bottom: 12rpx;
}

.stat-value {
  font-size: 44rpx;
  font-weight: 700;
  color: #333333;
  line-height: 1.2;
}

.stat-label {
  font-size: 24rpx;
  color: #666666;
  margin-top: 8rpx;
}

.stat-unit {
  font-size: 22rpx;
  color: #999999;
  margin-top: 4rpx;
}
</style>
