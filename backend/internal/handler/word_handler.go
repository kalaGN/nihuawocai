package handler

import (
	"github.com/charades-game/backend/internal/response"
	"github.com/charades-game/backend/internal/service"
	"github.com/gin-gonic/gin"
)

type WordHandler struct {
	wordService *service.WordService
}

func NewWordHandler(wordService *service.WordService) *WordHandler {
	return &WordHandler{
		wordService: wordService,
	}
}

// GetWordList 获取词汇列表
func (h *WordHandler) GetWordList(c *gin.Context) {
	var req service.GetWordListRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		response.ErrorWithMsg(c, response.ErrInvalidLevel, "参数错误")
		return
	}

	resp, err := h.wordService.GetWordList(&req)
	if err != nil {
		if err.Error() == "invalid education level" {
			response.Error(c, response.ErrInvalidLevel)
		} else {
			response.Error(c, response.ErrWordNotFound)
		}
		return
	}

	response.SuccessWithData(c, resp)
}

// GetVersion 获取词库版本
func (h *WordHandler) GetVersion(c *gin.Context) {
	version := h.wordService.GetVersion()
	response.SuccessWithData(c, gin.H{
		"version": version,
	})
}
