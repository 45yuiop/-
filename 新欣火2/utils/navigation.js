/**
 * 通用导航工具函数
 */

/**
 * 智能返回函数
 * 优先使用 navigateBack，如果页面栈为空则使用 reLaunch 返回首页
 */
export function smartGoBack() {
  const pages = getCurrentPages();
  if (pages.length > 1) {
    uni.navigateBack();
  } else {
    uni.reLaunch({ url: '/pages/home/home' });
  }
}

/**
 * 智能导航到首页
 * 如果当前已经在首页，则不进行任何操作
 */
export function smartGoHome() {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  
  if (currentPage && currentPage.route === 'pages/home/home') {
    // 已经在首页，不进行操作
    return;
  }
  
  if (pages.length > 1) {
    // 有上一页，使用 navigateBack
    uni.navigateBack({
      delta: pages.length - 1
    });
  } else {
    // 没有上一页，使用 reLaunch
    uni.reLaunch({ url: '/pages/home/home' });
  }
}

/**
 * 安全导航函数
 * 检查页面栈数量，避免超过限制
 */
export function safeNavigateTo(url) {
  const pages = getCurrentPages();
  if (pages.length >= 10) {
    // 页面栈已满，使用 redirectTo
    uni.redirectTo({ url });
  } else {
    // 页面栈未满，使用 navigateTo
    uni.navigateTo({ url });
  }
}

/**
 * 返回指定页面
 * @param {string} targetRoute 目标页面路径
 */
export function goToPage(targetRoute) {
  const pages = getCurrentPages();
  const targetIndex = pages.findIndex(page => page.route === targetRoute);
  
  if (targetIndex === -1) {
    // 目标页面不在页面栈中，使用 navigateTo
    safeNavigateTo(`/${targetRoute}`);
  } else if (targetIndex === pages.length - 1) {
    // 目标页面就是当前页面，不进行操作
    return;
  } else {
    // 目标页面在页面栈中，使用 navigateBack
    uni.navigateBack({
      delta: pages.length - 1 - targetIndex
    });
  }
} 