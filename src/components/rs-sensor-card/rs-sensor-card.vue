<template>
  <view class="sensor-card" :style="{ borderLeftColor: color }">
    <view class="sensor-header">
      <text class="sensor-icon">{{ icon }}</text>
      <text class="sensor-title">{{ title }}</text>
    </view>
    <view class="sensor-body">
      <text class="sensor-value">{{ displayValue }}</text>
      <text class="sensor-unit">{{ unit }}</text>
    </view>
    <view v-if="time" class="sensor-footer">
      <text class="sensor-time">{{ time }}</text>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: { type: String, default: '' },
  value: { type: [String, Number], default: null },
  unit: { type: String, default: '' },
  icon: { type: String, default: '' },
  color: { type: String, default: '#667eea' },
  time: { type: String, default: '' }
})

const displayValue = computed(() => {
  if (props.value === null || props.value === undefined) return '--'
  return Number(props.value).toFixed(1)
})
</script>

<style scoped>
.sensor-card {
  background: #ffffff;
  border-radius: 16rpx;
  padding: 24rpx;
  border-left: 6rpx solid #667eea;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.sensor-header {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}

.sensor-icon {
  font-size: 32rpx;
  margin-right: 12rpx;
}

.sensor-title {
  font-size: 26rpx;
  color: #666666;
}

.sensor-body {
  display: flex;
  align-items: baseline;
}

.sensor-value {
  font-size: 56rpx;
  font-weight: 700;
  color: #333333;
  line-height: 1.2;
}

.sensor-unit {
  font-size: 28rpx;
  color: #999999;
  margin-left: 8rpx;
}

.sensor-footer {
  margin-top: 12rpx;
}

.sensor-time {
  font-size: 22rpx;
  color: #cccccc;
}
</style>
