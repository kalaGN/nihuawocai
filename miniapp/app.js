// app.js
App({
  onLaunch() {
    // 检查登录状态
    this.checkLoginStatus()
  },

  checkLoginStatus() {
    const token = wx.getStorageSync('userToken')
    const expireTime = wx.getStorageSync('loginExpireTime')
    
    if (token && expireTime) {
      const now = Date.now()
      if (now < expireTime) {
        this.globalData.isLogin = true
        this.globalData.token = token
      } else {
        // Token过期，清除
        wx.removeStorageSync('userToken')
        wx.removeStorageSync('loginExpireTime')
      }
    }
  },

  globalData: {
    isLogin: false,
    token: '',
    userInfo: null,
    // 后端API地址
    apiBase: 'http://localhost:8080/api'
  }
})
