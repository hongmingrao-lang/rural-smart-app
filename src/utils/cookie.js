/**
 * Cookie 管理工具
 * 手动管理 JSESSIONID，解决 uni-app 非 H5 平台不自动管理 Cookie 的问题
 */

const COOKIE_KEY = 'JSESSIONID'
const STORAGE_KEY = 'app_cookie_jsessionid'

/**
 * 从 Set-Cookie 响应头中解析 JSESSIONID
 */
export function parseCookie(setCookieHeader) {
  if (!setCookieHeader) return null
  // 处理可能是数组或字符串的情况
  const headerStr = Array.isArray(setCookieHeader)
    ? setCookieHeader.join('; ')
    : setCookieHeader
  const match = headerStr.match(/JSESSIONID=([^;]+)/)
  return match ? match[1] : null
}

/**
 * 获取已保存的 Cookie 字符串
 */
export function getCookie() {
  const sessionId = uni.getStorageSync(STORAGE_KEY)
  return sessionId ? `${COOKIE_KEY}=${sessionId}` : ''
}

/**
 * 保存 JSESSIONID
 */
export function saveCookie(sessionId) {
  if (sessionId) {
    uni.setStorageSync(STORAGE_KEY, sessionId)
  }
}

/**
 * 清除 Cookie
 */
export function clearCookie() {
  uni.removeStorageSync(STORAGE_KEY)
}
