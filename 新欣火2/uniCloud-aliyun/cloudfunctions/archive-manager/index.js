'use strict';

const db = uniCloud.database();

exports.main = async (event, context) => {
  const { action } = event;
  
  try {
    switch (action) {
      case 'getStudents':
        return await getStudents(event);
      case 'getClasses':
        return await getClasses(event);
      case 'getStudentById':
        return await getStudentById(event);
      case 'getStudentDetail':
        return await getStudentById(event);
      case 'getClassById':
        return await getClassById(event);
      case 'getClassDetail':
        return await getClassById(event);
      case 'getStudentAcademicRecords':
        return await getStudentAcademicRecords(event);
      case 'getTeachers':
        return await getTeachers(event);
      case 'searchArchive':
        return await searchArchive(event);
      case 'getAllStudents':
        return await getAllStudents(event);
      case 'getAllClasses':
        return await getAllClasses(event);
      case 'deleteStudent':
        return await deleteStudent(event);
      case 'deleteClass':
        return await deleteClass(event);
      case 'batchDeleteStudents':
        return await batchDeleteStudents(event);
      case 'batchDeleteClasses':
        return await batchDeleteClasses(event);
      default:
        return {
          code: -1,
          message: '未知操作'
        };
    }
  } catch (error) {
    console.error('档案管理云函数错误:', error);
    return {
      code: -1,
      message: error.message || '操作失败'
    };
  }
};

// 获取所有学生数据（用于本地缓存）- 优化版本
async function getAllStudents(event) {
  try {
    console.log('开始获取所有学生数据...');
    
    const result = await db.collection('students')
      .orderBy('createTime', 'desc')
      .get();
    
    // 如果按createTime排序失败，尝试按create_time排序
    if (result.data.length === 0) {
      const result2 = await db.collection('students')
        .orderBy('create_time', 'desc')
        .get();
      
      if (result2.data.length > 0) {
        result.data = result2.data;
      }
    }
    
    console.log(`获取到 ${result.data.length} 个学生`);
    
    // 处理数据格式，统一字段名
    const processedData = result.data.map(item => ({
      ...item,
      name: item.name || item.student_name,
      studentId: item.studentId || item.student_id,
      createTime: item.createTime || new Date(item.create_time).toISOString(),
      createBy: item.createBy || 'system',
      // 确保classes和classIds字段存在
      classes: item.classes || [],
      classIds: item.classIds || []
    }));
    
    console.log('学生数据处理完成');
    
    return {
      code: 0,
      message: '获取所有学生数据成功',
      data: processedData,
      total: processedData.length
    };
  } catch (error) {
    console.error('获取所有学生数据失败:', error);
    throw new Error('获取所有学生数据失败: ' + error.message);
  }
}

// 获取所有班级数据（用于本地缓存）- 优化版本
async function getAllClasses(event) {
  try {
    console.log('开始获取所有班级数据...');
    
    const result = await db.collection('classes')
      .orderBy('create_time', 'desc')
      .get();
    
    console.log(`获取到 ${result.data.length} 个班级`);
    
    // 处理数据格式，添加兼容字段
    const processedData = result.data.map(item => {
      return {
        ...item,
        className: item.class_name,
        classCode: item.class_name,
        // 使用班级表中的教师信息
        teacherName: item.teacherName || '未设置',
        teacherId: item.teacherId || '',
        // 使用班级表中的学生信息
        studentCount: item.studentCount || (item.students ? item.students.length : 0),
        students: item.students || [],
        studentIds: item.studentIds || [],
        createTime: new Date(item.create_time).toISOString(),
        createBy: 'system'
      };
    });
    
    console.log('班级数据处理完成');
    
    return {
      code: 0,
      message: '获取所有班级数据成功',
      data: processedData,
      total: processedData.length
    };
  } catch (error) {
    console.error('获取所有班级数据失败:', error);
    throw new Error('获取所有班级数据失败: ' + error.message);
  }
}

// 获取学生档案列表 - 优化版本
async function getStudents(event) {
  try {
    const { page = 1, pageSize = 100, grade, keyword } = event;
    const skip = (page - 1) * pageSize;
    
    let whereCondition = {};
    
    // 年级筛选
    if (grade && grade !== '全部年级') {
      whereCondition.grade = grade;
    }
    
    // 关键词搜索 - 支持多种字段名
    if (keyword) {
      whereCondition.$or = [
        { name: new RegExp(keyword, 'i') },
        { student_name: new RegExp(keyword, 'i') },
        { studentId: new RegExp(keyword, 'i') },
        { student_id: new RegExp(keyword, 'i') }
      ];
    }
    
    console.log('查询学生条件:', whereCondition);
    
    const result = await db.collection('students')
      .where(whereCondition)
      .orderBy('createTime', 'desc')
      .skip(skip)
      .limit(pageSize)
      .get();
    
    // 如果按createTime排序失败，尝试按create_time排序
    if (result.data.length === 0) {
      const result2 = await db.collection('students')
        .where(whereCondition)
        .orderBy('create_time', 'desc')
        .skip(skip)
        .limit(pageSize)
        .get();
      
      if (result2.data.length > 0) {
        result.data = result2.data;
      }
    }
    
    // 获取总数
    const countResult = await db.collection('students')
      .where(whereCondition)
      .count();
    
    // 处理数据格式
    const processedData = result.data.map(item => ({
      ...item,
      name: item.name || item.student_name,
      studentId: item.studentId || item.student_id,
      createTime: item.createTime ? new Date(item.createTime).toISOString() : new Date().toISOString(),
      createBy: item.createBy || 'system',
      classes: item.classes || [],
      classIds: item.classIds || []
    }));
    
    console.log(`查询到 ${processedData.length} 个学生，总数: ${countResult.total}`);
    
    return {
      code: 0,
      message: '获取学生档案成功',
      data: processedData,
      total: countResult.total
    };
  } catch (error) {
    console.error('获取学生档案失败:', error);
    throw new Error('获取学生档案失败: ' + error.message);
  }
}

// 获取班级档案列表 - 优化版本
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
    const processedData = result.data.map(item => ({
      ...item,
      className: item.className || item.class_name,
      classCode: item.className || item.class_name,
      teacherName: item.headTeacher || item.teacherName || '未设置',
      teacherId: item.headTeacherId || item.teacherId || '',
      studentCount: item.studentCount || (item.students ? item.students.length : 0),
      students: item.students || [],
      studentIds: item.studentIds || [],
      createTime: item.createTime ? new Date(item.createTime).toISOString() : new Date().toISOString(),
      createBy: 'system'
    }));
    
    console.log(`查询到 ${processedData.length} 个班级，总数: ${countResult.total}`);
    
    return {
      code: 0,
      message: '获取班级档案成功',
      data: processedData,
      total: countResult.total
    };
  } catch (error) {
    console.error('获取班级档案失败:', error);
    throw new Error('获取班级档案失败: ' + error.message);
  }
}

// 获取学生详情 - 优化版本
async function getStudentById(event) {
  try {
    const { studentId } = event;
    
    if (!studentId) {
      return {
        code: -1,
        message: '学生ID不能为空'
      };
    }
    
    console.log('查询学生详情:', studentId);
    
    const result = await db.collection('students')
      .where({
        studentId: studentId,
        status: 'active'
      })
      .get();
    
    if (result.data.length === 0) {
      return {
        code: -1,
        message: '学生不存在'
      };
    }
    
    const student = result.data[0];
    
    // 处理学生数据，确保classes字段存在
    const processedStudent = {
      ...student,
      name: student.name || student.student_name,
      studentId: student.studentId || student.student_id,
      createTime: student.createTime || new Date(student.create_time).toISOString(),
      createBy: student.createBy || 'system',
      classes: student.classes || [],
      classIds: student.classIds || []
    };
    
    console.log('学生详情查询完成');
    
    return {
      code: 0,
      message: '获取学生详情成功',
      data: processedStudent
    };
  } catch (error) {
    console.error('获取学生详情失败:', error);
    throw new Error('获取学生详情失败: ' + error.message);
  }
}

// 获取班级详情 - 优化版本
async function getClassById(event) {
  try {
    const { classId } = event;
    
    if (!classId) {
      return {
        code: -1,
        message: '班级ID不能为空'
      };
    }
    
    console.log('查询班级详情:', classId);
    
    const result = await db.collection('classes')
      .where({
        _id: classId
      })
      .get();
    
    if (result.data.length === 0) {
      return {
        code: -1,
        message: '班级不存在'
      };
    }
    
    const classInfo = result.data[0];
    
    // 处理班级数据
    const processedClass = {
      ...classInfo,
      className: classInfo.className || classInfo.class_name,
      classCode: classInfo.className || classInfo.class_name,
      teacherName: classInfo.headTeacher || classInfo.teacherName || '未设置',
      teacherId: classInfo.headTeacherId || classInfo.teacherId || '',
      studentCount: classInfo.studentCount || (classInfo.students ? classInfo.students.length : 0),
      students: classInfo.students || [],
      studentIds: classInfo.studentIds || [],
      createTime: classInfo.createTime ? new Date(classInfo.createTime).toISOString() : new Date().toISOString(),
      createBy: 'system'
    };
    
    console.log('班级详情查询完成');
    
    return {
      code: 0,
      message: '获取班级详情成功',
      data: processedClass
    };
  } catch (error) {
    console.error('获取班级详情失败:', error);
    throw new Error('获取班级详情失败: ' + error.message);
  }
}

// 搜索档案 - 优化版本
async function searchArchive(event) {
  try {
    const { keyword, type = 'all' } = event;
    
    if (!keyword) {
      return {
        code: -1,
        message: '搜索关键词不能为空'
      };
    }
    
    console.log('搜索档案:', keyword, type);
    
    const results = {
      students: [],
      classes: []
    };
    
    // 搜索学生
    if (type === 'all' || type === 'students') {
      const studentResult = await db.collection('students')
        .where({
          status: 'active',
          name: new RegExp(keyword, 'i')
        })
        .get();
      
      results.students = studentResult.data.map(item => ({
        ...item,
        name: item.name || item.student_name,
        studentId: item.studentId || item.student_id,
        createTime: item.createTime || new Date(item.create_time).toISOString(),
        createBy: item.createBy || 'system',
        classes: item.classes || [],
        classIds: item.classIds || []
      }));
    }
    
    // 搜索班级
    if (type === 'all' || type === 'classes') {
      const classResult = await db.collection('classes')
        .where({
          class_name: new RegExp(keyword, 'i')
        })
        .get();
      
      results.classes = classResult.data.map(item => ({
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
    }
    
    console.log(`搜索完成，找到 ${results.students.length} 个学生，${results.classes.length} 个班级`);
    
    return {
      code: 0,
      message: '搜索成功',
      data: results
    };
  } catch (error) {
    console.error('搜索档案失败:', error);
    throw new Error('搜索档案失败: ' + error.message);
  }
}

// 获取学生学术记录 - 优化版本
async function getStudentAcademicRecords(event) {
  try {
    const { studentId } = event;
    
    if (!studentId) {
      return {
        code: -1,
        message: '学生ID不能为空'
      };
    }
    
    console.log('获取学生学术记录:', studentId);
    
    // 获取学生基本信息
    const studentResult = await db.collection('students')
      .where({
        studentId: studentId
      })
      .get();
    
    if (studentResult.data.length === 0) {
      return {
        code: -1,
        message: '学生不存在'
      };
    }
    
    const student = studentResult.data[0];
    
    // 处理学生数据
    const processedStudent = {
      ...student,
      name: student.name || student.student_name,
      studentId: student.studentId || student.student_id,
      createTime: student.createTime || new Date(student.create_time).toISOString(),
      createBy: student.createBy || 'system',
      classes: student.classes || [],
      classIds: student.classIds || []
    };
    
    console.log('学生学术记录查询完成');
    
    return {
      code: 0,
      message: '获取学生学术记录成功',
      data: processedStudent
    };
  } catch (error) {
    console.error('获取学生学术记录失败:', error);
    throw new Error('获取学生学术记录失败: ' + error.message);
  }
}

// 获取教师列表 - 优化版本
async function getTeachers(event) {
  try {
    console.log('获取教师列表');
    
    const result = await db.collection('uni-id-users')
      .where({
        role: 'teacher'
      })
      .get();
    
    const teachers = result.data.map(item => ({
      _id: item._id,
      username: item.username,
      teacherName: item.teacherName || item.username,
      role: item.role
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

// 删除学生 - 优化版本
async function deleteStudent(event) {
  try {
    const { studentId } = event;
    
    if (!studentId) {
      return {
        code: -1,
        message: '学生ID不能为空'
      };
    }
    
    console.log('删除学生:', studentId);
    
    // 获取学生信息
    const studentResult = await db.collection('students')
      .where({
        studentId: studentId
      })
      .get();
    
    if (studentResult.data.length === 0) {
      return {
        code: -1,
        message: '学生不存在'
      };
    }
    
    const student = studentResult.data[0];
    const classIds = student.classIds || [];
    
    // 开始事务
    const transaction = await db.startTransaction();
    
    try {
      // 删除学生
      await transaction.collection('students')
        .where({
          studentId: studentId
        })
        .remove();
      
      // 从相关班级中移除学生
      for (const classId of classIds) {
        await transaction.collection('classes')
          .doc(classId)
          .update({
            students: db.command.pull({
              _id: student._id
            }),
            studentCount: db.command.inc(-1),
            updateTime: new Date().toISOString()
          });
      }
      
      await transaction.commit();
      
      console.log('学生删除成功');
      
      return {
        code: 0,
        message: '删除学生成功'
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('删除学生失败:', error);
    throw new Error('删除学生失败: ' + error.message);
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
    const classResult = await db.collection('classes')
      .where({
        _id: classId
      })
      .get();
    
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
        message: '删除班级成功'
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

// 批量删除学生 - 优化版本
async function batchDeleteStudents(event) {
  try {
    const { studentIds } = event;
    
    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return {
        code: -1,
        message: '学生ID列表不能为空'
      };
    }
    
    console.log('批量删除学生:', studentIds);
    
    // 获取学生信息
    const studentsResult = await db.collection('students')
      .where({
        studentId: db.command.in(studentIds)
      })
      .get();
    
    if (studentsResult.data.length === 0) {
      return {
        code: -1,
        message: '没有找到要删除的学生'
      };
    }
    
    const students = studentsResult.data;
    const allClassIds = [...new Set(students.flatMap(s => s.classIds || []))];
    
    // 开始事务
    const transaction = await db.startTransaction();
    
    try {
      // 批量删除学生
      await transaction.collection('students')
        .where({
          studentId: db.command.in(studentIds)
        })
        .remove();
      
      // 从相关班级中移除学生
      for (const classId of allClassIds) {
        const classStudents = students.filter(s => (s.classIds || []).includes(classId));
        await transaction.collection('classes')
          .doc(classId)
          .update({
            students: db.command.pullAll(classStudents.map(s => ({ _id: s._id }))),
            studentCount: db.command.inc(-classStudents.length),
            updateTime: new Date().toISOString()
          });
      }
      
      await transaction.commit();
      
      console.log(`批量删除 ${students.length} 个学生成功`);
      
      return {
        code: 0,
        message: `批量删除 ${students.length} 个学生成功`
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('批量删除学生失败:', error);
    throw new Error('批量删除学生失败: ' + error.message);
  }
}

// 批量删除班级 - 优化版本
async function batchDeleteClasses(event) {
  try {
    const { classIds } = event;
    
    if (!classIds || !Array.isArray(classIds) || classIds.length === 0) {
      return {
        code: -1,
        message: '班级ID列表不能为空'
      };
    }
    
    console.log('批量删除班级:', classIds);
    
    // 获取班级信息
    const classesResult = await db.collection('classes')
      .where({
        _id: db.command.in(classIds)
      })
      .get();
    
    if (classesResult.data.length === 0) {
      return {
        code: -1,
        message: '没有找到要删除的班级'
      };
    }
    
    const classes = classesResult.data;
    const allStudentIds = [...new Set(classes.flatMap(c => c.studentIds || []))];
    
    // 开始事务
    const transaction = await db.startTransaction();
    
    try {
      // 批量删除班级
      await transaction.collection('classes')
        .where({
          _id: db.command.in(classIds)
        })
        .remove();
      
      // 从相关学生中移除班级
      for (const studentId of allStudentIds) {
        const studentClasses = classes.filter(c => (c.studentIds || []).includes(studentId));
        await transaction.collection('students')
          .where({
            _id: studentId
          })
          .update({
            classes: db.command.pullAll(studentClasses.map(c => ({ _id: c._id }))),
            classIds: db.command.pullAll(classIds),
            updateTime: new Date().toISOString()
          });
      }
      
      await transaction.commit();
      
      console.log(`批量删除 ${classes.length} 个班级成功`);
      
      return {
        code: 0,
        message: `批量删除 ${classes.length} 个班级成功`
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('批量删除班级失败:', error);
    throw new Error('批量删除班级失败: ' + error.message);
  }
}
