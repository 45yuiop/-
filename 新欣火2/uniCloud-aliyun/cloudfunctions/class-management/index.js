'use strict';

const db = uniCloud.database();

exports.main = async (event, context) => {
  const { action } = event;
  
  try {
  switch (action) {
      case 'getClasses':
        return await getClasses(event);
      case 'createClass':
        return await createClass(event);
      case 'updateClass':
        return await updateClass(event);
      case 'deleteClass':
        return await deleteClass(event);
    case 'addStudentToClass':
        return await addStudentToClass(event);
    case 'removeStudentFromClass':
        return await removeStudentFromClass(event);
      case 'getClassStudents':
        return await getClassStudents(event);
      case 'getTeacherClasses':
        return await getTeacherClasses(event);
      case 'getTeacherList':
        return await getTeacherList(event);
      case 'replaceTeacher':
        return await replaceTeacher(event);
    case 'getMyClasses':
        return await getMyClasses(event);
      case 'getMyClassesWithScores':
        return await getMyClassesWithScores(event);
      case 'getHistoryClasses':
        return await getHistoryClasses(event);
    default:
      return {
        code: -1,
          message: '未知操作'
        };
    }
  } catch (error) {
    console.error('班级管理云函数错误:', error);
    return {
      code: -1,
      message: error.message || '操作失败'
      };
  }
};

// 获取班级列表 - 优化版本
async function getClasses(event) {
  try {
    const { page = 1, pageSize = 100, grade, keyword } = event;
    const skip = (page - 1) * pageSize;
    
    let whereCondition = {};
    
    // 年级筛选
    if (grade && grade !== '全部年级') {
      whereCondition.grade = grade;
    }
    
    // 关键词搜索
    if (keyword) {
      whereCondition.className = new RegExp(keyword, 'i');
    }
    
    console.log('查询班级条件:', whereCondition);
    
    const result = await db.collection('classes')
      .where(whereCondition)
      .orderBy('createTime', 'desc')
      .skip(skip)
      .limit(pageSize)
      .get();
    
    // 获取总数
    const countResult = await db.collection('classes')
      .where(whereCondition)
      .count();
    
    // 处理数据格式
    const processedData = result.data.map(item => {
      // 构建teachers数组，用于前端显示
      const teachers = [];
      if (item.headTeacher && item.headTeacher.trim()) {
        teachers.push({
          _id: item.headTeacherId || '',
          teacherName: item.headTeacher,
          username: item.headTeacherId || ''
        });
      }
      
      return {
        ...item,
        className: item.className,
        classCode: item.className,
        teacherName: item.headTeacher || '未设置',
        teacherId: item.headTeacherId || '',
        teachers: teachers, // 添加teachers数组
        studentCount: item.studentCount || (item.students ? item.students.length : 0),
        students: item.students || [],
        studentIds: item.studentIds || [],
        createTime: item.createTime ? new Date(item.createTime).toISOString() : new Date().toISOString(),
        createBy: 'system'
      };
    });
    
    console.log(`查询到 ${processedData.length} 个班级，总数: ${countResult.total}`);
    
    // 调试日志：显示第一个班级的teachers信息
    if (processedData.length > 0) {
      console.log('第一个班级的teachers信息:', processedData[0].teachers);
      console.log('第一个班级的headTeacher:', processedData[0].headTeacher);
    }
    
    return {
      code: 0,
      message: '获取班级列表成功',
      data: processedData,
      total: countResult.total
    };
  } catch (error) {
    console.error('获取班级列表失败:', error);
    throw new Error('获取班级列表失败: ' + error.message);
  }
}

// 创建班级 - 优化版本
async function createClass(event) {
  try {
    const { className, grade, subject, teacherName, teacherId, teachers } = event;
    
    if (!className || !grade) {
    return {
      code: -1,
        message: '班级名称和年级不能为空'
      };
    }
    
    console.log('创建班级:', { className, grade, subject, teacherName, teacherId });
    
    // 检查班级是否已存在
    const existingClass = await db.collection('classes').where({
      class_name: className,
      grade: grade
    }).get();
    
    if (existingClass.data.length > 0) {
    return {
      code: -1,
        message: '该班级已存在'
    };
  }
  
    // 处理教师信息
    let headTeacher = '';
    let headTeacherId = '';
    if (teachers && teachers.length > 0) {
      headTeacher = teachers[0].teacherName || '';
      headTeacherId = teachers[0]._id || teachers[0].teacherId || '';
      
      // 如果还是没有获取到 headTeacherId，尝试通过姓名查找
      if (!headTeacherId && headTeacher) {
        console.log('通过姓名查找教师ID:', headTeacher);
        try {
          const teacherResult = await db.collection('uni-id-users').where({
            teacherName: headTeacher.trim()
          }).get();
          
          if (teacherResult.data.length > 0) {
            headTeacherId = teacherResult.data[0]._id;
            console.log('找到教师ID:', headTeacherId);
          } else {
            console.log('未找到匹配的教师');
          }
        } catch (error) {
          console.error('查找教师ID失败:', error);
        }
      }
    }
    
    console.log('最终教师信息:', { headTeacher, headTeacherId });
    
    // 创建班级
    const result = await db.collection('classes').add({
      className: className,
      grade: grade,
      subject: subject || '',
      headTeacher: headTeacher,
      headTeacherId: headTeacherId,
      school: '默认学校', // 可以从用户信息中获取
      students: [],
      studentIds: [],
      studentCount: 0,
      status: 'active',
      createTime: new Date(),
      updateTime: new Date()
    });
    
    console.log('班级创建成功:', result.id);
    
    return {
      code: 0,
      message: '班级创建成功',
      data: {
        classId: result.id
      }
    };
  } catch (error) {
    console.error('创建班级失败:', error);
    throw new Error('创建班级失败: ' + error.message);
  }
}

// 更新班级 - 优化版本
async function updateClass(event) {
  try {
    const { classId, className, grade, subject, teacherName, teacherId } = event;
  
  if (!classId) {
    return {
      code: -1,
      message: '班级ID不能为空'
    };
  }
  
    console.log('更新班级:', { classId, className, grade, subject, teacherName, teacherId });
    
    const updateData = {
      update_time: new Date().toISOString()
    };
    
    if (className) updateData.class_name = className;
    if (grade) updateData.grade = grade;
    if (subject) updateData.subject = subject;
    if (teacherName !== undefined) updateData.teacherName = teacherName;
    if (teacherId !== undefined) updateData.teacherId = teacherId;
    
    const result = await db.collection('classes').doc(classId).update(updateData);
    
    console.log('班级更新成功');
    
    return {
      code: 0,
      message: '班级更新成功'
    };
  } catch (error) {
    console.error('更新班级失败:', error);
    throw new Error('更新班级失败: ' + error.message);
  }
}

// 删除班级 - 优化版本
async function deleteClass(event) {
  try {
    const { classId } = event;
  
  if (!classId) {
    return {
      code: -1,
      message: '班级ID不能为空'
    };
  }
  
    console.log('删除班级:', classId);
    
    // 获取班级信息
    const classResult = await db.collection('classes').where({
      _id: classId
    }).get();
    
    if (classResult.data.length === 0) {
    return {
      code: -1,
        message: '班级不存在'
      };
    }
    
    const classInfo = classResult.data[0];
    const studentIds = classInfo.studentIds || [];
    
    // 开始事务
    const transaction = await db.startTransaction();
    
    try {
      // 删除班级
      await transaction.collection('classes')
        .where({
          _id: classId
        })
        .remove();
      
      // 从相关学生中移除班级
      for (const studentId of studentIds) {
        await transaction.collection('students')
          .where({
            _id: studentId
          })
          .update({
            classes: db.command.pull({
              _id: classId
            }),
            classIds: db.command.pull(classId),
            updateTime: new Date().toISOString()
          });
      }
      
      await transaction.commit();
      
      console.log('班级删除成功');
    
    return {
      code: 0,
        message: '班级删除成功'
    };
  } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('删除班级失败:', error);
    throw new Error('删除班级失败: ' + error.message);
  }
}

// 添加学生到班级 - 优化版本
async function addStudentToClass(event) {
  try {
    const { classId, studentId } = event;
    
    if (!classId || !studentId) {
    return {
      code: -1,
        message: '班级ID和学生ID不能为空'
      };
    }
    
    console.log('添加学生到班级:', { classId, studentId });
    
    // 获取学生信息
    const studentResult = await db.collection('students').where({
      _id: studentId
    }).get();
    
    if (studentResult.data.length === 0) {
    return {
      code: -1,
        message: '学生不存在'
      };
    }
    
    const student = studentResult.data[0];
    
    // 获取班级信息
    const classResult = await db.collection('classes').where({
      _id: classId
    }).get();
    
    if (classResult.data.length === 0) {
    return {
      code: -1,
        message: '班级不存在'
      };
    }
    
    const classInfo = classResult.data[0];
    
    // 开始事务
    const transaction = await db.startTransaction();
    
    try {
      // 检查学生是否已在班级中
      if (student.classIds && student.classIds.includes(classId)) {
        await transaction.rollback();
    return {
      code: -1,
          message: '学生已在该班级中'
        };
      }
      
      // 添加学生到班级的students数组
      const newStudent = {
        _id: student._id,
        studentId: student.studentId || student.student_id,
        name: student.name || student.student_name,
        grade: student.grade
      };
      
      await transaction.collection('classes').doc(classId).update({
        students: db.command.push(newStudent),
        studentIds: db.command.push(studentId),
        studentCount: db.command.inc(1),
        updateTime: new Date()
      });
      
      // 添加班级到学生的classes数组
      const newClass = {
        _id: classInfo._id,
        className: classInfo.className || classInfo.class_name,
        subject: classInfo.subject,
        grade: classInfo.grade,
        headTeacher: classInfo.headTeacher || classInfo.teacherName || '',
        headTeacherId: classInfo.headTeacherId || classInfo.teacherId || ''
      };
      
      await transaction.collection('students').doc(studentId).update({
        classes: db.command.push(newClass),
        classIds: db.command.push(classId),
        updateTime: new Date()
      });
      
      await transaction.commit();
      
      console.log('学生添加到班级成功');
    
    return {
      code: 0,
        message: '学生添加到班级成功'
    };
  } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('添加学生到班级失败:', error);
    throw new Error('添加学生到班级失败: ' + error.message);
  }
}

// 从班级移除学生 - 优化版本
async function removeStudentFromClass(event) {
  try {
    const { classId, studentId } = event;
    
    if (!classId || !studentId) {
    return {
      code: -1,
        message: '班级ID和学生ID不能为空'
      };
    }
    
    console.log('从班级移除学生:', { classId, studentId });
    
    // 获取学生信息
    const studentResult = await db.collection('students').where({
      _id: studentId
    }).get();
    
    if (studentResult.data.length === 0) {
      return {
        code: -1,
        message: '学生不存在'
      };
    }
    
    const student = studentResult.data[0];
    
    // 开始事务
    const transaction = await db.startTransaction();
    
    try {
      // 从班级的students数组中移除学生
      await transaction.collection('classes').doc(classId).update({
        students: db.command.pull({
      _id: studentId
        }),
        studentIds: db.command.pull(studentId),
        studentCount: db.command.inc(-1),
        updateTime: new Date()
      });
      
      // 从学生的classes数组中移除班级
      await transaction.collection('students').doc(studentId).update({
        classes: db.command.pull({
          _id: classId
        }),
        classIds: db.command.pull(classId),
      updateTime: new Date()
    });
      
      await transaction.commit();
      
      console.log('学生从班级移除成功');
    
    return {
      code: 0,
        message: '学生从班级移除成功'
    };
  } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('从班级移除学生失败:', error);
    throw new Error('从班级移除学生失败: ' + error.message);
  }
}

// 获取班级学生列表 - 优化版本
async function getClassStudents(event) {
  try {
    const { classId } = event;
  
  if (!classId) {
    return {
      code: -1,
      message: '班级ID不能为空'
    };
  }
  
    console.log('获取班级学生列表:', classId);
    
    const result = await db.collection('classes').where({
      _id: classId
    }).get();
    
    if (result.data.length === 0) {
    return {
      code: -1,
        message: '班级不存在'
      };
    }
    
    const classInfo = result.data[0];
    const students = classInfo.students || [];
    
    console.log(`班级 ${classInfo.class_name} 有 ${students.length} 个学生`);
    
    return {
      code: 0,
      message: '获取班级学生列表成功',
      data: students
    };
  } catch (error) {
    console.error('获取班级学生列表失败:', error);
    throw new Error('获取班级学生列表失败: ' + error.message);
  }
}

// 获取教师管理的班级 - 优化版本
async function getTeacherClasses(event) {
  try {
    const { teacherId } = event;
    
    if (!teacherId) {
      return {
        code: -1,
        message: '教师ID不能为空'
      };
    }
    
    console.log('获取教师管理的班级:', teacherId);
    
    const result = await db.collection('classes').where({
      teacherId: teacherId
    }).get();
    
    const classes = result.data.map(item => ({
      ...item,
      className: item.class_name,
      classCode: item.class_name,
      teacherName: item.teacherName || '未设置',
      teacherId: item.teacherId || '',
      studentCount: item.studentCount || (item.students ? item.students.length : 0),
      students: item.students || [],
      studentIds: item.studentIds || [],
      createTime: new Date(item.create_time).toISOString(),
      createBy: 'system'
    }));
    
    console.log(`教师 ${teacherId} 管理 ${classes.length} 个班级`);
    
    return {
      code: 0,
      message: '获取教师班级列表成功',
      data: classes
    };
  } catch (error) {
    console.error('获取教师班级列表失败:', error);
    throw new Error('获取教师班级列表失败: ' + error.message);
  }
}

// 获取教师列表
async function getTeacherList(event) {
  try {
    console.log('获取教师列表');
    
    // 从用户表中获取所有教师用户
    // 尝试多种可能的角色字段名称
    let result;
    try {
      // 首先尝试 role 字段
      result = await db.collection('uni-id-users')
        .where({
          role: 'teacher'
        })
        .field({
          _id: true,
          username: true,
          nickname: true,
          teacherName: true,
          mobile: true,
          email: true,
          role: true,
          permission: true
        })
        .get();
      
      console.log('按role字段查询结果:', result.data.length);
      
      // 如果没有结果，尝试 permission 字段
      if (result.data.length === 0) {
        result = await db.collection('uni-id-users')
          .where({
            permission: 'teacher'
          })
          .field({
            _id: true,
            username: true,
            nickname: true,
            teacherName: true,
            mobile: true,
            email: true,
            role: true,
            permission: true
          })
          .get();
        
        console.log('按permission字段查询结果:', result.data.length);
      }
      
      // 如果还是没有结果，获取所有用户并过滤
      if (result.data.length === 0) {
        result = await db.collection('uni-id-users')
          .field({
            _id: true,
            username: true,
            nickname: true,
            teacherName: true,
            mobile: true,
            email: true,
            role: true,
            permission: true
          })
          .get();
        
        console.log('获取所有用户数量:', result.data.length);
        console.log('所有用户数据示例:', result.data.slice(0, 5).map(user => ({
          _id: user._id,
          username: user.username,
          teacherName: user.teacherName,
          nickname: user.nickname,
          mobile: user.mobile,
          role: user.role,
          permission: user.permission
        })));
      }
    } catch (error) {
      console.error('查询用户表失败:', error);
      throw error;
    }
    
5    // 处理数据格式，过滤出教师用户（排除超级管理员和教务）
    console.log('🔍 开始过滤教师，原始用户数量:', result.data.length);
    const teachers = result.data
      .filter(teacher => {
        // 排除超级管理员
        const isSuperAdmin = teacher.role === 'superadmin' || 
                            teacher.permission === 'superadmin' ||
                            teacher.permission === '超级管理员' ||
                            teacher.username === 'superadmin' ||
                            (teacher.teacherName && teacher.teacherName.includes('超级管理员'));
        
        if (isSuperAdmin) {
          console.log(`排除超级管理员: ${teacher.username}`);
          return false;
        }
        
        // 排除教务账号 - 基于角色和权限
        const isAcademic = teacher.role === 'academic' || 
                          teacher.permission === 'academic' ||
                          teacher.permission === '教务' ||
                          teacher.permission === '教务普通用户' ||
                          teacher.permission === '教务管理员' ||
                          teacher.role === 'admin' || // 添加管理员角色
                          teacher.permission === 'admin' || // 添加管理员权限
                          (teacher.teacherName && teacher.teacherName.includes('教务')) ||
                          (teacher.nickname && teacher.nickname.includes('教务')) ||
                          (teacher.username && teacher.username.includes('academic')) ||
                          (teacher.username && teacher.username.includes('教务')) ||
                          // 特殊处理：手机号用户名且教师姓名过短的账号（可能是教务账号）
                          (teacher.username === '18186191270') || // 特定的教务手机号
                          (teacher.username && /^1\d{10}$/.test(teacher.username) && 
                           teacher.teacherName && teacher.teacherName.length === 1); // 手机号用户名且姓名只有1个字
        
        if (isAcademic) {
          console.log(`排除教务账号: ${teacher.username || teacher.mobile} (${teacher.teacherName || teacher.nickname}) - 角色: ${teacher.role}, 权限: ${teacher.permission}`);
          return false;
        }
        
        // 检查是否为教师用户
        const isTeacher = teacher.role === 'teacher' || 
                         teacher.permission === 'teacher' ||
                         teacher.permission === '教师' ||
                         (teacher.teacherName && teacher.teacherName.trim() !== '') ||
                         (teacher.username && teacher.username.includes('teacher'));
        
        // 特别关注手机号为 18186191270 的账号
        if (teacher.mobile === '18186191270' || teacher.username === '18186191270') {
          console.log(`🔍 重点关注账号 ${teacher.username || teacher.mobile}:`, {
            _id: teacher._id,
            username: teacher.username,
            teacherName: teacher.teacherName,
            nickname: teacher.nickname,
            mobile: teacher.mobile,
            role: teacher.role,
            permission: teacher.permission,
            isTeacher: isTeacher,
            isSuperAdmin: teacher.role === 'superadmin' || teacher.permission === 'superadmin',
            isAcademic: isAcademic,
            '应该被过滤': isAcademic ? '是' : '否'
          });
        }
        
        console.log(`用户 ${teacher.username || teacher.mobile} 详细信息:`, {
          role: teacher.role,
          permission: teacher.permission,
          isTeacher: isTeacher,
          isAcademic: isAcademic
        });
        
        return isTeacher;
      })
      .map(teacher => ({
        _id: teacher._id,
        teacherName: teacher.teacherName || teacher.nickname || teacher.username,
        username: teacher.username,
        mobile: teacher.mobile || '',
        email: teacher.email || ''
      }));
    
    console.log(`获取到 ${teachers.length} 个教师`);
    console.log('🎯 最终返回的教师列表:', teachers.map(t => ({
      _id: t._id,
      teacherName: t.teacherName,
      username: t.username,
      mobile: t.mobile || '无'
    })));
    
    return {
      code: 0,
      message: '获取教师列表成功',
      data: teachers
    };
  } catch (error) {
    console.error('获取教师列表失败:', error);
    throw new Error('获取教师列表失败: ' + error.message);
  }
}

// 替换班级班主任
async function replaceTeacher(event) {
  try {
    const { classId, newTeacher } = event;
    
    if (!classId || !newTeacher) {
    return {
      code: -1,
        message: '班级ID和新老师信息不能为空'
      };
    }
    
    console.log('替换班级班主任:', { classId, newTeacher });
    
    // 确保获取正确的教师ID
    let headTeacherId = newTeacher._id || newTeacher.teacherId || '';
    const headTeacher = newTeacher.teacherName || '';
    
    // 如果没有获取到 headTeacherId，尝试通过姓名查找
    if (!headTeacherId && headTeacher) {
      console.log('通过姓名查找教师ID:', headTeacher);
      try {
        const teacherResult = await db.collection('uni-id-users').where({
          teacherName: headTeacher.trim()
    }).get();
    
        if (teacherResult.data.length > 0) {
          headTeacherId = teacherResult.data[0]._id;
          console.log('找到教师ID:', headTeacherId);
        } else {
          console.log('未找到匹配的教师');
        }
      } catch (error) {
        console.error('查找教师ID失败:', error);
      }
    }
    
    console.log('最终替换的教师信息:', { headTeacher, headTeacherId });
    
    // 更新班级的班主任信息
    const result = await db.collection('classes').doc(classId).update({
      headTeacher: headTeacher,
      headTeacherId: headTeacherId,
      updateTime: new Date()
    });
    
    if (result.updated === 0) {
      return {
        code: -1,
        message: '班级不存在或更新失败'
      };
    }
    
    console.log('班主任替换成功:', classId);
    
    return {
      code: 0,
      message: '班主任替换成功',
      data: {
        classId: classId,
        newTeacher: {
          ...newTeacher,
          _id: headTeacherId
        }
      }
    };
  } catch (error) {
    console.error('替换班主任失败:', error);
    throw new Error('替换班主任失败: ' + error.message);
  }
}

// 获取我的班级（班主任查看自己负责的班级）
async function getMyClasses(event) {
  try {
    const { teacherId } = event;
    
    if (!teacherId) {
    return {
      code: -1,
        message: '教师ID不能为空'
      };
    }
    
    console.log('获取我的班级，教师ID:', teacherId);
    
    // 查找该教师作为班主任的所有班级
    const result = await db.collection('classes').where({
      headTeacherId: teacherId,
      status: 'active'
    }).get();
    
    console.log(`找到 ${result.data.length} 个班级`);
    
    // 处理班级数据，包含学生信息
    const myClasses = result.data.map(classInfo => {
      const classStudents = (classInfo.students || []).map(student => {
    return {
          _id: student._id,
          studentId: student.studentId,
          name: student.name,
          grade: student.grade,
          // 可以在这里添加学生的成绩信息等
          latestScore: null // 暂时为空，后续可以从成绩表中获取
        };
      });
      
    return {
        _id: classInfo._id,
        className: classInfo.className,
        grade: classInfo.grade,
        subject: classInfo.subject || '',
        headTeacher: classInfo.headTeacher,
        headTeacherId: classInfo.headTeacherId,
        school: classInfo.school || '',
        studentCount: classInfo.studentCount || 0,
        classStudents: classStudents, // 班级学生列表
        createTime: classInfo.createTime ? new Date(classInfo.createTime).toISOString() : new Date().toISOString(),
        updateTime: classInfo.updateTime ? new Date(classInfo.updateTime).toISOString() : new Date().toISOString()
      };
    });
    
    console.log('处理后的班级数据:', myClasses.length > 0 ? {
      className: myClasses[0].className,
      studentCount: myClasses[0].studentCount,
      studentsLength: myClasses[0].classStudents.length
    } : '无班级');
    
      return {
        code: 0,
      message: '获取我的班级成功',
      data: myClasses
    };
  } catch (error) {
    console.error('获取我的班级失败:', error);
    throw new Error('获取我的班级失败: ' + error.message);
  }
}

// 获取我的班级（包含成绩信息）
async function getMyClassesWithScores(event) {
  try {
    const { teacherId, includeScores } = event;
    
    if (!teacherId) {
      return {
        code: -1,
        message: '教师ID不能为空'
      };
    }
    
    console.log('获取我的班级（含成绩），教师ID:', teacherId);
    
    // 查找该教师作为班主任的所有班级
    const result = await db.collection('classes').where({
      headTeacherId: teacherId,
      status: 'active'
    }).get();
    
    console.log(`找到 ${result.data.length} 个班级`);
    
    // 处理班级数据，包含学生信息和成绩
    const myClasses = await Promise.all(result.data.map(async classInfo => {
      const classStudents = await Promise.all((classInfo.students || []).map(async student => {
        let latestScore = null;
        
        // 如果需要包含成绩，查询学生的最新成绩
        if (includeScores && student._id) {
          try {
            const scoreResult = await db.collection('student_scores')
              .where({
                student_id: student.studentId || student._id
              })
              .orderBy('exam_date', 'desc')
              .limit(1)
              .get();
            
            if (scoreResult.data.length > 0) {
              const score = scoreResult.data[0];
              
              // 计算成绩等级
              let scoreLevel = 'fail';
              if (score.score >= 90) scoreLevel = 'excellent';
              else if (score.score >= 80) scoreLevel = 'good';
              else if (score.score >= 70) scoreLevel = 'average';
              else if (score.score >= 60) scoreLevel = 'pass';
              
              // 格式化日期
              let formattedDate = '';
              if (score.exam_date) {
                const date = new Date(score.exam_date);
                formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;
              }
              
              latestScore = {
                subject: score.subject,
                score: score.score,
                examDate: score.exam_date,
                examType: score.exam_type,
                scoreLevel: scoreLevel,
                formattedDate: formattedDate
              };
            }
          } catch (error) {
            console.log(`获取学生 ${student.name} 成绩失败:`, error);
          }
        }
          
          return {
            _id: student._id,
            studentId: student.studentId,
            name: student.name,
            grade: student.grade,
          latestScore: latestScore
        };
      }));
      
      return {
        _id: classInfo._id,
        className: classInfo.className,
        grade: classInfo.grade,
        subject: classInfo.subject || '',
        headTeacher: classInfo.headTeacher,
        headTeacherId: classInfo.headTeacherId,
        school: classInfo.school || '',
        studentCount: classInfo.studentCount || 0,
        classStudents: classStudents, // 班级学生列表
        createTime: classInfo.createTime ? new Date(classInfo.createTime).toISOString() : new Date().toISOString(),
        updateTime: classInfo.updateTime ? new Date(classInfo.updateTime).toISOString() : new Date().toISOString()
      };
    }));
    
    console.log('处理后的班级数据（含成绩）:', myClasses.length > 0 ? {
      className: myClasses[0].className,
      studentCount: myClasses[0].studentCount,
      studentsLength: myClasses[0].classStudents.length,
      hasScores: myClasses[0].classStudents.some(s => s.latestScore)
    } : '无班级');
    
    return {
      code: 0,
      message: '获取我的班级成功',
      data: myClasses
    };
  } catch (error) {
    console.error('获取我的班级（含成绩）失败:', error);
    throw new Error('获取我的班级（含成绩）失败: ' + error.message);
  }
}

// 获取历史班级
async function getHistoryClasses(event) {
  try {
    const { teacherId } = event;
    
    if (!teacherId) {
    return {
      code: -1,
        message: '教师ID不能为空'
      };
    }
    
    console.log('获取历史班级，教师ID:', teacherId);
    
    // 查找该教师作为班主任的所有班级（包括非活跃状态）
    const result = await db.collection('classes').where({
      headTeacherId: teacherId
    }).get();
    
    console.log(`找到 ${result.data.length} 个历史班级`);
    
    // 处理班级数据
    const historyClasses = result.data.map(classInfo => {
      const classStudents = (classInfo.students || []).map(student => {
          return {
            _id: student._id,
            studentId: student.studentId,
            name: student.name,
            grade: student.grade,
          latestScore: null // 历史班级暂不加载成绩，提高性能
        };
      });
      
      return {
        _id: classInfo._id,
        className: classInfo.className,
        grade: classInfo.grade,
        subject: classInfo.subject || '',
        headTeacher: classInfo.headTeacher,
        headTeacherId: classInfo.headTeacherId,
        school: classInfo.school || '',
        studentCount: classInfo.studentCount || 0,
        classStudents: classStudents,
        status: classInfo.status || 'active',
        createTime: classInfo.createTime ? new Date(classInfo.createTime).toISOString() : new Date().toISOString(),
        updateTime: classInfo.updateTime ? new Date(classInfo.updateTime).toISOString() : new Date().toISOString()
      };
    });
    
    console.log('处理后的历史班级数据:', historyClasses.length);
    
    return {
      code: 0,
      message: '获取历史班级成功',
      data: historyClasses
    };
  } catch (error) {
    console.error('获取历史班级失败:', error);
    throw new Error('获取历史班级失败: ' + error.message);
  }
}

