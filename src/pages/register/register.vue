<template>
  <view class="register-page">
    <view class="register-header">
      <view class="brand-icon">🏡</view>
      <text class="brand-title">注册账号</text>
    </view>

    <view class="register-form-card">
      <view class="input-group">
        <text class="input-icon">👤</text>
        <input v-model="form.username" class="input-field" placeholder="请输入用户名 (3-20位)" placeholder-class="input-placeholder" maxlength="20" />
      </view>

      <view class="input-group">
        <text class="input-icon">🔒</text>
        <input v-model="form.password" class="input-field" type="password" placeholder="请输入密码 (6-20位)" placeholder-class="input-placeholder" maxlength="20" />
      </view>

      <view class="input-group">
        <text class="input-icon">🔒</text>
        <input v-model="form.confirmPassword" class="input-field" type="password" placeholder="请确认密码" placeholder-class="input-placeholder" maxlength="20" />
      </view>

      <button class="btn-register" :loading="loading" @click="handleRegister">注 册</button>

      <view class="form-footer">
        <text class="footer-text">已有账号？</text>
        <text class="footer-link" @click="goBack">返回登录</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import authApi from '@/api/auth.js'

const loading = ref(false)
const form = ref({ username: '', password: '', confirmPassword: '' })

async function handleRegister() {
  if (!form.value.username || form.value.username.length < 3) {
    uni.showToast({ title: '用户名至少3位', icon: 'none' }); return
  }
  if (!form.value.password || form.value.password.length < 6) {
    uni.showToast({ title: '密码至少6位', icon: 'none' }); return
  }
  if (form.value.password !== form.value.confirmPassword) {
    uni.showToast({ title: '两次密码不一致', icon: 'none' }); return
  }
  loading.value = true
  try {
    await authApi.register({ username: form.value.username, password: form.value.password })
    uni.showToast({ title: '注册成功', icon: 'success' })
    setTimeout(() => uni.navigateBack(), 1000)
  } catch (e) {
    uni.showToast({ title: e.message || '注册失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

function goBack() {
  uni.navigateBack()
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 48rpx;
}

.register-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 180rpx;
  margin-bottom: 60rpx;
}

.brand-icon { font-size: 80rpx; margin-bottom: 20rpx; }
.brand-title { font-size: 44rpx; font-weight: 700; color: #ffffff; }

.register-form-card {
  width: 100%;
  background: #ffffff;
  border-radius: 24rpx;
  padding: 48rpx 40rpx;
  box-shadow: 0 16rpx 48rpx rgba(0, 0, 0, 0.15);
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

.input-icon { font-size: 32rpx; margin-right: 16rpx; }
.input-field { flex: 1; height: 96rpx; font-size: 30rpx; color: #333333; }
.input-placeholder { color: #cccccc; }

.btn-register {
  width: 100%;
  height: 96rpx;
  line-height: 96rpx;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #ffffff;
  font-size: 34rpx;
  font-weight: 500;
  border: none;
  border-radius: 16rpx;
  margin-top: 16rpx;
  margin-bottom: 32rpx;
}
.btn-register::after { border: none; }

.form-footer { display: flex; justify-content: center; align-items: center; }
.footer-text { font-size: 26rpx; color: #999999; }
.footer-link { font-size: 26rpx; color: #667eea; margin-left: 8rpx; }
</style>
