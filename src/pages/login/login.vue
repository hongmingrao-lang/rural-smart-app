<template>
  <view class="login-page">
    <!-- 顶部装饰 -->
    <view class="login-header">
      <view class="brand-icon">🏡</view>
      <text class="brand-title">乡村颐养家居系统</text>
      <text class="brand-subtitle">智慧家居 · 舒适生活</text>
    </view>

    <!-- 登录表单 -->
    <view class="login-form-card">
      <text class="form-title">账号登录</text>

      <view class="input-group">
        <text class="input-icon">👤</text>
        <input
          v-model="form.username"
          class="input-field"
          placeholder="请输入用户名"
          placeholder-class="input-placeholder"
          maxlength="20"
        />
      </view>

      <view class="input-group">
        <text class="input-icon">🔒</text>
        <input
          v-model="form.password"
          class="input-field"
          type="password"
          placeholder="请输入密码"
          placeholder-class="input-placeholder"
          maxlength="20"
        />
      </view>

      <view class="form-options">
        <view class="remember-wrap" @click="form.remember = !form.remember">
          <view class="checkbox" :class="{ checked: form.remember }">
            <text v-if="form.remember" class="check-mark">✓</text>
          </view>
          <text class="remember-text">记住密码</text>
        </view>
      </view>

      <button class="btn-login" :loading="loading" @click="handleLogin">
        登 录
      </button>

      <view class="form-footer">
        <text class="footer-text">还没有账号？</text>
        <text class="footer-link" @click="goRegister">立即注册</text>
      </view>
    </view>

    <!-- 演示账号提示 -->
    <view class="demo-tip">
      <text class="demo-text">演示账号: admin / admin123</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/store/user.js'

const userStore = useUserStore()

const loading = ref(false)
const form = ref({
  username: '',
  password: '',
  remember: false
})

onMounted(() => {
  // 加载记住的密码
  const saved = uni.getStorageSync('remember_credentials')
  if (saved) {
    try {
      const cred = JSON.parse(saved)
      form.value.username = cred.username || ''
      form.value.password = cred.password || ''
      form.value.remember = true
    } catch (e) {}
  }
})

async function handleLogin() {
  if (!form.value.username.trim()) {
    uni.showToast({ title: '请输入用户名', icon: 'none' })
    return
  }
  if (!form.value.password.trim()) {
    uni.showToast({ title: '请输入密码', icon: 'none' })
    return
  }

  loading.value = true
  try {
    await userStore.login(form.value.username, form.value.password)

    // 记住密码
    if (form.value.remember) {
      uni.setStorageSync('remember_credentials', JSON.stringify({
        username: form.value.username,
        password: form.value.password
      }))
    } else {
      uni.removeStorageSync('remember_credentials')
    }

    uni.showToast({ title: '登录成功', icon: 'success' })
    setTimeout(() => {
      uni.switchTab({ url: '/pages/index/index' })
    }, 800)
  } catch (e) {
    uni.showToast({ title: e.message || '登录失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

function goRegister() {
  uni.navigateTo({ url: '/pages/register/register' })
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 48rpx;
}

.login-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 180rpx;
  margin-bottom: 60rpx;
}

.brand-icon {
  font-size: 80rpx;
  margin-bottom: 20rpx;
}

.brand-title {
  font-size: 44rpx;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 12rpx;
}

.brand-subtitle {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.7);
}

.login-form-card {
  width: 100%;
  background: #ffffff;
  border-radius: 24rpx;
  padding: 48rpx 40rpx;
  box-shadow: 0 16rpx 48rpx rgba(0, 0, 0, 0.15);
}

.form-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333333;
  margin-bottom: 40rpx;
  text-align: center;
  display: block;
}

.input-group {
  display: flex;
  align-items: center;
  background: #f5f7fa;
  border-radius: 16rpx;
  padding: 0 24rpx;
  height: 96rpx;
  margin-bottom: 24rpx;
}

.input-icon {
  font-size: 32rpx;
  margin-right: 16rpx;
}

.input-field {
  flex: 1;
  height: 96rpx;
  font-size: 30rpx;
  color: #333333;
}

.input-placeholder {
  color: #cccccc;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32rpx;
}

.remember-wrap {
  display: flex;
  align-items: center;
}

.checkbox {
  width: 36rpx;
  height: 36rpx;
  border: 2rpx solid #dcdfe6;
  border-radius: 6rpx;
  margin-right: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkbox.checked {
  background: #667eea;
  border-color: #667eea;
}

.check-mark {
  color: #ffffff;
  font-size: 22rpx;
  font-weight: 700;
}

.remember-text {
  font-size: 26rpx;
  color: #666666;
}

.btn-login {
  width: 100%;
  height: 96rpx;
  line-height: 96rpx;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #ffffff;
  font-size: 34rpx;
  font-weight: 500;
  border: none;
  border-radius: 16rpx;
  margin-bottom: 32rpx;
}

.btn-login::after {
  border: none;
}

.form-footer {
  display: flex;
  justify-content: center;
  align-items: center;
}

.footer-text {
  font-size: 26rpx;
  color: #999999;
}

.footer-link {
  font-size: 26rpx;
  color: #667eea;
  margin-left: 8rpx;
}

.demo-tip {
  margin-top: 40rpx;
  padding: 16rpx 32rpx;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 999rpx;
}

.demo-text {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
}
</style>
