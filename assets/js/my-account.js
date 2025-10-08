// 我的账户功能 - 通用JavaScript文件

// 检查登录状态
function checkLoginStatus() {
    const token = localStorage.getItem('userToken');
    const userInfo = localStorage.getItem('userInfo');
    return token && userInfo;
}

// 处理"我的"功能点击
function handleMyAccount() {
    if (checkLoginStatus()) {
        // 已登录，跳转到个人中心
        window.location.href = 'my_account.html';
    } else {
        // 未登录，跳转到登录页面
        window.location.href = 'login.html';
    }
}

// 更新导航栏显示
function updateNavigation() {
    const myAccountLink = document.getElementById('myAccountLink');
    if (myAccountLink) {
        if (checkLoginStatus()) {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const displayName = userInfo.name || userInfo.username || '我的';
            myAccountLink.innerHTML = `👤 ${displayName}`;
            myAccountLink.style.color = '#00ffff';
            myAccountLink.style.textShadow = '0 0 10px rgba(0, 255, 255, 0.5)';
            myAccountLink.title = `点击查看 ${displayName} 的账号信息`;
        } else {
            myAccountLink.innerHTML = '👤 我的';
            myAccountLink.style.color = '#333';
            myAccountLink.style.textShadow = 'none';
            myAccountLink.title = '点击登录';
        }
    }
}

// 退出登录
function logout() {
    if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userInfo');
        alert('已成功退出登录');
        window.location.href = 'index.html';
    }
}

// 获取用户信息
function getUserInfo() {
    if (checkLoginStatus()) {
        return JSON.parse(localStorage.getItem('userInfo'));
    }
    return null;
}

// 页面加载时自动更新导航栏
document.addEventListener('DOMContentLoaded', function() {
    updateNavigation();
});
