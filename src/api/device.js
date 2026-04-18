import { get, post, put, del } from './request.js'

export default {
  getDevices() {
    return get('/devices')
  },
  getDevice(id) {
    return get(`/devices/${id}`)
  },
  addDevice(data) {
    return post('/devices', data)
  },
  updateDevice(id, data) {
    return put(`/devices/${id}`, data)
  },
  deleteDevice(id) {
    return del(`/devices/${id}`)
  },
  controlDevice(id, command, param) {
    let url = `/devices/${id}/control?command=${command}`
    if (param) url += `&param=${param}`
    return post(url)
  },
  getOnlineDevices() {
    return get('/devices/online')
  },
  getDeviceStatistics() {
    return get('/devices/statistics')
  },
  getDevicesByType(type) {
    return get(`/devices/type/${type}`)
  }
}
