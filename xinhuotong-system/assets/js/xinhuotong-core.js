/**
 * 新火通管理系统核心JavaScript
 * 负责模块切换、数据加载、事件处理等核心功能
 */

// 全局变量
let currentModule = 'dashboard';
let isDataLoaded = false;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('新火通管理系统初始化中...');
    
    // 初始化系统
    initializeSystem();
    
    // 加载数据
    loadSystemData();
    
    // 绑定事件
    bindEvents();
    
    console.log('新火通管理系统初始化完成');
});

/**
 * 初始化系统
 */
function initializeSystem() {
    // 设置默认模块
    switchModule('dashboard');
    
    // 初始化工具提示
    initializeTooltips();
    
    // 初始化通知系统
    initializeNotifications();
}

/**
 * 模块切换功能
 * @param {string} module - 模块名称
 * @param {Event} event - 点击事件
 */
function switchModule(module, event) {
    console.log(`切换到模块: ${module}`);
    
    // 更新当前模块
    currentModule = module;
    
    // 移除所有活动状态
    document.querySelectorAll('.sidebar-menu a').forEach(link => {
        link.classList.remove('active');
    });
    
    // 添加当前活动状态
    if (event && event.target) {
        event.target.classList.add('active');
    } else {
        // 如果没有event参数，通过模块名找到对应的链接
        const targetLink = document.querySelector(`a[onclick*="switchModule('${module}')"]`);
        if (targetLink) {
            targetLink.classList.add('active');
        }
    }
    
    // 根据模块显示不同内容
    const contentArea = document.querySelector('.content-area');
    
    switch(module) {
        case 'dashboard':
            showDashboard();
            break;
        case 'students':
            showStudentsModule();
            break;
        case 'courses':
            showCoursesModule();
            break;
        case 'classes':
            showClassesModule();
            break;
        case 'schedule':
            showScheduleModule();
            break;
        case 'finance':
            showFinanceModule();
            break;
        case 'data':
            showDataModule();
            break;
        case 'settings':
            showSettingsModule();
            break;
        default:
            showDashboard();
    }
    
    // 显示切换动画
    contentArea.classList.add('fade-in');
    setTimeout(() => {
        contentArea.classList.remove('fade-in');
    }, 600);
}

/**
 * 显示仪表板
 */
function showDashboard() {
    const contentArea = document.querySelector('.content-area');
    contentArea.innerHTML = `
        <div class="page-header fade-in">
            <h1 class="page-title">新火通管理系统</h1>
            <p class="page-subtitle">为教育产业赋能 - 智能教育管理平台</p>
        </div>
        
        <div class="module-content fade-in">
            <!-- 统计卡片 -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">👥</div>
                    <div class="stat-content">
                        <div class="stat-value" id="totalStudents">44</div>
                        <div class="stat-label">学员总数</div>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">📚</div>
                    <div class="stat-content">
                        <div class="stat-value" id="totalCourses">51</div>
                        <div class="stat-label">课程总数</div>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">👨‍🏫</div>
                    <div class="stat-content">
                        <div class="stat-value" id="totalTeachers">40</div>
                        <div class="stat-label">教师总数</div>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">🏫</div>
                    <div class="stat-content">
                        <div class="stat-value" id="totalClasses">11</div>
                        <div class="stat-label">班级总数</div>
                    </div>
                </div>
            </div>
            
            <!-- 快捷入口 -->
            <div class="quick-actions">
                <h3>快捷入口</h3>
                <div class="action-grid">
                    <button class="action-btn" onclick="switchModule('students', event)">
                        <span class="action-icon">👥</span>
                        <span class="action-text">学员管理</span>
                    </button>
                    <button class="action-btn" onclick="switchModule('courses', event)">
                        <span class="action-icon">📚</span>
                        <span class="action-text">课程管理</span>
                    </button>
                    <button class="action-btn" onclick="switchModule('finance', event)">
                        <span class="action-icon">💰</span>
                        <span class="action-text">财务管理</span>
                    </button>
                    <button class="action-btn" onclick="switchModule('data', event)">
                        <span class="action-icon">📊</span>
                        <span class="action-text">数据中心</span>
                    </button>
                </div>
            </div>
            
            <!-- 待办事项 -->
            <div class="todo-section">
                <h3>待办事项</h3>
                <div class="todo-list">
                    <div class="todo-item">
                        <span class="todo-icon">📝</span>
                        <span class="todo-text">审核新学员注册申请</span>
                        <span class="todo-count">5</span>
                    </div>
                    <div class="todo-item">
                        <span class="todo-icon">💰</span>
                        <span class="todo-text">处理课时购买订单</span>
                        <span class="todo-count">12</span>
                    </div>
                    <div class="todo-item">
                        <span class="todo-icon">📅</span>
                        <span class="todo-text">安排下周课程表</span>
                        <span class="todo-count">3</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // 重新加载数据
    loadDashboardData();
}

/**
 * 加载系统数据
 */
async function loadSystemData() {
    try {
        console.log('正在加载系统数据...');
        
        // 这里可以调用API获取数据
        // const data = await XinhuotongAPI.getSystemData();
        
        // 模拟数据加载
        setTimeout(() => {
            updateDashboardStats();
            isDataLoaded = true;
            console.log('系统数据加载完成');
        }, 1000);
        
    } catch (error) {
        console.error('加载系统数据失败:', error);
        showNotification('数据加载失败，请稍后重试', 'error');
    }
}

/**
 * 更新仪表板统计数据
 */
function updateDashboardStats() {
    // 这里可以更新实际的统计数据
    const stats = {
        students: 44,
        courses: 51,
        teachers: 40,
        classes: 11
    };
    
    // 更新DOM元素
    const elements = {
        totalStudents: document.getElementById('totalStudents'),
        totalCourses: document.getElementById('totalCourses'),
        totalTeachers: document.getElementById('totalTeachers'),
        totalClasses: document.getElementById('totalClasses')
    };
    
    Object.keys(elements).forEach(key => {
        if (elements[key]) {
            elements[key].textContent = stats[key.replace('total', '').toLowerCase()];
        }
    });
}

/**
 * 加载仪表板数据
 */
function loadDashboardData() {
    if (isDataLoaded) {
        updateDashboardStats();
    }
}

/**
 * 绑定事件
 */
function bindEvents() {
    // 添加点击事件监听
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('stat-card')) {
            e.target.classList.add('pulse');
            setTimeout(() => {
                e.target.classList.remove('pulse');
            }, 2000);
        }
    });
    
    // 键盘快捷键
    document.addEventListener('keydown', function(e) {
        // ESC键返回仪表板
        if (e.key === 'Escape') {
            switchModule('dashboard');
        }
    });
}

/**
 * 初始化工具提示
 */
function initializeTooltips() {
    // 这里可以初始化工具提示功能
    console.log('工具提示初始化完成');
}

/**
 * 初始化通知系统
 */
function initializeNotifications() {
    // 创建通知容器
    if (!document.getElementById('notification-container')) {
        const notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        notificationContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            pointer-events: none;
        `;
        document.body.appendChild(notificationContainer);
    }
}

/**
 * 显示通知
 * @param {string} message - 通知消息
 * @param {string} type - 通知类型 (success, error, info, warning)
 */
function showNotification(message, type = 'info') {
    const container = document.getElementById('notification-container');
    if (!container) return;
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        background: ${getNotificationColor(type)};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        margin-bottom: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        pointer-events: auto;
        max-width: 300px;
        word-wrap: break-word;
    `;
    notification.textContent = message;
    
    container.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 自动隐藏
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

/**
 * 获取通知颜色
 * @param {string} type - 通知类型
 * @returns {string} 颜色值
 */
function getNotificationColor(type) {
    const colors = {
        success: '#4CAF50',
        error: '#F44336',
        info: '#2196F3',
        warning: '#FF9800'
    };
    return colors[type] || colors.info;
}

/**
 * 刷新数据
 */
function refreshData() {
    console.log('刷新数据中...');
    showNotification('正在刷新数据...', 'info');
    
    // 重新加载数据
    loadSystemData();
    
    // 如果当前在仪表板，重新显示
    if (currentModule === 'dashboard') {
        showDashboard();
    }
}

/**
 * 导出数据
 */
function exportData() {
    console.log('导出数据中...');
    showNotification('数据导出功能正在开发中...', 'info');
}

/**
 * 生成报表
 */
function generateReport() {
    console.log('生成报表中...');
    showNotification('报表生成功能正在开发中...', 'info');
}

// 导出全局函数
window.XinhuotongCore = {
    switchModule,
    showNotification,
    refreshData,
    exportData,
    generateReport
};
