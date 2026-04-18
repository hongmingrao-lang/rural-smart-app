import { get, post } from './request.js'

export default {
  login(data) {
    return post('/auth/login', data)
  },
  register(data) {
    return post('/auth/register', data)
  },
  logout() {
    return post('/auth/logout')
  },
  getCurrentUser() {
    return get('/auth/current')
  }
}
