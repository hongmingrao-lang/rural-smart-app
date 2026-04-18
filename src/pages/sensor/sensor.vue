<template>
  <view class="page-container">
    <!-- 时间范围选择 -->
    <view class="time-tabs">
      <view v-for="(t, idx) in timeRanges" :key="idx"
        class="time-tab" :class="{ active: currentRange === idx }"
        @click="switchRange(idx)">
        <text>{{ t.label }}</text>
      </view>
    </view>

    <!-- 实时数据卡片 -->
    <view class="sensor-cards">
      <rs-sensor-card title="温度" icon="🌡️" :value="latestTemp" unit="°C"
        color="#e74c3c" :time="latestTempTime" />
      <rs-sensor-card title="湿度" icon="💧" :value="latestHumidity" unit="%"
        color="#3498db" :time="latestHumidityTime" style="margin-top: 16rpx;" />
      <rs-sensor-card title="土壤湿度" icon="🌱" :value="latestSoil" unit="%"
        color="#8e44ad" :time="latestSoilTime" style="margin-top: 16rpx;" />
    </view>

    <!-- 温度图表 -->
    <view class="section-card" style="margin-top: 24rpx;">
      <text class="chart-title">温度变化趋势</text>
      <view class="chart-area">
        <view v-if="tempData.length > 0" class="simple-chart">
          <view class="chart-bars">
            <view v-for="(item, idx) in tempChartDisplay" :key="idx" class="chart-bar-wrap">
              <view class="chart-bar" :style="{ height: item.height + 'rpx', background: '#e74c3c' }"></view>
              <text class="chart-bar-label">{{ item.label }}</text>
            </view>
          </view>
          <view class="chart-range">
            <text class="chart-min">{{ tempMin }}°C</text>
            <text class="chart-max">{{ tempMax }}°C</text>
          </view>
        </view>
        <view v-else class="chart-empty">暂无数据</view>
      </view>
    </view>

    <!-- 湿度图表 -->
    <view class="section-card">
      <text class="chart-title">湿度变化趋势</text>
      <view class="chart-area">
        <view v-if="humidityData.length > 0" class="simple-chart">
          <view class="chart-bars">
            <view v-for="(item, idx) in humidityChartDisplay" :key="idx" class="chart-bar-wrap">
              <view class="chart-bar" :style="{ height: item.height + 'rpx', background: '#3498db' }"></view>
              <text class="chart-bar-label">{{ item.label }}</text>
            </view>
          </view>
          <view class="chart-range">
            <text class="chart-min">{{ humidityMin }}%</text>
            <text class="chart-max">{{ humidityMax }}%</text>
          </view>
        </view>
        <view v-else class="chart-empty">暂无数据</view>
      </view>
    </view>

    <!-- 统计数据 -->
    <view class="section-card">
      <text class="chart-title">数据统计</text>
      <view v-if="statistics">
        <view v-for="(stat, key) in statistics" :key="key" class="stat-row">
          <text class="stat-label">{{ getSensorLabel(key) }}</text>
          <view class="stat-values">
            <text class="stat-detail">均值: {{ toFixed(stat.average) }}</text>
            <text class="stat-detail">最高: {{ toFixed(stat.max) }}</text>
            <text class="stat-detail">最低: {{ toFixed(stat.min) }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import sensorApi from '@/api/sensor.js'
import { getSensorTypeLabel, toFixed } from '@/utils/format.js'
import { onShow, onPullDownRefresh } from '@dcloudio/uni-app'

const timeRanges = [
  { label: '1小时', hours: 1 },
  { label: '6小时', hours: 6 },
  { label: '24小时', hours: 24 },
  { label: '7天', hours: 168 }
]
const currentRange = ref(2)

const latestTemp = ref(null)
const latestHumidity = ref(null)
const latestSoil = ref(null)
const latestTempTime = ref('')
const latestHumidityTime = ref('')
const latestSoilTime = ref('')

const tempData = ref([])
const humidityData = ref([])
const statistics = ref(null)

function getSensorLabel(key) {
  return getSensorTypeLabel(key)
}

function computeChartDisplay(data, maxHeight = 200) {
  if (!data.length) return []
  const values = data.map(d => d.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  // 最多显示12个数据点
  const step = Math.max(1, Math.floor(data.length / 12))
  const sampled = data.filter((_, i) => i % step === 0).slice(-12)
  return sampled.map(d => {
    const h = ((d.value - min) / range) * maxHeight + 20
    const t = new Date(d.createTime)
    return {
      height: h,
      label: `${String(t.getHours()).padStart(2, '0')}:${String(t.getMinutes()).padStart(2, '0')}`,
      value: d.value
    }
  })
}

const tempChartDisplay = computed(() => computeChartDisplay(tempData.value))
const humidityChartDisplay = computed(() => computeChartDisplay(humidityData.value))

const tempMin = computed(() => tempData.value.length ? toFixed(Math.min(...tempData.value.map(d => d.value))) : '--')
const tempMax = computed(() => tempData.value.length ? toFixed(Math.max(...tempData.value.map(d => d.value))) : '--')
const humidityMin = computed(() => humidityData.value.length ? toFixed(Math.min(...humidityData.value.map(d => d.value))) : '--')
const humidityMax = computed(() => humidityData.value.length ? toFixed(Math.max(...humidityData.value.map(d => d.value))) : '--')

async function loadData() {
  const hours = timeRanges[currentRange.value].hours
  try {
    const [latestRes, tempRes, humidRes, statsRes] = await Promise.all([
      sensorApi.getLatestData().catch(() => null),
      sensorApi.getSensorData('temperature', hours).catch(() => null),
      sensorApi.getSensorData('humidity', hours).catch(() => null),
      sensorApi.getSensorStatistics(hours).catch(() => null)
    ])

    if (latestRes?.data) {
      latestRes.data.forEach(item => {
        const time = item.createTime || ''
        if (item.sensorType === 'temperature') { latestTemp.value = item.value; latestTempTime.value = time }
        if (item.sensorType === 'humidity') { latestHumidity.value = item.value; latestHumidityTime.value = time }
        if (item.sensorType === 'soil') { latestSoil.value = item.value; latestSoilTime.value = time }
      })
    }

    if (tempRes?.data) tempData.value = tempRes.data
    if (humidRes?.data) humidityData.value = humidRes.data
    if (statsRes?.data) statistics.value = statsRes.data
  } catch (e) {
    console.error('加载传感器数据失败', e)
  }
}

function switchRange(idx) {
  currentRange.value = idx
  loadData()
}

onShow(() => { loadData() })
onPullDownRefresh(() => { loadData().finally(() => uni.stopPullDownRefresh()) })
</script>

<style scoped>
.time-tabs {
  display: flex;
  background: #ffffff;
  border-radius: 16rpx;
  margin-bottom: 24rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.time-tab {
  flex: 1;
  text-align: center;
  padding: 20rpx 0;
  font-size: 26rpx;
  color: #666666;
}

.time-tab.active {
  color: #667eea;
  font-weight: 600;
  background: rgba(102, 126, 234, 0.05);
  border-bottom: 4rpx solid #667eea;
}

.chart-title {
  display: block;
  font-size: 30rpx;
  font-weight: 600;
  color: #333333;
  margin-bottom: 20rpx;
}

.chart-area {
  min-height: 300rpx;
}

.simple-chart {
  padding: 16rpx 0;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  height: 260rpx;
  gap: 4rpx;
}

.chart-bar-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
}

.chart-bar {
  width: 100%;
  max-width: 40rpx;
  border-radius: 4rpx 4rpx 0 0;
  opacity: 0.8;
}

.chart-bar-label {
  font-size: 16rpx;
  color: #999999;
  margin-top: 8rpx;
  transform: rotate(-45deg);
  white-space: nowrap;
}

.chart-range {
  display: flex;
  justify-content: space-between;
  margin-top: 12rpx;
}

.chart-min, .chart-max {
  font-size: 22rpx;
  color: #999999;
}

.chart-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200rpx;
  color: #cccccc;
  font-size: 28rpx;
}

.stat-row {
  padding: 16rpx 0;
  border-bottom: 1rpx solid #f5f7fa;
}

.stat-row:last-child { border-bottom: none; }

.stat-label {
  font-size: 28rpx;
  font-weight: 500;
  color: #333333;
  display: block;
  margin-bottom: 8rpx;
}

.stat-values {
  display: flex;
  gap: 24rpx;
}

.stat-detail {
  font-size: 24rpx;
  color: #666666;
}
</style>
