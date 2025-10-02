<template>
	<view class="bg-gradient">
		<view class="content">
			<view class="company-info">
				<image class="logo" src="/static/b3318194914f809af324de8884bd906.png" mode="aspectFit"></image>
				<text class="company-name highlight-company">新欣火教育咨询有限公司</text>
			</view>
			<view class="login-container">
				<view class="login-title">用户登录</view>
				<view class="input-group">
					<view class="input-icon-group">
						<text class="input-icon">👤</text>
						<input type="text" v-model="username" placeholder="请输入账号" class="input-item" />
					</view>
					<view class="input-icon-group">
						<text class="input-icon">🔒</text>
						<view class="password-input">
							<input :password="!showPassword" type="text" v-model="password" placeholder="请输入密码" class="input-item" />
							<text class="password-toggle" @click="togglePasswordVisibility">
								{{ showPassword ? '🙈' : '👁️' }}
							</text>
						</view>
					</view>
				</view>
				<button @click="handleLogin" class="login-btn">🚀 登录</button>
			</view>
			<view class="footer">
				<text class="copyright">© 2025 新欣火教育咨询有限公司 版权所有</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				username: '',
				password: '',
				defaultUsername: '15926686363',
				defaultPassword: '123456',
				showPassword: false
			}
		},
		onLoad() {
			// 页面加载时检查是否有保存的登录信息
			this.checkSavedLoginInfo();
		},
		methods: {
			// 检查保存的登录信息
			checkSavedLoginInfo() {
				try {
					const savedUsername = uni.getStorageSync('username');
					const savedPassword = uni.getStorageSync('password');
					if (savedUsername) this.username = savedUsername;
					if (savedPassword) this.password = savedPassword;
				} catch (e) {
					console.error('获取存储信息失败：', e);
				}
			},
			// 保存登录信息（只保存账号和密码）
			saveLoginInfo() {
				try {
					uni.setStorageSync('username', this.username);
					uni.setStorageSync('password', this.password);
					// 不在这里 set userInfo
				} catch (e) {
					console.error('保存登录信息失败：', e);
				}
			},
			
			// 保存注册账号到本地
			saveAccountToList(username, password) {
				let accountList = uni.getStorageSync('accountList') || [];
				if (!Array.isArray(accountList)) accountList = [];
				// 检查是否已存在
				const exist = accountList.some(acc => acc.username === username);
				if (!exist) {
					accountList.push({ username, password });
					uni.setStorageSync('accountList', accountList);
				}
			},
			
			handleLogin() {
				if (!this.username || !this.password) {
					uni.showToast({
						title: '请输入账号和密码',
						icon: 'none'
					});
					return;
				}

				uni.showLoading({
					title: '正在登录...'
				});

				// 先尝试修复管理员权限
				uniCloud.callFunction({
					name: 'auth-service',
					data: {
						action: 'fix-admin-permission'
					},
					success: (fixRes) => {
						console.log('管理员权限修复结果:', fixRes.result);
					},
					fail: (fixErr) => {
						console.error('修复管理员权限失败:', fixErr);
					},
					complete: () => {
						// 无论修复是否成功，都继续登录流程
						this.performLogin();
					}
				});
			},
			
			performLogin() {
				// 调用云函数进行登录
				uniCloud.callFunction({
					name: 'auth-service',
					data: {
						action: 'login',
						params: {
							username: this.username,
							password: this.password
						}
					},
					success: (res) => {
						uni.hideLoading();
						const result = res.result;
						if (result.code === 200) {
							// 登录成功，保存账号密码和 userInfo
							this.saveLoginInfo();
							uni.setStorageSync('userInfo', result.userInfo);
							uni.showToast({
								title: '登录成功',
								icon: 'success',
								duration: 1500,
								success: () => {
									setTimeout(() => {
										uni.reLaunch({
											url: '/pages/home/home'
										});
									}, 1500);
								}
							});
						} else {
							uni.showToast({
								title: result.message || '账号或密码错误',
								icon: 'none'
							});
						}
					},
					fail: (err) => {
						uni.hideLoading();
						uni.showToast({
							title: '登录请求失败，请稍后再试',
							icon: 'none'
						});
						console.error('登录失败', err);
					}
				});
			},
			// 切换密码显示状态
			togglePasswordVisibility() {
				this.showPassword = !this.showPassword;
			},
			

		}
	}
</script>

<style>
	.bg-gradient {
		min-height: 100vh;
		width: 100vw;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	}
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		padding: 80rpx 0 40rpx;
		box-sizing: border-box;
	}
	.company-info {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 50rpx;
	}
	.logo {
		width: 200rpx;
		height: 200rpx;
		margin-bottom: 15rpx;
		box-shadow: 0 15rpx 50rpx rgba(102, 126, 234, 0.3);
		border-radius: 50%;
		background: #fff;
		border: 8rpx solid rgba(255, 255, 255, 0.2);
	}
	.company-name {
		font-size: 52rpx;
		color: #ffffff;
		font-weight: 900;
		letter-spacing: 8rpx;
		margin-bottom: 15rpx;
		text-align: center;
		position: relative;
		z-index: 2;
		text-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.2);
	}
	.highlight-company {
		text-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.2);
		padding: 20rpx 30rpx;
		border-radius: 25rpx;
		background: rgba(255, 255, 255, 0.15);
		backdrop-filter: blur(10rpx);
		display: inline-block;
		border: 2rpx solid rgba(255, 255, 255, 0.2);
	}
	.login-container {
		width: 85%;
		padding: 60rpx 40rpx 50rpx 40rpx;
		background: rgba(255, 255, 255, 0.95);
		border-radius: 35rpx;
		box-shadow: 0 20rpx 60rpx rgba(102, 126, 234, 0.2);
		backdrop-filter: blur(20rpx);
		border: 2rpx solid rgba(255, 255, 255, 0.3);
	}
	.login-title {
		font-size: 42rpx;
		font-weight: bold;
		text-align: center;
		margin-bottom: 40rpx;
		color: #667eea;
		letter-spacing: 3rpx;
		text-shadow: 0 2rpx 4rpx rgba(102, 126, 234, 0.1);
	}
	.input-group {
		margin-bottom: 40rpx;
		width: 100%;
	}
	.input-icon-group {
		display: flex;
		align-items: center;
		margin-bottom: 25rpx;
		position: relative;
	}
	.input-icon {
		position: absolute;
		left: 30rpx;
		top: 50%;
		transform: translateY(-50%);
		font-size: 32rpx;
		z-index: 2;
		filter: drop-shadow(0 2rpx 4rpx rgba(0, 0, 0, 0.1));
	}
	.input-item {
		width: 100%;
		height: 100rpx;
		border: 2rpx solid rgba(102, 126, 234, 0.2);
		border-radius: 50rpx;
		padding: 0 30rpx 0 80rpx;
		box-sizing: border-box;
		font-size: 30rpx;
		background: rgba(255, 255, 255, 0.8);
		color: #333;
		transition: all 0.3s ease;
		backdrop-filter: blur(10rpx);
	}
	.input-item:focus {
		border: 2rpx solid #667eea;
		background: rgba(255, 255, 255, 0.95);
		box-shadow: 0 8rpx 25rpx rgba(102, 126, 234, 0.15);
		transform: translateY(-2rpx);
	}
	.password-input {
		position: relative;
		width: 100%;
	}
	.password-toggle {
		position: absolute;
		right: 25rpx;
		top: 50%;
		transform: translateY(-50%);
		font-size: 28rpx;
		color: #667eea;
		z-index: 3;
		background: rgba(255, 255, 255, 0.9);
		padding: 10rpx 15rpx;
		border-radius: 25rpx;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 4rpx 15rpx rgba(102, 126, 234, 0.1);
	}
	.password-toggle:active {
		transform: translateY(-50%) scale(0.95);
	}
	.password-input .input-item {
		padding-right: 100rpx;
	}
	.login-btn {
		margin-top: 30rpx;
		height: 100rpx;
		background: linear-gradient(135deg, #8172F5 0%, #667eea 100%);
		color: #fff;
		border: none;
		border-radius: 50rpx;
		font-size: 32rpx;
		font-weight: bold;
		letter-spacing: 4rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		box-shadow: 0 10rpx 30rpx rgba(102, 126, 234, 0.3);
		transition: all 0.3s ease;
	}
	.login-btn:active {
		transform: translateY(2px);
		box-shadow: 0 5rpx 15rpx rgba(102, 126, 234, 0.4);
	}
	.footer {
		margin-top: 50rpx;
	}
	.copyright {
		font-size: 26rpx;
		color: rgba(255, 255, 255, 0.8);
		text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
	}
	

</style>
