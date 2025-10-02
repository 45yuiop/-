// 数据库连接失败时的备用数据获取方案
window.DataFallback = {
    // 最后已知的真实数据（从API获取的实际数据）
    lastKnownData: {
        student_stats: { totalStudents: 44 },
        course_stats: { totalCourses: 51 },
        teacher_stats: { totalTeachers: 40 },
        class_stats: { totalClasses: 11 }
    },
    
    // 获取数据的多种方法（智能环境检测）
    async getData() {
        const isVercel = window.location.hostname.includes('vercel.app');
        const isGitHubPages = window.location.hostname.includes('github.io');
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        
        console.log('🌐 检测到环境:', {
            hostname: window.location.hostname,
            isVercel,
            isGitHubPages,
            isLocalhost
        });
        
        let methods = [];
        
        if (isVercel) {
            // Vercel环境：优先使用本地代理
            methods = [
                this.getFromVercelProxy.bind(this),
                this.getFromAPI.bind(this),
                this.getFromCache.bind(this)
            ];
        } else if (isLocalhost) {
            // 本地环境：直接API请求
            methods = [
                this.getFromAPI.bind(this),
                this.getFromCache.bind(this)
            ];
        } else {
            // 其他环境（如GitHub Pages）：使用公共代理
            methods = [
                this.getFromAPI.bind(this),
                this.getFromProxy.bind(this),
                this.getFromCache.bind(this)
            ];
        }
        
        for (const method of methods) {
            try {
                const data = await method();
                if (data) {
                    // 保存成功获取的数据
                    this.saveToCache(data);
                    return data;
                }
            } catch (error) {
                console.log('方法失败:', error.message);
                continue;
            }
        }
        
        throw new Error('所有数据获取方法都失败了');
    },
    
    // 方法1：Vercel代理请求
    async getFromVercelProxy() {
        console.log('🔄 尝试Vercel代理请求...');
        const response = await fetch('/api/data-proxy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ type: 'all' })
        });
        
        if (!response.ok) {
            throw new Error(`Vercel代理错误: ${response.status}`);
        }
        
        const result = await response.json();
        return this.parseAPIResponse(result);
    },

    // 方法2：直接API请求
    async getFromAPI() {
        console.log('🔄 尝试直接API请求...');
        const response = await fetch('https://fc-mp-9670c93e-7aef-46ce-bbba-401692257cfc.next.bspapp.com/data-stats', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ type: 'all' })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const result = await response.json();
        return this.parseAPIResponse(result);
    },
    
    // 方法3：使用公共代理
    async getFromProxy() {
        console.log('🔄 尝试代理服务...');
        const proxyUrl = 'https://api.allorigins.win/get?url=' + 
            encodeURIComponent('https://fc-mp-9670c93e-7aef-46ce-bbba-401692257cfc.next.bspapp.com/data-stats');
        
        const response = await fetch(proxyUrl);
        if (!response.ok) {
            throw new Error(`代理服务错误: ${response.status}`);
        }
        
        const proxyResult = await response.json();
        if (!proxyResult.contents) {
            throw new Error('代理服务返回空内容');
        }
        
        const apiResult = JSON.parse(proxyResult.contents);
        return this.parseAPIResponse(apiResult);
    },
    
    // 方法4：从缓存获取
    async getFromCache() {
        console.log('🔄 尝试从缓存获取...');
        const cached = localStorage.getItem('xinxinhuo_data_cache');
        if (!cached) {
            throw new Error('无缓存数据');
        }
        
        const cacheData = JSON.parse(cached);
        const now = Date.now();
        
        // 缓存超过1小时则无效
        if (now - cacheData.timestamp > 3600000) {
            throw new Error('缓存数据已过期');
        }
        
        console.log('✅ 使用缓存数据');
        return cacheData.data;
    },
    
    // 解析API响应
    parseAPIResponse(result) {
        let actualData;
        if (result.body) {
            const bodyData = JSON.parse(result.body);
            if (bodyData.code !== 200) {
                throw new Error(bodyData.message || '数据加载失败');
            }
            actualData = bodyData.data;
        } else if (result.code === 200) {
            actualData = result.data;
        } else {
            throw new Error(result.message || '数据加载失败');
        }
        
        return actualData;
    },
    
    // 保存到缓存
    saveToCache(data) {
        try {
            const cacheData = {
                data: data,
                timestamp: Date.now()
            };
            localStorage.setItem('xinxinhuo_data_cache', JSON.stringify(cacheData));
            console.log('💾 数据已保存到缓存');
        } catch (error) {
            console.log('❌ 缓存保存失败:', error.message);
        }
    }
};
