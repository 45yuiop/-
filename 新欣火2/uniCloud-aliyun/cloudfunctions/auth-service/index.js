'use strict';
const uniID = require('uni-id');
const crypto = require('crypto');
const db = uniCloud.database();
const dbCmd = db.command;
const usersDB = db.collection('uni-id-users');

// 创建SHA256哈希函数
function createSha256(str) {
	return crypto.createHash('sha256').update(str).digest('hex');
}

exports.main = async (event, context) => {
	// 记录云函数调用信息，包括IP地址
	console.log('=== 云函数调用信息 ===');
	console.log('云函数名称:', context.FUNCTION_NAME);
	console.log('云函数版本:', context.FUNCTION_VERSION);
	console.log('云函数区域:', context.REGION);
	console.log('调用时间:', new Date().toISOString());
	console.log('事件参数:', JSON.stringify(event, null, 2));
	
	// 尝试获取IP地址
	let serverIP = 'unknown';
	try {
		// 方法1：从context获取
		if (context.CLIENTIP) {
			serverIP = context.CLIENTIP;
		}
		// 方法2：从请求头获取
		else if (context.SOURCE && context.SOURCE.headers) {
			const headers = context.SOURCE.headers;
			serverIP = headers['x-forwarded-for'] || 
					   headers['x-real-ip'] || 
					   headers['x-client-ip'] || 
					   'unknown';
		}
		// 方法3：从环境变量获取
		else if (process.env.SERVER_IP) {
			serverIP = process.env.SERVER_IP;
		}
		
		console.log('服务器IP地址:', serverIP);
		console.log('IP来源:', context.CLIENTIP ? 'CLIENTIP' : 
								context.SOURCE?.headers ? '请求头' : 
								process.env.SERVER_IP ? '环境变量' : '未知');
	} catch (error) {
		console.error('获取IP地址失败:', error);
	}
	
	// 记录完整的context信息（用于调试）
	console.log('完整context信息:', JSON.stringify(context, null, 2));
	console.log('=== IP信息记录完成 ===\n');
	
	// 解析请求参数
	let action, params;
	if (event.body) {
		// HTTP 请求格式
		const bodyData = JSON.parse(event.body);
		action = bodyData.action;
		params = bodyData.params;
	} else {
		// 直接调用格式
		action = event.action;
		params = event.params;
	}
	
	console.log('解析后的action:', action);
	console.log('解析后的params:', params);
	
	let res = {};


	const uniIDIns = uniID.createInstance({
		context
	});

	switch (action) {
		case 'login':
			{
				const {
					username,
					password
				} = params;
				if (!username || !password) {
					return {
						code: 400,
						message: '用户名或密码不能为空'
					};
				}
				let userQueryRes = await usersDB.where({
					username: username
				}).limit(1).get();
				if (userQueryRes.data.length === 0) {
					return {
						code: 403,
						message: '用户不存在'
					};
				}
				const user = userQueryRes.data[0];
				
				// 兼容两种密码格式：明文和SHA256哈希
				const passwordHash = createSha256(password);
				const isPasswordValid = (user.password === password) || (user.password === passwordHash);
				
				if (!isPasswordValid) {
					return {
						code: 403,
						message: '密码不正确'
					};
				}

				try {
					const tokenRes = await uniIDIns.createToken({
						uid: user._id,
						role: user.role,
						username: user.username
					});
					await uniIDIns.updateUser({
						uid: user._id,
						last_login_ip: context.CLIENTIP,
						last_login_date: Date.now()
					});
					
					// 移除密码等敏感信息，构建纯净的 userInfo 对象
					const { password, ...userInfo } = user;
					
					res = {
						code: 200,
						message: '登录成功',
						...tokenRes,
						userInfo: userInfo // 将用户信息一并返回
					};
				} catch (e) {
					console.error('Token creation or user update failed:', e);
					return {
						code: 500,
						message: `登录凭证或用户信息更新失败: ${e.message}`
					};
				}
				break;
			}
		case 'bind-wechat':
			{
				try {
					const { code, userId } = params;
					
					console.log('开始绑定微信，参数:', { code: code ? '已提供' : '未提供', userId });
					
					if (!code || !userId) {
						return {
							code: 400,
							message: '参数不完整'
						};
					}
					
					// 通过code获取openid
					console.log('开始获取openid...');
					const openid = await getOpenidByCode(code);
					
					console.log('获取到的openid:', openid);
					
					if (!openid) {
						return {
							code: 500,
							message: '获取微信openid失败'
						};
					}
					
					// 检查此openid是否已被其他用户绑定
					const existingUser = await usersDB.where({
						openid: openid,
						_id: dbCmd.neq(userId)
					}).limit(1).get();
					
					if (existingUser.data.length > 0) {
						return {
							code: 400,
							message: '此微信账号已被其他用户绑定'
						};
					}
					
					// 更新用户信息，绑定openid
					await usersDB.doc(userId).update({
						openid: openid,
						wechat_bind_time: Date.now(),
						wechat_bind_status: 'success'
					});
					
					// 记录绑定日志
					await db.collection('wechat_bind_logs').add({
						userId: userId,
						openid: openid,
						bindTime: Date.now(),
						status: 'success',
						note: '用户主动绑定微信'
					});
					
					res = {
						code: 200,
						message: '微信绑定成功',
						openid: openid
					};
					
				} catch (error) {
					console.error('微信绑定失败:', error);
					
					// 记录失败日志
					try {
						await db.collection('wechat_bind_logs').add({
							userId: params.userId,
							openid: null,
							bindTime: Date.now(),
							status: 'failed',
							error: error.message,
							note: '绑定失败'
						});
					} catch (logError) {
						console.error('记录绑定失败日志失败:', logError);
					}
					
					res = {
						code: 500,
						message: '微信绑定失败: ' + error.message
					};
				}
				break;
			}
		case 'register':
			{
				const {
					username,
					password
				} = params;
				const registerRes = await uniIDIns.register({
					username,
					password
				});
				if (registerRes.code === 0) {
					await uniIDIns.updateUser({
						uid: registerRes.uid,
						role: ['teacher']
					});
					delete registerRes.token;
					delete registerRes.tokenExpired;
				}
				res = registerRes;
				break;
			}
		case 'fix-admin-permission':
			{
				// 修复管理员权限的特殊功能
				const adminUserQuery = await usersDB.where({
					username: '15926686363'
				}).limit(1).get();
				
				if (adminUserQuery.data.length > 0) {
					const admin = adminUserQuery.data[0];
					const hashedPassword = createSha256('123456');
					res = await uniIDIns.updateUser({
						uid: admin._id,
						password: hashedPassword,
						role: ['超级管理员'],
						permission: 'superadmin'
					});
					if (res.code === 0) {
						res.message = '管理员账号存在，权限及密码已重置。';
					}
				} else {
					const hashedPassword = createSha256('123456');
					res = await uniIDIns.register({
						username: '15926686363',
						password: hashedPassword,
						extraData: {
							teacherName: '超级管理员',
							role: ['超级管理员'],
							permission: 'superadmin'
						}
					});
					if (res.code === 0) {
						res.message = '管理员账号不存在，已自动创建。';
					}
				}
				break;
			}
		case 'get-accounts':
			{
				const adminCheck = await uniIDIns.checkToken(event.uniIdToken);
				if (adminCheck.code !== 0) return adminCheck;
				if (!adminCheck.role.includes('管理员') && !adminCheck.role.includes('超级管理员')) {
					return {
						code: 403,
						message: '无权访问'
					};
				}
				const accQueryRes = await uniIDIns.getUsers({
					field: ['_id', 'username', 'teacherName', 'role', 'register_date']
				});
				res = {
					code: 0,
					...accQueryRes
				};
				break;
			}
		case 'get-user-list':
			{
				// 不需要权限的获取用户列表功能，用于登录页面显示
				try {
					const userQueryRes = await usersDB.field({
						_id: true,
						username: true,
						teacherName: true,
						role: true,
						permission: true,
						department: true,
						workType: true,
						register_date: true
					}).get();
					
					res = {
						code: 200,
						message: '获取用户列表成功',
						data: userQueryRes.data
					};
				} catch (error) {
					console.error('获取用户列表失败:', error);
					res = {
						code: 500,
						message: '获取用户列表失败: ' + error.message
					};
				}
				break;
			}
		case 'update-account':
			{
				const adminCheck = await uniIDIns.checkToken(event.uniIdToken);
				if (adminCheck.code !== 0) return adminCheck;
				if (!adminCheck.role.includes('管理员') && !adminCheck.role.includes('超级管理员')) {
					return {
						code: 403,
						message: '无权访问'
					};
				}
				const {
					uid,
					password,
					...updateData
				} = params;
				res = await uniIDIns.updateUser({
					uid,
					password,
					...updateData
				});
				break;
			}
		case 'delete-account':
			{
				const adminCheck = await uniIDIns.checkToken(event.uniIdToken);
				if (adminCheck.code !== 0) return adminCheck;
				if (!adminCheck.role.includes('管理员') && !adminCheck.role.includes('超级管理员')) {
					return {
						code: 403,
						message: '无权访问'
					};
				}
				res = await uniIDIns.deleteUser({
					uid: params.uid
				});
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

// 通过微信登录code获取openid
async function getOpenidByCode(code) {
	try {
		console.log('开始获取真实微信openid，code长度:', code ? code.length : 0);
		
		// 使用微信代理服务，避免IP白名单问题
		console.log('调用微信代理服务...');
		const proxyResult = await uniCloud.callFunction({
			name: 'wechat-proxy',
			data: {
				action: 'code2session',
				params: { code }
			}
		});
		
		console.log('代理服务返回结果:', proxyResult);
		
		if (proxyResult.result.code === 200) {
			// 代理服务调用成功
			const openid = proxyResult.result.data.openid;
			console.log('成功获取真实openid:', openid);
			return openid;
		} else {
			// 代理服务调用失败
			const errorMsg = proxyResult.result.message || '代理服务调用失败';
			console.error('代理服务调用失败:', proxyResult.result);
			
			// 检查是否是IP白名单错误
			if (proxyResult.result.code === 40164) {
				throw new Error(`微信API IP白名单错误: ${errorMsg}`);
			}
			
			throw new Error(`获取微信openid失败: ${errorMsg}`);
		}
		
	} catch (error) {
		console.error('获取openid失败，详细错误:', error);
		console.error('错误堆栈:', error.stack);
		
		// 如果是IP白名单错误，提供解决方案
		if (error.message && error.message.includes('IP白名单')) {
			console.error('=== IP白名单错误详细信息 ===');
			console.error('错误信息:', error.message);
			console.error('建议解决方案:');
			console.error('1. 检查微信公众平台IP白名单设置');
			console.error('2. 确保包含wechat-proxy云函数的出口IP');
			console.error('3. 如果使用负载均衡器，需要添加所有后端服务器IP');
		}
		
		throw new Error(`获取微信openid失败: ${error.message}`);
	}
} 