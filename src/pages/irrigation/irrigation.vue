<template>
  <view class="page-container">
    <!-- 快速灌溉 -->
    <view class="section-card">
      <text class="section-title">快速灌溉</text>
      <view class="control-group">
        <text class="control-label">灌溉区域</text>
        <picker :range="zones" range-key="label" @change="e => form.zoneId = zones[e.detail.value].value">
          <view class="form-picker">
            <text>{{ zones.find(z => z.value === form.zoneId)?.label || '请选择' }}</text>
            <text class="picker-arrow">▸</text>
          </view>
        </picker>
      </view>
      <view class="control-group">
        <view class="flex-between">
          <text class="control-label">灌溉时长</text>
          <text class="value-text">{{ form.duration }} 分钟</text>
        </view>
        <slider :value="form.duration" :min="1" :max="60" :step="1"
          activeColor="#67C23A" block-size="20"
          @change="e => form.duration = e.detail.value" />
      </view>
      <view class="flex-between" style="gap: 16rpx;">
        <button class="btn-primary" style="flex: 1;" @click="startIrrigation">启动灌溉</button>
        <button class="btn-danger" style="flex: 1;" @click="stopIrrigation">停止灌溉</button>
      </view>
    </view>

    <!-- 灌溉统计 -->
    <view class="section-title">灌溉统计</view>
    <view class="stat-grid">
      <view class="stat-grid-item">
        <rs-stat-card icon="📊" :value="stats.totalCount || 0" label="总次数" bgColor="#f0f5ff" />
      </view>
      <view class="stat-grid-item">
        <rs-stat-card icon="⏱️" :value="formatDuration(stats.totalDuration)" label="总时长" bgColor="#fff7f0" />
      </view>
      <view class="stat-grid-item">
        <rs-stat-card icon="💧" :value="stats.totalWaterUsage || 0" label="总用水(L)" bgColor="#f0fff4" />
      </view>
      <view class="stat-grid-item">
        <rs-stat-card icon="📅" :value="stats.todayCount || 0" label="今日次数" bgColor="#fef0ff" />
      </view>
    </view>

    <!-- 时间范围筛选 -->
    <view class="time-tabs">
      <view v-for="(t, idx) in timeRanges" :key="idx"
        class="time-tab" :class="{ active: currentRange === idx }"
        @click="switchRange(idx)">
        <text>{{ t.label }}</text>
      </view>
    </view>

    <!-- 灌溉记录 -->
    <view class="section-title">灌溉记录</view>
    <view v-if="logs.length > 0">
      <view v-for="(log, idx) in logs" :key="idx" class="log-card">
        <view class="flex-between">
          <text class="log-zone">区域 {{ log.zoneId }}</text>
          <text class="tag" :class="modeClass(log.mode)">{{ modeLabel(log.mode) }}</text>
        </view>
        <view class="log-details">
          <text class="log-detail">时长: {{ (log.duration / 60).toFixed(0) }}分钟</text>
          <text class="log-detail">用水: {{ log.waterUsage || '--' }}L</text>
        </view>
        <view class="flex-between" style="margin-top: 8rpx;">
          <text class="log-time">{{ log.startTime }}</text>
          <text class="tag" :class="statusClass(log.status)">{{ statusLabel(log.status) }}</text>
        </view>
      </view>
    </view>
    <rs-empty v-else text="暂无灌溉记录" />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import irrigationApi from '@/api/irrigation.js'
import { onShow, onPullDownRefresh } from '@dcloudio/uni-app'

const zones = [
  { label: '菜地', value: 1 },
  { label: '花园', value: 2 },
  { label: '果树', value: 3 }
]

const timeRanges = [
  { label: '7天', days: 7 },
  { label: '30天', days: 30 },
  { label: '90天', days: 90 }
]
const currentRange = ref(0)

const form = ref({ zoneId: 1, duration: 10 })
const stats = ref({})
const logs = ref([])

function formatDuration(seconds) {
  if (!seconds) return '0'
  return (seconds / 60).toFixed(0)
}

function modeLabel(mode) {
  const map = { manual: '手动', auto: '自动', scheduled: '定时' }
  return map[mode] || mode
}
function modeClass(mode) {
  const map = { manual: 'tag-primary', auto: 'tag-success', scheduled: 'tag-warning' }
  return map[mode] || 'tag-info'
}
function statusLabel(status) {
  const map = { completed: '已完成', running: '进行中', failed: '失败', stopped: '已停止' }
  return map[status] || status
}
function statusClass(status) {
  const map = { completed: 'tag-success', running: 'tag-primary', failed: 'tag-danger', stopped: 'tag-info' }
  return map[status] || 'tag-info'
}

async function loadData() {
  const days = timeRanges[currentRange.value].days
  try {
    const [statsRes, logsRes] = await Promise.all([
      irrigationApi.getIrrigationStatistics(days).catch(() => null),
      irrigationApi.getIrrigationLogs(null, null, days).catch(() => null)
    ])
    if (statsRes?.data) stats.value = statsRes.data
    if (logsRes?.data) logs.value = logsRes.data
  } catch (e) {}
}

function switchRange(idx) {
  currentRange.value = idx
  loadData()
}

async function startIrrigation() {
  try {
    await irrigationApi.startIrrigation({
      zoneId: form.value.zoneId,
      duration: form.value.duration * 60
    })
    uni.showToast({ title: '灌溉已启动', icon: 'success' })
    loadData()
  } catch (e) {
    uni.showToast({ title: e.message || '启动失败', icon: 'none' })
  }
}

async function stopIrrigation() {
  try {
    await irrigationApi.stopIrrigation(form.value.zoneId)
    uni.showToast({ title: '灌溉已停止', icon: 'success' })
    loadData()
  } catch (e) {
    uni.showToast({ title: e.message || '停止失败', icon: 'none' })
  }
}

onShow(() => { loadData() })
onPullDownRefresh(() => { loadData().finally(() => uni.stopPullDownRefresh()) })
</script>

<style scoped>
.control-group { margin-bottom: 24rpx; }
.control-label { display: block; font-size: 26rpx; color: #666666; margin-bottom: 12rpx; }
.value-text { font-size: 30rpx; font-weight: 600; color: #67C23A; }
.form-picker { display: flex; justify-content: space-between; align-items: center; background: #f5f7fa; border-radius: 12rpx; padding: 0 24rpx; height: 80rpx; font-size: 28rpx; }
.picker-arrow { color: #cccccc; }

.time-tabs { display: flex; background: #fff; border-radius: 16rpx; margin-bottom: 24rpx; overflow: hidden; box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04); }
.time-tab { flex: 1; text-align: center; padding: 20rpx 0; font-size: 26rpx; color: #666; }
.time-tab.active { color: #667eea; font-weight: 600; background: rgba(102,126,234,0.05); border-bottom: 4rpx solid #667eea; }

.log-card { background: #fff; border-radius: 16rpx; padding: 24rpx; margin-bottom: 16rpx; box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04); }
.log-zone { font-size: 30rpx; font-weight: 500; color: #333; }
.log-details { display: flex; gap: 24rpx; margin-top: 12rpx; }
.log-detail { font-size: 24rpx; color: #666; }
.log-time { font-size: 22rpx; color: #999; }
</style>
