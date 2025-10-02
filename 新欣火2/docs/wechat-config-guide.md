# 微信订阅消息配置指南

## 🔧 配置步骤

### 1. 获取微信小程序 AppSecret

1. 登录 [微信公众平台](https://mp.weixin.qq.com/)
2. 选择你的小程序
3. 进入"开发" -> "开发管理" -> "开发设置"
4. 复制 `AppSecret(小程序密钥)`

### 2. 修改配置文件

编辑 `uniCloud-aliyun/cloudfunctions/common/wx-config.js`：

```javascript
// 微信小程序配置
module.exports = {
    // 小程序 appid
    appid: 'wx9f7a595a2467a31d',
    
    // 小程序 secret (替换为你的真实secret)
    secret: '你的真实AppSecret',  // ← 在这里填入你的AppSecret
    
    // 订阅消息模板ID
    templates: {
        scheduleNotification: 'sOwar1Xkzk4SZFH6UbFz_ZA8DZjHHPZf4'
    },
    
    // 微信API接口地址
    api: {
        accessToken: 'https://api.weixin.qq.com/cgi-bin/token',
        sendSubscribeMessage: 'https://api.weixin.qq.com/cgi-bin/message/subscribe/send'
    }
};
```

### 3. 重新部署云函数

1. 在 HBuilderX 中右键点击 `uniCloud-aliyun/cloudfunctions/` 文件夹
2. 选择"上传所有云函数、公共模块及actions"
3. 等待部署完成

## 📱 功能说明

### 测试模式 vs 真实模式

- **测试模式**：当 openid 以 `mock_openid` 开头时，只记录到数据库，不发送真实微信消息
- **真实模式**：当 openid 是真实的微信 openid 时，会调用微信API发送订阅消息

### 订阅消息内容

模板字段对应关系：
- `thing1.DATA` → 课程名称
- `time2.DATA` → 上课时间  
- `thing3.DATA` → 备注
- `thing4.DATA` → 学员姓名

## 🚨 注意事项

1. **AppSecret 安全**：不要将 AppSecret 提交到代码仓库
2. **模板ID**：确保模板ID与微信公众平台申请的一致
3. **权限设置**：确保小程序有发送订阅消息的权限
4. **测试环境**：建议先在测试环境验证功能

## 🔍 故障排查

### 常见错误

1. **access_token 获取失败**
   - 检查 AppID 和 AppSecret 是否正确
   - 确认小程序状态是否正常

2. **订阅消息发送失败**
   - 检查模板ID是否正确
   - 确认用户是否已授权订阅
   - 查看微信API返回的具体错误信息

3. **云函数部署失败**
   - 检查网络连接
   - 确认服务空间配置
   - 查看云函数日志

## 📞 获取帮助

如果遇到问题：
1. 查看云函数运行日志
2. 检查微信公众平台配置
3. 确认小程序权限设置
4. 参考 [微信官方文档](https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/subscribe-message/subscribeMessage.send.html)
