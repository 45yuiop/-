export default [
  { key: 'register', name: '注册账号', assignable: true },
  { key: 'user_manage', name: '账号管理', assignable: true },
  { key: 'schedule', name: '教师排课', assignable: true },
  { key: 'salary', name: '课时统计', assignable: true },
  { key: 'admin_teacher_schedule', name: '教师课程表', assignable: true },
  { key: 'course_change_approval', name: '调课审批', assignable: true },
  // 权限分配可选功能调整：删除学生课时录入/学生课时/我的班级/我的课表/试卷分析
  // 新增：班级管理、学生录入、学生档案
  { key: 'class_management', name: '班级管理', assignable: true },
  { key: 'student_input', name: '学生录入', assignable: true },
  { key: 'archive', name: '学生档案', assignable: true },
  // { key: 'system_setting', name: '系统设置', assignable: false },
  // { key: 'permission_assign', name: '权限分配', assignable: false }
  // 以后新增功能只需在这里加
]; 