// pages/prepare/index.js
const storage = require('../../utils/storage')

Page({
  data: {
    countdown: 3,
    gameConfig: {},
    educationLevelName: {
      'primary': '小学',
      'junior': '初中',
      'senior': '高中',
      'university': '大学'
    }
  },

  countdownTimer: null,

  onLoad() {
    // 加载游戏配置
    const config = storage.getGameConfig()
    this.setData({
      gameConfig: config
    })
    
    // 延迟1秒开始倒计时，给用户看规则的时间
    setTimeout(() => {
      this.startCountdown()
    }, 1000)
  },

  onUnload() {
    // 页面卸载时清除定时器
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer)
    }
  },

  /**
   * 开始倒计时
   */
  startCountdown() {
    this.countdownTimer = setInterval(() => {
      const countdown = this.data.countdown - 1
      
      if (countdown <= 0) {
        clearInterval(this.countdownTimer)
        // 跳转到游戏页
        this.goToGame()
      } else {
        this.setData({ countdown })
      }
    }, 1000)
  },

  /**
   * 跳转到游戏页
   */
  goToGame() {
    wx.redirectTo({
      url: '/pages/game/index'
    })
  },

  /**
   * 取消游戏
   */
  cancelGame() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer)
    }
    wx.navigateBack()
  }
})
