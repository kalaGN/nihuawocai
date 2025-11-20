package service

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/charades-game/backend/internal/config"
	"github.com/charades-game/backend/internal/model"
)

type WordService struct {
	config    *config.Config
	wordCache map[string][]model.Word // 按学段缓存词汇
}

func NewWordService(cfg *config.Config) *WordService {
	ws := &WordService{
		config:    cfg,
		wordCache: make(map[string][]model.Word),
	}
	// 初始化加载词库
	ws.loadAllWords()
	return ws
}

// GetWordListRequest 获取词库请求
type GetWordListRequest struct {
	EducationLevel string `form:"educationLevel" binding:"required"`
	Count          int    `form:"count"`
	ExcludeIDs     string `form:"excludeIds"`
}

// GetWordListResponse 获取词库响应
type GetWordListResponse struct {
	Words   []model.Word `json:"words"`
	Total   int          `json:"total"`
	Version string       `json:"version"`
}

// GetWordList 获取词汇列表
func (s *WordService) GetWordList(req *GetWordListRequest) (*GetWordListResponse, error) {
	// 验证学段参数
	if !s.isValidLevel(req.EducationLevel) {
		return nil, fmt.Errorf("invalid education level")
	}

	// 从缓存获取词汇
	words, ok := s.wordCache[req.EducationLevel]
	if !ok || len(words) == 0 {
		return nil, fmt.Errorf("word library not found")
	}

	// 解析排除ID
	excludeIDs := make(map[string]bool)
	if req.ExcludeIDs != "" {
		ids := strings.Split(req.ExcludeIDs, ",")
		for _, id := range ids {
			excludeIDs[strings.TrimSpace(id)] = true
		}
	}

	// 过滤排除的词汇
	var availableWords []model.Word
	for _, word := range words {
		if !excludeIDs[word.WordID] {
			availableWords = append(availableWords, word)
		}
	}

	// 确定返回数量
	count := req.Count
	if count <= 0 {
		count = 50
	}
	if count > len(availableWords) {
		count = len(availableWords)
	}

	// 随机抽取词汇
	selectedWords := s.randomSelect(availableWords, count)

	return &GetWordListResponse{
		Words:   selectedWords,
		Total:   len(words),
		Version: s.config.WordLib.Version,
	}, nil
}

// GetVersion 获取词库版本
func (s *WordService) GetVersion() string {
	return s.config.WordLib.Version
}

// loadAllWords 加载所有词库
func (s *WordService) loadAllWords() {
	levels := []string{model.Primary, model.Junior, model.Senior, model.University}
	
	for _, level := range levels {
		words, err := s.loadWords(level)
		if err != nil {
			fmt.Printf("Error loading %s words: %v\n", level, err)
			continue
		}
		s.wordCache[level] = words
	}
}

// loadWords 加载指定学段的词汇
func (s *WordService) loadWords(level string) ([]model.Word, error) {
	filename := fmt.Sprintf("words_%s.json", level)
	filePath := filepath.Join(s.config.WordLib.DataPath, filename)

	data, err := os.ReadFile(filePath)
	if err != nil {
		return nil, err
	}

	var words []model.Word
	if err := json.Unmarshal(data, &words); err != nil {
		return nil, err
	}

	return words, nil
}

// randomSelect Fisher-Yates洗牌算法随机抽取
func (s *WordService) randomSelect(words []model.Word, count int) []model.Word {
	if count >= len(words) {
		return words
	}

	// 创建副本避免修改原数组
	wordsCopy := make([]model.Word, len(words))
	copy(wordsCopy, words)

	// 设置随机种子
	r := rand.New(rand.NewSource(time.Now().UnixNano()))

	// Fisher-Yates洗牌
	for i := len(wordsCopy) - 1; i > 0; i-- {
		j := r.Intn(i + 1)
		wordsCopy[i], wordsCopy[j] = wordsCopy[j], wordsCopy[i]
	}

	return wordsCopy[:count]
}

// isValidLevel 验证学段是否有效
func (s *WordService) isValidLevel(level string) bool {
	validLevels := map[string]bool{
		model.Primary:    true,
		model.Junior:     true,
		model.Senior:     true,
		model.University: true,
	}
	return validLevels[level]
}
