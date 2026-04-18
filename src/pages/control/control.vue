<template>
  <view class="page-container">
    <!-- Tab 切换 -->
    <view class="tab-bar">
      <view v-for="(tab, idx) in tabs" :key="idx"
        class="tab-item" :class="{ active: currentTab === idx }"
        @click="currentTab = idx">
        <text>{{ tab }}</text>
      </view>
    </view>

    <!-- 空调控制 -->
    <view v-if="currentTab === 0" class="panel">
      <view class="section-card">
        <view class="flex-between" style="margin-bottom: 32rpx;">
          <text class="panel-title">空调控制</text>
          <switch :checked="acOn" color="#667eea" @change="toggleAC" />
        </view>

        <view class="control-group">
          <text class="control-label">工作模式</text>
          <view class="mode-grid">
            <view v-for="m in acModes" :key="m.value"
              class="mode-item" :class="{ selected: acMode === m.value }"
              @click="acMode = m.value">
              <text class="mode-icon">{{ m.icon }}</text>
              <text class="mode-text">{{ m.label }}</text>
            </view>
          </view>
        </view>

        <view class="control-group">
          <view class="flex-between">
            <text class="control-label">温度设置</text>
            <text class="temp-value">{{ acTemp }}°C</text>
          </view>
          <slider :value="acTemp" :min="16" :max="30" :step="1"
            activeColor="#667eea" block-size="20"
            @change="e => acTemp = e.detail.value" />
        </view>

        <view class="control-group">
          <text class="control-label">风速</text>
          <view class="mode-grid">
            <view v-for="s in fanSpeeds" :key="s.value"
              class="mode-item small" :class="{ selected: acFanSpeed === s.value }"
              @click="acFanSpeed = s.value">
              <text class="mode-text">{{ s.label }}</text>
            </view>
          </view>
        </view>

        <button class="btn-primary" style="margin-top: 24rpx;" @click="sendACControl">
          发送指令
        </button>
      </view>
    </view>

    <!-- 灌溉控制 -->
    <view v-if="currentTab === 1" class="panel">
      <view class="section-card">
        <text class="panel-title">灌溉控制</text>

        <view class="control-group">
          <text class="control-label">灌溉区域</text>
          <picker :range="zones" range-key="label" @change="e => irrigZone = zones[e.detail.value].value">
            <view class="form-picker">
              <text>{{ zones.find(z => z.value === irrigZone)?.label || '请选择区域' }}</text>
              <text class="picker-arrow">▸</text>
            </view>
          </picker>
        </view>

        <view class="control-group">
          <view class="flex-between">
            <text class="control-label">灌溉时长</text>
            <text class="temp-value">{{ irrigDuration }} 分钟</text>
          </view>
          <slider :value="irrigDuration" :min="1" :max="60" :step="1"
            activeColor="#67C23A" block-size="20"
            @change="e => irrigDuration = e.detail.value" />
        </view>

        <view class="control-group">
          <text class="control-label">当前土壤湿度</text>
          <progress :percent="soilMoisture" :stroke-width="12"
            :activeColor="moistureColor" border-radius="12" />
          <text class="moisture-text">{{ soilMoisture }}%</text>
        </view>

        <view class="flex-between" style="margin-top: 24rpx; gap: 16rpx;">
          <button class="btn-primary" style="flex: 1;" @click="startIrrigation">
            启动灌溉
          </button>
          <button class="btn-danger" style="flex: 1;" @click="stopIrrigation">
            停止灌溉
          </button>
        </view>
      </view>
    </view>

    <!-- 照明控制 -->
    <view v-if="currentTab === 2" class="panel">
      <view class="section-card">
        <view class="flex-between" style="margin-bottom: 24rpx;">
          <text class="panel-title">照明控制</text>
          <view class="flex-row">
            <text class="light-btn" @click="allLights(true)">全开</text>
            <text class="light-btn off" @click="allLights(false)">全关</text>
          </view>
        </view>

        <view class="light-grid">
          <view v-for="(light, idx) in lights" :key="idx" class="light-item">
            <view class="light-icon-wrap" :class="{ 'light-on': light.on }">
              <text class="light-icon">💡</text>
            </view>
            <text class="light-name">{{ light.name }}</text>
            <switch :checked="light.on" color="#667eea" @change="toggleLight(idx)" />
          </view>
        </view>
      </view>
    </view>

    <!-- 控制日志 -->
    <view class="section-card" style="margin-top: 24rpx;">
      <text class="section-title" style="margin-bottom: 16rpx;">控制历史</text>
      <view v-if="logs.length > 0">
        <view v-for="(log, idx) in logs" :key="idx" class="log-item">
          <view class="log-left">
            <text class="log-device">{{ log.deviceName || '设备' + log.deviceId }}</text>
            <text class="log-time">{{ log.createTime }}</text>
          </view>
          <view class="log-right">
            <text class="tag tag-success">{{ log.command }}</text>
          </view>
        </view>
      </view>
      <view v-else class="empty-text">暂无控制记录</view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import deviceApi from '@/api/device.js'
import controlApi from '@/api/control.js'
import irrigationApi from '@/api/irrigation.js'
import sensorApi from '@/api/sensor.js'
import { onShow } from '@dcloudio/uni-app'

const tabs = ['空调控制', '灌溉控制', '照明控制']
const currentTab = ref(0)

// 空调
const acOn = ref(false)
const acMode = ref('cool')
const acTemp = ref(26)
const acFanSpeed = ref('medium')
const acModes = [
  { label: '制冷', value: 'cool', icon: '❄️' },
  { label: '制热', value: 'heat', icon: '🔥' },
  { label: '自动', value: 'auto', icon: '🔄' },
  { label: '送风', value: 'fan', icon: '💨' }
]
const fanSpeeds = [
  { label: '低速', value: 'low' },
  { label: '中速', value: 'medium' },
  { label: '高速', value: 'high' },
  { label: '自动', value: 'auto' }
]

// 灌溉
const irrigZone = ref(1)
const irrigDuration = ref(10)
const soilMoisture = ref(50)
const zones = [
  { label: '菜地', value: 1 },
  { label: '花园', value: 2 },
  { label: '果树', value: 3 }
]

const moistureColor = computed(() => {
  const v = soilMoisture.value
  if (v < 20) return '#F56C6C'
  if (v < 40) return '#E6A23C'
  if (v < 60) return '#409EFF'
  return '#67C23A'
})

// 照明
const lights = ref([
  { name: '客厅灯', on: false },
  { name: '卧室灯', on: false },
  { name: '厨房灯', on: false },
  { name: '走廊灯', on: false },
  { name: '花园灯', on: false },
  { name: '门廊灯', on: false }
])

// 日志
const logs = ref([])

function toggleAC(e) {
  acOn.value = e.detail.value
}

function toggleLight(idx) {
  lights.value[idx].on = !lights.value[idx].on
}

function allLights(state) {
  lights.value.forEach(l => l.on = state)
}

async function sendACControl() {
  const command = acOn.value ? 'on' : 'off'
  const param = JSON.stringify({ mode: acMode.value, temp: acTemp.value, fanSpeed: acFanSpeed.value })
  try {
    // 假设空调设备 ID 为 6（风扇）
    await deviceApi.controlDevice(6, command, param)
    uni.showToast({ title: '指令已发送', icon: 'success' })
    loadLogs()
  } catch (e) {
    uni.showToast({ title: e.message || '发送失败', icon: 'none' })
  }
}

async function startIrrigation() {
  try {
    await irrigationApi.startIrrigation({
      zoneId: irrigZone.value,
      duration: irrigDuration.value * 60
    })
    uni.showToast({ title: '灌溉已启动', icon: 'success' })
    loadLogs()
  } catch (e) {
    uni.showToast({ title: e.message || '启动失败', icon: 'none' })
  }
}

async function stopIrrigation() {
  try {
    await irrigationApi.stopIrrigation(irrigZone.value)
    uni.showToast({ title: '灌溉已停止', icon: 'success' })
    loadLogs()
  } catch (e) {
    uni.showToast({ title: e.message || '停止失败', icon: 'none' })
  }
}

async function loadLogs() {
  try {
    const res = await controlApi.getControlLogs(null, null, 24)
    logs.value = (res.data || []).slice(0, 10)
  } catch (e) {}
}

async function loadSoilMoisture() {
  try {
    const res = await sensorApi.getLatestBySensorType('soil')
    if (res.data) soilMoisture.value = Number(res.data.value) || 50
  } catch (e) {}
}

onShow(() => {
  loadLogs()
  loadSoilMoisture()
})
</script>

<style scoped>
.tab-bar {
  display: flex;
  background: #ffffff;
  border-radius: 16rpx;
  margin-bottom: 24rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 24rpx 0;
  font-size: 28rpx;
  color: #666666;
  transition: all 0.2s;
}

.tab-item.active {
  color: #667eea;
  font-weight: 600;
  background: rgba(102, 126, 234, 0.05);
  border-bottom: 4rpx solid #667eea;
}

.panel-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
}

.control-group {
  margin-bottom: 32rpx;
}

.control-label {
  display: block;
  font-size: 26rpx;
  color: #666666;
  margin-bottom: 16rpx;
}

.temp-value {
  font-size: 32rpx;
  font-weight: 600;
  color: #667eea;
}

.mode-grid {
  display: flex;
  gap: 16rpx;
}

.mode-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx 0;
  background: #f5f7fa;
  border-radius: 12rpx;
  border: 2rpx solid transparent;
}

.mode-item.selected {
  background: rgba(102, 126, 234, 0.08);
  border-color: #667eea;
}

.mode-item.small {
  padding: 16rpx 0;
}

.mode-icon {
  font-size: 32rpx;
  margin-bottom: 8rpx;
}

.mode-text {
  font-size: 24rpx;
  color: #333333;
}

.form-picker {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f5f7fa;
  border-radius: 12rpx;
  padding: 0 24rpx;
  height: 80rpx;
  font-size: 28rpx;
}

.picker-arrow {
  color: #cccccc;
}

.moisture-text {
  display: block;
  text-align: right;
  font-size: 24rpx;
  color: #666666;
  margin-top: 8rpx;
}

.light-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.light-item {
  width: calc(50% - 8rpx);
  display: flex;
  align-items: center;
  background: #f5f7fa;
  border-radius: 12rpx;
  padding: 20rpx;
}

.light-icon-wrap {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  background: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12rpx;
}

.light-icon-wrap.light-on {
  background: #fef3cd;
}

.light-icon {
  font-size: 28rpx;
}

.light-name {
  flex: 1;
  font-size: 24rpx;
  color: #333333;
}

.light-btn {
  padding: 8rpx 20rpx;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  border-radius: 999rpx;
  font-size: 24rpx;
  margin-left: 12rpx;
}

.light-btn.off {
  background: rgba(245, 108, 108, 0.1);
  color: #F56C6C;
}

.log-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #f5f7fa;
}

.log-device {
  font-size: 28rpx;
  color: #333333;
  display: block;
}

.log-time {
  font-size: 22rpx;
  color: #999999;
  display: block;
  margin-top: 4rpx;
}

.empty-text {
  text-align: center;
  color: #999999;
  padding: 40rpx 0;
  font-size: 28rpx;
}
</style>
