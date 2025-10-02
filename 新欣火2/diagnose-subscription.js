// 订阅消息诊断脚本
// 在微信开发者工具控制台中运行

console.log('=== 订阅消息诊断脚本 ===');

async function diagnoseSubscription() {
	try {
		const openid = uni.getStorageSync('openid');
		console.log('当前openid:', openid);
		
		if (!openid) {
			console.log('❌ 未找到openid，请先绑定微信');
			return;
		}
		
		// 1. 检查订阅请求状态
		console.log('\n1️⃣ 检查订阅请求状态...');
		const subscriptionResult = await uniCloud.callFunction({
			name: 'subscription-message',
			data: {
				action: 'get-subscription-status',
				params: { openid: openid }
			}
		});
		
		console.log('订阅状态检查结果:', subscriptionResult);
		
		// 2. 检查数据库中的订阅记录
		console.log('\n2️⃣ 检查数据库订阅记录...');
		const dbResult = await uniCloud.callFunction({
			name: 'subscription-message',
			data: {
				action: 'check-db-subscription',
				params: { openid: openid }
			}
		});
		
		console.log('数据库检查结果:', dbResult);
		
		// 3. 尝试发送测试消息
		console.log('\n3️⃣ 尝试发送测试消息...');
		const testResult = await uniCloud.callFunction({
			name: 'subscription-message',
			data: {
				action: 'send-schedule-notification',
				params: {
					openid: openid,
					courseName: '诊断测试课程',
					classTime: '2025年8月20日 18:00',
					remark: '这是诊断测试消息',
					studentName: '测试学员',
					page: 'pages/schedule-tab/schedule-tab'
				}
			}
		});
		
		console.log('测试消息发送结果:', testResult);
		
		// 4. 分析问题
		console.log('\n4️⃣ 问题分析...');
		if (testResult.result && testResult.result.code === 403) {
			console.log('❌ 问题确认：用户未授权订阅消息');
			console.log('解决方案：需要重新授权');
		} else if (testResult.result && testResult.result.code === 200) {
			console.log('✅ 测试消息发送成功');
		} else {
			console.log('⚠️ 其他问题:', testResult.result?.message);
		}
		
	} catch (error) {
		console.error('❌ 诊断失败:', error);
	}
}

// 运行诊断
diagnoseSubscription();

// 导出函数供外部调用
if (typeof module !== 'undefined' && module.exports) {
	module.exports = { diagnoseSubscription };
}

if (typeof window !== 'undefined') {
	window.diagnoseSubscription = diagnoseSubscription;
}
