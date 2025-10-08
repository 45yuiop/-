/**
 * 新火通管理系统模块JavaScript
 * 负责各个功能模块的显示和交互
 */

/**
 * 显示学员管理模块
 */
function showStudentsModule() {
    const contentArea = document.querySelector('.content-area');
    contentArea.innerHTML = `
        <div class="page-header fade-in">
            <h1 class="page-title">👥 学员管理</h1>
            <p class="page-subtitle">管理学员信息、课时余额、出勤记录</p>
        </div>
        
        <div class="module-content fade-in">
            <div class="module-stats">
                <div class="stat-card">
                    <div class="stat-icon">👥</div>
                    <div class="stat-content">
                        <div class="stat-value">44</div>
                        <div class="stat-label">总学员数</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">✅</div>
                    <div class="stat-content">
                        <div class="stat-value">38</div>
                        <div class="stat-label">活跃学员</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">⏰</div>
                    <div class="stat-content">
                        <div class="stat-value">6</div>
                        <div class="stat-label">待审核</div>
                    </div>
                </div>
            </div>
            
            <div class="data-table">
                <h3>学员列表</h3>
                <p style="color: #00ffff; text-align: center; padding: 40px;">
                    🚧 学员管理功能正在开发中...<br>
                    将支持学员信息管理、课时余额查看、出勤记录等功能
                </p>
            </div>
        </div>
    `;
}

/**
 * 显示课程管理模块
 */
function showCoursesModule() {
    const contentArea = document.querySelector('.content-area');
    contentArea.innerHTML = `
        <div class="page-header fade-in">
            <h1 class="page-title">📚 课程管理</h1>
            <p class="page-subtitle">管理课程信息、价格设置、课时配置</p>
        </div>
        
        <div class="module-content fade-in">
            <div class="module-stats">
                <div class="stat-card">
                    <div class="stat-icon">📚</div>
                    <div class="stat-content">
                        <div class="stat-value">51</div>
                        <div class="stat-label">总课程数</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">🔥</div>
                    <div class="stat-content">
                        <div class="stat-value">12</div>
                        <div class="stat-label">热门课程</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">💰</div>
                    <div class="stat-content">
                        <div class="stat-value">¥2,580</div>
                        <div class="stat-label">平均价格</div>
                    </div>
                </div>
            </div>
            
            <div class="data-table">
                <h3>课程列表</h3>
                <p style="color: #00ffff; text-align: center; padding: 40px;">
                    🚧 课程管理功能正在开发中...<br>
                    将支持课程信息管理、价格设置、课时配置等功能
                </p>
            </div>
        </div>
    `;
}

/**
 * 显示班级管理模块
 */
function showClassesModule() {
    const contentArea = document.querySelector('.content-area');
    contentArea.innerHTML = `
        <div class="page-header fade-in">
            <h1 class="page-title">🏫 班级管理</h1>
            <p class="page-subtitle">管理班级信息、排课安排、学员分配</p>
        </div>
        
        <div class="module-content fade-in">
            <div class="module-stats">
                <div class="stat-card">
                    <div class="stat-icon">🏫</div>
                    <div class="stat-content">
                        <div class="stat-value">11</div>
                        <div class="stat-label">总班级数</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">👥</div>
                    <div class="stat-content">
                        <div class="stat-value">4</div>
                        <div class="stat-label">平均人数</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">📅</div>
                    <div class="stat-content">
                        <div class="stat-value">8</div>
                        <div class="stat-label">本周课程</div>
                    </div>
                </div>
            </div>
            
            <div class="data-table">
                <h3>班级列表</h3>
                <p style="color: #00ffff; text-align: center; padding: 40px;">
                    🚧 班级管理功能正在开发中...<br>
                    将支持班级信息管理、排课安排、学员分配等功能
                </p>
            </div>
        </div>
    `;
}

/**
 * 显示课表管理模块
 */
function showScheduleModule() {
    const contentArea = document.querySelector('.content-area');
    contentArea.innerHTML = `
        <div class="page-header fade-in">
            <h1 class="page-title">📅 课表管理</h1>
            <p class="page-subtitle">管理课程安排、时间调度、教室分配</p>
        </div>
        
        <div class="module-content fade-in">
            <div class="data-table">
                <h3>课表管理</h3>
                <p style="color: #00ffff; text-align: center; padding: 40px;">
                    🚧 课表管理功能正在开发中...<br>
                    将支持课程安排、时间调度、教室分配等功能
                </p>
            </div>
        </div>
    `;
}

/**
 * 显示财务管理模块
 */
function showFinanceModule() {
    const contentArea = document.querySelector('.content-area');
    contentArea.innerHTML = `
        <div class="page-header fade-in">
            <h1 class="page-title">💰 财务管理</h1>
            <p class="page-subtitle">管理收支记录、课时购买、财务报表</p>
        </div>
        
        <div class="module-content fade-in">
            <div class="module-stats">
                <div class="stat-card">
                    <div class="stat-icon">💰</div>
                    <div class="stat-content">
                        <div class="stat-value">¥125,680</div>
                        <div class="stat-label">总收入</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">📈</div>
                    <div class="stat-content">
                        <div class="stat-value">¥8,420</div>
                        <div class="stat-label">本月收入</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">📊</div>
                    <div class="stat-content">
                        <div class="stat-value">156</div>
                        <div class="stat-label">交易笔数</div>
                    </div>
                </div>
            </div>
            
            <div class="charts-section">
                <div class="chart-panel">
                    <div class="chart-header">
                        <h3>收入趋势</h3>
                        <div class="chart-legend">
                            <div class="legend-item">
                                <div class="legend-color" style="background: #00ffff;"></div>
                                <span>收入</span>
                            </div>
                        </div>
                    </div>
                    <div class="chart-container">
                        <canvas id="revenueChart"></canvas>
                    </div>
                </div>
                
                <div class="chart-panel">
                    <div class="chart-header">
                        <h3>支付方式</h3>
                        <div class="chart-legend">
                            <div class="legend-item">
                                <div class="legend-color" style="background: #4CAF50;"></div>
                                <span>微信</span>
                            </div>
                            <div class="legend-item">
                                <div class="legend-color" style="background: #2196F3;"></div>
                                <span>支付宝</span>
                            </div>
                        </div>
                    </div>
                    <div class="chart-container">
                        <canvas id="paymentChart"></canvas>
                    </div>
                </div>
            </div>
            
            <div class="module-actions">
                <button class="action-btn primary" onclick="exportData()">📊 导出数据</button>
                <button class="action-btn secondary" onclick="generateReport()">📋 生成报表</button>
                <button class="action-btn secondary" onclick="refreshData()">🔄 刷新数据</button>
            </div>
        </div>
    `;
    
    // 初始化财务图表
    setTimeout(initFinanceCharts, 100);
}

/**
 * 显示数据中心模块
 */
function showDataModule() {
    const contentArea = document.querySelector('.content-area');
    contentArea.innerHTML = `
        <div class="page-header fade-in">
            <h1 class="page-title">📊 数据中心</h1>
            <p class="page-subtitle">数据分析、报表生成、业务洞察</p>
        </div>
        
        <div class="module-content fade-in">
            <div class="module-stats">
                <div class="stat-card">
                    <div class="stat-icon">📊</div>
                    <div class="stat-content">
                        <div class="stat-value">1,256</div>
                        <div class="stat-label">总访问量</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">👥</div>
                    <div class="stat-content">
                        <div class="stat-value">89</div>
                        <div class="stat-label">活跃用户</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">⚡</div>
                    <div class="stat-content">
                        <div class="stat-value">99.8%</div>
                        <div class="stat-label">系统稳定性</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">💾</div>
                    <div class="stat-content">
                        <div class="stat-value">2.4GB</div>
                        <div class="stat-label">数据存储量</div>
                    </div>
                </div>
            </div>
            
            <div class="data-center-actions">
                <button class="action-btn primary" onclick="openDataDashboard()">
                    <span class="action-icon">📊</span>
                    <span class="action-text">打开数据大屏</span>
                </button>
                <button class="action-btn secondary" onclick="exportData()">
                    <span class="action-icon">📈</span>
                    <span class="action-text">导出数据</span>
                </button>
                <button class="action-btn secondary" onclick="generateReport()">
                    <span class="action-icon">📋</span>
                    <span class="action-text">生成报表</span>
                </button>
            </div>
            
            <div class="charts-section">
                <div class="chart-panel">
                    <div class="chart-header">
                        <h3>访问趋势分析</h3>
                        <div class="chart-legend">
                            <div class="legend-item">
                                <div class="legend-color" style="background: #00ffff;"></div>
                                <span>访问量</span>
                            </div>
                        </div>
                    </div>
                    <div class="chart-container">
                        <canvas id="trendChart"></canvas>
                    </div>
                </div>
                
                <div class="chart-panel">
                    <div class="chart-header">
                        <h3>用户行为分析</h3>
                        <div class="chart-legend">
                            <div class="legend-item">
                                <div class="legend-color" style="background: #4CAF50;"></div>
                                <span>移动端</span>
                            </div>
                            <div class="legend-item">
                                <div class="legend-color" style="background: #2196F3;"></div>
                                <span>桌面端</span>
                            </div>
                        </div>
                    </div>
                    <div class="chart-container">
                        <canvas id="behaviorChart"></canvas>
                    </div>
                </div>
            </div>
            
            <div class="realtime-section">
                <h3>实时数据</h3>
                <div class="realtime-grid">
                    <div class="realtime-card">
                        <div class="realtime-icon">👥</div>
                        <div class="realtime-content">
                            <div class="realtime-value">12</div>
                            <div class="realtime-label">在线用户</div>
                        </div>
                    </div>
                    <div class="realtime-card">
                        <div class="realtime-icon">📱</div>
                        <div class="realtime-content">
                            <div class="realtime-value">8</div>
                            <div class="realtime-label">移动端用户</div>
                        </div>
                    </div>
                    <div class="realtime-card">
                        <div class="realtime-icon">💻</div>
                        <div class="realtime-content">
                            <div class="realtime-value">4</div>
                            <div class="realtime-label">桌面端用户</div>
                        </div>
                    </div>
                    <div class="realtime-card">
                        <div class="realtime-icon">⚡</div>
                        <div class="realtime-content">
                            <div class="realtime-value">156ms</div>
                            <div class="realtime-label">平均响应时间</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // 初始化数据图表
    setTimeout(initDataCharts, 100);
}

/**
 * 打开数据大屏
 */
function openDataDashboard() {
    console.log('打开数据大屏...');
    
    // 初始化数据大屏
    if (window.dataDashboard) {
        window.dataDashboard.init();
    } else {
        console.error('数据大屏模块未加载');
        if (window.XinhuotongCore) {
            window.XinhuotongCore.showNotification('数据大屏模块加载失败', 'error');
        }
    }
}

/**
 * 显示系统设置模块
 */
function showSettingsModule() {
    const contentArea = document.querySelector('.content-area');
    contentArea.innerHTML = `
        <div class="page-header fade-in">
            <h1 class="page-title">⚙️ 系统设置</h1>
            <p class="page-subtitle">系统配置、用户管理、权限设置</p>
        </div>
        
        <div class="module-content fade-in">
            <div class="data-table">
                <h3>系统设置</h3>
                <p style="color: #00ffff; text-align: center; padding: 40px;">
                    🚧 系统设置功能正在开发中...<br>
                    将支持系统配置、用户管理、权限设置等功能
                </p>
            </div>
        </div>
    `;
}

/**
 * 初始化财务图表
 */
function initFinanceCharts() {
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js 未加载');
        return;
    }
    
    // 收入趋势图
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
                datasets: [{
                    label: '收入',
                    data: [12000, 15000, 18000, 16000, 20000, 22000],
                    borderColor: '#00ffff',
                    backgroundColor: 'rgba(0, 255, 255, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    }
                }
            }
        });
    }
    
    // 支付方式图
    const paymentCtx = document.getElementById('paymentChart');
    if (paymentCtx) {
        new Chart(paymentCtx, {
            type: 'doughnut',
            data: {
                labels: ['微信支付', '支付宝', '其他'],
                datasets: [{
                    data: [65, 25, 10],
                    backgroundColor: ['#4CAF50', '#2196F3', '#FF9800'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
}

/**
 * 初始化数据图表
 */
function initDataCharts() {
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js 未加载');
        return;
    }
    
    // 访问趋势图
    const trendCtx = document.getElementById('trendChart');
    if (trendCtx) {
        new Chart(trendCtx, {
            type: 'line',
            data: {
                labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                datasets: [{
                    label: '访问量',
                    data: [120, 150, 180, 160, 200, 220, 190],
                    borderColor: '#00ffff',
                    backgroundColor: 'rgba(0, 255, 255, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
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
                    data: [70, 30],
                    backgroundColor: ['#4CAF50', '#2196F3'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
}

// 添加模块统计样式
const moduleStatsStyle = `
<style>
.module-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin: 30px 0;
}

.charts-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin: 30px 0;
}

.chart-panel {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 20px;
    backdrop-filter: blur(10px);
}

.chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.chart-header h3 {
    color: #00ffff;
    font-size: 16px;
    margin: 0;
}

.chart-legend {
    display: flex;
    gap: 15px;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 5px;
    color: rgba(255, 255, 255, 0.8);
    font-size: 12px;
}

.legend-color {
    width: 12px;
    height: 12px;
    border-radius: 2px;
}

.chart-container {
    height: 200px;
    position: relative;
}

.realtime-section {
    margin: 30px 0;
}

.realtime-section h3 {
    color: #00ffff;
    font-size: 18px;
    margin-bottom: 20px;
    text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
}

.realtime-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
}

.realtime-card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 15px;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
}

.realtime-card:hover {
    background: rgba(0, 255, 255, 0.1);
    border-color: rgba(0, 255, 255, 0.3);
    transform: translateY(-2px);
}

.realtime-icon {
    font-size: 24px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 255, 255, 0.1);
    border-radius: 8px;
}

.realtime-content {
    flex: 1;
}

.realtime-value {
    color: #00ffff;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 5px;
}

.realtime-label {
    color: rgba(255, 255, 255, 0.7);
    font-size: 12px;
}

.module-actions {
    display: flex;
    gap: 10px;
    margin-top: 30px;
    justify-content: center;
}

.data-center-actions {
    display: flex;
    gap: 15px;
    margin: 30px 0;
    justify-content: center;
    flex-wrap: wrap;
}

.action-btn {
    padding: 12px 24px;
    border: 1px solid rgba(0, 255, 255, 0.3);
    border-radius: 8px;
    background: rgba(0, 255, 255, 0.1);
    color: #00ffff;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 14px;
}

.action-btn:hover {
    background: rgba(0, 255, 255, 0.2);
    border-color: #00ffff;
    transform: translateY(-2px);
}

.action-btn.primary {
    background: rgba(0, 255, 255, 0.2);
    border-color: #00ffff;
}

@media (max-width: 768px) {
    .charts-section {
        grid-template-columns: 1fr;
    }
    
    .realtime-grid {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    }
}
</style>
`;

// 将样式添加到页面
if (!document.getElementById('module-stats-style')) {
    const styleElement = document.createElement('div');
    styleElement.id = 'module-stats-style';
    styleElement.innerHTML = moduleStatsStyle;
    document.head.appendChild(styleElement);
}
