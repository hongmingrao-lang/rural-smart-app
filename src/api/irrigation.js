import { get, post } from './request.js'

export default {
  startIrrigation(data) {
    return post('/irrigation/start', data)
  },
  stopIrrigation(zoneId) {
    return post(`/irrigation/stop/${zoneId}`)
  },
  getIrrigationLogs(zoneId, mode, days = 7) {
    let url = `/irrigation/logs?days=${days}`
    if (zoneId) url += `&zoneId=${zoneId}`
    if (mode) url += `&mode=${mode}`
    return get(url)
  },
  getIrrigationStatistics(days = 7) {
    return get(`/irrigation/statistics?days=${days}`)
  },
  checkAndIrrigate() {
    return post('/irrigation/check')
  }
}
