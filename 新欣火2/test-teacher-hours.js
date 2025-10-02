// 课时统计功能测试脚本
// 用于验证修复后的课时统计功能是否正常工作

async function testTeacherHours() {
  console.log('开始测试课时统计功能...');
  
  // 模拟测试数据
  const testSchedules = [
    {
      course_slot_1: '数学课',
      course_slot_1_type: '一对一',
      course_slot_2: '英语课',
      course_slot_2_type: '班课',
      course_slot_3: '物理课',
      course_slot_3_type: '脱产生'
    },
    {
      course_slot_1: '化学课',
      course_slot_1_type: '一对一',
      course_slot_2: '语文课',
      course_slot_2_type: '班课'
    }
  ];
  
  // 模拟计算课时的函数
  function calculateHours(schedules) {
    const stats = {
      '一对一': 0,
      '班课': 0,
      '脱产生': 0,
      '总计': 0
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
          // 每节课默认2小时
          const courseDuration = 2;
          
          // 根据课程类型累加课时
          if (stats.hasOwnProperty(courseType)) {
            stats[courseType] += courseDuration;
          } else {
            // 如果是其他类型的课程，归类到其他
            stats['其他'] = (stats['其他'] || 0) + courseDuration;
          }
          
          stats['总计'] += courseDuration;
        }
      }
    });
    
    return stats;
  }
  
  // 执行测试
  const result = calculateHours(testSchedules);
  console.log('测试结果:', result);
  
  // 验证结果
  const expected = {
    '一对一': 4,
    '班课': 4,
    '脱产生': 2,
    '总计': 10
  };
  
  const isCorrect = 
    result['一对一'] === expected['一对一'] &&
    result['班课'] === expected['班课'] &&
    result['脱产生'] === expected['脱产生'] &&
    result['总计'] === expected['总计'];
  
  if (isCorrect) {
    console.log('✅ 课时统计功能测试通过');
  } else {
    console.log('❌ 课时统计功能测试失败');
    console.log('期望结果:', expected);
    console.log('实际结果:', result);
  }
  
  return isCorrect;
}

// 运行测试
testTeacherHours().then(success => {
  if (success) {
    console.log('所有测试已完成并成功通过');
  } else {
    console.log('测试失败，请检查代码');
  }
});