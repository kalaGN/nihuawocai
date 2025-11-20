package main

import (
	"log"
	"net/http"

	"github.com/charades-game/backend/internal/config"
	"github.com/charades-game/backend/internal/handler"
	"github.com/charades-game/backend/internal/middleware"
	"github.com/charades-game/backend/internal/service"
	"github.com/gin-gonic/gin"
)

func main() {
	// 加载配置
	cfg := config.GetConfig()

	// 初始化服务
	wordService := service.NewWordService(cfg)
	authService := service.NewAuthService(cfg)

	// 初始化处理器
	authHandler := handler.NewAuthHandler(authService)
	wordHandler := handler.NewWordHandler(wordService)

	// 创建路由
	r := gin.Default()

	// 使用中间件
	r.Use(middleware.CORS())
	r.Use(middleware.ErrorHandler())

	// API路由组
	api := r.Group("/api")
	{
		// 认证相关
		auth := api.Group("/auth")
		{
			auth.POST("/wechat-login", authHandler.WeChatLogin)
			auth.POST("/verify-token", authHandler.VerifyToken)
		}

		// 词库相关
		words := api.Group("/words")
		{
			words.GET("/list", wordHandler.GetWordList)
			words.GET("/version", wordHandler.GetVersion)
		}
	}

	// 健康检查
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	// 启动服务器
	server := &http.Server{
		Addr:           cfg.Server.Port,
		Handler:        r,
		ReadTimeout:    cfg.Server.ReadTimeout,
		WriteTimeout:   cfg.Server.WriteTimeout,
		MaxHeaderBytes: 1 << 20,
	}

	log.Printf("Server is running on port %s", cfg.Server.Port)
	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("Failed to start server: %v", err)
	}
}
