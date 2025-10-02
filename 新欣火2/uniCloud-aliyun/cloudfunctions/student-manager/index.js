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
        for (const classId of studentData.classIds) {
          // 获取班级信息
          const classResult = await transaction.collection('classes').doc(classId).get();
          if (classResult.data.length > 0) {
            const classInfo = classResult.data[0];
            
            // 构建学生信息对象
            const studentInfo = {
              _id: result.id,
              studentId: studentData.studentId,
              name: studentData.name,
              grade: studentData.grade
            };
            
            // 更新班级的students数组和studentCount
            await transaction.collection('classes').doc(classId).update({
              students: db.command.push(studentInfo),
              studentIds: db.command.push(result.id),
              studentCount: db.command.inc(1),
              updateTime: new Date()
            });
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
