// utils/api.js - API请求封装

const app = getApp()

/**
 * 发送HTTP请求
 */
function request(url, method = 'GET', data = {}, needAuth = false) {
  return new Promise((resolve, reject) => {
    const header = {
      'Content-Type': 'application/json'
    }

    // 如果需要认证，添加token
    if (needAuth && app.globalData.token) {
      header['Token'] = app.globalData.token
    }

    wx.request({
      url: `${app.globalData.apiBase}${url}`,
      method: method,
      data: data,
      header: header,
      success: (res) => {
        if (res.statusCode === 200) {
          const result = res.data
          if (result.code === 0) {
            resolve(result.data)
          } else {
            reject(result)
          }
        } else {
          reject({
            code: res.statusCode,
            message: '网络请求失败'
          })
        }
      },
      fail: (err) => {
        reject({
          code: -1,
          message: err.errMsg || '网络请求失败'
        })
      }
    })
  })
}

/**
 * 微信登录
 */
function wechatLogin(code, userInfo = {}) {
  return request('/auth/wechat-login', 'POST', {
    code: code,
    nickName: userInfo.nickName || '',
    avatarUrl: userInfo.avatarUrl || ''
  })
}

/**
 * 验证token
 */
function verifyToken(token) {
  return request('/auth/verify-token', 'POST', { token })
}

/**
 * 获取词库列表
 */
function getWordList(educationLevel, count = 50, excludeIds = '') {
  return request('/words/list', 'GET', {
    educationLevel,
    count,
    excludeIds
  })
}

/**
 * 获取词库版本
 */
function getWordVersion() {
  return request('/words/version', 'GET')
}

module.exports = {
  request,
  wechatLogin,
  verifyToken,
  getWordList,
  getWordVersion
}
