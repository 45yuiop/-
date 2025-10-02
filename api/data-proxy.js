// Vercel Serverless Function - 数据代理
export default async function handler(req, res) {
    // 设置CORS头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // 处理预检请求
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    try {
        // uniCloud API地址
        const apiUrl = 'https://fc-mp-9670c93e-7aef-46ce-bbba-401692257cfc.next.bspapp.com/data-stats';
        
        // 获取请求数据
        const requestData = req.body || { type: 'all' };
        
        console.log('🔄 代理请求到uniCloud:', requestData);
        
        // 发送请求到uniCloud
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(requestData)
        });
        
        if (!response.ok) {
            throw new Error(`uniCloud API错误: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('✅ 成功获取uniCloud数据');
        
        // 返回数据
        res.status(200).json(data);
        
    } catch (error) {
        console.error('❌ 代理请求失败:', error);
        
        res.status(500).json({
            error: true,
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
}
