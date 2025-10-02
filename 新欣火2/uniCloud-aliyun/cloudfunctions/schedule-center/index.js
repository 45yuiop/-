'use strict';
const db = uniCloud.database();
const $ = db.command.aggregate;
const dbCmd = db.command;

// 微信配置（直接写在云函数内部）
const wxConfig = {
    // 小程序 appid
    appid: 'wx9f7a595a2467a31d',
    
    // 小程序 secret
    secret: 'dbecd227d392efee60fd6791e754d478',
    
    // 订阅消息模板ID
    templates: {
        scheduleNotification: 'sOwar1Xkzk4ApC2eQvvc4SZFH6UbFz_ZA8DZjHHPZf4'
    },
    
    // 微信API接口地址
    api: {
        accessToken: 'https://api.weixin.qq.com/cgi-bin/token',
        sendSubscribeMessage: 'https://api.weixin.qq.com/cgi-bin/message/subscribe/send'
    }
};

// 节次与时间段映射
const periodTimeMap = {
    1: '8:00-10:00',
    2: '10:10-12:10',
    3: '14:00-16:00',
    4: '16:10-18:10',
    5: '18:00-20:00',
    6: '20:00-22:00'
};

// 获取微信小程序 access_token
async function getAccessToken() {
	try {
		// 从缓存中获取 access_token
		const cacheKey = 'wx_access_token';
		let accessToken = await uniCloud.redis().get(cacheKey);
		
		if (accessToken) {
			return accessToken;
		}

		// 如果没有缓存，则重新获取
		const appid = wxConfig.appid;
		const secret = wxConfig.secret;
		
		const result = await uniCloud.httpclient.request(
			`${wxConfig.api.accessToken}?grant_type=client_credential&appid=${appid}&secret=${secret}`,
			{
				method: 'GET'
			}
		);

		if (result.data.access_token) {
			// 缓存 access_token，有效期 7000 秒（微信官方建议提前 200 秒过期）
			await uniCloud.redis().setex(cacheKey, 7000, result.data.access_token);
			return result.data.access_token;
		} else {
			throw new Error('获取 access_token 失败');
		}
	} catch (error) {
		console.error('获取 access_token 失败:', error);
		throw error;
	}
}

exports.main = async (event, context) => {
	const {
		action,
		params
	} = event;
	let res = {};

	switch (action) {
		case 'get-schedules':
			{
				try {
					console.log('🔍 get-schedules 被调用，参数:', params);
					const {
						username,
						startDate,
						endDate,
						date
					} = params;
					
					if (!username) {
						console.log('❌ 缺少用户名参数');
						return {
							code: 400,
							message: '缺少用户名参数'
						};
					}

					// 构建查询条件，同时支持 username 和 uid 查询
					let baseCondition = {};
					if (params.uid) {
						baseCondition.uid = params.uid;
						console.log('🔍 使用 uid 查询:', params.uid);
					} else {
						baseCondition.username = username;
						console.log('🔍 使用 username 查询:', username);
					}

					// 组合条件：uid/username AND 日期条件
					const andConditions = [ baseCondition ];
					if (startDate && endDate) {
						console.log('🔍 使用日期范围查询:', startDate, '到', endDate);
						andConditions.push({ course_date: dbCmd.gte(new Date(startDate)).and(dbCmd.lte(new Date(endDate))) });
					} else if (date) {
						console.log('🔍 使用具体日期查询:', date);
						andConditions.push({ course_date: new Date(date) });
					}

					const query = db.collection('schedules')
						.where(dbCmd.and(andConditions))
						.orderBy("course_date", "asc");
					console.log('🔍 执行查询，条件:', JSON.stringify(andConditions));

					const result = await query.get();
					console.log('📊 查询结果:', result.data.length, '条记录');
					
					// 如果查询特定日期，返回单个对象；否则返回数组
					if (date) {
						if (result.data.length > 0) {
							const processedData = {
								...result.data[0],
								course_date: new Date(result.data[0].course_date).toISOString().split('T')[0]
							};
							console.log('✅ 返回单日数据:', processedData);
							res = {
								code: 200,
								data: processedData
							};
						} else {
							console.log('⚠️ 未找到指定日期的数据');
							res = {
								code: 200,
								data: null
							};
						}
					} else {
						const processedData = result.data.map(s => {
							return {
								...s,
								course_date: new Date(s.course_date).toISOString().split('T')[0]
							}
						});
						console.log('✅ 返回日期范围数据:', processedData.length, '条');
						res = {
							code: 200,
							data: processedData
						};
					}
				} catch (error) {
					console.error('❌ 获取课程安排失败:', error);
					res = {
						code: 500,
						message: '获取课程安排失败'
					};
				}
				break;
			}
		case 'get-schedules-by-username':
			{
				try {
					const {
						username,
						startDate,
						endDate
					} = params;
					
					if (!username || !startDate || !endDate) {
						return {
							code: 400,
							message: '缺少必要的查询参数'
						};
					}

					let query = db.collection('schedules').where({
						username: username,
						course_date: dbCmd.gte(new Date(startDate)).and(dbCmd.lte(new Date(endDate)))
					}).orderBy("course_date", "asc");

					const result = await query.get();
					const processedData = result.data.map(s => {
						return {
							...s,
							course_date: new Date(s.course_date).toISOString().split('T')[0]
						}
					});
					res = {
						code: 200,
						data: processedData
					};
				} catch (error) {
					console.error('获取课程安排失败:', error);
					res = {
						code: 500,
						message: '获取课程安排失败'
					};
				}
				break;
			}

		case 'set-schedule': {
			try {
				console.log('=== 开始排课流程 ===');
				console.log('set-schedule params:', JSON.stringify(params, null, 2));
				
				const {
					username,
					date,
					uid,
					...courses
				} = params;
				
				console.log('courses数据:', JSON.stringify(courses, null, 2));
				console.log('参数验证 - date:', date, 'uid:', uid, 'username:', username);
				
				if (!date || !uid) {
					console.error('缺少必要参数 - date:', date, 'uid:', uid);
					return {
						code: 400,
						message: '缺少日期或用户ID参数'
					};
				}
				
				// 先查当天已有数据
				console.log('查询现有数据 - uid:', uid, 'date:', date);
				const doc = await db.collection('schedules').where({
					uid: uid,
					course_date: new Date(date)
				}).get();
				console.log('查询结果 - 现有记录数:', doc.data.length);

				let scheduleInfo = {};
				if (doc.data.length > 0) {
					// 用已有数据初始化，但排除_id字段
					const existingData = doc.data[0];
					scheduleInfo = { 
						...existingData,
						username: username, // 确保username字段被设置
						uid: uid // 确保uid字段被设置
					};
					// 删除_id字段，避免更新时出错
					delete scheduleInfo._id;
				} else {
					// 新建
					scheduleInfo = {
						uid: uid,
						username: username,
						course_date: new Date(date)
					};
				}

				// 只更新你传递的节次，其它节次保留
				for (let i = 1; i <= 8; i++) {
					const courseKey = `course_slot_${i}`;
					const typeKey = `course_slot_${i}_type`;
					const classKey = `course_slot_${i}_class`;
					const locationKey = `course_slot_${i}_location`;
					const remarkKey = `course_slot_${i}_remark`;
					if (courses.hasOwnProperty(courseKey)) {
						scheduleInfo[courseKey] = courses[courseKey] || '';
						scheduleInfo[typeKey] = courses[typeKey] || '无';
						scheduleInfo[classKey] = courses[classKey] || '';
						scheduleInfo[locationKey] = courses[locationKey] || '';
						scheduleInfo[remarkKey] = courses[remarkKey] || '';
					}
				}

				// 构建 courseRecord 记录所有节次（包括空节次）
				const courseRecord = {
					uid: uid,
					username: username,
					date: date,
					remark: params.remark || '',
					adminName: params.adminName || ''
				};
				
				// 确保所有8节课都有记录，即使没有课程数据
				for (let i = 1; i <= 8; i++) {
					const courseKey = `course_slot_${i}`;
					const typeKey = `course_slot_${i}_type`;
					const classKey = `course_slot_${i}_class`;
					const locationKey = `course_slot_${i}_location`;
					const remarkKey = `course_slot_${i}_remark`;
					
					// 无论是否有课程数据，都记录（空值也记录）
					courseRecord[courseKey] = courses[courseKey] || '';
					courseRecord[typeKey] = courses[typeKey] || '无';
					courseRecord[classKey] = courses[classKey] || '';
					courseRecord[locationKey] = courses[locationKey] || '';
					courseRecord[remarkKey] = courses[remarkKey] || '';
				}

				// 先处理schedules表
				// 确保不包含_id字段
				delete scheduleInfo._id;
				console.log('准备保存schedules表数据:', JSON.stringify(scheduleInfo, null, 2));
				let scheduleId;
				try {
					if (doc.data.length > 0) {
						// 如果找到记录，则更新
						console.log('更新现有记录，ID:', doc.data[0]._id);
						const updateResult = await db.collection('schedules').doc(doc.data[0]._id).update(scheduleInfo);
						scheduleId = doc.data[0]._id;
						console.log('更新课表记录成功，ID:', scheduleId, '更新结果:', updateResult);
					} else {
						// 否则，添加新记录
						console.log('添加新记录到schedules表');
						const scheduleResult = await db.collection('schedules').add(scheduleInfo);
						scheduleId = scheduleResult.id;
						console.log('添加课表记录成功，ID:', scheduleId, '添加结果:', scheduleResult);
					}
				} catch (dbError) {
					console.error('数据库操作失败:', dbError);
					throw new Error('数据库操作失败: ' + dbError.message);
				}
				
				// 同步处理courses表
				try {
					// 确保不包含_id字段
					delete courseRecord._id;
					console.log('准备保存courses表数据:', JSON.stringify(courseRecord, null, 2));
					// 先检查是否已存在当天的记录
					const existingCourse = await db.collection('courses')
						.where({
							uid: uid,
							date: date
						})
						.get();
					
					console.log('courses表查询结果 - 现有记录数:', existingCourse.data.length);
					
					if (existingCourse.data.length > 0) {
						// 更新现有记录
						console.log('更新courses表记录，ID:', existingCourse.data[0]._id);
						const courseUpdateResult = await db.collection('courses').doc(existingCourse.data[0]._id).update(courseRecord);
						console.log('更新排课记录成功，ID:', existingCourse.data[0]._id, '更新结果:', courseUpdateResult);
					} else {
						// 添加新记录
						console.log('添加新记录到courses表');
						const courseResult = await db.collection('courses').add(courseRecord);
						console.log('添加排课记录成功，ID:', courseResult.id, '添加结果:', courseResult);
					}
				} catch (courseError) {
					console.error('处理排课记录失败:', courseError);
					// 排课记录失败不影响主流程，但记录错误
					console.error('courses表操作失败，但继续执行主流程');
				}
				
				// 数据一致性检查
				try {
					const scheduleCheck = await db.collection('schedules').doc(scheduleId).get();
					const courseCheck = await db.collection('courses')
						.where({ uid: uid, date: date })
						.get();
					
					console.log('数据一致性检查:', {
						schedules表记录数: scheduleCheck.data ? 1 : 0,
						courses表记录数: courseCheck.data.length,
						scheduleId: scheduleId,
						uid: uid,
						date: date
					});
				} catch (checkError) {
					console.error('数据一致性检查失败:', checkError);
				}

				console.log('=== 排课流程完成 ===');
				res = {
					code: 200,
					message: '排课成功'
				};

				// 先查老师姓名
				let teacherName = username; // 默认用username
				try {
					const userRes = await db.collection('uni-id-users')
						.where({ _id: params.uid })
						.field({ teacherName: 1, nickname: 1, username: 1 })
						.get();
					if (userRes.data && userRes.data.length > 0) {
						teacherName = userRes.data[0].teacherName || userRes.data[0].nickname || userRes.data[0].username;
					}
				} catch (e) {
					// 查不到就用username
				}
				// 在set-schedule保存/更新时补teacherName
				scheduleInfo.teacherName = teacherName;

				// 为每节课发送单独的通知（无论是否管理员排课）
				if (params) {
					console.log('开始处理排课通知，params:', params);
					console.log('courses数据:', courses);
					
					// 简化通知处理，避免影响主流程
					try {
						for (let i = 1; i <= 8; i++) {
						const courseKey = `course_slot_${i}`;
						const typeKey = `course_slot_${i}_type`;
						const classKey = `course_slot_${i}_class`;
						const locationKey = `course_slot_${i}_location`;
						
						console.log(`检查第${i}节课:`, {
							courseKey,
							hasCourse: courses.hasOwnProperty(courseKey),
							courseValue: courses[courseKey],
							typeValue: courses[typeKey],
							classValue: courses[classKey],
							locationValue: courses[locationKey]
						});
						
						// 检查是否有课程数据（课程名不为空）
						if (courses.hasOwnProperty(courseKey) && courses[courseKey] && courses[courseKey].trim() !== '') {
							const courseName = courses[courseKey];
							const courseType = courses[typeKey] || '无';
							const className = courses[classKey] || '';
							const location = courses[locationKey] || '';
							let periodTime = periodTimeMap[i] ? `（${periodTimeMap[i]}）` : '';
							let content = `${teacherName}为您安排了新课程：${courseName}`;
							if (className) content += `，班级：${className}`;
							if (location) content += `，教室：${location}`;
							if (courseType && courseType !== '无') content += `，类型：${courseType}`;
							content += `，日期：${date}，第${i}节课${periodTime}`;

							// 移除：不再写入排课通知到messages表
							// 通知功能已移除，仅保留订阅消息通知

							// 发送订阅消息通知
							try {
								console.log(`准备为第${i}节课发送订阅消息`);
								
								// 获取用户的 openid
								const userRes = await db.collection('uni-id-users')
									.where({ _id: params.uid })
									.field({ openid: 1, nickname: 1 })
									.get();
								
								console.log('查询用户结果:', userRes);
								
								if (userRes.data && userRes.data.length > 0 && userRes.data[0].openid) {
									const openid = userRes.data[0].openid;
									const studentName = userRes.data[0].nickname || userRes.data[0].username || '学员';
									
									console.log('用户信息:', { openid, studentName, uid: params.uid });
									
									// 格式化上课时间 - 显示完整日期、星期和时间段
									const dateObj = new Date(date);
									const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
									const dayName = dayNames[dateObj.getDay()];
									const formattedDate = `${dateObj.getMonth() + 1}月${dateObj.getDate()}日`;
									const classTime = `${formattedDate} ${dayName} ${periodTimeMap[i] || ''}`;
									
									// 备注改为教室信息
									const classroomRemark = location || '未指定教室';
									
									// 学员姓名改为课程类型
									const courseTypeDisplay = courseType && courseType !== '无' ? courseType : '未指定类型';
									
									console.log('准备调用订阅消息云函数，参数:', {
										openid,
										courseName,
										classTime,
										remark: classroomRemark,
										studentName: courseTypeDisplay,
										page: 'pages/schedule-tab/schedule-tab'
									});
									
									// 调用订阅消息云函数，而不是直接调用微信API
									try {
										// 直接调用订阅消息云函数
										const subscriptionResult = await uniCloud.callFunction({
											name: 'subscription-message',
											data: {
												action: 'send-schedule-notification',
												params: {
													openid: openid,
													courseName: courseName,
													classTime: classTime,
													remark: classroomRemark,
													studentName: courseTypeDisplay,
													page: 'pages/schedule-tab/schedule-tab'
												}
											}
										});
										
										console.log('订阅消息云函数调用结果:', subscriptionResult);
										
										if (subscriptionResult.result && subscriptionResult.result.code === 200) {
											console.log('订阅消息发送成功');
										} else {
											console.log('订阅消息发送失败:', subscriptionResult.result?.message);
										}
									} catch (functionError) {
										console.error('调用订阅消息云函数失败:', functionError);
									}
								} else {
									console.log('用户没有openid或查询失败:', userRes);
								}
							} catch (subscriptionError) {
								console.error('发送订阅消息失败:', subscriptionError);
								// 订阅消息发送失败不影响主流程
							}
						}
					}
					} catch (notificationError) {
						console.error('通知处理失败，但不影响主流程:', notificationError);
					}
				}
			} catch (error) {
				console.error('set-schedule error:', error);
				console.error('错误堆栈:', error.stack);
				console.error('错误详情:', {
					name: error.name,
					message: error.message,
					code: error.code
				});
				res = {
					code: 500,
					message: '设置课程安排失败: ' + error.message
				};
			}
			break;
		}

		case 'change-schedule': {
			try {
				const { uid, adminName, date, courseNames, remark, adminId } = params;
				// 移除：不再写入调课成功通知到messages表
				// 通知功能已移除
				res = { code: 200, message: '调课成功' };
			} catch (error) {
				console.error('调课失败:', error);
				res = { code: 500, message: '调课失败' };
			}
			break;
		}

		case 'reject-schedule': {
			try {
				const { uid, adminName, date, courseNames, remark, adminId } = params;
				// 移除：不再写入调课被拒绝通知到messages表
				// 通知功能已移除
				res = { code: 200, message: '调课拒绝成功' };
			} catch (error) {
				console.error('调课拒绝失败:', error);
				res = { code: 500, message: '调课拒绝失败' };
			}
			break;
		}

		case 'get-all-teachers-schedules':
			{
				try {
					const {
						startDate,
						endDate,
						teacher_id
					} = params;
					if (!startDate || !endDate) {
						return {
							code: 400,
							message: '缺少日期范围参数'
						};
					}

					// 根据是否传入 teacher_id 构建不同的查询条件
					let usersQuery = db.collection('uni-id-users');
					if (teacher_id) {
						// 如果有 teacher_id，则只查询这位教师
						usersQuery = usersQuery.where({
							_id: teacher_id,
							role: dbCmd.elemMatch(dbCmd.eq('教师'))
						});
					} else {
						// 否则，查询所有教师
						usersQuery = usersQuery.where({
							role: dbCmd.elemMatch(dbCmd.eq('教师'))
						});
					}
					
					const usersRes = await usersQuery.field({
						'username': 1,
						'teacherName': 1
					}).get();
					let teachers = usersRes.data;

					// 新增：查 schedule 表中有课的所有 username
					const start = new Date(startDate);
					// 计算下个月1号0点，end为下月1号0点减1毫秒
					const startYear = start.getFullYear();
					const startMonth = start.getMonth();
					const nextMonthFirstDay = new Date(startYear, startMonth + 1, 1, 0, 0, 0, 0);
					const end = new Date(nextMonthFirstDay.getTime() - 1); // 本月最后一秒

					const schedulesResAll = await db.collection('schedules').where({
						course_date: dbCmd.gte(start).and(dbCmd.lte(end))
					}).get();
					const scheduleUsernames = Array.from(new Set(schedulesResAll.data.map(s => s.username)));
					// 合并用户表和 schedule 表的 username，去重
					const allUsernames = Array.from(new Set([
						...teachers.map(t => t.username),
						...scheduleUsernames
					]));
					// 构造完整教师信息，teacherName 没有时用 username 兜底
					const allTeachers = allUsernames.map(username => {
						const user = teachers.find(t => t.username === username);
						return {
							username,
							teacherName: user && user.teacherName ? user.teacherName : username
						};
					});

					if (allTeachers.length === 0) {
						return {
							code: 200,
							data: []
						};
					}
					const teacherUsernames = allTeachers.map(t => t.username);

					const schedulesRes = await db.collection('schedules').where({
						username: dbCmd.in(teacherUsernames),
						// 兼容 course_date 为 ISO 字符串或 Date 类型
						course_date: dbCmd.gte(start).and(dbCmd.lte(end))
					}).get();

					const schedulesData = schedulesRes.data.map(s => {
						let dateObj = s.course_date instanceof Date ? s.course_date : new Date(s.course_date);
						return {
							...s,
							course_date: dateObj.toISOString().split('T')[0]
						}
					});

					const statistics = allTeachers.map(teacher => {
						const teacherSchedules = schedulesData.filter(s => s.username === teacher.username);
						return { 
							...teacher,
							schedules: teacherSchedules // 返回完整的课程安排数据
						};
					});

					res = {
						code: 200,
						data: statistics
					};
				} catch (error) {
					console.error('获取所有教师课程安排失败:', error);
					res = {
						code: 500,
						message: '获取所有教师课程安排失败'
					};
				}
				break;
			}

		case 'getTeachers': {
			try {
				// 修复角色查询，支持数组格式
				const usersRes = await db.collection('uni-id-users').where({
					role: dbCmd.elemMatch(dbCmd.eq('教师'))
				}).field({
					'username': 1,
					'teacherName': 1,
					'_id': 1
				}).get();
				const teachers = usersRes.data.map(user => ({
					_id: user._id,
					username: user.username,
					teacherName: user.teacherName || user.username
				}));
				res = {
					code: 200,
					data: teachers
				};
			} catch (e) {
				console.error("getTeachers error:", e);
				res = {
					code: 500,
					message: '获取教师列表失败'
				};
			}
			break;
		}

		case 'getSchedulesByTeacher': {
			try {
				console.log('🔍 getSchedulesByTeacher 被调用，参数:', params);
				const { teacher_id, startDate, endDate } = params;
				if (!teacher_id || !startDate || !endDate) {
					console.log('❌ 缺少必要的查询参数');
					return { code: 400, message: '缺少必要的查询参数' };
				}
		
				console.log('🔍 查询教师信息，ID:', teacher_id);
				const userRes = await db.collection('uni-id-users').doc(teacher_id).field({ 'username': 1, 'teacherName': 1, 'nickname': 1 }).get();
				if (!userRes.data || userRes.data.length === 0) {
					console.log('❌ 未找到该教师');
					return { code: 404, message: '未找到该教师' };
				}
				
				const teacher = userRes.data[0];
				const username = teacher.username;
				console.log('✅ 找到教师:', teacher);
		
				console.log('🔍 查询课表数据，日期范围:', startDate, '到', endDate);
				const schedulesRes = await db.collection('schedules').where(
					dbCmd.and([
						dbCmd.or([
							{ uid: teacher_id },
							{ username: teacher.username }
						]),
						{
							course_date: dbCmd.gte(new Date(startDate)).and(dbCmd.lte(new Date(endDate)))
						}
					])
				).get();
				
				console.log('📊 查询结果，记录数:', schedulesRes.data.length);
				console.log('原始数据:', schedulesRes.data);
		
				const finalSchedules = schedulesRes.data.map(schedule => {
					let courses = [];
					for (let i = 1; i <= 8; i++) {
						if (schedule[`course_slot_${i}`]) {
							const startPeriod = Math.max(1, i);
							const endPeriod = Math.max(1, i);
							courses.push({
								_id: schedule._id,
								date: new Date(schedule.course_date).toISOString().split('T')[0],
								course_name: schedule[`course_slot_${i}`],
								course_type: schedule[`course_slot_${i}_type`],
								class_name: schedule[`course_slot_${i}_class`],
								location: schedule[`course_slot_${i}_location`],
								start_period: startPeriod,
								end_period: endPeriod,
								teacher_name: teacher.teacherName || teacher.nickname || teacher.username,
								remark: schedule[`course_slot_${i}_remark`] || ''
							});
						}
					}
					return courses;
				}).flat();
				
				console.log('🎯 处理后的课程数据，条数:', finalSchedules.length);
				console.log('最终数据:', finalSchedules);
		
				res = { code: 200, data: finalSchedules };
			} catch (error) {
				console.error('❌ 获取教师课程失败:', error);
				res = { code: 500, message: '获取教师课程失败' };
			}
			break;
		}

		case 'get-class-types':
			try {
			} catch (error) {
				console.error('获取课程类型失败:', error);
				res = {
					code: 500,
					message: '获取课程类型失败'
				};
			}
			break;

		case 'updateSchedules': {
			try {
				const { schedules, adminName } = params;
				if (!schedules || !Array.isArray(schedules)) {
					return { code: 400, message: '无效的排课数据' };
				}

				for (const day of schedules) {
					const { course_date, teacher_id, username, ...courses } = day;
					
					if (!course_date || !teacher_id) {
						console.warn('Skipping day with missing date or teacher_id:', day);
						continue; // 跳过无效数据
					}

					let scheduleInfo = {
						uid: teacher_id,
						username: username,
						course_date: new Date(course_date),
					};

					for (let i = 1; i <= 6; i++) {
						scheduleInfo[`course_slot_${i}`] = day[`course_slot_${i}`] || '';
						scheduleInfo[`course_slot_${i}_type`] = day[`course_slot_${i}_type`] || '无';
						scheduleInfo[`course_slot_${i}_class`] = day[`course_slot_${i}_class`] || '';
						scheduleInfo[`course_slot_${i}_location`] = day[`course_slot_${i}_location`] || '';
						scheduleInfo[`course_slot_${i}_remark`] = day[`course_slot_${i}_remark`] || '';
					}

					// 查老师姓名
					let teacherName = username;
					try {
						const userRes = await db.collection('uni-id-users')
							.where({ _id: teacher_id })
							.field({ teacherName: 1, nickname: 1, username: 1 })
							.get();
						if (userRes.data && userRes.data.length > 0) {
							teacherName = userRes.data[0].teacherName || userRes.data[0].nickname || userRes.data[0].username;
						}
					} catch (e) {}
					scheduleInfo.teacherName = teacherName;

					const doc = await db.collection('schedules').where({
						uid: teacher_id,
						course_date: new Date(course_date)
					}).get();

					if (doc.data.length > 0) {
						await db.collection('schedules').doc(doc.data[0]._id).update(scheduleInfo);
					} else {
						await db.collection('schedules').add(scheduleInfo);
					}

					// 为每节课发送单独的通知
					if (adminName) {
						// 移除：不再写入排课通知到messages表
						// 通知功能已移除，仅保留课程安排更新
					}
				}

				res = { code: 200, message: '批量排课成功' };
			} catch (error) {
				console.error('批量更新排课失败:', error);
				res = { code: 500, message: `批量更新排课失败: ${error.message}` };
			}
			break;
		}

		default:
			res = {
				code: 404,
				message: '请求的服务不存在'
			};
			break;
	}

	return res;
}; 