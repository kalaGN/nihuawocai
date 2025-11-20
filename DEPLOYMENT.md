# 部署指南

## 后端部署

### 1. 环境准备
```bash
# 安装Go 1.21或更高版本
go version
```

### 2. 配置微信小程序信息
编辑 `backend/internal/config/config.go`：
```go
WeChat: WeChatConfig{
    AppID:     "填写你的微信小程序AppID",
    AppSecret: "填写你的微信小程序AppSecret",
},
JWT: JWTConfig{
    Secret:     "修改为复杂的密钥（生产环境）",
    ExpireTime: 30 * 24 * time.Hour,
},
```

### 3. 启动后端服务
```bash
cd backend
go mod tidy
go run cmd/main.go
```

服务将在 http://localhost:8080 启动

### 4. 生产环境部署
```bash
# 编译
go build -o charades-server cmd/main.go

# 运行
./charades-server
```

## 小程序部署

### 1. 配置后端API地址
编辑 `miniapp/app.js`：
```javascript
globalData: {
  apiBase: 'https://your-domain.com/api'  // 修改为实际后端地址
}
```

### 2. 配置AppID
在微信开发者工具中配置你的小程序AppID

### 3. 上传代码
1. 在微信开发者工具中点击"上传"
2. 填写版本号和描述
3. 在微信公众平台提交审核

### 4. 配置服务器域名
在微信公众平台后台配置：
- request合法域名：https://your-domain.com
- uploadFile合法域名：https://your-domain.com
- downloadFile合法域名：https://your-domain.com

## 注意事项

1. **生产环境必须使用HTTPS**
2. **修改JWT密钥为复杂字符串**
3. **配置合法域名后才能正式发布**
4. **词库可根据需要扩充data目录下的JSON文件**

## 测试

### 后端测试
```bash
# 测试健康检查
curl http://localhost:8080/health

# 测试获取词库
curl "http://localhost:8080/api/words/list?educationLevel=primary&count=10"
```

### 小程序测试
使用微信开发者工具的模拟器或真机预览功能进行测试
