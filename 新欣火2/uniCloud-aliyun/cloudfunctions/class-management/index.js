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
      headTeacherId = teachers[0].teacherId || '';
    }
    
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
        console.log('所有用户数据示例:', result.data.slice(0, 3));
      }
    } catch (error) {
      console.error('查询用户表失败:', error);
      throw error;
    }
    
    // 处理数据格式，过滤出教师用户（排除超级管理员）
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
        
        // 检查是否为教师用户
        const isTeacher = teacher.role === 'teacher' || 
                         teacher.permission === 'teacher' ||
                         teacher.permission === '教师' ||
                         (teacher.teacherName && teacher.teacherName.trim() !== '') ||
                         (teacher.username && teacher.username.includes('teacher'));
        
        console.log(`用户 ${teacher.username} 是否为教师:`, isTeacher, {
          role: teacher.role,
          permission: teacher.permission,
          teacherName: teacher.teacherName
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
    
    // 更新班级的班主任信息
    const result = await db.collection('classes').doc(classId).update({
      headTeacher: newTeacher.teacherName,
      headTeacherId: newTeacher._id,
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
        newTeacher: newTeacher
      }
    };
  } catch (error) {
    console.error('替换班主任失败:', error);
    throw new Error('替换班主任失败: ' + error.message);
  }
}
