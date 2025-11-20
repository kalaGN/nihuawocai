package model

import "time"

// User 用户模型
type User struct {
	UserID    string    `json:"userId"`
	OpenID    string    `json:"openId"`
	NickName  string    `json:"nickName"`
	AvatarURL string    `json:"avatarUrl"`
	CreatedAt time.Time `json:"createdAt"`
}

// Word 词汇模型
type Word struct {
	WordID         string `json:"wordId"`
	Content        string `json:"content"`
	EducationLevel string `json:"educationLevel"`
	Category       string `json:"category"`
	Difficulty     int    `json:"difficulty"`
	CharCount      int    `json:"charCount"`
	CreatedAt      int64  `json:"createdAt"`
}

// EducationLevel 学段常量
const (
	Primary    = "primary"    // 小学
	Junior     = "junior"     // 初中
	Senior     = "senior"     // 高中
	University = "university" // 大学
)
