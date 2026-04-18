import { get, post, put, del } from './request.js'

export default {
  getRules() {
    return get('/automation/rules')
  },
  getRule(id) {
    return get(`/automation/rules/${id}`)
  },
  createRule(data) {
    return post('/automation/rules', data)
  },
  updateRule(id, data) {
    return put(`/automation/rules/${id}`, data)
  },
  deleteRule(id) {
    return del(`/automation/rules/${id}`)
  },
  getActiveRules() {
    return get('/automation/rules/active')
  },
  getRuleStatistics() {
    return get('/automation/statistics')
  }
}
