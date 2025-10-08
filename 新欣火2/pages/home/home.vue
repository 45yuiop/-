<template>
	<view class="container">
		<!-- 搜索栏 -->
		<view class="search-bar" @click="goToSearch">
			<image class="search-logo" src="/static/b3318194914f809af324de8884bd906(1).png" mode="aspectFit" />
			<input class="search-input-real" :disabled="true" placeholder="大家都在搜：我的课表" placeholder-class="search-placeholder" />
		</view>
		<!-- 宣传图轮播 -->
		<swiper class="banner-swiper" :indicator-dots="true" :autoplay="true" interval="3000" circular>
			<swiper-item v-for="(img, idx) in bannerList" :key="idx">
				<image class="banner-img" :src="img" mode="aspectFill" />
			</swiper-item>
		</swiper>
		
		<!-- 订阅通知横幅 -->
		<view class="subscription-banner" v-if="showSubscriptionBanner" @click="goToSubscription">
			<view class="banner-content">
				<view class="banner-left">
					<view class="banner-icon">🔔</view>
					<view class="banner-text">
						<text class="banner-title">{{ subscriptionBannerTitle }}</text>
						<text class="banner-desc">{{ subscriptionBannerDesc }}</text>
					</view>
				</view>
				<view class="banner-right">
					<text class="banner-btn">{{ subscriptionBannerBtnText }}</text>
					<text class="banner-arrow">→</text>
				</view>
			</view>
		</view>
		
		<!-- 常用功能区 -->
		<view class="quick-actions">
			<view class="quick-grid" :style="{ 'justify-content': filteredFeatures.length <= 4 ? 'center' : 'flex-start' }">
				<view
					v-for="(item, idx) in filteredFeatures"
					:key="item.text"
					class="service-card"
					@click="goTo(item)"
					v-if="idx < 8"
				>
					<view class="service-icon-bg" :style="{ background: getLightColor(item.color, item.bgAlpha || 0.15) }">
						<image class="service-icon" :src="item.icon" mode="aspectFit"></image>
					</view>
					<text class="service-text">{{ item.text }}</text>
				</view>
			</view>
		</view>


		<!-- 公告框 -->
		<view class="announcement-container">
			<view class="announcement-content">
	<image class="horn-icon" src="/static/123.png" mode="aspectFit"></image>
	<view class="scroll-container">
		<text class="announcement-text">{{ announcementText }}</text>
	</view>
</view>
		</view>

		<!-- 事件备忘录区 -->
		<view class="news-section">
			<view class="news-header">
				<text>事件备忘录</text>
				<button v-if="isAdmin" class="news-edit-btn" @click.stop="openNewsEditor">+</button>
			</view>
				<!-- 新闻列表 -->
				<view class="news-list">
					<view class="news-item" v-for="news in newsList" :key="news.id" @click="viewNewsDetail(news)" :class="{ 'pinned-news': news.isPinned }">
						<view class="news-content">
							<view class="news-left">
								<view class="news-title-row">
									<text class="news-title">{{ news.title }}</text>
									<view v-if="news.isPinned" class="pin-badge">
										<text class="pin-icon">📌</text>
										<text class="pin-text">置顶</text>
									</view>
								</view>
								<view class="news-snippet">{{ getNewsSnippet(news) }}</view>
							</view>
							
							<view class="news-right">
								<!-- 显示第一张图片 -->
								<view v-if="news.contentBlocks && news.contentBlocks.length > 0" class="news-image-container">
									<view 
										v-for="(block, index) in news.contentBlocks.filter(b => b.type === 'image').slice(0, 1)" 
										:key="index"
										class="image-preview-item"
									>
										<image 
											:src="block.imageUrl" 
											class="news-image-preview" 
											mode="aspectFill"
										/>
									</view>
								</view>
								<!-- 如果没有图片，显示占位符 -->
								<view v-else class="news-image-placeholder">
									<text class="placeholder-text">无图片</text>
								</view>
							</view>
						</view>
						<!-- 底部整行时间，右对齐 -->
						<view class="news-footer">
							<text class="news-time">{{ formatTime(news.time) }}</text>
						</view>
					</view>
				</view>
		</view>
	</view>
</template>

<script>
function getLightColor(hex, alpha = 0.15) {
	if (!hex) return `rgba(200,200,200,${alpha})`;
	hex = hex.replace('#', '');
	if (hex.length === 3) hex = hex.split('').map(x => x + x).join(''); 
	
	const r = parseInt(hex.substring(0, 2), 16);
	const g = parseInt(hex.substring(2, 4), 16);
	const b = parseInt(hex.substring(4, 6), 16);
	return `rgba(${r},${g},${b},${alpha})`;
}
export default {
	data() {
		return {
			announcementText: '重要通知：老师课程表已更新，请各位老师及时查看。',
			bannerList: [
				'/static/jj.png',
		
				'/static/j.png'
			],
			// 订阅通知横幅相关
			showSubscriptionBanner: false,
			subscriptionBannerTitle: '',
			subscriptionBannerDesc: '',
			subscriptionBannerBtnText: '',
			quickActions: [
				{ text: '教师课程表', icon: '/static/bbb.png', page: '/pages/admin-teacher-schedule/admin-teacher-schedule', color: '#64B5F6' },
				{ text: '我的课表', icon: '/static/d.png', page: '/pages/teacher-courses/teacher-courses', color: '#FFF3CD', bgAlpha: 0.8 },
				{ text: '教师排课', icon: '/static/bb.png', page: '/pages/teacher-schedule/teacher-schedule', color: '#7C4DFF' },
				{ text: '课时统计', icon: '/static/b.png', page: '/pages/salary-statistics/salary-statistics', color: '#FF8A65' },
				{ text: '注册账号', icon: '/static/aaa.png', page: '/pages/register/register', color: '#4FC3F7' },
				{ text: '账号管理', icon: '/static/c.png', page: '/pages/account-manage/account-manage', color: '#FFD600' },
				{ text: '我的班级', icon: '/static/教室.png', page: '/pages/my-class/my-class', color: '#9C27B0' },
				{ text: '权限分配', icon: '/static/dd.png', page: '/pages/permission-assign/index', color: '#BA68C8', bgAlpha: 1 },
				{ text: '调课审批', icon: '/static/e.png', page: '/pages/course-change-approval/course-change-approval', color: '#FFB300' },
				{ text: '系统设置', icon: '/static/cc.png', page: '/pages/system-setting/system-setting', color: '#42A5F5' },
				{ text: '更多', icon: '/static/f.png', page: '/pages/service/service', color: '#e0e0e0' },
				{ text: '学生档案', icon: '/static/gongju.png', page: '/pages/archive/archive', color: '#42A5F5' },
				{ text: '学生录入', icon: '/static/1234.png', page: '/pages/student-input/student-input', color: '#4FC3F7' },
				{ text: '班级管理', icon: '/static/222.png', page: '/pages/class-management/class-management', color: '#9C27B0' },
				{ text: '成绩', icon: '/static/1.png', page: '/pages/exam-scores/exam-scores', color: '#FF6B6B' },
				{ text: '进步分析', icon: '/static/ii.png', page: '/pages/student-progress/student-progress', color: '#4ECDC4' },
				{ text: '教室', icon: '/static/2.png', page: '/pages/classroom/classroom', color: '#1976D2' },
				{ text: '师资力量', icon: '/static/user.png', page: '/pages/faculty-strength/faculty-strength', color: '#FF9800' },
				{ text: '试卷分析', icon: '/static/22.png', page: '/pages/exam-analysis/exam-analysis', color: '#E91E63' }
			],
			newsList: [
				
			]
		}
	},
	computed: {
		isAdmin() {
			const userInfo = uni.getStorageSync('userInfo');
			return userInfo && (userInfo.permission === '管理员' || userInfo.permission === 'superadmin');
		},
		isAcademic() {
			const userInfo = uni.getStorageSync('userInfo');
			return userInfo && (Array.isArray(userInfo.role) ? userInfo.role.includes('教务') : userInfo.role === '教务');
		},
		filteredFeatures() {
			const userInfo = uni.getStorageSync('userInfo');
			if (!userInfo) return [];
			const isSuperAdmin = userInfo.permission === 'superadmin';
			const isAdmin = userInfo.permission === '管理员' || isSuperAdmin || (Array.isArray(userInfo.role) && userInfo.role.includes('管理员'));
			const isTeacher = Array.isArray(userInfo.role) ? userInfo.role.includes('教师') : userInfo.role === '教师';
			const isParent = Array.isArray(userInfo.role) ? userInfo.role.includes('家长') : userInfo.role === 'parent';
			const isAcademic = this.isAcademic;
			const isAdminAcademic = isAcademic && userInfo.permission === '管理员';
			const isTeacherAndAdmin = isTeacher && isAdmin;
			let actions = [...this.quickActions];
			let features = actions.filter(feature => {
				if (isSuperAdmin) return true;
				
				// 教务账号权限控制 - 与服务页面保持一致
				if (isAcademic) {
				// 教务账号可以访问的功能（与服务页面一致）
				if (
					feature.text === '教师课程表' ||
					feature.text === '学生档案' ||
					feature.text === '教室' ||
					feature.text === '成绩' ||
					feature.text === '注册账号' ||
					feature.text === '教师排课' ||
					feature.text === '权限分配' ||
					feature.text === '班级管理' ||
					feature.text === '学生录入' ||
					feature.text === '试卷分析' ||
					feature.text === '更多'
				) return true;
					
					// 检查用户是否有featureList权限配置
					if (userInfo.featureList && Array.isArray(userInfo.featureList)) {
						const featureKey = this.getFeatureKey(feature.text);
						return userInfo.featureList.includes(featureKey);
					}
					
					return false;
				}
				
				if (isTeacherAndAdmin && feature.text === '学生课时录入') return false;
				if (isSuperAdmin && feature.text === '我的课表') return false;
				// 移除对教务账号课时统计的限制
				// if (isAdminAcademic && feature.text === '课时统计') return false;
				if (isAdmin) {
					// 管理员不能看到"师资力量"功能
					if (feature.text === '师资力量') return false;
					return true;
				}
				if (isParent) {
					return feature.text === '教师课程表' || feature.text === '师资力量';
				}
				if (isTeacher) {
					return (
						feature.text === '我的课表' ||
						feature.text === '课时统计' ||
						feature.text === '教室' ||
						feature.text === '成绩' ||
						feature.text === '进步分析' ||
						feature.text === '试卷分析' ||
						feature.text === '我的班级' ||
						feature.text === '更多'
					);
				}
				return false;
			});
			
			// 教务账号过滤掉不应该看到的功能
			if (isAcademic) {
				features = features.filter(f => 
					f.text !== '我的课表' && 
					f.text !== '我的班级' && 
					f.text !== '进步分析' && 
					f.text !== '试卷分析' &&
					f.text !== '教师排课' &&
					f.text !== '权限分配' &&
					f.text !== '课时统计' && // 教务账号不显示课时统计
					f.text !== '师资力量' && // 教务账号不显示师资力量
					f.text !== '系统设置' && // 教务账号不显示系统设置
					f.text !== '账号管理' // 教务账号不显示账号管理
				);
			}
			
			features = features.filter(f => f.text !== '更多');
			if (features.length > 8) features = features.slice(0, 7);
			const moreBtn = actions.find(f => f.text === '更多');
			if (moreBtn) features.push(moreBtn);
			return features;
		},
	},
	methods: {
		goTo(item) {
			if (item.text === '更多') {
				uni.switchTab({ url: item.page });
			} else {
				uni.navigateTo({ url: item.page });
			}
		},
		goToSearch() {
			uni.navigateTo({ url: '/pages/search-page/search-page' });
		},
		openNewsEditor() {
			// 检查用户权限
			const userInfo = uni.getStorageSync('userInfo');
			if (!userInfo || !(userInfo.permission === '管理员' || userInfo.permission === 'superadmin')) {
				uni.showToast({ title: '只有管理员可以发布新闻', icon: 'none' });
				return;
			}
			
			// 跳转到新闻编辑页面
			uni.navigateTo({
				url: '/pages/news-edit/news-edit'
			});
		},
		viewNewsDetail(news) {
			uni.navigateTo({ url: `/pages/news-detail/news-detail?id=${news.id}` });
		},
		getLightColor,
		getFeatureKey(featureText) {
			const featureMap = {
				'注册账号': 'register',
				'账号管理': 'user_manage',
				'教师排课': 'schedule',
				'课时统计': 'salary',
				'教师课程表': 'admin_teacher_schedule',
				'我的课表': 'teacher_courses',
				'权限分配': 'permission_assign',
				'系统设置': 'system_setting',
				'学生课时': 'student_hours_query',
				'学生课时录入': 'student_hours',
				'我的班级': 'my_class',
				'师资力量': 'faculty_strength',
				'试卷分析': 'exam_analysis',
				'教室': 'classroom',
				'成绩': 'exam_scores',
				'进步分析': 'student_progress'
				// '订阅通知': 'subscription_notification'
			};
			return featureMap[featureText] || featureText;
		},
		onLoad() {
			// 从云端加载新闻
			this.loadNewsFromCloud();
		},
		
		onShow() {
			// 页面显示时重新加载
			this.loadNewsFromCloud();
			
			// 检查并提示开通订阅通知
			this.checkAndPromptSubscription();
		},
		
		// 检查并提示开通订阅通知
		async checkAndPromptSubscription() {
			try {
				// 检查是否已绑定微信
				const openid = uni.getStorageSync('openid');
				if (!openid) {
					// 设置横幅状态
					this.setSubscriptionBanner('微信绑定', '为了及时接收课程通知，建议先绑定微信账号', '立即绑定');
					
					// 延迟显示弹窗，避免与登录成功提示冲突
					setTimeout(() => {
						this.showSubscriptionPrompt('微信绑定', '为了及时接收课程通知，建议先绑定微信账号');
					}, 2000);
					return;
				}
				
				// 检查是否已开通订阅通知
				const subscriptionStatus = uni.getStorageSync('subscriptionStatus');
				if (!subscriptionStatus || subscriptionStatus.status !== 'accepted') {
					// 设置横幅状态
					this.setSubscriptionBanner('订阅通知', '开通订阅通知，及时接收课程安排、调课等重要信息', '立即开通');
					
					// 延迟显示弹窗，避免与登录成功提示冲突
					setTimeout(() => {
						this.showSubscriptionPrompt('订阅通知', '开通订阅通知，及时接收课程安排、调课等重要信息');
					}, 2000);
				} else {
					// 已开通，隐藏横幅
					this.showSubscriptionBanner = false;
				}
			} catch (error) {
				console.error('检查订阅状态失败:', error);
			}
		},
		
		// 设置订阅横幅状态
		setSubscriptionBanner(title, desc, btnText) {
			this.subscriptionBannerTitle = title;
			this.subscriptionBannerDesc = desc;
			this.subscriptionBannerBtnText = btnText;
			this.showSubscriptionBanner = true;
		},
		
		// 跳转到订阅设置页面
		goToSubscription() {
			uni.navigateTo({
				url: '/pages/subscription-settings/subscription-settings'
			});
		},
		
		// 显示订阅提示弹窗
		showSubscriptionPrompt(title, content) {
			uni.showModal({
				title: `💡 ${title}`,
				content: content,
				confirmText: '立即开通',
				cancelText: '稍后再说',
				success: (res) => {
					if (res.confirm) {
						// 跳转到订阅设置页面
						uni.navigateTo({
							url: '/pages/subscription-settings/subscription-settings'
						});
					}
				}
			});
		},
		
		onReady() {
			// 监听新闻更新事件
			uni.$on('newsUpdated', this.handleNewsUpdated);
			
			// 监听订阅状态变化事件
			uni.$on('subscriptionStatusChanged', this.handleSubscriptionStatusChanged);
			
			// 监听微信绑定成功事件
			uni.$on('wechatBoundSuccess', this.handleWechatBoundSuccess);
		},
		
		onUnload() {
			// 移除事件监听
			uni.$off('newsUpdated', this.handleNewsUpdated);
			
			// 移除订阅状态变化监听
			uni.$off('subscriptionStatusChanged', this.handleSubscriptionStatusChanged);
			
			// 移除微信绑定成功监听
			uni.$off('wechatBoundSuccess', this.handleWechatBoundSuccess);
		},
		async loadNewsFromCloud() {
			try {
				const res = await uniCloud.callFunction({ name: 'news-service', data: { action: 'listNews', page: 1, pageSize: 50 } });
				if (res && res.result && res.result.code === 0) {
					this.newsList = res.result.data.map(n => ({
						id: n._id || n.id,
						title: n.title,
						content: n.content,
						time: n.time,
						contentBlocks: n.contentBlocks || []
					}));
					return;
				}
			} catch (e) {
				console.error('云端加载新闻失败，回退本地:', e);
			}
			// 回退：本地存储
			const news = uni.getStorageSync('newsList');
			if (news && Array.isArray(news)) this.newsList = news;
		},
		handleNewsUpdated() {
			// 统一从云端刷新
			this.loadNewsFromCloud();
		},
		handleSubscriptionStatusChanged(status) {
			this.showSubscriptionBanner = status.status === 'accepted';
			this.subscriptionBannerTitle = status.title;
			this.subscriptionBannerDesc = status.desc;
			this.subscriptionBannerBtnText = status.btnText;
		},
		handleWechatBoundSuccess() {
			// 微信绑定成功后，重新检查并提示订阅通知
			this.checkAndPromptSubscription();
		},
		getNewsSnippet(news) {
			if (!news.content) return '';
			
			// 如果是contentBlocks格式，只提取文字内容
			if (news.contentBlocks && news.contentBlocks.length > 0) {
				const textBlocks = news.contentBlocks
					.filter(block => block.type === 'text')
					.map(block => block.content)
					.join(' ');
				
				if (textBlocks.trim()) {
					const maxLength = 80; // 最大显示字符数
					if (textBlocks.length <= maxLength) {
						return textBlocks;
					}
					return textBlocks.substring(0, maxLength) + '...';
				}
			}
			
			// 兼容旧格式
			const maxLength = 80;
			if (news.content.length <= maxLength) {
				return news.content;
			}
			return news.content.substring(0, maxLength) + '...';
		},
		formatTime(time) {
			if (!time) return '';
			const date = new Date(time);
			const year = date.getFullYear();
			const month = (date.getMonth() + 1).toString().padStart(2, '0');
			const day = date.getDate().toString().padStart(2, '0');
			return `${year}-${month}-${day}`;
		}
	}
}
</script>

<style>
	.container {
		padding: 90rpx 20rpx 20rpx 20rpx;
		background: #f8f8f8;
		min-height: 100vh;
	}
	.search-bar {
		display: flex;
		align-items: center;
		background: #e5ecef;
		border-radius: 32rpx;
		padding: 10rpx 20rpx;
		margin-bottom: 32rpx;
		margin-top: 0;
	}
	.search-logo {
		width: 48rpx;
		height: 48rpx;
		margin-right: 16rpx;
		border-radius: 50%;
		background: #fff;
	}
	.search-input-real {
		flex: 1;
		border: none;
		outline: none;
		background: transparent;
		font-size: 28rpx;
		color: #333;
		height: 48rpx;
	}
	.search-placeholder {
		color: #bfc9d1;
		font-size: 28rpx;
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
	.quick-grid {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}
	.service-card {
		width: 25%;
		box-sizing: border-box;
		padding: 40rpx 0 18rpx 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 0;
	}
	.service-icon-bg {
		width: 90rpx;
		height: 90rpx;
		border-radius: 24rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 16rpx;
	}
	.service-icon {
		width: 60rpx;
		height: 60rpx;
	}
	.service-text {
		font-size: 28rpx;
		color: #333;
		margin-top: 6rpx;
		text-align: center;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.news-section {
		background: #fff;
		border-radius: 20rpx;
		padding: 30rpx;
		margin: 20rpx;
		box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.08);
		position: relative;
	}

.news-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 20rpx;
	width: 100%;
	position: relative;
}

.news-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 0;
	display: block;
	text-align: center;
	flex: 1;
}

.news-edit-btn {
	background: #007aff;
	color: #fff;
	border: none;
	border-radius: 50%;
	width: 60rpx;
	height: 60rpx;
	font-size: 32rpx;
	font-weight: bold;
	position: absolute;
	right: 0;
	top: 0;
	display: flex;
	align-items: center;
	justify-content: center;
}
	.news-list {
		background: #f8f8f8;
		border-radius: 16rpx;
		padding: 20rpx;
	}
.news-item {
	background: #fff;
	border-radius: 16rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
	border: 2rpx solid #f0f0f0;
	display: flex;
	flex-direction: column;
}

.news-item.pinned-news {
	border: 2rpx solid #ffa726;
	background: linear-gradient(135deg, #fff8e1 0%, #ffffff 100%);
	box-shadow: 0 4rpx 15rpx rgba(255, 167, 38, 0.2);
}

.news-content {
	display: flex;
	flex-direction: row;
	align-items: stretch;
	justify-content: space-between;
	width: 100%;
	gap: 20rpx;
}

.news-left {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	min-height: 120rpx;
}

.news-right {
	flex-shrink: 0;
	display: flex;
	align-items: center;
	justify-content: center;
}

.news-title-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 15rpx;
}

.news-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	display: block;
	text-align: left;
	line-height: 1.4;
	flex: 1;
	margin-right: 10rpx;
}

.pin-badge {
	display: flex;
	align-items: center;
	background: linear-gradient(135deg, #ffa726 0%, #ff9800 100%);
	color: #fff;
	padding: 4rpx 12rpx;
	border-radius: 20rpx;
	font-size: 20rpx;
	box-shadow: 0 2rpx 8rpx rgba(255, 167, 38, 0.3);
	flex-shrink: 0;
}

.pin-icon {
	font-size: 18rpx;
	margin-right: 4rpx;
}

.pin-text {
	font-size: 20rpx;
	font-weight: bold;
}

.news-snippet {
	font-size: 28rpx;
	color: #666;
	line-height: 1.5;
	margin-bottom: 15rpx;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
	text-overflow: ellipsis;
	word-break: break-all;
	overflow-wrap: anywhere;
}

.news-images-preview {
	display: flex;
	gap: 12rpx;
	margin: 15rpx 0;
	flex-wrap: wrap;
	justify-content: center;
}

.image-preview-item {
	width: 80rpx;
	height: 80rpx;
	border-radius: 8rpx;
	overflow: hidden;
	box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
}

.news-image-preview {
	width: 100%;
	height: 100%;
	border-radius: 8rpx;
}

.news-image-container {
	display: flex;
	justify-content: center;
	align-items: center;
}

.news-image-placeholder {
	width: 80rpx;
	height: 80rpx;
	border-radius: 8rpx;
	background-color: #f5f5f5;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 2rpx dashed #ddd;
}

.placeholder-text {
	color: #999;
	font-size: 20rpx;
}

.news-footer {
	display: flex;
	justify-content: flex-end;
	margin-top: 16rpx;
}

.news-time {
	color: #999;
	font-size: 24rpx;
}
	.announcement-container {
		width: 710rpx;
		height: 80rpx;
		background: #fffbe6;
		border-radius: 12rpx;
		margin: 20rpx auto;
		overflow: hidden;
		box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
	}
	.announcement-content {
	display: flex;
	align-items: center;
	height: 100%;
	padding: 0 20rpx;
}
.horn-icon {
	width: 40rpx;
	height: 40rpx;
	margin-right: 16rpx;
	flex-shrink: 0;
}
.scroll-container {
	overflow: hidden;
	flex: 1;
	min-width: 0;
}
.announcement-text {
	display: inline-block;
	white-space: nowrap;
	animation: scroll 15s linear infinite;
	-webkit-animation: scroll 15s linear infinite;
	font-size: 28rpx;
	color: #e67700;
	line-height: 80rpx;
}
	@keyframes scroll {
	0% { transform: translateX(100%); }
	100% { transform: translateX(-100%); }
}
@-webkit-keyframes scroll {
	0% { transform: translateX(100%); }
	100% { transform: translateX(-100%); }
}

/* 订阅通知横幅样式 */
.subscription-banner {
	width: 710rpx;
	height: 120rpx;
	background: linear-gradient(135deg, #FF5722, #FF9800);
	border-radius: 16rpx;
	margin: 20rpx auto;
	box-shadow: 0 4rpx 20rpx rgba(255, 87, 34, 0.3);
	overflow: hidden;
	cursor: pointer;
	transition: all 0.3s ease;
}

.subscription-banner:active {
	transform: scale(0.98);
	box-shadow: 0 2rpx 10rpx rgba(255, 87, 34, 0.4);
}

.banner-content {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 100%;
	padding: 0 30rpx;
}

.banner-left {
	display: flex;
	align-items: center;
	flex: 1;
}

.banner-icon {
	font-size: 48rpx;
	margin-right: 20rpx;
	animation: bell-ring 2s ease-in-out infinite;
}

@keyframes bell-ring {
	0%, 100% { transform: rotate(0deg); }
	10%, 30% { transform: rotate(10deg); }
	20% { transform: rotate(-10deg); }
	40% { transform: rotate(0deg); }
}

.banner-text {
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.banner-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #fff;
	margin-bottom: 8rpx;
	display: block;
}

.banner-desc {
	font-size: 24rpx;
	color: rgba(255, 255, 255, 0.9);
	line-height: 1.4;
	display: block;
}

.banner-right {
	display: flex;
	align-items: center;
	gap: 10rpx;
}

.banner-btn {
	font-size: 28rpx;
	color: #fff;
	font-weight: 500;
	background: rgba(255, 255, 255, 0.2);
	padding: 12rpx 24rpx;
	border-radius: 20rpx;
	border: 2rpx solid rgba(255, 255, 255, 0.3);
}

.banner-arrow {
	font-size: 32rpx;
	color: #fff;
	font-weight: bold;
}
</style>