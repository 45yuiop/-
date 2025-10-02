/**
 * 订阅消息错误处理工具
 */

// 错误码映射表
const ERROR_CODES = {
    '43101': {
        name: '用户拒绝接收消息',
        description: '用户已拒绝接收订阅消息，需要重新授权',
        solution: '重新获取微信订阅消息授权',
        action: 'reauth'
    },
    '45009': {
        name: '接口调用超过限制',
        description: '微信API调用频率超限',
        solution: '等待一段时间后重试',
        action: 'wait'
    }
};

/**
 * 解析错误信息
 */
export function parseError(errorDetail) {
    if (!errorDetail) {
        return {
            code: 'unknown',
            name: '未知错误',
            description: '无法识别的错误类型',
            solution: '联系技术支持'
        };
    }
    
    // 尝试提取错误码
    const errorMatch = errorDetail.match(/(\d+)/);
    if (errorMatch) {
        const errorCode = errorMatch[1];
        const errorInfo = ERROR_CODES[errorCode];
        
        if (errorInfo) {
            return {
                code: errorCode,
                ...errorInfo
            };
        }
    }
    
    // 根据错误描述判断类型
    if (errorDetail.includes('用户拒绝') || errorDetail.includes('43101')) {
        return ERROR_CODES['43101'];
    }
    
    return {
        code: 'unknown',
        name: '未知错误',
        description: errorDetail,
        solution: '联系技术支持'
    };
}

/**
 * 获取错误处理建议
 */
export function getErrorSuggestion(errorInfo) {
    const { name, description, solution } = errorInfo;
    
    let suggestion = `错误类型：${name}\n`;
    suggestion += `错误描述：${description}\n\n`;
    suggestion += `解决方案：${solution}`;
    
    if (errorInfo.code === '43101') {
        suggestion += '\n\n具体步骤：\n1. 点击"智能重新授权"按钮\n2. 在微信授权页面点击"允许"\n3. 等待授权完成\n4. 重新测试消息发送';
    }
    
    return suggestion;
}

export default {
    parseError,
    getErrorSuggestion,
    ERROR_CODES
};
