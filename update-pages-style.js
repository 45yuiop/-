// 批量更新所有HTML页面，确保使用统一的样式
const fs = require('fs');
const path = require('path');

// 需要更新的HTML文件列表
const htmlFiles = [
    'about_us.html',
    'login.html', 
    'sign_up.html',
    'course-grid.html',
    'course-list.html',
    'course-details.html',
    'education_teaching.html',
    'scientific_research.html',
    'cooperation_exchange.html',
    'campus_life.html',
    'ai_learning.html',
    'learning_analytics.html',
    'cloud_collaboration.html',
    'future_prediction.html',
    'small_class.html',
    'dual_degree.html',
    'major_transfer.html',
    'student_status.html',
    'transcript_application.html',
    'user_profile.html',
    'user_credentials.html',
    'user_photo.html',
    'my_courses.html',
    'purchase_history.html',
    'wishlist.html',
    'cart.html',
    'compare.html',
    'classroom_query.html',
    'course_selection.html',
    'instructor.html',
    'lesson.html',
    'privacy_policy.html',
    'refund_policy.html',
    'terms_and_condition.html'
];

// 统一的顶部工具栏HTML
const topToolbar = `        <!-- 顶部工具栏 -->
        <div class="top-toolbar">
            <div style="max-width: 1400px; margin: 0 auto; padding: 0 20px;">
                <span style="float: left;">🚀 欢迎进入新欣火智能教育平台</span>
                <div style="float: right;">
                    <a href="login.html" style="color: white; text-decoration: none; margin-right: 20px;">🔐 学员登录</a>
                    <a href="sign_up.html" style="color: white; text-decoration: none; margin-right: 20px;">📝 注册账号</a>
                    <a href="index.html" style="color: white; text-decoration: none; margin-right: 20px;">🏠 返回首页</a>
                    <a href="dashboard/index.html" style="color: white; text-decoration: none;">📊 数据大屏</a>
                </div>
                <div style="clear: both;"></div>
            </div>
        </div>`;

// 统一的主导航HTML
const mainNav = `        <!-- 主导航 -->
        <header class="main-header">
            <div class="header-container">
                <div class="logo-section">
                    <a href="index.html" style="text-decoration: none; display: flex; align-items: center;">
                        <div class="logo-icon">新</div>
                        <div class="logo-text">新欣火教育</div>
                    </a>
                </div>
                
                <nav class="main-nav">
                    <div class="nav-item">
                        <a href="about_us.html">🏢 机构概况</a>
                    </div>
                    <div class="nav-item">
                        <a href="sign_up.html">🎓 招生</a>
                    </div>
                    <div class="nav-item">
                        <a href="course-grid.html">📚 学部与院系</a>
                    </div>
                    <div class="nav-item">
                        <a href="education_teaching.html">👨‍🏫 教育教学</a>
                    </div>
                    <div class="nav-item">
                        <a href="scientific_research.html">🔬 科学研究</a>
                    </div>
                    <div class="nav-item">
                        <a href="cooperation_exchange.html">🤝 合作交流</a>
                    </div>
                    <div class="nav-item">
                        <a href="campus_life.html">🏫 校园生活</a>
                    </div>
                </nav>
            </div>
        </header>`;

// 统一的背景元素
const backgroundElements = `        <!-- 动态背景 -->
        <div class="animated-bg"></div>
        
        <!-- 浮动粒子 -->
        <div class="particles" id="particles"></div>`;

// 统一的页脚HTML
const footer = `    <!-- 页脚 -->
    <footer class="footer">
        <div class="footer-container">
            <div class="footer-grid">
                <div class="footer-section">
                    <h3>🏢 机构概况</h3>
                    <ul>
                        <li><a href="about_us.html">关于我们</a></li>
                        <li><a href="#">发展历程</a></li>
                        <li><a href="#">组织架构</a></li>
                        <li><a href="#">联系我们</a></li>
                        <li><a href="#">加入我们</a></li>
                    </ul>
                </div>

                <div class="footer-section">
                    <h3>🎓 智能课程</h3>
                    <ul>
                        <li><a href="course-grid.html">全部课程</a></li>
                        <li><a href="small_class.html">小班教学</a></li>
                        <li><a href="dual_degree.html">双学位项目</a></li>
                        <li><a href="#">AI定制课程</a></li>
                        <li><a href="#">企业培训</a></li>
                    </ul>
                </div>

                <div class="footer-section">
                    <h3>🛠️ 智能工具</h3>
                    <ul>
                        <li><a href="course_selection.html">AI选课系统</a></li>
                        <li><a href="classroom_query.html">智能教室</a></li>
                        <li><a href="transcript_application.html">数字证书</a></li>
                        <li><a href="major_transfer.html">专业规划</a></li>
                        <li><a href="student_status.html">学籍管理</a></li>
                    </ul>
                </div>
                
                <div class="footer-section">
                    <h3>📞 联系方式</h3>
                    <p style="margin-bottom: 10px;">🏢 地址：未来科技教育园区</p>
                    <p style="margin-bottom: 10px;">📱 电话：400-AI-LEARN</p>
                    <p style="margin-bottom: 10px;">📧 邮箱：ai@xinxinhuo.edu</p>
                    <p style="margin-bottom: 15px;">🌐 网站：www.xinxinhuo.ai</p>
                    <div>
                        <a href="#" style="margin-right: 15px; font-size: 24px;">💬</a>
                        <a href="#" style="margin-right: 15px; font-size: 24px;">📱</a>
                        <a href="#" style="font-size: 24px;">🔗</a>
                    </div>
                </div>
            </div>
            
            <div class="footer-bottom">
                <p>&copy; 2024 新欣火智能教育. 保留所有权利. | 🌐 中文 | 🤖 AI驱动 | 🔮 未来教育</p>
            </div>
        </div>
    </footer>`;

// 更新单个文件
function updateFile(filename) {
    try {
        const filePath = path.join(__dirname, filename);
        
        if (!fs.existsSync(filePath)) {
            console.log(`⚠️  文件不存在: ${filename}`);
            return;
        }
        
        let content = fs.readFileSync(filePath, 'utf8');
        
        // 添加统一样式引用
        if (!content.includes('unified-style.css')) {
            content = content.replace(
                /<link rel="shortcut icon"[^>]*>/,
                `$&\n    <link rel="stylesheet" href="assets/css/unified-style.css">`
            );
        }
        
        // 替换body开始部分
        content = content.replace(
            /<body[^>]*>[\s\S]*?(?=<div class="particles|<!-- 动态背景|<!-- 导航|<!-- 主导航|<!-- 主要内容|<!-- 页面|<!-- 登录|<!-- 课程)/,
            `<body>\n${backgroundElements}\n\n${topToolbar}\n\n${mainNav}\n\n`
        );
        
        // 添加页脚（如果不存在）
        if (!content.includes('footer class="footer"')) {
            content = content.replace(
                /<\/body>/,
                `\n${footer}\n\n</body>`
            );
        }
        
        // 添加统一的JavaScript
        const unifiedJS = `
    <script>
        // 创建浮动粒子
        function createParticles() {
            const particlesContainer = document.getElementById('particles');
            if (!particlesContainer) return;
            
            const particleCount = 30;
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 6 + 's';
                particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
                particlesContainer.appendChild(particle);
            }
        }
        
        // 滚动动画
        function handleScrollAnimation() {
            const elements = document.querySelectorAll('.scroll-animate');
            elements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = 150;
                
                if (elementTop < window.innerHeight - elementVisible) {
                    element.classList.add('active');
                }
            });
        }
        
        // 页面加载完成后执行
        document.addEventListener('DOMContentLoaded', function() {
            createParticles();
            window.addEventListener('scroll', handleScrollAnimation);
            handleScrollAnimation();
        });
    </script>`;
        
        if (!content.includes('createParticles()')) {
            content = content.replace('</body>', `${unifiedJS}\n</body>`);
        }
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ 已更新: ${filename}`);
        
    } catch (error) {
        console.error(`❌ 更新失败 ${filename}:`, error.message);
    }
}

// 批量更新所有文件
console.log('🚀 开始批量更新页面样式...\n');

htmlFiles.forEach(updateFile);

console.log('\n🎉 批量更新完成！');
console.log('📝 所有页面现在都使用统一的高科技风格样式');
