/**
 * 格式化工具函数
 */

/**
 * 格式化时间为可读字符串
 */
export function formatTime(dateStr) {
  if (!dateStr) return '--'
  const date = new Date(dateStr)
  const pad = n => String(n).padStart(2, '0')
  return `${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

/**
 * 格式化日期为 YYYY-MM-DD
 */
export function formatDate(dateStr) {
  if (!dateStr) return '--'
  const date = new Date(dateStr)
  const pad = n => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

/**
 * 数值保留小数位
 */
export function toFixed(value, digits = 1) {
  if (value === null || value === undefined) return '--'
  return Number(value).toFixed(digits)
}

/**
 * 设备类型映射
 */
export function getDeviceTypeLabel(type) {
  const map = { sensor: '传感器', actuator: '执行器' }
  return map[type] || type
}

/**
 * 传感器类型映射
 */
export function getSensorTypeLabel(type) {
  const map = {
    temperature: '温度',
    humidity: '湿度',
    soil: '土壤湿度',
    water_level: '水位'
  }
  return map[type] || type
}

/**
 * 位置映射
 */
export function getLocationLabel(location) {
  const map = {
    garden: '菜地',
    living_room: '客厅',
    bedroom: '卧室',
    kitchen: '厨房'
  }
  return map[location] || location
}

/**
 * 传感器单位映射
 */
export function getSensorUnit(type) {
  const map = {
    temperature: '°C',
    humidity: '%',
    soil: '%',
    water_level: 'cm'
  }
  return map[type] || ''
}
