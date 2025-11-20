// utils/util.js - 通用工具函数

/**
 * 格式化时间
 */
function formatTime(date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('-')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

/**
 * 生成唯一ID
 */
function generateId() {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Fisher-Yates洗牌算法
 */
function shuffle(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/**
 * 答案校验
 */
function validateAnswer(userAnswer, correctAnswer) {
  // 去除首尾空格
  const trimmedAnswer = userAnswer.trim()
  const trimmedCorrect = correctAnswer.trim()
  
  // 完全匹配
  if (trimmedAnswer === trimmedCorrect) {
    return true
  }
  
  // 忽略大小写匹配（针对英文）
  if (trimmedAnswer.toLowerCase() === trimmedCorrect.toLowerCase()) {
    return true
  }
  
  return false
}

/**
 * 学段中文名称映射
 */
const EDUCATION_LEVEL_NAMES = {
  primary: '小学',
  junior: '初中',
  senior: '高中',
  university: '大学'
}

/**
 * 获取学段中文名
 */
function getEducationLevelName(level) {
  return EDUCATION_LEVEL_NAMES[level] || level
}

/**
 * 游戏模式中文名称映射
 */
const GAME_MODE_NAMES = {
  dual: '双人互动',
  single: '个人练习'
}

/**
 * 获取游戏模式中文名
 */
function getGameModeName(mode) {
  return GAME_MODE_NAMES[mode] || mode
}

/**
 * 计算正确率
 */
function calculateAccuracy(correctCount, totalCount) {
  if (totalCount === 0) return 0
  return Math.round((correctCount / totalCount) * 100)
}

/**
 * 格式化用时（秒转分秒）
 */
function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  
  if (mins > 0) {
    return `${mins}分${secs}秒`
  }
  return `${secs}秒`
}

module.exports = {
  formatTime,
  formatNumber,
  generateId,
  shuffle,
  validateAnswer,
  getEducationLevelName,
  getGameModeName,
  calculateAccuracy,
  formatDuration,
  EDUCATION_LEVEL_NAMES,
  GAME_MODE_NAMES
}
