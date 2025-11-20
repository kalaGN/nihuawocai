// pages/settings/index.js
const storage = require('../../utils/storage')

Page({
  data: {
    // 学段选项
    educationLevels: [
      { value: 'primary', label: '小学', desc: '简单词汇，适合低年级', icon: '🎒' },
      { value: 'junior', label: '初中', desc: '常见词汇，适合初中', icon: '📘' },
      { value: 'senior', label: '高中', desc: '进阶词汇，适合高中', icon: '📗' },
      { value: 'university', label: '大学', desc: '高级词汇，挑战难度', icon: '🎓' }
    ],
    selectedLevel: 'primary',
    
    // 游戏时长（秒）
    durations: [5, 8, 10, 15, 20],
    selectedDuration: 10,
    
    // 词汇数量
    wordCounts: [10, 20, 30, 50],
    selectedWordCount: 10
  },

  onLoad() {
    this.loadSavedConfig()
  },

  /**
   * 加载已保存的配置
   */
  loadSavedConfig() {
    const config = storage.getGameConfig()
    this.setData({
      selectedLevel: config.educationLevel || 'primary',
      selectedDuration: config.displayDuration || 10,
      selectedWordCount: config.wordCount || 10
    })
  },

  /**
   * 选择学段
   */
  selectLevel(e) {
    const level = e.currentTarget.dataset.level
    this.setData({
      selectedLevel: level
    })
  },

  /**
   * 选择时长
   */
  selectDuration(e) {
    const duration = e.currentTarget.dataset.duration
    this.setData({
      selectedDuration: duration
    })
  },

  /**
   * 选择词汇数量
   */
  selectWordCount(e) {
    const count = e.currentTarget.dataset.count
    this.setData({
      selectedWordCount: count
    })
  },

  /**
   * 开始游戏
   */
  startGame() {
    // 保存游戏配置
    const config = {
      gameMode: 'dual',
      educationLevel: this.data.selectedLevel,
      wordCount: this.data.selectedWordCount,
      displayDuration: this.data.selectedDuration,
      hintEnabled: true,
      lastUpdateTime: Date.now()
    }
    
    storage.saveGameConfig(config)
    
    // 跳转到准备页
    wx.navigateTo({
      url: '/pages/prepare/index'
    })
  },

  /**
   * 返回首页
   */
  goBack() {
    wx.navigateBack()
  }
})
