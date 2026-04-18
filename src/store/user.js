import { defineStore } from 'pinia'
import authApi from '@/api/auth.js'
import { clearCookie } from '@/utils/cookie.js'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null,
    isLoggedIn: false
  }),

  actions: {
    async login(username, password) {
      const res = await authApi.login({ username, password })
      this.userInfo = res.data
      this.isLoggedIn = true
      uni.setStorageSync('userInfo', JSON.stringify(res.data))
      return res
    },

    async logout() {
      try {
        await authApi.logout()
      } catch (e) {
        // 即使请求失败也要清除本地状态
      }
      this.userInfo = null
      this.isLoggedIn = false
      uni.removeStorageSync('userInfo')
      uni.removeStorageSync('remember_credentials')
      clearCookie()
    },

    loadFromStorage() {
      const str = uni.getStorageSync('userInfo')
      if (str) {
        try {
          this.userInfo = JSON.parse(str)
          this.isLoggedIn = true
        } catch (e) {
          this.userInfo = null
          this.isLoggedIn = false
        }
      }
    },

    async checkAuth() {
      try {
        const res = await authApi.getCurrentUser()
        this.userInfo = res.data
        this.isLoggedIn = true
        uni.setStorageSync('userInfo', JSON.stringify(res.data))
        return true
      } catch (e) {
        this.userInfo = null
        this.isLoggedIn = false
        return false
      }
    }
  }
})
