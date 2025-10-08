const fs = require('fs');
const path = require('path');

// 需要更新的页面列表
const pages = [
    'education_teaching.html',
    'scientific_research.html', 
    'campus_life.html',
    'course-grid.html',
    'course-list.html',
    'course-details.html',
    'instructor.html',
    'learning_analytics.html',
    'future_prediction.html',
    'ai_learning.html',
    'cloud_collaboration.html',
    'cooperation_exchange.html',
    'dual_degree.html',
    'major_transfer.html',
    'small_class.html',
    'student_status.html',
    'transcript_application.html',
    'xinhuotong.html'
];

// 太空元素HTML模板
const spaceElementsHTML = `
    <!-- 动态背景 -->
    <div class="animated-bg"></div>
    
    <!-- 浮动粒子 -->
    <div class="particles" id="particles"></div>
    
    <!-- 动态太空元素 -->
    <div class="space-elements" id="spaceElements">
        <!-- 机器人 -->
        <div class="space-robot interactive-element" style="top: 20%; left: 10%;">🤖</div>
        <div class="space-robot interactive-element" style="top: 60%; right: 15%;">🦾</div>
        
        <!-- 飞船 -->
        <div class="space-ship interactive-element" style="top: 30%; left: -100px;">🚀</div>
        <div class="space-ship interactive-element" style="top: 70%; left: -150px; animation-delay: -6s;">🛸</div>
        
        <!-- 卫星 -->
        <div class="space-satellite interactive-element" style="top: 25%; left: 60%;">🛰️</div>
        <div class="space-satellite interactive-element" style="top: 65%; right: 20%; animation-delay: -8s;">📡</div>
        
        <!-- 行星 -->
        <div class="space-planet interactive-element" style="top: 10%; right: 10%;">🪐</div>
        <div class="space-planet interactive-element" style="bottom: 20%; left: 5%; animation-delay: -10s;">🌍</div>
        
        <!-- 其他太空元素 -->
        <div class="space-satellite interactive-element" style="top: 45%; left: 20%; animation-delay: -4s;">⭐</div>
        <div class="space-satellite interactive-element" style="top: 80%; right: 40%; animation-delay: -12s;">✨</div>
        <div class="space-robot interactive-element" style="top: 35%; right: 50%; animation-delay: -2s;">🔬</div>
    </div>

    <!-- 鼠标跟随光环 -->
    <div class="mouse-aura" id="mouseAura" style="left: 0; top: 0;"></div>
`;

// 太空元素JavaScript模板
const spaceElementsJS = `
        let mouseX = 0, mouseY = 0;

        // 鼠标跟随效果
        document.addEventListener('mousemove', function(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            const mouseAura = document.getElementById('mouseAura');
            if (mouseAura) {
                mouseAura.style.transform = \`translate(\${mouseX - 40}px, \${mouseY - 40}px)\`;
            }
        });

        // 使用requestAnimationFrame优化太空元素交互
        function updateSpaceElements() {
            const spaceElements = document.querySelectorAll('.interactive-element');
            spaceElements.forEach((element, index) => {
                const rect = element.getBoundingClientRect();
                const elementCenterX = rect.left + rect.width / 2;
                const elementCenterY = rect.top + rect.height / 2;
                
                const deltaX = mouseX - elementCenterX;
                const deltaY = mouseY - elementCenterY;
                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                
                // 在鼠标附近时产生排斥效果
                if (distance < 120) {
                    const force = (120 - distance) / 120;
                    const moveX = -deltaX * force * 0.25;
                    const moveY = -deltaY * force * 0.25;
                    
                    element.style.transform = \`translate(\${moveX}px, \${moveY}px) scale(\${1 + force * 0.15})\`;
                    element.style.filter = \`brightness(\${1 + force * 0.4}) drop-shadow(0 0 \${force * 15}px currentColor)\`;
                } else {
                    element.style.transform = '';
                    element.style.filter = '';
                }
            });
            
            requestAnimationFrame(updateSpaceElements);
        }

        // 创建动态粒子
        function createParticles() {
            const particlesContainer = document.getElementById('particles');
            const particleCount = 50;
            
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                particle.style.width = Math.random() * 4 + 2 + 'px';
                particle.style.height = particle.style.width;
                particle.style.animationDelay = Math.random() * 6 + 's';
                particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
                particlesContainer.appendChild(particle);
            }
        }

        // 动态生成太空元素
        function createRandomSpaceElement() {
            const spaceElements = document.getElementById('spaceElements');
            const elements = ['🌟', '💫', '☄️', '🌙', '⭐', '🛸', '👽', '🌌'];
            const element = document.createElement('div');
            
            element.className = 'interactive-element';
            element.textContent = elements[Math.floor(Math.random() * elements.length)];
            element.style.position = 'absolute';
            element.style.left = Math.random() * 90 + '%';
            element.style.top = Math.random() * 90 + '%';
            element.style.fontSize = (Math.random() * 20 + 20) + 'px';
            element.style.color = \`hsl(\${Math.random() * 360}, 70%, 60%)\`;
            element.style.opacity = '0.8';
            element.style.cursor = 'pointer';
            element.style.transition = 'all 0.3s ease';
            element.style.animation = \`float \${Math.random() * 4 + 4}s ease-in-out infinite\`;
            
            element.addEventListener('click', function() {
                element.style.transform = 'scale(2)';
                element.style.opacity = '0';
                setTimeout(() => element.remove(), 300);
                showTooltip('收集成功！', mouseX, mouseY);
            });
            
            spaceElements.appendChild(element);
            
            setTimeout(() => {
                if (element.parentNode) {
                    element.remove();
                }
            }, 15000);
        }

        // 显示提示信息
        function showTooltip(message, x, y) {
            const tooltip = document.createElement('div');
            tooltip.textContent = message;
            tooltip.style.position = 'fixed';
            tooltip.style.left = x + 'px';
            tooltip.style.top = y + 'px';
            tooltip.style.background = 'rgba(0, 255, 255, 0.9)';
            tooltip.style.color = 'white';
            tooltip.style.padding = '5px 10px';
            tooltip.style.borderRadius = '5px';
            tooltip.style.fontSize = '14px';
            tooltip.style.zIndex = '10000';
            tooltip.style.pointerEvents = 'none';
            tooltip.style.transform = 'translate(-50%, -100%)';
            
            document.body.appendChild(tooltip);
            setTimeout(() => tooltip.remove(), 2000);
        }

        // 太空元素点击交互
        function initSpaceElementInteractions() {
            const interactiveElements = document.querySelectorAll('.interactive-element');
            
            interactiveElements.forEach(element => {
                element.addEventListener('click', function(e) {
                    e.stopPropagation();
                    
                    // 创建爆炸效果
                    const explosion = document.createElement('div');
                    explosion.style.cssText = \`
                        position: fixed;
                        left: \${e.clientX - 25}px;
                        top: \${e.clientY - 25}px;
                        width: 50px;
                        height: 50px;
                        background: radial-gradient(circle, rgba(0, 255, 255, 0.8) 0%, transparent 70%);
                        border-radius: 50%;
                        pointer-events: none;
                        z-index: 10000;
                        animation: explode 0.6s ease-out forwards;
                    \`;
                    
                    // 添加爆炸动画
                    const style = document.createElement('style');
                    style.textContent = \`
                        @keyframes explode {
                            0% { transform: scale(0); opacity: 1; }
                            100% { transform: scale(3); opacity: 0; }
                        }
                    \`;
                    document.head.appendChild(style);
                    
                    document.body.appendChild(explosion);
                    setTimeout(() => {
                        explosion.remove();
                        style.remove();
                    }, 600);
                });
            });
        }
`;

// 更新单个页面
function updatePage(pageName) {
    const filePath = path.join(__dirname, pageName);
    
    if (!fs.existsSync(filePath)) {
        console.log(`页面 ${pageName} 不存在，跳过`);
        return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 1. 添加CSS文件引用
    if (!content.includes('space-effects.css')) {
        content = content.replace(
            /<link rel="stylesheet" href="assets\/css\/unified-style\.css">/,
            '<link rel="stylesheet" href="assets/css/unified-style.css">\n    <link rel="stylesheet" href="assets/css/space-effects.css">'
        );
    }
    
    // 2. 添加太空元素HTML
    if (!content.includes('space-elements')) {
        // 在body标签后添加太空元素
        content = content.replace(
            /<body[^>]*>/,
            `$&\n    ${spaceElementsHTML}`
        );
    }
    
    // 3. 添加太空元素JavaScript
    if (!content.includes('updateSpaceElements')) {
        // 在现有的script标签中添加太空元素相关函数
        const scriptMatch = content.match(/<script>([\s\S]*?)<\/script>/);
        if (scriptMatch) {
            const existingScript = scriptMatch[1];
            const newScript = existingScript + spaceElementsJS;
            content = content.replace(scriptMatch[0], `<script>${newScript}</script>`);
        } else {
            // 如果没有script标签，添加一个
            content = content.replace(
                /<\/body>/,
                `    <script>${spaceElementsJS}</script>\n</body>`
            );
        }
    }
    
    // 4. 在DOMContentLoaded中添加初始化调用
    if (!content.includes('createParticles()')) {
        content = content.replace(
            /document\.addEventListener\('DOMContentLoaded', function\(\) \{/,
            `document.addEventListener('DOMContentLoaded', function() {
            createParticles();
            requestAnimationFrame(updateSpaceElements);
            setInterval(createRandomSpaceElement, 3000);
            initSpaceElementInteractions();`
        );
    }
    
    // 写回文件
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ 已更新页面: ${pageName}`);
}

// 批量更新所有页面
console.log('开始批量更新页面，添加太空元素效果...\n');

pages.forEach(page => {
    try {
        updatePage(page);
    } catch (error) {
        console.log(`❌ 更新页面 ${page} 时出错:`, error.message);
    }
});

console.log('\n🎉 批量更新完成！');
