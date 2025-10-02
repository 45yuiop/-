# 学生档案数据库重构方案

## 当前问题
- 涉及4个数据库表：`students`, `classes`, `student_courses`, `class_teachers`
- 读操作过多，每次查询需要多次关联
- 数据分散，维护复杂

## 重构目标
- 只使用2个核心表：`students` 和 `classes`
- 大幅减少读操作
- 简化数据结构和查询逻辑

## 新数据库结构设计

### 1. students 表（学生档案表）
```javascript
{
  _id: "学生ID",
  studentId: "学号",
  name: "学生姓名",
  grade: "年级",
  subjects: ["语文", "数学", "英语"], // 学科数组
  classes: [ // 班级信息数组（替代student_courses表）
    {
      _id: "班级ID",
      className: "班级名称",
      subject: "学科",
      grade: "年级",
      teacherName: "任课教师",
      teacherId: "教师ID"
    }
  ],
  classIds: ["班级ID1", "班级ID2"], // 用于快速查询
  status: "active", // 状态
  createTime: "创建时间",
  updateTime: "更新时间"
}
```

### 2. classes 表（班级档案表）
```javascript
{
  _id: "班级ID",
  className: "班级名称",
  grade: "年级",
  subject: "学科",
  teacherName: "任课教师",
  teacherId: "教师ID",
  students: [ // 学生信息数组（替代class_teachers表）
    {
      _id: "学生ID",
      studentId: "学号",
      name: "学生姓名",
      grade: "年级"
    }
  ],
  studentIds: ["学生ID1", "学生ID2"], // 用于快速查询
  studentCount: 25, // 学生数量（冗余字段，提高查询效率）
  status: "active",
  createTime: "创建时间",
  updateTime: "更新时间"
}
```

## 数据迁移策略

### 阶段1：数据合并
1. 将 `student_courses` 表的数据合并到 `students.classes` 字段
2. 将 `class_teachers` 表的数据合并到 `classes.students` 字段
3. 更新 `classIds` 和 `studentIds` 字段

### 阶段2：数据同步
1. 确保 `students.classes` 和 `classes.students` 数据一致
2. 更新 `studentCount` 等冗余字段
3. 验证数据完整性

### 阶段3：代码更新
1. 更新所有云函数，移除对关联表的依赖
2. 修改查询逻辑，直接使用核心表
3. 更新前端代码

## 预期效果
- 读操作减少 70% 以上
- 查询速度提升 3-5 倍
- 代码维护成本降低
- 数据一致性更好

## 实施步骤
1. 备份现有数据
2. 创建新的表结构
3. 执行数据迁移脚本
4. 更新云函数代码
5. 测试验证
6. 删除旧表
