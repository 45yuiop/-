<template>
  <view>
    <!-- 顶部自定义导航栏 -->
    <view :style="{height: statusBarHeight + 'px'}"></view>
    <view class="custom-navbar">
      <view class="back-btn" @click="goBack">
        <image src="/static/3.png" class="back-icon"></image>
      </view>
      <view class="navbar-title-wrap">
        <view class="navbar-title">我的班级</view>
      </view>
      <view class="navbar-placeholder"></view>
    </view>

    <!-- 顶部控制栏 -->
    <view class="control-bar">
      <!-- 类型切换tab -->
      <view class="type-tabs">
        <view
          v-for="type in typeList"
          :key="type"
          :class="['type-tab', selectedType === type ? 'active' : '']"
          @click="selectType(type)"
        >{{ type }}</view>
      </view>
      
      <!-- 学年选择器 -->
      <view class="year-selector" @click="showYearPicker">
        <text class="year-text">{{ selectedYear }}</text>
        <text class="dropdown-arrow">▼</text>
      </view>
    </view>

    <view class="main-container">
      <!-- 左侧：班课为班课名，其它为年级 -->
      <view v-if="leftList.length > 0" class="sidebar">
        <view
          v-for="(item, idx) in leftList"
          :key="item"
          :class="['side-item', selectedLeft === item ? 'active' : '']"
          @click="selectLeft(item)"
        >
          {{ item }}
          <template v-if="classStatusMap[item]">
            <text v-if="classStatusMap[item].isOver" style="color:#f56c6c;font-size:24rpx;">（已结课）</text>
          </template>
        </view>
      </view>
      <!-- 右侧内容区域 -->
      <view class="content-panel">
        <view v-if="filteredStudents.length > 0" class="content-list">
          <!-- 班级卡片 -->
          <view 
            v-for="student in classItems"
            :key="student._id"
            class="class-card" 
            @click="showStudentDetail(student)"
          >
            <view class="class-header">
              <view class="class-icon">📚</view>
              <view class="class-info">
                <text class="class-name">{{ student.name }}</text>
                <text class="class-meta">{{ student.grade || '年级' }} · {{ student.subject || '综合' }}</text>
              </view>
              <view class="class-stats">
                <text class="student-count">{{ student.studentCount }}</text>
                <text class="count-label">人</text>
              </view>
            </view>
            <view class="class-footer">
              <text class="class-year">{{ student.classYear }}</text>
              <view class="class-arrow">›</view>
            </view>
          </view>
          
          <!-- 学生卡片 -->
          <view 
            v-for="student in studentItems"
            :key="student._id"
            class="student-card" 
            @click="showStudentDetail(student)"
          >
            <view class="student-avatar">
              <text class="avatar-text">{{ student.name.charAt(0) }}</text>
            </view>
            <view class="student-content">
              <view class="student-header">
                <text class="student-name">{{ student.name }}</text>
                <text class="student-id">{{ student.studentId }}</text>
              </view>
              <view class="student-meta">
                <text class="student-grade">{{ student.grade }}</text>
                <text class="student-class">{{ student.className }}</text>
              </view>
              <view class="score-section" v-if="student.latestScore">
                <view class="score-item">
                  <text class="score-label">{{ student.latestScore.subject }}</text>
                  <view class="score-badge" :class="student.latestScore.scoreLevel">
                    <text class="score-value">{{ student.latestScore.score }}</text>
                  </view>
                </view>
                <text class="score-date">{{ student.latestScore.formattedDate }}</text>
              </view>
              <view class="no-score" v-else>
                <text class="no-score-text">暂无成绩</text>
              </view>
            </view>
            <view class="student-arrow">›</view>
          </view>
        </view>
        <view v-else class="empty-state">
          <view class="empty-icon">📝</view>
          <text class="empty-title">{{ selectedType === '班级' ? '暂无班级' : '暂无学生' }}</text>
          <text class="empty-desc">{{ selectedType === '班级' ? '您还没有负责的班级' : '请先选择班级查看学生' }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      statusBarHeight: 0,
      students: [],
      leftList: [], // 班课名或年级
      selectedLeft: '',
      userInfo: null,
      classStatusMap: {}, // 记录班课状态和人数
      myClasses: [], // 从班级管理绑定的班级
      allHistoryClasses: [], // 所有历史班级数据
      showMyClasses: false, // 是否显示班级管理的班级
      teacherSubject: '', // 老师的科目
      typeList: ['班级', '学生'],
      selectedType: '班级',
      selectedYear: '当前学年', // 选中的学年
      availableYears: ['当前学年'], // 可选的学年列表
      showYearPickerModal: false // 是否显示学年选择器
    }
  },
  computed: {
    filteredStudents() {
      // 根据选中的学年过滤班级
      let classesToShow = this.myClasses;
      if (this.selectedYear !== '当前学年') {
        classesToShow = this.allHistoryClasses.filter(c => 
          this.getClassYear(c.className) === this.selectedYear
        );
      }
      
      if (this.selectedType === '班级') {
        // 班级tab：显示所有班级，不需要左侧筛选
        return classesToShow.map(myClass => ({
          _id: myClass._id,
          name: myClass.className,
          grade: myClass.grade,
          subject: myClass.subject,
          studentCount: myClass.classStudents ? myClass.classStudents.length : myClass.studentCount || 0,
          isClass: true // 标记这是班级数据
        }));
      } else {
        // 学生tab：显示选中班级的学生
        const selectedClass = classesToShow.find(c => c.className === this.selectedLeft);
        if (selectedClass && selectedClass.classStudents) {
          return selectedClass.classStudents.map(student => {
            return {
              ...student,
              className: selectedClass.className,
              grade: student.grade,
              latestScore: student.latestScore, // 显示最新成绩
              isClass: false // 标记这是学生数据
            };
          });
        }
        return [];
      }
    },
    
    classItems() {
      return this.filteredStudents.filter(item => item.isClass).map(item => ({
        ...item,
        _id: 'class_' + item._id, // 添加前缀避免与学生ID冲突
        classYear: this.getClassYear(item.name) // 添加学年信息
      }));
    },
    
    studentItems() {
      return this.filteredStudents.filter(item => !item.isClass).map(item => ({
        ...item,
        _id: 'student_' + item._id // 添加前缀避免与班级ID冲突
      }));
    }
  },
  onLoad() {
    this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
    this.userInfo = uni.getStorageSync('userInfo');
    this.teacherSubject = this.userInfo.subject || this.userInfo.teacherSubject || '';
    this.loadMyClasses();
  },
  methods: {
    // 根据年级和分数确定颜色等级（与进步分析功能保持一致）
    getScoreColor(grade, score) {
      if (!score || isNaN(score)) return 'score-default';
      
      // 提取年级数字
      const gradeMatch = grade.match(/(\d+)/);
      if (!gradeMatch) return 'score-default';
      
      const gradeNum = parseInt(gradeMatch[1]);
      
      // 1-6年级的评分标准（与进步分析功能一致）
      if (gradeNum >= 1 && gradeNum <= 6) {
        if (score >= 95 && score <= 100) {
          return 'score-green'; // 绿色 - 高分段
        } else if (score >= 90 && score <= 94) {
          return 'score-green'; // 绿色 - 中上分段
        } else if (score >= 60 && score <= 89) {
          return 'score-yellow'; // 黄色 - 中等分段
        } else {
          return 'score-red'; // 红色 - 低分段
        }
      }
      // 7-9年级的评分标准（与进步分析功能一致）
      else if (gradeNum >= 7 && gradeNum <= 9) {
        if (score >= 100 && score <= 120) {
          return 'score-green'; // 绿色 - 高分段
        } else if (score >= 90 && score <= 99) {
          return 'score-green'; // 绿色 - 中上分段
        } else if (score >= 72 && score <= 89) {
          return 'score-yellow'; // 黄色 - 中等分段
        } else {
          return 'score-red'; // 红色 - 低分段
        }
      }
      
      return 'score-default';
    },
    goBack() {
      if (getCurrentPages().length > 1) {
        uni.navigateBack();
      } else {
        uni.switchTab({ url: '/pages/home/home' });
      }
    },
    selectType(type) {
      this.selectedType = type;
      this.updateLeftList(); // 切换tab后更新左侧列表
    },
    selectLeft(item) {
      this.selectedLeft = item;
      // 如果当前是学生tab，需要重新计算学生列表
      if (this.selectedType === '学生') {
        // 强制更新计算属性
        this.$forceUpdate();
      }
    },
    async loadMyStudents() {
      if (!this.userInfo) {
        uni.showToast({ title: '请先登录', icon: 'none' });
        return;
      }
      try {
        uni.showLoading({ title: '加载中...' });
        const result = await uniCloud.callFunction({
          name: 'student-hours',
          data: {
            action: 'getMyStudents',
            teacherId: this.userInfo._id || this.userInfo.uid
          }
        });
        if (result.result.success) {
          this.students = result.result.data || [];
          this.updateLeftList();
        } else {
          uni.showToast({ title: result.result.message || '加载失败', icon: 'none' });
        }
      } catch (error) {
        console.error('加载我的学生失败:', error);
        uni.showToast({ title: '加载失败，请重试', icon: 'none' });
      } finally {
        uni.hideLoading();
      }
    },
    async loadMyClasses() {
      if (!this.userInfo) {
        return;
      }
      try {
        console.log('用户信息:', this.userInfo);
        console.log('用户信息所有字段:', Object.keys(this.userInfo));
        const teacherId = this.userInfo._id || this.userInfo.uid || this.userInfo.id || this.userInfo.teacherId;
        console.log('使用的teacherId:', teacherId);
        
        // 加载当前学年的班级
        const result = await uniCloud.callFunction({
          name: 'class-management',
          data: {
            action: 'getMyClasses',
            teacherId: teacherId
          }
        });
        
        if (result.result.code === 0) {
          this.myClasses = result.result.data || [];
          console.log('加载的班级数据:', this.myClasses);
          console.log('班级数量:', this.myClasses.length);
          
          // 加载历史班级数据
          await this.loadHistoryClasses(teacherId);
          
          // 更新可用学年列表
          this.updateAvailableYears();
          
          this.updateLeftList();
          
          // 调试计算属性
          console.log('filteredStudents:', this.filteredStudents);
          console.log('classItems:', this.classItems);
          if (this.classItems.length > 0) {
            console.log('第一个班级项目:', this.classItems[0]);
          }
        } else {
          console.log('加载班级失败:', result.result.message);
        }
      } catch (error) {
        console.error('加载我的班级失败:', error);
      }
    },
    
    async loadHistoryClasses(teacherId) {
      try {
        const result = await uniCloud.callFunction({
          name: 'class-management',
          data: {
            action: 'getHistoryClasses',
            teacherId: teacherId
          }
        });
        
        if (result.result.code === 0) {
          this.allHistoryClasses = result.result.data || [];
          console.log('加载的历史班级数据:', this.allHistoryClasses);
        }
      } catch (error) {
        console.error('加载历史班级失败:', error);
      }
    },
    
    updateAvailableYears() {
      const years = new Set(['当前学年']);
      
      // 从当前班级中提取学年
      this.myClasses.forEach(cls => {
        const year = this.getClassYear(cls.className);
        if (year) years.add(year);
      });
      
      // 从历史班级中提取学年
      this.allHistoryClasses.forEach(cls => {
        const year = this.getClassYear(cls.className);
        if (year) years.add(year);
      });
      
      this.availableYears = Array.from(years).sort((a, b) => {
        if (a === '当前学年') return -1;
        if (b === '当前学年') return 1;
        return b.localeCompare(a); // 降序排列
      });
    },
    
    
    showYearPicker() {
      uni.showActionSheet({
        itemList: this.availableYears,
        success: (res) => {
          this.selectedYear = this.availableYears[res.tapIndex];
          this.updateLeftList();
        }
      });
    },
    
    getClassYear(className) {
      // 从班级名称中提取学年，如 "25秋三年级数学龙班" -> "25秋"
      const match = className.match(/^(\d{2}[春秋])/);
      return match ? match[1] : '';
    },
    
    updateLeftList() {
      this.leftList = [];
      this.classStatusMap = {};
      this.selectedLeft = ''; // 默认清空选中项

      if (this.selectedType === '班级') {
        // 班级tab：左侧列表为空，不需要显示内容
        console.log('班级tab：左侧列表为空');
        // 右侧将显示所有班级，不需要左侧筛选
      } else if (this.selectedType === '学生') {
        // 学生tab：左侧显示班级列表
        const classNames = this.myClasses.map(c => c.className);
        this.leftList = [...new Set(classNames)]; // 确保班级名称唯一

        console.log('学生tab：更新左侧列表:', this.leftList);

        // 统计每个班级的学生数量
        this.myClasses.forEach(myClass => {
          this.classStatusMap[myClass.className] = {
            total: myClass.classStudents.length,
            inRead: myClass.classStudents.length,
            isOver: false,
            isMyClass: true
          };
        });

        // 默认选中第一个班级
        if (this.leftList.length > 0) {
          this.selectedLeft = this.leftList[0];
        }
        console.log('学生tab：选中的班级:', this.selectedLeft);
      }
    },
    showStudentDetail(item) {
      if (item.isClass) {
        // 如果是班级，切换到学生tab并选择该班级
        console.log('点击班级，切换到学生视图:', item.name);
        this.selectedType = '学生';
        this.selectedLeft = item.name;
        this.updateLeftList();
      } else {
        // 如果是学生，显示学生详情
        const content = `姓名：${item.name}\n年级：${item.grade}\n学号：${item.studentId}${item.latestScore ? `\n最近成绩：${item.latestScore.score}分（${item.latestScore.subject}）\n考试日期：${item.latestScore.examDate}` : ''}`;
        uni.showModal({
          title: '学生详情',
          content: content,
          showCancel: false,
          confirmText: '确定'
        });
      }
    }
  }
}
</script>

<style scoped>
.custom-navbar {
  display: flex;
  align-items: center;
  height: 88rpx;
  background: #fff;
  position: relative;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.03);
}

.back-btn, .navbar-placeholder {
  width: 120rpx;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 100%;
  padding: 0 16rpx 0 8rpx;
  box-sizing: border-box;
}

.navbar-title-wrap {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.navbar-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #222;
  text-align: center;
  width: 100%;
}

.back-btn {
  position: absolute;
  top: 22px;
  left: 16rpx;
  z-index: 10;
  background: #edeaff;
  border: 2rpx solid #a18fff;
  border-radius: 50%;
  width: 64rpx;
  height: 64rpx;
  box-shadow: 0 2rpx 8rpx #b3aaff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}
.back-icon {
  width: 44rpx;
  height: 44rpx;
  display: block;
}

.back-text {
  font-size: 28rpx;
  color: #333;
}


.control-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20rpx;
  gap: 20rpx;
}

.type-tabs {
  display: flex;
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
  flex: 1;
}
.type-tab {
  flex: 1;
  text-align: center;
  padding: 24rpx 0;
  font-size: 28rpx;
  color: #666;
  background: #fff;
  transition: all 0.3s;
  cursor: pointer;
}
.type-tab.active {
  background: #4FC3F7;
  color: #fff;
  font-weight: 500;
}

.year-selector {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
  min-width: 160rpx;
  justify-content: center;
  gap: 8rpx;
}
.year-text {
  font-size: 26rpx;
  color: #333;
  font-weight: 500;
}
.dropdown-arrow {
  font-size: 20rpx;
  color: #999;
}
.main-container {
  display: flex;
  flex-direction: row;
  min-height: 80vh;
  background: #f8f8f8;
}

.main-container:not(:has(.sidebar)) .student-panel {
  width: 100%;
}
.sidebar {
  width: 180rpx;
  background: #fff;
  border-radius: 16rpx;
  margin-right: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
  padding: 16rpx 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-width: 150rpx;
}
.side-item {
  padding: 16rpx 12rpx;
  text-align: left;
  font-size: 22rpx;
  color: #333;
  cursor: pointer;
  border-left: 6rpx solid transparent;
  transition: all 0.2s;
  line-height: 1.3;
  white-space: normal;
  overflow: hidden;
  word-wrap: break-word;
  min-height: 70rpx;
  display: flex;
  align-items: center;
}
.side-item.active {
  background: #e3f2fd;
  color: #1976D2;
  border-left: 6rpx solid #1976D2;
  font-weight: bold;
}
.student-panel {
  flex: 1;
  min-width: 0;
}
.student-list {
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
}
.student-item {
  display: flex;
  align-items: center;
  padding: 32rpx 24rpx;
  border-bottom: 1rpx solid #f0f0f0;
  transition: all 0.3s ease;
  background: #fff;
  margin-bottom: 12rpx;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
  min-height: 120rpx;
}
.student-item:last-child {
  border-bottom: none;
}
.student-item:active {
  background-color: #f8f8f8;
}
.student-info {
  flex: 1;
}
.student-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 16rpx;
  line-height: 1.3;
}
.student-details {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-bottom: 12rpx;
  min-height: 60rpx;
  align-items: center;
}
.grade, .subject, .class-name {
  font-size: 24rpx;
  color: #666;
  background: linear-gradient(135deg, #f5f5f5, #e8e8e8);
  padding: 6rpx 14rpx;
  border-radius: 14rpx;
  font-weight: 500;
}
.class-name {
  color: #4CAF50;
  background: #e8f5e8;
}
.student-meta {
  display: flex;
  flex-wrap: nowrap;
  gap: 12rpx;
  margin-bottom: 8rpx;
  align-items: baseline;
  overflow-x: auto;
}
.hours {
  font-size: 24rpx;
  color: #4FC3F7;
  font-weight: 500;
}
.entrance-score {
  font-size: 24rpx;
  color: #FF9800;
}
.operator-name.colored {
  font-size: 24rpx;
  color: #67c23a;
  font-weight: 500;
  margin-left: 16rpx;
}
.remark {
  font-size: 24rpx;
  color: #999;
  line-height: 1.4;
}
.student-arrow {
  font-size: 32rpx;
  color: #ccc;
  margin-left: 20rpx;
}
.empty-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 400rpx;
  background: linear-gradient(135deg, #fff, #f8f9fa);
  border-radius: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
  border: 2rpx dashed #e0e0e0;
}
.empty-text {
  font-size: 28rpx;
  color: #999;
  font-weight: 500;
}
.student-item.student-over {
  color: #bbb !important;
  background: #f5f5f5;
  position: relative;
  overflow: hidden;
}
.watermark-bg {
  pointer-events: none;
  position: absolute;
  left: 0; top: 0; right: 0; bottom: 0;
  z-index: 1;
}
.watermark-text {
  position: absolute;
  top: 50%;
  transform: translateY(-50%) rotate(-25deg);
  color: #d32f2f;
  font-size: 36rpx;
  font-weight: bold;
  opacity: 0.35;
  white-space: nowrap;
  pointer-events: none;
  user-select: none;
}
.watermark-left {
  left: 18rpx;
}
.watermark-center {
  left: 50%;
  transform: translate(-50%, -50%) rotate(-25deg);
}
.watermark-right {
  right: 18rpx;
}
.date-row {
  font-size: 24rpx;
  margin: 2rpx 0 2rpx 0;
}
.date-row.start {
  color: #2196f3;
}
.date-row.end {
  color: #f44336;
}
.course-remark-show {
  color: #888;
  font-size: 22rpx;
  margin: 2rpx 0 8rpx 0;
  line-height: 1.4;
}

.student-id {
  font-size: 24rpx;
  color: #666;
  background: linear-gradient(135deg, #f0f0f0, #e0e0e0);
  padding: 6rpx 14rpx;
  border-radius: 14rpx;
  margin-left: 12rpx;
  font-weight: 500;
}

.score-info {
  margin-top: 16rpx;
  padding: 12rpx 16rpx;
  background: linear-gradient(135deg, #f8f9fa, #e3f2fd);
  border-radius: 12rpx;
  border-left: 4rpx solid #4FC3F7;
  box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
}

.score-label {
  font-size: 24rpx;
  color: #666;
  margin-right: 8rpx;
  font-weight: 500;
}

.score-value {
  font-size: 30rpx;
  color: #4FC3F7;
  font-weight: 700;
  margin-right: 8rpx;
}

/* 分数颜色等级样式 */
.score-green {
  color: #4CAF50 !important;
  background: rgba(76, 175, 80, 0.1);
  padding: 4rpx 8rpx;
  border-radius: 8rpx;
  border: 1rpx solid rgba(76, 175, 80, 0.3);
}

.score-yellow {
  color: #FF9800 !important;
  background: rgba(255, 152, 0, 0.1);
  padding: 4rpx 8rpx;
  border-radius: 8rpx;
  border: 1rpx solid rgba(255, 152, 0, 0.3);
}

.score-red {
  color: #F44336 !important;
  background: rgba(244, 67, 54, 0.1);
  padding: 4rpx 8rpx;
  border-radius: 8rpx;
  border: 1rpx solid rgba(244, 67, 54, 0.3);
}

.score-default {
  color: #4FC3F7 !important;
}

.score-subject {
  font-size: 22rpx;
  color: #999;
  margin-right: 12rpx;
}

.score-date {
  font-size: 22rpx;
  color: #999;
}

.class-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 16rpx 0;
  min-height: 80rpx;
}

.class-name {
  font-size: 30rpx;
  color: #333;
  font-weight: 600;
  flex: 1;
  line-height: 1.3;
}

.class-grade {
  font-size: 24rpx;
  color: #666;
  background: linear-gradient(135deg, #f0f0f0, #e8e8e8);
  padding: 6rpx 16rpx;
  border-radius: 16rpx;
  margin: 0 16rpx;
  font-weight: 500;
}

.class-count {
  font-size: 26rpx;
  color: #4FC3F7;
  font-weight: 700;
  background: rgba(79, 195, 247, 0.1);
  padding: 6rpx 12rpx;
  border-radius: 12rpx;
}

.student-meta {
  display: flex;
  align-items: center;
  margin-top: 8rpx;
}
/* 新的卡片样式 */
.content-panel {
  flex: 1;
  padding: 20rpx;
  background: #f8f8f8;
  overflow-y: auto;
}

.content-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

/* 班级卡片样式 */
.class-card {
  background: #fff;
  border: 2rpx solid #e8f4fd;
  border-radius: 20rpx;
  padding: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.class-card:active {
  transform: translateY(-4rpx);
  box-shadow: 0 12rpx 32rpx rgba(102, 126, 234, 0.4);
}

.class-header {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}

.class-icon {
  font-size: 40rpx;
  margin-right: 16rpx;
}

.class-info {
  flex: 1;
  z-index: 10;
  position: relative;
}

.class-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333 !important;
  display: block;
  margin-bottom: 4rpx;
  z-index: 10;
  position: relative;
}

.class-meta {
  font-size: 24rpx;
  color: #666;
}

.class-stats {
  display: flex;
  align-items: baseline;
  gap: 4rpx;
}

.student-count {
  font-size: 36rpx;
  font-weight: bold;
  color: #409eff;
}

.count-label {
  font-size: 24rpx;
  color: #999;
}

.class-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.class-year {
  font-size: 22rpx;
  color: #409eff;
  background: #e8f4fd;
  padding: 8rpx 16rpx;
  border-radius: 12rpx;
}

.class-arrow {
  font-size: 32rpx;
  color: #999;
}

/* 学生卡片样式 */
.student-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 20rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;
}

.student-card:active {
  transform: scale(0.98);
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.12);
}

.student-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #4FC3F7 0%, #29B6F6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.avatar-text {
  font-size: 32rpx;
  font-weight: bold;
  color: #fff;
}

.student-content {
  flex: 1;
  min-width: 0;
}

.student-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8rpx;
}

.student-name {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.student-id {
  font-size: 22rpx;
  color: #999;
  background: #f5f5f5;
  padding: 4rpx 8rpx;
  border-radius: 8rpx;
}

.student-meta {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 12rpx;
}

.student-grade {
  font-size: 24rpx;
  color: #666;
  background: #e3f2fd;
  padding: 4rpx 12rpx;
  border-radius: 12rpx;
}

.student-class {
  font-size: 24rpx;
  color: #666;
}

.score-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.score-item {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.score-label {
  font-size: 22rpx;
  color: #666;
}

.score-badge {
  padding: 6rpx 12rpx;
  border-radius: 12rpx;
  font-weight: bold;
}

.score-badge.excellent {
  background: #e8f5e8;
  color: #4caf50;
}

.score-badge.good {
  background: #e3f2fd;
  color: #2196f3;
}

.score-badge.average {
  background: #fff3e0;
  color: #ff9800;
}

.score-badge.pass {
  background: #fce4ec;
  color: #e91e63;
}

.score-badge.fail {
  background: #ffebee;
  color: #f44336;
}

.score-value {
  font-size: 24rpx;
}

.score-date {
  font-size: 20rpx;
  color: #999;
}

.no-score {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12rpx 0;
}

.no-score-text {
  font-size: 22rpx;
  color: #ccc;
}

.student-arrow {
  font-size: 32rpx;
  color: #ddd;
  margin-left: 16rpx;
}

/* 空状态样式 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 40rpx;
  text-align: center;
}

.empty-icon {
  font-size: 120rpx;
  margin-bottom: 24rpx;
  opacity: 0.3;
}

.empty-title {
  font-size: 32rpx;
  color: #666;
  margin-bottom: 12rpx;
  font-weight: 500;
}

.empty-desc {
  font-size: 26rpx;
  color: #999;
  line-height: 1.5;
}
</style> 