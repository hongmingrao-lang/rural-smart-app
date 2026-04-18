<template>
  <view class="page-container">
    <view class="section-card">
      <!-- 设备名称 -->
      <view class="form-item">
        <text class="form-label">设备名称</text>
        <input v-model="form.name" class="form-input" placeholder="请输入设备名称" />
      </view>

      <!-- 设备类型 -->
      <view class="form-item">
        <text class="form-label">设备类型</text>
        <picker :range="deviceTypes" range-key="label" @change="onTypeChange">
          <view class="form-picker">
            <text :class="form.deviceType ? '' : 'placeholder'">
              {{ currentTypeLabel || '请选择设备类型' }}
            </text>
            <text class="picker-arrow">▸</text>
          </view>
        </picker>
      </view>

      <!-- 传感器类型（仅传感器显示） -->
      <view v-if="form.deviceType === 'sensor'" class="form-item">
        <text class="form-label">传感器类型</text>
        <picker :range="sensorTypes" range-key="label" @change="onSensorTypeChange">
          <view class="form-picker">
            <text :class="form.sensorType ? '' : 'placeholder'">
              {{ currentSensorLabel || '请选择传感器类型' }}
            </text>
            <text class="picker-arrow">▸</text>
          </view>
        </picker>
      </view>

      <!-- 位置 -->
      <view class="form-item">
        <text class="form-label">设备位置</text>
        <picker :range="locations" range-key="label" @change="onLocationChange">
          <view class="form-picker">
            <text :class="form.location ? '' : 'placeholder'">
              {{ currentLocationLabel || '请选择位置' }}
            </text>
            <text class="picker-arrow">▸</text>
          </view>
        </picker>
      </view>

      <!-- MQTT主题 -->
      <view class="form-item">
        <text class="form-label">MQTT主题</text>
        <input v-model="form.mqttTopic" class="form-input" placeholder="可选，如 device/data" />
      </view>
    </view>

    <!-- 操作按钮 -->
    <button class="btn-primary" style="margin-top: 32rpx;" :loading="loading" @click="handleSubmit">
      {{ isEdit ? '保存修改' : '添加设备' }}
    </button>

    <button v-if="isEdit" class="btn-danger" style="margin-top: 24rpx;" @click="handleDelete">
      删除设备
    </button>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import deviceApi from '@/api/device.js'
import { onLoad } from '@dcloudio/uni-app'

const loading = ref(false)
const isEdit = ref(false)
const editId = ref(null)

const form = ref({
  name: '',
  deviceType: '',
  sensorType: '',
  location: '',
  mqttTopic: ''
})

const deviceTypes = [
  { label: '传感器', value: 'sensor' },
  { label: '执行器', value: 'actuator' }
]

const sensorTypes = [
  { label: '温度', value: 'temperature' },
  { label: '湿度', value: 'humidity' },
  { label: '土壤湿度', value: 'soil' },
  { label: '水位', value: 'water_level' }
]

const locations = [
  { label: '菜地', value: 'garden' },
  { label: '客厅', value: 'living_room' },
  { label: '卧室', value: 'bedroom' },
  { label: '厨房', value: 'kitchen' }
]

const currentTypeLabel = computed(() => deviceTypes.find(t => t.value === form.value.deviceType)?.label || '')
const currentSensorLabel = computed(() => sensorTypes.find(t => t.value === form.value.sensorType)?.label || '')
const currentLocationLabel = computed(() => locations.find(t => t.value === form.value.location)?.label || '')

function onTypeChange(e) {
  form.value.deviceType = deviceTypes[e.detail.value].value
}
function onSensorTypeChange(e) {
  form.value.sensorType = sensorTypes[e.detail.value].value
}
function onLocationChange(e) {
  form.value.location = locations[e.detail.value].value
}

async function loadDevice(id) {
  try {
    const res = await deviceApi.getDevice(id)
    if (res.data) {
      form.value.name = res.data.name
      form.value.deviceType = res.data.deviceType
      form.value.sensorType = res.data.sensorType || ''
      form.value.location = res.data.location
      form.value.mqttTopic = res.data.mqttTopic || ''
    }
  } catch (e) {
    uni.showToast({ title: '加载设备信息失败', icon: 'none' })
  }
}

async function handleSubmit() {
  if (!form.value.name.trim()) {
    uni.showToast({ title: '请输入设备名称', icon: 'none' }); return
  }
  if (!form.value.deviceType) {
    uni.showToast({ title: '请选择设备类型', icon: 'none' }); return
  }
  if (!form.value.location) {
    uni.showToast({ title: '请选择设备位置', icon: 'none' }); return
  }

  loading.value = true
  try {
    if (isEdit.value) {
      await deviceApi.updateDevice(editId.value, form.value)
      uni.showToast({ title: '修改成功', icon: 'success' })
    } else {
      await deviceApi.addDevice(form.value)
      uni.showToast({ title: '添加成功', icon: 'success' })
    }
    setTimeout(() => uni.navigateBack(), 800)
  } catch (e) {
    uni.showToast({ title: e.message || '操作失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

async function handleDelete() {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除该设备吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await deviceApi.deleteDevice(editId.value)
          uni.showToast({ title: '删除成功', icon: 'success' })
          setTimeout(() => uni.navigateBack(), 800)
        } catch (e) {
          uni.showToast({ title: '删除失败', icon: 'none' })
        }
      }
    }
  })
}

onLoad((options) => {
  if (options.id) {
    isEdit.value = true
    editId.value = parseInt(options.id)
    uni.setNavigationBarTitle({ title: '编辑设备' })
    loadDevice(editId.value)
  }
})
</script>

<style scoped>
.form-item {
  margin-bottom: 32rpx;
}

.form-label {
  display: block;
  font-size: 28rpx;
  color: #333333;
  font-weight: 500;
  margin-bottom: 12rpx;
}

.form-input {
  background: #f5f7fa;
  border-radius: 12rpx;
  padding: 0 24rpx;
  height: 88rpx;
  font-size: 28rpx;
  color: #333333;
}

.form-picker {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f5f7fa;
  border-radius: 12rpx;
  padding: 0 24rpx;
  height: 88rpx;
  font-size: 28rpx;
  color: #333333;
}

.placeholder {
  color: #cccccc;
}

.picker-arrow {
  color: #cccccc;
  font-size: 24rpx;
}
</style>
