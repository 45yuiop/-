/**
 * 数据大屏模块
 * 专门用于展示关键业务数据的可视化大屏
 */

class DataDashboard {
    constructor() {
        this.charts = {};
        this.isInitialized = false;
        this.updateInterval = null;
    }

    /**
     * 初始化数据大屏
     */
    init() {
        if (this.isInitialized) return;
        
        console.log('初始化数据大屏...');
        
        // 创建大屏容器
        this.createDashboardContainer();
        
        // 初始化图表
        this.initCharts();
        
        // 开始数据更新
        this.startDataUpdate();
        
        this.isInitialized = true;
        console.log('数据大屏初始化完成');
    }

    /**
     * 创建大屏容器
     */
    createDashboardContainer() {
        const contentArea = document.querySelector('.content-area');
        contentArea.innerHTML = `
            <div class="data-dashboard-fullscreen">
                <div class="dashboard-sidebar">
                    <div class="dashboard-title">
                        <h3>数据大屏</h3>
                        <p>实时业务监控</p>
                    </div>
                    
                    <div class="dashboard-options">
                        <button class="option-btn active" onclick="dataDashboard.switchView('overview', event)">
                            <span class="option-icon">📊</span>
                            <span class="option-text">数据概览</span>
                        </button>
                        <button class="option-btn" onclick="dataDashboard.switchView('realtime', event)">
                            <span class="option-icon">⚡</span>
                            <span class="option-text">实时监控</span>
                        </button>
                        <button class="option-btn" onclick="dataDashboard.switchView('trends', event)">
                            <span class="option-icon">📈</span>
                            <span class="option-text">趋势分析</span>
                        </button>
                        <button class="option-btn" onclick="dataDashboard.switchView('alerts', event)">
                            <span class="option-icon">🚨</span>
                            <span class="option-text">告警中心</span>
                        </button>
                    </div>
                    
                    <div class="dashboard-actions">
                        <button class="action-btn" onclick="dataDashboard.exportData()">📊 导出</button>
                        <button class="action-btn" onclick="dataDashboard.refreshData()">🔄 刷新</button>
                    </div>
                </div>
                
                <div class="dashboard-main">
                    <div class="dashboard-content" id="dashboardContent">
                        <!-- 数据概览内容 -->
                    </div>
                </div>
            </div>
        `;
        
        // 添加大屏样式
        this.addDashboardStyles();
    }

    /**
     * 添加大屏样式
     */
    addDashboardStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .data-dashboard-fullscreen {
                display: flex;
                height: 100vh;
                background: #0a0e27;
                margin: -30px;
                padding: 0;
                position: relative;
            }
            
            .dashboard-sidebar {
                width: 250px;
                background: rgba(30, 77, 139, 0.95);
                backdrop-filter: blur(10px);
                border-right: 1px solid rgba(255, 255, 255, 0.1);
                padding: 20px;
                display: flex;
                flex-direction: column;
                gap: 20px;
                position: fixed;
                left: 0;
                top: 0;
                height: 100vh;
                z-index: 1000;
                overflow-y: auto;
            }
            
            .dashboard-title h3 {
                color: #00ffff;
                font-size: 18px;
                margin-bottom: 5px;
                text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
            }
            
            .dashboard-title p {
                color: rgba(255, 255, 255, 0.7);
                font-size: 12px;
                margin: 0;
            }
            
            .dashboard-options {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            
            .option-btn {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px 16px;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 8px;
                color: rgba(255, 255, 255, 0.8);
                cursor: pointer;
                transition: all 0.3s ease;
                text-align: left;
            }
            
            .option-btn:hover {
                background: rgba(0, 255, 255, 0.2);
                border-color: rgba(0, 255, 255, 0.5);
                color: #00ffff;
                transform: translateX(5px);
            }
            
            .option-btn.active {
                background: rgba(0, 255, 255, 0.3);
                border-color: #00ffff;
                color: #00ffff;
                box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
            }
            
            .option-icon {
                font-size: 16px;
                width: 20px;
                text-align: center;
            }
            
            .option-text {
                font-size: 14px;
                font-weight: 500;
            }
            
            .dashboard-actions {
                display: flex;
                gap: 10px;
                margin-top: auto;
            }
            
            .action-btn {
                flex: 1;
                padding: 8px 12px;
                background: rgba(0, 255, 255, 0.1);
                border: 1px solid rgba(0, 255, 255, 0.3);
                border-radius: 6px;
                color: #00ffff;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 12px;
            }
            
            .action-btn:hover {
                background: rgba(0, 255, 255, 0.2);
                border-color: #00ffff;
            }
            
            .dashboard-main {
                flex: 1;
                padding: 20px;
                overflow-y: auto;
                background: #0a0e27;
                margin-left: 250px;
                width: calc(100% - 250px);
            }
            
            .dashboard-content {
                background: transparent;
                border: none;
                border-radius: 0;
                padding: 0;
            }
            
            .kpi-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }
            
            .kpi-card {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                padding: 20px;
                text-align: center;
                transition: all 0.3s ease;
            }
            
            .kpi-card:hover {
                background: rgba(0, 255, 255, 0.1);
                border-color: rgba(0, 255, 255, 0.3);
                transform: translateY(-5px);
            }
            
            .kpi-icon {
                font-size: 2rem;
                margin-bottom: 10px;
            }
            
            .kpi-value {
                color: #00ffff;
                font-size: 2rem;
                font-weight: bold;
                margin-bottom: 5px;
                text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
            }
            
            .kpi-label {
                color: rgba(255, 255, 255, 0.7);
                font-size: 0.9rem;
            }
            
            .chart-grid {
                display: grid;
                grid-template-columns: 2fr 1fr;
                gap: 20px;
                margin-bottom: 30px;
            }
            
            .chart-panel {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                padding: 20px;
            }
            
            .chart-title {
                color: #00ffff;
                font-size: 16px;
                margin-bottom: 15px;
                text-align: center;
            }
            
            .chart-container {
                height: 300px;
                position: relative;
            }
            
            .realtime-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 15px;
            }
            
            .realtime-item {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 8px;
                padding: 15px;
                text-align: center;
            }
            
            .realtime-value {
                color: #00ffff;
                font-size: 1.5rem;
                font-weight: bold;
                margin-bottom: 5px;
            }
            
            .realtime-label {
                color: rgba(255, 255, 255, 0.7);
                font-size: 0.8rem;
            }
            
            @media (max-width: 768px) {
                .dashboard-sidebar {
                    width: 200px;
                    transform: translateX(-100%);
                    transition: transform 0.3s ease;
                }
                
                .dashboard-sidebar.open {
                    transform: translateX(0);
                }
                
                .dashboard-main {
                    margin-left: 0;
                    width: 100%;
                }
                
                .chart-grid {
                    grid-template-columns: 1fr;
                }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * 切换视图
     */
    switchView(view, event) {
        // 更新按钮状态
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        if (event && event.target) {
            event.target.classList.add('active');
        }

        const content = document.getElementById('dashboardContent');
        
        switch(view) {
            case 'overview':
                this.showOverview(content);
                break;
            case 'realtime':
                this.showRealtime(content);
                break;
            case 'trends':
                this.showTrends(content);
                break;
            case 'alerts':
                this.showAlerts(content);
                break;
        }
    }

    /**
     * 显示数据概览
     */
    showOverview(content) {
        content.innerHTML = `
            <div class="kpi-grid">
                <div class="kpi-card">
                    <div class="kpi-icon">👥</div>
                    <div class="kpi-value">1,256</div>
                    <div class="kpi-label">总用户数</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-icon">📚</div>
                    <div class="kpi-value">89</div>
                    <div class="kpi-label">活跃课程</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-icon">💰</div>
                    <div class="kpi-value">¥125,680</div>
                    <div class="kpi-label">总收入</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-icon">📊</div>
                    <div class="kpi-value">99.8%</div>
                    <div class="kpi-label">系统稳定性</div>
                </div>
            </div>
            
            <div class="chart-grid">
                <div class="chart-panel">
                    <div class="chart-title">用户增长趋势</div>
                    <div class="chart-container">
                        <canvas id="userGrowthChart"></canvas>
                    </div>
                </div>
                <div class="chart-panel">
                    <div class="chart-title">收入分布</div>
                    <div class="chart-container">
                        <canvas id="revenueChart"></canvas>
                    </div>
                </div>
            </div>
        `;
        
        // 初始化图表
        setTimeout(() => {
            this.initOverviewCharts();
        }, 100);
    }

    /**
     * 显示实时监控
     */
    showRealtime(content) {
        content.innerHTML = `
            <div class="realtime-grid">
                <div class="realtime-item">
                    <div class="realtime-value">12</div>
                    <div class="realtime-label">在线用户</div>
                </div>
                <div class="realtime-item">
                    <div class="realtime-value">8</div>
                    <div class="realtime-label">活跃课程</div>
                </div>
                <div class="realtime-item">
                    <div class="realtime-value">156ms</div>
                    <div class="realtime-label">响应时间</div>
                </div>
                <div class="realtime-item">
                    <div class="realtime-value">2.4GB</div>
                    <div class="realtime-label">内存使用</div>
                </div>
                <div class="realtime-item">
                    <div class="realtime-value">45%</div>
                    <div class="realtime-label">CPU使用率</div>
                </div>
                <div class="realtime-item">
                    <div class="realtime-value">0</div>
                    <div class="realtime-label">错误数量</div>
                </div>
            </div>
        `;
    }

    /**
     * 显示趋势分析
     */
    showTrends(content) {
        content.innerHTML = `
            <div class="chart-grid">
                <div class="chart-panel">
                    <div class="chart-title">访问量趋势</div>
                    <div class="chart-container">
                        <canvas id="visitTrendChart"></canvas>
                    </div>
                </div>
                <div class="chart-panel">
                    <div class="chart-title">用户行为分析</div>
                    <div class="chart-container">
                        <canvas id="behaviorChart"></canvas>
                    </div>
                </div>
            </div>
        `;
        
        setTimeout(() => {
            this.initTrendCharts();
        }, 100);
    }

    /**
     * 显示告警中心
     */
    showAlerts(content) {
        content.innerHTML = `
            <div class="alert-list">
                <div class="alert-item">
                    <div class="alert-icon">⚠️</div>
                    <div class="alert-content">
                        <div class="alert-title">系统负载过高</div>
                        <div class="alert-time">2分钟前</div>
                    </div>
                    <div class="alert-status warning">警告</div>
                </div>
                <div class="alert-item">
                    <div class="alert-icon">✅</div>
                    <div class="alert-content">
                        <div class="alert-title">数据库连接正常</div>
                        <div class="alert-time">5分钟前</div>
                    </div>
                    <div class="alert-status success">正常</div>
                </div>
            </div>
        `;
    }

    /**
     * 初始化概览图表
     */
    initOverviewCharts() {
        if (typeof Chart === 'undefined') return;

        // 用户增长趋势图
        const userGrowthCtx = document.getElementById('userGrowthChart');
        if (userGrowthCtx) {
            new Chart(userGrowthCtx, {
                type: 'line',
                data: {
                    labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
                    datasets: [{
                        label: '用户数',
                        data: [800, 920, 1050, 1100, 1200, 1256],
                        borderColor: '#00ffff',
                        backgroundColor: 'rgba(0, 255, 255, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { color: 'rgba(255, 255, 255, 0.1)' },
                            ticks: { color: 'rgba(255, 255, 255, 0.7)' }
                        },
                        x: {
                            grid: { color: 'rgba(255, 255, 255, 0.1)' },
                            ticks: { color: 'rgba(255, 255, 255, 0.7)' }
                        }
                    }
                }
            });
        }

        // 收入分布图
        const revenueCtx = document.getElementById('revenueChart');
        if (revenueCtx) {
            new Chart(revenueCtx, {
                type: 'doughnut',
                data: {
                    labels: ['课程费用', '会员费', '其他'],
                    datasets: [{
                        data: [70, 20, 10],
                        backgroundColor: ['#00ffff', '#4CAF50', '#FF9800'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    }
                }
            });
        }
    }

    /**
     * 初始化趋势图表
     */
    initTrendCharts() {
        if (typeof Chart === 'undefined') return;

        // 访问量趋势图
        const visitTrendCtx = document.getElementById('visitTrendChart');
        if (visitTrendCtx) {
            new Chart(visitTrendCtx, {
                type: 'bar',
                data: {
                    labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                    datasets: [{
                        label: '访问量',
                        data: [120, 150, 180, 160, 200, 220, 190],
                        backgroundColor: 'rgba(0, 255, 255, 0.3)',
                        borderColor: '#00ffff',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { color: 'rgba(255, 255, 255, 0.1)' },
                            ticks: { color: 'rgba(255, 255, 255, 0.7)' }
                        },
                        x: {
                            grid: { color: 'rgba(255, 255, 255, 0.1)' },
                            ticks: { color: 'rgba(255, 255, 255, 0.7)' }
                        }
                    }
                }
            });
        }

        // 用户行为图
        const behaviorCtx = document.getElementById('behaviorChart');
        if (behaviorCtx) {
            new Chart(behaviorCtx, {
                type: 'doughnut',
                data: {
                    labels: ['移动端', '桌面端'],
                    datasets: [{
                        data: [65, 35],
                        backgroundColor: ['#4CAF50', '#2196F3'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    }
                }
            });
        }
    }

    /**
     * 开始数据更新
     */
    startDataUpdate() {
        this.updateInterval = setInterval(() => {
            this.updateRealtimeData();
        }, 5000); // 每5秒更新一次
    }

    /**
     * 更新实时数据
     */
    updateRealtimeData() {
        // 模拟实时数据更新
        const realtimeItems = document.querySelectorAll('.realtime-value');
        realtimeItems.forEach(item => {
            if (item.textContent.includes('ms')) {
                // 更新响应时间
                const newTime = Math.floor(Math.random() * 50) + 100;
                item.textContent = newTime + 'ms';
            } else if (item.textContent.includes('%')) {
                // 更新CPU使用率
                const newCpu = Math.floor(Math.random() * 30) + 30;
                item.textContent = newCpu + '%';
            }
        });
    }

    /**
     * 导出数据
     */
    exportData() {
        console.log('导出数据大屏数据...');
        if (window.XinhuotongCore) {
            window.XinhuotongCore.showNotification('数据导出功能正在开发中...', 'info');
        }
    }

    /**
     * 刷新数据
     */
    refreshData() {
        console.log('刷新数据大屏数据...');
        if (window.XinhuotongCore) {
            window.XinhuotongCore.showNotification('数据刷新中...', 'info');
        }
        
        // 重新初始化图表
        setTimeout(() => {
            this.initOverviewCharts();
            this.initTrendCharts();
        }, 1000);
    }

    /**
     * 销毁数据大屏
     */
    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        this.isInitialized = false;
    }
}

// 创建全局实例
window.dataDashboard = new DataDashboard();

// 导出类
window.DataDashboard = DataDashboard;
