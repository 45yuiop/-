const {
	isUniverify,
	isWeixin,
	isApple,
	getClientInfo
} = require('./platform.js')
const uniIdConfig = require('uni-id/config.json')

function getConfig(context) {
	const clientInfo = getClientInfo(context)
	const univerifyConfig = uniIdConfig.app.univerify
	if (clientInfo.platform === 'app' && clientInfo.osName === 'ios') {
		return univerifyConfig.ios
	}
	if (clientInfo.platform === 'app' && clientInfo.osName === 'android') {
		return univerifyConfig.android
	}
	// 其他端暂不支持
	return {}
}

module.exports = {
	isUniverify,
	isWeixin,
	isApple,
	getClientInfo,
	getConfig
} 