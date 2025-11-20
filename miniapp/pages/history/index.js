// pages/history/index.js
const storage = require('../../utils/storage')
const util = require('../../utils/util')

Page({
  data: {
    records: [],
    bestScores: {},
    educationLevelName: {
      'primary': '小学',
      'junior': '初中',
      'senior': '高中',
      'university': '大学'
    }
  },

  onShow() {
    this.loadData()
  },

  /**
   * 加载数据
   */
  loadData() {
    const records = storage.getGameRecords()
    const bestScores = storage.getBestScores()
    
    // 格式化时间
    const formattedRecords = records.map(record => ({
      ...record,
      formattedTime: util.formatTime(new Date(record.createdAt))
    }))
    
    this.setData({
      records: formattedRecords,
      bestScores: bestScores
    })
  },

  /**
   * 查看详情
   */
  viewDetail(e) {
    const index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: `/pages/history/detail/index?index=${index}`
    })
  },

  /**
   * 清空记录
   */
  clearRecords() {
    wx.showModal({
      title: '提示',
      content: '确定要清空所有游戏记录吗？最佳成绩不会被清除。',
      success: (res) => {
        if (res.confirm) {
          storage.setStorage(storage.STORAGE_KEYS.GAME_RECORDS, [])
          this.loadData()
          wx.showToast({
            title: '已清空',
            icon: 'success'
          })
        }
      }
    })
  }
})
