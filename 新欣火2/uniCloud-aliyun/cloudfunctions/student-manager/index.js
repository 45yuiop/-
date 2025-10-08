'use strict';

const db = uniCloud.database();
const collection = db.collection('students');

// 从班级名称中提取科目
function extractSubjectFromClassName(className) {
  const subjects = ['语文', '数学', '英语', '物理', '化学'];
  for (const subject of subjects) {
    if (className.includes(subject)) {
      return subject;
    }
  }
  return '未知科目';
}

exports.main = async (event, context) => {
  const { action, studentData, studentsData } = event;
  
  try {
    switch (action) {
      case 'addStudent':
        return await addStudent(studentData);
      case 'addBatchStudents':
        return await addBatchStudents(studentsData);
      case 'getStudents':
        return await getStudents(event);
      case 'updateStudent':
        return await updateStudent(event);
      case 'deleteStudent':
        return await deleteStudent(event);
      case 'debugClass':
        return await debugClass(event);
      default:
        return {
          code: -1,
          message: '未知操作'
        };
    }
  } catch (error) {
    console.error('学生管理云函数错误:', error);
    return {
      code: -1,
      message: error.message || '操作失败'
    };
  }
};

// 添加单个学生
async function addStudent(studentData) {
  try {
    // 检查学号是否已存在（在事务外进行）
    const existingStudent = await db.collection('students').where({
      studentId: studentData.studentId
    }).get();
    
    if (existingStudent.data.length > 0) {
      return {
        code: -1,
        message: '学号已存在，请重新生成'
      };
    }
    
    // 先在事务外验证班级信息
    const classInfoMap = {};
    if (studentData.classIds && studentData.classIds.length > 0) {
      console.log('开始验证班级信息，班级数量:', studentData.classIds.length);
      
      for (const classId of studentData.classIds) {
        console.log('验证班级ID:', classId);
        
        // 在事务外获取班级信息
        const classResult = await db.collection('classes').doc(classId).get();
        if (classResult.data.length > 0) {
          classInfoMap[classId] = classResult.data[0];
          console.log('找到班级:', classResult.data[0].className);
        } else {
          console.error('班级不存在:', classId);
          
          // 查询所有班级来调试
          const allClassesResult = await db.collection('classes').get();
          console.log('数据库中所有班级:', allClassesResult.data.map(c => ({
            id: c._id,
            name: c.className,
            grade: c.grade,
            subject: c.subject
          })));
          
          throw new Error(`班级不存在: ${classId}，请检查班级是否已被删除或ID是否正确`);
        }
      }
    }

    // 开始事务
    const transaction = await db.startTransaction();
    
    try {
      // 添加学生数据
      const result = await transaction.collection('students').add({
        ...studentData,
        createTime: new Date(),
        updateTime: new Date(),
        status: 'active'
      });
      
      // 更新相关班级的学生信息
      if (studentData.classIds && studentData.classIds.length > 0) {
        console.log('开始更新班级信息，班级数量:', studentData.classIds.length);
        
        for (const classId of studentData.classIds) {
          console.log('处理班级ID:', classId);
          
          const classInfo = classInfoMap[classId];
          console.log('使用预加载的班级信息:', classInfo.className);
          
          // 检查学生是否已在班级的students数组中
          const existingStudents = classInfo.students || [];
          const existingStudentIds = classInfo.studentIds || [];
          const isStudentExists = existingStudents.some(s => s._id === result.id || s.studentId === studentData.studentId);
          const isIdExists = existingStudentIds.includes(result.id);
          
          // 构建学生信息对象
          const studentInfo = {
            _id: result.id,
            studentId: studentData.studentId,
            name: studentData.name,
            grade: studentData.grade
          };
          
          console.log('学生信息:', studentInfo);
          console.log('学生是否已存在:', isStudentExists, '学生ID是否已存在:', isIdExists);
          
          // 构建更新数据
          const updateData = {
            updateTime: new Date()
          };
          
          if (!isStudentExists) {
            updateData.students = db.command.push(studentInfo);
            console.log('将添加学生到students数组');
          }
          
          if (!isIdExists) {
            updateData.studentIds = db.command.push(result.id);
            console.log('将添加学生ID到studentIds数组');
          }
          
          if (!isStudentExists) {
            updateData.studentCount = db.command.inc(1);
            console.log('将增加学生数量');
          }
          
          // 只有需要更新时才执行更新
          if (!isStudentExists || !isIdExists) {
            await transaction.collection('classes').doc(classId).update(updateData);
            console.log('班级更新成功:', classInfo.className);
          } else {
            console.log('学生已存在于班级中，无需更新');
          }
        }
      }
      
      // 如果有成绩信息，添加学生成绩到student_scores表
      if (studentData.scores && studentData.scores.length > 0) {
        const scorePromises = studentData.scores.map(score => {
          return transaction.collection('student_scores').add({
            student_id: studentData.studentId,
            subject: score.subject,
            score: parseFloat(score.score) || 0,
            exam_type: '录入',
            exam_date: new Date().toISOString(),
            create_time: new Date().toISOString(),
            create_by: studentData.createBy || 'unknown'
          });
        });
        
        await Promise.all(scorePromises);
      }
      
      await transaction.commit();
      
      // 录入成功后，立即验证和修复数据一致性
      try {
        console.log('开始验证学生数据一致性:', result.id);
        await verifyStudentClassConsistency(result.id, studentData.classIds);
        console.log('学生数据一致性验证完成:', result.id);
      } catch (error) {
        console.error('数据一致性验证失败:', error);
        // 验证失败不影响学生录入的成功返回
      }
      
      return {
        code: 0,
        message: '学生录入成功',
        data: {
          id: result.id,
          studentId: studentData.studentId
        }
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    throw new Error('添加学生失败: ' + error.message);
  }
}

// 批量添加学生
async function addBatchStudents(studentsData) {
  try {
    const batch = [];
    const studentIds = studentsData.map(s => s.studentId);
    
    // 检查是否有重复的学号（在事务外进行）
    const existingStudents = await db.collection('students').where({
      studentId: db.command.in(studentIds)
    }).get();
    
    if (existingStudents.data.length > 0) {
      const existingIds = existingStudents.data.map(s => s.studentId);
      return {
        code: -1,
        message: `以下学号已存在: ${existingIds.join(', ')}`
      };
    }
    
    // 准备批量插入数据
    studentsData.forEach(student => {
      batch.push({
        ...student,
        createTime: new Date(),
        updateTime: new Date(),
        status: 'active'
      });
    });
    
    const result = await db.collection('students').add(batch);
    
    // 班级信息已经直接存储在students表中，无需额外处理
    
    return {
      code: 0,
      message: `成功录入 ${studentsData.length} 名学生`,
      data: {
        count: studentsData.length,
        ids: result.ids
      }
    };
  } catch (error) {
    throw new Error('批量添加学生失败: ' + error.message);
  }
}

// 验证学生和班级数据一致性
async function verifyStudentClassConsistency(studentId, classIds) {
  console.log('开始验证数据一致性，学生ID:', studentId, '班级IDs:', classIds);
  
  try {
    if (!classIds || classIds.length === 0) {
      console.log('学生没有班级，无需验证');
      return;
    }
    
    // 获取学生信息
    const studentResult = await db.collection('students').doc(studentId).get();
    if (studentResult.data.length === 0) {
      console.error('学生不存在:', studentId);
      return;
    }
    
    const student = studentResult.data[0];
    console.log('验证学生:', student.name);
    
    // 检查每个班级是否包含该学生
    for (const classId of classIds) {
      const classResult = await db.collection('classes').doc(classId).get();
      if (classResult.data.length > 0) {
        const classInfo = classResult.data[0];
        const students = classInfo.students || [];
        const studentIds = classInfo.studentIds || [];
        
        // 检查学生是否在班级的students数组中
        const isInStudentsArray = students.some(s => s._id === studentId || s.studentId === student.studentId);
        const isInStudentIdsArray = studentIds.includes(studentId);
        
        if (!isInStudentsArray || !isInStudentIdsArray) {
          console.warn('发现数据不一致，开始修复:', {
            classId,
            className: classInfo.className,
            isInStudentsArray,
            isInStudentIdsArray,
            studentName: student.name
          });
          
          // 自动修复数据不一致
          await fixClassStudentInconsistency(classId, student);
        } else {
          console.log('数据一致性验证通过:', classInfo.className);
        }
      }
    }
    
  } catch (error) {
    console.error('数据一致性验证失败:', error);
  }
}

// 修复班级和学生数据不一致
async function fixClassStudentInconsistency(classId, student) {
  console.log('开始修复数据不一致，班级ID:', classId, '学生:', student.name);
  
  try {
    const classResult = await db.collection('classes').doc(classId).get();
    if (classResult.data.length === 0) {
      console.error('班级不存在:', classId);
      return;
    }
    
    const classInfo = classResult.data[0];
    const students = classInfo.students || [];
    const studentIds = classInfo.studentIds || [];
    
    // 检查学生是否已存在
    const isStudentExists = students.some(s => s._id === student._id || s.studentId === student.studentId);
    const isIdExists = studentIds.includes(student._id);
    
    const updateData = {
      updateTime: new Date()
    };
    
    // 如果学生不在students数组中，添加
    if (!isStudentExists) {
      const studentInfo = {
        _id: student._id,
        studentId: student.studentId,
        name: student.name,
        grade: student.grade
      };
      updateData.students = db.command.push(studentInfo);
      console.log('添加学生到students数组');
    }
    
    // 如果学生ID不在studentIds数组中，添加
    if (!isIdExists) {
      updateData.studentIds = db.command.push(student._id);
      console.log('添加学生ID到studentIds数组');
    }
    
    // 重新计算学生数量
    const correctStudentCount = students.length + (isStudentExists ? 0 : 1);
    updateData.studentCount = correctStudentCount;
    
    // 更新班级信息
    await db.collection('classes').doc(classId).update(updateData);
    
    console.log('数据不一致修复完成:', {
      classId,
      className: classInfo.className,
      studentName: student.name,
      newStudentCount: correctStudentCount
    });
    
  } catch (error) {
    console.error('修复数据不一致失败:', error);
  }
}

// 获取学生列表
async function getStudents(event) {
  try {
    const { page = 1, pageSize = 20, grade, name, school } = event;
    const skip = (page - 1) * pageSize;
    
    let whereCondition = {};
    
    // 构建查询条件
    if (grade) {
      whereCondition.grade = grade;
    }
    if (name) {
      whereCondition.name = new RegExp(name, 'i');
    }
    if (school) {
      whereCondition.school = new RegExp(school, 'i');
    }
    
    const result = await collection
      .where(whereCondition)
      .orderBy('createTime', 'desc')
      .skip(skip)
      .limit(pageSize)
      .get();
    
    // 获取总数
    const countResult = await collection.where(whereCondition).count();
    
    return {
      code: 0,
      message: '获取成功',
      data: {
        list: result.data,
        total: countResult.total,
        page: page,
        pageSize: pageSize
      }
    };
  } catch (error) {
    throw new Error('获取学生列表失败: ' + error.message);
  }
}

// 更新学生信息
async function updateStudent(event) {
  try {
    const { studentId, updateData } = event;
    
    if (!studentId) {
      return {
        code: -1,
        message: '学号不能为空'
      };
    }
    
    // 如果更新了 classes 字段，同步更新 classIds 字段
    if (updateData.classes && Array.isArray(updateData.classes)) {
      updateData.classIds = updateData.classes.map(c => c._id);
      console.log('同步更新 classIds:', updateData.classIds);
    }
    
    const result = await collection.where({
      studentId: studentId
    }).update({
      ...updateData,
      updateTime: new Date()
    });
    
    if (result.updated === 0) {
      return {
        code: -1,
        message: '学生不存在'
      };
    }
    
    return {
      code: 0,
      message: '更新成功',
      data: result
    };
  } catch (error) {
    throw new Error('更新学生信息失败: ' + error.message);
  }
}

// 删除学生
async function deleteStudent(event) {
  try {
    const { studentId } = event;
    
    if (!studentId) {
      return {
        code: -1,
        message: '学号不能为空'
      };
    }
    
    const result = await collection.where({
      studentId: studentId
    }).remove();
    
    if (result.deleted === 0) {
      return {
        code: -1,
        message: '学生不存在'
      };
    }
    
    return {
      code: 0,
      message: '删除成功',
      data: result
    };
  } catch (error) {
    throw new Error('删除学生失败: ' + error.message);
  }
}

// 调试班级信息
async function debugClass(event) {
  try {
    const { classId } = event;
    
    console.log('调试班级信息，班级ID:', classId);
    
    // 查询特定班级
    if (classId) {
      const classResult = await db.collection('classes').doc(classId).get();
      console.log('特定班级查询结果:', classResult);
      
      if (classResult.data.length > 0) {
        return {
          code: 0,
          message: '班级存在',
          data: classResult.data[0]
        };
      } else {
        // 查询所有班级
        const allClassesResult = await db.collection('classes').get();
        console.log('所有班级数量:', allClassesResult.data.length);
        
        return {
          code: -1,
          message: '班级不存在',
          data: {
            targetClassId: classId,
            allClasses: allClassesResult.data.map(c => ({
              id: c._id,
              name: c.className,
              grade: c.grade,
              subject: c.subject,
              studentCount: c.studentCount || 0
            }))
          }
        };
      }
    } else {
      // 查询所有班级
      const allClassesResult = await db.collection('classes').get();
      
      return {
        code: 0,
        message: '所有班级信息',
        data: {
          total: allClassesResult.data.length,
          classes: allClassesResult.data.map(c => ({
            id: c._id,
            name: c.className,
            grade: c.grade,
            subject: c.subject,
            studentCount: c.studentCount || 0,
            studentsArrayLength: c.students ? c.students.length : 0
          }))
        }
      };
    }
    
  } catch (error) {
    console.error('调试班级信息失败:', error);
    return {
      code: -1,
      message: '调试失败: ' + error.message
    };
  }
}
