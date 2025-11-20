// pages/launch/index.js
const api = require('../../utils/api')
const storage = require('../../utils/storage')
const app = getApp()

Page({
  data: {
    isLoading: false,
    appName: '你比划我猜',
    appDesc: '双人互动猜词游戏'
  },

  onLoad() {
    // 检查是否已授权
    this.checkAuthStatus()
  },

  /**
   * 检查授权状态
   */
  checkAuthStatus() {
    const isAuthorized = storage.getStorage(storage.STORAGE_KEYS.IS_AUTHORIZED, false)
    if (isAuthorized) {
      // 已授权，直接跳转首页
      this.navigateToHome()
    }
  },

  /**
   * 获取用户信息并登录
   */
  getUserProfile(e) {
    const that = this
    
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        that.setData({ isLoading: true })
        
        const userInfo = res.userInfo
        // 执行微信登录
        that.doWechatLogin(userInfo)
      },
      fail: (err) => {
        wx.showToast({
          title: '授权失败',
          icon: 'none'
        })
      }
    })
  },

  /**
   * 执行微信登录
   */
  doWechatLogin(userInfo) {
    const that = this
    
    wx.login({
      success: (res) => {
        if (res.code) {
          // 调用后端登录接口
          api.wechatLogin(res.code, userInfo)
            .then(data => {
              // 保存登录信息
              storage.setStorage(storage.STORAGE_KEYS.IS_AUTHORIZED, true)
              storage.setStorage(storage.STORAGE_KEYS.USER_INFO, userInfo)
              storage.setStorage(storage.STORAGE_KEYS.USER_TOKEN, data.token)
              
              // 更新全局数据
              app.globalData.isLogin = true
              app.globalData.token = data.token
              app.globalData.userInfo = userInfo
              
              wx.showToast({
                title: '登录成功',
                icon: 'success',
                duration: 1500
              })
              
              setTimeout(() => {
                that.navigateToHome()
              }, 1500)
            })
            .catch(err => {
              that.setData({ isLoading: false })
              wx.showToast({
                title: err.message || '登录失败',
                icon: 'none'
              })
            })
        } else {
          that.setData({ isLoading: false })
          wx.showToast({
            title: '获取登录凭证失败',
            icon: 'none'
          })
        }
      },
      fail: () => {
        that.setData({ isLoading: false })
        wx.showToast({
          title: '微信登录失败',
          icon: 'none'
        })
      }
    })
  },

  /**
   * 跳过登录
   */
  skipLogin() {
    // 未授权状态下也可以进入游戏，但无法保存历史记录
    this.navigateToHome()
  },

  /**
   * 跳转到首页
   */
  navigateToHome() {
    wx.switchTab({
      url: '/pages/home/index'
    })
  }
})
