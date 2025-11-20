package config

import (
	"time"
)

// Config 应用配置
type Config struct {
	Server   ServerConfig
	JWT      JWTConfig
	WeChat   WeChatConfig
	WordLib  WordLibConfig
}

// ServerConfig 服务器配置
type ServerConfig struct {
	Port         string
	ReadTimeout  time.Duration
	WriteTimeout time.Duration
}

// JWTConfig JWT配置
type JWTConfig struct {
	Secret     string
	ExpireTime time.Duration
}

// WeChatConfig 微信配置
type WeChatConfig struct {
	AppID     string
	AppSecret string
}

// WordLibConfig 词库配置
type WordLibConfig struct {
	Version  string
	DataPath string
}

// GetConfig 获取默认配置
func GetConfig() *Config {
	return &Config{
		Server: ServerConfig{
			Port:         ":8080",
			ReadTimeout:  15 * time.Second,
			WriteTimeout: 15 * time.Second,
		},
		JWT: JWTConfig{
			Secret:     "your-secret-key-change-in-production",
			ExpireTime: 30 * 24 * time.Hour, // 30天
		},
		WeChat: WeChatConfig{
			AppID:     "your-wechat-appid",
			AppSecret: "your-wechat-appsecret",
		},
		WordLib: WordLibConfig{
			Version:  "1.0.0",
			DataPath: "./data",
		},
	}
}
