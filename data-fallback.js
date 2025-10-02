// 数据库连接失败时的备用数据获取方案
window.DataFallback = {
    // 最后已知的真实数据（从API获取的实际数据）
    lastKnownData: {
        student_stats: { totalStudents: 44 },
        course_stats: { totalCourses: 51 },
        teacher_stats: { totalTeachers: 40 },
        class_stats: { totalClasses: 11 }
    },
    
    // 获取数据的多种方法
    async getData() {
        const methods = [
            this.getFromAPI.bind(this),
            this.getFromJSONP.bind(this),
            this.getFromProxy.bind(this),
            this.getFromCache.bind(this)
        ];
        
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
    
    // 方法1：直接API请求
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
    
    // 方法2：JSONP方式（如果API支持）
    async getFromJSONP() {
        console.log('🔄 尝试JSONP请求...');
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            const callbackName = 'dataCallback_' + Date.now();
            
            window[callbackName] = (data) => {
                document.head.removeChild(script);
                delete window[callbackName];
                resolve(this.parseAPIResponse(data));
            };
            
            script.onerror = () => {
                document.head.removeChild(script);
                delete window[callbackName];
                reject(new Error('JSONP请求失败'));
            };
            
            script.src = `https://fc-mp-9670c93e-7aef-46ce-bbba-401692257cfc.next.bspapp.com/data-stats?callback=${callbackName}&type=all`;
            document.head.appendChild(script);
            
            // 10秒超时
            setTimeout(() => {
                if (document.head.contains(script)) {
                    document.head.removeChild(script);
                    delete window[callbackName];
                    reject(new Error('JSONP请求超时'));
                }
            }, 10000);
        });
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
