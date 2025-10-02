const {
	isUniverify,
	isWeixin,
	isApple
} = require('./platform.js')

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