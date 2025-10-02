<template>
	<view class="register-page-container">
		<!-- 返回按钮 -->
		<view class="back-btn-container">
			<button class="back-btn" @click="goBackToHome">
				<text class="back-btn-icon">🏠</text>
			</button>
		</view>
		
		<view class="register-section">
			<view class="register-title">注册新账号</view>
			<input v-model="newUsername" placeholder="请输入新账号" class="register-input" />
			<input v-model="newPassword" type="password" placeholder="请输入新密码" class="register-input" />
			<input v-model="newTeacherName" placeholder="请输入姓名" class="register-input" />
			<view class="role-label">请选择该教师的身份</view>
			<view class="role-select">
				<view v-for="(role, idx) in roleOptions" :key="role" :class="['role-btn', {active: newRoleIndex === idx}]" @click="newRoleIndex = idx">{{ role }}</view>
			</view>
			
			<!-- 老师科目选择 -->
			<view v-if="showSubjectSelect" class="subject-section">
				<view class="role-label">请选择教学科目</view>
				<view class="subject-select">
					<view v-for="(subject, idx) in subjectOptions" :key="subject" :class="['subject-btn', {active: newSubjectIndex === idx}]" @click="newSubjectIndex = idx">{{ subject }}</view>
				</view>
			</view>
			
			<!-- 部门选择（仅教师显示） -->
			<view v-if="showSubjectSelect" class="department-section">
				<view class="role-label">
					请选择所属部门
					<text class="optional-tip">（可选，兼职老师可不选）</text>
				</view>
				<view class="department-select">
					<view v-for="(dept, idx) in departmentOptions" :key="dept" :class="['department-btn', {active: newDepartmentIndex === idx}]" @click="newDepartmentIndex = idx">{{ dept }}</view>
				</view>
			</view>
			
			<!-- 工作类型选择（仅教师显示） -->
			<view v-if="showSubjectSelect" class="worktype-section">
				<view class="role-label">请选择工作类型 <text class="required-tip">*</text></view>
				<view class="worktype-select">
					<view v-for="(type, idx) in workTypeOptions" :key="type" :class="['worktype-btn', {active: newWorkTypeIndex === idx}]" @click="newWorkTypeIndex = idx">{{ type }}</view>
				</view>
			</view>
			
			<!-- 上级领导选择（仅教师和教务显示） -->
			<view v-if="showSupervisorSelect" class="supervisor-section">
				<view class="role-label">
					请选择直属上级
					<text class="optional-tip">（可选）</text>
				</view>
				<view class="supervisor-select">
					<view class="supervisor-placeholder" @click="showSupervisorPicker = true">
						<text v-if="selectedSupervisor">{{ selectedSupervisor.teacherName }} ({{ selectedSupervisor.username }})</text>
						<text v-else class="placeholder-text">请选择上级领导</text>
						<text class="arrow-down">▼</text>
					</view>
				</view>
			</view>
			
			<view v-if="showPermissionSelect" class="permission-select">
				<view v-for="(perm, idx) in permissionOptions" :key="perm" :class="['role-btn', {active: newPermissionIndex === idx}]" @click="newPermissionIndex = idx">{{ perm }}</view>
			</view>
			<button @click="registerAccount" class="register-btn">注册</button>
		</view>
		
		<!-- 上级领导选择弹窗 -->
		<view v-if="showSupervisorPicker" class="supervisor-picker-overlay" @click="showSupervisorPicker = false">
			<view class="supervisor-picker-content" @click.stop>
				<view class="picker-header">
					<text class="picker-title">选择上级领导</text>
					<text class="picker-close" @click="showSupervisorPicker = false">×</text>
				</view>
				<view class="supervisor-list">
					<view 
						v-for="supervisor in supervisorList" 
						:key="supervisor._id" 
						class="supervisor-item"
						@click="selectSupervisor(supervisor)"
					>
						<text class="supervisor-name">{{ supervisor.teacherName }}</text>
						<text class="supervisor-username">{{ supervisor.username }}</text>
					</view>
					<view v-if="supervisorList.length === 0" class="no-supervisor">
						<text>暂无可选的上级领导</text>
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
			newUsername: '',
			newPassword: '',
			newTeacherName: '',
			roleOptions: ['教师', '家长', '教务'],
			newRoleIndex: 0,
			subjectOptions: ['语文', '数学', '英语', '物理', '化学'],
			newSubjectIndex: 0,
			departmentOptions: ['小学部', '初中部'],
			newDepartmentIndex: -1, // -1表示未选择
			workTypeOptions: ['全职', '兼职'],
			newWorkTypeIndex: 0,
			permissionOptions: ['普通用户', '管理员'],
			newPermissionIndex: 0,
			showSupervisorPicker: false,
			supervisorList: [],
			selectedSupervisor: null
		}
	},
	computed: {
		showSubjectSelect() {
			const role = this.roleOptions[this.newRoleIndex];
			return role === '教师';
		},
		showPermissionSelect() {
			const role = this.roleOptions[this.newRoleIndex];
			return role === '教师' || role === '教务';
		},
		showSupervisorSelect() {
			const role = this.roleOptions[this.newRoleIndex];
			return role === '教师' || role === '教务';
		}
	},
	methods: {
		goBackToHome() {
			// 返回首页
			uni.navigateBack();
		},
		
		// 获取上级领导列表
		async getSupervisorList() {
			const role = this.roleOptions[this.newRoleIndex];
			if (role !== '教师' && role !== '教务') {
				return;
			}
			
			try {
				const res = await uniCloud.callFunction({
					name: 'user-center',
					data: {
						action: 'getSupervisors',
						params: { role }
					}
				});
				
				if (res.result.code === 200) {
					this.supervisorList = res.result.data;
				} else {
					console.error('获取上级领导列表失败:', res.result.message);
				}
			} catch (error) {
				console.error('获取上级领导列表失败:', error);
			}
		},
		
		// 选择上级领导
		selectSupervisor(supervisor) {
			this.selectedSupervisor = supervisor;
			this.showSupervisorPicker = false;
		},
		async registerAccount() {
			if (!this.newUsername || !this.newPassword) {
				uni.showToast({ title: '请输入账号和密码', icon: 'none' });
				return;
			}
			
			const role = this.roleOptions[this.newRoleIndex];
			const teacherName = this.newTeacherName;
			let permission = '';
			let subject = '';
			let department = '';
			let workType = '';
			let supervisor = '';
			
			if (role === '教师' || role === '教务') {
				permission = this.permissionOptions[this.newPermissionIndex];
			}
			
			if (role === '教师') {
				subject = this.subjectOptions[this.newSubjectIndex];
				workType = this.workTypeOptions[this.newWorkTypeIndex];
				// 部门是可选的，只有选择了才传递
				if (this.newDepartmentIndex >= 0) {
					department = this.departmentOptions[this.newDepartmentIndex];
				}
			}
			
			// 添加上级领导信息
			if (this.selectedSupervisor) {
				supervisor = this.selectedSupervisor._id;
			}
			
			uni.showLoading({
				title: '注册中...'
			});

			uniCloud.callFunction({
				name: 'user-center',
				data: {
					action: 'register',
					params: {
						username: this.newUsername,
						password: this.newPassword,
						teacherName: teacherName,
						role: role,
						permission: permission,
						subject: subject,
						department: department,
						workType: workType,
						supervisor: supervisor
					}
				},
				success: (res) => {
					uni.hideLoading();
					if (res.result.code === 200) {
						uni.showToast({ title: '注册成功', icon: 'success' });
						// 清空表单
						this.newUsername = '';
						this.newPassword = '';
						this.newTeacherName = '';
						this.newRoleIndex = 0;
						this.newSubjectIndex = 0;
						this.newDepartmentIndex = -1;
						this.newWorkTypeIndex = 0;
						this.newPermissionIndex = 0;
						this.selectedSupervisor = null;
					} else {
						uni.showToast({ title: res.result.message || '注册失败', icon: 'none' });
					}
				},
				fail: (err) => {
					uni.hideLoading();
					uni.showToast({ title: '注册请求失败，请稍后再试', icon: 'none' });
					console.error('注册失败', err);
				}
			});
		}
	},
	
	// 监听角色变化，重新获取上级领导列表
	watch: {
		newRoleIndex() {
			this.selectedSupervisor = null;
			this.getSupervisorList();
		}
	},
	
	// 页面加载时获取上级领导列表
	mounted() {
		this.getSupervisorList();
	}
}
</script>

<style>
.register-page-container {
	min-height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	padding: 0 0;
	position: relative;
}

.back-btn-container {
	position: absolute;
	top: 80rpx;
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
}

.back-btn:active {
	transform: scale(0.95);
	box-shadow: 0 4rpx 15rpx rgba(67, 233, 123, 0.3);
}

.back-btn-icon {
	color: #ffffff;
	font-size: 36rpx;
}

.register-section {
	width: 92vw;
	max-width: 600rpx;
	padding: 60rpx 40rpx 50rpx 40rpx;
	background: rgba(255, 255, 255, 0.95);
	border-radius: 35rpx;
	box-shadow: 0 20rpx 60rpx rgba(102, 126, 234, 0.2);
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
	backdrop-filter: blur(20rpx);
	border: 2rpx solid rgba(255, 255, 255, 0.3);
}
.register-title {
	font-size: 42rpx;
	color: #667eea;
	font-weight: bold;
	margin-bottom: 45rpx;
	letter-spacing: 3rpx;
	align-self: center;
	text-shadow: 0 2rpx 4rpx rgba(102, 126, 234, 0.1);
}
.register-input {
	width: 100%;
	height: 100rpx;
	border: 2rpx solid rgba(102, 126, 234, 0.2);
	border-radius: 25rpx;
	margin-bottom: 10rpx;
	padding: 0 30rpx;
	font-size: 30rpx;
	background: rgba(255, 255, 255, 0.8);
	transition: all 0.3s ease;
	backdrop-filter: blur(10rpx);
}
.register-input:focus {
	border: 2rpx solid #667eea;
	background: rgba(255, 255, 255, 0.95);
	box-shadow: 0 8rpx 25rpx rgba(102, 126, 234, 0.15);
	transform: translateY(-2rpx);
}
.role-select {
	display: flex;
	flex-direction: row;
	width: 100%;
	margin-bottom: 0rpx;
	gap: 10rpx;
}
.role-btn {
	flex: 1;
	height: 90rpx;
	line-height: 90rpx;
	border: 2rpx solid rgba(102, 126, 234, 0.2);
	border-radius: 20rpx;
	background: rgba(255, 255, 255, 0.8);
	font-size: 28rpx;
	color: #667eea;
	text-align: center;
	transition: all 0.3s ease;
	font-weight: 500;
	box-shadow: 0 4rpx 15rpx rgba(102, 126, 234, 0.1);
	cursor: pointer;
	backdrop-filter: blur(10rpx);
}
.role-btn.active {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: #fff;
	border-color: #667eea;
	font-weight: bold;
	box-shadow: 0 8rpx 25rpx rgba(102, 126, 234, 0.2);
	transform: translateY(-2rpx);
}
.register-btn {
	width: 100%;
	height: 100rpx;
	line-height: 100rpx;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: #fff;
	border-radius: 25rpx;
	font-size: 36rpx;
	font-weight: bold;
	text-align: center;
	margin-top: 25rpx;
	box-shadow: 0 12rpx 35rpx rgba(102, 126, 234, 0.3);
	letter-spacing: 3rpx;
	transition: all 0.3s ease;
	border: none;
	position: relative;
	overflow: hidden;
}
.register-btn::before {
	content: '';
	position: absolute;
	top: 0;
	left: -100%;
	width: 100%;
	height: 100%;
	background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
	transition: left 0.5s ease;
}
.register-btn:active::before {
	left: 100%;
}
.register-btn:active {
	transform: translateY(3rpx);
	box-shadow: 0 8rpx 25rpx rgba(102, 126, 234, 0.2);
}
.role-label {
	font-size: 28rpx;
	color: #667eea;
	font-weight: 600;
	margin-bottom: 2rpx;
	margin-top: 3rpx;
	align-self: flex-start;
}
.optional-tip {
	font-size: 24rpx;
	color: #999;
	font-weight: normal;
}
.required-tip {
	font-size: 24rpx;
	color: #ff4757;
	font-weight: normal;
}
.permission-select {
	display: flex;
	flex-direction: row;
	width: 100%;
	margin-bottom: 5rpx;
	gap: 5rpx;
}
.subject-section {
	width: 100%;
	margin-top: 30rpx;
	padding: 20rpx 0;
	border-top: 1rpx solid rgba(102, 126, 234, 0.1);
	border-bottom: 1rpx solid rgba(102, 126, 234, 0.1);
}
.subject-select {
	display: flex;
	flex-direction: row;
	width: 100%;
	margin-top: 15rpx;
	gap: 5rpx;
}
.subject-btn {
	flex: 1;
	height: 80rpx;
	line-height: 80rpx;
	border: 2rpx solid rgba(102, 126, 234, 0.2);
	border-radius: 20rpx;
	background: rgba(255, 255, 255, 0.8);
	font-size: 28rpx;
	color: #667eea;
	text-align: center;
	transition: all 0.3s ease;
	font-weight: 500;
	box-shadow: 0 4rpx 15rpx rgba(102, 126, 234, 0.1);
	cursor: pointer;
	backdrop-filter: blur(10rpx);
}
.subject-btn.active {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: #fff;
	border-color: #667eea;
	font-weight: bold;
	box-shadow: 0 8rpx 25rpx rgba(102, 126, 234, 0.2);
	transform: translateY(-2rpx);
}
.department-section {
	width: 100%;
	margin-top: 5rpx;
	padding: 20rpx 0;
	border-top: 1rpx solid rgba(102, 126, 234, 0.1);
	border-bottom: 1rpx solid rgba(102, 126, 234, 0.1);
}
.department-select {
	display: flex;
	flex-direction: row;
	width: 100%;
	margin-top: 15rpx;
	gap: 5rpx;
}
.department-btn {
	flex: 1;
	height: 80rpx;
	line-height: 80rpx;
	border: 2rpx solid rgba(102, 126, 234, 0.2);
	border-radius: 20rpx;
	background: rgba(255, 255, 255, 0.8);
	font-size: 28rpx;
	color: #667eea;
	text-align: center;
	transition: all 0.3s ease;
	font-weight: 500;
	box-shadow: 0 4rpx 15rpx rgba(102, 126, 234, 0.1);
	cursor: pointer;
	backdrop-filter: blur(10rpx);
}
.department-btn.active {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: #fff;
	border-color: #667eea;
	font-weight: bold;
	box-shadow: 0 8rpx 25rpx rgba(102, 126, 234, 0.2);
	transform: translateY(-2rpx);
}
.worktype-section {
	width: 100%;
	margin-top: 5rpx;
	padding: 20rpx 0;
	border-top: 1rpx solid rgba(102, 126, 234, 0.1);
	border-bottom: 1rpx solid rgba(102, 126, 234, 0.1);
}
.worktype-select {
	display: flex;
	flex-direction: row;
	width: 100%;
	margin-top: 15rpx;
	gap: 5rpx;
}
.worktype-btn {
	flex: 1;
	height: 80rpx;
	line-height: 80rpx;
	border: 2rpx solid rgba(102, 126, 234, 0.2);
	border-radius: 20rpx;
	background: rgba(255, 255, 255, 0.8);
	font-size: 28rpx;
	color: #667eea;
	text-align: center;
	transition: all 0.3s ease;
	font-weight: 500;
	box-shadow: 0 4rpx 15rpx rgba(102, 126, 234, 0.1);
	cursor: pointer;
	backdrop-filter: blur(10rpx);
}
.worktype-btn.active {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: #fff;
	border-color: #667eea;
	font-weight: bold;
	box-shadow: 0 8rpx 25rpx rgba(102, 126, 234, 0.2);
	transform: translateY(-2rpx);
}

/* 上级领导选择样式 */
.supervisor-section {
	width: 100%;
	margin-bottom: 10rpx;
	padding: 0;
	border: none;
}

.supervisor-select {
	width: 100%;
	margin-top: 0;
}

.supervisor-placeholder {
	width: 100%;
	height: 100rpx;
	line-height: 100rpx;
	border: 2rpx solid rgba(102, 126, 234, 0.2);
	border-radius: 25rpx;
	background: rgba(255, 255, 255, 0.8);
	font-size: 30rpx;
	color: #667eea;
	padding: 0 30rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	transition: all 0.3s ease;
	box-shadow: 0 4rpx 15rpx rgba(102, 126, 234, 0.1);
	cursor: pointer;
	backdrop-filter: blur(10rpx);
	box-sizing: border-box;
	margin-bottom: 10rpx;
}

.supervisor-placeholder:active {
	border: 2rpx solid #667eea;
	background: rgba(255, 255, 255, 0.95);
	box-shadow: 0 8rpx 25rpx rgba(102, 126, 234, 0.15);
	transform: translateY(-2rpx);
}

.placeholder-text {
	color: #999;
}

.arrow-down {
	font-size: 24rpx;
	color: #667eea;
}

/* 上级领导选择弹窗样式 */
.supervisor-picker-overlay {
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
}

.supervisor-picker-content {
	width: 80vw;
	max-width: 600rpx;
	max-height: 70vh;
	background: #fff;
	border-radius: 20rpx;
	overflow: hidden;
	box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.3);
}

.picker-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 30rpx 40rpx;
	border-bottom: 1rpx solid #f0f0f0;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: #fff;
}

.picker-title {
	font-size: 32rpx;
	font-weight: bold;
}

.picker-close {
	font-size: 40rpx;
	cursor: pointer;
	padding: 10rpx;
}

.supervisor-list {
	max-height: 50vh;
	overflow-y: auto;
}

.supervisor-item {
	display: flex;
	flex-direction: column;
	padding: 30rpx 40rpx;
	border-bottom: 1rpx solid #f0f0f0;
	cursor: pointer;
	transition: background 0.2s;
}

.supervisor-item:active {
	background: #f5f5f5;
}

.supervisor-item:last-child {
	border-bottom: none;
}

.supervisor-name {
	font-size: 30rpx;
	color: #333;
	font-weight: 500;
	margin-bottom: 8rpx;
}

.supervisor-username {
	font-size: 24rpx;
	color: #999;
}

.no-supervisor {
	padding: 60rpx 40rpx;
	text-align: center;
	color: #999;
	font-size: 28rpx;
}
</style> 