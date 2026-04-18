<template>
  <view class="empty-container">
    <text class="empty-icon">📭</text>
    <text class="empty-text">{{ text }}</text>
    <view v-if="showAction" class="empty-action" @click="$emit('action')">
      <text class="empty-action-text">{{ actionText }}</text>
    </view>
  </view>
</template>

<script setup>
defineProps({
  text: { type: String, default: '暂无数据' },
  showAction: { type: Boolean, default: false },
  actionText: { type: String, default: '去添加' }
})

defineEmits(['action'])
</script>

<style scoped>
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
}

.empty-icon {
  font-size: 80rpx;
  margin-bottom: 24rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999999;
  margin-bottom: 24rpx;
}

.empty-action {
  padding: 16rpx 40rpx;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 999rpx;
}

.empty-action-text {
  color: #ffffff;
  font-size: 28rpx;
}
</style>
