'use strict';
const db = uniCloud.database();
const $ = db.command.aggregate;
const dbCmd = db.command;

exports.main = async (event, context) => {
    try {
        // 处理HTTP请求
        let type;
        if (event.body) {
            // HTTP请求的body数据
            const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
            type = body.type;
        } else {
            // 直接调用时的参数
            type = event.type;
        }
        
        console.log('接收到的type参数:', type);
        
        let result = {};
        
        switch (type) {
            case 'student_stats':
                result = await getStudentStats();
                break;
            case 'course_stats':
                result = await getCourseStats();
                break;
            case 'teacher_stats':
                result = await getTeacherStats();
                break;
            case 'class_stats':
                result = await getClassStats();
                break;
            case 'all':
                result = {
                    student_stats: await getStudentStats(),
                    course_stats: await getCourseStats(),
                    teacher_stats: await getTeacherStats(),
                    class_stats: await getClassStats()
                };
                break;
            default:
                const errorResponse = {
                    code: 400,
                    message: '无效的数据类型'
                };
                return {
                    statusCode: 400,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify(errorResponse)
                };
        }
        
        // HTTP响应格式
        const response = {
            code: 200,
            data: result,
            message: '获取成功'
        };
        
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify(response)
        };
        
    } catch (error) {
        console.error('获取统计数据失败:', error);
        const errorResponse = {
            code: 500,
            message: '获取统计数据失败: ' + error.message
        };
        
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(errorResponse)
        };
    }
};

// 获取学生统计数据
async function getStudentStats() {
    try {
        // 获取学生总数
        const studentCount = await db.collection('students').count();
        
        // 获取活跃学生数（状态为active）
        const activeStudentCount = await db.collection('students').where({
            status: 'active'
        }).count();
        
        // 获取本月新增学生数
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        
        const newStudentsThisMonth = await db.collection('students').where({
            createTime: dbCmd.gte(startOfMonth)
        }).count();
        
        // 按年级统计学生数
        const studentsByGrade = await db.collection('students').aggregate()
            .group({
                _id: '$grade',
                count: $.sum(1)
            })
            .end();
        
        // 按学科统计学生数
        const studentsBySubject = await db.collection('students').aggregate()
            .unwind('$subjects')
            .group({
                _id: '$subjects',
                count: $.sum(1)
            })
            .end();
        
        return {
            type: 'student_stats',
            timestamp: new Date().toISOString(),
            totalStudents: studentCount.total,
            activeStudents: activeStudentCount.total,
            newStudentsThisMonth: newStudentsThisMonth.total,
            studentsByGrade: formatGroupData(studentsByGrade.data),
            studentsBySubject: formatGroupData(studentsBySubject.data),
            received_at: new Date().toLocaleString('zh-CN'),
            ip: 'uniCloud'
        };
        
    } catch (error) {
        console.error('获取学生统计数据失败:', error);
        return {
            type: 'student_stats',
            timestamp: new Date().toISOString(),
            totalStudents: 0,
            activeStudents: 0,
            newStudentsThisMonth: 0,
            studentsByGrade: {},
            studentsBySubject: {},
            received_at: new Date().toLocaleString('zh-CN'),
            ip: 'uniCloud',
            error: error.message
        };
    }
}

// 获取课程统计数据
async function getCourseStats() {
    try {
        // 获取所有courses记录
        const allCourses = await db.collection('courses').get();
        
        // 提取所有课程名称并去重
        const courseNames = new Set();
        
        allCourses.data.forEach(record => {
            // 遍历8个课程时间段
            for (let i = 1; i <= 8; i++) {
                const courseName = record[`course_slot_${i}`];
                // 只统计非空的课程名称，排除空字符串和"无"
                if (courseName && courseName.trim() !== '' && courseName.trim() !== '无') {
                    courseNames.add(courseName.trim());
                }
            }
        });
        
        const courseCount = courseNames.size;
        console.log('不同的课程名称数量:', courseCount);
        console.log('课程名称列表:', Array.from(courseNames));
        
        // 获取活跃课程数
        const activeCourseCount = await db.collection('courses').where({
            status: 'active'
        }).count();
        
        // 获取本月新增课程数
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        
        const newCoursesThisMonth = await db.collection('courses').where({
            createTime: dbCmd.gte(startOfMonth)
        }).count();
        
        // 按学科统计课程数（从课程名称中提取）
        const coursesBySubject = {};
        const coursesByGrade = {};
        
        courseNames.forEach(courseName => {
            // 简单的学科提取逻辑，可以根据实际需要调整
            if (courseName.includes('数学')) {
                coursesBySubject['数学'] = (coursesBySubject['数学'] || 0) + 1;
            } else if (courseName.includes('英语')) {
                coursesBySubject['英语'] = (coursesBySubject['英语'] || 0) + 1;
            } else if (courseName.includes('语文')) {
                coursesBySubject['语文'] = (coursesBySubject['语文'] || 0) + 1;
            } else if (courseName.includes('物理')) {
                coursesBySubject['物理'] = (coursesBySubject['物理'] || 0) + 1;
            } else if (courseName.includes('化学')) {
                coursesBySubject['化学'] = (coursesBySubject['化学'] || 0) + 1;
            } else {
                coursesBySubject['其他'] = (coursesBySubject['其他'] || 0) + 1;
            }
            
            // 年级提取逻辑
            if (courseName.includes('一年级') || courseName.includes('1年级')) {
                coursesByGrade['一年级'] = (coursesByGrade['一年级'] || 0) + 1;
            } else if (courseName.includes('二年级') || courseName.includes('2年级')) {
                coursesByGrade['二年级'] = (coursesByGrade['二年级'] || 0) + 1;
            } else if (courseName.includes('三年级') || courseName.includes('3年级')) {
                coursesByGrade['三年级'] = (coursesByGrade['三年级'] || 0) + 1;
            } else if (courseName.includes('四年级') || courseName.includes('4年级')) {
                coursesByGrade['四年级'] = (coursesByGrade['四年级'] || 0) + 1;
            } else if (courseName.includes('五年级') || courseName.includes('5年级')) {
                coursesByGrade['五年级'] = (coursesByGrade['五年级'] || 0) + 1;
            } else if (courseName.includes('六年级') || courseName.includes('6年级')) {
                coursesByGrade['六年级'] = (coursesByGrade['六年级'] || 0) + 1;
            } else if (courseName.includes('七年级') || courseName.includes('7年级')) {
                coursesByGrade['七年级'] = (coursesByGrade['七年级'] || 0) + 1;
            } else if (courseName.includes('八年级') || courseName.includes('8年级')) {
                coursesByGrade['八年级'] = (coursesByGrade['八年级'] || 0) + 1;
            } else if (courseName.includes('九年级') || courseName.includes('9年级')) {
                coursesByGrade['九年级'] = (coursesByGrade['九年级'] || 0) + 1;
            } else if (courseName.includes('高一') || courseName.includes('高1')) {
                coursesByGrade['高一'] = (coursesByGrade['高一'] || 0) + 1;
            } else if (courseName.includes('高二') || courseName.includes('高2')) {
                coursesByGrade['高二'] = (coursesByGrade['高二'] || 0) + 1;
            } else if (courseName.includes('高三') || courseName.includes('高3')) {
                coursesByGrade['高三'] = (coursesByGrade['高三'] || 0) + 1;
            } else {
                coursesByGrade['其他'] = (coursesByGrade['其他'] || 0) + 1;
            }
        });
        
        return {
            type: 'course_stats',
            timestamp: new Date().toISOString(),
            totalCourses: courseCount,
            activeCourses: activeCourseCount.total,
            coursesThisMonth: newCoursesThisMonth.total,
            coursesBySubject: coursesBySubject,
            coursesByGrade: coursesByGrade,
            received_at: new Date().toLocaleString('zh-CN'),
            ip: 'uniCloud'
        };
        
    } catch (error) {
        console.error('获取课程统计数据失败:', error);
        return {
            type: 'course_stats',
            timestamp: new Date().toISOString(),
            totalCourses: 0,
            activeCourses: 0,
            coursesThisMonth: 0,
            coursesBySubject: {},
            coursesByGrade: {},
            received_at: new Date().toLocaleString('zh-CN'),
            ip: 'uniCloud',
            error: error.message
        };
    }
}

// 获取教师统计数据
async function getTeacherStats() {
    try {
        // 获取教师总数（所有uni-id-users表中的用户都是老师）
        const teacherCount = await db.collection('uni-id-users').count();
        
        // 获取活跃教师数（所有正常状态的用户）
        const activeTeacherCount = await db.collection('uni-id-users').where({
            status: 0 // 0表示正常状态
        }).count();
        
        // 获取本月新增教师数
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        
        const newTeachersThisMonth = await db.collection('uni-id-users').where({
            register_date: dbCmd.gte(startOfMonth)
        }).count();
        
        // 按学科统计教师数（从课程表中统计）
        const teachersBySubject = await db.collection('schedules').aggregate()
            .group({
                _id: '$course_slot_1',
                count: $.sum(1)
            })
            .end();
        
        return {
            type: 'teacher_stats',
            timestamp: new Date().toISOString(),
            totalTeachers: teacherCount.total,
            activeTeachers: activeTeacherCount.total,
            newTeachersThisMonth: newTeachersThisMonth.total,
            teachersBySubject: formatGroupData(teachersBySubject.data),
            received_at: new Date().toLocaleString('zh-CN'),
            ip: 'uniCloud'
        };
        
    } catch (error) {
        console.error('获取教师统计数据失败:', error);
        return {
            type: 'teacher_stats',
            timestamp: new Date().toISOString(),
            totalTeachers: 0,
            activeTeachers: 0,
            newTeachersThisMonth: 0,
            teachersBySubject: {},
            received_at: new Date().toLocaleString('zh-CN'),
            ip: 'uniCloud',
            error: error.message
        };
    }
}

// 获取班级统计数据
async function getClassStats() {
    try {
        // 获取班级总数
        const classCount = await db.collection('classes').count();
        
        // 获取活跃班级数
        const activeClassCount = await db.collection('classes').where({
            status: 'active'
        }).count();
        
        // 获取本月新增班级数
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        
        const newClassesThisMonth = await db.collection('classes').where({
            createTime: dbCmd.gte(startOfMonth)
        }).count();
        
        // 按年级统计班级数
        const classesByGrade = await db.collection('classes').aggregate()
            .group({
                _id: '$grade',
                count: $.sum(1)
            })
            .end();
        
        // 按学科统计班级数
        const classesBySubject = await db.collection('classes').aggregate()
            .group({
                _id: '$subject',
                count: $.sum(1)
            })
            .end();
        
        return {
            type: 'class_stats',
            timestamp: new Date().toISOString(),
            totalClasses: classCount.total,
            activeClasses: activeClassCount.total,
            newClassesThisMonth: newClassesThisMonth.total,
            classesByGrade: formatGroupData(classesByGrade.data),
            classesBySubject: formatGroupData(classesBySubject.data),
            received_at: new Date().toLocaleString('zh-CN'),
            ip: 'uniCloud'
        };
        
    } catch (error) {
        console.error('获取班级统计数据失败:', error);
        return {
            type: 'class_stats',
            timestamp: new Date().toISOString(),
            totalClasses: 0,
            activeClasses: 0,
            newClassesThisMonth: 0,
            classesByGrade: {},
            classesBySubject: {},
            received_at: new Date().toLocaleString('zh-CN'),
            ip: 'uniCloud',
            error: error.message
        };
    }
}

// 格式化分组数据
function formatGroupData(data) {
    const result = {};
    data.forEach(item => {
        if (item._id) {
            result[item._id] = item.count;
        }
    });
    return result;
}
