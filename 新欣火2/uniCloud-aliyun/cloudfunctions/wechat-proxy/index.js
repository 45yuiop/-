'use strict';

exports.main = async (event, context) => {
	console.log('=== 微信API代理开始 ===');
	
	try {
		const { action, params } = event;
		
		switch (action) {
			case 'code2session':
				return await handleCode2Session(params);
			case 'get-access-token':
				return await handleGetAccessToken(params);
			case 'send-subscribe-message':
				return await handleSendSubscribeMessage(params);
			default:
				return {
					code: 400,
					message: '不支持的操作'
				};
		}
		
	} catch (error) {
		console.error('微信API代理执行失败:', error);
		return {
			code: 500,
			message: '微信API代理执行失败',
			error: error.message
		};
	}
};

// 处理code2session请求
async function handleCode2Session(params) {
	try {
		const { code } = params;
		
		if (!code) {
			return {
				code: 400,
				message: '缺少code参数'
			};
		}
		
		// 微信小程序配置
		const appid = 'wx9f7a595a2467a31d';
		const secret = 'dbecd227d392efee60fd6791e754d478';
		
		// 构建请求URL
		const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`;
		
		console.log('调用微信code2session API:', url.replace(secret, '***'));
		
		// 调用微信API
		const result = await uniCloud.httpclient.request(url, {
			method: 'GET',
			timeout: 15000,
			dataType: 'json'
		});
		
		console.log('微信API响应:', result.data);
		
		if (result.data.errcode && result.data.errcode !== 0) {
			// 如果是IP白名单错误，提供解决方案
			if (result.data.errcode === 40164) {
				return {
					code: 40164,
					message: 'IP地址不在白名单中',
					wechatError: result.data,
					solution: {
						type: 'ip_whitelist',
						steps: [
							'1. 登录微信公众平台 (https://mp.weixin.qq.com/)',
							'2. 进入"开发" -> "基本配置"',
							'3. 在"IP白名单"中添加以下IP地址：',
							'4. 保存配置并等待生效'
						],
						note: 'IP白名单配置通常需要几分钟生效'
					}
				};
			}
			
			return {
				code: 500,
				message: `微信API错误: ${result.data.errcode} - ${result.data.errmsg}`,
				wechatError: result.data
			};
		}
		
		return {
			code: 200,
			message: '获取openid成功',
			data: {
				openid: result.data.openid,
				session_key: result.data.session_key,
				unionid: result.data.unionid
			}
		};
		
	} catch (error) {
		console.error('code2session执行失败:', error);
		
		// 检查是否是IP白名单错误
		if (error.message && (error.message.includes('40164') || error.message.includes('not in whitelist'))) {
			return {
				code: 40164,
				message: 'IP地址不在白名单中',
				error: error.message,
				solution: {
					type: 'ip_whitelist',
					steps: [
						'1. 登录微信公众平台',
						'2. 进入"开发" -> "基本配置"',
						'3. 在"IP白名单"中添加云函数出口IP',
						'4. 保存配置并等待生效'
					]
				}
			};
		}
		
		return {
			code: 500,
			message: '获取openid失败',
			error: error.message
		};
	}
}

// 处理获取access_token请求
async function handleGetAccessToken(params) {
	try {
		// 微信小程序配置
		const appid = 'wx9f7a595a2467a31d';
		const secret = 'dbecd227d392efee60fd6791e754d478';
		
		// 构建请求URL
		const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`;
		
		console.log('调用微信获取access_token API:', url.replace(secret, '***'));
		
		// 调用微信API
		const result = await uniCloud.httpclient.request(url, {
			method: 'GET',
			timeout: 15000,
			dataType: 'json'
		});
		
		console.log('微信API响应:', result.data);
		
		if (result.data.errcode && result.data.errcode !== 0) {
			// 如果是IP白名单错误，提供解决方案
			if (result.data.errcode === 40164) {
				return {
					code: 40164,
					message: 'IP地址不在白名单中',
					wechatError: result.data,
					solution: {
						type: 'ip_whitelist',
						steps: [
							'1. 登录微信公众平台',
							'2. 进入"开发" -> "基本配置"',
							'3. 在"IP白名单"中添加云函数出口IP',
							'4. 保存配置并等待生效'
						]
					}
				};
			}
			
			return {
				code: 500,
				message: `微信API错误: ${result.data.errcode} - ${result.data.errmsg}`,
				wechatError: result.data
			};
		}
		
		return {
			code: 200,
			message: '获取access_token成功',
			data: {
				access_token: result.data.access_token,
				expires_in: result.data.expires_in
			}
		};
		
	} catch (error) {
		console.error('获取access_token失败:', error);
		
		// 检查是否是IP白名单错误
		if (error.message && (error.message.includes('40164') || error.message.includes('not in whitelist'))) {
			return {
				code: 40164,
				message: 'IP地址不在白名单中',
				error: error.message,
				solution: {
					type: 'ip_whitelist',
					steps: [
						'1. 登录微信公众平台',
						'2. 进入"开发" -> "基本配置"',
						'3. 在"IP白名单"中添加云函数出口IP',
						'4. 保存配置并等待生效'
					]
				}
			};
		}
		
		return {
			code: 500,
			message: '获取access_token失败',
			error: error.message
		};
	}
}

// 处理发送订阅消息请求
async function handleSendSubscribeMessage(params) {
	try {
		const { access_token, messageData } = params;
		
		if (!access_token || !messageData) {
			return {
				code: 400,
				message: '缺少必要参数'
			};
		}
		
		// 构建请求URL
		const url = `https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=${access_token}`;
		
		console.log('调用微信发送订阅消息API');
		console.log('消息数据:', JSON.stringify(messageData));
		
		// 调用微信API
		const result = await uniCloud.httpclient.request(url, {
			method: 'POST',
			data: messageData,
			contentType: 'json',
			timeout: 15000,
			dataType: 'json'
		});
		
		console.log('微信API响应:', result.data);
		
		if (result.data.errcode && result.data.errcode !== 0) {
			// 如果是IP白名单错误，提供解决方案
			if (result.data.errcode === 40164) {
				return {
					code: 40164,
					message: 'IP地址不在白名单中',
					wechatError: result.data,
					solution: {
						type: 'ip_whitelist',
						steps: [
							'1. 登录微信公众平台',
							'2. 进入"开发" -> "基本配置"',
							'3. 在"IP白名单"中添加云函数出口IP',
							'4. 保存配置并等待生效'
						]
					}
				};
			}
			
			return {
				code: 500,
				message: `微信API错误: ${result.data.errcode} - ${result.data.errmsg}`,
				wechatError: result.data
			};
		}
		
		return {
			code: 200,
			message: '订阅消息发送成功',
			data: {
				msgid: result.data.msgid
			}
		};
		
	} catch (error) {
		console.error('发送订阅消息失败:', error);
		
		// 检查是否是IP白名单错误
		if (error.message && (error.message.includes('40164') || error.message.includes('not in whitelist'))) {
			return {
				code: 40164,
				message: 'IP地址不在白名单中',
				error: error.message,
				solution: {
					type: 'ip_whitelist',
					steps: [
						'1. 登录微信公众平台',
						'2. 进入"开发" -> "基本配置"',
						'3. 在"IP白名单"中添加云函数出口IP',
						'4. 保存配置并等待生效'
					]
				}
			};
		}
		
		return {
			code: 500,
			message: '发送订阅消息失败',
			error: error.message
		};
	}
}
