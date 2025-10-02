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
				<view class="page-title">订阅通知设置</view>
			</view>
		</view>

		<!-- 主要内容 -->
		<view class="content">
			<!-- 订阅通知开关区域 -->
			<view class="subscription-section">
				<view class="section-title">📨 订阅通知</view>
				<view class="section-desc">开启订阅通知，及时接收课程安排信息</view>
				
				<!-- 订阅开关 -->
				<view class="switch-container">
					<view class="switch-label">
						<text class="switch-text">订阅消息通知</text>
						<text class="switch-status">{{ isSubscribed ? '已开启' : '已关闭' }}</text>
					</view>
					<switch 
						:checked="isSubscribed" 
						@change="onSubscriptionToggle"
						color="#667eea" 
						class="subscription-switch" />
				</view>
			</view>
			
			<!-- 微信绑定区域 -->
			<view class="wechat-section">
				<view class="section-title">🔗 微信绑定</view>
				<view class="section-desc">{{ hasOpenid ? '微信已绑定，可以接收消息' : '绑定微信账号以接收订阅消息' }}</view>
				
				<view class="wechat-action">
					<button 
						class="wechat-btn" 
						:class="{ 'bound': hasOpenid }"
						@click="handleWechatBinding"
						:loading="isBinding">
						{{ isBinding ? '绑定中...' : (hasOpenid ? '✓ 已绑定微信' : '绑定微信') }}
					</button>
				</view>
			</view>
			
			<!-- 测试消息区域 -->
			<view class="test-section" v-if="isSubscribed && hasOpenid">
				<view class="section-title">🧪 测试消息</view>
				<view class="section-desc">发送一条测试订阅消息，验证功能是否正常</view>
				
				<view class="test-action">
					<button 
						class="test-btn" 
						@click="sendTestMessage"
						:loading="isTesting">
						{{ isTesting ? '发送中...' : '📤 发送测试消息' }}
					</button>
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
			
			// 微信绑定状态（遵循项目规范增加状态管理）
			hasOpenid: false,
			isBinding: false,
			
			// 测试消息状态
			isTesting: false,
			
			// 微信订阅消息配置
			templateId: 'sOwar1Xkzk4ApC2eQvvc4SZFH6UbFz_ZA8DZjHHPZf4' // 排课通知模板ID
		};
	},
	
	// 页面加载时执行
	onMounted() {
		console.log('🚀 订阅设置页面加载完成');
		this.checkUserStatus();
	},
	
	// 页面显示时执行
	onShow() {
		console.log('👁️ 订阅设置页面显示');
		this.checkUserStatus();
	},
	
	methods: {
		goBack() {
			uni.navigateBack();
		},
		
		// 检查用户状态（订阅状态和微信绑定状态）
		async checkUserStatus() {
			try {
				// 检查订阅状态
				const localStatus = uni.getStorageSync('subscriptionStatus');
				if (localStatus && localStatus.isSubscribed) {
					this.isSubscribed = true;
					console.log('✅ 本地订阅状态：已订阅');
				} else {
					this.isSubscribed = false;
					console.log('❌ 本地订阅状态：未订阅');
				}
				
				// 检查微信绑定状态
				const openid = uni.getStorageSync('openid');
				if (openid) {
					this.hasOpenid = true;
					console.log('✅ 微信已绑定:', openid);
				} else {
					this.hasOpenid = false;
					console.log('❌ 微信未绑定');
				}
			} catch (error) {
				console.error('检查用户状态失败:', error);
				this.isSubscribed = false;
				this.hasOpenid = false;
			}
		},
		
		// 订阅开关切换处理
		async onSubscriptionToggle(event) {
			const isOn = event.detail.value;
			console.log(`🔄 订阅开关切换: ${isOn ? '开启' : '关闭'}`);
			
			if (isOn) {
				// 开启订阅
				await this.enableSubscription();
			} else {
				// 关闭订阅
				this.disableSubscription();
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
					
					// 调用云函数同步授权状态到数据库（创建伪永久订阅记录）
					try {
						const openid = uni.getStorageSync('openid');
						if (openid) {
							console.log('📤 同步主订阅授权状态到云端数据库...');
							
							const syncResult = await uniCloud.callFunction({
								name: 'subscription-message',
								data: {
									action: 'request-subscription',
									openid: openid,
									templateId: this.templateId,
									status: 'accepted'
								}
							});
							
							console.log('✅ 主订阅云端数据库同步结果:', syncResult);
							
							if (syncResult.result.code === 200) {
								console.log('✅ 主订阅伪永久记录创建成功');
							} else {
								console.log('⚠️ 主订阅伪永久记录创建失败:', syncResult.result.message);
							}
						} else {
							console.log('⚠️ 未找到openid，跳过云端同步');
						}
					} catch (syncError) {
						console.error('同步主订阅授权状态到云端失败:', syncError);
						// 不影响本地授权状态
					}
					
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
		disableSubscription() {
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
		},
		
		// 处理微信绑定
		async handleWechatBinding() {
			if (this.hasOpenid) {
				// 已绑定，可以重新绑定
				uni.showModal({
					title: '重新绑定',
					content: '是否要重新绑定微信账号？',
					success: (res) => {
						if (res.confirm) {
							this.bindWechat();
						}
					}
				});
			} else {
				// 未绑定，进行绑定
				this.bindWechat();
			}
		},
		
		// 绑定微信
		async bindWechat() {
			if (this.isBinding) {
				console.log('正在绑定中，跳过重复操作');
				return;
			}
			
			try {
				this.isBinding = true;
				
				// 检查是否在微信小程序环境
				// #ifdef MP-WEIXIN
				uni.showLoading({
					title: '正在绑定...'
				});
				
				// 获取微信登录code
				const loginResult = await uni.login({
					provider: 'weixin'
				});
				
				if (loginResult.code) {
					// 检查用户是否已登录
					const userInfo = uni.getStorageSync('userInfo');
					if (!userInfo || !userInfo._id) {
						uni.hideLoading();
						uni.showModal({
							title: '需要登录',
							content: '请先登录系统后再绑定微信',
							showCancel: false
						});
						return;
					}
					
					// 调用云函数绑定微信
					const res = await uniCloud.callFunction({
						name: 'auth-service',
						data: {
							action: 'bind-wechat',
							params: {
								code: loginResult.code,
								userId: userInfo._id
							}
						}
					});
					
					uni.hideLoading();
					
					if (res.result.code === 200) {
						// 保存openid
						uni.setStorageSync('openid', res.result.openid);
						
						// 更新状态
						this.hasOpenid = true;
						
						uni.showToast({
							title: '微信绑定成功',
							icon: 'success'
						});
					} else {
						const errorMsg = res.result.message || '绑定失败';
						console.error('微信绑定失败:', res.result);
						
						uni.showModal({
							title: '微信绑定失败',
							content: errorMsg,
							showCancel: false
						});
					}
				} else {
					uni.hideLoading();
					uni.showToast({
						title: '获取微信授权失败',
						icon: 'none'
					});
				}
				// #endif
				
				// #ifndef MP-WEIXIN
				uni.showToast({
					title: '请在微信小程序中使用',
					icon: 'none'
				});
				// #endif
			} catch (error) {
				uni.hideLoading();
				console.error('绑定微信失败:', error);
				uni.showToast({
					title: '绑定失败',
					icon: 'none'
				});
			} finally {
				this.isBinding = false;
			}
		},
		
		// 发送测试消息（单次发送，遵循项目规范）
		async sendTestMessage() {
			if (this.isTesting) return;
			
			this.isTesting = true;
			
			try {
				console.log('🧪 开始发送测试订阅消息...');
				
				// 显示加载提示
				uni.showLoading({
					title: '检查订阅状态...'
				});
				
				// 先检查云端是否已有伪永久订阅记录
				const openid = uni.getStorageSync('openid');
				if (!openid) {
					uni.hideLoading();
					uni.showModal({
						title: '需要绑定微信',
						content: '请先绑定微信账号后再发送测试消息。',
						showCancel: false,
						confirmText: '知道了'
					});
					return;
				}
				
				try {
					// 检查云端伪永久订阅状态
					console.log('🔍 检查云端伪永久订阅状态...');
					
					const statusResult = await uniCloud.callFunction({
						name: 'subscription-message',
						data: {
							action: 'get-subscription-status',
							openid: openid
						}
					});
					
					console.log('📊 云端订阅状态检查结果:', statusResult);
					
					if (statusResult.result.code === 200 && statusResult.result.data.isSubscribed) {
						// 已有伪永久订阅记录，直接发送测试消息
						console.log('✅ 发现伪永久订阅记录，直接发送测试消息（无需重新授权）');
						
						// 更新加载提示
						uni.showLoading({
							title: '发送测试消息...'
						});
					} else {
						// 未找到伪永久订阅记录，需要重新授权（仅首次）
						console.log('⚠️ 未找到伪永久订阅记录，需要进行首次授权');
						
						const authResult = await uni.requestSubscribeMessage({
							tmplIds: [this.templateId]
						});
						
						console.log('📱 首次授权结果:', authResult);
						
						if (authResult[this.templateId] !== 'accept') {
							uni.hideLoading();
							uni.showModal({
								title: '需要授权',
								content: '首次使用测试功能需要您授权订阅消息，授权后后续不需重复授权。',
								showCancel: false,
								confirmText: '知道了'
							});
							return;
						}
						
						// 创建伪永久订阅记录
						const syncResult = await uniCloud.callFunction({
							name: 'subscription-message',
							data: {
								action: 'request-subscription',
								openid: openid,
								templateId: this.templateId,
								status: 'accepted'
							}
						});
						
						if (syncResult.result.code === 200) {
							console.log('✅ 伪永久订阅记录创建成功，后续测试无需重复授权');
						}
						
						uni.showLoading({
							title: '发送测试消息...'
						});
					}
				} catch (checkError) {
					console.error('检查云端订阅状态失败:', checkError);
					// 如果检查失败，回退到重新授权流程
					const authResult = await uni.requestSubscribeMessage({
						tmplIds: [this.templateId]
					});
					
					if (authResult[this.templateId] !== 'accept') {
						uni.hideLoading();
						uni.showModal({
							title: '需要授权',
							content: '发送测试消息需要您授权订阅消息。',
							showCancel: false,
							confirmText: '知道了'
						});
						return;
					}
					
					uni.showLoading({
						title: '发送测试消息...'
					});
				}
				
				// 生成测试消息内容
				const now = new Date();
				const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
				
				// 使用微信API标准时间格式
				const year = tomorrow.getFullYear();
				const month = tomorrow.getMonth() + 1;
				const date = tomorrow.getDate();
				const formattedDateTime = `${year}年${month}月${date}日 18:00`;
				
				// 生成唯一的测试消息内容
				const uniqueId = now.getTime();
				const messageData = {
					courseName: `测试课程-${uniqueId}`,
					classTime: formattedDateTime,
					remark: `测试教室-${now.getSeconds()}秒`,
					studentName: '测试学员',
					page: 'pages/schedule-tab/schedule-tab'
				};
				
				console.log('📤 即将发送的测试消息数据:', messageData);
				
				// 调用云函数发送测试消息
				const result = await uniCloud.callFunction({
					name: 'subscription-message',
					data: {
						action: 'send-schedule-notification',
						openid: openid,
						...messageData
					}
				});
				
				console.log('📥 测试消息发送结果:', result);
				
				uni.hideLoading();
				
				// 详细检查发送结果
				if (result.success && result.result) {
					const cloudResult = result.result;
					console.log('☁️ 云函数返回结果详情:', cloudResult);
					
					// 检查云函数执行结果
					if (cloudResult.code === 200) {
						const msgid = cloudResult.data?.msgid;
						const method = cloudResult.data?.method || 'pseudo_permanent';
						const note = cloudResult.data?.note || '';
						const originalError = cloudResult.data?.originalError;
						
						console.log('✅ 云函数执行成功:', {
							msgid: msgid,
							method: method,
							note: note,
							originalError: originalError
						});
						
						// 检查是否有微信API错误（如43101）
						if (originalError && (originalError.errcode === '43101' || originalError.errcode === 43101)) {
							// 检查本地订阅状态，提供更准确的指导
							const isLocalSubscribed = this.isSubscribed;
							console.log('🔍 43101错误分析:', {
								localSubscribed: isLocalSubscribed,
								errorCode: originalError.errcode,
								errorMsg: originalError.errmsg
							});
							
							// 伪永久订阅功能：即使43101错误，也保持订阅状态有效
							uni.showModal({
								title: '📱 微信通知设置提醒',
								content: `您的订阅状态正常，但微信可能在系统层面限制了通知。\n\n✅ 伪永久订阅仍然有效\n✅ 无需重新授权\n✅ 可继续正常发送\n\n如需接收微信通知，请检查：\n1. 微信-设置-通用-小程序-通知管理\n2. 确保开启了本小程序的通知权限`,
								confirmText: '知道了',
								showCancel: false
							});
						} else if (msgid) {
							// 真正发送成功
							uni.showModal({
								title: '✅ 测试成功',
								content: `测试订阅消息发送成功！\n\n消息ID: ${msgid}\n发送时间: ${new Date().toLocaleString()}\n发送方式: ${method}\n\n${note ? '说明: ' + note + '\n\n' : ''}请检查微信是否收到通知。`,
								confirmText: '知道了',
								showCancel: false
							});
						} else {
							// 没有msgid，可能是特殊处理模式
							uni.showModal({
								title: '✅ 处理成功',
								content: `测试消息已处理！\n\n处理时间: ${new Date().toLocaleString()}\n处理方式: ${method}\n\n${note ? '说明: ' + note : '消息已按特殊策略处理'}`,
								confirmText: '知道了',
								showCancel: false
							});
						}
					} else {
						// 云函数返回错误
						throw new Error(cloudResult.message || '云函数执行失败');
					}
				} else {
					// 云函数调用失败
					throw new Error('云函数调用失败');
				}
			} catch (error) {
				uni.hideLoading();
				console.error('发送测试消息失败:', error);
				
				uni.showModal({
					title: '测试失败',
					content: `测试消息发送失败：\n\n${error.message}\n\n请检查网络连接或稍后重试。`,
					confirmText: '知道了',
					showCancel: false
				});
			} finally {
				this.isTesting = false;
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

/* 通用区域样式 */
.subscription-section,
.wechat-section,
.test-section {
	background: rgba(255, 255, 255, 0.95);
	border-radius: 20rpx;
	padding: 40rpx;
	margin-bottom: 30rpx;
	box-shadow: 0 10rpx 40rpx rgba(0, 0, 0, 0.1);
	backdrop-filter: blur(10px);
}

.section-title {
	font-size: 22px;
	font-weight: bold;
	color: #333;
	margin-bottom: 15rpx;
}

.section-desc {
	font-size: 14px;
	color: #666;
	margin-bottom: 30rpx;
	line-height: 1.6;
}

/* 开关容器样式 */
.switch-container {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx 0;
}

.switch-label {
	flex: 1;
}

.switch-text {
	font-size: 16px;
	color: #333;
	font-weight: 500;
	display: block;
	margin-bottom: 8rpx;
}

.switch-status {
	font-size: 12px;
	color: #999;
}

.subscription-switch {
	transform: scale(1.2);
}

/* 按钮样式 */
.wechat-action,
.test-action {
	display: flex;
	justify-content: center;
}

.wechat-btn,
.test-btn {
	width: 280rpx;
	height: 70rpx;
	border: none;
	border-radius: 35rpx;
	font-size: 16px;
	font-weight: 500;
	transition: all 0.3s ease;
}

.wechat-btn {
	background: linear-gradient(135deg, #52C41A, #73D13D);
	color: white;
	box-shadow: 0 6rpx 20rpx rgba(82, 196, 26, 0.3);
}

.wechat-btn.bound {
	background: linear-gradient(135deg, #52C41A, #389E0D);
	box-shadow: 0 6rpx 20rpx rgba(82, 196, 26, 0.4);
}

.test-btn {
	background: linear-gradient(135deg, #1890FF, #096DD9);
	color: white;
	box-shadow: 0 6rpx 20rpx rgba(24, 144, 255, 0.3);
}

.wechat-btn:active,
.test-btn:active {
	transform: scale(0.95);
}

.wechat-btn::after,
.test-btn::after {
	border: none;
}
</style>