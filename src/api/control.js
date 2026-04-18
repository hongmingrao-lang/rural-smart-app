import { get, post } from './request.js'

export default {
  sendControl(data) {
    return post('/control', data)
  },
  getControlLogs(deviceId, source, hours = 24) {
    let url = `/control/logs?hours=${hours}`
    if (deviceId) url += `&deviceId=${deviceId}`
    if (source) url += `&source=${source}`
    return get(url)
  },
  getControlStatistics(hours = 24) {
    return get(`/control/statistics?hours=${hours}`)
  }
}
