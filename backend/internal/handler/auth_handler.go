package handler

import (
	"github.com/charades-game/backend/internal/response"
	"github.com/charades-game/backend/internal/service"
	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	authService *service.AuthService
}

func NewAuthHandler(authService *service.AuthService) *AuthHandler {
	return &AuthHandler{
		authService: authService,
	}
}

// WeChatLogin 微信登录
func (h *AuthHandler) WeChatLogin(c *gin.Context) {
	var req service.WeChatLoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.ErrorWithMsg(c, response.ErrInvalidCode, "参数错误")
		return
	}

	resp, err := h.authService.WeChatLogin(&req)
	if err != nil {
		response.ErrorWithMsg(c, response.ErrInvalidCode, err.Error())
		return
	}

	response.SuccessWithData(c, resp)
}

// VerifyToken 验证token
func (h *AuthHandler) VerifyToken(c *gin.Context) {
	var req struct {
		Token string `json:"token" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		response.ErrorWithMsg(c, response.ErrTokenInvalid, "参数错误")
		return
	}

	userID, err := h.authService.VerifyToken(req.Token)
	if err != nil {
		response.Error(c, response.ErrTokenInvalid)
		return
	}

	response.SuccessWithData(c, gin.H{
		"userId": userID,
		"valid":  true,
	})
}
