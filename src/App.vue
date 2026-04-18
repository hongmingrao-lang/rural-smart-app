<script>
export default {
  onLaunch() {
    // 检查登录状态
    const userInfo = uni.getStorageSync('userInfo')
    if (!userInfo) {
      // 未登录，跳转到登录页（延迟确保页面加载完成）
      setTimeout(() => {
        uni.reLaunch({ url: '/pages/login/login' })
      }, 100)
    }
  },
  onShow() {},
  onHide() {}
}
</script>

<style>
page {
  background-color: #f5f7fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC',
    'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 28rpx;
  color: #333333;
  box-sizing: border-box;
}

/* 通用样式 */
.page-container {
  padding: 24rpx;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.section-card {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
  margin-bottom: 20rpx;
}

.flex-row {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.flex-between {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-grid {
  display: flex;
  flex-wrap: wrap;
  margin: -8rpx;
}

.stat-grid-item {
  width: 50%;
  padding: 8rpx;
  box-sizing: border-box;
}

.tag {
  display: inline-block;
  padding: 4rpx 16rpx;
  border-radius: 999rpx;
  font-size: 22rpx;
}

.tag-success {
  background-color: rgba(103, 194, 58, 0.1);
  color: #67C23A;
}

.tag-danger {
  background-color: rgba(245, 108, 108, 0.1);
  color: #F56C6C;
}

.tag-warning {
  background-color: rgba(230, 162, 60, 0.1);
  color: #E6A23C;
}

.tag-info {
  background-color: rgba(144, 147, 153, 0.1);
  color: #909399;
}

.tag-primary {
  background-color: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #ffffff;
  border: none;
  border-radius: 16rpx;
  height: 88rpx;
  line-height: 88rpx;
  font-size: 32rpx;
  font-weight: 500;
}

.btn-primary::after {
  border: none;
}

.btn-danger {
  background-color: #F56C6C;
  color: #ffffff;
  border: none;
  border-radius: 16rpx;
  height: 88rpx;
  line-height: 88rpx;
  font-size: 32rpx;
}

.btn-danger::after {
  border: none;
}

.text-primary {
  color: #667eea;
}

.text-secondary {
  color: #666666;
}

.text-placeholder {
  color: #999999;
}

.float-btn {
  position: fixed;
  right: 32rpx;
  bottom: 200rpx;
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48rpx;
  box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.4);
  z-index: 999;
}
</style>
