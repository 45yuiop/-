# 云存储集成说明

## 当前状态
目前使用的是模拟的云存储URL，图片实际上并没有真正上传到云端。

## 集成真实云存储的步骤

### 1. UniCloud 集成
```javascript
// 在 news-edit.vue 中替换 mockUploadToCloud 方法
async uploadImageToCloud(filePath) {
    try {
        // 调用云函数上传图片
        const result = await uniCloud.callFunction({
            name: 'uploadImage',
            data: {
                filePath: filePath
            }
        });
        
        if (result.result.success) {
            return result.result.fileID; // 返回云存储文件ID
        } else {
            throw new Error(result.result.error);
        }
    } catch (error) {
        throw error;
    }
}
```

### 2. 云函数配置
创建 `uniCloud/cloudfunctions/uploadImage/index.js`:
```javascript
'use strict';
const cloud = require('wx-server-sdk');

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});

exports.main = async (event, context) => {
    try {
        const { filePath } = event;
        
        // 上传文件到云存储
        const result = await cloud.uploadFile({
            cloudPath: `news-images/${Date.now()}_${Math.random().toString(36).substring(2)}.jpg`,
            fileContent: filePath
        });
        
        return {
            success: true,
            fileID: result.fileID
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};
```

### 3. 图片访问
使用云存储文件ID访问图片：
```javascript
// 在显示图片时使用
imageUrl: cloudUrl // 这是云存储的文件ID或URL
```

## 优势
- 跨设备访问：图片存储在云端，任何设备都能访问
- 数据持久化：图片不会因为设备切换而丢失
- 性能优化：云存储提供CDN加速
- 成本控制：按实际使用量计费

## 注意事项
- 需要配置UniCloud服务
- 图片上传有大小限制
- 建议添加图片压缩功能
- 考虑添加图片格式验证
