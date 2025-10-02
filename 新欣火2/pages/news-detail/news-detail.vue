<template>
	<view class="news-detail-container">
		<!-- 顶部导航栏 -->
		<view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
			<view class="nav-content">
				<view class="back-btn" @click="goBack">
					<image class="back-icon" src="/static/back-cartoon.svg" mode="aspectFit" />
				</view>
				<text class="nav-title">新闻详情</text>
				<view class="nav-right"></view>
			</view>
		</view>

		<!-- 新闻内容 -->
		<view class="news-content" :style="{ paddingTop: (statusBarHeight + 44) + 'px' }">
			<view v-if="newsData" class="news-card">
				<view class="news-header">
					<text class="news-title">{{ newsData.title }}</text>
					<view class="news-meta">
						<view class="meta-row">
							<text class="news-time">{{ formatTime(newsData.time) }}</text>
						</view>
						<view class="meta-row" v-if="newsData.author">
							<text class="news-author">作者：{{ newsData.author }}</text>
						</view>
					</view>
				</view>
				
				<view class="news-body">
					<!-- 支持新的contentBlocks格式 -->
					<view v-if="newsData.contentBlocks && newsData.contentBlocks.length > 0" class="content-blocks">
						<view 
							v-for="(block, index) in newsData.contentBlocks" 
							:key="index"
							class="content-block"
						>
							<!-- 文字块 -->
							<text v-if="block.type === 'text'" class="news-text" :user-select="true">{{ block.content }}</text>
							
							<!-- 图片块 -->
							<view v-else-if="block.type === 'image'" class="image-block">
								<image 
									:src="block.imageUrl" 
									class="news-image" 
									mode="widthFix"
									@click="previewImage([block.imageUrl], 0)"
								/>
								<text v-if="block.caption" class="image-caption">{{ block.caption }}</text>
							</view>
						</view>
					</view>
					
					<!-- 兼容旧格式 -->
					<text v-else class="news-text" :user-select="true">{{ newsData.content }}</text>
					
					<!-- 兼容旧格式的图片 -->
					<view v-if="newsData.images && newsData.images.length > 0" class="news-images">
						<image 
							v-for="(img, index) in newsData.images" 
							:key="index"
							:src="img"
							class="news-image"
							mode="widthFix"
							@click="previewImage(newsData.images, index)"
						/>
					</view>
				</view>
			</view>

			<!-- 加载中 -->
			<view v-else-if="loading" class="loading">
				<text>加载中...</text>
			</view>

			<!-- 无数据 -->
			<view v-else class="empty">
				<text>新闻不存在</text>
			</view>
		</view>

		<!-- 管理员修改按钮 -->
		<view v-if="isAdmin && newsData" class="edit-btn-container">
			<button class="delete-btn" @click="deleteNews">
				<text class="delete-icon">🗑️</text>
				<text class="delete-text">删除</text>
			</button>
			<button class="pin-btn" @click="togglePin" :class="{ 'pinned': newsData.isPinned }">
				<text class="pin-icon">{{ newsData.isPinned ? '📌' : '📍' }}</text>
				<text class="pin-text">{{ newsData.isPinned ? '取消置顶' : '置顶' }}</text>
			</button>
			<button class="edit-btn" @click="editNews">
				<text class="edit-icon">✏️</text>
				<text class="edit-text">修改</text>
			</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			statusBarHeight: 0,
			newsId: '',
			newsData: null,
			loading: true
		}
	},
	
	computed: {
		isAdmin() {
			const userInfo = uni.getStorageSync('userInfo');
			return userInfo && (userInfo.permission === '管理员' || userInfo.permission === 'superadmin');
		}
	},
	
	onLoad(options) {
		if (options.id) {
			this.newsId = options.id;
			this.loadNewsDetail();
		} else {
			uni.showToast({ title: '缺少新闻ID', icon: 'none' });
			setTimeout(() => uni.navigateBack(), 1500);
		}
		
		// 适配状态栏高度
		const sys = uni.getSystemInfoSync();
		this.statusBarHeight = sys.statusBarHeight || 20;
		
		// 检查用户登录状态
		const userInfo = uni.getStorageSync('userInfo');
		if (!userInfo) {
			console.log('用户未登录，跳转到登录页面');
			// 可以选择跳转到登录页面或继续浏览
			// uni.reLaunch({ url: '/pages/login/login' });
		}
	},
	
	methods: {
		goBack() {
			uni.navigateBack();
		},
		
		async loadNewsDetail() {
			try {
				// 优先从云端获取
				const res = await uniCloud.callFunction({ name: 'news-service', data: { action: 'getNewsById', id: this.newsId } });
				if (res && res.result && res.result.code === 0 && res.result.data) {
					const news = res.result.data;
					this.newsData = {
						id: news._id || news.id,
						title: news.title,
						content: news.content,
						time: news.time,
						author: news.author,
						isPinned: news.isPinned || false,
						contentBlocks: Array.isArray(news.contentBlocks) ? news.contentBlocks : [{ type: 'text', content: news.content || '' }]
					};
				} else {
					await this.loadNewsFromStorage();
				}
			} catch (error) {
				console.error('加载新闻详情失败:', error);
				uni.showToast({ title: '加载失败', icon: 'none' });
			} finally {
				this.loading = false;
			}
		},
		
		async loadNewsFromStorage() {
			// 从本地存储获取新闻列表
			const newsList = uni.getStorageSync('newsList') || [];
			const news = newsList.find(item => item.id === this.newsId);
			
			if (news) {
				// 如果找到新闻，使用存储的数据
				this.newsData = {
					...news,
					isPinned: news.isPinned || false,
					// 如果没有contentBlocks，从content生成
					contentBlocks: news.contentBlocks || [
						{ type: 'text', content: news.content }
					]
				};
			} else {
				// 如果没找到，使用模拟数据
				await this.loadMockNewsDetail();
			}
		},
		
		async loadMockNewsDetail() {
			// 模拟加载新闻详情
			await new Promise(resolve => setTimeout(resolve, 500));
			
			// 模拟新闻数据
			this.newsData = {
				id: this.newsId,
				title: '公司荣获XX奖项11',
				content: '近日，公司在教育领域取得了重大突破，荣获XX奖项。这是对我们专注教育、点亮成长理念的肯定。我们将继续努力，为教育事业贡献更多力量。\n\n获奖项目包括：\n• 创新教学方法\n• 学生成长跟踪系统\n• 家长沟通平台\n\n感谢所有同事的辛勤付出，让我们一起为更美好的教育未来而努力！',
				time: '2024-06-01',
				author: '新欣火教育中心',
				images: [],
				contentBlocks: [
					{ type: 'text', content: '近日，公司在教育领域取得了重大突破，荣获XX奖项。这是对我们专注教育、点亮成长理念的肯定。我们将继续努力，为教育事业贡献更多力量。\n\n获奖项目包括：\n• 创新教学方法\n• 学生成长跟踪系统\n• 家长沟通平台\n\n感谢所有同事的辛勤付出，让我们一起为更美好的教育未来而努力！' },
					{ type: 'image', imageUrl: '/static/news/news1.jpg', caption: '图片1' },
					{ type: 'text', content: '这是我们的团队，他们为教育事业贡献了巨大的努力。' },
					{ type: 'image', imageUrl: '/static/news/news2.jpg', caption: '图片2' },
					{ type: 'text', content: '我们的愿景是成为教育领域的领导者，为每个孩子提供最好的教育。' }
				]
			};
		},
		
		formatTime(timeStr) {
			if (!timeStr) return '';
			const date = new Date(timeStr);
			const year = date.getFullYear();
			const month = (date.getMonth() + 1).toString().padStart(2, '0');
			const day = date.getDate().toString().padStart(2, '0');
			return `${year}-${month}-${day}`;
		},
		
		previewImage(images, currentIndex) {
			if (!images || images.length === 0) return;
			
			// 过滤掉无效的图片URL
			const validImages = images.filter(img => img && img.trim());
			if (validImages.length === 0) return;
			
			uni.previewImage({
				urls: validImages,
				current: validImages[currentIndex] || validImages[0]
			});
		},
		
		editNews() {
			uni.navigateTo({
				url: `/pages/news-edit/news-edit?id=${this.newsId}`
			});
		},
		
		deleteNews() {
			uni.showModal({
				title: '确认删除',
				content: '确定要删除这条新闻吗？删除后无法恢复。',
				confirmText: '删除',
				confirmColor: '#ff4444',
				success: (res) => {
					if (res.confirm) {
						this.performDelete();
					}
				}
			});
		},
		
		async performDelete() {
			try {
				await uniCloud.callFunction({ name: 'news-service', data: { action: 'deleteNews', id: this.newsId } });
				// 通知首页刷新
				uni.$emit('newsUpdated');
				
				uni.showToast({ title: '删除成功', icon: 'success' });
				
				// 返回上一页
				setTimeout(() => {
					uni.navigateBack();
				}, 1500);
				
			} catch (error) {
				console.error('删除新闻失败:', error);
				uni.showToast({ title: '删除失败', icon: 'none' });
			}
		},

		async togglePin() {
			try {
				const res = await uniCloud.callFunction({ 
					name: 'news-service', 
					data: { action: 'togglePin', id: this.newsId } 
				});
				
				if (res && res.result && res.result.code === 0) {
					// 更新本地数据
					this.newsData.isPinned = res.result.data.isPinned;
					
					// 通知首页刷新
					uni.$emit('newsUpdated');
					
					uni.showToast({ 
						title: res.result.message, 
						icon: 'success' 
					});
				} else {
					uni.showToast({ title: '操作失败', icon: 'none' });
				}
			} catch (error) {
				console.error('置顶操作失败:', error);
				uni.showToast({ title: '操作失败', icon: 'none' });
			}
		}
	}
}
</script>

<style scoped>
.news-detail-container {
	min-height: 100vh;
	background: #f8f8f8;
}

.nav-bar {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	background: #fff;
	z-index: 1000;
	box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
}

.nav-content {
	height: 44px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 20rpx;
}

.back-btn {
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.back-icon {
	width: 36rpx; /* Adjust as needed */
	height: 36rpx; /* Adjust as needed */
}

.nav-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.nav-right {
	width: 60rpx;
}

.news-content {
	padding: 20rpx;
}

.news-card {
	background: #fff;
	border-radius: 20rpx;
	padding: 40rpx;
	box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.08);
}

.news-header {
	margin-bottom: 40rpx;
}

.news-title {
	font-size: 40rpx;
	font-weight: bold;
	color: #333;
	line-height: 1.4;
	margin-bottom: 20rpx;
	display: block;
	text-align: center; /* Added for centering */
}

.news-meta {
	display: flex;
	flex-direction: column;
	gap: 10rpx;
	margin-bottom: 30rpx;
}

.meta-row {
	display: flex;
	align-items: center;
}

.news-time {
	font-size: 26rpx;
	color: #999;
	text-align: left;
	width: 100%;
}

.news-author {
	font-size: 26rpx;
	color: #666;
	text-align: left;
	width: 100%;
}

.news-body {
	line-height: 1.8;
	margin-top: 40rpx;
}


.news-text {
    font-size: 30rpx;
    color: #333;
    line-height: 1.8;
    white-space: pre-wrap; /* 保留换行符 */
    margin-bottom: 40rpx;
    text-align: left; /* 确保文本左对齐 */
    text-indent: 2em; /* 首行缩进两个字符 */
    word-break: break-word; /* 处理长单词换行 */
    overflow-wrap: break-word; /* 更兼容的换行处理 */
}

/* 可以添加一个辅助类来测试不同内容的显示效果 */
.test-content {
    /* 继承.news-text的所有样式 */
    composes: news-text;
    /* 可以添加测试用的额外样式 */
}


.content-blocks {
	margin-bottom: 20rpx;
}

.content-block {
	margin-bottom: 20rpx;
}

.image-block {
	margin: 20rpx 0;
	text-align: center;
}

.image-caption {
	font-size: 24rpx;
	color: #666;
	text-align: center;
	margin-top: 10rpx;
	display: block;
}

.news-images {
	margin-top: 30rpx;
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.news-image {
	width: 100%;
	border-radius: 12rpx;
}

.loading, .empty {
	text-align: center;
	padding: 100rpx 0;
	color: #999;
	font-size: 28rpx;
}

.edit-btn-container {
	position: fixed;
	bottom: 40rpx;
	right: 40rpx;
	z-index: 100;
	display: flex;
	gap: 20rpx;
}

.edit-btn, .delete-btn, .pin-btn {
	width: 120rpx;
	height: 120rpx;
	border-radius: 50%;
	border: none;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	box-shadow: 0 8rpx 30rpx rgba(0,0,0,0.3);
}

.edit-btn {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	box-shadow: 0 8rpx 30rpx rgba(102, 126, 234, 0.4);
}

.delete-btn {
	background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
	box-shadow: 0 8rpx 30rpx rgba(255, 107, 107, 0.4);
}

.pin-btn {
	background: linear-gradient(135deg, #ffa726 0%, #ff9800 100%);
	box-shadow: 0 8rpx 30rpx rgba(255, 167, 38, 0.4);
}

.pin-btn.pinned {
	background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
	box-shadow: 0 8rpx 30rpx rgba(76, 175, 80, 0.4);
}

.edit-icon, .delete-icon, .pin-icon {
	font-size: 28rpx;
	margin-bottom: 4rpx;
}

.edit-text, .delete-text, .pin-text {
	font-size: 22rpx;
	color: #fff;
}
</style>
