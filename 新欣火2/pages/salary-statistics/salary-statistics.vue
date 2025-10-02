<template>
	<view>
		<!-- <view style="font-size:32rpx;color:#1976D2;font-weight:bold;margin:40rpx 0 30rpx 0;text-align:center;">这里是课时统计页面</view> -->
		<!-- 返回按钮 -->
		<view class="back-btn-container">
			<button class="back-btn" @click="goBack">
				<text class="back-btn-icon">‹</text>
			</button>
		</view>

		<view class="main-content">
			<view class="page-title">课时统计管理</view>

			<!-- 条件选择区域 -->
			<view class="form-section">
				<!-- 教师选择 -->
				<view class="form-item">
					<input class="search-input" v-model.trim="searchKeyword" placeholder="🔍 搜索教师姓名" />
					<picker @change="onTeacherChange" :value="teacherIndex" :range="filteredTeacherList" range-key="teacherName">
						<view class="picker-display">
							<text>{{ selectedTeacher ? selectedTeacher.teacherName : '请选择教师' }}</text>
							<text class="picker-arrow">▼</text>
						</view>
					</picker>
					<!-- 仅管理员可切换教师，普通教师只能看自己 -->
				</view>
				<!-- 月份选择 -->
				<view class="form-item">
					<picker mode="date" fields="month" :value="selectedMonth" @change="onMonthChange">
						<view class="picker-display">
							<text>统计月份：{{ selectedMonth }}</text>
							<text class="picker-arrow">▼</text>
						</view>
					</picker>
				</view>
			</view>

			<!-- 查询按钮 -->
			<view class="action-buttons">
				<button class="query-btn" @click="fetchAndCalculateStatistics" :loading="isLoading">查询统计</button>
				<button v-if="isAdmin || isSuperAdmin" class="query-btn all-btn" @click="fetchAllTeachersStatistics" :loading="isLoadingAll">
					<text class="btn-icon">👥</text> 查询全员课时
				</button>
			</view>

			<!-- 结果展示区域 -->
			<view v-if="statistics" class="results-section">
				<view class="results-title">统计结果</view>
				<view class="results-grid">
					<view class="result-item">
						<view class="result-value one-to-one-value">{{ statistics['一对一'] || 0 }}</view>
						<view class="result-label one-to-one-label">一对一 (小时)</view>
					</view>
					<view class="result-item">
						<view class="result-value group-class-value">{{ statistics['班课'] || 0 }}</view>
						<view class="result-label group-class-label">班课 (小时)</view>
					</view>
					<view class="result-item">
						<view class="result-value full-time-value">{{ statistics['脱产生'] || 0 }}</view>
						<view class="result-label full-time-label">脱产生 (小时)</view>
					</view>
				</view>
			</view>
			
			<view v-if="noData && !isLoading" class="empty-state">
				<text>当月无排课记录</text>
			</view>

			<view v-if="(isAdmin || isSuperAdmin) && allStatistics && allStatistics.length" class="results-section card-bg">
				<view class="results-title">全员课时统计</view>
				<view class="all-table">
					<view class="all-table-header">
						<text class="all-th">教师姓名</text>
						<text class="all-th">一对一(小时)</text>
						<text class="all-th">班课(小时)</text>
						<text class="all-th">脱产生(小时)</text>
					</view>
					<view v-for="(row, index) in allStatistics" :key="index" class="all-table-row">
						<text class="all-td teacher-name">{{ row.teacherName }}</text>
						<text class="all-td one-to-one-hours">{{ row['一对一'] }}</text>
						<text class="all-td group-class-hours">{{ row['班课'] }}</text>
						<text class="all-td full-time-hours">{{ row['脱产生'] }}</text>
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
				allTeacherList: [],
				teacherIndex: 0,
				searchKeyword: '',
				selectedMonth: new Date().toISOString().slice(0, 7), // 格式 YYYY-MM
				isLoading: false,
				statistics: null, // 用于存储统计结果
				noData: false, // 是否无数据
				isLoadingAll: false,
				allStatistics: null,
				isSuperAdmin: false,
				isAdmin: false,
			};
		},
		computed: {
			filteredTeacherList() {
				if (!this.searchKeyword) {
					return this.allTeacherList;
				}
				return this.allTeacherList.filter(teacher =>
					teacher.teacherName && teacher.teacherName.toLowerCase().includes(this.searchKeyword.toLowerCase())
				);
			},
			selectedTeacher() {
				if (this.filteredTeacherList.length > 0) {
					return this.filteredTeacherList[this.teacherIndex];
				}
				return null;
			}
		},
		watch: {
			searchKeyword() {
				this.teacherIndex = 0;
			}
		},
		onLoad() {
			this.fetchTeachers();
		},
		onShow() {
			this.checkAdminRole();
		},
		methods: {
			checkAdminRole() {
				const userInfo = uni.getStorageSync('userInfo');
				this.isSuperAdmin = userInfo && userInfo.permission === 'superadmin';
				const hasAdminPermission = userInfo && userInfo.permission === '管理员';
				const hasAdminRole = userInfo && userInfo.role && (userInfo.role.includes('管理员') || userInfo.role === '管理员');
				this.isAdmin = hasAdminPermission || hasAdminRole || this.isSuperAdmin;
				// 如果不是管理员，自动选中自己
				if (!this.isAdmin && !this.isSuperAdmin) {
					const self = this.allTeacherList.find(t => t._id === userInfo._id);
					if (self) {
						this.selectedTeacher = self;
						this.teacherIndex = this.filteredTeacherList.findIndex(t => t._id === self._id);
					}
				}
			},
			fetchTeachers() {
				uniCloud.callFunction({
					name: 'user-center',
					data: { action: 'get-accounts' },
					success: (res) => {
						const result = res.result;
						if (result.code === 200) {
							this.allTeacherList = result.data.filter(acc => {
								if (!acc.role) return false;
								if (Array.isArray(acc.role)) {
									return acc.role.includes('教师');
								} else {
									return acc.role === '教师';
								}
							});
							// 如果不是管理员，自动选中自己
							this.checkAdminRole();
						} else {
							uni.showToast({ title: '获取教师列表失败', icon: 'none' });
						}
					},
					fail: () => {
						uni.showToast({ title: '获取教师列表请求失败', icon: 'none' });
					}
				});
			},
			onTeacherChange(e) {
				if (!this.isAdmin && !this.isSuperAdmin) return;
				this.teacherIndex = e.detail.value;
				this.selectedTeacher = this.filteredTeacherList[this.teacherIndex];
			},
			onMonthChange(e) {
				this.selectedMonth = e.detail.value;
			},
			fetchAndCalculateStatistics() {
				if (!this.selectedTeacher || !this.selectedTeacher._id) {
					uni.showToast({ title: '请先选择一位教师', icon: 'none' });
					return;
				}
				this.isLoading = true;
				this.statistics = null;
				this.noData = false;

				const [year, month] = this.selectedMonth.split('-').map(Number);
				const startDate = `${this.selectedMonth}-01`;
				const endDate = new Date(year, month, 0).toISOString().slice(0, 10);

				uniCloud.callFunction({
					name: 'teacher-hours-statistics',
					data: {
						action: 'get-teacher-hours',
						params: {
							teacher_id: this.selectedTeacher._id,
							startDate: startDate,
							endDate: endDate
						}
					},
					success: (res) => {
						const result = res.result;
						if (result.code === 200 && result.data) {
							this.statistics = result.data.statistics;
							// 检查是否有课时数据
							const hasHours = Object.values(result.data.statistics).some(val => val > 0);
							if (!hasHours) {
								this.noData = true;
							}
						} else {
							this.noData = true;
							this.statistics = { '一对一': 0, '班课': 0, '脱产生': 0 };
							uni.showToast({ title: result.message || '查询失败', icon: 'none' });
						}
					},
					fail: (err) => {
						console.error('查询课时失败:', err);
						uni.showToast({ title: '查询课时失败', icon: 'none' });
						this.noData = true;
						this.statistics = { '一对一': 0, '班课': 0, '脱产生': 0 };
					},
					complete: () => {
						this.isLoading = false;
					}
				});
			},
			goBack() {
				uni.navigateBack();
			},
			fetchAllTeachersStatistics() {
				this.isLoadingAll = true;
				this.allStatistics = null;
				this.noData = false;
				const [year, month] = this.selectedMonth.split('-').map(Number);
				const startDate = `${this.selectedMonth}-01`;
				const endDate = new Date(year, month, 0).toISOString().slice(0, 10);

				uniCloud.callFunction({
					name: 'teacher-hours-statistics',
					data: {
						action: 'get-all-teachers-hours',
						params: { startDate, endDate }
					},
					success: (res) => {
						const result = res.result;
						console.log('全员课时统计结果:', result);
						if (result.code === 200 && result.data) {
							// 转换数据格式以适应现有UI
							const allStats = result.data.map(teacher => {
								return {
									username: teacher.username,
									teacherName: teacher.teacherName || teacher.username,
									'一对一': teacher.statistics['一对一'] || 0,
									'班课': teacher.statistics['班课'] || 0,
									'脱产生': teacher.statistics['脱产生'] || 0
								};
							});
							this.allStatistics = allStats;
							
							// 检查是否有教师有课时
							const hasActiveTeachers = allStats.some(teacher => 
								teacher['一对一'] > 0 || teacher['班课'] > 0 || teacher['脱产生'] > 0);
							if (!hasActiveTeachers) {
								uni.showToast({ title: '暂无教师有课时记录', icon: 'none' });
							}
						} else {
							this.allStatistics = [];
							uni.showToast({ title: result.message || '查询失败', icon: 'none' });
						}
					},
					fail: (err) => {
						console.error('查询全员课时失败:', err);
						uni.showToast({ title: '查询全员课时失败', icon: 'none' });
						this.allStatistics = [];
					},
					complete: () => {
						this.isLoadingAll = false;
					}
				});
			},
			// 新增：获取课程时长的方法
			getCourseDuration(courseType) {
				// 可以根据课程类型设置不同的时长
				switch(courseType) {
					case '一对一':
						return 2; // 一对一课程2小时
					case '班课':
						return 2; // 班课2小时
					case '脱产生':
						return 2; // 脱产生2小时
					default:
						return 2; // 默认2小时
				}
			}
		}
	};
</script>

<style>
.statistics-page {
	padding: 40rpx;
	padding-top: calc(env(safe-area-inset-top) + 80rpx);
	background: #f4f6f8;
	min-height: 100vh;
	box-sizing: border-box;
	position: relative; /* 为返回按钮定位 */
}

/* 返回按钮样式 */
.back-btn-container {
	position: absolute;
	top: calc(env(safe-area-inset-top) + 90rpx);
	left: 40rpx;
	z-index: 100;
}

.back-btn {
	background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); /* 修改为与保存按钮相同的绿色渐变 */
	border: none;
	border-radius: 50%;
	width: 80rpx;
	height: 80rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 8rpx 25rpx rgba(67, 233, 123, 0.4);
	transition: all 0.3s ease;
	padding: 0;
	line-height: 1;
}

.back-btn:active {
	transform: scale(0.95);
	box-shadow: 0 4rpx 15rpx rgba(67, 233, 123, 0.3);
}

.back-btn-icon {
	color: #ffffff;
	font-size: 40rpx;
	font-weight: bold;
}

.main-content {
	margin-top: 100rpx;
}

.page-title {
	font-size: 48rpx;
	font-weight: bold;
	text-align: center;
	margin-bottom: 40rpx;
	color: #333;
}
.form-section, .action-buttons {
	margin-bottom: 30rpx;
}
.form-item {
	margin-bottom: 20rpx;
}
.search-input {
	width: 100%;
	height: 80rpx;
	background-color: #fff;
	border-radius: 40rpx;
	padding: 0 40rpx;
	box-sizing: border-box;
	font-size: 28rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
	margin-bottom: 20rpx;
	border: 1rpx solid #e0e0e0;
}
.picker-display {
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: #ffffff;
	padding: 25rpx 40rpx;
	border-radius: 40rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
	font-size: 30rpx;
	color: #333;
	border: 1rpx solid #e0e0e0;
}
.picker-arrow {
	color: #999;
}
.action-buttons {
	display: flex;
	justify-content: flex-start;
	align-items: center;
	margin-bottom: 40rpx;
	gap: 30rpx;
}
.query-btn {
	flex: 1;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: #fff;
	font-weight: bold;
	border-radius: 50rpx;
	box-shadow: 0 8rpx 25rpx rgba(102, 126, 234, 0.3);
	font-size: 30rpx;
	padding: 18rpx 0;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 12rpx;
	min-width: 0;
}
.btn-icon {
	font-size: 32rpx;
}
.all-btn {
	background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
	box-shadow: 0 8rpx 25rpx rgba(67, 233, 123, 0.2);
}
.all-btn:active {
	box-shadow: 0 4rpx 15rpx rgba(67, 233, 123, 0.15);
}

.card-bg {
	background: #fff;
	border-radius: 28rpx;
	box-shadow: 0 8rpx 40rpx rgba(0,0,0,0.07);
	padding: 32rpx 20rpx 24rpx 20rpx;
	margin-bottom: 32rpx;
}

.results-section {
	background: #fff;
	padding: 32rpx 20rpx 24rpx 20rpx;
	border-radius: 28rpx;
	margin-top: 0;
	box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.07);
	margin-bottom: 32rpx;
}
.results-title {
	font-size: 34rpx;
	font-weight: bold;
	margin-bottom: 40rpx;
	text-align: center;
	color: #333;
}
.results-grid {
	display: flex;
	justify-content: space-around;
	text-align: center;
}
.result-item {
	padding: 10rpx;
}
.result-value {
	font-size: 52rpx;
	font-weight: bold;
	color: #667eea;
	margin-bottom: 10rpx;
}
.result-label {
	font-size: 26rpx;
	color: #666;
}

/* 为不同课程类型设置不同颜色 */
.one-to-one-value {
	color: #FF6B6B; /* 红色 */
}
.group-class-value {
	color: #4ECDC4; /* 青色 */
}
.full-time-value {
	color: #FFD166; /* 黄色 */
}

.one-to-one-label {
	color: #FF6B6B;
}
.group-class-label {
	color: #4ECDC4;
}
.full-time-label {
	color: #FFD166;
}

.empty-state {
	text-align: center;
	color: #999;
	margin-top: 80rpx;
	font-size: 30rpx;
}

/* 新增全员统计表格样式 */
.all-table {
	margin-top: 30rpx;
	width: 100%;
}
.all-table-header, .all-table-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 18rpx 0;
	border-bottom: 1rpx solid #e0e0e0;
}
.all-table-header {
	font-weight: bold;
	background: #f7f7fa;
}
.all-th, .all-td {
	flex: 1;
	text-align: center;
	font-size: 28rpx;
	color: #333;
}
.all-td {
	color: #4a67d6;
}

/* 教师姓名颜色 */
.teacher-name {
	color: #1976D2; /* 蓝色 */
	font-weight: bold;
}

/* 不同课程类型的数字颜色 */
.one-to-one-hours {
	color: #FF6B6B; /* 红色 */
	font-weight: bold;
}

.group-class-hours {
	color: #4ECDC4; /* 青色 */
	font-weight: bold;
}

.full-time-hours {
	color: #FFD166; /* 黄色 */
	font-weight: bold;
}
</style>