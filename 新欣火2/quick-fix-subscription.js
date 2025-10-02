// 快速修复订阅状态问题
// 在微信开发者工具控制台中运行

console.log('=== 快速修复订阅状态问题 ===');

async function quickFixSubscription() {
	try {
		const openid = uni.getStorageSync('openid');
		console.log('当前openid:', openid);
		
		if (!openid) {
			console.log('❌ 未找到openid，请先绑定微信');
			return;
		}
		
		// 1. 强制重新授权订阅消息
		console.log('\n1️⃣ 强制重新授权订阅消息...');
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
			console.log('✅ 订阅状态已重置');
			
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
					
					// 4. 刷新页面状态
					console.log('\n4️⃣ 刷新页面状态...');
					setTimeout(() => {
						// 刷新页面以更新状态
						const pages = getCurrentPages();
						const currentPage = pages[pages.length - 1];
						if (currentPage && currentPage.checkSubscriptionStatus) {
							currentPage.checkSubscriptionStatus();
							console.log('✅ 页面状态已刷新');
						} else {
							console.log('⚠️ 无法刷新页面状态，请手动刷新页面');
						}
					}, 1000);
					
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
quickFixSubscription();

// 导出函数供外部调用
if (typeof module !== 'undefined' && module.exports) {
	module.exports = { quickFixSubscription };
}

if (typeof window !== 'undefined') {
	window.quickFixSubscription = quickFixSubscription;
}
