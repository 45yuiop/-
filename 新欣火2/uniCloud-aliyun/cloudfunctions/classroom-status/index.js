'use strict';
const db = uniCloud.database();
const dbCmd = db.command;

exports.main = async (event, context) => {
  const { date, slot } = event; // date: '2025-07-14', slot: '1'
  console.log('date:', date, 'slot:', slot);

  // 获取所有教室
  const classroomsRes = await db.collection('classrooms').get();
  const classrooms = classroomsRes.data;

  // 获取当天所有排课，兼容字符串和Date类型
  const start = new Date(date);
  start.setHours(0,0,0,0);
  const end = new Date(start.getTime() + 24*60*60*1000);
  const schedulesRes = await db.collection('schedules').where({
    course_date: dbCmd.gte(start).and(dbCmd.lt(end))
  }).get();
  const schedules = schedulesRes.data;
  console.log('查到的schedules:', schedules);

  // 统计每个教室的状态
  const result = classrooms.map(room => {
    let occupied = false;
    let info = '';
    let teacher = '';
    for (let s of schedules) {
      const loc = s[`course_slot_${slot}_location`];
      if (loc && String(loc) === String(room.location_id)) {
        occupied = true;
        info = `${s[`course_slot_${slot}_type`] || ''} ${s[`course_slot_${slot}_class`] || ''}`.trim();
        // 优先显示teacherName，没有则用username
        teacher = s.teacherName || s.username || '';
        break;
      }
    }
    return {
      location_id: room.location_id,
      name: room.name,
      campus: room.campus,
      status: occupied ? '占用' : '空闲',
      info,
      teacher
    };
  });

  return {
    code: 0,
    data: result
  };
}; 