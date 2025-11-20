package response

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

// Response 通用响应结构
type Response struct {
	Code    int         `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

// 错误码定义
const (
	Success = 0

	// 认证相关错误 10001-10099
	ErrInvalidCode  = 10001
	ErrTokenExpired = 10002
	ErrTokenInvalid = 10003

	// 词库相关错误 20001-20099
	ErrWordNotFound    = 20001
	ErrInvalidLevel    = 20002

	// 服务器错误 50000+
	ErrInternalServer = 50000
)

// 错误信息映射
var errMsg = map[int]string{
	Success:            "success",
	ErrInvalidCode:     "无效的code",
	ErrTokenExpired:    "token已过期",
	ErrTokenInvalid:    "token无效",
	ErrWordNotFound:    "词库数据不存在",
	ErrInvalidLevel:    "学段参数错误",
	ErrInternalServer:  "服务器内部错误",
}

// SuccessWithData 成功响应（带数据）
func SuccessWithData(c *gin.Context, data interface{}) {
	c.JSON(http.StatusOK, Response{
		Code:    Success,
		Message: errMsg[Success],
		Data:    data,
	})
}

// SuccessWithoutData 成功响应（无数据）
func SuccessWithoutData(c *gin.Context) {
	c.JSON(http.StatusOK, Response{
		Code:    Success,
		Message: errMsg[Success],
	})
}

// Error 错误响应
func Error(c *gin.Context, code int) {
	message, ok := errMsg[code]
	if !ok {
		message = "未知错误"
	}
	
	c.JSON(http.StatusOK, Response{
		Code:    code,
		Message: message,
	})
}

// ErrorWithMsg 错误响应（自定义消息）
func ErrorWithMsg(c *gin.Context, code int, message string) {
	c.JSON(http.StatusOK, Response{
		Code:    code,
		Message: message,
	})
}
