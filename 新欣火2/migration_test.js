// 数据库重构测试脚本
// 用于测试数据迁移和验证新结构

const testMigration = async () => {
  console.log('开始数据库重构测试...');
  
  try {
    // 1. 执行学生数据迁移
    console.log('\n=== 步骤1: 迁移学生数据 ===');
    const studentMigrationResult = await uniCloud.callFunction({
      name: 'database-migration',
      data: {
        action: 'migrateStudentData'
      }
    });
    
    if (studentMigrationResult.result.code === 0) {
      console.log('✅ 学生数据迁移成功');
      console.log('迁移详情:', studentMigrationResult.result.data);
    } else {
      console.error('❌ 学生数据迁移失败:', studentMigrationResult.result.message);
      return;
    }
    
    // 2. 执行班级数据迁移
    console.log('\n=== 步骤2: 迁移班级数据 ===');
    const classMigrationResult = await uniCloud.callFunction({
      name: 'database-migration',
      data: {
        action: 'migrateClassData'
      }
    });
    
    if (classMigrationResult.result.code === 0) {
      console.log('✅ 班级数据迁移成功');
      console.log('迁移详情:', classMigrationResult.result.data);
    } else {
      console.error('❌ 班级数据迁移失败:', classMigrationResult.result.message);
      return;
    }
    
    // 3. 同步数据
    console.log('\n=== 步骤3: 同步数据 ===');
    const syncResult = await uniCloud.callFunction({
      name: 'database-migration',
      data: {
        action: 'syncData'
      }
    });
    
    if (syncResult.result.code === 0) {
      console.log('✅ 数据同步成功');
    } else {
      console.error('❌ 数据同步失败:', syncResult.result.message);
      return;
    }
    
    // 4. 验证数据完整性
    console.log('\n=== 步骤4: 验证数据完整性 ===');
    const validationResult = await uniCloud.callFunction({
      name: 'database-migration',
      data: {
        action: 'validateData'
      }
    });
    
    if (validationResult.result.code === 0) {
      console.log('✅ 数据验证完成');
      console.log('验证详情:', validationResult.result.data);
    } else {
      console.error('❌ 数据验证失败:', validationResult.result.message);
      return;
    }
    
    // 5. 测试新的档案管理功能
    console.log('\n=== 步骤5: 测试新的档案管理功能 ===');
    
    // 测试获取所有学生
    const allStudentsResult = await uniCloud.callFunction({
      name: 'archive-manager-optimized',
      data: {
        action: 'getAllStudents'
      }
    });
    
    if (allStudentsResult.result.code === 0) {
      console.log('✅ 获取所有学生成功');
      console.log(`学生数量: ${allStudentsResult.result.data.length}`);
    } else {
      console.error('❌ 获取所有学生失败:', allStudentsResult.result.message);
    }
    
    // 测试获取所有班级
    const allClassesResult = await uniCloud.callFunction({
      name: 'archive-manager-optimized',
      data: {
        action: 'getAllClasses'
      }
    });
    
    if (allClassesResult.result.code === 0) {
      console.log('✅ 获取所有班级成功');
      console.log(`班级数量: ${allClassesResult.result.data.length}`);
    } else {
      console.error('❌ 获取所有班级失败:', allClassesResult.result.message);
    }
    
    // 测试搜索功能
    const searchResult = await uniCloud.callFunction({
      name: 'archive-manager-optimized',
      data: {
        action: 'searchArchive',
        keyword: '测试',
        type: 'all'
      }
    });
    
    if (searchResult.result.code === 0) {
      console.log('✅ 搜索功能正常');
      console.log(`搜索结果: 学生${searchResult.result.data.students.length}个, 班级${searchResult.result.data.classes.length}个`);
    } else {
      console.error('❌ 搜索功能失败:', searchResult.result.message);
    }
    
    console.log('\n🎉 数据库重构测试完成！');
    console.log('\n📊 性能对比:');
    console.log('- 原架构: 需要查询4个表 (students, classes, student_courses, class_teachers)');
    console.log('- 新架构: 只需要查询2个表 (students, classes)');
    console.log('- 预期读操作减少: 70%+');
    console.log('- 预期查询速度提升: 3-5倍');
    
  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error);
  }
};

// 执行测试
testMigration();

// 导出函数供其他模块使用
export { testMigration };
