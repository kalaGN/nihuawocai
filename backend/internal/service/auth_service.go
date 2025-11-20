package service

import (
	"crypto/md5"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/charades-game/backend/internal/config"
	"github.com/charades-game/backend/internal/model"
	"github.com/golang-jwt/jwt/v5"
)

type AuthService struct {
	config *config.Config
	users  map[string]*model.User // 简单内存存储，生产环境应使用数据库
}

func NewAuthService(cfg *config.Config) *AuthService {
	return &AuthService{
		config: cfg,
		users:  make(map[string]*model.User),
	}
}

// WeChatLoginRequest 微信登录请求
type WeChatLoginRequest struct {
	Code      string `json:"code"`
	NickName  string `json:"nickName"`
	AvatarURL string `json:"avatarUrl"`
}

// WeChatLoginResponse 微信登录响应
type WeChatLoginResponse struct {
	UserID    string `json:"userId"`
	Token     string `json:"token"`
	ExpiresIn int64  `json:"expiresIn"`
	IsNewUser bool   `json:"isNewUser"`
}

// WeChatSession 微信返回的session数据
type WeChatSession struct {
	OpenID     string `json:"openid"`
	SessionKey string `json:"session_key"`
	ErrCode    int    `json:"errcode"`
	ErrMsg     string `json:"errmsg"`
}

// WeChatLogin 微信登录
func (s *AuthService) WeChatLogin(req *WeChatLoginRequest) (*WeChatLoginResponse, error) {
	// 调用微信API获取openid
	session, err := s.code2Session(req.Code)
	if err != nil {
		return nil, err
	}

	if session.ErrCode != 0 {
		return nil, errors.New(session.ErrMsg)
	}

	// 检查用户是否存在
	user, exists := s.users[session.OpenID]
	isNewUser := !exists

	if !exists {
		// 创建新用户
		user = &model.User{
			UserID:    s.generateUserID(session.OpenID),
			OpenID:    session.OpenID,
			NickName:  req.NickName,
			AvatarURL: req.AvatarURL,
			CreatedAt: time.Now(),
		}
		s.users[session.OpenID] = user
	} else {
		// 更新用户信息
		if req.NickName != "" {
			user.NickName = req.NickName
		}
		if req.AvatarURL != "" {
			user.AvatarURL = req.AvatarURL
		}
	}

	// 生成token
	token, err := s.generateToken(user.UserID)
	if err != nil {
		return nil, err
	}

	return &WeChatLoginResponse{
		UserID:    user.UserID,
		Token:     token,
		ExpiresIn: int64(s.config.JWT.ExpireTime.Seconds()),
		IsNewUser: isNewUser,
	}, nil
}

// VerifyToken 验证token
func (s *AuthService) VerifyToken(tokenString string) (string, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(s.config.JWT.Secret), nil
	})

	if err != nil {
		return "", err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		userID, ok := claims["user_id"].(string)
		if !ok {
			return "", errors.New("invalid token claims")
		}
		return userID, nil
	}

	return "", errors.New("invalid token")
}

// code2Session 通过code换取openid
func (s *AuthService) code2Session(code string) (*WeChatSession, error) {
	url := fmt.Sprintf(
		"https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code",
		s.config.WeChat.AppID,
		s.config.WeChat.AppSecret,
		code,
	)

	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var session WeChatSession
	if err := json.Unmarshal(body, &session); err != nil {
		return nil, err
	}

	return &session, nil
}

// generateToken 生成JWT token
func (s *AuthService) generateToken(userID string) (string, error) {
	claims := jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(s.config.JWT.ExpireTime).Unix(),
		"iat":     time.Now().Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(s.config.JWT.Secret))
}

// generateUserID 生成用户ID
func (s *AuthService) generateUserID(openID string) string {
	hash := md5.Sum([]byte(openID + time.Now().String()))
	return "u_" + hex.EncodeToString(hash[:])[:16]
}
