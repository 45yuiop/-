// 更新班级学生数的脚本
const db = uniCloud.database();

async function updateClassStudentCount() {
  try {
    console.log('开始更新班级学生数...');
    
    // 获取所有班级
    const classesResult = await db.collection('classes').get();
    console.log(`找到 ${classesResult.data.length} 个班级`);
    
    for (const classItem of classesResult.data) {
      // 计算实际学生数
      const actualStudentCount = classItem.students ? classItem.students.length : 0;
      
      // 如果学生数不匹配，则更新
      if (classItem.studentCount !== actualStudentCount) {
        console.log(`更新班级 ${classItem.className}: ${classItem.studentCount} -> ${actualStudentCount}`);
        
        await db.collection('classes').doc(classItem._id).update({
          studentCount: actualStudentCount,
          updateTime: new Date()
        });
      }
    }
    
    console.log('班级学生数更新完成');
    
  } catch (error) {
    console.error('更新班级学生数失败:', error);
  }
}

// 导出函数供云函数调用
exports.main = async (event, context) => {
  await updateClassStudentCount();
  return {
    code: 0,
    message: '班级学生数更新完成'
  };
};
