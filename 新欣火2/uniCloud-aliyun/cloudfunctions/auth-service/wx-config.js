// 微信小程序配置 - 云函数内部配置文件
module.exports = {
    // 小程序 appid
    appid: 'wx9f7a595a2467a31d',
    
    // 小程序 secret
    secret: 'dbecd227d392efee60fd6791e754d478',
    
    // 订阅消息模板ID
    templates: {
        scheduleNotification: 'sOwar1Xkzk4SZFH6UbFz_ZA8DZjHHPZf4'
    },
    
    // 微信API接口地址
    api: {
        accessToken: 'https://api.weixin.qq.com/cgi-bin/token',
        sendSubscribeMessage: 'https://api.weixin.qq.com/cgi-bin/message/subscribe/send',
        code2Session: 'https://api.weixin.qq.com/sns/jscode2session'
    }
};
