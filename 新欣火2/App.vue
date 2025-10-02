<script>
	export default {
		onLaunch() {
			if (uniCloud && uniCloud.login) {
				uniCloud.login();
			}
			
			// 检查用户是否已登录
			const userInfo = uni.getStorageSync('userInfo');
			const token = uni.getStorageSync('uni_id_token');
			
			if (!userInfo || !token) {
				// 只有在没有用户信息和token时才跳转登录页面
				uni.reLaunch({
					url: '/pages/login/login'
				});
			}
		},
		onShow: async function(options) {
			console.log('App onShow with options:', options);
			
			// 检查用户登录状态，但不强制跳转
			const userInfo = uni.getStorageSync('userInfo');
			const token = uni.getStorageSync('uni_id_token');
			
			if (!userInfo || !token) {
				console.log('用户未登录，但不强制跳转');
				// 不强制跳转，让各个页面自己处理权限
			}
		},
		onHide: function() {
			console.log('App Hide')
			// 移除这行，不应该在应用隐藏时清除用户信息
			// uni.removeStorageSync('userInfo');
		},
		methods: {
			async updateMessageTabBadge() {
				const userInfo = uni.getStorageSync('userInfo');
				// 判断当前页面是否为TabBar页面
				const pages = getCurrentPages();
				const tabBarPages = [
					'pages/home/home',
					'pages/service/service',
					'pages/message/message',
					'pages/schedule-tab/schedule-tab',
					'pages/my/my'
				];
				const currentRoute = pages[pages.length - 1]?.route || '';
				const isTabBarPage = tabBarPages.includes(currentRoute);
				if (!isTabBarPage || typeof uni.removeTabBarBadge !== 'function' || typeof uni.setTabBarBadge !== 'function') {
					return;
				}
				if (!userInfo || !userInfo._id) {
					uni.removeTabBarBadge({ index: 2 });
					return;
				}
				try {
					const res = await uniCloud.callFunction({
						name: 'user-center/getUnreadMessageCount',
						data: { userId: userInfo._id }
					});
					const unreadCount = res.result && res.result.count ? res.result.count : 0;
					if (unreadCount > 0) {
						uni.setTabBarBadge({
							index: 2,
							text: unreadCount > 99 ? '99+' : String(unreadCount)
						});
					} else {
						uni.removeTabBarBadge({ index: 2 });
					}
				} catch (e) {
					uni.removeTabBarBadge({ index: 2 });
				}
			}
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
