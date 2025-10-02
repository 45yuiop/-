'use strict';

const db = uniCloud.database();
const courseChangeCollection = db.collection('course_change_requests');
const schedulesCollection = db.collection('schedules');

exports.main = async (event, context) => {
  const { action, ...data } = event;
  
  switch (action) {
    case 'submit':
      return await submitApplication(data);
    case 'list':
      return await getApplicationList(data);
    case 'approve':
      return await approveApplication(data);
    default:
      return {
        success: false,
        message: '无效的操作'
      };
  }
};

// 提交调课申请
async function submitApplication(data) {
  try {
    const {
      courseId,
      originalDate,
      originalTime,
      reason,
      newDate,
      newTime,
      teacherId,
      teacherName
    } = data;

    // 校验时允许originalTime为空字符串
    if (!courseId || !originalDate || reason === undefined || !newDate || !newTime || !teacherId) {
      return {
        success: false,
        message: '请填写完整信息'
      };
    }

    // 验证新日期不能早于今天
    const today = new Date().toISOString().split('T')[0];
    if (newDate < today) {
      return {
        success: false,
        message: '新上课日期不能早于今天'
      };
    }

    // 验证新日期必须大于今天+5天
    const now = new Date();
    const minDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 6);
    if (new Date(newDate) < minDate) {
      return {
        success: false,
        message: '只能调五天之后的课程'
      };
    }

    // 获取课程信息
    const courseInfo = await schedulesCollection.doc(courseId).get();
    if (!courseInfo.data || courseInfo.data.length === 0) {
      return {
        success: false,
        message: '课程信息不存在'
      };
    }

    const course = courseInfo.data[0];

    // 兜底处理originalTime
    const finalOriginalTime = originalTime || 
      (course.start_time && course.end_time && course.start_time !== course.end_time
        ? `${course.start_time}-${course.end_time}`
        : course.start_time || course.time || '');

    // === 新增：根据 originalTime 提取 slot 课程信息 ===
    const slotMap = {
      '8:00-10:00': 1,
      '10:10-12:10': 2,
      '14:00-16:00': 3,
      '16:10-18:10': 4
    };
    let slot = slotMap[finalOriginalTime];
    if (!slot) slot = 1; // 兜底
    const slotCourseName = course[`course_slot_${slot}`] || '';
    const slotClassName = course[`course_slot_${slot}_class`] || '';
    const slotLocation = course[`course_slot_${slot}_location`] || '';
    // === 新增 END ===

    // 检查是否已有待审批的申请
    const existingApplication = await courseChangeCollection.where({
      courseId: courseId,
      teacherId: teacherId,
      status: 'pending'
    }).get();

    if (existingApplication.data && existingApplication.data.length > 0) {
      return {
        success: false,
        message: '该课程已有待审批的调课申请'
      };
    }

    // 创建调课申请记录
    const applicationData = {
      courseId: courseId,
      teacherId: teacherId,
      teacherName: teacherName,
      courseName: slotCourseName,
      className: slotClassName,
      location: slotLocation,
      originalDate: originalDate,
      originalTime: finalOriginalTime,
      newDate: newDate,
      newTime: newTime,
      reason: reason,
      status: 'pending',
      createTime: new Date(),
      approvalTime: null,
      approvalRemark: null
    };

    const result = await courseChangeCollection.add(applicationData);

    // 新增：调课申请后，给所有管理员写入一条调课待审批消息
    const adminUsers = await db.collection('uni-id-users').where(
      dbCmd.or([
        { role: dbCmd.elemMatch(dbCmd.eq('管理员')) },
        { permission: '管理员' }
      ])
    ).get();
    if (adminUsers.data && adminUsers.data.length > 0) {
      for (const admin of adminUsers.data) {
        await db.collection('messages').add({
          userId: admin._id,
          title: '调课待审批',
          content: `教师${teacherName}申请调课：${slotCourseName}，原时间：${originalDate} ${finalOriginalTime}，新时间：${newDate} ${newTime}，原因：${reason}`,
          createTime: new Date(),
          read: false
        });
      }
    }

    return {
      success: true,
      message: '申请提交成功',
      data: result
    };

  } catch (error) {
    console.error('提交调课申请失败:', error);
    return {
      success: false,
      message: '提交失败，请重试'
    };
  }
}

// 获取申请列表
async function getApplicationList(data) {
  try {
    const { teacherId } = data;
    
    let query = courseChangeCollection.orderBy('createTime', 'desc');
    
    // 如果是教师查询，只显示自己的申请
    if (teacherId) {
      query = query.where({
        teacherId: teacherId
      });
    }
    
    const result = await query.get();
    
    return {
      success: true,
      data: result.data || []
    };

  } catch (error) {
    console.error('获取申请列表失败:', error);
    return {
      success: false,
      message: '获取列表失败'
    };
  }
}

// 审批申请
async function approveApplication(data) {
  try {
    const { applicationId, status, approvalRemark, approverName } = data;

    if (!applicationId || !status) {
      return {
        success: false,
        message: '参数错误'
      };
    }
    // 拒绝时必须填写理由
    if (status === 'rejected' && (!data.approvalRemark || !data.approvalRemark.trim())) {
      return {
        success: false,
        message: '拒绝调课必须填写理由'
      };
    }

    // 获取申请信息
    const applicationInfo = await courseChangeCollection.doc(applicationId).get();
    if (!applicationInfo.data || applicationInfo.data.length === 0) {
      return {
        success: false,
        message: '申请不存在'
      };
    }

    const application = applicationInfo.data[0];

    // 检查申请状态
    if (application.status !== 'pending') {
      return {
        success: false,
        message: '该申请已被处理'
      };
    }

    // 更新申请状态
    const updateData = {
      status: status,
      approvalTime: new Date(),
      approvalRemark: approvalRemark || null,
      approverName: approverName || null
    };

    await courseChangeCollection.doc(applicationId).update(updateData);

    // 如果审批通过，执行 slot 迁移
    if (status === 'approved') {
      try {
        // 获取原课程信息
        const originalCourseInfo = await schedulesCollection.doc(application.courseId).get();
        if (!originalCourseInfo.data || originalCourseInfo.data.length === 0) {
          return {
            success: false,
            message: '原课程信息不存在'
          };
        }
        const originalCourse = originalCourseInfo.data[0];

        // 查 teacherId 对应 username
        let username = '';
        try {
          const userRes = await db.collection('uni-id-users').doc(application.teacherId).field({ username: 1 }).get();
          if (userRes.data && userRes.data.length > 0) {
            username = userRes.data[0].username;
          }
        } catch (e) {
          console.error('查找教师 username 失败', e);
        }
        if (!username) {
          username = application.teacherName || '';
        }

        // 时间到 slot 的映射（只用前四节课）
        const slotMap = {
          '8:00-10:00': 1,
          '10:10-12:10': 2,
          '14:00-16:00': 3,
          '16:10-18:10': 4
        };
        // 修正：严格校验 newTime 格式
        if (!slotMap.hasOwnProperty(application.newTime)) {
          console.error('newTime 映射 slot 失败', application.newTime, slotMap);
          return {
            success: false,
            message: `新上课时间段(${application.newTime})不合法，请选择标准时间段`
          };
        }
        if (!slotMap.hasOwnProperty(application.originalTime)) {
          console.error('originalTime 映射 slot 失败', application.originalTime, slotMap);
          return {
            success: false,
            message: `原上课时间段(${application.originalTime})不合法，请联系管理员`
          };
        }
        let originalSlot = slotMap[application.originalTime];
        let newSlot = slotMap[application.newTime];

        // 日志：迁移关键信息
        console.log('调课迁移主键信息:', {
          uid: application.teacherId,
          username,
          course_date: application.newDate,
          course_date_type: typeof application.newDate,
          newSlot,
          originalSlot,
          originalTime: application.originalTime,
          newTime: application.newTime
        });

        // 1. 清空原日期的原 slot（只清空 slot 字段，不删除 schedule）
        const originalSlotKey = `course_slot_${originalSlot}`;
        const originalTypeKey = `course_slot_${originalSlot}_type`;
        const originalClassKey = `course_slot_${originalSlot}_class`;
        const originalLocationKey = `course_slot_${originalSlot}_location`;
        await schedulesCollection.doc(application.courseId).update({
          [originalSlotKey]: '',
          [originalTypeKey]: '无',
          [originalClassKey]: '',
          [originalLocationKey]: ''
        });

        // 2. 查找或创建新日期的 schedule 记录（主键严格为 uid+username+course_date）
        const newDate = new Date(application.newDate);
        console.log('查找/新建 schedule 主键:', { uid: application.teacherId, username, course_date: newDate, course_date_type: typeof newDate });
        let scheduleRes = await schedulesCollection.where({
          uid: application.teacherId,
          username: username,
          course_date: newDate
        }).get();
        let scheduleId;
        if (scheduleRes.data && scheduleRes.data.length > 0) {
          scheduleId = scheduleRes.data[0]._id;
          console.log('找到新 schedule:', scheduleRes.data[0]);
        } else {
          // 初始化1~4节课
          const newSchedule = { uid: application.teacherId, username, course_date: newDate };
          for (let i = 1; i <= 4; i++) {
            newSchedule[`course_slot_${i}`] = '';
            newSchedule[`course_slot_${i}_type`] = '无';
            newSchedule[`course_slot_${i}_class`] = '';
            newSchedule[`course_slot_${i}_location`] = '';
          }
          const addRes = await schedulesCollection.add(newSchedule);
          scheduleId = addRes.id;
          console.log('新建 schedule:', newSchedule);
        }

        // 3. 写入新 slot，前先校验字段
        if (!application.courseName) {
          console.error('courseName 为空，无法写入新 slot', application);
          return {
            success: false,
            message: '课程名称为空，无法写入新时间段，请联系管理员'
          };
        }
        if (!application.className) {
          console.warn('className 为空，写入新 slot 时 class 字段将为空', application);
        }
        if (!application.location) {
          console.warn('location 为空，写入新 slot 时 location 字段将为空', application);
        }
        const newSlotKey = `course_slot_${newSlot}`;
        const newTypeKey = `course_slot_${newSlot}_type`;
        const newClassKey = `course_slot_${newSlot}_class`;
        const newLocationKey = `course_slot_${newSlot}_location`;
        // 优先用原 slot 的类型
        const originalSlotType = originalCourse[`course_slot_${originalSlot}_type`] || originalCourse.course_type || '无';
        const updateRes = await schedulesCollection.doc(scheduleId).update({
          [newSlotKey]: application.courseName,
          [newTypeKey]: originalSlotType,
          [newClassKey]: application.className || '',
          [newLocationKey]: application.location || ''
        });
        console.log('写入新 slot update 结果:', updateRes);

        // 写入后立即查询并打印日志
        const afterUpdate = await schedulesCollection.doc(scheduleId).get();
        console.log('写入后新 schedule:', afterUpdate.data[0]);

        // 移除：不再写入调课成功通知到messages表
        // 通知功能已移除，仅保留课程安排更新

        return {
          success: true,
          message: '审批通过，课程已成功迁移到新时间'
        };
      } catch (updateError) {
        console.error('Slot 迁移失败:', updateError);
        return {
          success: false,
          message: '审批通过，但课程迁移失败'
        };
      }
    }
    // 如果审批被拒绝，移除消息通知
    if (status === 'rejected') {
      // 移除：不再写入调课被拒绝通知到messages表
      // 通知功能已移除
    }

    return {
      success: true,
      message: status === 'approved' ? '审批通过' : '申请已拒绝'
    };

  } catch (error) {
    console.error('审批失败:', error);
    return {
      success: false,
      message: '审批失败，请重试'
    };
  }
} 