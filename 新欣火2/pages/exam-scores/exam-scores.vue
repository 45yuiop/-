<template>
	<view class="container">
		<!-- 顶部导航 -->
		<view class="nav-bar">
			<text class="back-btn" @click="goBack">返回</text>
			<view class="nav-title">考试成绩管理</view>
		</view>
		
		<!-- 功能切换 -->
		<view class="tab-container">
			<view 
				class="tab-item" 
				:class="{ active: activeTab === 'input' }"
				@click="switchTab('input')"
			>
				成绩录入
			</view>
			<view 
				class="tab-item" 
				:class="{ active: activeTab === 'list' }"
				@click="switchTab('list')"
			>
				成绩列表
			</view>
		</view>
		
		<!-- 成绩录入表单 -->
		<view v-if="activeTab === 'input'" class="form-outer">
			<view class="form-container" :style="{minHeight: 'calc(100vh - 180px)'}">
				<!-- 学生选择 -->
				<view class="form-item">
					<text class="label">学生</text>
					<view class="student-selector" @click="showStudentModal">
						<view class="student-display">
							<text v-if="!formData.studentName" class="placeholder">请选择学生</text>
							<view v-else class="selected-student">
								<text class="student-text">{{ formData.studentName }}</text>
								<text class="student-id">{{ formData.studentId }}</text>
							</view>
						</view>
						<text class="arrow">></text>
					</view>
				</view>
				
				<!-- 年级选择 -->
				<view class="form-item">
					<text class="label">年级</text>
					<picker :range="gradeOptions" :value="gradeIndex" @change="onGradeChange" class="picker">
						<view class="picker-text input-grade">{{ gradeOptions[gradeIndex] || '请选择年级' }}</view>
					</picker>
				</view>
				
                <!-- 考试日期和类型 -->
                <view class="form-item">
                    <text class="label">考试日期和类型</text>
                    <view class="date-type-row">
                        <!-- 年份选择 -->
                        <picker class="picker year-picker" :range="yearOptions" :value="yearIndex" @change="onYearChange">
                            <view class="picker-text input-year">{{ yearOptions[yearIndex] || '年份' }}</view>
                        </picker>
                        <!-- 月份选择 -->
                        <picker class="picker month-picker" :range="monthOptions" :value="monthIndex" @change="onMonthChange">
                            <view class="picker-text input-month">{{ monthOptions[monthIndex] || '月份' }}</view>
                        </picker>
                        <!-- 考试类型选择 -->
                        <picker class="picker exam-type-picker" :range="examTypeOptions" :value="examTypeIndex" @change="onExamTypeChange">
                            <view class="picker-text input-examtype">{{ examTypeOptions[examTypeIndex] || '考试类型' }}</view>
                        </picker>
                    </view>
                </view>
				
				<!-- 科目选择 -->
				<view class="form-item">
					<text class="label">选择科目</text>
					<view class="subject-selector" @click="showSubjectModal">
						<view class="subject-display">
							<text v-if="selectedSubjects.length === 0" class="placeholder">请选择科目（可多选）</text>
							<view v-else class="selected-subjects">
								<view 
									v-for="subject in selectedSubjects" 
									:key="subject"
									class="subject-tag"
								>
									<text class="subject-text">{{ subject }}</text>
									<text class="remove-subject" @click.stop="removeSubject(subject)">×</text>
								</view>
							</view>
						</view>
						<text class="arrow">></text>
					</view>
				</view>
				
				<!-- 多科目成绩录入 -->
				<view v-if="selectedSubjects.length > 0" class="form-item">
					<text class="label">各科成绩</text>
					<view class="scores-container">
						<view 
							v-for="subject in selectedSubjects" 
							:key="subject"
							class="score-input-item"
						>
							<text class="score-label">{{ subject }}</text>
							<input 
								v-model="subjectScores[subject]" 
								class="input score-input" 
								type="number" 
								:placeholder="`${subject}成绩`"
							/>
						</view>
					</view>
				</view>
				
				<!-- 备注 -->
				<view class="form-item">
					<text class="label">备注</text>
					<textarea v-model="formData.remark" class="textarea small" placeholder="备注信息" />
				</view>
				
				<button class="submit-btn card" @click="submitScore">提交成绩</button>
			</view>
		</view>
		
		<!-- 学生选择弹窗 -->
		<view v-if="showStudentModalFlag" class="student-modal" @click="closeStudentModal">
			<view class="student-modal-content" @click.stop>
				<view class="modal-header">
					<text class="modal-title">选择学生</text>
					<view class="close-btn" @click="closeStudentModal">
						<text class="close-icon">×</text>
					</view>
				</view>
				
				<view class="modal-body">
					<view class="search-container">
						<input 
							class="search-input" 
							v-model="studentSearchKeyword" 
							placeholder="搜索学生姓名或学号" 
							@input="onStudentSearchInput"
						/>
					</view>
					
					<view class="student-selection-list">
						<view 
							v-for="student in filteredStudents" 
							:key="student._id"
							class="student-selection-item"
							:class="{selected: isStudentSelected(student)}"
							@click="selectStudent(student)"
						>
							<view class="student-avatar">
								<text class="avatar-text">{{ (student.name || '学').charAt(0) }}</text>
							</view>
							<view class="student-info">
								<text class="student-name">{{ student.name }}</text>
								<text class="student-details">{{ student.studentId }} · {{ student.grade }}</text>
							</view>
							<view class="selection-indicator" :class="{selected: isStudentSelected(student)}">
								<text v-if="isStudentSelected(student)" class="check-icon">✓</text>
							</view>
						</view>
						
						<view v-if="filteredStudents.length === 0" class="no-result">
							<text class="no-result-text">暂无匹配的学生</text>
						</view>
					</view>
				</view>
				
				<view class="modal-footer">
					<button class="cancel-btn" @click="closeStudentModal">取消</button>
					<view class="confirm-btn-container">
						<button class="confirm-btn" @click="confirmStudent">确定</button>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 科目选择弹窗 -->
		<view v-if="showSubjectModalFlag" class="subject-modal" @click="closeSubjectModal">
			<view class="subject-modal-content" @click.stop>
				<view class="modal-header">
					<text class="modal-title">选择科目</text>
					<view class="close-btn" @click="closeSubjectModal">
						<text class="close-icon">×</text>
					</view>
				</view>
				
				<view class="modal-body">
					<view class="subject-selection-list">
						<view 
							v-for="subject in subjectOptions" 
							:key="subject"
							class="subject-selection-item"
							:class="{selected: isSubjectSelected(subject)}"
							@click="toggleSubject(subject)"
						>
							<text class="subject-name">{{ subject }}</text>
							<view class="selection-indicator" :class="{selected: isSubjectSelected(subject)}">
								<text v-if="isSubjectSelected(subject)" class="check-icon">✓</text>
							</view>
						</view>
					</view>
				</view>
				
				<view class="modal-footer">
					<button class="cancel-btn" @click="closeSubjectModal">取消</button>
					<view class="confirm-btn-container">
						<button class="confirm-btn" @click="confirmSubjects">确定 ({{ selectedSubjects.length }})</button>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 成绩列表 -->
		<view v-if="activeTab === 'list'" class="list-container">
			<view class="filter-container">
				<view class="filter-item">
					<picker 
						:value="filterGradeIndex" 
						:range="gradeFilterList" 
						@change="onFilterGradeChange"
						class="filter-picker"
					>
						<view class="filter-text">
							{{ gradeFilterList[filterGradeIndex] || '全部年级' }}
						</view>
					</picker>
				</view>
				<view class="filter-item">
					<picker 
						:value="filterSubjectIndex" 
						:range="subjects" 
						@change="onFilterSubjectChange"
						class="filter-picker"
					>
						<view class="filter-text">
							{{ subjects[filterSubjectIndex] || '全部科目' }}
						</view>
					</picker>
				</view>
			</view>
			
			<view class="score-list">
				<view 
					v-for="score in filteredScores" 
					:key="score._id"
					class="score-item"
				>
					<view class="score-content" @click="editScore(score)">
						<view class="score-header">
							<text class="grade-label">{{ score.grade }}</text>
						</view>
						<view class="score-header">
							<text class="student-name">{{ score.studentName }}</text>
							<text :class="['score-value', getScoreColor(score.score, score.maxScore)]">
							    成绩：{{ score.score }}
							</text>
						</view>
						<view class="score-info">
							<text class="subject-label">{{ score.subject }}</text>
							<text class="coursetype-label">{{ score.courseType }}</text>
							<text class="examtype-label">{{ score.examType }}</text>
	                        <text class="date-label">考试时间：{{ formatYearMonth(score.examDate) }}</text>
						</view>
						<view v-if="score.remark" class="score-remark">
							<text class="remark-text">{{ score.remark }}</text>
						</view>
					</view>
					<view class="score-actions">
						<view class="action-btn edit-btn" @click.stop="editScore(score)">
							<text class="action-text">修改</text>
						</view>
						<view class="action-btn delete-btn" @click.stop="deleteScore(score)">
							<text class="action-text">删除</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 删除进步分析tab和内容 -->
	</view>
</template>

<script>
export default {
	data() {
		return {
			activeTab: 'input',
			formData: {
				studentId: '',
				studentName: '',
				grade: '',
				examType: '',
				examDate: '',
				examYear: '',
				examMonth: '',
				remark: '',
				inputUser: '' // 新增：录入人/修改人
			},
			examTypeOptions: ['期中', '期末', '月考', '中考'],
			examTypeIndex: -1,
			gradeOptions: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级', '七年级', '八年级', '九年级', '高一', '高二', '高三'],
			gradeIndex: -1,
			subjectOptions: ['语文', '数学', '英语', '物理', '化学'],
			showSubjectModalFlag: false,
			selectedSubjects: [],
			subjectScores: {},
          // 日期选择器数据
          yearOptions: [],
          yearIndex: 0,
          monthOptions: ['01','02','03','04','05','06','07','08','09','10','11','12'],
          monthIndex: 0,
			allStudentHours: [],
			showStudentModalFlag: false,
			availableStudents: [],
			studentSearchKeyword: '',
			filteredStudents: [],
			tempStudent: null,
			subjects: [], // 新增：科目下拉选项
			examTypes: [], // 考试类型选项（用于进步分析）
			filterSubjectIndex: -1,
			analysisSubjectIndex: -1,
			analysisExamTypeIndex: -1,
			showStudentList: false,
			filteredStudents: [],
			allScores: [],
			filteredScores: [],
			progressData: null,
			gradeFilterList: [], // 年级筛选下拉选项
			filterGradeIndex: -1, // 年级筛选下标
			showRemark: false,
			editScoreId: null,
		}
	},
	
	onLoad() {
		this.initExamDate();
		this.loadStudentHours();
		this.loadStudents(); // 加载学生列表
		this.loadScores(); // 加载成绩列表
	},
	
	onShow() {
		// 页面显示时重新加载数据
		this.loadStudentHours();
		this.loadScores();
	},
		
	methods: {
    // 展示用：从 YYYY-MM-DD 中提取 YYYY-MM
    formatYearMonth(dateStr) {
      if (!dateStr) return '';
      // 兼容 Date 对象或字符串
      if (dateStr instanceof Date) {
        const y = dateStr.getFullYear();
        const m = String(dateStr.getMonth() + 1).padStart(2, '0');
        return `${y}-${m}`;
      }
      // 期望格式: 'YYYY-MM-DD' 或 'YYYY-MM'
      const str = String(dateStr);
      if (str.length >= 7) {
        return str.slice(0, 7);
      }
      return str;
    },
		// 初始化考试日期
    initExamDate() {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonthNum = now.getMonth() + 1;
      const currentMonth = currentMonthNum.toString().padStart(2, '0');
      const currentDay = now.getDate().toString().padStart(2, '0');

      // 生成年份选项（当前年前后5年）
      this.yearOptions = [];
      for (let y = currentYear - 5; y <= currentYear + 5; y++) {
        this.yearOptions.push(String(y));
      }
      this.yearIndex = this.yearOptions.indexOf(String(currentYear));

      // 设置月份索引
      this.monthIndex = currentMonthNum - 1;

      // 设置表单数据为当前日期
      this.formData.examYear = String(currentYear);
      this.formData.examMonth = currentMonth;
      this.formData.examDate = `${currentYear}-${currentMonth}-${currentDay}`;
    },
		// 切换tab
		switchTab(tab) {
			this.activeTab = tab;
			if (tab === 'list') {
				this.loadScores(); // 切换到成绩列表时重新加载
			}
		},
		async loadStudentHours() {
			try {
				console.log('开始调用student-hours云函数...');
				const result = await uniCloud.callFunction({
					name: 'student-hours',
					data: { action: 'getMyStudents', teacherId: 'default' }
				});
				console.log('student-hours云函数返回结果:', result);
				if (result.result.code === 200 && Array.isArray(result.result.data)) {
					this.allStudentHours = result.result.data;
					this.gradeList = [...new Set(this.allStudentHours.map(item => item.grade).filter(Boolean))];
					console.log('年级列表:', this.gradeList);
				} else {
					console.error('student-hours云函数返回错误:', result.result);
					uni.showToast({ title: '课时数据为空: ' + (result.result.message || '未知错误'), icon: 'none' });
					this.gradeList = [];
				}
			} catch (e) {
				console.error('加载学生课时失败:', e);
				uni.showToast({ title: '加载学生课时失败', icon: 'none' });
				this.gradeList = [];
			}
		},
		async loadStudents() {
			try {
				const result = await uniCloud.callFunction({
					name: 'archive-manager',
					data: {
						action: 'getStudents'
					}
				});
				
				if (result.result.code === 0) {
					this.availableStudents = result.result.data || [];
					this.filteredStudents = this.availableStudents;
				}
			} catch (error) {
				console.error('加载学生列表失败:', error);
				uni.showToast({
					title: '加载学生列表失败',
					icon: 'error'
				});
			}
		},
		onGradeChange(e) {
			this.gradeIndex = e.detail.value;
			const grade = this.gradeOptions[this.gradeIndex];
			this.formData.grade = grade;
		},
		showSubjectModal() {
			this.showSubjectModalFlag = true;
		},
		closeSubjectModal() {
			this.showSubjectModalFlag = false;
		},
		isSubjectSelected(subject) {
			return this.selectedSubjects.includes(subject);
		},
		toggleSubject(subject) {
			const index = this.selectedSubjects.indexOf(subject);
			if (index > -1) {
				this.selectedSubjects.splice(index, 1);
				delete this.subjectScores[subject];
			} else {
				this.selectedSubjects.push(subject);
				this.subjectScores[subject] = '';
			}
		},
		removeSubject(subject) {
			const index = this.selectedSubjects.indexOf(subject);
			if (index > -1) {
				this.selectedSubjects.splice(index, 1);
				delete this.subjectScores[subject];
			}
		},
		confirmSubjects() {
			this.showSubjectModalFlag = false;
		},
		showStudentModal() {
			this.tempStudent = this.formData.studentId ? 
				this.availableStudents.find(s => s.studentId === this.formData.studentId) : null;
			this.showStudentModalFlag = true;
			this.filteredStudents = this.availableStudents;
			this.studentSearchKeyword = '';
		},
		closeStudentModal() {
			this.showStudentModalFlag = false;
		},
		onStudentSearchInput() {
			if (!this.studentSearchKeyword) {
				this.filteredStudents = this.availableStudents;
				return;
			}
			
			const keyword = this.studentSearchKeyword.toLowerCase();
			this.filteredStudents = this.availableStudents.filter(student => {
				const name = student.name || '';
				const studentId = student.studentId || '';
				return name.toLowerCase().includes(keyword) || 
					   studentId.toLowerCase().includes(keyword);
			});
		},
		isStudentSelected(student) {
			return this.tempStudent && this.tempStudent._id === student._id;
		},
		selectStudent(student) {
			this.tempStudent = student;
		},
		confirmStudent() {
			if (this.tempStudent) {
				this.formData.studentId = this.tempStudent.studentId;
				this.formData.studentName = this.tempStudent.name;
				this.formData.grade = this.tempStudent.grade;
				// 自动设置年级选择
				this.gradeIndex = this.gradeOptions.findIndex(g => g === this.tempStudent.grade);
			} else {
				this.formData.studentId = '';
				this.formData.studentName = '';
				this.formData.grade = '';
				this.gradeIndex = -1;
			}
			this.showStudentModalFlag = false;
		},
    onYearChange(e) {
      this.yearIndex = e.detail.value;
      const year = Number(this.yearOptions[this.yearIndex]);
      const monthNum = this.monthIndex + 1;
      this.formData.examYear = String(year);
      this.updateExamDateByPickers();
    },
    onMonthChange(e) {
      this.monthIndex = e.detail.value;
      const year = Number(this.yearOptions[this.yearIndex]);
      const monthNum = this.monthIndex + 1;
      this.formData.examMonth = String(monthNum).padStart(2, '0');
      this.updateExamDateByPickers();
    },
    updateExamDateByPickers() {
      const year = this.yearOptions[this.yearIndex];
      const month = String(this.monthIndex + 1).padStart(2, '0');
      const day = '01'; // 默认使用1号
      this.formData.examYear = year;
      this.formData.examMonth = month;
      this.formData.examDate = `${year}-${month}-${day}`;
    },
    onExamTypeChange(e) {
			this.examTypeIndex = e.detail.value;
			this.formData.examType = this.examTypeOptions[this.examTypeIndex];
			// 根据考试类型调整日期
			this.adjustExamDate();
		},
		    adjustExamDate() {
      if (this.formData.examType) {
        // 根据考试类型调整日期
        let day = '01'; // 默认1号
        if (this.formData.examType === '期中') {
          day = '15'; // 期中考试通常在月中
        } else if (this.formData.examType === '期末') {
          day = '25'; // 期末考试通常在月末
        } else if (this.formData.examType === '月考') {
          day = '20'; // 月考通常在月中下旬
        } else if (this.formData.examType === '中考') {
          day = '15'; // 中考通常在月中
        }
        // 使用当前年份和月份，只调整日期
        const year = this.yearOptions[this.yearIndex];
        const month = String(this.monthIndex + 1).padStart(2, '0');
        // 若目标日期超过当月天数，则取该月最后一天
        const daysInMonth = new Date(Number(year), this.monthIndex + 1, 0).getDate();
        let dayNum = Number(day);
        if (dayNum > daysInMonth) dayNum = daysInMonth;
        const dayStr = String(dayNum).padStart(2, '0');
        this.formData.examYear = year;
        this.formData.examMonth = month;
        this.formData.examDate = `${year}-${month}-${dayStr}`;
      }
    },
		async submitScore() {
			// 校验
			// 获取当前登录用户信息，优先取姓名、昵称、teacherName
			const userInfo = uni.getStorageSync('userInfo') || {};
			this.formData.inputUser = userInfo.name || userInfo.nickname || userInfo.teacherName || '未填写姓名';
			
			if (!this.formData.studentId) {
				uni.showToast({ title: '请选择学生', icon: 'none' }); return;
			}
			if (!this.formData.grade) {
				uni.showToast({ title: '请选择年级', icon: 'none' }); return;
			}
			if (this.selectedSubjects.length === 0) {
				uni.showToast({ title: '请选择至少一个科目', icon: 'none' }); return;
			}
			// 验证每个科目的成绩
			for (let subject of this.selectedSubjects) {
				const score = Number(this.subjectScores[subject]);
				if (isNaN(score) || score < 0) {
					uni.showToast({ title: `请输入${subject}的有效成绩`, icon: 'none' }); return;
				}
			}
			if (!this.formData.examDate) {
				uni.showToast({ title: '考试日期不能为空', icon: 'none' }); return;
			}
			if (this.examTypeIndex < 0) {
				uni.showToast({ title: '请选择考试类型', icon: 'none' }); return;
			}
			console.log('提交成绩数据', this.formData, this.selectedSubjects, this.subjectScores);
			
			uni.showLoading({ title: '提交中...' });
			
			try {
				// 批量提交多个科目的成绩
				const promises = [];
				for (let subject of this.selectedSubjects) {
					const scoreData = {
						...this.formData,
						subject: subject,
						score: Number(this.subjectScores[subject])
					};
					
					if (this.editScoreId) {
						// 编辑模式 - 这里需要根据实际情况调整
						promises.push(uniCloud.callFunction({
							name: 'exam-scores',
							data: { action: 'updateScore', id: this.editScoreId, data: scoreData }
						}));
					} else {
						// 新增模式
						promises.push(uniCloud.callFunction({
							name: 'exam-scores',
							data: { action: 'addScore', data: scoreData }
						}));
					}
				}
				
				const results = await Promise.all(promises);
				let result = results[0]; // 使用第一个结果作为主要结果
				
				console.log('提交成绩云函数返回:', result);
				
				uni.hideLoading();
				if (result.result.code === 200) {
					uni.showToast({ title: '成绩录入成功', icon: 'success' });
					this.resetForm();
					this.loadScores(); // 重新加载成绩列表
				} else if (result.result.code === 409 || result.result.isConflict) {
					// 处理冲突情况
					console.log('检测到冲突，调用冲突处理函数');
					this.handleScoreConflict(result.result.data);
				} else if (result.result.code === 408 || (result.result.isDuplicate && result.result.code !== 200)) {
					// 处理重复录入情况（不同用户录入相同成绩）
					console.log('检测到重复录入，调用重复录入处理函数');
					this.handleDuplicateEntry(result.result.data);
				} else {
					uni.showToast({ title: result.result.message, icon: 'none' });
				}
			} catch (error) {
				uni.hideLoading();
				console.error('提交失败:', error);
				uni.showToast({ title: '提交失败', icon: 'none' });
			}
		},
		resetForm() {
			this.gradeIndex = -1;
			this.examTypeIndex = -1;
			// 重置日期为当前值
			this.initExamDate();
			this.formData = {
				studentId: '',
				studentName: '',
				grade: '',
				examType: '',
				examDate: '',
				examYear: '',
				examMonth: '',
				remark: '',
				inputUser: '' // 重置录入人/修改人
			};
			this.selectedSubjects = [];
			this.subjectScores = {};
			this.editScoreId = null;
		},
		
		// 加载成绩列表
		async loadScores() {
			try {
				console.log('开始调用exam-scores云函数...');
				const result = await uniCloud.callFunction({
					name: 'exam-scores',
					data: {
						action: 'getStudentScores',
						data: {} // 传递空的data对象
					}
				});
				console.log('exam-scores云函数返回结果:', result);
				if (result.result.code === 200) {
					this.allScores = result.result.data;
					console.log('获取到的成绩数据:', this.allScores);
					// 动态提取科目、年级、考试类型
					this.subjects = [...new Set(this.allScores.map(item => item.subject).filter(Boolean))];
					this.gradeFilterList = [...new Set(this.allScores.map(item => item.grade).filter(Boolean))];
					this.examTypes = [...new Set(this.allScores.map(item => item.examType).filter(Boolean))];
					this.filterScores();
				} else {
					console.error('云函数返回错误:', result.result);
					uni.showToast({ title: '加载成绩失败: ' + result.result.message, icon: 'none' });
				}
			} catch (error) {
				console.error('加载成绩列表失败:', error);
				uni.showToast({ title: '加载成绩失败', icon: 'none' });
			}
		},
		
		// 过滤成绩
		filterScores() {
			let filtered = this.allScores;
			if (this.filterGradeIndex >= 0) {
				const grade = this.gradeFilterList[this.filterGradeIndex];
				filtered = filtered.filter(score => score.grade === grade);
			}
			if (this.filterSubjectIndex >= 0) {
				const subject = this.subjects[this.filterSubjectIndex];
				filtered = filtered.filter(score => score.subject === subject);
			}
			this.filteredScores = filtered;
		},
		
		// 过滤科目变化
		onFilterSubjectChange(e) {
			this.filterSubjectIndex = e.detail.value;
			this.filterScores();
		},
		
		// 过滤考试类型变化
		// 过滤年级变化
		onFilterGradeChange(e) {
			this.filterGradeIndex = e.detail.value;
			this.filterScores();
		},
		
		// 分析科目变化
		onAnalysisSubjectChange(e) {
			this.analysisSubjectIndex = e.detail.value;
		},
		
		// 分析考试类型变化
		onAnalysisExamTypeChange(e) {
			this.analysisExamTypeIndex = e.detail.value;
		},
		
		// 获取进步分析
		async getProgressAnalysis() {
			if (this.analysisSubjectIndex < 0 || this.analysisExamTypeIndex < 0) {
				uni.showToast({
					title: '请选择科目和考试类型',
					icon: 'none'
				});
				return;
			}
			
			const subject = this.subjects[this.analysisSubjectIndex];
			const examType = this.examTypes[this.analysisExamTypeIndex];
			
			try {
				const result = await uniCloud.callFunction({
					name: 'exam-scores',
					data: {
						action: 'getClassProgressAnalysis',
						data: {
							subject,
							examType
						}
					}
				});
				
				if (result.result.code === 200) {
					this.progressData = result.result.data;
				} else {
					uni.showToast({
						title: result.result.message,
						icon: 'none'
					});
				}
			} catch (error) {
				console.error('获取进步分析失败:', error);
				uni.showToast({
					title: '分析失败',
					icon: 'none'
				});
			}
		},
		goBack() {
			uni.navigateBack();
		},
		getScoreColor(score, maxScore) {
			// 如果没有maxScore，使用默认的100分制
			const total = maxScore || 100;
			const percent = score / total;
			if (percent >= 0.85) return 'score-high';
			if (percent >= 0.6) return 'score-mid';
			return 'score-low';
		},
		// 编辑成绩
		editScore(score) {
			this.activeTab = 'input';
			this.editScoreId = score._id;
			this.formData = {
				studentId: score.studentId || '',
				studentName: score.studentName || '',
				grade: score.grade || '',
				courseType: score.courseType || '',
				subject: score.subject || '',
				score: score.score || '',
				maxScore: score.maxScore || '',
				examType: score.examType || '',
				examDate: score.examDate || '',
				className: score.className || '',
				remark: score.remark || '',
				inputUser: score.inputUser || '' // 编辑时也设置录入人/修改人
			};
			// 自动选中年级
			this.gradeIndex = this.gradeOptions.findIndex(g => g === score.grade);
			// 级联出课程类型列表
			const filteredCourseTypes = this.allStudentHours.filter(item => item.grade === score.grade);
			this.courseTypeList = [...new Set(filteredCourseTypes.map(item => item.courseType))];
			this.courseTypeIndex = this.courseTypeList.findIndex(c => c === score.courseType);
			// 级联出科目列表
			const filteredSubjects = this.allStudentHours.filter(item => item.grade === score.grade && item.courseType === score.courseType);
			this.subjectList = [...new Set(filteredSubjects.map(item => item.subject))];
			this.subjectIndex = this.subjectList.findIndex(s => s === score.subject);
			// 级联出学生列表
			this.studentList = this.allStudentHours.filter(item =>
				item.grade === score.grade &&
				item.courseType === score.courseType &&
				item.subject === score.subject
			);
			this.studentIndex = this.studentList.findIndex(s => s._id === score.studentId);
		},
		
		// 删除成绩
		deleteScore(score) {
			uni.showModal({
				title: '确认删除',
				content: `确定要删除 ${score.studentName} 的 ${score.subject} 成绩吗？\n成绩：${score.score}/${score.maxScore}`,
				showCancel: true,
				cancelText: '取消',
				confirmText: '删除',
				success: async (res) => {
					if (res.confirm) {
						await this.confirmDeleteScore(score);
					}
				}
			});
		},
		
		// 确认删除成绩
		async confirmDeleteScore(score) {
			uni.showLoading({ title: '删除中...' });
			
			try {
				const result = await uniCloud.callFunction({
					name: 'exam-scores',
					data: {
						action: 'deleteScore',
						id: score._id
					}
				});
				
				uni.hideLoading();
				
				if (result.result.code === 200) {
					uni.showToast({ title: '删除成功', icon: 'success' });
					this.loadScores(); // 重新加载成绩列表
				} else {
					uni.showToast({ title: result.result.message || '删除失败', icon: 'none' });
				}
			} catch (error) {
				uni.hideLoading();
				console.error('删除成绩失败:', error);
				uni.showToast({ title: '删除失败', icon: 'none' });
			}
		},
		
		// 处理成绩冲突
		handleScoreConflict(conflictData) {
			console.log('handleScoreConflict 被调用，参数:', conflictData);
			const { existingScore, newScore, conflictInfo } = conflictData;
			
			uni.showModal({
				title: '检测到成绩冲突',
				content: `学生：${conflictInfo.studentName}\n考试：${conflictInfo.examType} - ${conflictInfo.subject}\n日期：${conflictInfo.examDate}\n\n现有成绩：${existingScore.score}/${existingScore.maxScore} (录入人：${conflictInfo.existingInputUser})\n新成绩：${newScore.score}/${newScore.maxScore} (录入人：${conflictInfo.newInputUser})\n\n请选择处理方式：`,
				showCancel: true,
				cancelText: '保留',
				confirmText: '替换',
				success: (res) => {
					console.log('冲突处理弹窗回调:', res);
					if (res.confirm) {
						this.resolveConflict(existingScore._id, newScore, 'use_new');
					} else if (res.cancel) {
						this.resolveConflict(existingScore._id, newScore, 'keep_existing');
					}
				},
				fail: (err) => {
					console.error('显示冲突处理弹窗失败:', err);
				}
			});
		},
		
		// 处理重复录入（不同用户录入相同成绩）
		handleDuplicateEntry(duplicateData) {
			const { existingScore, newScore, duplicateInfo } = duplicateData;
			
			uni.showModal({
				title: '检测到重复录入',
				content: `学生：${duplicateInfo.studentName}\n考试：${duplicateInfo.examType} - ${duplicateInfo.subject}\n日期：${duplicateInfo.examDate}\n\n成绩：${existingScore.score}/${existingScore.maxScore}\n\n现有录入人：${duplicateInfo.existingInputUser}\n当前录入人：${duplicateInfo.newInputUser}\n\n检测到相同成绩由不同用户录入，请选择处理方式：`,
				showCancel: true,
				cancelText: '取消录入',
				confirmText: '更新',
				success: (res) => {
					if (res.confirm) {
						this.updateInputUser(existingScore._id, duplicateInfo.newInputUser);
					} else if (res.cancel) {
						uni.showToast({ title: '已取消录入', icon: 'none' });
					}
				}
			});
		},
		
		// 更新录入人
		async updateInputUser(existingScoreId, newInputUser) {
			uni.showLoading({ title: '更新中...' });
			
			try {
				const result = await uniCloud.callFunction({
					name: 'exam-scores',
					data: {
						action: 'updateScore',
						id: existingScoreId,
						data: {
							inputUser: newInputUser,
							updateTime: new Date().toISOString()
						}
					}
				});
				
				uni.hideLoading();
				
				if (result.result.code === 200) {
					uni.showToast({ title: '录入人已更新', icon: 'success' });
					this.resetForm();
					this.loadScores(); // 重新加载成绩列表
				} else {
					uni.showToast({ title: result.result.message, icon: 'none' });
				}
			} catch (error) {
				uni.hideLoading();
				console.error('更新录入人失败:', error);
				uni.showToast({ title: '更新录入人失败', icon: 'none' });
			}
		},
		
		// 解决冲突
		async resolveConflict(existingScoreId, newScoreData, resolution) {
			const userInfo = uni.getStorageSync('userInfo') || {};
			const resolvedBy = userInfo.name || userInfo.nickname || userInfo.teacherName || '未知用户';
			
			uni.showLoading({ title: '处理中...' });
			
			try {
				const result = await uniCloud.callFunction({
					name: 'exam-scores',
					data: {
						action: 'resolveConflict',
						data: {
							existingScoreId,
							newScoreData,
							resolution,
							resolvedBy
						}
					}
				});
				
				uni.hideLoading();
				
				if (result.result.code === 200) {
					uni.showToast({ title: result.result.message, icon: 'success' });
					this.resetForm();
					this.loadScores(); // 重新加载成绩列表
				} else {
					uni.showToast({ title: result.result.message, icon: 'none' });
				}
			} catch (error) {
				uni.hideLoading();
				console.error('解决冲突失败:', error);
				uni.showToast({ title: '解决冲突失败', icon: 'none' });
			}
		}
	}
}
</script>

<style scoped>
.container {
	min-height: 100vh;
	background-color: #f5f5f5;
	padding-top: 24px; /* 整体下移 */
	position: relative;
}
.container::before {
	content: '';
	display: block;
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 24px;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	z-index: 0;
}

.nav-bar {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	padding: 20px;
	text-align: center;
	position: relative; /* Added for back button positioning */
}

.nav-title {
	color: white;
	font-size: 18px;
	font-weight: bold;
}

.back-btn {
	position: absolute;
	left: 16px;
	top: 20px;
	color: white;
	font-size: 16px;
	z-index: 10;
}

.tab-container {
	display: flex;
	background: white;
	margin: 10px;
	border-radius: 8px;
	overflow: hidden;
}

.tab-item {
	flex: 1;
	padding: 12px;
	text-align: center;
	font-size: 14px;
	color: #666;
	background: white;
	transition: all 0.3s;
}

.tab-item.active {
	background: #667eea;
	color: white;
}

.form-outer {
	width: 100%;
	display: flex;
	justify-content: center;
	margin-top: 0;
	min-height: calc(100vh - 100px);
}
.form-container {
	background: #fff;
	border-radius: 16px;
	box-shadow: 0 2px 12px 0 rgba(0,0,0,0.06);
	padding: 18px 14px 12px 14px;
	width: 100%;
	max-width: 420px;
	margin: 0 auto;
	box-sizing: border-box;
}
.form-title {
	font-size: 16px;
	font-weight: bold;
	margin-bottom: 10px;
	color: #333;
}
.form-item {
	margin-bottom: 16px;
}
.label {
	display: block;
	margin-bottom: 2px;
	font-size: 13px;
	color: #333;
}
.input, .textarea, .picker-text {
	width: 100%;
	padding: 7px 8px;
	border: 1px solid #ddd;
	border-radius: 6px;
	font-size: 14px;
	background: white;
}
.textarea.small {
	height: 36px;
	min-height: 28px;
	max-height: 48px;
}
.picker {
	width: 100%;
}
.picker-text {
	padding: 7px 8px;
	border: 1px solid #ddd;
	border-radius: 6px;
	font-size: 14px;
}
.remark-btn {
	width: 100%;
	background: #f5f5f5;
	color: #888;
	border: none;
	border-radius: 6px;
	font-size: 14px;
	padding: 7px 0;
}
.submit-btn.card {
	width: 80%;
	margin: 24px auto 8px auto;
	display: block;
	padding: 14px 0;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: white;
	border: none;
	border-radius: 12px;
	font-size: 16px;
	box-shadow: 0 2px 8px 0 rgba(118,75,162,0.08);
}
.student-list {
	background: white;
	border: 1px solid #ddd;
	border-radius: 6px;
	margin-top: 5px;
	max-height: 200px;
	overflow-y: auto;
}

.student-item {
	padding: 12px;
	border-bottom: 1px solid #eee;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.student-item:last-child {
	border-bottom: none;
}

.student-info {
	font-size: 12px;
	color: #999;
}

.exam-type-picker {
    flex: 1.2;
}

.input-examtype {
	text-align: center;
}

/* 日期-类型横向布局 */
.date-type-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1.2fr; /* 年 月 类型 */
  gap: 8px;
  align-items: center;
}

.input-year,.input-month {
  text-align: center;
}

.submit-btn {
	width: 100%;
	padding: 10px;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: white;
	border: none;
	border-radius: 6px;
	font-size: 15px;
	margin-top: 10px;
}

.filter-container {
	display: flex;
	gap: 10px;
	margin-bottom: 20px;
}

.filter-item {
	flex: 1;
}

.filter-picker {
	width: 100%;
}

.filter-text {
	padding: 10px;
	border: 1px solid #ddd;
	border-radius: 6px;
	font-size: 14px;
	background: white;
	text-align: center;
}

.score-list {
	background: white;
	border-radius: 8px;
	overflow: hidden;
}

.score-item {
	padding: 15px;
	border-bottom: 1px solid #eee;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.score-item:last-child {
	border-bottom: none;
}

.score-content {
	flex: 1;
	cursor: pointer;
}

.score-actions {
	display: flex;
	gap: 8px;
	margin-left: 10px;
}

.action-btn {
	padding: 6px 12px;
	border-radius: 4px;
	font-size: 12px;
	cursor: pointer;
	transition: all 0.3s;
}

.edit-btn {
	background: #667eea;
	color: white;
}

.edit-btn:active {
	background: #5a6fd8;
}

.delete-btn {
	background: #ff6b6b;
	color: white;
}

.delete-btn:active {
	background: #ff5252;
}

.action-text {
	font-size: 12px;
}

.score-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 8px;
}

.grade-label {
	font-size: 15px;
	color: #764ba2;
	font-weight: bold;
	margin-bottom: 2px;
	display: block;
}
.subject-label {
	color: #3a7afe;
	font-weight: bold;
	margin-right: 8px;
}
.examtype-label {
	color: #4caf50;
	margin-left: 8px;
	font-weight: bold;
}
.date-label {
	color: #bbb;
	margin-left: 8px;
}
.score-value {
	font-weight: bold;
}
.score-high {
	color: #3a7afe;
}
.score-mid {
	color: #ff9800;
}
.score-low {
	color: #f44336;
}

.student-name {
	font-size: 16px;
	font-weight: bold;
	color: #333;
}

.score-info {
	display: flex;
	justify-content: space-between;
	margin-bottom: 5px;
}

.info-text {
	font-size: 12px;
	color: #666;
}

.score-remark {
	margin-top: 5px;
}

.remark-text {
	font-size: 12px;
	color: #999;
	font-style: italic;
}

.analysis-filter {
	display: flex;
	gap: 10px;
	margin-bottom: 20px;
	align-items: center;
}

.analysis-btn {
	padding: 10px 20px;
	background: #667eea;
	color: white;
	border: none;
	border-radius: 6px;
	font-size: 14px;
}

.progress-result {
	background: white;
	border-radius: 8px;
	padding: 20px;
}

.progress-summary {
	margin-bottom: 20px;
}

.summary-title {
	display: block;
	font-size: 16px;
	font-weight: bold;
	color: #333;
	margin-bottom: 10px;
}

.summary-text {
	font-size: 14px;
	color: #666;
	line-height: 1.5;
}

.student-progress-list {
	background: #f9f9f9;
	border-radius: 6px;
	padding: 15px;
}

.student-progress-item {
	background: white;
	border-radius: 6px;
	padding: 15px;
	margin-bottom: 10px;
}

.student-progress-item:last-child {
	margin-bottom: 0;
}

.student-progress-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10px;
}

.progress-rate {
	font-size: 16px;
	font-weight: bold;
}

.progress-rate.positive {
	color: #4caf50;
}

.progress-rate.negative {
	color: #f44336;
}

.progress-detail {
	display: flex;
	justify-content: space-between;
}

.detail-text {
	font-size: 12px;
	color: #666;
}
.coursetype-label {
  color: #00bfae;
  font-weight: bold;
  margin-left: 8px;
  margin-right: 8px;
}
.input-blue { color: #3a7afe; }
.input-green { color: #4caf50; }
.input-orange { color: #ff9800; }
.input-purple { color: #764ba2; }
.input-default { color: #333; }
.input-grade { color: #764ba2; }
.input-coursetype { color: #00bfae; }
.input-subject { color: #3a7afe; }
.input-student { color: #ff9800; }
.input-user-label {
  color: #888;
  font-size: 12px;
  margin-left: 8px;
}

/* 学生选择器样式 */
.student-selector {
  width: 100%;
  min-height: 40px;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 7px 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  background: white;
}

.student-display {
  flex: 1;
  display: flex;
  align-items: center;
}

.placeholder {
  font-size: 14px;
  color: #999;
}

.selected-student {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.student-text {
  font-size: 14px;
  color: #333;
  margin-bottom: 2px;
}

.student-id {
  font-size: 12px;
  color: #999;
}

.arrow {
  color: #999;
  font-size: 12px;
}

/* 学生选择弹窗样式 */
.student-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
}

.student-modal-content {
  background: #fff;
  border-radius: 16rpx;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.modal-title {
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

.modal-body {
  padding: 20rpx 30rpx;
  overflow-y: auto;
  flex: 1;
}

.search-container {
  padding: 0 0 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.search-input {
  width: 100%;
  height: 70rpx;
  border: 2rpx solid #e5e5e5;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  color: #333;
  box-sizing: border-box;
}

.search-input:focus {
  border-color: #667eea;
}

.student-selection-list {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
  padding: 10rpx 0;
}

.student-selection-item {
  display: flex;
  align-items: center;
  padding: 20rpx;
  border: 2rpx solid #e5e5e5;
  border-radius: 8rpx;
  background: #fff;
  transition: all 0.3s;
}

.student-selection-item.selected {
  border-color: #667eea;
  background: #f0f8ff;
}

.student-avatar {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background: #667eea;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.avatar-text {
  font-size: 24rpx;
  color: #fff;
  font-weight: bold;
}

.student-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.student-details {
  font-size: 24rpx;
  color: #999;
  margin-top: 3rpx;
}

.selection-indicator {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background: #e5e5e5;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-left: 20rpx;
}

.selection-indicator.selected {
  background: #667eea;
}

.check-icon {
  font-size: 20rpx;
  color: #fff;
  font-weight: bold;
}

.no-result {
  padding: 40rpx;
  text-align: center;
}

.no-result-text {
  font-size: 28rpx;
  color: #999;
}

.modal-footer {
  display: flex;
  padding: 30rpx;
  gap: 20rpx;
  border-top: 1rpx solid #f0f0f0;
  justify-content: space-between;
  align-items: center;
}

.cancel-btn {
  height: 80rpx;
  border-radius: 8rpx;
  font-size: 28rpx;
  font-weight: bold;
  border: none;
  background: #f0f0f0;
  color: #666;
  padding: 0 30rpx;
}

.confirm-btn-container {
  display: flex;
  justify-content: flex-end;
}

.confirm-btn {
  height: 80rpx;
  border-radius: 8rpx;
  font-size: 28rpx;
  font-weight: bold;
  border: none;
  background: #667eea;
  color: #fff;
  padding: 0 30rpx;
}

/* 科目选择器样式 */
.subject-selector {
  width: 100%;
  min-height: 40px;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 7px 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  background: white;
}

.subject-display {
  flex: 1;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.selected-subjects {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.subject-tag {
  display: flex;
  align-items: center;
  background: #667eea;
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.subject-text {
  margin-right: 4px;
}

.remove-subject {
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
}

/* 多科目成绩录入样式 */
.scores-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.score-input-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.score-label {
  min-width: 60px;
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.score-input {
  flex: 1;
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 0 12px;
  font-size: 14px;
  color: #333;
}

/* 科目选择弹窗样式 */
.subject-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
}

.subject-modal-content {
  background: #fff;
  border-radius: 16rpx;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.subject-selection-list {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
  padding: 10rpx 0;
}

.subject-selection-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx;
  border: 2rpx solid #e5e5e5;
  border-radius: 8rpx;
  background: #fff;
  transition: all 0.3s;
}

.subject-selection-item.selected {
  border-color: #667eea;
  background: #f0f8ff;
}

.subject-name {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

</style> 