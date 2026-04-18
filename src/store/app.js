import { defineStore } from 'pinia'

const DEFAULT_SERVER = 'http://localhost:8080'

export const useAppStore = defineStore('app', {
  state: () => ({
    serverUrl: DEFAULT_SERVER,
    realtimeData: {
      temperature: 0,
      humidity: 0,
      soilMoisture: 0
    },
    deviceStatus: {}
  }),

  actions: {
    setServerUrl(url) {
      this.serverUrl = url
      uni.setStorageSync('serverUrl', url)
    },

    updateRealtimeData(data) {
      if (data.temperature !== undefined) this.realtimeData.temperature = data.temperature
      if (data.humidity !== undefined) this.realtimeData.humidity = data.humidity
      if (data.soilMoisture !== undefined) this.realtimeData.soilMoisture = data.soilMoisture
    },

    updateDeviceStatus(deviceId, status) {
      this.deviceStatus[deviceId] = status
    },

    loadSettings() {
      const serverUrl = uni.getStorageSync('serverUrl')
      if (serverUrl) this.serverUrl = serverUrl
    }
  },

  getters: {
    formattedRealtimeData() {
      return {
        temperature: Number(this.realtimeData.temperature).toFixed(1),
        humidity: Number(this.realtimeData.humidity).toFixed(1),
        soilMoisture: Number(this.realtimeData.soilMoisture).toFixed(1)
      }
    }
  }
})
