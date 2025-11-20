// pages/home/index.js
const storage = require('../../utils/storage')
const util = require('../../utils/util')

Page({
  data: {
    isAuthorized: false,
    userInfo: null,
    gameConfig: {},
    bestScores: {}
  },

  onLoad() {
    this.loadUserInfo()
    this.loadGameConfig()
    this.loadBestScores()
  },

  onShow() {
    // 每次显示页面时刷新数据
    this.loadBestScores()
  },

  /**
   * 加载用户信息
   */
  loadUserInfo() {
    const isAuthorized = storage.getStorage(storage.STORAGE_KEYS.IS_AUTHORIZED, false)
    const userInfo = storage.getStorage(storage.STORAGE_KEYS.USER_INFO)
    
    this.setData({
      isAuthorized,
      userInfo
    })
  },

  /**
   * 加载游戏配置
   */
  loadGameConfig() {
    const config = storage.getGameConfig()
    this.setData({
      gameConfig: config
    })
  },

  /**
   * 加载最佳成绩
   */
  loadBestScores() {
    const scores = storage.getBestScores()
    this.setData({
      bestScores: scores
    })
  },

  /**
   * 开始游戏
   */
  startGame() {
    wx.navigateTo({
      url: '/pages/settings/index'
    })
  },

  /**
   * 查看历史记录
   */
  viewHistory() {
    if (!this.data.isAuthorized) {
      wx.showModal({
        title: '提示',
        content: '查看历史记录需要授权登录，是否前往授权？',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/launch/index'
            })
          }
        }
      })
      return
    }
    
    wx.switchTab({
      url: '/pages/history/index'
    })
  },

  /**
   * 前往授权
   */
  goToAuth() {
    wx.navigateTo({
      url: '/pages/launch/index'
    })
  }
})
