// pages/history/detail/index.js
const storage = require('../../../utils/storage')
const util = require('../../../utils/util')

Page({
  data: {
    record: null,
    educationLevelName: {
      'primary': '小学',
      'junior': '初中',
      'senior': '高中',
      'university': '大学'
    },
    resultTypeLabel: {
      'correct': '✅ 正确',
      'skip': '⏭️ 跳过',
      'timeout': '⏰ 超时'
    }
  },

  onLoad(options) {
    const index = parseInt(options.index || 0)
    this.loadDetail(index)
  },

  /**
   * 加载详情
   */
  loadDetail(index) {
    const records = storage.getGameRecords()
    if (records && records[index]) {
      const record = records[index]
      this.setData({
        record: {
          ...record,
          formattedTime: util.formatTime(new Date(record.createdAt))
        }
      })
    }
  },

  /**
   * 返回
   */
  goBack() {
    wx.navigateBack()
  }
})
