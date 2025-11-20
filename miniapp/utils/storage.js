// utils/storage.js - 存储管理工具类

/**
 * 存储键名常量
 */
const STORAGE_KEYS = {
  USER_TOKEN: 'userToken',
  USER_ID: 'userId',
  USER_INFO: 'userInfo',
  IS_AUTHORIZED: 'isAuthorized',
  LOGIN_EXPIRE_TIME: 'loginExpireTime',
  GAME_CONFIG: 'game_config',
  WORD_CACHE_PRIMARY: 'word_cache_primary',
  WORD_CACHE_JUNIOR: 'word_cache_junior',
  WORD_CACHE_SENIOR: 'word_cache_senior',
  WORD_CACHE_UNIVERSITY: 'word_cache_university',
  GAME_RECORDS: 'game_records',
  BEST_SCORES: 'best_scores'
}

/**
 * 设置存储
 */
function setStorage(key, value) {
  try {
    wx.setStorageSync(key, value)
    return true
  } catch (e) {
    console.error('setStorage error:', e)
    return false
  }
}

/**
 * 获取存储
 */
function getStorage(key, defaultValue = null) {
  try {
    const value = wx.getStorageSync(key)
    return value || defaultValue
  } catch (e) {
    console.error('getStorage error:', e)
    return defaultValue
  }
}

/**
 * 移除存储
 */
function removeStorage(key) {
  try {
    wx.removeStorageSync(key)
    return true
  } catch (e) {
    console.error('removeStorage error:', e)
    return false
  }
}

/**
 * 清空所有存储
 */
function clearStorage() {
  try {
    wx.clearStorageSync()
    return true
  } catch (e) {
    console.error('clearStorage error:', e)
    return false
  }
}

/**
 * 保存游戏配置
 */
function saveGameConfig(config) {
  return setStorage(STORAGE_KEYS.GAME_CONFIG, config)
}

/**
 * 获取游戏配置
 */
function getGameConfig() {
  return getStorage(STORAGE_KEYS.GAME_CONFIG, {
    gameMode: 'dual',
    educationLevel: 'primary',
    wordCount: 10,
    displayDuration: 10,
    hintEnabled: false,
    lastUpdateTime: Date.now()
  })
}

/**
 * 保存词库缓存
 */
function saveWordCache(level, words) {
  const key = `word_cache_${level}`
  const data = {
    words: words,
    updateTime: Date.now()
  }
  return setStorage(key, data)
}

/**
 * 获取词库缓存
 */
function getWordCache(level) {
  const key = `word_cache_${level}`
  const cache = getStorage(key)
  
  if (!cache) return null
  
  // 检查是否过期（7天）
  const now = Date.now()
  const expireTime = 7 * 24 * 60 * 60 * 1000
  
  if (now - cache.updateTime > expireTime) {
    removeStorage(key)
    return null
  }
  
  return cache.words
}

/**
 * 保存游戏记录
 */
function saveGameRecord(record) {
  const records = getStorage(STORAGE_KEYS.GAME_RECORDS, [])
  
  // 添加新记录
  records.unshift(record)
  
  // 最多保留20条
  if (records.length > 20) {
    records.splice(20)
  }
  
  setStorage(STORAGE_KEYS.GAME_RECORDS, records)
  
  // 更新最佳成绩
  updateBestScore(record)
  
  return true
}

/**
 * 获取游戏记录
 */
function getGameRecords() {
  return getStorage(STORAGE_KEYS.GAME_RECORDS, [])
}

/**
 * 更新最佳成绩
 */
function updateBestScore(record) {
  const bestScores = getStorage(STORAGE_KEYS.BEST_SCORES, {})
  const level = record.educationLevel
  
  if (!bestScores[level] || record.score > bestScores[level].score) {
    bestScores[level] = {
      score: record.score,
      accuracy: record.accuracy,
      createdAt: record.createdAt
    }
    setStorage(STORAGE_KEYS.BEST_SCORES, bestScores)
  }
}

/**
 * 获取最佳成绩
 */
function getBestScores() {
  return getStorage(STORAGE_KEYS.BEST_SCORES, {})
}

module.exports = {
  STORAGE_KEYS,
  setStorage,
  getStorage,
  removeStorage,
  clearStorage,
  saveGameConfig,
  getGameConfig,
  saveWordCache,
  getWordCache,
  saveGameRecord,
  getGameRecords,
  getBestScores
}
