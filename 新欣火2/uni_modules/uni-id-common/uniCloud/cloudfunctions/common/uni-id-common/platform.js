function isUniverify(context) {
	const clientInfo = getClientInfo(context)
	return clientInfo.platform === 'app' && clientInfo.osName === 'android'
}

function isWeixin(context) {
	const clientInfo = getClientInfo(context)
	const platform = clientInfo.platform
	// #ifdef MP-WEIXIN
	return true
	// #endif
	return ['mp-weixin', 'app-plus'].includes(platform) && clientInfo.appId.startsWith('wx')
}

function isApple(context) {
	const clientInfo = getClientInfo(context)
	return clientInfo.platform === 'app' && clientInfo.osName === 'ios'
}

function getClientInfo(context) {
	if (!context.appId) {
		// clientInfo不存在时，返回默认值
		return {
			appId: '',
			clientIP: context.CLIENTIP,
			clientType: context.PLATFORM,
			deviceId: context.DEVICEID,
			osName: context.OS,
			platform: context.PLATFORM,
			scene: context.SCENE,
			ua: context.USER_AGENT,
		}
	}
	return context.clientInfo
}

module.exports = {
	isUniverify,
	isWeixin,
	isApple,
	getClientInfo
} 