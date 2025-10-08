# 批量更新HTML页面样式
Write-Host "🚀 开始批量更新页面样式..." -ForegroundColor Green

# 需要更新的HTML文件列表
$htmlFiles = @(
    "about_us.html",
    "login.html", 
    "sign_up.html",
    "course-grid.html",
    "course-list.html",
    "course-details.html",
    "education_teaching.html",
    "scientific_research.html",
    "cooperation_exchange.html",
    "campus_life.html",
    "ai_learning.html",
    "learning_analytics.html",
    "cloud_collaboration.html",
    "future_prediction.html",
    "small_class.html",
    "dual_degree.html",
    "major_transfer.html",
    "student_status.html",
    "transcript_application.html",
    "user_profile.html",
    "user_credentials.html",
    "user_photo.html",
    "my_courses.html",
    "purchase_history.html",
    "wishlist.html",
    "cart.html",
    "compare.html",
    "classroom_query.html",
    "course_selection.html",
    "instructor.html",
    "lesson.html",
    "privacy_policy.html",
    "refund_policy.html",
    "terms_and_condition.html"
)

# 统一样式引用
$styleLink = '    <link rel="stylesheet" href="assets/css/unified-style.css">'

foreach ($file in $htmlFiles) {
    if (Test-Path $file) {
        try {
            $content = Get-Content $file -Raw -Encoding UTF8
            
            # 添加统一样式引用（如果不存在）
            if ($content -notmatch "unified-style\.css") {
                $content = $content -replace '(<link rel="shortcut icon"[^>]*>)', "`$1`n$styleLink"
                Set-Content $file -Value $content -Encoding UTF8
                Write-Host "✅ 已更新: $file" -ForegroundColor Green
            } else {
                Write-Host "⚠️  已包含统一样式: $file" -ForegroundColor Yellow
            }
        }
        catch {
            Write-Host "❌ 更新失败: $file - $($_.Exception.Message)" -ForegroundColor Red
        }
    } else {
        Write-Host "⚠️  文件不存在: $file" -ForegroundColor Yellow
    }
}

Write-Host "`n批量更新完成！" -ForegroundColor Green
Write-Host "所有页面现在都使用统一的高科技风格样式" -ForegroundColor Cyan
