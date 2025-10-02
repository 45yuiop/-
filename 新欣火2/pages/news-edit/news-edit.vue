<template>
	<view class="news-edit-container">
		<!-- 顶部导航栏 -->
		<view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
			<view class="nav-content">
				<view class="back-btn" @click="goBack">
					<image class="back-icon" src="/static/back-cartoon.svg" mode="aspectFit" />
				</view>
				<text class="nav-title">{{ isEdit ? '编辑' : '发布' }}</text>
				<view class="nav-right"></view>
			</view>
		</view>

		<!-- 编辑表单 -->
		<view class="edit-form" :style="{ paddingTop: (statusBarHeight + 44) + 'px', paddingBottom: (safeAreaBottom + 120) + 'px' }">
			<view class="form-group">
				<text class="form-label">标题 *</text>
				<input 
					class="form-input" 
					v-model="newsForm.title" 
					placeholder="请输入标题"
					maxlength="100"
				/>
			</view>

			<view class="form-group">
				<text class="form-label">发布时间</text>
				<picker 
					mode="date" 
					:value="newsForm.time" 
					@change="onDateChange"
					class="date-picker"
				>
					<view class="picker-display">
						<text>{{ newsForm.time || '请选择日期' }}</text>
						<text class="picker-arrow">></text>
					</view>
				</picker>
			</view>

			<view class="form-group">
				<text class="form-label">作者</text>
				<input 
					class="form-input" 
					v-model="newsForm.author" 
					placeholder="请输入作者姓名"
					maxlength="50"
				/>
			</view>

			<view class="form-group">
				<view class="switch-container">
					<text class="form-label">置顶</text>
					<switch 
						:checked="newsForm.isPinned" 
						@change="onPinChange"
						color="#007aff"
					/>
				</view>
				<text class="switch-tip">开启后，此事件将显示在列表顶部</text>
			</view>

			<view class="form-group">
				<text class="form-label">内容 *</text>
				<view class="content-editor">
					<view class="editor-toolbar">
						<button class="tool-btn" @click="addTextBlock">
							<text class="tool-icon">📝</text>
							<text class="tool-text">添加文字</text>
						</button>
						<button class="tool-btn" @click="addImageBlock">
							<text class="tool-icon">🖼️</text>
							<text class="tool-text">添加图片</text>
						</button>
					</view>
					
					<view class="content-blocks">
						<view 
							v-for="(block, index) in newsForm.contentBlocks" 
							:key="index"
							class="content-block"
						>
							<!-- 文字块 -->
							<view v-if="block.type === 'text'" class="text-block">
								<textarea 
									class="text-input" 
									v-model="block.content" 
									placeholder="请输入文字内容"
									maxlength="1000"
									@input="updateCharCount"
								/>
								<view class="block-actions">
									<text class="char-count">{{ block.content.length }}/1000</text>
									<button class="action-btn delete" @click="removeBlock(index)">
										删除
									</button>
									<button class="action-btn move-up" @click="moveBlock(index, -1)" :disabled="index === 0">
										上移
									</button>
									<button class="action-btn move-down" @click="moveBlock(index, 1)" :disabled="index === newsForm.contentBlocks.length - 1">
										下移
									</button>
								</view>
							</view>
							
							<!-- 图片块 -->
							<view v-else-if="block.type === 'image'" class="image-block">
								<view class="image-preview">
									<image 
										:src="block.imageUrl" 
										class="preview-image" 
										mode="aspectFill"
										@click="previewImage(block.imageUrl)"
									/>
									<button class="remove-image-btn" @click="removeBlock(index)">×</button>
								</view>
								<view class="image-caption">
									<input 
										class="caption-input" 
										v-model="block.caption" 
										placeholder="图片说明（可选）"
										maxlength="100"
									/>
								</view>
								<view class="block-actions">
									<button class="action-btn move-up" @click="moveBlock(index, -1)" :disabled="index === 0">
										上移
									</button>
									<button class="action-btn move-down" @click="moveBlock(index, 1)" :disabled="index === newsForm.contentBlocks.length - 1">
										下移
									</button>
								</view>
							</view>
						</view>
						
						<view v-if="newsForm.contentBlocks.length === 0" class="empty-content">
							<text>点击上方按钮添加内容块</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 底部固定保存栏 -->
			<view class="bottom-bar" :style="{ paddingBottom: safeAreaBottom + 'px' }">
				<button class="bottom-save-btn" @click="saveNews" :disabled="!canSave || saving">
					{{ saving ? '保存中...' : '发布' }}
				</button>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			statusBarHeight: 0,
			safeAreaBottom: 0,
			newsId: '',
			isEdit: false,
			saving: false,
			newsForm: {
				title: '',
				content: '',
				time: '',
				author: '',
				isPinned: false, // 新增：置顶状态
				contentBlocks: [] // 新增：用于存储内容块
			}
		}
	},
	
	computed: {
		canSave() {
			return this.newsForm.title.trim() && 
				   this.newsForm.contentBlocks.length > 0 && 
				   this.newsForm.time && 
				   !this.saving;
		}
	},
	
	onLoad(options) {
		console.log('新闻编辑页面加载，参数:', options);
		console.log('当前用户信息:', uni.getStorageSync('userInfo'));
		
		// 适配状态栏高度 & 安全区
		const sys = uni.getSystemInfoSync();
		this.statusBarHeight = sys.statusBarHeight || 20;
		let bottomInset = 0;
		if (sys.safeAreaInsets && typeof sys.safeAreaInsets.bottom === 'number') {
			bottomInset = sys.safeAreaInsets.bottom;
		} else if (sys.safeArea && typeof sys.safeArea.bottom === 'number') {
			bottomInset = sys.screenHeight - sys.safeArea.bottom;
		}
		this.safeAreaBottom = bottomInset || 0;
		
		// 检查用户权限
		const userInfo = uni.getStorageSync('userInfo');
		if (!userInfo || !(userInfo.permission === '管理员' || userInfo.permission === 'superadmin')) {
			console.log('权限检查失败:', { userInfo, permission: userInfo?.permission });
			uni.showModal({
				title: '权限不足',
				content: '只有管理员可以编辑新闻，请使用管理员账号登录',
				showCancel: false,
				success: () => {
					uni.navigateBack();
				}
			});
			return;
		}
		
		console.log('权限检查通过，继续加载页面');
		
		// 设置默认时间
		this.newsForm.time = new Date().toISOString().split('T')[0];
		
		if (options.id) {
			this.newsId = options.id;
			this.isEdit = true;
			this.loadNewsData();
		}
	},
	
	methods: {
		goBack() {
			uni.navigateBack();
		},
		
		async loadNewsData() {
			try {
				// 优先从云端获取
				if (this.newsId) {
					const res = await uniCloud.callFunction({
						name: 'news-service',
						data: { action: 'getNewsById', id: this.newsId }
					});
					if (res && res.result && res.result.code === 0 && res.result.data) {
						const news = res.result.data;
						this.newsForm = {
							title: news.title || '',
							content: news.content || '',
							time: news.time || new Date().toISOString().split('T')[0],
							author: news.author || '',
							isPinned: news.isPinned || false,
							contentBlocks: Array.isArray(news.contentBlocks) ? news.contentBlocks : [{ type: 'text', content: news.content || '' }]
						};
						return;
					}
				}
				// 回退到本地存储
				await this.loadNewsFromStorage();
			} catch (error) {
				console.error('加载新闻数据失败:', error);
				uni.showToast({ title: '加载失败', icon: 'none' });
			}
		},
		
		async loadNewsFromStorage() {
			// 从本地存储获取新闻列表
			const newsList = uni.getStorageSync('newsList') || [];
			const news = newsList.find(item => item.id === this.newsId);
			
			if (news) {
				// 如果找到新闻，使用存储的数据
				this.newsForm = {
					title: news.title || '',
					content: news.content || '',
					time: news.time || new Date().toISOString().split('T')[0],
					author: news.author || '',
					isPinned: news.isPinned || false,
					contentBlocks: news.contentBlocks || [
						{ type: 'text', content: news.content || '' }
					]
				};
			} else {
				// 如果没找到，使用模拟数据
				await this.loadMockNewsData();
			}
		},
		
		async loadMockNewsData() {
			// 模拟加载新闻数据
			await new Promise(resolve => setTimeout(resolve, 500));
			
			// 模拟新闻数据
			//this.newsForm = {
				//title: '公司荣获XX奖项11',
				//content: '近日，公司在教育领域取得了重大突破，荣获XX奖项。这是对我们专注教育、点亮成长理念的肯定。',
				//time: '2024-06-01',
				//author: '新欣火教育中心',
				//contentBlocks: [
				//	{ type: 'text', content: '近日，公司在教育领域取得了重大突破，荣获XX奖项。这是对我们专注教育、点亮成长理念的肯定。' }
				//]
			//};
		},
		
		onDateChange(e) {
			this.newsForm.time = e.detail.value;
		},

		onPinChange(e) {
			this.newsForm.isPinned = e.detail.value;
		},

		addTextBlock() {
			this.newsForm.contentBlocks.push({ type: 'text', content: '' });
		},

		addImageBlock() {
			// 检查用户权限
			const userInfo = uni.getStorageSync('userInfo');
			if (!userInfo || !(userInfo.permission === '管理员' || userInfo.permission === 'superadmin')) {
				uni.showToast({ title: '权限不足', icon: 'none' });
				return;
			}
			
			uni.chooseImage({
				count: 1,
				sizeType: ['compressed'],
				sourceType: ['album', 'camera'],
				success: (res) => {
					console.log('选择图片成功:', res);
					
					const filePath = res.tempFilePaths[0];
					
					// 显示上传中提示
					uni.showLoading({ title: '上传图片中...' });
					
					// 上传图片到云存储
					this.uploadImageToCloud(filePath);
				},
				fail: (err) => {
					console.error('选择图片失败:', err);
					if (err.errMsg && err.errMsg.includes('cancel')) {
						return;
					}
					uni.showToast({ title: '选择图片失败', icon: 'none' });
				}
			});
		},
		
		async uploadImageToCloud(filePath) {
			try {
				const cloudPath = `news-images/${Date.now()}_${Math.random().toString(36).substring(2,10)}.jpg`;
				const uploadRes = await uniCloud.uploadFile({ filePath, cloudPath });
				const cloudUrl = uploadRes.fileID;
				
				// 添加图片块到内容
				this.newsForm.contentBlocks.push({ 
					type: 'image', 
					imageUrl: cloudUrl, 
					caption: '' 
				});
				
				uni.hideLoading();
				uni.showToast({ title: '图片上传成功', icon: 'success' });
				console.log('当前contentBlocks:', this.newsForm.contentBlocks);
				
			} catch (error) {
				console.error('图片上传失败:', error);
				uni.hideLoading();
				uni.showToast({ title: '图片上传失败', icon: 'none' });
			}
		},
		
		// 移除模拟上传函数

		removeBlock(index) {
			this.newsForm.contentBlocks.splice(index, 1);
		},

		moveBlock(fromIndex, toIndex) {
			const block = this.newsForm.contentBlocks.splice(fromIndex, 1)[0];
			this.newsForm.contentBlocks.splice(toIndex, 0, block);
		},

		updateCharCount() {
			// 更新每个文字块的字符计数
			this.newsForm.contentBlocks.forEach(block => {
				if (block.type === 'text') {
					block.charCount = block.content.length;
				}
			});
		},

		previewImage(url) {
			// 如果是临时图片路径，需要特殊处理
			if (url && url.startsWith('http://tmp/')) {
				// 临时图片，直接预览
				uni.previewImage({
					urls: [url],
					current: url
				});
			} else if (url) {
				// 普通图片
				uni.previewImage({
					urls: [url],
					current: url
				});
			}
		},
		
		async saveNews() {
			if (!this.canSave) return;
			
			console.log('开始保存新闻，当前数据:', this.newsForm);
			
			// 验证内容块
			for (let block of this.newsForm.contentBlocks) {
				if (block.type === 'text' && !block.content.trim()) {
					uni.showToast({ title: '请填写完整的文字内容', icon: 'none' });
					return;
				}
				if (block.type === 'image' && !block.imageUrl) {
					uni.showToast({ title: '请选择图片', icon: 'none' });
					return;
				}
			}
			
			try {
				this.saving = true;
				
				// 生成最终内容（用于兼容旧版本）
				const finalContent = this.newsForm.contentBlocks
					.map(block => {
						if (block.type === 'text') {
							return block.content;
						}
						// 图片块不生成占位符，直接跳过
						return '';
					})
					.filter(content => content.trim()) // 过滤掉空内容
					.join('\n\n');
				
				console.log('生成的最终内容:', finalContent);
				console.log('保存的完整数据:', {
					...this.newsForm,
					content: finalContent,
					contentBlocks: this.newsForm.contentBlocks
				});
				
				// 保存到云端
				const payload = { ...this.newsForm, content: finalContent, contentBlocks: this.newsForm.contentBlocks };
				if (this.isEdit) {
					await uniCloud.callFunction({ name: 'news-service', data: { action: 'updateNews', id: this.newsId, data: payload } });
				} else {
					const saveRes = await uniCloud.callFunction({ name: 'news-service', data: { action: 'createNews', data: payload } });
					if (saveRes && saveRes.result && saveRes.result.code === 0 && saveRes.result.data && saveRes.result.data._id) {
						this.newsId = saveRes.result.data._id;
					}
				}
				
				uni.showToast({ 
					title: this.isEdit ? '修改成功' : '发布成功', 
					icon: 'success' 
				});
				
				// 通知首页刷新
				uni.$emit('newsUpdated');
				setTimeout(() => { uni.navigateBack(); }, 1200);
				
			} catch (error) {
				console.error('保存新闻失败:', error);
				uni.showToast({ title: '保存失败', icon: 'none' });
			} finally {
				this.saving = false;
			}
		}
	}
}
</script>

<style scoped>
.news-edit-container {
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
	width: 40rpx; /* Adjust as needed */
	height: 40rpx; /* Adjust as needed */
}

.nav-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.save-btn {
	background: #007aff;
	color: #fff;
	border: none;
	border-radius: 20rpx;
	padding: 8rpx 24rpx;
	font-size: 28rpx;
}

.save-btn:disabled {
	background: #ccc;
}

.edit-form {
	padding: 20rpx;
}

/* 底部固定保存栏 */
.bottom-bar {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	background: #fff;
	padding: 16rpx 20rpx;
	box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.08);
	z-index: 1000;
}

.bottom-save-btn {
	width: 100%;
	background: #007aff;
	color: #fff;
	border: none;
	border-radius: 24rpx;
	padding: 22rpx 0;
	font-size: 32rpx;
}

.bottom-save-btn:disabled {
	background: #ccc;
}

.form-group {
	background: #fff;
	border-radius: 16rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
}

.form-label {
	font-size: 30rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 20rpx;
	display: block;
}

.form-input {
	width: 100%;
	height: 80rpx;
	border: 2rpx solid #e5e5e5;
	border-radius: 12rpx;
	padding: 0 20rpx;
	font-size: 28rpx;
	box-sizing: border-box;
}

.form-textarea {
	width: 100%;
	min-height: 200rpx;
	border: 2rpx solid #e5e5e5;
	border-radius: 12rpx;
	padding: 20rpx;
	font-size: 28rpx;
	box-sizing: border-box;
	resize: none;
}

.char-count {
	font-size: 24rpx;
	color: #999;
	text-align: right;
	margin-top: 10rpx;
	display: block;
}

.date-picker {
	width: 100%;
}

.picker-display {
	height: 80rpx;
	border: 2rpx solid #e5e5e5;
	border-radius: 12rpx;
	padding: 0 20rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	background: #fff;
}

.picker-arrow {
	color: #999;
	font-size: 24rpx;
}

.content-editor {
	background: #fff;
	border-radius: 16rpx;
	padding: 20rpx;
	box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
}

.editor-toolbar {
	display: flex;
	justify-content: space-around;
	margin-bottom: 20rpx;
	padding: 20rpx 0;
	border-bottom: 2rpx solid #f0f0f0;
}

.tool-btn {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 15rpx 20rpx;
	background: #f8f9fa;
	border: 2rpx solid #e9ecef;
	border-radius: 12rpx;
	min-width: 120rpx;
}

.tool-btn:active {
	background: #e9ecef;
}

.tool-icon {
	font-size: 36rpx;
	margin-bottom: 8rpx;
}

.tool-text {
	font-size: 22rpx;
	color: #495057;
}

.content-blocks {
	margin-top: 20rpx;
}

.content-block {
	background: #ffffff;
	border: 2rpx solid #e9ecef;
	border-radius: 16rpx;
	padding: 25rpx;
	margin-bottom: 20rpx;
	position: relative;
	box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);
}

.text-block {
	padding: 0;
}

.text-input {
	width: 100%;
	min-height: 120rpx;
	border: 2rpx solid #e9ecef;
	border-radius: 12rpx;
	padding: 20rpx;
	font-size: 28rpx;
	line-height: 1.6;
	box-sizing: border-box;
	background: #f8f9fa;
}

.text-input:focus {
	border-color: #007aff;
	background: #ffffff;
}

.image-block {
	padding: 0;
}

.image-preview {
	position: relative;
	margin-bottom: 15rpx;
	border-radius: 12rpx;
	overflow: hidden;
}

.preview-image {
	width: 100%;
	height: 300rpx;
	border-radius: 12rpx;
	object-fit: cover;
}

.remove-image-btn {
	position: absolute;
	top: 10rpx;
	right: 10rpx;
	background: rgba(255, 59, 48, 0.9);
	color: #fff;
	border: none;
	border-radius: 50%;
	width: 50rpx;
	height: 50rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 32rpx;
	font-weight: bold;
	z-index: 10;
}

.image-caption {
	margin-top: 15rpx;
}

.caption-input {
	width: 100%;
	height: 70rpx;
	border: 2rpx solid #e9ecef;
	border-radius: 10rpx;
	padding: 0 20rpx;
	font-size: 26rpx;
	box-sizing: border-box;
	background: #f8f9fa;
}

.block-actions {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 20rpx;
	padding-top: 20rpx;
	border-top: 2rpx solid #f0f0f0;
}

.char-count {
	font-size: 24rpx;
	color: #6c757d;
}

.action-btn {
	background: #6c757d;
	color: #fff;
	border: none;
	border-radius: 8rpx;
	padding: 8rpx 16rpx;
	font-size: 22rpx;
	margin-left: 10rpx;
}

.action-btn.delete {
	background: #dc3545;
}

.action-btn.move-up,
.action-btn.move-down {
	background: #007aff;
}

.action-btn:disabled {
	background: #adb5bd;
}

.empty-content {
	text-align: center;
	padding: 80rpx 0;
	color: #adb5bd;
	font-size: 28rpx;
	background: #f8f9fa;
	border-radius: 12rpx;
	border: 2rpx dashed #dee2e6;
}

.switch-container {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 10rpx;
}

.switch-tip {
	font-size: 24rpx;
	color: #999;
	line-height: 1.4;
}
</style>
