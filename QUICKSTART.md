# 快速启动指南

## 🚀 5分钟快速启动

### 第一步：启动后端服务

```bash
# 进入后端目录
cd backend

# 下载依赖
go mod tidy

# 启动服务
go run cmd/main.go
```

看到 `Server is running on port :8080` 表示后端启动成功！

### 第二步：启动小程序

1. 打开**微信开发者工具**
2. 选择"导入项目"
3. 项目目录选择：`miniapp` 文件夹
4. AppID选择"测试号"或填写你的AppID
5. 点击"确定"

### 第三步：测试功能

1. 在小程序模拟器中，你会看到首页
2. 点击"开始游戏"按钮
3. 其他页面为占位页面，显示"开发中"

## ✅ 已完成的功能

### 后端服务（100%完成）
- ✅ Go + Gin框架搭建
- ✅ 用户认证API（微信登录、Token验证）
- ✅ 词库管理API（获取词库、版本检查）
- ✅ 四个学段词库数据（每个50个词汇）
- ✅ CORS跨域、错误处理中间件
- ✅ RESTful API设计

### 小程序前端（核心框架完成）
- ✅ 项目结构搭建
- ✅ 工具类完整实现
  - ✅ 存储管理（storage.js）
  - ✅ API请求封装（api.js）
  - ✅ 工具函数（util.js）
- ✅ 首页完整实现
- ✅ 关于页完整实现
- ✅ 其他页面占位框架

### 文档（100%完成）
- ✅ 完整的README文档
- ✅ 部署指南
- ✅ API接口文档
- ✅ 快速启动指南

## 📝 后续开发建议

以下页面需要继续开发（已创建占位文件）：

1. **启动页** (`pages/launch`) - 实现授权登录逻辑
2. **设置页** (`pages/settings`) - 实现游戏参数配置
3. **准备页** (`pages/prepare`) - 实现游戏准备界面
4. **游戏页** (`pages/game`) - 实现核心游戏逻辑
5. **结果页** (`pages/result`) - 实现成绩展示
6. **历史记录页** (`pages/history`) - 实现记录列表和详情

## 🎯 测试接口

### 测试后端API

```bash
# 健康检查
curl http://localhost:8080/health

# 获取小学词库（10个词汇）
curl "http://localhost:8080/api/words/list?educationLevel=primary&count=10"

# 获取词库版本
curl http://localhost:8080/api/words/version
```

### 预期响应示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "words": [
      {
        "wordId": "p001",
        "content": "苹果",
        "educationLevel": "primary",
        "category": "水果",
        "difficulty": 1,
        "charCount": 2
      }
    ],
    "total": 50,
    "version": "1.0.0"
  }
}
```

## 🔧 配置说明

### 必须修改的配置（生产环境）

1. **后端配置** (`backend/internal/config/config.go`)
   - `WeChat.AppID` - 你的微信小程序AppID
   - `WeChat.AppSecret` - 你的微信小程序AppSecret
   - `JWT.Secret` - 修改为复杂密钥

2. **小程序配置** (`miniapp/app.js`)
   - `apiBase` - 后端API地址（生产环境改为HTTPS域名）

### 可选配置

- 词库数据：`backend/data/words_*.json`
- 服务器端口：`backend/internal/config/config.go` 中的 `Server.Port`

## 📦 项目结构

```
miniapp/
├── backend/          # Go后端服务
│   ├── cmd/         # 主程序
│   ├── internal/    # 内部代码
│   └── data/        # 词库数据
│
└── miniapp/         # 小程序前端
    ├── pages/       # 页面文件
    ├── utils/       # 工具类
    └── app.js       # 应用入口
```

## ❓ 常见问题

**Q: 后端启动失败？**
A: 检查Go版本是否>=1.21，端口8080是否被占用

**Q: 小程序无法连接后端？**
A: 
1. 确认后端已启动
2. 检查 `miniapp/app.js` 中的 `apiBase` 配置
3. 在微信开发者工具中关闭"域名校验"（开发阶段）

**Q: 词库数据在哪里？**
A: `backend/data/` 目录下的 JSON 文件

**Q: 如何添加更多词汇？**
A: 编辑对应学段的JSON文件，重启后端服务即可

## 🎉 下一步

1. 根据需要开发其他页面
2. 完善游戏逻辑和交互
3. 添加更多词汇数据
4. 准备上线部署

祝开发顺利！🚀
