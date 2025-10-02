<template>
	<view class="page-container">
		<view class="status-bar"></view>
		<view class="top-bar">
			<view class="top-nav">
				<view class="back-btn" @click="goBack">
					<text class="back-icon">←</text>
					<text>返回</text>
				</view>
				<text class="page-title">订阅设置</text>
			</view>
		</view>
		
		<view class="content">
			<view class="login-status" v-if="!isLoggedIn">
				<view class="login-status-content">
					<text class="login-status-icon">⚠️</text>
					<view class="login-status-text">
						<text class="login-status-title">请先登录</text>
						<text class="login-status-desc">登录后才能管理订阅设置</text>
					</view>
				</view>
			</view>
			
			<view v-else>
				<view class="section">
					<view class="section-title">订阅状态</view>
					<view class="status-item">
						<text class="status-label">微信订阅消息</text>
						<text class="status-value" :class="isSubscribed ? 'success' : 'warning'">
							{{ isSubscribed ? '已开启' : '未开启' }}
						</text>
					</view>
				</view>
				
				<view class="section">
					<view class="section-title">通知设置</view>
					<view class="setting-item">
						<text class="setting-label">微信订阅消息</text>
						<switch 
							:checked="notificationSettings.wechatSubscription" 
							@change="onNotificationChange('wechatSubscription', $event)"
						/>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			// 用户信息
			userInfo: null,
			openid: null,
			isLoggedIn: false,
			hasOpenid: false,
			
			// 订阅状态
			isSubscribed: false,
			
			// 通知设置
			notificationSettings: {
				wechatSubscription: true,
				inAppPush: true,
				sms: false
			}
		};
	},
	
	onMounted() {
		console.log('🚀 订阅设置页面加载完成');
		this.checkUserLoginStatus();
	},
	
	methods: {
		goBack() {
			uni.navigateBack();
		},
		
		checkUserLoginStatus() {
			const userInfo = uni.getStorageSync('userInfo');
			const openid = uni.getStorageSync('openid');
			
			if (userInfo && openid) {
				this.userInfo = userInfo;
				this.openid = openid;
				this.isLoggedIn = true;
				this.hasOpenid = true;
			}
		},
		
		onNotificationChange(type, event) {
			try {
				console.log(`🔄 通知设置变更: ${type} = ${event.detail.value}`);
				this.notificationSettings[type] = event.detail.value;
				
				uni.showToast({
					title: '设置已保存',
					icon: 'success'
				});
			} catch (error) {
				console.error('通知设置变更失败:', error);
				uni.showToast({
					title: '设置保存失败',
					icon: 'none'
				});
			}
		}
	}
};
</script>

<style scoped>
.page-container {
	min-height: 100vh;
	background-color: #f5f5f5;
}

.status-bar {
	height: var(--status-bar-height);
	background-color: #1976D2;
}

.top-bar {
	background-color: #1976D2;
	padding: 20rpx 30rpx;
}

.top-nav {
	display: flex;
	align-items: center;
	position: relative;
}

.back-btn {
	display: flex;
	align-items: center;
	color: white;
	font-size: 32rpx;
}

.back-icon {
	font-size: 40rpx;
	margin-right: 10rpx;
}

.page-title {
	color: white;
	font-size: 36rpx;
	font-weight: bold;
	text-align: center;
	flex: 1;
}

.content {
	padding: 30rpx;
}

.login-status {
	background: #FFF3CD;
	border: 1px solid #FFEAA7;
	border-radius: 20rpx;
	padding: 30rpx;
	margin-bottom: 30rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.login-status-content {
	display: flex;
	align-items: center;
}

.login-status-icon {
	font-size: 40rpx;
	margin-right: 20rpx;
}

.login-status-text {
	display: flex;
	flex-direction: column;
}

.login-status-title {
	font-size: 28rpx;
	color: #856404;
	font-weight: 500;
}

.login-status-desc {
	font-size: 24rpx;
	color: #856404;
}

.section {
	background: white;
	border-radius: 16rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 20rpx;
}

.status-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.status-label {
	font-size: 28rpx;
	color: #666;
	min-width: 160rpx;
}

.status-value {
	font-size: 28rpx;
	color: #666;
	flex: 1;
	text-align: right;
}

.status-value.success {
	color: #4CAF50;
	font-weight: bold;
}

.status-value.warning {
	color: #FF9800;
	font-weight: bold;
}

.setting-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.setting-label {
	font-size: 28rpx;
	color: #666;
}
</style>
