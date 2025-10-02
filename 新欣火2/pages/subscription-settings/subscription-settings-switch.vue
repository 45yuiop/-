<template>
	<view class="page-container">
		<!-- 状态栏 -->
		<view class="status-bar"></view>
		
		<!-- 顶部导航栏 -->
		<view class="top-bar">
			<view class="top-nav">
				<view class="back-btn" @click="goBack">
					<text class="back-icon">←</text>
					<text>返回</text>
				</view>
				<view class="page-title">订阅通知</view>
			</view>
		</view>

		<!-- 主要内容 -->
		<view class="content">
			<!-- 简洁的订阅授权区域 -->
			<view class="simple-subscription-section">
				<view class="section-title">📨 订阅通知</view>
				<view class="section-desc">开启订阅通知，及时接收课程安排信息</view>
				
				<!-- 订阅授权开关 -->
				<view class="subscription-switch-container">
					<view class="switch-label">
						<text class="switch-text">{{ isSubscribed ? '已开启通知' : '开启通知' }}</text>
						<text class="switch-desc">{{ isSubscribed ? '您将收到课程安排提醒' : '滑动开关即可订阅' }}</text>
					</view>
					<switch 
						:checked="isSubscribed" 
						@change="onSubscriptionSwitch"
						:disabled="isSubscribing"
						color="#667eea" />
				</view>
				
				<!-- 加载状态提示 -->
				<view v-if="isSubscribing" class="loading-tip">
					<text class="loading-text">正在处理中...</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			// 订阅状态
			isSubscribed: false,
			isSubscribing: false,
			
			// 微信订阅消息配置
			templateId: 'sOwar1Xkzk4ApC2eQvvc4SZFH6UbFz_ZA8DZjHHPZf4' // 排课通知模板ID
		};
	},
	
	// 页面加载时执行
	onMounted() {
		console.log('🚀 订阅设置页面加载完成');
		this.checkSubscriptionStatus();
	},
	
	// 页面显示时执行
	onShow() {
		console.log('👁️ 订阅设置页面显示');
		this.checkSubscriptionStatus();
	},
	
	methods: {
		goBack() {
			uni.navigateBack();
		},
		
		// 检查订阅状态
		async checkSubscriptionStatus() {
			try {
				const localStatus = uni.getStorageSync('subscriptionStatus');
				if (localStatus && localStatus.isSubscribed) {
					this.isSubscribed = true;
					console.log('✅ 本地订阅状态：已订阅');
				} else {
					this.isSubscribed = false;
					console.log('❌ 本地订阅状态：未订阅');
				}
			} catch (error) {
				console.error('检查订阅状态失败:', error);
				this.isSubscribed = false;
			}
		},
		
		// 处理订阅开关变化
		async onSubscriptionSwitch(event) {
			if (this.isSubscribing) return;
			
			const isOn = event.detail.value;
			console.log(`🔄 订阅开关变化: ${isOn ? '开启' : '关闭'}`);
			
			if (isOn) {
				// 开启订阅
				await this.enableSubscription();
			} else {
				// 关闭订阅
				await this.disableSubscription();
			}
		},
		
		// 开启订阅
		async enableSubscription() {
			this.isSubscribing = true;
			
			try {
				console.log('🔐 请求订阅消息授权...');
				
				// 调用微信订阅消息授权接口
				const authResult = await uni.requestSubscribeMessage({
					tmplIds: [this.templateId]
				});
				
				console.log('📱 微信授权结果:', authResult);
				
				if (authResult[this.templateId] === 'accept') {
					console.log('✅ 用户接受订阅消息授权');
					
					// 更新订阅状态
					this.isSubscribed = true;
					
					// 保存到本地存储
					uni.setStorageSync('subscriptionStatus', {
						isSubscribed: true,
						status: 'accepted',
						lastUpdate: Date.now(),
						cacheExpiry: Date.now() + (365 * 24 * 60 * 60 * 1000) // 1年有效期
					});
					
					uni.showToast({
						title: '订阅成功',
						icon: 'success'
					});
				} else if (authResult[this.templateId] === 'reject') {
					console.log('❌ 用户拒绝订阅消息授权');
					
					// 恢复开关状态
					this.isSubscribed = false;
					
					uni.showToast({
						title: '订阅被拒绝',
						icon: 'none'
					});
				} else {
					console.log('⚠️ 订阅消息授权失败:', authResult[this.templateId]);
					
					// 恢复开关状态
					this.isSubscribed = false;
					
					uni.showToast({
						title: '授权失败',
						icon: 'none'
					});
				}
			} catch (error) {
				console.error('请求订阅授权失败:', error);
				
				// 恢复开关状态
				this.isSubscribed = false;
				
				uni.showModal({
					title: '授权失败',
					content: '无法获取订阅消息授权，请稍后重试。',
					showCancel: false,
					confirmText: '知道了'
				});
			} finally {
				this.isSubscribing = false;
			}
		},
		
		// 关闭订阅
		async disableSubscription() {
			try {
				console.log('🔒 关闭订阅通知...');
				
				// 更新本地状态
				this.isSubscribed = false;
				
				// 清除本地存储
				uni.removeStorageSync('subscriptionStatus');
				
				uni.showToast({
					title: '已关闭订阅',
					icon: 'success'
				});
			} catch (error) {
				console.error('关闭订阅失败:', error);
			}
		}
	}
};
</script>

<style scoped>
.page-container {
	height: 100vh;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	display: flex;
	flex-direction: column;
}

.status-bar {
	height: var(--status-bar-height);
	background: transparent;
}

.top-bar {
	background: rgba(255, 255, 255, 0.95);
	backdrop-filter: blur(10px);
	border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.top-nav {
	display: flex;
	align-items: center;
	padding: 20rpx 30rpx;
	position: relative;
}

.back-btn {
	display: flex;
	align-items: center;
	color: #333;
	font-size: 16px;
	cursor: pointer;
}

.back-icon {
	font-size: 20px;
	margin-right: 8rpx;
}

.page-title {
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
	font-size: 18px;
	font-weight: bold;
	color: #333;
}

.content {
	flex: 1;
	padding: 30rpx;
	overflow-y: auto;
}

.simple-subscription-section {
	background: rgba(255, 255, 255, 0.95);
	border-radius: 20rpx;
	padding: 40rpx;
	margin-bottom: 30rpx;
	box-shadow: 0 10rpx 40rpx rgba(0, 0, 0, 0.1);
	backdrop-filter: blur(10px);
}

.section-title {
	font-size: 24px;
	font-weight: bold;
	color: #333;
	margin-bottom: 15rpx;
	text-align: center;
}

.section-desc {
	font-size: 14px;
	color: #666;
	text-align: center;
	margin-bottom: 40rpx;
	line-height: 1.6;
}

.subscription-switch-container {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 30rpx;
	background: rgba(255, 255, 255, 0.8);
	border-radius: 15rpx;
	margin-bottom: 20rpx;
}

.switch-label {
	flex: 1;
	margin-right: 30rpx;
}

.switch-text {
	font-size: 18px;
	font-weight: bold;
	color: #333;
	display: block;
	margin-bottom: 8rpx;
}

.switch-desc {
	font-size: 14px;
	color: #666;
	display: block;
	line-height: 1.4;
}

.loading-tip {
	text-align: center;
	margin-top: 20rpx;
}

.loading-text {
	font-size: 14px;
	color: #999;
}
</style>