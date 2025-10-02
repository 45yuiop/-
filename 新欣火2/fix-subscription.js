// 快速修复订阅消息问题
// 在微信开发者工具控制台中运行

console.log('=== 快速修复订阅消息问题 ===');

async function fixSubscription() {
	try {
		const openid = uni.getStorageSync('openid');
		console.log('当前openid:', openid);
		
		if (!openid) {
			console.log('❌ 未找到openid，请先绑定微信');
			return;
		}
		
		// 1. 强制重新授权
		console.log('\n1️⃣ 强制重新授权...');
		const reauthResult = await uniCloud.callFunction({
			name: 'subscription-message',
			data: {
				action: 'force-reauthorize',
				params: {
					openid: openid,
					templateId: 'sOwar1Xkzk4ApC2eQvvc4SZFH6UbFz_ZA8DZjHHPZf4'
				}
			}
		});
		
		console.log('重新授权结果:', reauthResult);
		
		if (reauthResult.result && reauthResult.result.code === 200) {
			console.log('✅ 订阅状态已重置，现在需要重新授权');
			
			// 2. 调用微信授权API
			console.log('\n2️⃣ 调用微信授权API...');
			try {
				const authResult = await wx.requestSubscribeMessage({
					tmplIds: ['sOwar1Xkzk4ApC2eQvvc4SZFH6UbFz_ZA8DZjHHPZf4']
				});
				
				console.log('微信授权结果:', authResult);
				
				// 3. 确认授权结果
				console.log('\n3️⃣ 确认授权结果...');
				const confirmResult = await uniCloud.callFunction({
					name: 'subscription-message',
					data: {
						action: 'confirm-subscription-auth',
						params: {
							openid: openid,
							templateId: 'sOwar1Xkzk4ApC2eQvvc4SZFH6UbFz_ZA8DZjHHPZf4',
							authResult: authResult['sOwar1Xkzk4ApC2eQvvc4SZFH6UbFz_ZA8DZjHHPZf4'] === 'accept' ? 'accept' : 'reject'
						}
					}
				});
				
				console.log('确认授权结果:', confirmResult);
				
				if (confirmResult.result && confirmResult.result.code === 200) {
					console.log('✅ 订阅消息授权成功！');
					console.log('现在可以尝试发送测试消息了');
					
					// 4. 测试发送消息
					console.log('\n4️⃣ 测试发送消息...');
					setTimeout(async () => {
						const testResult = await uniCloud.callFunction({
							name: 'subscription-message',
							data: {
								action: 'send-schedule-notification',
								params: {
									openid: openid,
									courseName: '修复后测试课程',
									classTime: '2025年8月20日 19:00',
									remark: '这是修复后的测试消息',
									studentName: '测试学员',
									page: 'pages/schedule-tab/schedule-tab'
								}
							}
						});
						
						console.log('测试消息发送结果:', testResult);
						
						if (testResult.result && testResult.result.code === 200) {
							console.log('🎉 修复成功！测试消息发送成功！');
						} else {
							console.log('⚠️ 测试消息发送失败:', testResult.result?.message);
						}
					}, 2000);
					
				} else {
					console.log('❌ 确认授权失败:', confirmResult.result?.message);
				}
				
			} catch (authError) {
				console.error('微信授权失败:', authError);
				console.log('请确保在微信小程序环境中运行此脚本');
			}
			
		} else {
			console.log('❌ 重置订阅状态失败:', reauthResult.result?.message);
		}
		
	} catch (error) {
		console.error('❌ 修复失败:', error);
	}
}

// 运行修复
fixSubscription();

// 导出函数供外部调用
if (typeof module !== 'undefined' && module.exports) {
	module.exports = { fixSubscription };
}

if (typeof window !== 'undefined') {
	window.fixSubscription = fixSubscription;
}
