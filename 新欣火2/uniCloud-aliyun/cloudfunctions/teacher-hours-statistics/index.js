'use strict';

const db = uniCloud.database();
const dbCmd = db.command;

exports.main = async (event, context) => {
  const { action, params } = event;
  
  switch (action) {
    case 'get-teacher-hours':
      return await getTeacherHours(params);
    case 'get-all-teachers-hours':
      return await getAllTeachersHours(params);
    default:
      return {
        code: 400,
        message: '无效的操作类型'
      };
  }
};

// 获取指定教师的课时统计
async function getTeacherHours(params) {
  try {
    const { teacher_id, startDate, endDate } = params;
    
    if (!teacher_id || !startDate || !endDate) {
      return {
        code: 400,
        message: '缺少必要参数'
      };
    }

    // 获取教师信息
    const userRes = await db.collection('uni-id-users')
      .doc(teacher_id)
      .field({ username: 1, teacherName: 1 })
      .get();
    
    if (!userRes.data || userRes.data.length === 0) {
      return {
        code: 404,
        message: '未找到该教师'
      };
    }
    
    const teacher = userRes.data[0];
    
    // 查询该教师在指定时间范围内的课程安排
    const schedulesRes = await db.collection('schedules')
      .where({
        username: teacher.username,
        course_date: dbCmd.gte(new Date(startDate)).and(dbCmd.lte(new Date(endDate)))
      })
      .get();
    
    // 统计课时
    const hoursStats = calculateHours(schedulesRes.data);
    
    return {
      code: 200,
      data: {
        teacher: {
          _id: teacher_id,
          username: teacher.username,
          teacherName: teacher.teacherName || teacher.username
        },
        statistics: hoursStats,
        totalSchedules: schedulesRes.data.length
      }
    };
  } catch (error) {
    console.error('获取教师课时统计失败:', error);
    return {
      code: 500,
      message: '获取教师课时统计失败: ' + error.message
    };
  }
}

// 获取所有教师的课时统计
async function getAllTeachersHours(params) {
  try {
    const { startDate, endDate } = params;
    
    if (!startDate || !endDate) {
      return {
        code: 400,
        message: '缺少日期范围参数'
      };
    }

    // 查询所有教师
    const usersRes = await db.collection('uni-id-users')
      .where({
        role: dbCmd.elemMatch(dbCmd.eq('教师'))
      })
      .get();
    
    const teachers = usersRes.data;
    
    if (teachers.length === 0) {
      return {
        code: 200,
        data: []
      };
    }
    
    console.log('查询到的教师数量:', teachers.length);
    
    // 为每个教师统计课时（使用和单个教师查询相同的方式）
    const allStats = [];
    
    for (const teacher of teachers) {
      try {
        // 查询该教师在指定时间范围内的课程安排（和单个教师查询一样的方式）
        const schedulesRes = await db.collection('schedules')
          .where({
            $or: [
              { username: teacher.username },
              { uid: teacher._id }
            ],
            course_date: dbCmd.gte(new Date(startDate)).and(dbCmd.lte(new Date(endDate)))
          })
          .get();
        
        // 统计课时
        const hoursStats = calculateHours(schedulesRes.data);
        
        allStats.push({
          _id: teacher._id,
          username: teacher.username,
          teacherName: teacher.teacherName || teacher.username || teacher.nickname,
          statistics: hoursStats,
          scheduleCount: schedulesRes.data.length
        });
        
        // 添加调试信息
        if (schedulesRes.data.length > 0) {
          console.log('教师有课程安排:', {
            teacherName: teacher.teacherName || teacher.username,
            scheduleCount: schedulesRes.data.length,
            hoursStats: hoursStats
          });
        }
      } catch (teacherError) {
        console.error('查询教师课时失败:', teacher._id, teacherError);
        // 即使单个教师查询失败，也继续处理其他教师
        allStats.push({
          _id: teacher._id,
          username: teacher.username,
          teacherName: teacher.teacherName || teacher.username || teacher.nickname,
          statistics: { '一对一': 0, '班课': 0, '脱产生': 0, '总计': 0 },
          scheduleCount: 0,
          error: '查询失败'
        });
      }
    }
    
    // 按班课时间从高到低排序
    allStats.sort((a, b) => {
      const classHoursA = a.statistics['班课'] || 0;
      const classHoursB = b.statistics['班课'] || 0;
      
      // 如果班课时间相同，则按教师姓名排序
      if (classHoursA === classHoursB) {
        const nameA = a.teacherName || a.username || '';
        const nameB = b.teacherName || b.username || '';
        return nameA.localeCompare(nameB);
      }
      
      // 班课时间从高到低排序
      return classHoursB - classHoursA;
    });
    
    return {
      code: 200,
      data: allStats,
      totalTeachers: teachers.length,
      activeTeachers: allStats.filter(t => t.statistics['总计'] > 0).length
    };
  } catch (error) {
    console.error('获取所有教师课时统计失败:', error);
    return {
      code: 500,
      message: '获取所有教师课时统计失败: ' + error.message
    };
  }
}

// 计算课时统计
function calculateHours(schedules) {
  const stats = {
    '一对一': 0,
    '班课': 0,
    '脱产生': 0
  };

  if (!Array.isArray(schedules)) {
    return stats;
  }

  schedules.forEach(day => {
    // 检查每天的8节课
    for (let i = 1; i <= 8; i++) {
      const courseName = day[`course_slot_${i}`];
      const courseType = day[`course_slot_${i}_type`];
      
      // 只有当课程名存在且不为空，且课程类型存在且不为"无"时才计算课时
      if (courseName && typeof courseName === 'string' && courseName.trim() !== '' && 
          courseType && typeof courseType === 'string' && courseType.trim() !== '' && courseType !== '无') {
        // 每节课固定2小时
        const courseDuration = 2;
        
        // 根据课程类型累加课时
        if (stats.hasOwnProperty(courseType)) {
          stats[courseType] += courseDuration;
        } else {
          // 如果是其他类型的课程，归类到其他
          stats['其他'] = (stats['其他'] || 0) + courseDuration;
        }
      }
    }
  });
  
  return stats;
}