<template>
	<view class="index-container">
		<!-- 搜索栏 -->
		<view class="search-bar">
			<input class="search-input" placeholder="大家都在搜：我的课表" disabled />
		</view>
		<!-- 宣传图轮播 -->
		<swiper class="banner-swiper" :indicator-dots="true" :autoplay="true" interval="3000" circular>
			<swiper-item v-for="(img, idx) in bannerList" :key="idx">
				<image class="banner-img" :src="img" mode="aspectFill" />
			</swiper-item>
		</swiper>
		<!-- 订阅通知提示框 -->
		<view class="subscription-notice" v-if="!isSubscribed">
			<view class="notice-content">
				<view class="notice-icon">🔔</view>
				<view class="notice-text">
					<text class="notice-title">订阅通知</text>
					<text class="notice-desc">开通订阅通知，及时接收课程安排、调课等重要信息</text>
				</view>
			</view>
			<button class="enable-btn" @click="goToSubscriptionSettings">立即开通</button>
		</view>
		
		<!-- 调试信息（临时） -->
		<view class="debug-info" v-if="true">
			<text>当前订阅状态: {{ isSubscribed ? '已开启' : '未开启' }}</text>
			<button @click="checkSubscriptionStatus" style="margin-left: 20rpx; padding: 10rpx;">刷新状态</button>
			<button @click="forceRefreshSubscription" style="margin-left: 20rpx; padding: 10rpx; background: #ff6b6b; color: white;">强制刷新</button>
			<button @click="testEventEmit" style="margin-left: 20rpx; padding: 10rpx; background: #4CAF50; color: white;">测试事件</button>
		</view>
		<!-- 常用功能区 -->
		<view class="quick-actions">
			<view class="action-row" v-for="(row, rowIdx) in actionRows" :key="rowIdx">
				<view class="action-item" v-for="item in row" :key="item.text" @click="goTo(item)">
					<image :src="item.icon" class="action-icon" />
					<text class="action-text">{{ item.text }}</text>
				</view>
			</view>
		</view>
		<!-- 新闻区 -->
		<view class="news-section">
			<view class="news-header">
				<text>公司新闻</text>
				<button v-if="isAdmin" class="news-edit-btn" @click="openNewsEditor">发布新闻</button>
			</view>
			<view class="news-list">
				<view class="news-item" v-for="news in newsList" :key="news.id">
					<text class="news-title">{{ news.title }}</text>
					<text class="news-content">{{ news.content }}</text>
					<text class="news-time">{{ news.time }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				bannerList: [
					'https://dummyimage.com/710x260/cccccc/fff.png&text=Banner1',
					'https://dummyimage.com/710x260/cccccc/fff.png&text=Banner2',
					'https://dummyimage.com/710x260/cccccc/fff.png&text=Banner3'
				],
				// 新增：初始功能区数组
				initQuickActions: [
					{ text: '教师课程表', icon: '/static/bbb.png', page: '/pages/admin-teacher-schedule/admin-teacher-schedule' },
					{ text: '我的课表', icon: '/static/d.png', page: '/pages/teacher-courses/teacher-courses' },
					{ text: '账号管理', icon: '/static/c.png', page: '/pages/account-manage/account-manage' },
					{ text: '课时统计', icon: '/static/b.png', page: '/pages/salary-statistics/salary-statistics' },
					{ text: '教师排课', icon: '/static/bb.png', page: '/pages/teacher-schedule/teacher-schedule' },
					{ text: '注册账号', icon: '/static/aaa.png', page: '/pages/register/register' },
					{ text: '系统设置', icon: '/static/cc.png', page: '/pages/system-setting/system-setting' },
					{ text: '学生档案', icon: '/static/教室.png', page: '/pages/archive/archive' },
					{ text: '更多', icon: '/static/more.png', page: '/pages/service/service' }
				],
				quickActions: [],
				newsList: [
					{ id: 1, title: '公司荣获XX奖项', content: '近日，公司在...', time: '2024-06-01' },
					{ id: 2, title: '新产品发布', content: '我们推出了...', time: '2024-06-28' }
				],
				// 订阅状态
				isSubscribed: false
			};
		},
		computed: {
			actionRows() {
				const arr = [];
				for (let i = 0; i < this.quickActions.length; i += 4) {
					arr.push(this.quickActions.slice(i, i + 4));
				}
				return arr;
			},
			isAdmin() {
				const userInfo = uni.getStorageSync('userInfo');
				return userInfo && (userInfo.permission === '管理员' || userInfo.permission === 'superadmin');
			}
		},
		
		onMounted() {
			console.log('🚀 首页 onMounted 开始执行');
			// 监听订阅状态变化事件
			uni.$on('subscriptionStatusChanged', this.handleSubscriptionStatusChanged);
			console.log('📡 首页已设置事件监听器');
			
			// 立即检查订阅状态
			this.checkSubscriptionStatus();
		},
		
		onUnmounted() {
			// 移除事件监听器
			uni.$off('subscriptionStatusChanged', this.handleSubscriptionStatusChanged);
		},
		
		onShow() {
			const userInfo = uni.getStorageSync('userInfo');
			if (!userInfo) {
				uni.reLaunch({ url: '/pages/login/login' });
				return;
			}
			
			console.log('🏠 首页 onShow 开始执行');
			
			// 检查订阅状态
			this.checkSubscriptionStatus();
			
			// 延迟再次检查订阅状态，确保从订阅设置页面返回时状态正确
			setTimeout(() => {
				console.log('⏰ 首页延迟检查订阅状态...');
				this.checkSubscriptionStatus();
			}, 300);
			
			// 体验版强制重新登录（可选）
			// 如果您想要体验版每次都重新登录，可以取消注释下面的代码
			// uni.reLaunch({ url: '/pages/login/login' });
			// return;
      // 每次进入首页都重置 quickActions
      this.quickActions = JSON.parse(JSON.stringify(this.initQuickActions));
      // 动态插入“成绩”和“进步分析”到首页功能区（仅普通老师账号）
      const isTeacher = Array.isArray(userInfo.role) ? userInfo.role.includes('教师') : userInfo.role === '教师';
      const isAcademic = Array.isArray(userInfo.role) ? userInfo.role.includes('教务') : userInfo.role === '教务';
      if (isTeacher && !isAcademic) {
        // 先移除已有的“成绩”和“进步分析”
        this.quickActions = this.quickActions.filter(a => a.text !== '成绩' && a.text !== '进步分析');
      }
		},
		
		// 页面获得焦点时检查订阅状态
		onFocus() {
			console.log('🎯 首页获得焦点，检查订阅状态');
			this.checkSubscriptionStatus();
		},
		
		methods: {
			goTo(item) {
				uni.navigateTo({ url: item.page });
			},
			openNewsEditor() {
				uni.showToast({ title: '请接入新闻编辑功能', icon: 'none' });
			},
			// 检查订阅状态
			checkSubscriptionStatus() {
				const subscriptionStatus = uni.getStorageSync('subscriptionStatus');
				console.log('🔍 首页检查订阅状态:', subscriptionStatus);
				
				// 明确检查 isSubscribed 的值
				if (subscriptionStatus && subscriptionStatus.isSubscribed === true) {
					this.isSubscribed = true;
					console.log('✅ 首页：订阅已开启，隐藏提示框');
				} else {
					this.isSubscribed = false;
					console.log('❌ 首页：订阅未开启，显示提示框');
				}
				
				// 输出当前状态用于调试
				console.log('🔍 首页当前 isSubscribed 状态:', this.isSubscribed);
			},
			// 跳转到订阅设置页面
			goToSubscriptionSettings() {
				uni.navigateTo({
					url: '/pages/subscription-settings/subscription-settings'
				});
			},
			// 处理订阅状态变化事件
			handleSubscriptionStatusChanged(data) {
				console.log('📢 首页收到订阅状态变化通知:', data);
				this.isSubscribed = data.isSubscribed;
				if (data.isSubscribed) {
					console.log('✅ 首页：订阅状态已更新为开启，隐藏提示框');
				} else {
					console.log('❌ 首页：订阅状态已更新为关闭，显示提示框');
				}
			},
			// 强制刷新订阅状态
			forceRefreshSubscription() {
				console.log('🔄 强制刷新订阅状态...');
				
				// 清除本地状态
				this.isSubscribed = false;
				
				// 重新检查存储中的状态
				const subscriptionStatus = uni.getStorageSync('subscriptionStatus');
				console.log('🔍 强制刷新：从存储获取的订阅状态:', subscriptionStatus);
				
				if (subscriptionStatus && subscriptionStatus.isSubscribed === true) {
					this.isSubscribed = true;
					console.log('✅ 强制刷新：订阅状态已恢复为开启');
				} else {
					this.isSubscribed = false;
					console.log('❌ 强制刷新：订阅状态仍为关闭');
				}
				
				console.log('🔍 强制刷新后：首页当前 isSubscribed 状态:', this.isSubscribed);
			},
			// 测试事件发送
			testEventEmit() {
				console.log('🧪 测试事件发送...');
				uni.$emit('subscriptionStatusChanged', { isSubscribed: true });
				console.log('📤 测试事件已发送');
			}
		}
	};
</script>

<style>
	.index-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		min-height: 100vh;
		background: #fff;
	}
	.search-bar {
		width: 100%;
		padding: 30rpx 20rpx 0 20rpx;
		background: #fff;
	}
	.search-input {
		width: 100%;
		height: 64rpx;
		background: #f1f3f6;
		border-radius: 32rpx;
		padding-left: 32rpx;
		font-size: 30rpx;
		color: #333;
		border: none;
	}
	.banner-swiper {
		width: 710rpx;
		height: 260rpx;
		border-radius: 20rpx;
		margin: 20rpx auto 30rpx auto;
		overflow: hidden;
		display: block;
	}
	.banner-img {
		width: 710rpx;
		height: 260rpx;
		border-radius: 20rpx;
		display: block;
	}
	.quick-actions {
		width: 710rpx;
		margin-bottom: 30rpx;
	}
	.action-row {
		display: flex;
		justify-content: space-between;
		margin-bottom: 24rpx;
	}
	.action-item {
		flex: 1;
		align-items: center;
		text-align: center;
	}
	.action-icon {
		width: 80rpx;
		height: 80rpx;
		margin-bottom: 8rpx;
	}
	.action-text {
		font-size: 28rpx;
	}
	.news-section {
		width: 710rpx;
		margin-top: 30rpx;
	}
	.news-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 16rpx;
	}
	.news-edit-btn {
		font-size: 26rpx;
		color: #1976D2;
		background: #e3f2fd;
		border: none;
		border-radius: 8rpx;
		padding: 8rpx 20rpx;
	}
	.news-list {
		background: #f8f8f8;
		border-radius: 16rpx;
		padding: 20rpx;
	}
	.news-item {
		margin-bottom: 18rpx;
	}
	.news-title {
		font-weight: bold;
		font-size: 30rpx;
	}
	.news-content {
		color: #666;
		margin: 8rpx 0;
		display: block;
	}
	.news-time {
		color: #aaa;
		font-size: 24rpx;
	}
	
	/* 订阅通知提示框样式 */
	.subscription-notice {
		width: 710rpx;
		background: #FFF3CD;
		border: 1px solid #FFEAA7;
		border-radius: 20rpx;
		padding: 30rpx;
		margin-bottom: 30rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	
	.notice-content {
		display: flex;
		align-items: center;
		flex: 1;
	}
	
	.notice-icon {
		font-size: 40rpx;
		margin-right: 20rpx;
	}
	
	.notice-text {
		display: flex;
		flex-direction: column;
	}
	
	.notice-title {
		font-size: 28rpx;
		color: #856404;
		font-weight: 500;
		margin-bottom: 8rpx;
	}
	
	.notice-desc {
		font-size: 24rpx;
		color: #856404;
		line-height: 1.4;
	}
	
	.enable-btn {
		background: #FF9800;
		color: white;
		border: none;
		border-radius: 25rpx;
		padding: 15rpx 30rpx;
		font-size: 26rpx;
		white-space: nowrap;
	}
	
	/* 调试信息样式 */
	.debug-info {
		width: 710rpx;
		background: #f0f0f0;
		border: 1px solid #ddd;
		border-radius: 10rpx;
		padding: 20rpx;
		margin-bottom: 20rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 24rpx;
		color: #666;
	}
</style> 