'use strict';

const db = uniCloud.database();

exports.main = async (event, context) => {
  const { action, teacherId } = event;
  
  try {
    switch (action) {
      case 'getMyClassStudentsByType':
        return await getMyClassStudentsByType(teacherId);
      case 'getMyStudents':
        return await getMyStudents(teacherId);
      default:
        return {
          code: 400,
          message: '未知的操作类型'
        };
    }
  } catch (error) {
    console.error('学生课时管理错误:', error);
    return {
      code: 500,
      message: '服务器内部错误',
      error: error.message
    };
  }
};

// 获取我的学生按类型分组
async function getMyClassStudentsByType(teacherId) {
  try {
    if (!teacherId) {
      return {
        code: 400,
        message: '缺少教师ID'
      };
    }

    // 从两个集合获取数据并合并
    const studentScores = await db.collection('student_scores').get();
    const examScores = await db.collection('exam_scores').get();
    
    // 合并两个集合的数据
    const allScores = [
      ...studentScores.data,
      ...examScores.data
    ];

    if (allScores.length === 0) {
      return {
        code: 200,
        message: '暂无学生数据',
        data: {
          classStudents: [],
          oneToOneStudents: []
        }
      };
    }

    // 按学生ID分组，获取每个学生的信息
    const studentMap = new Map();
    
    // 先处理有完整信息的记录
    allScores.forEach(score => {
      const studentId = score.studentId || score.student_id;
      const studentName = score.studentName || '未知学生';
      const grade = score.grade || '未知年级';
      const subject = score.subject || score.course_id;
      const className = score.className || '';
      const courseType = score.courseType || '班课';
      
      if (!studentMap.has(studentId)) {
        studentMap.set(studentId, {
          _id: studentId,
          studentName: studentName,
          grade: grade,
          subject: subject,
          className: className,
          courseType: courseType,
          entranceTestScore: null,
          latestScore: null,
          allScores: [] // 存储该学生的所有成绩
        });
      }
      
      // 将成绩添加到学生的成绩列表中
      studentMap.get(studentId).allScores.push(score);
    });

    // 为每个学生计算最新成绩并获取班级信息
    for (let [studentId, student] of studentMap) {
      // 获取学生的完整信息（包括班级信息）
      try {
        const studentInfo = await db.collection('students')
          .where({
            studentId: studentId
          })
          .get();
        
        if (studentInfo.data.length > 0) {
          const studentData = studentInfo.data[0];
          // 更新学生信息
          if (studentData.name) student.studentName = studentData.name;
          if (studentData.grade) student.grade = studentData.grade;
          
          // 获取班级信息
          if (studentData.classes && studentData.classes.length > 0) {
            // 根据科目选择对应的班级
            const matchingClass = studentData.classes.find(cls => 
              cls.class_name && cls.class_name.includes(student.subject)
            );
            if (matchingClass) {
              student.className = matchingClass.class_name;
            } else {
              // 如果没有匹配的班级，使用第一个班级
              student.className = studentData.classes[0].class_name;
            }
          }
        }
      } catch (error) {
        console.error('获取学生信息失败:', error);
      }

      if (student.allScores.length > 0) {
        // 按日期排序，取最新的
        student.allScores.sort((a, b) => {
          const dateA = new Date(a.examDate || a.exam_date || 0).getTime();
          const dateB = new Date(b.examDate || b.exam_date || 0).getTime();
          return dateB - dateA;
        });
        
        const latestScoreData = student.allScores[0];
        student.latestScore = {
          score: latestScoreData.score,
          subject: latestScoreData.subject || latestScoreData.course_id,
          examDate: latestScoreData.examDate || latestScoreData.exam_date
        };
        
        // 使用最新成绩记录中的学生信息更新学生信息
        if (latestScoreData.studentName && latestScoreData.studentName !== '未知学生') {
          student.studentName = latestScoreData.studentName;
        }
        if (latestScoreData.grade && latestScoreData.grade !== '未知年级') {
          student.grade = latestScoreData.grade;
        }
        
        // 清理临时数据
        delete student.allScores;
      }
    }

    // 按课程类型分组
    const classStudents = [];
    const oneToOneStudents = [];
    
    studentMap.forEach(student => {
      if (student.courseType === '一对一' || student.courseType === '1对1') {
        oneToOneStudents.push(student);
      } else {
        classStudents.push(student);
      }
    });

    return {
      code: 200,
      message: '获取成功',
      data: {
        classStudents,
        oneToOneStudents
      }
    };
  } catch (error) {
    console.error('获取学生数据失败:', error);
    return {
      code: 500,
      message: '获取学生数据失败: ' + error.message
    };
  }
}

// 获取我的学生列表
async function getMyStudents(teacherId) {
  try {
    if (!teacherId) {
      return {
        code: 400,
        message: '缺少教师ID'
      };
    }

    // 从两个集合获取数据并合并
    const studentScores = await db.collection('student_scores').get();
    const examScores = await db.collection('exam_scores').get();
    
    // 合并两个集合的数据
    const allScores = [
      ...studentScores.data,
      ...examScores.data
    ];

    if (allScores.length === 0) {
      return {
        code: 200,
        message: '暂无学生数据',
        data: []
      };
    }

    // 按学生ID分组，获取每个学生的信息
    const studentMap = new Map();
    
    allScores.forEach(score => {
      const studentId = score.studentId || score.student_id;
      const studentName = score.studentName || '未知学生';
      const grade = score.grade || '未知年级';
      const subject = score.subject || score.course_id;
      const className = score.className || '';
      const courseType = score.courseType || '班课';
      
      if (!studentMap.has(studentId)) {
        studentMap.set(studentId, {
          _id: studentId,
          studentName: studentName,
          grade: grade,
          subject: subject,
          className: className,
          courseType: courseType,
          entranceTestScore: null,
          latestScore: null,
          allScores: []
        });
      }
      
      studentMap.get(studentId).allScores.push(score);
    });

    // 为每个学生计算最新成绩并获取班级信息
    for (let [studentId, student] of studentMap) {
      // 获取学生的完整信息（包括班级信息）
      try {
        const studentInfo = await db.collection('students')
          .where({
            studentId: studentId
          })
          .get();
        
        if (studentInfo.data.length > 0) {
          const studentData = studentInfo.data[0];
          // 更新学生信息
          if (studentData.name) student.studentName = studentData.name;
          if (studentData.grade) student.grade = studentData.grade;
          
          // 获取班级信息
          if (studentData.classes && studentData.classes.length > 0) {
            // 根据科目选择对应的班级
            const matchingClass = studentData.classes.find(cls => 
              cls.class_name && cls.class_name.includes(student.subject)
            );
            if (matchingClass) {
              student.className = matchingClass.class_name;
            } else {
              // 如果没有匹配的班级，使用第一个班级
              student.className = studentData.classes[0].class_name;
            }
          }
        }
      } catch (error) {
        console.error('获取学生信息失败:', error);
      }

      if (student.allScores.length > 0) {
        student.allScores.sort((a, b) => {
          const dateA = new Date(a.examDate || a.exam_date || 0).getTime();
          const dateB = new Date(b.examDate || b.exam_date || 0).getTime();
          return dateB - dateA;
        });
        
        const latestScoreData = student.allScores[0];
        student.latestScore = {
          score: latestScoreData.score,
          subject: latestScoreData.subject || latestScoreData.course_id,
          examDate: latestScoreData.examDate || latestScoreData.exam_date
        };
        
        if (latestScoreData.studentName && latestScoreData.studentName !== '未知学生') {
          student.studentName = latestScoreData.studentName;
        }
        if (latestScoreData.grade && latestScoreData.grade !== '未知年级') {
          student.grade = latestScoreData.grade;
        }
        
        delete student.allScores;
      }
    }

    return {
      code: 200,
      message: '获取成功',
      data: Array.from(studentMap.values())
    };
  } catch (error) {
    console.error('获取学生数据失败:', error);
    return {
      code: 500,
      message: '获取学生数据失败: ' + error.message
    };
  }
}