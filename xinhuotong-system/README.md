# 新火通管理系统

## 项目简介

新火通管理系统是新欣火教育的核心管理平台，提供全面的教育机构管理功能，包括学员管理、课程管理、财务管理、数据分析等模块。

## 项目架构

```
新欣火教育官网 (总项目)
├── 官网页面 (index.html, about_us.html, etc.)
└── 新火通管理系统 (子项目)
    ├── 主系统 (index.html)
    ├── 模块管理 (assets/js/xinhuotong-modules.js)
    └── 数据大屏 (modules/data-dashboard/)
```

## 功能模块

### 1. 中心首页
- 系统概览
- 关键指标展示
- 快捷操作入口
- 待办事项提醒

### 2. 学员管理
- 学员信息管理
- 课时余额查看
- 出勤记录统计

### 3. 课程管理
- 课程信息维护
- 价格设置管理
- 课时配置

### 4. 班级管理
- 班级信息管理
- 排课安排
- 学员分配

### 5. 课表管理
- 课程安排
- 时间调度
- 教室分配

### 6. 财务管理
- 收支记录
- 课时购买
- 财务报表

### 7. 数据中心
- 数据分析
- 报表生成
- 业务洞察
- 数据大屏

### 8. 系统设置
- 系统配置
- 用户管理
- 权限设置

## 技术栈

- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **图表库**: Chart.js
- **样式**: 自定义CSS + 统一风格系统
- **架构**: 模块化设计

## 快速开始

### 1. 启动开发服务器

```bash
# 进入项目目录
cd xinhuotong-system

# 启动本地服务器
python -m http.server 8001

# 或者使用npm脚本
npm start
```

### 2. 访问系统

打开浏览器访问: `http://localhost:8001`

## 项目结构

```
xinhuotong-system/
├── index.html                 # 主入口文件
├── package.json              # 项目配置
├── README.md                 # 项目说明
├── assets/                   # 静态资源
│   ├── css/
│   │   └── xinhuotong.css    # 系统样式
│   ├── js/
│   │   ├── xinhuotong-core.js      # 核心功能
│   │   └── xinhuotong-modules.js   # 模块管理
│   └── images/               # 图片资源
└── modules/                  # 功能模块
    └── data-dashboard/       # 数据大屏模块
        └── data-dashboard.js # 数据大屏功能
```

## 开发指南

### 添加新模块

1. 在 `assets/js/xinhuotong-modules.js` 中添加新的模块函数
2. 在侧边栏菜单中添加对应的链接
3. 在 `switchModule` 函数中添加对应的 case

### 自定义样式

所有样式定义在 `assets/css/xinhuotong.css` 中，遵循以下命名规范：

- `.xinhuotong-*`: 主容器相关
- `.sidebar-*`: 侧边栏相关
- `.module-*`: 模块相关
- `.chart-*`: 图表相关

### API 集成

系统使用 `../assets/js/xinhuotong-api.js` 进行数据交互，支持：

- 用户认证
- 数据获取
- 实时更新

## 部署说明

### 本地部署

1. 将整个 `xinhuotong-system` 目录上传到服务器
2. 确保服务器支持静态文件访问
3. 配置域名指向系统目录

### 生产环境

建议使用以下优化：

1. 压缩CSS和JavaScript文件
2. 启用Gzip压缩
3. 配置CDN加速
4. 设置缓存策略

## 浏览器支持

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 更新日志

### v1.0.0 (2024-10-08)
- 初始版本发布
- 完成基础功能模块
- 集成数据大屏系统
- 实现响应式设计

## 许可证

MIT License

## 联系方式

- 项目维护: 新欣火教育技术团队
- 邮箱: tech@xinxinhuo.edu
- 官网: https://xinxinhuo.edu

---

**注意**: 本系统为新欣火教育内部使用，请勿外传或用于商业用途。
