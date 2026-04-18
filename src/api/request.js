/**
 * uni.request 封装 — 核心 HTTP 请求层
 * 处理 Cookie/JSESSIONID 管理、错误拦截、401 跳转
 */
import { parseCookie, getCookie, saveCookie, clearCookie } from '@/utils/cookie.js'

// 默认服务器地址，可在系统设置页修改
const DEFAULT_SERVER = 'http://localhost:8080'

function getBaseUrl() {
  // #ifdef H5
  // H5 模式下使用 /api 代理（由 vite/webpack devServer 代理到后端）
  return '/api'
  // #endif
  // #ifndef H5
  // 非 H5 模式：从 storage 读取服务器地址，直连后端
  const serverUrl = uni.getStorageSync('serverUrl') || DEFAULT_SERVER
  return serverUrl + '/api'
  // #endif
}

let isRedirecting = false

function request(options) {
  return new Promise((resolve, reject) => {
    const { url, method = 'GET', data, header = {} } = options

    const baseUrl = getBaseUrl()
    const fullUrl = baseUrl + url

    // 构建请求头
    const headers = {
      'Content-Type': 'application/json;charset=UTF-8',
      ...header
    }

    // #ifndef H5
    // 非 H5 平台：手动附带 Cookie
    const cookie = getCookie()
    if (cookie) {
      headers['Cookie'] = cookie
    }
    // #endif

    uni.request({
      url: fullUrl,
      method,
      data,
      header: headers,
      withCredentials: true,
      success: (res) => {
        // #ifndef H5
        // 非 H5 平台：从响应头提取并保存 JSESSIONID
        const setCookie = res.header['Set-Cookie'] || res.header['set-cookie']
        if (setCookie) {
          const sessionId = parseCookie(setCookie)
          if (sessionId) {
            saveCookie(sessionId)
          }
        }
        // #endif

        const resData = res.data
        if (!resData) {
          uni.showToast({ title: '请求失败', icon: 'error' })
          reject(new Error('空响应'))
          return
        }

        // 业务状态码处理
        if (resData.code === 200) {
          resolve(resData)
        } else if (resData.code === 401) {
          // 未登录 / session 过期
          clearCookie()
          uni.removeStorageSync('userInfo')
          if (!isRedirecting) {
            isRedirecting = true
            uni.showToast({ title: '请重新登录', icon: 'none' })
            setTimeout(() => {
              uni.reLaunch({ url: '/pages/login/login' })
              isRedirecting = false
            }, 1000)
          }
          reject(new Error(resData.message || '未登录'))
        } else {
          uni.showToast({ title: resData.message || '请求失败', icon: 'none' })
          reject(new Error(resData.message || '请求失败'))
        }
      },
      fail: (err) => {
        uni.showToast({ title: '网络连接失败', icon: 'none' })
        reject(new Error(err.errMsg || '网络错误'))
      }
    })
  })
}

// 快捷方法
export function get(url, data) {
  return request({ url, method: 'GET', data })
}

export function post(url, data) {
  return request({ url, method: 'POST', data })
}

export function put(url, data) {
  return request({ url, method: 'PUT', data })
}

export function del(url, data) {
  return request({ url, method: 'DELETE', data })
}

export default request
