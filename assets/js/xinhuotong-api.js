// 新火通管理系统 API 集成
// 基于云数据库的教育管理平台

class XinhuotongAPI {
    constructor() {
        this.baseURL = 'https://fc-mp-9670c93e-7aef-46ce-bbba-401692257cfc.next.bspapp.com';
        this.authService = `${this.baseURL}/auth-service`;
        this.studentService = `${this.baseURL}/student-service`;
        this.courseService = `${this.baseURL}/course-service`;
        this.classService = `${this.baseURL}/class-service`;
        this.financeService = `${this.baseURL}/finance-service`;
    }

    // 通用请求方法
    async request(url, options = {}) {
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
        };

        const config = { ...defaultOptions, ...options };
        
        try {
            const response = await fetch(url, config);
            const result = await response.json();
            
            if (result.code === 200) {
                return { success: true, data: result.data, message: result.message };
            } else {
                return { success: false, error: result.message, code: result.code };
            }
        } catch (error) {
            console.error('API请求失败:', error);
            return { success: false, error: error.message };
        }
    }

    // 用户认证相关
    async login(username, password) {
        return await this.request(this.authService, {
            method: 'POST',
            body: JSON.stringify({
                action: 'login',
                params: { username, password }
            })
        });
    }

    async getUserList() {
        return await this.request(this.authService, {
            method: 'POST',
            body: JSON.stringify({
                action: 'get-user-list',
                params: {}
            })
        });
    }

    // 学员管理相关
    async getStudents(page = 1, limit = 20, filters = {}) {
        return await this.request(this.studentService, {
            method: 'POST',
            body: JSON.stringify({
                action: 'get-students',
                params: { page, limit, filters }
            })
        });
    }

    async addStudent(studentData) {
        return await this.request(this.studentService, {
            method: 'POST',
            body: JSON.stringify({
                action: 'add-student',
                params: studentData
            })
        });
    }

    async updateStudent(studentId, studentData) {
        return await this.request(this.studentService, {
            method: 'POST',
            body: JSON.stringify({
                action: 'update-student',
                params: { studentId, ...studentData }
            })
        });
    }

    async deleteStudent(studentId) {
        return await this.request(this.studentService, {
            method: 'POST',
            body: JSON.stringify({
                action: 'delete-student',
                params: { studentId }
            })
        });
    }

    // 课程管理相关
    async getCourses(page = 1, limit = 20, filters = {}) {
        return await this.request(this.courseService, {
            method: 'POST',
            body: JSON.stringify({
                action: 'get-courses',
                params: { page, limit, filters }
            })
        });
    }

    async addCourse(courseData) {
        return await this.request(this.courseService, {
            method: 'POST',
            body: JSON.stringify({
                action: 'add-course',
                params: courseData
            })
        });
    }

    async updateCourse(courseId, courseData) {
        return await this.request(this.courseService, {
            method: 'POST',
            body: JSON.stringify({
                action: 'update-course',
                params: { courseId, ...courseData }
            })
        });
    }

    // 班级管理相关
    async getClasses(page = 1, limit = 20, filters = {}) {
        return await this.request(this.classService, {
            method: 'POST',
            body: JSON.stringify({
                action: 'get-classes',
                params: { page, limit, filters }
            })
        });
    }

    async addClass(classData) {
        return await this.request(this.classService, {
            method: 'POST',
            body: JSON.stringify({
                action: 'add-class',
                params: classData
            })
        });
    }

    async updateClass(classId, classData) {
        return await this.request(this.classService, {
            method: 'POST',
            body: JSON.stringify({
                action: 'update-class',
                params: { classId, ...classData }
            })
        });
    }

    // 课时管理相关
    async purchaseHours(studentId, courseId, hours, amount) {
        return await this.request(this.financeService, {
            method: 'POST',
            body: JSON.stringify({
                action: 'purchase-hours',
                params: { studentId, courseId, hours, amount }
            })
        });
    }

    async deductHours(studentId, courseId, hours, reason = '') {
        return await this.request(this.financeService, {
            method: 'POST',
            body: JSON.stringify({
                action: 'deduct-hours',
                params: { studentId, courseId, hours, reason }
            })
        });
    }

    async getStudentHours(studentId) {
        return await this.request(this.financeService, {
            method: 'POST',
            body: JSON.stringify({
                action: 'get-student-hours',
                params: { studentId }
            })
        });
    }

    // 财务统计相关
    async getFinanceStats(period = 'month') {
        return await this.request(this.financeService, {
            method: 'POST',
            body: JSON.stringify({
                action: 'get-finance-stats',
                params: { period }
            })
        });
    }

    async getAttendanceStats(date = null) {
        return await this.request(this.studentService, {
            method: 'POST',
            body: JSON.stringify({
                action: 'get-attendance-stats',
                params: { date }
            })
        });
    }

    // 待办事项相关
    async getTodoList() {
        return await this.request(this.studentService, {
            method: 'POST',
            body: JSON.stringify({
                action: 'get-todo-list',
                params: {}
            })
        });
    }

    // 数据导出相关
    async exportStudents(format = 'excel') {
        return await this.request(this.studentService, {
            method: 'POST',
            body: JSON.stringify({
                action: 'export-students',
                params: { format }
            })
        });
    }

    async exportFinance(format = 'excel', period = 'month') {
        return await this.request(this.financeService, {
            method: 'POST',
            body: JSON.stringify({
                action: 'export-finance',
                params: { format, period }
            })
        });
    }
}

// 创建全局API实例
window.xinhuotongAPI = new XinhuotongAPI();

// 工具函数
window.XinhuotongUtils = {
    // 格式化金额
    formatCurrency(amount) {
        return new Intl.NumberFormat('zh-CN', {
            style: 'currency',
            currency: 'CNY'
        }).format(amount);
    },

    // 格式化日期
    formatDate(date, format = 'YYYY-MM-DD') {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        
        switch (format) {
            case 'YYYY-MM-DD':
                return `${year}-${month}-${day}`;
            case 'YYYY-MM-DD HH:mm':
                return `${year}-${month}-${day} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
            default:
                return d.toLocaleDateString('zh-CN');
        }
    },

    // 显示通知
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            max-width: 300px;
        `;
        
        switch (type) {
            case 'success':
                notification.style.background = 'linear-gradient(135deg, #4ade80, #22c55e)';
                break;
            case 'error':
                notification.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
                break;
            case 'warning':
                notification.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
                break;
            default:
                notification.style.background = 'linear-gradient(135deg, #3b82f6, #2563eb)';
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    },

    // 确认对话框
    confirm(message, title = '确认') {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
            `;
            
            modal.innerHTML = `
                <div style="
                    background: #1a1a1a;
                    border: 1px solid #00ffff;
                    border-radius: 15px;
                    padding: 30px;
                    max-width: 400px;
                    text-align: center;
                    box-shadow: 0 20px 40px rgba(0, 255, 255, 0.2);
                ">
                    <h3 style="color: #00ffff; margin-bottom: 20px; font-size: 20px;">${title}</h3>
                    <p style="color: #fff; margin-bottom: 30px; line-height: 1.6;">${message}</p>
                    <div style="display: flex; gap: 15px; justify-content: center;">
                        <button id="confirm-yes" style="
                            background: linear-gradient(135deg, #00ffff, #0080ff);
                            color: #000;
                            border: none;
                            padding: 10px 25px;
                            border-radius: 8px;
                            cursor: pointer;
                            font-weight: 600;
                        ">确认</button>
                        <button id="confirm-no" style="
                            background: transparent;
                            color: #fff;
                            border: 1px solid #666;
                            padding: 10px 25px;
                            border-radius: 8px;
                            cursor: pointer;
                            font-weight: 600;
                        ">取消</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            document.getElementById('confirm-yes').onclick = () => {
                document.body.removeChild(modal);
                resolve(true);
            };
            
            document.getElementById('confirm-no').onclick = () => {
                document.body.removeChild(modal);
                resolve(false);
            };
        });
    }
};

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
