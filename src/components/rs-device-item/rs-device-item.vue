<template>
  <view class="device-item" @click="$emit('click', device)">
    <view class="device-left">
      <view class="device-icon-wrap" :class="device.online ? 'online' : 'offline'">
        <text class="device-icon">{{ device.deviceType === 'sensor' ? '📡' : '⚙️' }}</text>
      </view>
      <view class="device-info">
        <view class="device-name">{{ device.name }}</view>
        <view class="device-meta">
          <text class="tag" :class="device.deviceType === 'sensor' ? 'tag-primary' : 'tag-warning'">
            {{ device.deviceType === 'sensor' ? '传感器' : '执行器' }}
          </text>
          <text class="device-location">{{ locationLabel }}</text>
        </view>
      </view>
    </view>
    <view class="device-right">
      <view class="device-status" :class="device.online ? 'status-online' : 'status-offline'">
        {{ device.online ? '在线' : '离线' }}
      </view>
      <view v-if="device.lastValue" class="device-value">{{ device.lastValue }}</view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { getLocationLabel } from '@/utils/format.js'

const props = defineProps({
  device: { type: Object, required: true }
})

defineEmits(['click'])

const locationLabel = computed(() => getLocationLabel(props.device.location))
</script>

<style scoped>
.device-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx;
  background: #ffffff;
  border-radius: 16rpx;
  margin-bottom: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.device-left {
  display: flex;
  align-items: center;
  flex: 1;
  overflow: hidden;
}

.device-icon-wrap {
  width: 80rpx;
  height: 80rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.device-icon-wrap.online {
  background: rgba(103, 194, 58, 0.1);
}

.device-icon-wrap.offline {
  background: rgba(144, 147, 153, 0.1);
}

.device-icon {
  font-size: 36rpx;
}

.device-info {
  flex: 1;
  overflow: hidden;
}

.device-name {
  font-size: 30rpx;
  font-weight: 500;
  color: #333333;
  margin-bottom: 8rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.device-meta {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.tag {
  display: inline-block;
  padding: 2rpx 12rpx;
  border-radius: 999rpx;
  font-size: 20rpx;
}

.tag-primary {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

.tag-warning {
  background: rgba(230, 162, 60, 0.1);
  color: #E6A23C;
}

.device-location {
  font-size: 22rpx;
  color: #999999;
}

.device-right {
  text-align: right;
  flex-shrink: 0;
  margin-left: 16rpx;
}

.device-status {
  font-size: 24rpx;
  font-weight: 500;
  margin-bottom: 6rpx;
}

.status-online {
  color: #67C23A;
}

.status-offline {
  color: #999999;
}

.device-value {
  font-size: 22rpx;
  color: #666666;
}
</style>
