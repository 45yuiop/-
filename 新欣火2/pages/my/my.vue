<template>
	<view>
		<!-- <view style="font-size:32rpx;color:#1976D2;font-weight:bold;margin:40rpx 0 30rpx 0;text-align:center;">这里是个人中心页面</view> -->
		<view class="my-page">
			<!-- 用户信息卡片 -->
			<view class="user-card">
				<image class="avatar" src="/static/b3318194914f809af324de8884bd906(1).png" mode="aspectFill"></image>
				<view class="user-info">
					<text class="user-name">
						{{ userInfo.teacherName || '未设置姓名' }}
						<template v-if="isParentRole(userInfo.role)">家长</template>
					</text>
					<text class="user-id">{{ userInfo.username || '无账号信息' }}</text>
					<view class="user-row" v-if="userInfo.subject || supervisorInfo">
						<text v-if="userInfo.subject" class="user-subject">{{ userInfo.subject }}</text>
						<text v-if="supervisorInfo" class="user-supervisor">
							直属上级：{{ supervisorInfo.teacherName }} ({{ supervisorInfo.username }})
						</text>
					</view>
				</view>
			</view>
			<!-- 菜单卡片 -->
			<view class="menu-list">
				<view class="menu-item" @click="goToAbout">
					<text class="menu-icon">&#x2139;</text>
					<text class="menu-text">关于我们</text>
					<text class="arrow">›</text>
				</view>
				<view class="menu-item" @click="goToSystemSetting">
					<text class="menu-icon">&#x2B22;</text>
					<text class="menu-text">系统设置</text>
					<text class="arrow">›</text>
				</view>
				<view class="menu-item" @click="goToSubscriptionSettings">
					<text class="menu-icon">🔔</text>
					<text class="menu-text">订阅通知设置</text>
					<text class="arrow">›</text>
				</view>
			</view>
			<!-- 新增退出登录按钮 -->
			<view class="logout-btn-modern" @click="logout">
				<text class="logout-icon">🚪</text>
				<text class="logout-text">退出登录</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: {},
				supervisorInfo: null
			}
		},
		onShow() {
			this.getUserInfo();
		},
		methods: {
					getUserInfo() {
			const userInfo = uni.getStorageSync('userInfo');
			if (userInfo) {
				this.userInfo = userInfo;
				// 如果有上级领导信息，获取上级领导详情
				if (userInfo.supervisor) {
					this.getSupervisorInfo(userInfo.supervisor);
				}
			} else {
				uni.reLaunch({
					url: '/pages/login/login'
				});
			}
		},
			
			// 获取上级领导信息
			async getSupervisorInfo(supervisorId) {
				try {
					const res = await uniCloud.callFunction({
						name: 'user-center',
						data: {
							action: 'getSupervisorInfo',
							params: { supervisorId }
						}
					});
					
					if (res.result.code === 200) {
						this.supervisorInfo = res.result.data;
					} else {
						console.error('获取上级领导信息失败:', res.result.message);
					}
				} catch (error) {
					console.error('获取上级领导信息失败:', error);
				}
			},
			goToSystemSetting() {
				uni.navigateTo({ url: '/pages/system-setting/system-setting' });
			},
			goToAbout() {
				uni.navigateTo({ url: '/pages/about/about' });
			},
			goToSubscriptionSettings() {
				uni.navigateTo({ url: '/pages/subscription-settings/subscription-settings' });
			},
			isParentRole(role) {
				if (!role) return false;
				if (Array.isArray(role)) {
					return role.includes('家长') || role.includes('parent');
				}
				return role === '家长' || role === 'parent';
			},
			async logout() {
				// 清除所有本地存储的用户信息
				uni.removeStorageSync('userInfo');
				uni.removeStorageSync('username');
				uni.removeStorageSync('password');
				uni.removeStorageSync('accountList');
				// 清除uni-id认证令牌
				uni.removeStorageSync('uni_id_token');
				uni.removeStorageSync('uni_id_refresh_token');
				
				// 登出uniCloud会话并等待完成
				if (uniCloud && uniCloud.logout) {
					await uniCloud.logout();
				}
				
				// 跳转到登录页面
				uni.reLaunch({
					url: '/pages/login/login'
				});
			}
		}
	}
</script>

<style>
.my-page {
	background-color: #f7f7f7;
	min-height: 100vh;
	padding-top: 80rpx;
}

.user-card {
	display: flex;
	align-items: center;
	background-color: #f7f7f7;
	padding: 60rpx 40rpx;
	color: #333;
}

.avatar {
	width: 120rpx;
	height: 120rpx;
	border-radius: 50%;
	border: 4rpx solid rgba(255, 255, 255, 0.5);
	margin-right: 30rpx;
}

.user-info {
	display: flex;
	flex-direction: column;
}

.user-name {
	font-size: 40rpx;
	font-weight: bold;
}

.user-id {
	font-size: 28rpx;
	color: #999;
	margin-top: 10rpx;
}

.user-subject {
	font-size: 24rpx;
	color: #4CAF50;
	background: rgba(76, 175, 80, 0.1);
	padding: 4rpx 12rpx;
	border-radius: 12rpx;
	font-weight: 500;
	margin-top: 8rpx;
	align-self: flex-start;
}

.user-supervisor {
	font-size: 24rpx;
	color: #FF9800;
	background: rgba(255, 152, 0, 0.1);
	padding: 4rpx 12rpx;
	border-radius: 12rpx;
	font-weight: 500;
	margin-top: 8rpx;
	align-self: flex-start;
}

.user-row {
	display: flex;
	align-items: center;
	gap: 20rpx;
}

.menu-list {
	margin: 30rpx 20rpx 0 20rpx;
	background-color: #fff;
	border-radius: 20rpx;
	box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.03);
}
.menu-item {
	display: flex;
	align-items: center;
	padding: 36rpx 40rpx;
	border-bottom: 1rpx solid #f0f0f0;
}
.menu-item:last-child {
	border-bottom: none;
}
.menu-icon {
	font-size: 40rpx;
	margin-right: 30rpx;
	color: #ff9800;
	font-family: inherit;
}
.menu-text {
	font-size: 32rpx;
	flex-grow: 1;
}
.arrow {
	font-size: 40rpx;
	color: #ccc;
}
/* 优化后的退出登录按钮样式 */
.logout-btn-modern {
	margin: 32rpx 40rpx 32rpx 40rpx;
	padding: 24rpx 0;
	background: #ff4d4f;
	color: #fff;
	text-align: center;
	border-radius: 32rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 32rpx;
	font-weight: bold;
	box-shadow: 0 2rpx 8rpx rgba(255,77,79,0.08);
	transition: background 0.2s;
}
.logout-btn-modern:active {
	background: #e13c3e;
}
.logout-icon {
	font-size: 36rpx;
	margin-right: 16rpx;
}
.logout-text {
	font-size: 32rpx;
}
</style>