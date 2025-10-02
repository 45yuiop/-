<template>
	<view class="account-manage-page">
		<view class="register-title">账号管理</view>
		<view class="search-bar">
			<input v-model="searchText" placeholder="搜索姓名/角色/科目" class="search-input" @confirm="searchAccounts" />
			<button class="search-btn" @click="searchAccounts">搜索</button>
		</view>
		<view v-for="acc in filteredAccountList" :key="acc.username" class="account-item">
			<view class="account-info">
				<text class="account-name">{{ acc.teacherName || '未设置姓名' }}</text>
				<text class="account-role">{{ acc.role }}</text>
				<view class="account-tags">
					<text v-if="acc.subject" class="tag tag-subject">{{ acc.subject }}</text>
					<text v-if="acc.department" class="tag tag-department">{{ acc.department }}</text>
					<text v-if="acc.workType" class="tag tag-worktype">{{ acc.workType }}</text>
					<text class="tag tag-permission">{{ acc.permission || '无权限' }}</text>
				</view>
			</view>
			<view class="account-actions">
				<button class="edit-btn beautify-btn" @click="openEdit(acc)">修改</button>
				<button class="delete-btn beautify-btn" @click="openDelete(acc)">删除</button>
			</view>
		</view>

		<!-- 悬浮底部返回按钮 -->
		<view class="fixed-bottom-bar">
			<button class="back-btn" @click="goBack">返回</button>
		</view>

		<!-- 编辑弹窗 -->
		<view v-if="showEdit" class="edit-modal">
			<view class="edit-modal-content">
				<view class="edit-title">修改账号信息</view>
				<view class="edit-label">账号</view>
				<input v-model="editUsername" placeholder="账号" class="edit-input" />
				<view class="edit-label">密码</view>
				<input v-model="editPassword" placeholder="留空则不修改密码" class="edit-input" />
				<view class="edit-label">姓名</view>
				<input v-model="editTeacherName" placeholder="姓名" class="edit-input" />
				<view class="edit-label">角色</view>
				<view class="edit-role-select">
					<view v-for="(role, idx) in editRoleOptions" :key="role" :class="['role-btn', {active: editRoleIndex === idx}]" @click="onEditRoleChange(idx)">{{ role }}</view>
				</view>
				<!-- 老师科目选择 -->
				<view v-if="editShowSubjectSelect" class="edit-label">教学科目</view>
				<view v-if="editShowSubjectSelect" class="edit-subject-select">
					<view v-for="(subject, idx) in editSubjectOptions" :key="subject" :class="['subject-btn', {active: editSubjectIndex === idx}]" @click="onEditSubjectChange(idx)">{{ subject }}</view>
				</view>
				<!-- 部门选择 -->
				<view v-if="editShowSubjectSelect" class="edit-label">所属部门</view>
				<view v-if="editShowSubjectSelect" class="edit-department-select">
					<view v-for="(dept, idx) in editDepartmentOptions" :key="dept" :class="['department-btn', {active: editDepartmentIndex === idx}]" @click="onEditDepartmentChange(idx)">{{ dept }}</view>
				</view>
				<!-- 工作类型选择 -->
				<view v-if="editShowSubjectSelect" class="edit-label">工作类型</view>
				<view v-if="editShowSubjectSelect" class="edit-worktype-select">
					<view v-for="(type, idx) in editWorkTypeOptions" :key="type" :class="['worktype-btn', {active: editWorkTypeIndex === idx}]" @click="onEditWorkTypeChange(idx)">{{ type }}</view>
				</view>
				<view v-if="editShowPermissionSelect" class="edit-label">权限</view>
				<view v-if="editShowPermissionSelect" class="edit-permission-select">
					<view v-for="(permission, idx) in editPermissionOptions" :key="permission" :class="['permission-btn', {active: editPermissionIndex === idx}]" @click="onEditPermissionChange(idx)">{{ permission }}</view>
				</view>
				<!-- 直属上级选择（仅教师和教务显示） -->
				<view v-if="editShowSupervisorSelect" class="edit-label">直属上级（可选）</view>
				<view v-if="editShowSupervisorSelect" class="edit-supervisor-select">
					<view class="supervisor-placeholder" @click="editShowSupervisorPicker = true">
						<text v-if="editSelectedSupervisor">{{ editSelectedSupervisor.teacherName }} ({{ editSelectedSupervisor.username }})</text>
						<text v-else class="placeholder-text">请选择上级领导</text>
						<text class="arrow-down">▼</text>
					</view>
				</view>
				<!-- 直属上级选择弹窗 -->
				<view v-if="editShowSupervisorPicker" class="supervisor-picker-overlay" @click="editShowSupervisorPicker = false">
					<view class="supervisor-picker-content" @click.stop>
						<view class="picker-header">
							<text class="picker-title">选择上级领导</text>
							<text class="picker-close" @click="editShowSupervisorPicker = false">×</text>
						</view>
						<view class="supervisor-list">
							<view v-for="supervisor in editSupervisorList" :key="supervisor._id" class="supervisor-item" @click="selectEditSupervisor(supervisor)">
								<text class="supervisor-name">{{ supervisor.teacherName }}</text>
								<text class="supervisor-username">{{ supervisor.username }}</text>
							</view>
							<view v-if="editSupervisorList.length === 0" class="no-supervisor">
								<text>暂无可选的上级领导</text>
							</view>
						</view>
					</view>
				</view>
				<view class="edit-modal-btns">
					<button class="register-btn" @click="saveEdit">保存</button>
					<button class="cancel-btn" @click="showEdit=false">取消</button>
				</view>
			</view>
		</view>

		<!-- 自定义删除确认弹窗 -->
		<view v-if="showDeleteModal" class="edit-modal">
			<view class="delete-modal-content">
				<view class="delete-title">确认删除</view>
				<view class="delete-content">确定要删除该账号吗？此操作不可恢复。</view>
				<view class="edit-modal-btns">
					<button class="cancel-btn" @click="showDeleteModal=false">取消</button>
					<button class="confirm-delete-btn" @click="doDeleteAccount">确认</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			showEdit: false,
			editOriginUsername: '',
			editUsername: '',
			editPassword: '',
			editTeacherName: '',
			editRoleOptions: ['教师', '家长', '教务'],
			editRoleIndex: 0,
			editSubjectOptions: [
				'语文', '数学', '英语', '物理', '化学'
			],
			editSubjectIndex: 0,
			editDepartmentOptions: ['小学部', '初中部'],
			editDepartmentIndex: -1, // -1表示未选择
			editWorkTypeOptions: ['全职', '兼职'],
			editWorkTypeIndex: 0,
			editPermissionOptions: ['普通用户', '管理员'],
			editPermissionIndex: 0,
			// 新增直属上级相关变量
			editSupervisorList: [],
			editSelectedSupervisor: null,
			editShowSupervisorPicker: false,
			showDeleteModal: false,
			deleteUsername: '',
			deleteUid: '',
			searchText: '',
			accountList: []
		}
	},
	computed: {
		editShowSubjectSelect() {
			const role = this.editRoleOptions[this.editRoleIndex];
			return role === '教师';
		},
		editShowPermissionSelect() {
			const role = this.editRoleOptions[this.editRoleIndex];
			return role !== '家长';
		},
		editShowSupervisorSelect() {
			const role = this.editRoleOptions[this.editRoleIndex];
			return role === '教师' || role === '教务';
		},
		filteredAccountList() {
			return this.accountList.filter(acc => 
				(acc.teacherName && acc.teacherName.includes(this.searchText)) || 
				acc.role.includes(this.searchText) ||
				(acc.subject && acc.subject.includes(this.searchText))
			);
		}
	},
	onShow() {
		this.fetchAccountList();
	},
	methods: {
		fetchAccountList() {
			uniCloud.callFunction({
				name: 'user-center',
				data: { action: 'get-accounts' },
				success: (res) => {
					if (res.result && res.result.code === 200) {
						this.accountList = res.result.data;
					}
				},
				fail: (err) => {
					console.error('获取账号列表失败', err);
				}
			});
		},
		async fetchEditSupervisorList(role) {
			if (role !== '教师' && role !== '教务') {
				this.editSupervisorList = [];
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
					this.editSupervisorList = res.result.data;
				} else {
					this.editSupervisorList = [];
				}
			} catch (e) {
				this.editSupervisorList = [];
			}
		},
		selectEditSupervisor(supervisor) {
			this.editSelectedSupervisor = supervisor;
			this.editShowSupervisorPicker = false;
		},
		openDelete(acc) {
			this.deleteUsername = acc.username;
			this.deleteUid = acc._id;
			this.showDeleteModal = true;
		},
		doDeleteAccount() {
			uniCloud.callFunction({
				name: 'user-center',
				data: { 
					action: 'delete-account',
					params: { id: this.deleteUid }
				},
				success: (res) => {
					const data = res.result;
					if (data.code === 200) {
						this.fetchAccountList();
						this.showDeleteModal = false;
						uni.showToast({ title: '账号已删除', icon: 'success' });
					} else {
						uni.showToast({ title: data.message || '删除账号失败', icon: 'none' });
					}
				},
				fail: (err) => {
					console.error('删除账号请求失败', err);
					uni.showToast({ title: '删除账号失败', icon: 'none' });
				}
			});
		},
		openEdit(acc) {
			this.editOriginUsername = acc.username;
			this.editUid = acc._id;
			this.editUsername = acc.username;
			this.editPassword = '';
			this.editTeacherName = acc.teacherName || '';
			this.editRoleIndex = this.editRoleOptions.indexOf(acc.role) > -1 ? this.editRoleOptions.indexOf(acc.role) : 0;
			this.editSubjectIndex = this.editSubjectOptions.indexOf(acc.subject) > -1 ? this.editSubjectOptions.indexOf(acc.subject) : 0;
			this.editDepartmentIndex = acc.department && this.editDepartmentOptions.indexOf(acc.department) > -1 ? this.editDepartmentOptions.indexOf(acc.department) : -1;
			this.editWorkTypeIndex = this.editWorkTypeOptions.indexOf(acc.workType) > -1 ? this.editWorkTypeOptions.indexOf(acc.workType) : 0;
			this.editPermissionIndex = this.editPermissionOptions.indexOf(acc.permission) > -1 ? this.editPermissionOptions.indexOf(acc.permission) : 0;
			this.editSelectedSupervisor = null;
			this.fetchEditSupervisorList(acc.role);
			if (acc.supervisor) {
				// 查找并设置当前直属上级
				const found = this.editSupervisorList.find(item => item._id === acc.supervisor);
				if (found) {
					this.editSelectedSupervisor = found;
				} else {
					// 需要异步拉取
					this.editSelectedSupervisor = { _id: acc.supervisor, teacherName: '已选上级', username: '' };
				}
			}
			this.showEdit = true;
		},
		onEditRoleChange(idx) {
			this.editRoleIndex = idx;
			const role = this.editRoleOptions[idx];
			this.fetchEditSupervisorList(role);
			this.editSelectedSupervisor = null;
		},
		onEditSubjectChange(idx) {
			this.editSubjectIndex = idx;
		},
		onEditDepartmentChange(idx) {
			this.editDepartmentIndex = idx;
		},
		onEditWorkTypeChange(idx) {
			this.editWorkTypeIndex = idx;
		},
		onEditPermissionChange(idx) {
			this.editPermissionIndex = idx;
		},
		saveEdit() {
			if (!this.editUsername) {
				uni.showToast({ title: '账号不能为空', icon: 'none' });
				return;
			}
			
			const selectedRole = this.editRoleOptions[this.editRoleIndex];
			let permission = '';
			let subject = '';
			let department = '';
			let workType = '';
			
			if (selectedRole !== '家长') {
				permission = this.editPermissionOptions[this.editPermissionIndex];
			}
			
			if (selectedRole === '教师') {
				subject = this.editSubjectOptions[this.editSubjectIndex];
			}

			if (selectedRole === '教师') {
				subject = this.editSubjectOptions[this.editSubjectIndex];
				workType = this.editWorkTypeOptions[this.editWorkTypeIndex];
				// 部门是可选的，只有选择了才传递
				if (this.editDepartmentIndex >= 0) {
					department = this.editDepartmentOptions[this.editDepartmentIndex];
				}
			}
			
			const dataToSend = {
				id: this.editUid,
				username: this.editUsername,
				teacherName: this.editTeacherName,
				role: selectedRole,
				permission: permission,
				subject: subject,
				department: department,
				workType: workType,
				supervisor: this.editSelectedSupervisor ? this.editSelectedSupervisor._id : ''
			};
			// 只有填写了密码才传递
			if (this.editPassword) {
				dataToSend.password = this.editPassword;
			}
			
			uniCloud.callFunction({
				name: 'user-center',
				data: {
					action: 'update-account',
					params: dataToSend
				},
				success: (res) => {
					const data = res.result;
					if (data.code === 200) {
						this.fetchAccountList();
						this.showEdit = false;
						uni.showToast({ title: '修改成功', icon: 'success' });
					} else {
						uni.showToast({ title: data.message || '修改账号失败', icon: 'none' });
					}
				},
				fail: (err) => {
					console.error('修改账号请求失败', err);
					uni.showToast({ title: '修改账号失败', icon: 'none' });
				}
			});
		},
		goBack() {
			uni.navigateBack();
		},
		searchAccounts() {
			// 只做本地过滤，不重新请求
		},
		resetPassword() {
			// 生成随机密码
			const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
			let newPassword = '';
			for (let i = 0; i < 8; i++) {
				newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
			}
			
			this.editPassword = newPassword;
			
			uni.showModal({
				title: '密码已重设',
				content: `新密码：${newPassword}\n\n请将此密码告知用户，建议用户登录后及时修改密码。`,
				showCancel: false,
				confirmText: '确定'
			});
		}
	}
}
</script>

<style>
.account-manage-page {
	margin: 40rpx auto 0 auto;
	padding: 40rpx;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	border-radius: 25rpx;
	box-shadow: 0 20rpx 60rpx rgba(102, 126, 234, 0.2);
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	box-sizing: border-box;
}

.register-title {
	font-size: 42rpx;
	color: #ffffff;
	font-weight: bold;
	text-align: center;
	margin-bottom: 40rpx;
	letter-spacing: 3rpx;
	text-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.2);
}

.search-bar {
	display: flex;
	gap: 20rpx;
	margin-bottom: 30rpx;
}

.search-input {
	flex: 1;
	height: 80rpx;
	border: 2rpx solid rgba(255, 255, 255, 0.3);
	border-radius: 25rpx;
	padding: 0 25rpx;
	font-size: 28rpx;
	background: rgba(255, 255, 255, 0.9);
	backdrop-filter: blur(10rpx);
	transition: all 0.3s ease;
}

.search-input:focus {
	border: 2rpx solid #ffffff;
	background: rgba(255, 255, 255, 0.95);
	box-shadow: 0 8rpx 25rpx rgba(255, 255, 255, 0.2);
}

.search-btn {
	width: 120rpx;
	height: 80rpx;
	background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
	color: #ffffff;
	border: none;
	border-radius: 25rpx;
	font-size: 28rpx;
	font-weight: bold;
	box-shadow: 0 8rpx 25rpx rgba(255, 154, 158, 0.3);
	transition: all 0.3s ease;
}

.search-btn:active {
	transform: translateY(2rpx);
	box-shadow: 0 4rpx 15rpx rgba(255, 154, 158, 0.2);
}

.account-item {
	background: rgba(255, 255, 255, 0.95);
	border-radius: 20rpx;
	padding: 25rpx;
	margin-bottom: 20rpx;
	display: flex;
	align-items: flex-start;
	justify-content: flex-start;
	box-shadow: 0 8rpx 25rpx rgba(0, 0, 0, 0.1);
	backdrop-filter: blur(10rpx);
	border: 2rpx solid rgba(255, 255, 255, 0.3);
	transition: all 0.3s ease;
}

.account-item:hover {
	transform: translateY(-2rpx);
	box-shadow: 0 12rpx 35rpx rgba(0, 0, 0, 0.15);
}

.account-info {
	display: flex;
	flex-direction: column;
	flex: 1;
	min-width: 0;
}

.account-name {
	font-size: 32rpx;
	color: #333;
	font-weight: bold;
}

.account-role {
	font-size: 28rpx;
	color: #667eea;
	font-weight: 500;
}

.account-subject {
	font-size: 24rpx;
	color: #4CAF50;
	background: rgba(76, 175, 80, 0.1);
	padding: 4rpx 12rpx;
	border-radius: 12rpx;
	font-weight: 500;
	align-self: flex-start;
}

.account-permission {
	font-size: 26rpx;
	color: #999;
	font-weight: 400;
}

.account-department {
	font-size: 24rpx;
	color: #555;
	background: rgba(102, 126, 234, 0.05);
	padding: 4rpx 12rpx;
	border-radius: 12rpx;
	font-weight: 500;
	align-self: flex-start;
	margin-top: 8rpx;
}

.account-worktype {
	font-size: 24rpx;
	color: #555;
	background: rgba(255, 154, 158, 0.05);
	padding: 4rpx 12rpx;
	border-radius: 12rpx;
	font-weight: 500;
	align-self: flex-start;
	margin-top: 8rpx;
}

.account-actions {
	display: flex;
	flex-direction: row;
	gap: 20rpx;
	margin-top: 12rpx;
}

.beautify-btn {
	width: 120rpx;
	height: 60rpx;
	border: none;
	border-radius: 15rpx;
	font-size: 26rpx;
	font-weight: bold;
	margin-left: 15rpx;
	transition: all 0.3s ease;
}

.edit-btn {
	background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
	color: #ffffff;
	box-shadow: 0 6rpx 20rpx rgba(168, 237, 234, 0.3);
}

.edit-btn:active {
	transform: translateY(2rpx);
	box-shadow: 0 4rpx 15rpx rgba(168, 237, 234, 0.2);
}

.delete-btn {
	background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
	color: #ffffff;
	box-shadow: 0 6rpx 20rpx rgba(255, 154, 158, 0.3);
}

.delete-btn:active {
	transform: translateY(2rpx);
	box-shadow: 0 4rpx 15rpx rgba(255, 154, 158, 0.2);
}

.register-btn {
	width: 200rpx;
	height: 80rpx;
	line-height: 80rpx;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: #ffffff;
	border: none;
	border-radius: 25rpx;
	font-size: 30rpx;
	font-weight: bold;
	box-shadow: 0 12rpx 35rpx rgba(102, 126, 234, 0.3);
	transition: all 0.3s ease;
	letter-spacing: 2rpx;
}

.register-btn:active {
	transform: translateY(3rpx);
	box-shadow: 0 8rpx 25rpx rgba(102, 126, 234, 0.2);
}

.edit-modal {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
	backdrop-filter: blur(10rpx);
}

.edit-modal-content {
	width: 85%;
	max-width: 600rpx;
	background: rgba(255, 255, 255, 0.95);
	border-radius: 30rpx;
	padding: 50rpx 40rpx;
	box-shadow: 0 25rpx 80rpx rgba(0, 0, 0, 0.2);
	backdrop-filter: blur(20rpx);
	border: 2rpx solid rgba(255, 255, 255, 0.3);
}

.edit-title {
	font-size: 38rpx;
	color: #667eea;
	font-weight: bold;
	text-align: center;
	margin-bottom: 40rpx;
	letter-spacing: 2rpx;
}

.edit-label {
	font-size: 28rpx;
	color: #667eea;
	font-weight: 600;
	margin-bottom: 15rpx;
}

.edit-input {
	width: 100%;
	height: 80rpx;
	border: 2rpx solid rgba(102, 126, 234, 0.2);
	border-radius: 20rpx;
	padding: 0 25rpx;
	font-size: 28rpx;
	background: rgba(255, 255, 255, 0.8);
	margin-bottom: 25rpx;
	transition: all 0.3s ease;
	box-sizing: border-box;
}

.edit-input:focus {
	border: 2rpx solid #667eea;
	background: rgba(255, 255, 255, 0.95);
	box-shadow: 0 8rpx 25rpx rgba(102, 126, 234, 0.15);
}

.edit-role-select, .edit-permission-select, .edit-subject-select {
	display: flex;
	gap: 15rpx;
	margin-bottom: 25rpx;
}

.role-btn, .permission-btn, .subject-btn {
	flex: 1;
	height: 70rpx;
	line-height: 70rpx;
	border: 2rpx solid rgba(102, 126, 234, 0.2);
	border-radius: 15rpx;
	background: rgba(255, 255, 255, 0.8);
	font-size: 26rpx;
	color: #667eea;
	text-align: center;
	transition: all 0.3s ease;
	font-weight: 500;
}

.role-btn.active, .permission-btn.active, .subject-btn.active {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: #ffffff;
	border-color: #667eea;
	font-weight: bold;
	box-shadow: 0 6rpx 20rpx rgba(102, 126, 234, 0.2);
}

.edit-modal-btns {
	display: flex;
	gap: 20rpx;
	margin-top: 40rpx;
}

.cancel-btn {
	flex: 1;
	height: 80rpx;
	line-height: 80rpx;
	background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
	color: #ffffff;
	border: none;
	border-radius: 20rpx;
	font-size: 28rpx;
	font-weight: bold;
	box-shadow: 0 8rpx 25rpx rgba(255, 154, 158, 0.3);
	transition: all 0.3s ease;
}

.cancel-btn:active {
	transform: translateY(2rpx);
	box-shadow: 0 4rpx 15rpx rgba(255, 154, 158, 0.2);
}

.confirm-delete-btn {
	flex: 1;
	height: 80rpx;
	line-height: 80rpx;
	background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
	color: #ffffff;
	border: none;
	border-radius: 20rpx;
	font-size: 28rpx;
	font-weight: bold;
	box-shadow: 0 8rpx 25rpx rgba(255, 107, 107, 0.3);
	transition: all 0.3s ease;
}

.confirm-delete-btn:active {
	transform: translateY(2rpx);
	box-shadow: 0 4rpx 15rpx rgba(255, 107, 107, 0.2);
}

.delete-modal-content {
	width: 85%;
	max-width: 500rpx;
	background: rgba(255, 255, 255, 0.95);
	border-radius: 30rpx;
	padding: 50rpx 40rpx;
	box-shadow: 0 25rpx 80rpx rgba(0, 0, 0, 0.2);
	backdrop-filter: blur(20rpx);
	border: 2rpx solid rgba(255, 255, 255, 0.3);
}

.delete-title {
	font-size: 36rpx;
	color: #ff6b6b;
	font-weight: bold;
	text-align: center;
	margin-bottom: 30rpx;
}

.delete-content {
	font-size: 28rpx;
	color: #666;
	text-align: center;
	margin-bottom: 40rpx;
	line-height: 1.5;
}

.password-input-container {
	position: relative;
}

.reset-password-btn {
	position: absolute;
	right: 10rpx;
	top: 50%;
	transform: translateY(-50%);
	background: none;
	border: none;
	font-size: 26rpx;
	color: #667eea;
	font-weight: 500;
}

.fixed-bottom-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background: transparent;
  display: flex;
  justify-content: center;
  padding-bottom: env(safe-area-inset-bottom);
}
.back-btn {
  width: 80vw;
  max-width: 400rpx;
  height: 88rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-radius: 44rpx;
  font-size: 32rpx;
  box-shadow: 0 4rpx 16rpx rgba(102,126,234,0.12);
}

.edit-subject-select {
	display: flex;
	flex-direction: row;
	width: 100%;
	margin-bottom: 20rpx;
	gap: 20rpx;
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
.edit-department-select {
	display: flex;
	flex-direction: row;
	width: 100%;
	margin-bottom: 20rpx;
	gap: 20rpx;
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
.edit-worktype-select {
	display: flex;
	flex-direction: row;
	width: 100%;
	margin-bottom: 20rpx;
	gap: 20rpx;
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
.edit-supervisor-select {
	width: 90%;
	margin: 15rpx auto 0 auto;
	margin-left: -10rpx;
	padding-left: 0;
}
.supervisor-placeholder {
	width: 100%;
	min-width: 180rpx;
	max-width: 100%;
	height: 80rpx;
	line-height: 80rpx;
	border: 2rpx solid rgba(102, 126, 234, 0.2);
	border-radius: 20rpx;
	background: rgba(255, 255, 255, 0.8);
	font-size: 28rpx;
	color: #667eea;
	padding: 0 30rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	transition: all 0.3s ease;
	box-shadow: 0 4rpx 15rpx rgba(102, 126, 234, 0.1);
	cursor: pointer;
	backdrop-filter: blur(10rpx);
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
.account-tags {
	display: flex;
	align-items: center;
	gap: 24rpx;
	margin-top: 8rpx;
	margin-bottom: 2rpx;
	flex-wrap: wrap;
}
.tag {
	white-space: nowrap;
	padding: 8rpx 28rpx;
	border-radius: 16rpx;
	font-size: 26rpx;
	font-weight: 500;
	background: #f0f0f0;
	color: #666;
	box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04);
	border: 1rpx solid #eee;
}
.tag-subject {
	background: rgba(76, 175, 80, 0.12);
	color: #4CAF50;
}
.tag-department {
	background: rgba(33, 150, 243, 0.12);
	color: #2196F3;
}
.tag-worktype {
	background: rgba(255, 193, 7, 0.12);
	color: #FFC107;
}
.tag-permission {
	background: rgba(255, 87, 34, 0.12);
	color: #FF5722;
}
</style> 