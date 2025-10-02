<template>
  <view class="container">
    <!-- 自定义导航栏 -->
    <view class="custom-navbar">
      <view class="navbar-content">
        <view class="navbar-left" @click="goBack">
          <text class="back-icon">‹</text>
          <text class="back-text">返回</text>
        </view>
        <text class="navbar-title">学生学术档案</text>
        <view class="navbar-right"></view>
      </view>
    </view>
    
    <view class="header" v-if="studentInfo">
      <view class="student-basic-info">
        <view class="avatar">
          <text class="avatar-text">{{ studentInfo.name.charAt(0) }}</text>
        </view>
        <view class="info">
          <text class="name">{{ studentInfo.name }}</text>
          <text class="id">学号：{{ studentInfo.studentId }}</text>
          <text class="grade">年级：{{ studentInfo.grade }}</text>
          <text v-if="studentInfo.classes && studentInfo.classes.length > 0" class="classes">班级：{{ studentInfo.classes.map(c => c.className).join('、') }}</text>
        </view>
      </view>
    </view>
    
    <view class="tabs">
      <view 
        class="tab" 
        :class="{ active: activeTab === 'courses' }"
        @click="switchTab('courses')"
      >
        学习课程
      </view>
      <view 
        class="tab" 
        :class="{ active: activeTab === 'scores' }"
        @click="switchTab('scores')"
      >
        考试成绩
      </view>
    </view>
    
    <!-- 学习课程列表 -->
    <view v-if="activeTab === 'courses'" class="content">
      <view v-if="courses.length === 0" class="empty-state">
        <text class="empty-text">暂无课程记录</text>
      </view>
      
      <view v-else class="course-list">
        <view 
          v-for="(course, index) in courses" 
          :key="index"
          class="course-item"
        >
          <view class="course-header">
            <text class="course-name">{{ course.courseName }}</text>
            <text class="course-year">{{ course.year }} {{ course.semester }}</text>
          </view>
          <view class="course-details">
            <text class="status">状态：{{ course.status }}</text>
            <text class="enroll-date">入学时间：{{ formatDate(course.enroll_date) }}</text>
            <text v-if="course.completion_date" class="completion-date">结业时间：{{ formatDate(course.completion_date) }}</text>
            <!-- 显示班级信息 -->
            <text v-if="course.className" class="class-info">班级：{{ course.className }}</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 考试成绩列表 -->
    <view v-if="activeTab === 'scores'" class="content">
      <view v-if="scores.length === 0" class="empty-state">
        <text class="empty-text">暂无成绩记录</text>
      </view>
      
      <view v-else class="score-list">
        <view 
          v-for="(score, index) in scores" 
          :key="index"
          class="score-item"
        >
          <view class="score-header">
            <text class="course-name">{{ score.courseName }}</text>
            <text class="exam-name">{{ score.exam_name }}</text>
          </view>
          <view class="score-details">
            <text class="score-value">成绩：{{ score.score }}分</text>
            <text class="exam-date">考试时间：{{ formatDate(score.exam_date) }}</text>
            <text v-if="score.remark" class="remark">备注：{{ score.remark }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      studentId: '',
      studentInfo: null,
      courses: [],
      scores: [],
      activeTab: 'courses'
    }
  },
  onLoad(options) {
    if (options.studentId) {
      this.studentId = options.studentId;
      this.loadStudentAcademicRecord();
    }
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    switchTab(tab) {
      this.activeTab = tab;
    },
    async loadStudentAcademicRecord() {
      try {
        // 获取学生基本信息
        const studentResult = await uniCloud.callFunction({
          name: 'archive-manager',
          data: {
            action: 'getStudentDetail',
            studentId: this.studentId
          }
        });
        
        if (studentResult.result.code === 0) {
          this.studentInfo = studentResult.result.data;
        }
        
        // 获取学生学术档案
        const academicResult = await uniCloud.callFunction({
          name: 'archive-manager',
          data: {
            action: 'getStudentAcademicRecords',
            studentId: this.studentId
          }
        });
        
        if (academicResult.result.code === 0) {
          this.courses = academicResult.result.data.courses || [];
          this.scores = academicResult.result.data.scores || [];
        }
      } catch (error) {
        console.error('加载学生学术档案失败:', error);
        uni.showToast({
          title: '加载失败',
          icon: 'error'
        });
      }
    },
    formatDate(date) {
      if (!date) return '';
      return new Date(date).toLocaleDateString();
    }
  }
}
</script>

<style scoped>
.container {
  padding: 20rpx;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4edf9 100%);
  min-height: 100vh;
  padding-top: 120rpx;
}

/* 自定义导航栏样式 */
.custom-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background: rgba(255, 255, 255, 0.95);
  border-bottom: 1rpx solid #e5e5e5;
  backdrop-filter: blur(10rpx);
  box-shadow: 0 2rpx 20rpx rgba(0, 0, 0, 0.05);
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
  padding: 0 30rpx;
  padding-top: var(--status-bar-height, 0);
}

.navbar-left {
  display: flex;
  align-items: center;
  padding: 10rpx 0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.navbar-left:active {
  transform: translateX(-5rpx);
}

.back-icon {
  font-size: 40rpx;
  color: #1976D2;
  margin-right: 8rpx;
  font-weight: bold;
}

.back-text {
  font-size: 28rpx;
  color: #1976D2;
  font-weight: 500;
}

.navbar-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #1976D2;
  background: linear-gradient(135deg, #1976D2 0%, #4FC3F7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.navbar-right {
  width: 100rpx;
}

/* 学生基本信息 */
.header {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(10rpx);
  border: 1rpx solid rgba(25, 118, 210, 0.1);
  transition: all 0.3s ease;
}

.header:hover {
  box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.12);
  transform: translateY(-2rpx);
}

.student-basic-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #4FC3F7 0%, #1976D2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(79, 195, 247, 0.3);
}

.avatar-text {
  font-size: 40rpx;
  color: #fff;
  font-weight: bold;
}

.info {
  flex: 1;
}

.name {
  font-size: 32rpx;
  font-weight: bold;
  color: #1976D2;
  display: block;
  margin-bottom: 10rpx;
}

.id,
.grade,
.classes {
  font-size: 26rpx;
  color: #666;
  display: block;
  margin-bottom: 5rpx;
}

.classes {
  color: #9C27B0;
  font-weight: 500;
}

/* 标签页 */
.tabs {
  display: flex;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16rpx;
  overflow: hidden;
  margin-bottom: 20rpx;
  box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(10rpx);
  border: 1rpx solid rgba(25, 118, 210, 0.1);
}

.tab {
  flex: 1;
  text-align: center;
  padding: 25rpx 0;
  font-size: 28rpx;
  color: #1976D2;
  background: rgba(248, 250, 255, 0.7);
  transition: all 0.3s ease;
  font-weight: 500;
  cursor: pointer;
}

.tab:active {
  background: rgba(230, 240, 255, 0.9);
}

.tab.active {
  background: linear-gradient(135deg, #1976D2 0%, #4FC3F7 100%);
  color: #fff;
  font-weight: bold;
  box-shadow: 0 4rpx 12rpx rgba(25, 118, 210, 0.2);
}

/* 内容区域 */
.content {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(10rpx);
  border: 1rpx solid rgba(25, 118, 210, 0.1);
}

/* 课程列表 */
.course-list,
.score-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.course-item,
.score-item {
  padding: 20rpx;
  border: 1rpx solid rgba(25, 118, 210, 0.2);
  border-radius: 12rpx;
  background: rgba(248, 250, 255, 0.7);
  transition: all 0.3s ease;
}

.course-item:hover,
.score-item:hover {
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  transform: translateY(-2rpx);
}

.course-header,
.score-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15rpx;
  padding-bottom: 10rpx;
  border-bottom: 1rpx solid rgba(25, 118, 210, 0.1);
}

.course-name,
.exam-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #1976D2;
}

.course-year {
  font-size: 24rpx;
  color: #4FC3F7;
  background: linear-gradient(135deg, #f0f8ff 0%, #e3f2fd 100%);
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
  font-weight: 500;
}

.course-details,
.score-details {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.status,
.enroll-date,
.completion-date,
.score-value,
.exam-date,
.remark,
.class-info,
.subject-info {
  font-size: 24rpx;
  color: #666;
}

.score-value {
  font-weight: bold;
  color: #4FC3F7;
}

.class-info {
  color: #9C27B0;
  font-weight: 500;
}

.subject-info {
  color: #1976D2;
  font-weight: 500;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60rpx 0;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}
</style>