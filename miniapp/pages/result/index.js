// pages/result/index.js
const storage = require('../../utils/storage')

Page({
  data: {
    record: null,
    educationLevelName: {
      'primary': '小学',
      'junior': '初中',
      'senior': '高中',
      'university': '大学'
    },
    isBestScore: false,
    bestScore: null
  },

  onLoad() {
    this.loadResult()
  },

  /**
   * 加载结果
   */
  loadResult() {
    const records = storage.getGameRecords()
    if (records && records.length > 0) {
      const latestRecord = records[0]
      
      // 检查是否是最佳成绩
      const bestScores = storage.getBestScores()
      const levelBest = bestScores[latestRecord.educationLevel]
      const isBestScore = levelBest && levelBest.score === latestRecord.score
      
      this.setData({
        record: latestRecord,
        isBestScore: isBestScore,
        bestScore: levelBest
      })
    }
  },

  /**
   * 再来一局
   */
  playAgain() {
    wx.redirectTo({
      url: '/pages/prepare/index'
    })
  },

  /**
   * 返回首页
   */
  goHome() {
    wx.reLaunch({
      url: '/pages/home/index'
    })
  },

  /**
   * 查看历史记录
   */
  viewHistory() {
    wx.switchTab({
      url: '/pages/history/index'
    })
  },

  /**
   * 分享成绩
   */
  shareResult() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },

  /**
   * 分享给好友
   */
  onShareAppMessage() {
    const { record } = this.data
    return {
      title: `我在“你比划我猜”中猜对了${record.correctCount}个词，来挑战吧！`,
      path: '/pages/home/index'
    }
  }
})
