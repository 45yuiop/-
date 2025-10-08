# PowerShell脚本：为所有HTML页面添加太空元素效果

$pages = @(
    "ai_learning.html",
    "campus_life.html", 
    "cart.html",
    "classroom_query.html",
    "cloud_collaboration.html",
    "compare.html",
    "cooperation_exchange.html",
    "course_selection.html",
    "course-details.html",
    "course-list.html",
    "dual_degree.html",
    "education_teaching.html",
    "future_prediction.html",
    "instructor.html",
    "learning_analytics.html",
    "lesson.html",
    "login.html",
    "major_transfer.html",
    "my_account.html",
    "my_courses.html",
    "privacy_policy.html",
    "purchase_history.html",
    "refund_policy.html",
    "scientific_research.html",
    "sign_up.html",
    "small_class.html",
    "student_status.html",
    "terms_and_condition.html",
    "transcript_application.html",
    "user_credentials.html",
    "user_photo.html",
    "user_profile.html",
    "wishlist.html",
    "xinhuotong.html"
)

Write-Host "开始为所有页面添加太空元素效果..." -ForegroundColor Green

foreach ($page in $pages) {
    if (Test-Path $page) {
        $content = Get-Content $page -Raw -Encoding UTF8
        
        # 检查是否已经添加了space-effects.css
        if ($content -notmatch "space-effects\.css") {
            # 添加CSS引用
            $content = $content -replace '(<link rel="stylesheet" href="assets/css/unified-style\.css">)', '$1`n    <link rel="stylesheet" href="assets/css/space-effects.css">'
            
            # 检查是否有太空元素HTML
            if ($content -notmatch "space-elements") {
                # 添加太空元素HTML
                $spaceElementsHTML = @"

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
"@
                
                $content = $content -replace '(<body[^>]*>)', "`$1`n$spaceElementsHTML"
            }
            
            # 保存文件
            Set-Content $page -Value $content -Encoding UTF8
            Write-Host "✅ 已更新: $page" -ForegroundColor Yellow
        } else {
            Write-Host "⏭️  跳过: $page (已有太空元素效果)" -ForegroundColor Gray
        }
    } else {
        Write-Host "❌ 文件不存在: $page" -ForegroundColor Red
    }
}

Write-Host "`n🎉 批量更新完成！" -ForegroundColor Green
