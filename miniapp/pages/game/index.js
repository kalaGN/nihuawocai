// pages/game/index.js
const api = require('../../utils/api')
const storage = require('../../utils/storage')
const util = require('../../utils/util')

Page({
  data: {
    // 游戏状态
    gameStatus: 'loading', // loading, playing, paused, finished
    
    // 游戏配置
    gameConfig: {},
    
    // 词库数据
    words: [],
    currentIndex: 0,
    currentWord: null,
    
    // 计时器
    timer: 0,
    displayTimer: 0,
    
    // 游戏统计
    correctCount: 0,
    skipCount: 0,
    wrongCount: 0,
    totalCount: 0,
    
    // 提示功能
    showHint: false,
    hintText: ''
  },

  gameTimer: null,
  displayTimer: null,
  startTime: 0,
  gameRecord: [],

  onLoad() {
    this.loadGameConfig()
    this.loadWords()
  },

  onUnload() {
    this.clearTimers()
  },

  /**
   * 加载游戏配置
   */
  loadGameConfig() {
    const config = storage.getGameConfig()
    this.setData({
      gameConfig: config,
      displayTimer: config.displayDuration
    })
  },

  /**
   * 加载词库
   */
  loadWords() {
    wx.showLoading({ title: '加载中...' })
    
    const { educationLevel, wordCount } = this.data.gameConfig
    
    // 先尝试从缓存加载
    const cachedWords = storage.getWordCache(educationLevel)
    if (cachedWords && cachedWords.length >= wordCount) {
      this.initGame(this.shuffleArray(cachedWords).slice(0, wordCount))
      wx.hideLoading()
      return
    }
    
    // 从后端加载
    api.getWordList(educationLevel, wordCount)
      .then(data => {
        const words = data.words || []
        // 保存到缓存
        storage.saveWordCache(educationLevel, words)
        this.initGame(words)
        wx.hideLoading()
      })
      .catch(err => {
        wx.hideLoading()
        wx.showModal({
          title: '错误',
          content: '加载词库失败，请检查网络连接',
          success: (res) => {
            if (res.confirm) {
              wx.navigateBack()
            }
          }
        })
      })
  },

  /**
   * 初始化游戏
   */
  initGame(words) {
    this.startTime = Date.now()
    this.setData({
      words: words,
      totalCount: words.length,
      currentIndex: 0,
      currentWord: words[0],
      gameStatus: 'playing'
    })
    this.startTimers()
  },

  /**
   * 开始计时器
   */
  startTimers() {
    // 游戏总计时
    this.gameTimer = setInterval(() => {
      this.setData({
        timer: this.data.timer + 1
      })
    }, 1000)
    
    // 当前词展示计时
    this.displayTimer = setInterval(() => {
      const displayTimer = this.data.displayTimer - 1
      
      if (displayTimer <= 0) {
        // 超时自动跳过
        this.handleSkip(true)
      } else {
        this.setData({ displayTimer })
      }
    }, 1000)
  },

  /**
   * 清除计时器
   */
  clearTimers() {
    if (this.gameTimer) {
      clearInterval(this.gameTimer)
      this.gameTimer = null
    }
    if (this.displayTimer) {
      clearInterval(this.displayTimer)
      this.displayTimer = null
    }
  },

  /**
   * 处理正确
   */
  handleCorrect() {
    if (this.data.gameStatus !== 'playing') return
    
    // 记录结果
    this.gameRecord.push({
      word: this.data.currentWord,
      result: 'correct',
      time: this.data.gameConfig.displayDuration - this.data.displayTimer
    })
    
    this.setData({
      correctCount: this.data.correctCount + 1,
      wrongCount: 0 // 重置错误次数
    })
    
    this.nextWord()
  },

  /**
   * 处理跳过
   */
  handleSkip(isTimeout = false) {
    if (this.data.gameStatus !== 'playing') return
    
    // 记录结果
    this.gameRecord.push({
      word: this.data.currentWord,
      result: isTimeout ? 'timeout' : 'skip',
      time: this.data.gameConfig.displayDuration - this.data.displayTimer
    })
    
    this.setData({
      skipCount: this.data.skipCount + 1,
      wrongCount: 0 // 重置错误次数
    })
    
    this.nextWord()
  },

  /**
   * 处理错误
   */
  handleWrong() {
    if (this.data.gameStatus !== 'playing') return
    
    const wrongCount = this.data.wrongCount + 1
    this.setData({ wrongCount })
    
    // 错误2次显示提示
    if (wrongCount >= 2 && this.data.gameConfig.hintEnabled) {
      const charCount = this.data.currentWord.content.length
      this.setData({
        showHint: true,
        hintText: `${charCount}个字`
      })
    }
  },

  /**
   * 下一个词
   */
  nextWord() {
    const nextIndex = this.data.currentIndex + 1
    
    // 检查是否完成
    if (nextIndex >= this.data.words.length) {
      this.finishGame()
      return
    }
    
    // 更新下一个词
    this.setData({
      currentIndex: nextIndex,
      currentWord: this.data.words[nextIndex],
      displayTimer: this.data.gameConfig.displayDuration,
      showHint: false,
      wrongCount: 0
    })
  },

  /**
   * 暂停/继续游戏
   */
  togglePause() {
    if (this.data.gameStatus === 'playing') {
      this.clearTimers()
      this.setData({ gameStatus: 'paused' })
    } else if (this.data.gameStatus === 'paused') {
      this.startTimers()
      this.setData({ gameStatus: 'playing' })
    }
  },

  /**
   * 退出游戏
   */
  quitGame() {
    wx.showModal({
      title: '提示',
      content: '确定要退出游戏吗？',
      success: (res) => {
        if (res.confirm) {
          this.clearTimers()
          wx.navigateBack({ delta: 2 })
        }
      }
    })
  },

  /**
   * 结束游戏
   */
  finishGame() {
    this.clearTimers()
    this.setData({ gameStatus: 'finished' })
    
    // 保存游戏记录
    const record = {
      educationLevel: this.data.gameConfig.educationLevel,
      wordCount: this.data.totalCount,
      correctCount: this.data.correctCount,
      skipCount: this.data.skipCount,
      score: this.data.correctCount,
      accuracy: (this.data.correctCount / this.data.totalCount * 100).toFixed(1),
      duration: this.data.timer,
      createdAt: Date.now(),
      details: this.gameRecord
    }
    
    storage.saveGameRecord(record)
    
    // 跳转到结果页
    setTimeout(() => {
      wx.redirectTo({
        url: '/pages/result/index'
      })
    }, 500)
  },

  /**
   * 打乱数组
   */
  shuffleArray(array) {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  }
})
