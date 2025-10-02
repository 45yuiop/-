<template>
	<view class="page-container">
		<!-- <view style="font-size:32rpx;color:#1976D2;font-weight:bold;margin:40rpx 0 30rpx 0;text-align:center;">这里是教师课程表页面</view> -->
		<!-- 状态栏, 用于适配刘海屏 -->
		<view class="status-bar"></view>
		<!-- 顶部导航栏 -->
		<view class="top-bar">
			<view class="top-nav">
				<view class="back-btn" @click="goBack">
					<text class="back-icon">‹</text>
					<text class="back-text">返回</text>
				</view>
				<view v-if="!isSelf && !isTeacher" class="teacher-selector">
					<picker @change="onTeacherChange" :value="teacherIndex" :range="filteredTeacherList" range-key="teacherName">
						<view class="picker-display">
							<text class="page-title">{{ selectedTeacher ? selectedTeacher.teacherName : '选择教师' }}</text>
							<text class="dropdown-arrow-title">▼</text>
						</view>
					</picker>
				</view>
				<view v-else class="teacher-selector">
					<view class="picker-display">
						<text class="page-title">{{ selectedTeacher ? selectedTeacher.teacherName : '' }}</text>
					</view>
				</view>
				<!-- 右上角搜索区域 -->
				<view class="search-container">
					<view class="search-input-wrapper">
						<input 
							class="search-input" 
							v-model="searchKeyword" 
							placeholder="搜索教师姓名"
							@input="onSearchInput"
							@focus="onSearchFocus"
							@blur="onSearchBlur"
						/>
						<text class="search-icon">🔍</text>
					</view>
				</view>
			</view>
			<!-- 周选择 -->
			<view class="week-selector-bar">
				<button class="week-btn prev-btn" @click="changeWeek(-1)">
					<text class="week-btn-icon">◀</text>
					<text class="week-btn-text">上一周</text>
				</button>
				<button class="week-btn next-btn" @click="changeWeek(1)">
					<text class="week-btn-text">下一周</text>
					<text class="week-btn-icon">▶</text>
				</button>
				<button class="today-btn" @click="returnToCurrentWeek">今天</button>
			</view>
		</view>

		<!-- 课程表容器 -->
		<view class="schedule-container">
			<!-- 固定的头部行 -->
			<view class="fixed-header">
				<!-- 月份单元格 -->
				<view class="month-cell">{{ currentMonth }}月</view>
				<!-- 日期头部 -->
				<view class="day-header" v-for="(day, dayIndex) in days" :key="dayIndex" :class="{ 'is-today': isToday(day.fullDate) }">
					<view class="day-name">{{ day.name }}</view>
					<view class="day-date">{{ day.date }}</view>
				</view>
			</view>
			
			<!-- 可滚动的内容区域 -->
			<view class="scrollable-content">
				<!-- 时间和课程网格 -->
				<view class="schedule-grid">
					<!-- 时间列 -->
					<view class="time-column">
						<view v-for="(period, index) in periods" :key="period" class="time-slot">
							{{ period }}
						</view>
					</view>
					<!-- 课程列 -->
					<view class="days-container">
						<view class="day-column" v-for="(day, dayIndex) in days" :key="dayIndex">
							<!-- 课程格子和课程块部分 -->
							<view class="course-slots-container">
								<view class="course-placeholder" v-for="(p, index) in periods" :key="index"></view>
								<view
									v-if="!isLoading"
									v-for="(course, cIndex) in coursesByDay[dayIndex]"
									:key="cIndex"
									:style="course.style"
									class="course-block"
									:class="{ 'can-apply': canApplyChange(course, day.fullDate) }"
									@click="handleCourseClick(course, day.fullDate, dayIndex)"
								>
									<view>
										<span style="color:#333;">
											{{ course.name }}-{{ course.teacher_name || selectedTeacher.teacherName || '' }}@{{ course.location || '' }}教室
										</span>
										<view v-if="course.remark" class="course-remark-show">备注：{{ course.remark }}</view>
										<span style="display:block;font-size:13px;font-weight:500;color:#333;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px;">
											{{ course.course_type || course.type || '' }}
										</span>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 加载动画 -->
		<view v-if="isLoading" class="loading-overlay">
			<view class="loading-text">课程加载中...</view>
		</view>
		
		<!-- 可点击图片 -->
		<image 
			:src="isImageClicked ? '/static/机器1.gif' : '/static/机器.png'" 
			class="clickable-image" 
			:style="{ transform: `translate(${imageTranslateX}px, ${imageTranslateY}px)` }"
			@click="toggleImage"
			@touchstart="handleImageTouchStart"
			@touchmove="handleImageTouchMove"
			@touchend="handleImageTouchEnd"
			mode="aspectFit"
		></image>
		<!-- 机器人对话气泡 -->
		<view v-if="showBubble" class="assistant-bubble pretty" :class="{ 'bubble-below': isBubbleBelow }" :style="bubbleStyle">
			<text class="bubble-text">{{ greetingText }}</text>
			<view v-if="hasSchedulePermission" style="margin-top: 12rpx;">
				<text class="quick-action" @click="goToScheduleArrange">一键排课</text>
			</view>
			<view class="pretty-tail pretty-tail-1"></view>
			<view class="pretty-tail pretty-tail-2"></view>
		</view>
		<!-- 悬浮保存排课按钮 -->
		<!-- <button class="save-schedule-btn" @click="saveSchedule">�� 保存排课</button> -->
		<!-- 悬浮保存排课按钮，始终固定底部 -->
		<!-- <view class="bottom-btn-bar">
			<button class="bottom-btn" @click="saveSchedule">保存排课</button>
		</view> -->
	</view>
</template>

<script>
	import { getCourseColor } from '../../utils/courseColor.js';
	export default {
		data() {
			return {
				allTeacherList: [],
				teacherIndex: -1,
				searchKeyword: '',
				selectedTeacher: null,
				allCourses: [], // 存储当周所有课程
				isLoading: true,
				isImageClicked: false, // 控制图片是否被点击
				periods: [
					'8:00',   
					'10:00',  
					'10:10',  
					'12:10',  
					'14:00',  
					'16:00',  
					'16:10',  
					'18:10',  
					'18:00',  
					'20:00',  
					'20:00',
					'22:00'   
				], // 课表时间段
				days: [], // 周一到周日
				currentDate: (function() {
					const now = new Date();
					now.setHours(0,0,0,0);
					let dayOfWeek = now.getDay();
					let day = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
					now.setDate(now.getDate() - day);
					return now;
				})(),
				isTeacher: false, // 新增
				isSelf: false, // 新增
				// 图片拖动相关变量
				imageStartX: 0,
				imageStartY: 0,
				imageTranslateX: 0,
				imageTranslateY: 0,
				isImageDragging: false,
				showBubble: false,
				greetingText: ''
			};
		},
		computed: {
			bubbleStyle() {
				// 获取屏幕尺寸
				const windowInfo = uni.getWindowInfo ? uni.getWindowInfo() : uni.getSystemInfoSync();
				const windowWidth = windowInfo.windowWidth;
				const windowHeight = windowInfo.windowHeight;
				
				// 气泡尺寸（估算）
				const bubbleWidth = windowWidth * 0.68; // 68vw
				const bubbleHeight = 120; // 估算高度
				
				// 计算气泡的理想位置（机器人正上方）
				let offsetX = this.imageTranslateX - 20;
				let offsetY = this.imageTranslateY - 120;
				
				// 边界检测和调整
				// 确保气泡不超出左边界
				if (offsetX < 10) {
					offsetX = 10;
				}
				// 确保气泡不超出右边界
				if (offsetX + bubbleWidth > windowWidth - 10) {
					offsetX = windowWidth - bubbleWidth - 10;
				}
				// 确保气泡不超出上边界
				if (offsetY < 10) {
					offsetY = 10;
				}
				// 确保气泡不超出下边界（如果机器人太靠上，气泡显示在机器人下方）
				if (offsetY + bubbleHeight > windowHeight - 10) {
					offsetY = this.imageTranslateY + 120; // 显示在机器人下方
				}
				
				return `transform: translate(${offsetX}px, ${offsetY}px)`;
			},
			isBubbleBelow() {
				// 判断气泡是否显示在机器人下方
				const windowInfo = uni.getWindowInfo ? uni.getWindowInfo() : uni.getSystemInfoSync();
				const windowHeight = windowInfo.windowHeight;
				const bubbleHeight = 120;
				
				let idealY = this.imageTranslateY - 120;
				return idealY + bubbleHeight > windowHeight - 10;
			},
			currentWeek() {
				const startOfYear = new Date(this.currentDate.getFullYear(), 0, 1);
				const pastDaysOfYear = (this.currentDate - startOfYear) / 86400000;
				return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
			},
			currentMonth() {
				// 获取当前周的周一的月份
				const monday = this.getMondayOfWeek(this.currentDate);
				return monday.getMonth() + 1;
			},
			filteredTeacherList() {
				if (!this.searchKeyword) {
					return this.allTeacherList;
				}
				return this.allTeacherList.filter(teacher =>
					teacher.teacherName && teacher.teacherName.toLowerCase().includes(this.searchKeyword.toLowerCase())
				);
			},
			userInfo() {
				return uni.getStorageSync('userInfo') || {};
			},
			featureList() {
				return this.userInfo.featureList || [];
			},
			hasSchedulePermission() {
				// 检查用户是否有"教师排课"权限
				const userInfo = this.userInfo;
				const featureList = this.featureList;
				
				// 超级管理员直接拥有所有权限
				if (userInfo.role === '超级管理员' || userInfo.permission === 'superadmin') {
					return true;
				}
				
				// 检查是否包含"教师排课"功能
				return featureList.includes('schedule') || featureList.includes('教师排课');
			},
			coursesByDay() {
				const coursesData = {};
				for (let i = 0; i < 7; i++) {
					coursesData[i] = [];
				}

				// 定义每个课程节数对应的开始和结束时间索引
				// 格式：{课程节数: {start: 开始时间索引, end: 结束时间索引}}
				const periodTimeMapping = {
					1: {start: 0, end: 1},   // 第1节课：8:00-10:00 (periods[0]到periods[1])
					2: {start: 2, end: 3},   // 第2节课：10:10-12:10 (periods[2]到periods[3])
					3: {start: 4, end: 5},   // 第3节课：14:00-16:00 (periods[4]到periods[5])
					4: {start: 6, end: 7},   // 第4节课：16:10-18:10 (periods[6]到periods[8])
					5: {start: 8, end: 9},   // 第5节课：18:00-20:00 (periods[7]到periods[9])
					6: {start: 10, end: 11}   // 第6节课：20:00-22:00 (periods[9]到periods[10])
				};

				// 调试：打印时间段数组和映射关系
				console.log('时间段数组:', this.periods);
				console.log('课程节数映射:', periodTimeMapping);

				this.allCourses.forEach(course => {
					// 调试：打印每个课程的详细信息
					console.log('处理课程:', {
						name: course.course_name,
						date: course.date,
						start_period: course.start_period,
						end_period: course.end_period,
						start_time: course.start_time,
						end_time: course.end_time
					});

					// 过滤掉无效的课程节数，防止显示第0节课
					if (course.start_period < 1 || course.start_period > 7 || course.end_period < 1 || course.end_period > 7) {
						console.warn('跳过无效的课程节数:', course);
						return;
					}

					const dayOfWeek = new Date(course.date).getDay();
					const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 周一为0

					if (dayIndex >= 0 && dayIndex < 7) {
						// 获取课程开始和结束的时间索引
						const periodMapping = periodTimeMapping[course.start_period];
						
						if (periodMapping) {
							const startTimeIndex = periodMapping.start;
							const endTimeIndex = periodMapping.end;
							
							// 计算实际的课程时长（跨越的时间段数量）
							const actualDuration = endTimeIndex - startTimeIndex + 1;
							
							// 计算每个时间段的像素高度
							// 每个时间段固定80px高度
							const slotHeight = 80; // 每个单元格80px
							const top = startTimeIndex * slotHeight;
							const height = actualDuration * slotHeight;
							
							// 调试：打印高度计算详情
							console.log(`高度计算详情:`, {
								startTimeIndex,
								endTimeIndex,
								actualDuration,
								top: `${top}px`,
								height: `${height}px`,
								startTime: this.periods[startTimeIndex],
								endTime: this.periods[endTimeIndex]
							});

							// 添加调试信息
							console.log(`课程 ${course.course_name} (第${course.start_period}节课) 显示在:`, {
								dayIndex,
								startTimeIndex,
								endTimeIndex,
								actualDuration,
								top: `${top}px`,
								height: `${height}px`,
								style: `top: ${top}px; height: ${height}px; ${getCourseColor(course.course_type, course.course_name)}`,
								periods: this.periods,
								startTime: this.periods[startTimeIndex],
								endTime: this.periods[endTimeIndex]
							});

							coursesData[dayIndex].push({
								...course, // 展开原始对象，带上_id等所有字段
								name: course.course_name,
								location: course.location,
								class: course.class_name,
								style: `top: ${top}px; height: ${height}px; ${getCourseColor(course.course_type, course.course_name)}`,
								teacher_name: course.teacher_name || this.selectedTeacher.teacherName || '',
								type: course.course_type || course.type || '',
								remark: course.remark // 添加备注字段
							});
						}
					}
				});
				return coursesData;
			}
		},
			onLoad(options) {
			const userInfo = uni.getStorageSync('userInfo') || {};
			
			if (options && options.isSelf === 'true') {
				this.isSelf = true;
				this.isTeacher = true;
				this.selectedTeacher = {
					_id: userInfo._id,
					teacherName: userInfo.teacherName || userInfo.username
				};
				this.currentDate = this.getMondayOfWeek(new Date());
				this.generateWeekData();
			} else {
				// 统一放开，所有人都能查所有老师
				this.isTeacher = false;
				this.fetchTeachers();
			}
			// 初始化图片位置
			this.initImagePosition();
			// 生成问候语
			const name = userInfo.realName || userInfo.teacherName || userInfo.nickname || userInfo.username || '';
			const first = name ? name.charAt(0) : '';
			this.greetingText = `你好，${first}老师，我是你的智能小助手小言。请问我有什么可以帮助你的？`;
		},
		onShow() {
			// 页面显示时重新初始化图片位置
			this.initImagePosition();
		},
		methods: {
			getMondayOfWeek(date = this.currentDate) {
				const now = new Date(date);
				now.setHours(0,0,0,0);
				let dayOfWeek = now.getDay();
				let day = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
				now.setDate(now.getDate() - day);
				return now;
			},
			getDayOfWeek(dateStr) {
				const dayNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
				const date = new Date(dateStr);
				let day = date.getDay();
				return dayNames[day === 0 ? 6 : day - 1];
			},
			generateWeekData() {
				const monday = this.getMondayOfWeek(this.currentDate);
				this.days = [];
				for (let i = 0; i < 7; i++) {
					const day = new Date(monday);
					day.setDate(monday.getDate() + i);
					const fullDate = this.formatDate(day);
					this.days.push({
						name: this.getDayOfWeek(fullDate),
						date: day.getDate(),
						fullDate: fullDate
					});
				}
				console.log('days:', this.days.map(d => d.fullDate + ' ' + d.name));
				if (this.selectedTeacher) {
					this.fetchWeekCourses();
				}
			},
			// 周区间文本（本周一~本周日）
			getWeekRangeText() {
				const monday = this.getMondayOfWeek();
				const sunday = new Date(monday);
				sunday.setDate(monday.getDate() + 6);
				return `${this.formatDate(monday)} ~ ${this.formatDate(sunday)}`;
			},
			// 上一周/下一周切换
			changeWeek(offset) {
				const monday = this.getMondayOfWeek(this.currentDate);
				monday.setDate(monday.getDate() + offset * 7);
				this.currentDate = this.getMondayOfWeek(monday); // 强制为新周一
				this.generateWeekData();
			},
			// 回到本周
			returnToCurrentWeek() {
				this.currentDate = this.getMondayOfWeek(new Date());
				this.generateWeekData();
			},
			isToday(dateString) {
				const today = new Date();
				const date = new Date(dateString);
				return today.getFullYear() === date.getFullYear() &&
					today.getMonth() === date.getMonth() &&
					today.getDate() === date.getDate();
			},
			formatDate(date) {
				const year = date.getFullYear();
				const month = ('0' + (date.getMonth() + 1)).slice(-2);
				const day = ('0' + date.getDate()).slice(-2);
				return `${year}-${month}-${day}`;
			},
			// 初始化图片位置
			initImagePosition() {
				// 使用 nextTick 确保 DOM 已经渲染
				this.$nextTick(() => {
					// 获取页面可视区域尺寸
					const windowInfo = uni.getWindowInfo ? uni.getWindowInfo() : uni.getSystemInfoSync();
					const windowWidth = windowInfo.windowWidth;
					const windowHeight = windowInfo.windowHeight;
					
					// 图片尺寸（220rpx = 110px）
					const imageSize = 110;
					
					// 计算图片在右下角时的translate值
					// 右下角位置：left = windowWidth - imageSize - 10, top = windowHeight - imageSize - 10
					// 10px = 20rpx
					this.imageTranslateX = windowWidth - imageSize - 10;
					this.imageTranslateY = windowHeight - imageSize - 10;
				});
			},
			goBack() {
				// 判断是否为tabBar入口
				const pages = getCurrentPages();
				if (pages.length === 1) {
					// 只有一个页面，说明是tabBar入口，跳转首页
					uni.switchTab({ url: '/pages/home/home' });
				} else {
					uni.navigateBack();
				}
			},
			async fetchTeachers() {
				this.isLoading = true;
				try {
					const res = await uniCloud.callFunction({
						name: 'user-center',
						data: {
							action: 'getAllUsersByRole',
							params: {
								role: 'teacher'
							}
						}
					});
					if (res.result && res.result.data) {
					this.allTeacherList = res.result.data.map(t => ({
						_id: t._id,
						username: t.username,
						nickname: t.nickname,
						teacherName: t.nickname || t.teacherName || t.username // 使用 nickname 作为教师名字, 如果没有则使用 username
					}));
						if (this.allTeacherList.length > 0) {
							this.teacherIndex = 0;
							this.selectedTeacher = this.filteredTeacherList[0];
							this.currentDate = this.getMondayOfWeek(new Date());
							this.generateWeekData();
						} else {
							this.isLoading = false;
						}
					} else {
						uni.showToast({
							title: (res.result && res.result.errMsg) || '获取教师列表失败',
							icon: 'none'
						});
						this.isLoading = false;
					}
				} catch (e) {
					console.error("获取教师列表失败", e);
					uni.showToast({
						title: '教师加载失败',
						icon: 'none'
					});
					this.isLoading = false;
				}
			},
			onTeacherChange(e) {
				this.teacherIndex = e.detail.value;
				this.selectedTeacher = this.filteredTeacherList[this.teacherIndex];
				this.currentDate = this.getMondayOfWeek(new Date());
				this.generateWeekData(); // 切换教师时回到本周
			},
			// 搜索输入处理
			onSearchInput(e) {
				this.searchKeyword = e.detail.value;
				// 实时搜索教师
				this.searchTeachers();
			},
			// 搜索框获得焦点
			onSearchFocus() {
				console.log('搜索框获得焦点');
			},
			// 搜索框失去焦点
			onSearchBlur() {
				console.log('搜索框失去焦点');
			},
			// 搜索教师
			searchTeachers() {
				if (!this.searchKeyword.trim()) {
					// 如果搜索关键词为空，不进行任何操作
					return;
				}
				
				// 根据关键词过滤教师列表
				const filteredTeachers = this.allTeacherList.filter(teacher => 
					teacher.teacherName && teacher.teacherName.toLowerCase().includes(this.searchKeyword.toLowerCase())
				);
				
				// 如果找到匹配的教师，自动选择第一个并显示课程
				if (filteredTeachers.length > 0) {
					this.selectedTeacher = filteredTeachers[0];
					// 更新教师选择器的索引
					this.teacherIndex = this.allTeacherList.findIndex(teacher => 
						teacher._id === filteredTeachers[0]._id
					);
					this.currentDate = this.getMondayOfWeek(new Date());
					this.generateWeekData();
				} else {
					// 没有找到匹配的教师，显示提示
					uni.showToast({
						title: '未找到匹配的教师',
						icon: 'none'
					});
				}
			},
			async fetchWeekCourses() {
				if (!this.selectedTeacher) return;
				this.isLoading = true;
				this.allCourses = [];
				try {
					// 以本周一为起点
					const monday = this.getMondayOfWeek(this.currentDate);
					const sunday = new Date(monday);
					sunday.setDate(monday.getDate() + 6);
					const res = await uniCloud.callFunction({
						name: 'schedule-center',
						data: {
							action: 'getSchedulesByTeacher',
							params: {
								teacher_id: this.selectedTeacher._id,
								startDate: this.formatDate(monday),
								endDate: this.formatDate(sunday)
							}
						}
					});
					if (res.result && res.result.data) {
						this.allCourses = res.result.data.map(course => ({
							...course,
							_id: course._id
						}));
						
						// 添加调试信息
						console.log('加载的课程数据:', this.allCourses);
						console.log('第4节课数据:', this.allCourses.filter(c => c.start_period === 4));
						
						this.isLoading = false;
					} else {
						uni.showToast({
							title: (res.result && res.result.errMsg) || '获取课程失败',
							icon: 'none'
						});
						this.isLoading = false;
					}
				} catch (e) {
					console.error('获取课程失败', e);
					uni.showToast({
						title: '课程加载失败',
						icon: 'none'
					});
					this.isLoading = false;
				}
			},
			getCourseColor(type, className) {
				return getCourseColor(type, className);
			},
			isFutureCourse(dateString) {
				const today = new Date();
				today.setHours(0, 0, 0, 0); // 设置为当天0点
				const courseDate = new Date(dateString);
				courseDate.setHours(0, 0, 0, 0); // 设置为课程日期0点
				return courseDate >= today;
			},
			goToApplyChange(course, date) {
				// slot 对应时间段映射
				const slotToTime = {
					1: '8:00-10:00',
					2: '10:10-12:10',
					3: '14:00-16:00',
					4: '16:10-18:10',
					
					5: '18:00-20:00',
					6: '20:00-22:00'
				};
				let timeStr = '';
				if (course.start_period) {
					timeStr = slotToTime[course.start_period] || course.start_time || course.time || course.originalTime || '8:00';
				} else {
					timeStr = course.start_time || course.time || course.originalTime || '8:00';
				}
				const courseInfo = {
					courseId: course._id,
					courseName: course.name,
					date: date,
					time: timeStr,
					location: course.location,
					className: course.class
				};
				console.log('goToApplyChange 传递 courseId', course._id, 'time:', timeStr);
				uni.navigateTo({
					url: '/pages/apply-change-course/apply-change-course?courseInfo=' + encodeURIComponent(JSON.stringify(courseInfo))
				});
			},
			// 切换图片/显示气泡
			toggleImage() {
				this.isImageClicked = !this.isImageClicked;
				this.showBubble = !this.showBubble;
			},
			// 判断课程是否可调课
			canApplyChange(course, date) {
				const now = new Date();
				const courseDate = new Date(date);
				// 新增：必须大于今天+5天
				const minDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 6); // 今天+6天
				if (courseDate < minDate) return false;
				// 课程日期晚于今天+5天，可以调课
				return true;
			},
			handleCourseClick(course, date, dayIndex) {
				// 所有课程都可以查看详情
				uni.showModal({
					title: '课程详情',
					content: `课程名称：${course.name}
教师：${course.teacher_name}
教室：${course.location}
类型：${course.type}
备注：${course.remark || ''}`,
					showCancel: false
				});
				
				// 周五到周日的课程还可以调课（如果是本人查看自己的课表且满足调课条件）
				if (dayIndex >= 4 && this.isSelf && this.canApplyChange(course, date)) {
					uni.showModal({
						title: '操作选择',
						content: '您要查看课程详情还是申请调课？',
						showCancel: true,
						cancelText: '查看详情',
						confirmText: '申请调课',
						success: (res) => {
							if (res.confirm) {
								this.goToApplyChange(course, date);
							}
						}
					});
				}
			},
			saveSchedule() {
				uni.showToast({
					title: '排课保存成功!',
					icon: 'success'
				});
			},
			// 图片拖动开始
			handleImageTouchStart(e) {
				// 保存触摸起始点
				this.imageStartX = e.touches[0].clientX;
				this.imageStartY = e.touches[0].clientY;
				this.isImageDragging = true;
				// 阻止页面滚动
				e.preventDefault();
				e.stopPropagation();
			},
			// 图片拖动中
			handleImageTouchMove(e) {
				if (!this.isImageDragging) return;
				
				// 阻止页面滚动
				e.preventDefault();
				e.stopPropagation();
				
				const touchX = e.touches[0].clientX;
				const touchY = e.touches[0].clientY;
				
				// 计算移动距离
				const deltaX = touchX - this.imageStartX;
				const deltaY = touchY - this.imageStartY;
				
				// 计算新的位置（当前图片位置 + 移动距离）
				let newX = this.imageTranslateX + deltaX;
				let newY = this.imageTranslateY + deltaY;
				
				// 获取页面可视区域尺寸（使用新的API）
				const windowInfo = uni.getWindowInfo ? uni.getWindowInfo() : uni.getSystemInfoSync();
				const windowWidth = windowInfo.windowWidth;
				const windowHeight = windowInfo.windowHeight;
				
				// 图片尺寸（220rpx = 110px）
				const imageSize = 110;
				
				// 限制X轴移动范围（左边距0，右边距不超出页面）
				newX = Math.max(0, Math.min(newX, windowWidth - imageSize));
				
				// 限制Y轴移动范围（上边距0，下边距不超出页面）
				newY = Math.max(0, Math.min(newY, windowHeight - imageSize));
				
				// 更新图片位置（通过数据驱动）
				this.imageTranslateX = newX;
				this.imageTranslateY = newY;
				
				// 更新起始点，以便连续移动
				this.imageStartX = touchX;
				this.imageStartY = touchY;
			},
			// 图片拖动结束
			handleImageTouchEnd(e) {
				this.isImageDragging = false;
				// 保持图片在当前位置，不自动回去
				e.preventDefault();
				e.stopPropagation();
			},
			goToScheduleArrange() {
				// 跳转到排课页面，并传递当前教师与日期，便于在排课页直接加载一致数据
				const teacher = this.selectedTeacher || {};
				const userInfo = uni.getStorageSync('userInfo') || {};
				const uid = teacher._id || userInfo._id || '';
				// 这里必须传真实 username，服务端用 username/uid 查询
				const username = teacher.username || userInfo.username || '';
				const date = this.formatDate(new Date(), 'yyyy-MM-dd');
				const query = `uid=${encodeURIComponent(uid)}&username=${encodeURIComponent(username)}&date=${encodeURIComponent(date)}`;
				uni.navigateTo({ url: `/pages/schedule-manage/schedule-manage?${query}` });
			}
		}
	};
</script>

<style scoped>
	/* 基本样式重置和页面容器 */
	.schedule-page-container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		background-color: #f8f9fa;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
	}

	.status-bar {
		height: var(--status-bar-height);
		width: 100%;
		background-color: #FFFFFF;
	}

	/* 顶部区域 */
	.top-bar {
		background-color: #6B55D3;
		color: white;
		flex-shrink: 0;
	}

	.top-nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 10px 15px;
		background-color: #FFFFFF;
		color: #000;
	}

	.back-btn {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 8px 12px;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		border-radius: 20px;
		color: white;
		font-size: 14px;
		box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
		transition: all 0.3s ease;
	}

	.back-btn:active {
		transform: translateY(1px);
		box-shadow: 0 1px 4px rgba(102, 126, 234, 0.3);
	}

	.back-icon {
		font-size: 18px;
		font-weight: bold;
	}

	.back-text {
		font-size: 14px;
		font-weight: 500;
	}

	.teacher-selector {
		flex: 1;
		display: flex;
		justify-content: center;
	}

	.picker-display {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
	}

	.page-title {
		font-size: 18px;
		font-weight: bold;
		color: #333;
	}

	.dropdown-arrow-title {
		font-size: 14px;
		margin-left: 8px;
	}

	/* 搜索区域样式 */
	.search-container {
		display: flex;
		align-items: center;
		gap: 10px;
		flex-shrink: 0;
	}

	.teacher-name-display {
		background-color: #f5f5f5;
		padding: 6px 12px;
		border-radius: 15px;
		border: 1px solid #e0e0e0;
		min-width: 80px;
		text-align: center;
	}

	.teacher-name-text {
		font-size: 14px;
		color: #666;
		font-weight: 500;
	}

	.search-input-wrapper {
		position: relative;
		display: flex;
		align-items: center;
	}

	.search-input {
		width: 120px;
		height: 32px;
		padding: 0 30px 0 12px;
		border: 1px solid #e0e0e0;
		border-radius: 16px;
		font-size: 14px;
		background-color: #f9f9f9;
		transition: all 0.3s ease;
	}

	.search-input:focus {
		border-color: #667eea;
		background-color: #fff;
		box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
	}

	.search-icon {
		position: absolute;
		right: 8px;
		font-size: 14px;
		color: #999;
		pointer-events: none;
	}

	/* 周选择器 */
	.week-selector-bar {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 12px 15px;
		gap: 20px;
	}

	.week-btn {
		display: flex;
		align-items: center;
		gap: 6px;
		color: white;
		border: none;
		border-radius: 25px;
		padding: 12px 20px;
		font-size: 14px;
		font-weight: 500;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		transition: all 0.2s ease-in-out;
		justify-content: center;
	}

	.week-btn:active {
		transform: translateY(2px);
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
	}

	.prev-btn {
		background: #6D6AEC;
	}

	.next-btn {
		background: linear-gradient(135deg, #F87D9A 0%, #F5576C 100%);
	}

	.week-btn-icon {
		font-size: 12px;
		font-weight: bold;
	}

	.week-btn-text {
		font-size: 14px;
		font-weight: 500;
	}

	.today-btn {
		background: linear-gradient(135deg, #44E5FC 0%, #00D7FF 100%);
		color: white;
		border: none;
		border-radius: 50%;
		font-size: 16px;
		font-weight: 500;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		transition: all 0.2s ease-in-out;
		width: 60px;
		height: 60px;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0;
	}

	.today-btn:active {
		transform: translateY(2px);
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
	}

	/* 课程表容器 */
	.schedule-container {
		display: flex;
		flex-direction: column;
		flex-grow: 1;
		min-height: 0;
		height: 100%;
	}

	/* 固定的头部行 */
	.fixed-header {
		display: flex;
		flex-shrink: 0;
		background-color: #fff;
		border-bottom: 1px solid #EAEAEA;
		z-index: 10;
	}

	/* 可滚动的内容区域 */
	.scrollable-content {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
	}

	/* 课程表网格 */
	.schedule-grid {
		display: flex;
		height: 100%;
	}

	/* 时间和月份列 */
	.time-column {
		display: flex;
		flex-direction: column;
		width: 40px;
		flex-shrink: 0;
		background-color: #fff;
		height: 100%;
		border-right: 1px solid #EAEAEA; /* 添加右边框，与日期列分隔 */
		justify-content: flex-start; /* 确保从顶部开始排列 */
	}

	.month-cell {
		height: 50px;
		line-height: 50px;
		font-size: 16px;
		color: #333;
		background-color: #6B55D3;
		color: white;
		box-sizing: border-box;
		flex-shrink: 0; /* 防止压缩 */
		text-align: center;
		width: 40px;
	}

	/* 固定头部中的月份单元格 */
	.fixed-header .month-cell {
		width: 40px;
		flex-shrink: 0;
	}

	/* 固定头部中的日期头部 */
	.fixed-header .day-header {
		flex: 1;
		text-align: center;
		padding: 8px 0;
		font-size: 14px;
		height: 50px;
		box-sizing: border-box;
		background-color: #6B55D3;
		color: white;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border-left: 1px solid #EAEAEA;
	}

	.fixed-header .day-header:first-child {
		border-left: none;
	}

	.fixed-header .day-header.is-today {
		background-color: #18B5A5;
	}

	.time-slot {
		flex: 1 1 0%;
		display: flex;
		align-items: center; /* 改为居中对齐，让时间标签显示在单元格中央 */
		justify-content: center;
		border-top: 1px solid #EAEAEA;
		box-sizing: border-box;
		height: 80px; /* 固定每个时间段的高度，避免表格过高 */
		padding: 0; /* 移除顶部内边距，让时间标签完全居中 */
		position: relative; /* 添加相对定位，确保子元素定位正确 */
		min-height: 80px; /* 确保最小高度，与课程列保持一致 */
		max-height: 80px; /* 确保最大高度，与课程列保持一致 */
	}

	.days-container {
		display: flex;
		flex-grow: 1;
		height: 100%;
	}

	/* 星期列 */
	.day-column {
		flex: 1;
		display: flex;
		flex-direction: column;
		border-left: 1px solid #EAEAEA;
		height: 100%;
		min-width: 0; /* 确保列可以正确收缩 */
	}
	.day-column:first-child {
		border-left: none;
	}

	.day-name {
		font-size: 15px;
	}

	.day-date {
		font-size: 12px;
	}

	.course-slots-container {
		position: relative;
		height: 100%;
		flex-grow: 1;
		min-height: 0;
		display: flex;
		flex-direction: column;
		justify-content: flex-start; /* 确保从顶部开始排列，与时间列保持一致 */
	}

	.course-placeholder {
		flex: 1 1 0%;
		border-top: 1px solid #EAEAEA;
		border-right: 1px solid #EAEAEA; /* 添加垂直分割线 */
		box-sizing: border-box;
		background: transparent;
		height: 80px; /* 固定每个时间段的高度，与时间列保持一致 */
		position: relative; /* 添加相对定位，确保课程块定位正确 */
		min-height: 80px; /* 确保最小高度，与时间列保持一致 */
		max-height: 80px; /* 确保最大高度，与时间列保持一致 */
	}

	/* 最后一列不需要右边框 */
	.day-column:last-child .course-placeholder {
		border-right: none;
	}

	/* 课程块 */
	.course-block {
		position: absolute;
		left: 1px; /* 减少左边距，确保不超出单元格 */
		right: 1px; /* 减少右边距，确保不超出单元格 */
		margin: 0;
		padding: 4px; /* 减少内边距，确保内容不超出 */
		border-radius: 4px; /* 减少圆角，与减少的内边距匹配 */
		font-size: 12px;
		overflow: hidden;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		font-weight: bold;
		box-shadow: 0 2px 8px rgba(0,0,0,0.1);
		min-height: 0; /* 移除固定最小高度，让课程块完全根据计算的高度显示 */
		border: 1px solid rgba(0,0,0,0.15); /* 减少边框厚度，避免超出 */
		background: rgba(255,255,255,0.95); /* 半透明背景 */
		z-index: 5; /* 确保课程块在网格之上 */
		/* 移除默认的top值，让课程块根据计算的位置显示 */
	}



	/* 调课申请按钮 */
	.change-course-btn {
		background-color: #ff9800;
		color: white;
		font-size: 10px;
		padding: 2px 6px;
		border-radius: 10px;
		margin-top: 4px;
		cursor: pointer;
		transition: background-color 0.3s;
	}

	.change-course-btn:hover {
		background-color: #f57c00;
	}

	/* 加载状态 */
	.loading-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(255, 255, 255, 0.8);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 10;
	}

	.loading-text {
		font-size: 16px;
		color: #6B55D3;
	}

	/* 悬浮保存排课按钮样式 */
	.save-schedule-btn {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100vw;
		height: 60px;
		background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
		color: #fff;
		font-size: 18px;
		z-index: 9999;
		border-radius: 0;
		border: none;
		margin: 0;
		box-shadow: 0 -2px 8px rgba(0,0,0,0.08);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* 预留底部空间，避免内容被按钮遮挡 */
	.page-container {
		height: 100vh;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		padding-bottom: 0 !important;
		margin-bottom: 0 !important;
		box-sizing: border-box;
	}

	/* 页面容器高度拉满 */
	page, .uni-page-body, .uni-app-view, .uni-page {
		height: 100vh;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.schedule-grid {
		flex: 1;
		min-height: 0;
		height: 100%;
		display: flex;
		padding-bottom: 0 !important;
		margin-bottom: 0 !important;
		box-sizing: border-box;
	}

	/* 整体滚动条样式 */
	.scrollable-content::-webkit-scrollbar {
		width: 8px;
	}

	.scrollable-content::-webkit-scrollbar-track {
		background: #f1f1f1;
		border-radius: 4px;
	}

	.scrollable-content::-webkit-scrollbar-thumb {
		background: #c1c1c1;
		border-radius: 4px;
	}

	.scrollable-content::-webkit-scrollbar-thumb:hover {
		background: #a8a8a8;
	}

	/* 删除底部保存排课按钮样式和结构 */
	/* .bottom-btn-bar, .bottom-btn { display: none !important; } */
	.course-remark-show {
		color: #333;
		font-size: 11px;
		margin: 2px 0 0 0;
		line-height: 1.4;
		word-break: break-all;
	}
	
	/* 可点击图片样式 */
	.clickable-image {
		position: fixed;
		left: 0;
		top: 0;
		width: 220rpx;
		height: 220rpx;
		z-index: 999;
		cursor: pointer;
		transform: translate(0, 0);
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
		-webkit-touch-callout: none;
		-webkit-tap-highlight-color: transparent;
	}

	/* 机器人对话气泡样式 */
	.assistant-bubble {
		position: fixed;
		left: 0;
		top: 0;
		max-width: 68vw;
		background: linear-gradient(135deg,#ffffff 0%,#f6fbff 100%);
		border: 1rpx solid #e0f0ff;
		box-shadow: 0 10rpx 26rpx rgba(25,118,210,0.08);
		border-radius: 22rpx;
		padding: 22rpx 26rpx;
		z-index: 1000;
		color: #333;
		font-size: 28rpx;
		line-height: 1.6;
		transform: translate(0,0);
	}

	/* 新的卡通圆角对话框样式（非长方） */
	.assistant-bubble.pretty {
		border-radius: 26rpx 26rpx 10rpx 26rpx; /* 左下角收尖，气泡在机器人上方 */
	}
	.pretty-tail {
		position: absolute;
		bottom: -8rpx;
		left: 36rpx;
		width: 18rpx; height: 18rpx;
		background: #ffffff;
		border-right: 1rpx solid #e0f0ff;
		border-bottom: 1rpx solid #e0f0ff;
		transform: rotate(45deg);
		box-shadow: 2rpx 2rpx 6rpx rgba(25,118,210,0.06);
	}
	.pretty-tail-2 {
		bottom: -14rpx;
		left: 22rpx;
		width: 12rpx; height: 12rpx;
		opacity: 0.8;
	}

	/* 气泡在机器人下方时的样式 */
	.assistant-bubble.bubble-below {
		border-radius: 10rpx 26rpx 26rpx 26rpx; /* 左上角收尖，气泡在机器人下方 */
	}
	.assistant-bubble.bubble-below .pretty-tail {
		top: -8rpx;
		bottom: auto;
		left: 36rpx;
		width: 18rpx; height: 18rpx;
		background: #ffffff;
		border-right: 1rpx solid #e0f0ff;
		border-top: 1rpx solid #e0f0ff;
		border-bottom: none;
		transform: rotate(-45deg);
		box-shadow: 2rpx -2rpx 6rpx rgba(25,118,210,0.06);
	}
	.assistant-bubble.bubble-below .pretty-tail-2 {
		top: -14rpx;
		bottom: auto;
		left: 22rpx;
		width: 12rpx; height: 12rpx;
		opacity: 0.8;
	}

	.bubble-text {
		display: block;
		z-index: 1;
	}

	.quick-action {
		color: #1976D2;
		font-weight: 600;
		font-size: 28rpx;
		line-height: 1.6;
	}
</style>

