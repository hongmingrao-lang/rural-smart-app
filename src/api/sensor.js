import { get, post } from './request.js'

export default {
  getLatestData() {
    return get('/sensor/latest')
  },
  getDeviceData(deviceId, hours = 24) {
    return get(`/sensor/device/${deviceId}?hours=${hours}`)
  },
  getSensorData(sensorType, hours = 24) {
    return get(`/sensor/type/${sensorType}?hours=${hours}`)
  },
  getLatestBySensorType(sensorType) {
    return get(`/sensor/type/${sensorType}/latest`)
  },
  getSensorStatistics(hours = 24) {
    return get(`/sensor/statistics?hours=${hours}`)
  },
  uploadSensorData(data) {
    return post('/sensor/data', data)
  }
}
