<template>
  <view class="page-container">
    <view class="section-card">
      <!-- 规则名称 -->
      <view class="form-item">
        <text class="form-label">规则名称</text>
        <input v-model="form.name" class="form-input" placeholder="请输入规则名称" />
      </view>

      <!-- 规则描述 -->
      <view class="form-item">
        <text class="form-label">规则描述</text>
        <textarea v-model="form.description" class="form-textarea" placeholder="请输入规则描述" />
      </view>

      <!-- 条件类型 -->
      <view class="form-item">
        <text class="form-label">条件类型</text>
        <picker :range="conditionTypes" range-key="label" @change="onConditionTypeChange">
          <view class="form-picker">
            <text :class="form.conditionType ? '' : 'placeholder'">
              {{ conditionTypes.find(t => t.value === form.conditionType)?.label || '请选择条件类型' }}
            </text>
            <text class="picker-arrow">▸</text>
          </view>
        </picker>
      </view>

      <!-- 传感器条件配置 -->
      <view v-if="form.conditionType === 'sensor'" class="condition-config">
        <view class="form-item">
          <text class="form-label">传感器类型</text>
          <picker :range="sensorTypes" range-key="label" @change="e => condition.sensorType = sensorTypes[e.detail.value].value">
            <view class="form-picker">
              <text>{{ sensorTypes.find(t => t.value === condition.sensorType)?.label || '请选择' }}</text>
              <text class="picker-arrow">▸</text>
            </view>
          </picker>
        </view>

        <view class="form-item">
          <text class="form-label">比较条件</text>
          <picker :range="operators" range-key="label" @change="e => condition.operator = operators[e.detail.value].value">
            <view class="form-picker">
              <text>{{ operators.find(t => t.value === condition.operator)?.label || '请选择' }}</text>
              <text class="picker-arrow">▸</text>
            </view>
          </picker>
        </view>

        <view class="form-item">
          <text class="form-label">阈值</text>
          <input v-model="condition.threshold" class="form-input" type="digit" placeholder="请输入阈值" />
        </view>
      </view>

      <!-- 动作类型 -->
      <view class="form-item">
        <text class="form-label">动作类型</text>
        <picker :range="actionTypes" range-key="label" @change="onActionTypeChange">
          <view class="form-picker">
            <text :class="form.actionType ? '' : 'placeholder'">
              {{ actionTypes.find(t => t.value === form.actionType)?.label || '请选择动作类型' }}
            </text>
            <text class="picker-arrow">▸</text>
          </view>
        </picker>
      </view>

      <!-- 设备控制动作配置 -->
      <view v-if="form.actionType === 'device_control'" class="action-config">
        <view class="form-item">
          <text class="form-label">控制设备ID</text>
          <input v-model="action.deviceId" class="form-input" type="number" placeholder="请输入设备ID" />
        </view>
        <view class="form-item">
          <text class="form-label">控制指令</text>
          <picker :range="commands" range-key="label" @change="e => action.command = commands[e.detail.value].value">
            <view class="form-picker">
              <text>{{ commands.find(t => t.value === action.command)?.label || '请选择' }}</text>
              <text class="picker-arrow">▸</text>
            </view>
          </picker>
        </view>
      </view>

      <!-- 灌溉动作配置 -->
      <view v-if="form.actionType === 'irrigation'" class="action-config">
        <view class="form-item">
          <text class="form-label">灌溉区域ID</text>
          <input v-model="action.zoneId" class="form-input" type="number" placeholder="请输入区域ID" />
        </view>
        <view class="form-item">
          <text class="form-label">灌溉时长(秒)</text>
          <input v-model="action.duration" class="form-input" type="number" placeholder="请输入灌溉时长" />
        </view>
      </view>

      <!-- 启用开关 -->
      <view class="form-item">
        <view class="flex-between">
          <text class="form-label" style="margin-bottom: 0;">启用规则</text>
          <switch :checked="form.enabled" color="#667eea" @change="e => form.enabled = e.detail.value" />
        </view>
      </view>
    </view>

    <button class="btn-primary" style="margin-top: 32rpx;" :loading="loading" @click="handleSubmit">
      {{ isEdit ? '保存修改' : '创建规则' }}
    </button>

    <button v-if="isEdit" class="btn-danger" style="margin-top: 24rpx;" @click="handleDelete">
      删除规则
    </button>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import automationApi from '@/api/automation.js'
import { onLoad } from '@dcloudio/uni-app'

const loading = ref(false)
const isEdit = ref(false)
const editId = ref(null)

const form = ref({
  name: '',
  description: '',
  conditionType: 'sensor',
  actionType: 'device_control',
  enabled: true
})

const condition = ref({ sensorType: 'temperature', operator: '>', threshold: '' })
const action = ref({ deviceId: '', command: 'on', zoneId: '', duration: '' })

const conditionTypes = [
  { label: '传感器数值', value: 'sensor' },
  { label: '定时任务', value: 'time' },
  { label: '组合条件', value: 'compound' }
]

const sensorTypes = [
  { label: '温度', value: 'temperature' },
  { label: '湿度', value: 'humidity' },
  { label: '土壤湿度', value: 'soil' }
]

const operators = [
  { label: '大于 (>)', value: '>' },
  { label: '小于 (<)', value: '<' },
  { label: '等于 (=)', value: '=' },
  { label: '大于等于 (>=)', value: '>=' },
  { label: '小于等于 (<=)', value: '<=' }
]

const actionTypes = [
  { label: '设备控制', value: 'device_control' },
  { label: '灌溉', value: 'irrigation' },
  { label: '通知', value: 'notification' }
]

const commands = [
  { label: '打开', value: 'on' },
  { label: '关闭', value: 'off' }
]

function onConditionTypeChange(e) {
  form.value.conditionType = conditionTypes[e.detail.value].value
}

function onActionTypeChange(e) {
  form.value.actionType = actionTypes[e.detail.value].value
}

async function loadRule(id) {
  try {
    const res = await automationApi.getRule(id)
    if (res.data) {
      const rule = res.data
      form.value.name = rule.name
      form.value.description = rule.description
      form.value.conditionType = rule.conditionType
      form.value.actionType = rule.actionType
      form.value.enabled = rule.enabled

      if (rule.conditionConfig) {
        try { Object.assign(condition.value, JSON.parse(rule.conditionConfig)) } catch (e) {}
      }
      if (rule.actionConfig) {
        try { Object.assign(action.value, JSON.parse(rule.actionConfig)) } catch (e) {}
      }
    }
  } catch (e) {
    uni.showToast({ title: '加载规则失败', icon: 'none' })
  }
}

async function handleSubmit() {
  if (!form.value.name.trim()) {
    uni.showToast({ title: '请输入规则名称', icon: 'none' }); return
  }

  const data = {
    ...form.value,
    conditionConfig: JSON.stringify(condition.value),
    actionConfig: JSON.stringify(action.value)
  }

  loading.value = true
  try {
    if (isEdit.value) {
      await automationApi.updateRule(editId.value, data)
      uni.showToast({ title: '修改成功', icon: 'success' })
    } else {
      await automationApi.createRule(data)
      uni.showToast({ title: '创建成功', icon: 'success' })
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
    content: '确定要删除该规则吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await automationApi.deleteRule(editId.value)
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
    uni.setNavigationBarTitle({ title: '编辑规则' })
    loadRule(editId.value)
  }
})
</script>

<style scoped>
.form-item { margin-bottom: 28rpx; }
.form-label { display: block; font-size: 28rpx; color: #333; font-weight: 500; margin-bottom: 12rpx; }
.form-input { background: #f5f7fa; border-radius: 12rpx; padding: 0 24rpx; height: 88rpx; font-size: 28rpx; color: #333; }
.form-textarea { background: #f5f7fa; border-radius: 12rpx; padding: 20rpx 24rpx; font-size: 28rpx; color: #333; width: 100%; height: 160rpx; box-sizing: border-box; }
.form-picker { display: flex; justify-content: space-between; align-items: center; background: #f5f7fa; border-radius: 12rpx; padding: 0 24rpx; height: 88rpx; font-size: 28rpx; color: #333; }
.placeholder { color: #ccc; }
.picker-arrow { color: #ccc; font-size: 24rpx; }
.condition-config, .action-config { background: #fafbfc; border-radius: 12rpx; padding: 20rpx; margin-bottom: 20rpx; }
</style>
