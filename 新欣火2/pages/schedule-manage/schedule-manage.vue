<template>
	<view class="page-container">
		<!-- 用户选择 (仅管理员/超管可见) - 全新美化版 -->
		<view class="form-item" v-if="!isTeacher">
			<picker @change="onUserChange" :value="userIndex" :range="filteredUserList" range-key="displayName">
				<view class="picker">
					<text>{{ filteredUserList.length > 0 ? filteredUserList[userIndex].displayName : '无匹配用户' }}</text>
					<text class="picker-arrow">▼</text>
				</view>
			</picker>
			<!-- 新增搜索框 -->
			<input class="search-input" v-model.trim="searchKeyword" placeholder="🔍 搜索教师姓名" />
		</view>

		<!-- 全新日期选择器 -->
		<view class="date-selector">
			<view class="nav-arrow" @click="changeDay(-1)">
				<text>‹</text>
			</view>
			<view class="date-display-wrapper" @click="toggleMultiDateMode">
				<text class="date-text">{{ isMultiDateMode ? `已选择${selectedDates.length}个日期` : dayDisplay }}</text>
				<text class="multi-date-hint">{{ isMultiDateMode ? '点击切换' : '点击多选' }}</text>
			</view>
			<view class="nav-arrow" @click="changeDay(1)">
				<text>›</text>
			</view>
		</view>
		
		<!-- 多选日期模式 -->
		<view v-if="isMultiDateMode" class="multi-date-selector">
			<view class="multi-date-header">
				<text class="multi-date-title">选择要排课的日期：</text>
				<view class="multi-date-actions">
					<view class="action-btn" @click="selectAllWeekdays">选择工作日</view>
					<view class="action-btn" @click="clearSelectedDates">清空选择</view>
				</view>
			</view>
			<!-- 周导航 -->
			<view class="week-navigation">
				<view class="week-nav-btn" @click="changeWeek(-1)">
					<text class="week-nav-icon">‹</text>
					<text class="week-nav-text">上一周</text>
				</view>
				<view class="week-display" @click="showWeekPicker">
					<text class="week-text">{{ getCurrentWeekRange() }}</text>
					<text class="week-picker-hint">点击选择周</text>
				</view>
				<view class="week-nav-btn" @click="changeWeek(1)">
					<text class="week-nav-text">下一周</text>
					<text class="week-nav-icon">›</text>
				</view>
			</view>
			<!-- 可滑动的日期选择器 -->
			<scroll-view scroll-x class="date-scroll-container" :scroll-left="scrollLeft" @scroll="onDateScroll">
				<view class="date-scroll-content">
					<view 
						v-for="(date, index) in getAllAvailableDates()" 
						:key="index"
						class="date-item"
						:class="{ 
							'selected': isDateSelected(date),
							'month-start': isMonthStart(date),
							'different-month': isDifferentMonth(date, index)
						}"
						@click="toggleDateSelection(date)"
					>
						<text class="date-text">{{ formatDate(date, 'MM-dd') }}</text>
						<text class="weekday-text">{{ getWeekdayName(date) }}</text>
						<text v-if="isMonthStart(date)" class="month-label">{{ formatDate(date, 'MM月') }}</text>
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 周选择器弹窗 -->
		<view v-if="showWeekPickerModal" class="week-picker-modal" @click="hideWeekPicker">
			<view class="week-picker-content" @click.stop>
				<view class="week-picker-header">
					<text class="week-picker-title">选择周</text>
					<view class="close-btn" @click="hideWeekPicker">
						<text class="close-icon">×</text>
					</view>
				</view>
				<scroll-view scroll-y class="week-picker-list">
					<view 
						v-for="(week, index) in getWeekOptions()" 
						:key="index"
						class="week-option"
						:class="{ 'selected': week.weekOffset === weekOffset }"
						@click="selectWeek(week.weekOffset)"
					>
						<text class="week-option-text">{{ week.label }}</text>
						<text v-if="week.weekOffset === weekOffset" class="check-icon">✓</text>
					</view>
				</scroll-view>
			</view>
		</view>

		<!-- 课表内容区域 -->
		<scroll-view scroll-y class="schedule-scroll-view">
			<view v-if="isLoading" class="loading-container">
				<view class="loading-text">课表加载中...</view>
			</view>
			<view v-else-if="!daySchedule" class="empty-state">
				<view class="empty-text">
					今天没有课程安排
					<view class="date-in-empty">{{ dayDisplay }}</view>
				</view>
			</view>
			<view v-else class="week-schedule-container">
				<view class="day-card">
					<view class="schedule-grid">
						<!-- 使用固定数组，确保从1开始 -->
						<view v-for="slot in visibleSlots" :key="slot" class="schedule-row">
							<!-- 课程标签和时间 -->
							<view class="lesson-header">
								<view class="session-label">第{{ slot }}节课</view>
								<view class="time-label">{{ getTimeLabel(slot - 1) }}</view>
							</view>
							<!-- 输入框区域 -->
							<view class="course-cell">
								<view class="course-row">
									<input class="course-input" type="text" v-model="daySchedule.courses[slot - 1]" placeholder="课程名称" :disabled="false" :readonly="false" @focus="onInputFocus" @input="onInputChange" />
									<picker class="type-picker" @change="onTypeChange(slot - 1, $event)" :value="getTypeIndex(slot - 1)" :range="courseTypes">
										<view class="type-display">
											<text>{{ getTypeDisplay(slot - 1) }}</text>
											<text class="type-arrow">▼</text>
										</view>
									</picker>
									<input class="location-input" type="text" v-model="daySchedule.locations[slot - 1]" placeholder="地点" :disabled="false" :readonly="false" @focus="onInputFocus" @input="onInputChange" />
									<input class="class-input" type="text" v-model="daySchedule.classes[slot - 1]" placeholder="班级" :disabled="false" :readonly="false" @focus="onInputFocus" @input="onInputChange" />
								</view>
								<input class="remark-input" type="text" v-model="daySchedule.remarks[slot - 1]" placeholder="备注（可选）" :disabled="false" :readonly="false" @focus="onInputFocus" @input="onInputChange" />
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>

		<!-- 底部操作区 (固定在底部，不随页面滚动) -->
		<view class="bottom-actions-fixed">
			<view class="day-navigator">
				<view class="nav-btn save-btn" @click="saveSchedule">💾 保存排课</view>
				<view class="nav-btn return-btn" @click="goBack">返回首页</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { getCourseColor } from '../../utils/courseColor.js';

	export default {
		data() {
			return {
				allUserList: [], // 存储所有用户的原始列表
				userIndex: 0,
				isTeacher: false,
				currentUser: null,
				currentDate: new Date(),
				selectedDates: [], // 多选日期数组
				isMultiDateMode: false, // 是否开启多选模式
				daySchedule: {
					courses: ['', '', '', '', '', ''],
					types: ['无', '无', '无', '无', '无', '无'],
					locations: ['', '', '', '', '', ''],
					classes: ['', '', '', '', '', ''],
					remarks: ['', '', '', '', '', ''] // 新增备注字段
				},
				isLoading: true,
				searchKeyword: '', // 搜索关键词
				courseTypes: ['无', '一对一', '班课', '脱产生'],
				remark: '', // 新增remark字段，防止页面报错
				visibleSlots: [1,2,3,4,5,6],
				// 多选日期相关
				weekOffset: 0, // 周偏移量，0表示当前周，1表示下一周，-1表示上一周
				scrollLeft: 0, // 滚动位置
				showWeekPickerModal: false // 周选择器弹窗显示状态
			};
		},
		computed: {
			dayDisplay() {
				const date = this.currentDate;
				const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
				const isToday = this.formatDate(new Date(), 'yyyy-MM-dd') === this.formatDate(date, 'yyyy-MM-dd');
				return `${this.formatDate(date, 'yyyy-MM-dd')} ${dayNames[date.getDay()]} ${isToday ? '(今天)' : ''}`;
			},
			// 根据搜索关键词过滤用户列表
		filteredUserList() {
			let list;
			if (!this.searchKeyword) {
				list = this.allUserList;
			} else {
				list = this.allUserList.filter(user =>
					user.teacherName && user.teacherName.toLowerCase().includes(this.searchKeyword.toLowerCase())
				);
			}
			// 为每个用户添加 displayName 属性
			const result = list.map(user => ({
				...user,
				displayName: user.teacherName || user.username || user.nickname || '未知用户'
			}));
			console.log('🔍 filteredUserList 处理结果:', result.length, '个用户');
			if (result.length > 0) {
				console.log('🔍 第一个用户:', result[0]);
				console.log('🔍 当前 userIndex:', this.userIndex);
				if (this.userIndex < result.length) {
					console.log('🔍 当前选中用户:', result[this.userIndex]);
				}
			}
			return result;
		}
		},
		watch: {
			// 监听搜索关键词的变化
			searchKeyword() {
				// 当筛选条件变化，重置选择器到第一项
				this.userIndex = 0;
				this.$nextTick(() => {
					this.updateCurrentUserAndFetchSchedule();
				});
			}
		},
		onLoad() {
			// 读取路由参数（通过气泡入口可能会传入指定教师与日期）
			const pages = getCurrentPages();
			const current = pages[pages.length - 1] || {};
			const options = current.options || {};
			const { uid, username, date } = options;
			// 若传入了日期，优先设置日期
			if (date) {
				try {
					this.currentDate = new Date(date);
				} catch (e) {}
			}
			if (uid) {
				// 从外部指定了教师，走管理员视角，按uid在用户列表中定位
				this.isTeacher = false;
				this._pendingUid = uid;
				this._pendingUsername = username || '';
				this.fetchUsers();
				return;
			}
			// 正常逻辑：教师自己进入
			const userInfo = uni.getStorageSync('userInfo');
			if (userInfo && userInfo.role && userInfo.role.includes('教师')) {
				this.isTeacher = true;
				this.currentUser = userInfo;
				this.fetchDaySchedule();
			} else {
				this.fetchUsers();
			}
		},
		onReady() {
			// 确保数据响应性
			this.$forceUpdate();
		},
		methods: {
			fetchUsers() {
				console.log('🔍 开始获取用户列表...');
				uniCloud.callFunction({
					name: 'user-center',
					data: { action: 'get-accounts' },
					success: (res) => {
						console.log('📡 用户列表返回结果:', res);
						const result = res.result;
						if (result.code === 200 && result.data.length > 0) {
							console.log('✅ 获取用户列表成功，用户数量:', result.data.length);
							this.allUserList = result.data; // 存入原始列表
							console.log('用户列表:', this.allUserList);
							// 如果有待定位的uid（来源于气泡跳转），在这里定位用户
							if (this._pendingUid) {
								const idx = this.allUserList.findIndex(u => u._id === this._pendingUid);
								if (idx !== -1) {
									this.currentUser = this.allUserList[idx];
									console.log('🎯 通过uid定位到用户:', this.currentUser);
									// 找到该用户在过滤后列表中的索引
									const filteredIdx = this.filteredUserList.findIndex(u => u._id === this._pendingUid);
									if (filteredIdx !== -1) {
										this.userIndex = filteredIdx;
										console.log('🎯 在过滤列表中用户索引已设置为:', this.userIndex);
									} else {
										console.warn('⚠️ 用户在过滤列表中未找到，可能被搜索关键词过滤');
									}
									this._pendingUid = '';
									this._pendingUsername = '';
									this.fetchDaySchedule();
									return;
								}
								// 兜底：尝试用用户名匹配
								if (this._pendingUsername) {
									const byName = this.allUserList.findIndex(u => u.username === this._pendingUsername || u.teacherName === this._pendingUsername || u.nickname === this._pendingUsername);
									if (byName !== -1) {
										this.currentUser = this.allUserList[byName];
										console.log('🎯 通过用户名定位到用户:', this.currentUser);
										// 找到该用户在过滤后列表中的索引
										const filteredIdx = this.filteredUserList.findIndex(u => u._id === this.allUserList[byName]._id);
										if (filteredIdx !== -1) {
											this.userIndex = filteredIdx;
											console.log('🎯 在过滤列表中用户索引已设置为:', this.userIndex);
										} else {
											console.warn('⚠️ 用户在过滤列表中未找到，可能被搜索关键词过滤');
										}
										this._pendingUid = '';
										this._pendingUsername = '';
										this.fetchDaySchedule();
										return;
									}
								}
							}
							// 如果没有待定位的uid，使用默认逻辑
							this.$nextTick(() => {
								this.updateCurrentUserAndFetchSchedule();
								// 强制触发响应式更新
								this.$forceUpdate();
							});
						} else {
							console.error('❌ 获取用户列表失败:', result.message || '未知错误');
							this.allUserList = [];
							this.isLoading = false;
						}
					},
					fail: (err) => {
						console.error('❌ 获取用户列表请求失败:', err);
						this.isLoading = false;
						uni.showToast({ title: '获取用户列表失败: ' + (err.message || '网络错误'), icon: 'none' });
					}
				});
			},
			fetchDaySchedule() {
				if (!this.currentUser) {
					console.log('❌ 当前用户为空，无法获取课表');
					return;
				}
				this.isLoading = true;

				const date = this.formatDate(this.currentDate, 'yyyy-MM-dd');
				
				// 添加调试日志
				console.log('🔍 开始获取课表数据:');
				console.log('当前用户:', this.currentUser);
				console.log('查询日期:', date);
				console.log('用户ID:', this.currentUser._id);
				console.log('用户名:', this.currentUser.username);

				uniCloud.callFunction({
					name: 'schedule-center',
					data: {
						action: 'get-schedules',
						params: {
							username: this.currentUser.username,
							uid: this.currentUser._id,
							date: date
						}
					},
					success: (res) => {
						console.log('📡 云函数返回结果:', res);
						const result = res.result;
						if (result.code === 200) {
							console.log('✅ 查询成功，返回数据:', result.data);
							if (result.data) {
								// 安全校验：如果接口返回的 uid/username 与当前用户不一致，提示并不覆盖本页数据
								if ((result.data.uid && this.currentUser && result.data.uid !== this.currentUser._id) ||
									(result.data.username && this.currentUser && result.data.username !== this.currentUser.username)) {
									console.warn('⚠️ 返回数据的用户与当前选择不一致，已忽略', {
										currentUser: this.currentUser,
										resultUser: { uid: result.data.uid, username: result.data.username }
									});
									uni.showToast({ title: '系统返回了其他教师的数据，已忽略', icon: 'none' });
									return;
								}
								// 使用 $set 确保响应性
								this.$set(this, 'daySchedule', {
									courses: [
										result.data.course_slot_1 || '',
										result.data.course_slot_2 || '',
										result.data.course_slot_3 || '',
										result.data.course_slot_4 || '',
										result.data.course_slot_5 || '',
										result.data.course_slot_6 || '',
									],
									types: [
										result.data.course_slot_1_type || '无',
										result.data.course_slot_2_type || '无',
										result.data.course_slot_3_type || '无',
										result.data.course_slot_4_type || '无',
										result.data.course_slot_5_type || '无',
										result.data.course_slot_6_type || '无',
									],
									locations: [
										result.data.course_slot_1_location || '',
										result.data.course_slot_2_location || '',
										result.data.course_slot_3_location || '',
										result.data.course_slot_4_location || '',
										result.data.course_slot_5_location || '',
										result.data.course_slot_6_location || '',
									],
									classes: [
										result.data.course_slot_1_class || '',
										result.data.course_slot_2_class || '',
										result.data.course_slot_3_class || '',
										result.data.course_slot_4_class || '',
										result.data.course_slot_5_class || '',
										result.data.course_slot_6_class || '',
									],
									remarks: [
										result.data.course_slot_1_remark || '',
										result.data.course_slot_2_remark || '',
										result.data.course_slot_3_remark || '',
										result.data.course_slot_4_remark || '',
										result.data.course_slot_5_remark || '',
										result.data.course_slot_6_remark || '',
									]
								});
								console.log('✅ 课表数据已更新:', this.daySchedule);
							} else {
								console.log('⚠️ 查询结果为空，设置默认空数据');
								this.$set(this, 'daySchedule', {
									courses: ['', '', '', '', '', ''],
									types: ['无', '无', '无', '无', '无', '无'],
									locations: ['', '', '', '', '', ''],
									classes: ['', '', '', '', '', ''],
									remarks: ['', '', '', '', '', '']
								});
							}
						} else {
							console.error('❌ 查询失败:', result.message);
							uni.showToast({ title: '查询失败: ' + (result.message || '未知错误'), icon: 'none' });
						}
					},
					fail: (err) => {
						console.error('❌ 请求失败:', err);
						uni.showToast({ title: '查询请求失败: ' + (err.message || '网络错误'), icon: 'none' });
					},
					complete: () => {
						this.isLoading = false;
						console.log('🏁 课表获取完成');
					}
				});
			},
			onTypeChange(slotIndex, event) {
				const typeIndex = event.detail.value;
				this.$set(this.daySchedule.types, slotIndex, this.courseTypes[typeIndex]);
			},
			getTypeIndex(slotIndex) {
				return this.courseTypes.indexOf(this.daySchedule.types[slotIndex]);
			},
			getTypeDisplay(slotIndex) {
				return this.daySchedule.types[slotIndex] || '无';
			},
			saveSchedule() {
				// 优先用 currentUser，没有就用本地缓存
				let userInfo = this.currentUser;
				if (!userInfo || !userInfo._id) {
					userInfo = uni.getStorageSync('userInfo') || {};
				}
				if (!userInfo._id) {
					uni.showToast({ title: '用户信息缺失，请重新登录', icon: 'none' });
					return;
				}

				// 确定要保存的日期
				const datesToSave = this.isMultiDateMode ? this.selectedDates : [this.currentDate];
				
				if (this.isMultiDateMode && this.selectedDates.length === 0) {
					uni.showToast({ title: '请选择要排课的日期', icon: 'none' });
					return;
				}
				
				console.log('💾 开始保存排课数据，日期数量:', datesToSave.length);
				
				// 显示保存进度
				uni.showLoading({ title: `正在保存${datesToSave.length}个日期的排课...` });
				
				// 批量保存
				const savePromises = datesToSave.map(date => {
					const dateStr = this.formatDate(date, 'yyyy-MM-dd');
					console.log('📅 保存日期:', dateStr);
					// 构建课程数据，每节课独立保存
					const scheduleData = {
						username: userInfo.username,
						uid: userInfo._id, // 保证uid一定有值
						date: dateStr
					};
					
					// 验证必要参数
					if (!userInfo.username || !userInfo._id || !dateStr) {
						console.error('❌ 缺少必要参数:', {
							username: userInfo.username,
							uid: userInfo._id,
							date: dateStr
						});
						throw new Error('缺少必要参数');
					}

					// 为6节课设置数据，每节课独立
					for (let i = 0; i < 6; i++) {
						const courseSlot = i + 1; // 第1-6节课
						
						scheduleData[`course_slot_${courseSlot}`] = this.daySchedule.courses[i] || '';
						scheduleData[`course_slot_${courseSlot}_type`] = this.daySchedule.types[i] || '';
						scheduleData[`course_slot_${courseSlot}_location`] = this.daySchedule.locations[i] || '';
						scheduleData[`course_slot_${courseSlot}_class`] = this.daySchedule.classes[i] || '';
						scheduleData[`course_slot_${courseSlot}_remark`] = this.daySchedule.remarks[i] || ''; // 保存备注
					}

					// 为第7-8节课设置空数据（保持兼容）
					for (let i = 6; i < 8; i++) {
						const courseSlot = i + 1;
						scheduleData[`course_slot_${courseSlot}`] = '';
						scheduleData[`course_slot_${courseSlot}_type`] = '无';
						scheduleData[`course_slot_${courseSlot}_location`] = '';
						scheduleData[`course_slot_${courseSlot}_class`] = '';
						scheduleData[`course_slot_${courseSlot}_remark`] = ''; // 空备注
					}

					const adminInfo = uni.getStorageSync('userInfo') || {};
					const adminName = adminInfo.realName || adminInfo.username || '';
					const remark = this.remark || '';

					// 取第1节课的课程名称、班级、教室、类型作为消息主内容（如有多节课可自行扩展）
					const courseName = this.daySchedule.courses[0] || '';
					const className = this.daySchedule.classes[0] || '';
					const classroom = this.daySchedule.locations[0] || '';
					const courseType = this.daySchedule.types[0] || '';
					const scheduleTime = `${dateStr} 08:00-10:00`; // 如有时间选择器可动态生成

					console.log('排课参数', {
						...scheduleData,
						adminName,
						remark,
						courseName,
						className,
						classroom,
						courseType,
						scheduleTime
					});

					return uniCloud.callFunction({
						name: 'schedule-center',
						data: {
							action: 'set-schedule',
							params: {
								...scheduleData,
								adminId: userInfo._id, // 发起人id
								adminName,
								remark,
								courseName,
								className,
								classroom,
								courseType,
								scheduleTime
							}
						}
					}).then(result => {
						console.log('📡 云函数返回结果:', result);
						if (result.result && result.result.code !== 200) {
							console.error('❌ 云函数返回错误:', {
								code: result.result.code,
								message: result.result.message,
								error: result.result.error
							});
						}
						return result;
					}).catch(error => {
						console.error('❌ 云函数调用失败:', error);
						return {
							result: {
								code: 500,
								message: '云函数调用失败: ' + error.message
							}
						};
					});
				});
				
				Promise.all(savePromises).then(results => {
					uni.hideLoading();
					console.log('📡 批量保存结果:', results);
					
					// 详细分析每个结果
					results.forEach((result, index) => {
						console.log(`📊 第${index + 1}个日期的保存结果:`, {
							success: result.success,
							errCode: result.errCode,
							result: result.result
						});
						
						if (result.result && result.result.code !== 200) {
							console.error(`❌ 第${index + 1}个日期保存失败:`, {
								code: result.result.code,
								message: result.result.message,
								error: result.result.error
							});
						}
					});
					
					const successCount = results.filter(res => res.result && res.result.code === 200).length;
					const totalCount = results.length;
					
					if (successCount === totalCount) {
						uni.showToast({ 
							title: `成功保存${successCount}个日期的排课`, 
							icon: 'success',
							duration: 2000
						});
					} else {
						const failedCount = totalCount - successCount;
						uni.showToast({ 
							title: `保存完成：${successCount}/${totalCount}个日期成功，${failedCount}个失败`, 
							icon: 'none',
							duration: 3000
						});
					}
				}).catch(err => {
					uni.hideLoading();
					console.error('❌ 批量保存失败:', err);
					uni.showToast({ title: '保存失败，请重试', icon: 'none' });
				});
			},
			changeDay(direction) {
				this.currentDate.setDate(this.currentDate.getDate() + direction);
				this.currentDate = new Date(this.currentDate);
				this.fetchDaySchedule();
			},
			onUserChange(e) {
				this.userIndex = e.detail.value;
				this.updateCurrentUserAndFetchSchedule();
			},
			// 切换多选日期模式
			toggleMultiDateMode() {
				this.isMultiDateMode = !this.isMultiDateMode;
				if (this.isMultiDateMode && this.selectedDates.length === 0) {
					// 进入多选模式时，默认选择当前日期
					this.selectedDates = [new Date(this.currentDate)];
				}
			},
			
			// 获取一周的日期
			getWeekDates() {
				const dates = [];
				const today = new Date(this.currentDate);
				const startOfWeek = new Date(today);
				startOfWeek.setDate(today.getDate() - today.getDay()); // 从周日开始
				
				for (let i = 0; i < 7; i++) {
					const date = new Date(startOfWeek);
					date.setDate(startOfWeek.getDate() + i);
					dates.push(date);
				}
				return dates;
			},
			
			// 获取所有可用的日期（4个月）
			getAllAvailableDates() {
				const dates = [];
				const today = new Date();
				const startDate = new Date(today);
				startDate.setDate(today.getDate() - today.getDay()); // 从当前周的周日开始
				
				// 生成4个月的日期（当前周 + 后4个月）
				const totalWeeks = 4 * 4 + 2; // 4个月约等于18周，加上当前周
				for (let week = 0; week < totalWeeks; week++) {
					for (let day = 0; day < 7; day++) {
						const date = new Date(startDate);
						date.setDate(startDate.getDate() + week * 7 + day);
						dates.push(date);
					}
				}
				return dates;
			},
			
			// 获取当前周范围
			getCurrentWeekRange() {
				const today = new Date();
				const startOfWeek = new Date(today);
				startOfWeek.setDate(today.getDate() - today.getDay());
				const endOfWeek = new Date(startOfWeek);
				endOfWeek.setDate(startOfWeek.getDate() + 6);
				
				// 如果跨月，显示月份信息
				if (startOfWeek.getMonth() !== endOfWeek.getMonth()) {
					return `${this.formatDate(startOfWeek, 'MM月dd日')} ~ ${this.formatDate(endOfWeek, 'MM月dd日')}`;
				} else {
					return `${this.formatDate(startOfWeek, 'MM-dd')} ~ ${this.formatDate(endOfWeek, 'MM-dd')}`;
				}
			},
			
			// 检查日期是否被选中
			isDateSelected(date) {
				// 确保传入的date是Date对象
				const targetDate = date instanceof Date ? date : new Date(date);
				return this.selectedDates.some(selectedDate => {
					// 确保selectedDate也是Date对象
					const compareDate = selectedDate instanceof Date ? selectedDate : new Date(selectedDate);
					return this.formatDate(compareDate, 'yyyy-MM-dd') === this.formatDate(targetDate, 'yyyy-MM-dd');
				});
			},
			
			// 切换日期选择状态
			toggleDateSelection(date) {
				// 确保传入的date是Date对象
				const targetDate = date instanceof Date ? date : new Date(date);
				const dateStr = this.formatDate(targetDate, 'yyyy-MM-dd');
				
				const index = this.selectedDates.findIndex(selectedDate => {
					// 确保selectedDate也是Date对象
					const compareDate = selectedDate instanceof Date ? selectedDate : new Date(selectedDate);
					return this.formatDate(compareDate, 'yyyy-MM-dd') === dateStr;
				});
				
				if (index > -1) {
					this.selectedDates.splice(index, 1);
				} else {
					this.selectedDates.push(new Date(targetDate));
				}
			},
			
			// 选择所有工作日
			selectAllWeekdays() {
				this.selectedDates = [];
				const weekDates = this.getWeekDates();
				weekDates.forEach(date => {
					const day = date.getDay();
					if (day >= 1 && day <= 5) { // 周一到周五
						this.selectedDates.push(new Date(date));
					}
				});
			},
			
			// 清空选择的日期
			clearSelectedDates() {
				this.selectedDates = [];
			},
			
			// 切换周
			changeWeek(direction) {
				this.weekOffset += direction;
				// 限制周偏移量在合理范围内
				this.weekOffset = Math.max(0, Math.min(this.weekOffset, 18)); // 最多18周（4个月）
				// 自动滚动到当前周的位置
				this.$nextTick(() => {
					this.scrollToCurrentWeek();
				});
			},
			
			// 滚动到当前周
			scrollToCurrentWeek() {
				// 计算当前周在滚动容器中的位置
				const itemWidth = 80; // 每个日期项的宽度（rpx转换为px）
				this.scrollLeft = this.weekOffset * 7 * itemWidth;
			},
			
			// 处理日期滚动事件
			onDateScroll(e) {
				// 可以根据滚动位置更新当前周
				const scrollLeft = e.detail.scrollLeft;
				const itemWidth = 80;
				const weekIndex = Math.round(scrollLeft / (7 * itemWidth));
				this.weekOffset = Math.max(0, Math.min(weekIndex, 18)); // 限制在0-18周范围内
			},
			
			// 获取星期名称
			getWeekdayName(date) {
				const dayNames = ['日', '一', '二', '三', '四', '五', '六'];
				return dayNames[date.getDay()];
			},
			
			// 判断是否是月份开始
			isMonthStart(date) {
				return date.getDate() === 1;
			},
			
			// 判断是否与前一天是不同月份
			isDifferentMonth(date, index) {
				if (index === 0) return false;
				const prevDate = this.getAllAvailableDates()[index - 1];
				return date.getMonth() !== prevDate.getMonth();
			},
			
			// 显示周选择器
			showWeekPicker() {
				this.showWeekPickerModal = true;
			},
			
			// 隐藏周选择器
			hideWeekPicker() {
				this.showWeekPickerModal = false;
			},
			
			// 获取周选项列表
			getWeekOptions() {
				const options = [];
				const today = new Date();
				const startDate = new Date(today);
				startDate.setDate(today.getDate() - today.getDay()); // 从当前周的周日开始
				
				for (let week = 0; week < 18; week++) {
					const weekStart = new Date(startDate);
					weekStart.setDate(startDate.getDate() + week * 7);
					const weekEnd = new Date(weekStart);
					weekEnd.setDate(weekStart.getDate() + 6);
					
					let label = '';
					if (week === 0) {
						label = `本周 (${this.formatDate(weekStart, 'MM-dd')} ~ ${this.formatDate(weekEnd, 'MM-dd')})`;
					} else if (week === 1) {
						label = `下周 (${this.formatDate(weekStart, 'MM-dd')} ~ ${this.formatDate(weekEnd, 'MM-dd')})`;
					} else {
						label = `第${week + 1}周 (${this.formatDate(weekStart, 'MM-dd')} ~ ${this.formatDate(weekEnd, 'MM-dd')})`;
					}
					
					options.push({
						weekOffset: week,
						label: label
					});
				}
				return options;
			},
			
			// 选择周
			selectWeek(weekOffset) {
				this.weekOffset = weekOffset;
				this.hideWeekPicker();
				this.$nextTick(() => {
					this.scrollToCurrentWeek();
				});
			},
			
			// 新增一个统一更新当前用户并获取课表的方法
			updateCurrentUserAndFetchSchedule() {
				console.log('🔄 更新当前用户并获取课表...');
				console.log('当前搜索关键词:', this.searchKeyword);
				console.log('原始用户列表长度:', this.allUserList.length);
				console.log('过滤后用户列表长度:', this.filteredUserList.length);
				console.log('当前用户索引:', this.userIndex);
				
				if (this.filteredUserList.length > 0) {
					// 确保 userIndex 在有效范围内
					if (this.userIndex >= this.filteredUserList.length) {
						this.userIndex = 0;
						console.log('⚠️ 用户索引超出范围，重置为0');
					}
					this.currentUser = this.filteredUserList[this.userIndex];
					console.log('✅ 当前用户已更新:', this.currentUser);
					console.log('用户索引:', this.userIndex);
					console.log('✅ 当前用户 displayName:', this.currentUser.displayName);
					this.fetchDaySchedule();
				} else {
					console.warn('⚠️ 过滤后用户列表为空，设置默认状态');
					this.currentUser = null;
					this.$set(this, 'daySchedule', {
						courses: ['', '', '', '', '', ''],
						types: ['无', '无', '无', '无', '无', '无'],
						locations: ['', '', '', '', '', ''],
						classes: ['', '', '', '', '', ''],
						remarks: ['', '', '', '', '', '']
					});
					this.isLoading = false;
				}
			},
			formatDate(date, fmt) {
				// 确保date是Date对象
				if (!(date instanceof Date)) {
					date = new Date(date);
				}
				
				// 检查date是否有效
				if (isNaN(date.getTime())) {
					console.error('Invalid date:', date);
					return '';
				}
				
				const o = {
					'M+': date.getMonth() + 1,
					'd+': date.getDate(),
				};
				if (/(y+)/.test(fmt)) {
					fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
				}
				for (let k in o) {
					if (new RegExp('(' + k + ')').test(fmt)) {
						fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
					}
				}
				return fmt;
			},
			goBack() {
				uni.navigateBack();
			},
			returnToToday() {
				this.currentDate = new Date();
				this.fetchDaySchedule();
			},
			getTimeLabel(index) {
				const times = [
					'8:00-10:00',  // 第1节课
					'10:10-12:10', // 第2节课
					'14:00-16:00', // 第3节课
					'16:10-18:10', // 第4节课
					'18:00-20:00', // 第5节课
					'20:00-22:00', // 第6节课
				];
				return times[index];
			},
			getCourseColor(type, className) {
				return getCourseColor(type, className);
			},
			onCourseChange(event, slotIndex, field) {
				const value = event.detail.value;
				console.log('课程信息变化:', { slotIndex, field, value });
				
				switch (field) {
					case 'course':
						this.$set(this.daySchedule.courses, slotIndex, value);
						break;
					case 'location':
						this.$set(this.daySchedule.locations, slotIndex, value);
						break;
					case 'class':
						this.$set(this.daySchedule.classes, slotIndex, value);
						break;
					case 'remark':
						this.$set(this.daySchedule.remarks, slotIndex, value);
						break;
				}
			},
			onInputFocus(event) {
				console.log('输入框获得焦点:', event);
			},
			onInputChange(event) {
				console.log('输入框内容变化:', event);
			}
		}
	};
</script>

<style>
	.page-container {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		background: #f0f2f5;
		padding-bottom: 120rpx; /* 为固定按钮留出空间 */
		padding-top: 60rpx; /* 为顶部内容留出空间，避免太靠上 */
	}

	.schedule-redesign-page {
		display: flex;
		flex-direction: column;
		height: 100vh;
		background: #f0f2f5;
		padding-top: calc(env(safe-area-inset-top) + 150rpx);
	}

	.form-item {
		/* 移除背景和边框，使其融入页面 */
		background: transparent;
		border-bottom: none;
		padding: 10rpx 40rpx; /* 减小上下边距 */
		flex-shrink: 0;
	}

	.search-input {
		width: 100%;
		height: 70rpx;
		background-color: #fff;
		border-radius: 35rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		margin-top: 25rpx;
		font-size: 28rpx;
		box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.05);
	}

	.picker {
		/* 全新胶囊按钮样式 */
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 80rpx;
		/* 使用主题色作为背景，使其更醒目 */
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		border-radius: 50rpx; /* 大圆角 */
		/* 调整阴影以匹配新的背景色 */
		box-shadow: 0 8rpx 25rpx rgba(102, 126, 234, 0.3); 
		font-size: 30rpx;
		/* 文字颜色改为白色 */
		color: #ffffff;
		font-weight: 500;
		border: none;
	}

	.picker-arrow {
		font-size: 24rpx;
		/* 箭头颜色也改为白色 */
		color: #ffffff;
		margin-left: 15rpx;
		transform: scaleY(0.8);
		opacity: 0.8; /* 稍微降低透明度，与文字区分 */
	}

	.schedule-scroll-view {
		flex: 1;
		min-height: 0; /* 关键：确保 flex 生效，让 scroll-view 占据剩余空间 */
		overflow-y: auto;
		padding: 20rpx;
	}

	.loading-container,
	.empty-state {
		display: flex;
		flex-direction: column; /* 允许日期显示在文字下方 */
		justify-content: center;
		align-items: center;
		color: #999;
		font-size: 32rpx;
		padding: 150rpx 0; /* 增加上下内边距，替代 height:100% */
	}

	.week-schedule-container {
		padding: 25rpx;
	}

	.day-card {
		background: #ffffff;
		border-radius: 25rpx;
		box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.07); /* 更柔和的阴影 */
		overflow: hidden;
	}

	.schedule-grid {
		display: flex;
		flex-direction: column;
	}

	.schedule-row {
		display: flex;
		flex-direction: column;
		width: 100%;
		min-height: 120rpx;
		border-bottom: 1rpx solid #f0f2f5;
		padding: 20rpx;
	}
	.schedule-row:last-child {
		border-bottom: none;
	}

	.lesson-header {
		display: flex;
		align-items: center;
		margin-bottom: 15rpx;
	}

	.session-label {
		background-color: #eaf8ff;
		color: #007aff;
		padding: 8rpx 15rpx;
		border-radius: 8rpx;
		font-size: 28rpx;
		font-weight: 500;
		margin-right: 15rpx;
	}

	.time-label {
		background-color: #fff9e6;
		color: #d68900;
		padding: 8rpx 15rpx;
		border-radius: 8rpx;
		font-size: 24rpx;
		font-weight: 500;
	}

	.course-cell {
		background-color: #ffffff;
		display: flex;
		flex-direction: column;
		gap: 10rpx;
	}

	.course-row {
		display: flex;
		align-items: center;
		gap: 15rpx;
	}

	.course-input {
		flex: 1;
		height: 60rpx;
		border: 1rpx solid #e0e0e0;
		border-radius: 8rpx;
		padding: 0 15rpx;
		font-size: 28rpx;
		background-color: #ffffff;
		position: relative;
		z-index: 10;
		cursor: text;
		pointer-events: auto;
		user-select: text;
		-webkit-user-select: text;
	}

	.location-input {
		width: 120rpx;
		height: 60rpx;
		border: 1rpx solid #e0e0e0;
		border-radius: 8rpx;
		padding: 0 10rpx;
		font-size: 24rpx;
		background-color: #ffffff;
		flex-shrink: 0;
		position: relative;
		z-index: 10;
		cursor: text;
		pointer-events: auto;
		user-select: text;
		-webkit-user-select: text;
	}

	.class-input {
		width: 120rpx;
		height: 60rpx;
		border: 1rpx solid #e0e0e0;
		border-radius: 8rpx;
		padding: 0 10rpx;
		font-size: 24rpx;
		background-color: #ffffff;
		flex-shrink: 0;
		position: relative;
		z-index: 10;
		cursor: text;
		pointer-events: auto;
		user-select: text;
		-webkit-user-select: text;
	}

	.remark-input {
		width: 100%;
		height: 60rpx;
		border: 1rpx solid #e0e0e0;
		border-radius: 8rpx;
		padding: 0 15rpx;
		font-size: 24rpx;
		background-color: #ffffff;
		position: relative;
		z-index: 10;
		cursor: text;
		pointer-events: auto;
		user-select: text;
		-webkit-user-select: text;
	}

	.type-picker {
		width: 120rpx;
		flex-shrink: 0;
	}

	.type-display {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 60rpx;
		background-color: #f0f8ff;
		border: 1rpx solid #b3d9ff;
		border-radius: 8rpx;
		font-size: 24rpx;
		color: #0066cc;
		padding: 0 10rpx;
	}

	.type-arrow {
		font-size: 20rpx;
		margin-left: 5rpx;
		color: #0066cc;
	}

	.break-row {
		background-color: #f7f8fa;
		color: #a9adb3;
		text-align: center;
		padding: 20rpx;
		font-size: 26rpx;
		font-weight: 500;
		border-bottom: 1rpx solid #f0f2f5;
	}

	.bottom-actions {
		padding: 30rpx 30rpx 40rpx; /* 恢复内边距 */
		background-color: transparent; /* 改为透明背景 */
		box-shadow: none; /* 移除阴影 */
		margin-top: 20rpx; /* 和上方内容增加间距 */
	}

	/* 底部操作区样式 - 固定定位 */
	.bottom-actions-fixed {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background: #f8f9fa;
		padding: 20rpx;
		box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.1);
		z-index: 1000;
		border-top: 1rpx solid #e0e0e0;
		/* 确保按钮区域有足够的高度 */
		min-height: 80rpx;
	}

	.day-navigator {
		display: flex;
		justify-content: space-around;
		align-items: center;
	}

	.nav-btn {
		text-align: center;
		padding: 22rpx 40rpx;
		margin: 0 10rpx;
		border-radius: 50rpx;
		font-size: 28rpx;
		font-weight: bold;
		color: #fff;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); /* 修改为课程表主色调 */
		box-shadow: 0 6rpx 20rpx rgba(102, 126, 234, 0.35); /* 修改阴影颜色 */
		transition: all 0.2s ease;
	}

	.nav-btn.save-btn {
		background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); /* 保存按钮使用绿色 */
		box-shadow: 0 6rpx 20rpx rgba(67, 233, 123, 0.35);
	}

	.nav-btn.return-btn {
		background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); /* 修改为与保存按钮相同的绿色 */
		box-shadow: 0 6rpx 20rpx rgba(67, 233, 123, 0.35); /* 修改阴影颜色 */
	}

	.nav-btn:active {
		transform: translateY(2rpx) scale(0.98);
		box-shadow: 0 3rpx 10rpx rgba(0, 0, 0, 0.2);
	}

	.empty-state {
		text-align: center;
	}

	.date-in-empty {
		font-size: 28rpx;
		color: #b0b0b0;
		margin-top: 10rpx;
	}

	/* 日期选择器样式 */
	.date-selector {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 5rpx 10rpx 10rpx; /* 减小边距 */
		flex-shrink: 0;
	}
	
	.nav-arrow {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		background-color: #fff;
		box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.08);
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 40rpx;
		color: #667eea;
		font-weight: bold;
		transition: all 0.2s ease;
	}
	
	.nav-arrow:active {
		transform: scale(0.95);
		background-color: #f0f2f5;
	}
	
	.date-display-wrapper {
		flex: 1;
		text-align: center;
		padding: 0 20rpx;
	}
	
	.date-text {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		white-space: nowrap; /* 核心：确保不换行 */
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.course-block {
		border-radius: 8rpx;
		padding: 8rpx 0;
		font-size: 28rpx;
		font-weight: bold;
		box-shadow: 0 2px 8px rgba(0,0,0,0.08);
		margin-bottom: 8rpx;
		text-align: center;
	}

	.course-remark-show {
		color: #888;
		font-size: 22rpx;
		margin: 2rpx 0 8rpx 0;
		line-height: 1.4;
	}
	
	/* 多选日期相关样式 */
	.multi-date-hint {
		font-size: 24rpx;
		color: #666;
		margin-top: 5rpx;
	}
	
	.multi-date-selector {
		background: #fff;
		margin: 20rpx;
		border-radius: 20rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
		padding: 30rpx;
	}
	
	.multi-date-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30rpx;
	}
	
	.multi-date-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}
	
	.multi-date-actions {
		display: flex;
		gap: 20rpx;
	}
	
	.action-btn {
		padding: 10rpx 20rpx;
		background: #1976D2;
		color: #fff;
		border-radius: 10rpx;
		font-size: 24rpx;
	}
	
	/* 周导航样式 */
	.week-navigation {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
		padding: 0 10rpx;
	}
	
	.week-nav-btn {
		display: flex;
		align-items: center;
		gap: 8rpx;
		padding: 15rpx 20rpx;
		background: #f0f8ff;
		border-radius: 20rpx;
		border: 1rpx solid #b3d9ff;
		transition: all 0.3s ease;
	}
	
	.week-nav-btn:active {
		background: #e6f3ff;
		transform: scale(0.95);
	}
	
	.week-nav-icon {
		font-size: 24rpx;
		color: #1976D2;
		font-weight: bold;
	}
	
	.week-nav-text {
		font-size: 24rpx;
		color: #1976D2;
		font-weight: 500;
	}
	
	.week-display {
		flex: 1;
		text-align: center;
		padding: 15rpx 20rpx;
		background: #f8f9fa;
		border-radius: 20rpx;
		border: 2rpx solid #e9ecef;
		transition: all 0.3s ease;
		cursor: pointer;
	}
	
	.week-display:active {
		background: #e9ecef;
		transform: scale(0.98);
	}
	
	.week-text {
		font-size: 26rpx;
		color: #333;
		font-weight: 500;
		display: block;
	}
	
	.week-picker-hint {
		font-size: 20rpx;
		color: #666;
		margin-top: 5rpx;
		opacity: 0.8;
	}
	
	/* 可滑动的日期容器 */
	.date-scroll-container {
		width: 100%;
		white-space: nowrap;
	}
	
	.date-scroll-content {
		display: flex;
		gap: 15rpx;
		padding: 0 10rpx;
	}
	
	.date-grid {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 15rpx;
	}
	
	.date-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 20rpx 10rpx;
		border-radius: 15rpx;
		background: #f5f5f5;
		border: 2rpx solid transparent;
		transition: all 0.3s ease;
		min-width: 80rpx;
		flex-shrink: 0;
	}
	
	.date-item.selected {
		background: #1976D2;
		color: #fff;
		border-color: #1976D2;
	}
	
	.date-item.month-start {
		border-left: 3rpx solid #ff6b6b;
		background: #fff5f5;
	}
	
	.date-item.different-month {
		border-left: 2rpx solid #e0e0e0;
	}
	
	.month-label {
		font-size: 20rpx;
		color: #ff6b6b;
		font-weight: bold;
		margin-top: 5rpx;
	}
	
	.date-item .date-text {
		font-size: 28rpx;
		font-weight: bold;
		margin-bottom: 5rpx;
	}
	
	.date-item .weekday-text {
		font-size: 22rpx;
		opacity: 0.8;
	}
	
	/* 周选择器弹窗样式 */
	.week-picker-modal {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 1000;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 40rpx;
	}
	
	.week-picker-content {
		background: #fff;
		border-radius: 20rpx;
		width: 100%;
		max-height: 70vh;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}
	
	.week-picker-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx;
		border-bottom: 1rpx solid #f0f0f0;
	}
	
	.week-picker-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}
	
	.close-btn {
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
		background: #f0f0f0;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.close-icon {
		font-size: 32rpx;
		color: #999;
	}
	
	.week-picker-list {
		flex: 1;
		overflow-y: auto;
		padding: 20rpx 0;
	}
	
	.week-option {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 25rpx 30rpx;
		border-bottom: 1rpx solid #f0f0f0;
		transition: all 0.3s ease;
	}
	
	.week-option:last-child {
		border-bottom: none;
	}
	
	.week-option.selected {
		background: #f0f8ff;
		border-left: 4rpx solid #1976D2;
	}
	
	.week-option:active {
		background: #f5f5f5;
	}
	
	.week-option-text {
		font-size: 28rpx;
		color: #333;
		flex: 1;
	}
	
	.check-icon {
		font-size: 24rpx;
		color: #1976D2;
		font-weight: bold;
	}
</style> 