'use strict';
const db = uniCloud.database();
const dbCmd = db.command;
const crypto = require('crypto');

// 简单的密码加密函数
function hashPassword(password) {
	return crypto.createHash('sha256').update(password).digest('hex');
}

// 验证密码
function verifyPassword(password, hashedPassword) {
	return hashPassword(password) === hashedPassword;
}

exports.main = async (event, context) => {
	const {
		action,
		params
	} = event;
	let res = {};

	switch (action) {
		case 'register':
			try {
				const { username, password, teacherName, role, permission, subject, department, workType, supervisor } = params;
				
				// 检查用户是否已存在
				const existingUser = await db.collection('uni-id-users').where({
					username: username
				}).get();
				
				if (existingUser.data.length > 0) {
					return {
						code: 400,
						message: '用户名已存在'
					};
				}
				
				// 创建新用户
				const hashedPassword = hashPassword(password);
				let featureList = undefined;
				// 判断是否为管理员
				if ((permission && permission === '管理员') || (Array.isArray(role) ? role.includes('管理员') : role === '管理员')) {
					featureList = ['register']; // 可扩展更多默认功能
				}
				const userData = {
					username: username,
					password: hashedPassword,
					teacherName: teacherName || '',
					role: Array.isArray(role) ? role : [role],
					permission: permission || '普通用户',
					register_date: new Date()
				};
				
				// 如果是教师，添加科目、部门和工作类型信息
				if (role === '教师') {
					if (subject) {
						userData.subject = subject;
					}
					if (workType) {
						userData.workType = workType;
					}
					if (department) {
						userData.department = department;
					}
				}
				
				// 添加上级领导信息
				if (supervisor) {
					userData.supervisor = supervisor;
				}
				
				if (featureList) userData.featureList = featureList;
				const result = await db.collection('uni-id-users').add(userData);
				
				res = {
					code: 200,
					message: '注册成功',
					data: { uid: result.id }
				};
			} catch (e) {
				console.error('注册失败:', e);
				res = {
					code: 500,
					message: `注册失败: ${e.message}`
				};
			}
			break;
			
		case 'login':
			try {
				const { username, password } = params;
				
				// 查找用户
				const userResult = await db.collection('uni-id-users').where({
					username: username
				}).get();
				
				if (userResult.data.length === 0) {
					return {
						code: 400,
						message: '用户名或密码错误'
					};
				}
				
				const user = userResult.data[0];
				
				// 验证密码
				if (!verifyPassword(password, user.password)) {
					return {
						code: 400,
						message: '用户名或密码错误'
					};
				}
				
				// 生成简单的token（实际项目中应该使用JWT）
				const token = crypto.createHash('md5').update(username + Date.now()).digest('hex');
				
				res = {
					code: 200,
					message: '登录成功',
					data: {
						token: token,
						userInfo: {
							uid: user._id,
							username: user.username,
							teacherName: user.teacherName,
							role: user.role,
							permission: user.permission,
							subject: user.subject || '',
							department: user.department || '',
							workType: user.workType || '',
							featureList: user.featureList || [],
							supervisor: user.supervisor || ''
						}
					}
				};
			} catch (e) {
				console.error('登录失败:', e);
				res = {
					code: 500,
					message: `登录失败: ${e.message}`
				};
			}
			break;
			
		case 'checkToken':
			try {
				const { uniIdToken } = event;
				if (!uniIdToken) {
					return {
						code: 401,
						message: 'Token无效'
					};
				}
				
				// 这里简化处理，实际项目中应该验证token的有效性
				res = {
					code: 200,
					message: 'Token有效'
				};
			} catch (e) {
				res = {
					code: 401,
					message: 'Token验证失败'
				};
			}
			break;
			
		case 'get-accounts':
			try {
				const accounts = await db.collection('uni-id-users').where({
					role: dbCmd.nin(['超级管理员'])
				}).get();
				
				const processedData = accounts.data.map(({
					password,
					...rest
				}) => ({
					...rest,
					role: Array.isArray(rest.role) ? rest.role[0] : rest.role
				}));
				
				res = {
					code: 200,
					message: '获取成功',
					data: processedData
				};
			} catch (e) {
				console.error('获取账号列表失败:', e);
				res = {
					code: 500,
					message: `获取账号列表失败: ${e.message}`
				};
			}
			break;
			
		case 'update-account':
			try {
				const { id, ...updateData } = params;
				// 如果包含密码，需要加密
				if (updateData.password) {
					updateData.password = hashPassword(updateData.password);
				} else {
					// 检查数据库原有密码是否为空
					const user = await db.collection('uni-id-users').doc(id).get();
					const oldPassword = user.data[0]?.password || '';
					if (!oldPassword) {
						// 原密码为空，自动重置为默认密码123456
						updateData.password = hashPassword('123456');
					}
				}
				// 确保角色字段是数组格式
				if (updateData.role && !Array.isArray(updateData.role)) {
					updateData.role = [updateData.role];
				}
				// 如果不是教师，清除科目信息
				if (updateData.role && !Array.isArray(updateData.role) && updateData.role !== '教师') {
					updateData.subject = '';
				}
				await db.collection('uni-id-users').doc(id).update(updateData);
				
				res = {
					code: 200,
					message: '更新成功'
				};
			} catch (e) {
				console.error('更新账号失败:', e);
				res = {
					code: 500,
					message: `更新账号失败: ${e.message}`
				};
			}
			break;
			
		case 'verify-password':
			try {
				const { username, password } = params;
				
				// 查找用户
				const userResult = await db.collection('uni-id-users').where({
					username: username
				}).get();
				
				if (userResult.data.length === 0) {
					return {
						code: 400,
						message: '用户不存在'
					};
				}
				
				const user = userResult.data[0];
				
				// 验证密码
				if (!verifyPassword(password, user.password)) {
					return {
						code: 400,
						message: '当前密码错误'
					};
				}
				
				res = {
					code: 200,
					message: '密码验证成功'
				};
			} catch (e) {
				console.error('密码验证失败:', e);
				res = {
					code: 500,
					message: `密码验证失败: ${e.message}`
				};
			}
			break;
			
		case 'update-password':
			try {
				const { username, newPassword } = params;
				// 验证新密码为6-20位数字
				if (!/^\d{6,20}$/.test(newPassword)) {
					return {
						code: 400,
						message: '新密码必须为6-20位数字'
					};
				}
				// 查找用户
				const userResult = await db.collection('uni-id-users').where({
					username: username
				}).get();
				if (userResult.data.length === 0) {
					return {
						code: 400,
						message: '用户不存在'
					};
				}
				const user = userResult.data[0];
				// 更新密码
				const hashedNewPassword = hashPassword(newPassword);
				await db.collection('uni-id-users').doc(user._id).update({
					password: hashedNewPassword
				});
				res = {
					code: 200,
					message: '密码修改成功'
				};
			} catch (e) {
				console.error('修改密码失败:', e);
				res = {
					code: 500,
					message: `修改密码失败: ${e.message}`
				};
			}
			break;
			
		case 'delete-account':
			try {
				const { id } = params;
				await db.collection('uni-id-users').doc(id).remove();
				
				res = {
					code: 200,
					message: '删除成功'
				};
			} catch (e) {
				console.error('删除账号失败:', e);
				res = {
					code: 500,
					message: `删除账号失败: ${e.message}`
				};
			}
			break;
			
		case 'getTeachers':
			try {
				const { data: teacherData } = await db.collection('uni-id-users')
					.where({
						role: dbCmd.elemMatch(dbCmd.eq('教师'))
					})
					.field({ 'username': 1, 'teacherName': 1, '_id': 1 })
					.get();
				
				res = {
					code: 200,
					message: '获取成功',
					data: teacherData
				};
			} catch (e) {
				console.error('获取教师列表失败:', e);
				res = {
					code: 500,
					message: `获取教师列表失败: ${e.message}`
				};
			}
			break;
			
		case 'getAllUsersByRole':
			try {
				const { role } = params;
				if (!role) {
					return {
						code: 400,
						message: '缺少角色参数'
					};
				}
				
				// 根据角色查询用户
				let query = {};
				if (role === 'teacher') {
					// 查询教师角色
					query = {
						role: dbCmd.elemMatch(dbCmd.eq('教师'))
					};
				} else if (role === 'admin') {
					// 查询管理员角色
					query = {
						role: dbCmd.elemMatch(dbCmd.eq('管理员'))
					};
				} else {
					// 查询指定角色
					query = {
						role: dbCmd.elemMatch(dbCmd.eq(role))
					};
				}
				
				const { data: userData } = await db.collection('uni-id-users')
					.where(query)
					.field({ 'username': 1, 'teacherName': 1, '_id': 1, 'role': 1 })
					.get();
				
				res = {
					code: 200,
					message: '获取成功',
					data: userData
				};
			} catch (e) {
				console.error('根据角色获取用户列表失败:', e);
				res = {
					code: 500,
					message: `根据角色获取用户列表失败: ${e.message}`
				};
			}
			break;
			
		case 'getSupervisors':
			try {
				const { role } = params;
				if (!role) {
					return {
						code: 400,
						message: '缺少角色参数'
					};
				}
				
				// 根据角色查询可选的上级领导
				let query = {};
				if (role === '教师') {
					// 教师只能选择教师作为上级
					query = {
						role: dbCmd.elemMatch(dbCmd.eq('教师'))
					};
				} else if (role === '教务') {
					// 教务只能选择教务作为上级
					query = {
						role: dbCmd.elemMatch(dbCmd.eq('教务'))
					};
				} else {
					return {
						code: 400,
						message: '不支持的角色类型'
					};
				}
				
				const { data: supervisorData } = await db.collection('uni-id-users')
					.where(query)
					.field({ 'username': 1, 'teacherName': 1, '_id': 1, 'role': 1 })
					.get();
				
				res = {
					code: 200,
					message: '获取成功',
					data: supervisorData
				};
			} catch (e) {
				console.error('获取上级领导列表失败:', e);
				res = {
					code: 500,
					message: `获取上级领导列表失败: ${e.message}`
				};
			}
			break;
			
		case 'getSupervisorInfo':
			try {
				const { supervisorId } = params;
				if (!supervisorId) {
					return {
						code: 400,
						message: '缺少上级领导ID'
					};
				}
				
				const { data: supervisorData } = await db.collection('uni-id-users')
					.doc(supervisorId)
					.field({ 'username': 1, 'teacherName': 1, '_id': 1, 'role': 1 })
					.get();
				
				if (supervisorData.length === 0) {
					return {
						code: 404,
						message: '上级领导不存在'
					};
				}
				
				res = {
					code: 200,
					message: '获取成功',
					data: supervisorData[0]
				};
			} catch (e) {
				console.error('获取上级领导信息失败:', e);
				res = {
					code: 500,
					message: `获取上级领导信息失败: ${e.message}`
				};
			}
			break;
			
		case 'getTeachersBySubject':
			try {
				const { subject, grade } = params;
				if (!subject) {
					return {
						code: 400,
						message: '缺少科目参数'
					};
				}
				
				// 根据年级判断应该显示哪个部门的老师
				let departmentFilter = null;
				if (grade) {
					// 判断年级是否包含"七年级"或更高年级
					const gradeStr = grade.toString();
					if (gradeStr.includes('七年级') || gradeStr.includes('八年级') || gradeStr.includes('九年级') || 
						gradeStr.includes('高一') || gradeStr.includes('高二') || gradeStr.includes('高三') ||
						gradeStr.includes('十年级') || gradeStr.includes('十一年级') || gradeStr.includes('十二年级')) {
						departmentFilter = '初中部';
					} else {
						// 六年级及以下显示小学部
						departmentFilter = '小学部';
					}
				}
				
				// 构建查询条件
				let query = {
					role: dbCmd.elemMatch(dbCmd.eq('教师')),
					subject: subject
				};
				
				// 如果有年级筛选，则按部门筛选
				if (departmentFilter) {
					// 查询条件：该科目的老师，且满足以下条件之一：
					// 1. 属于对应部门的全职老师
					// 2. 兼职老师（无论部门）
					query = {
						role: dbCmd.elemMatch(dbCmd.eq('教师')),
						subject: subject,
						workType: dbCmd.in(['全职', '兼职']),
						department: dbCmd.in([departmentFilter, null, ''])
					};
				}
				
				const { data: teacherData } = await db.collection('uni-id-users')
					.where(query)
					.field({ 'username': 1, 'teacherName': 1, '_id': 1, 'subject': 1, 'department': 1, 'workType': 1 })
					.get();
				
				// 过滤结果：如果指定了部门，优先显示该部门的老师，兼职老师如果没有选部门也可以显示
				let filteredTeachers = teacherData;
				if (departmentFilter) {
					filteredTeachers = teacherData.filter(teacher => {
						// 全职老师必须属于指定部门
						if (teacher.workType === '全职') {
							return teacher.department === departmentFilter;
						}
						// 兼职老师如果没有选部门或者属于指定部门都可以显示
						if (teacher.workType === '兼职') {
							return !teacher.department || teacher.department === departmentFilter;
						}
						return false;
					});
				}
				
				res = {
					code: 200,
					message: '获取成功',
					data: filteredTeachers
				};
			} catch (e) {
				console.error('根据科目获取教师列表失败:', e);
				res = {
					code: 500,
					message: `根据科目获取教师列表失败: ${e.message}`
				};
			}
			break;
			
		default:
			res = {
				code: 404,
				message: '请求的服务不存在'
			};
			break;
	}

	return res;
}; 