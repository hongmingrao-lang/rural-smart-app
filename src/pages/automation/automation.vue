<template>
  <view class="page-container">
    <!-- 统计卡片 -->
    <view class="stat-grid">
      <view class="stat-grid-item">
        <rs-stat-card icon="📋" :value="ruleStats.totalRules || 0" label="总规则数" bgColor="#f0f5ff" />
      </view>
      <view class="stat-grid-item">
        <rs-stat-card icon="✅" :value="ruleStats.enabledRules || 0" label="已启用" bgColor="#f0fff4" />
      </view>
      <view class="stat-grid-item">
        <rs-stat-card icon="⚡" :value="ruleStats.totalTriggers || 0" label="触发次数" bgColor="#fff7f0" />
      </view>
      <view class="stat-grid-item">
        <rs-stat-card icon="📅" :value="ruleStats.todayTriggers || 0" label="今日触发" bgColor="#fef0ff" />
      </view>
    </view>

    <!-- 规则列表 -->
    <view class="section-title">自动化规则</view>
    <view v-if="rules.length > 0">
      <view v-for="rule in rules" :key="rule.id" class="rule-card" @click="editRule(rule)">
        <view class="flex-between">
          <text class="rule-name">{{ rule.name }}</text>
          <switch :checked="rule.enabled" color="#667eea"
            @change="toggleRule(rule, $event)" />
        </view>
        <text class="rule-desc">{{ rule.description }}</text>
        <view class="rule-tags">
          <text class="tag tag-primary">{{ conditionLabel(rule.conditionType) }}</text>
          <text class="tag tag-warning">{{ actionLabel(rule.actionType) }}</text>
          <text v-if="rule.triggerCount" class="rule-trigger">已触发 {{ rule.triggerCount }} 次</text>
        </view>
      </view>
    </view>
    <rs-empty v-else text="暂无自动化规则" :showAction="true" actionText="添加规则" @action="addRule" />

    <!-- 浮动添加按钮 -->
    <view class="float-btn" @click="addRule">
      <text>+</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import automationApi from '@/api/automation.js'
import { onShow, onPullDownRefresh } from '@dcloudio/uni-app'

const rules = ref([])
const ruleStats = ref({})

function conditionLabel(type) {
  const map = { sensor: '传感器', time: '定时', compound: '组合' }
  return map[type] || type
}

function actionLabel(type) {
  const map = { device_control: '设备控制', irrigation: '灌溉', notification: '通知' }
  return map[type] || type
}

async function loadData() {
  try {
    const [rulesRes, statsRes] = await Promise.all([
      automationApi.getRules().catch(() => null),
      automationApi.getRuleStatistics().catch(() => null)
    ])
    if (rulesRes?.data) rules.value = rulesRes.data
    if (statsRes?.data) ruleStats.value = statsRes.data
  } catch (e) {}
}

async function toggleRule(rule, e) {
  // 阻止冒泡
  const enabled = e.detail.value
  try {
    await automationApi.updateRule(rule.id, { ...rule, enabled })
    rule.enabled = enabled
    uni.showToast({ title: enabled ? '已启用' : '已禁用', icon: 'success' })
  } catch (err) {
    uni.showToast({ title: '操作失败', icon: 'none' })
    loadData()
  }
}

function addRule() {
  uni.navigateTo({ url: '/pages/automation/automation-edit' })
}

function editRule(rule) {
  uni.navigateTo({ url: `/pages/automation/automation-edit?id=${rule.id}` })
}

onShow(() => { loadData() })
onPullDownRefresh(() => { loadData().finally(() => uni.stopPullDownRefresh()) })
</script>

<style scoped>
.rule-card {
  background: #ffffff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.rule-name {
  font-size: 32rpx;
  font-weight: 500;
  color: #333333;
}

.rule-desc {
  display: block;
  font-size: 26rpx;
  color: #666666;
  margin: 12rpx 0;
}

.rule-tags {
  display: flex;
  align-items: center;
  gap: 12rpx;
  flex-wrap: wrap;
}

.rule-trigger {
  font-size: 22rpx;
  color: #999999;
}
</style>
