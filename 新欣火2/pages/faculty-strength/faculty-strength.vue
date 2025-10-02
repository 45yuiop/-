<template>
  <view class="faculty-container">
    <!-- 顶部导航栏 -->
    <view class="top-nav">
      <!-- 返回按钮 -->
      <view class="back-button" @click="goBack">
        <view class="back-icon-container">
          <text class="back-icon-text">🏠</text>
        </view>
      </view>
      
      <!-- 搜索栏 -->
      <view class="search-bar">
        <image class="search-logo" src="/static/b3318194914f809af324de8884bd906(1).png" mode="aspectFit" />
        <input 
          class="search-input" 
          v-model="searchText" 
          placeholder="搜索教师姓名或专业" 
          placeholder-class="search-placeholder"
          @input="filterTeachers"
        />
      </view>
    </view>
    
    <!-- 筛选标签 -->
    <view class="filter-tabs">
      <view 
        class="filter-tab" 
        :class="{ active: activeFilter === 'all' }"
        @click="setFilter('all')"
      >
        全部
      </view>
      <view 
        class="filter-tab" 
        :class="{ active: activeFilter === 'math' }"
        @click="setFilter('math')"
      >
        数学
      </view>
      <view 
        class="filter-tab" 
        :class="{ active: activeFilter === 'chinese' }"
        @click="setFilter('chinese')"
      >
        语文
      </view>
      <view 
        class="filter-tab" 
        :class="{ active: activeFilter === 'english' }"
        @click="setFilter('english')"
      >
        英语
      </view>
      <view 
        class="filter-tab" 
        :class="{ active: activeFilter === 'physics' }"
        @click="setFilter('physics')"
      >
        物理
      </view>
      <view 
        class="filter-tab" 
        :class="{ active: activeFilter === 'chemistry' }"
        @click="setFilter('chemistry')"
      >
        化学
      </view>
    </view>
    
              <!-- 教师卡片滑动区域 -->
          <view class="teacher-swiper-container">
            <swiper 
              class="teacher-swiper" 
              :indicator-dots="true" 
              :autoplay="true" 
              :interval="3000"
              :duration="500"
              :circular="true"
              indicator-color="rgba(255,255,255,0.3)"
              indicator-active-color="#1976D2"
            >
              <swiper-item v-for="teacher in filteredTeachers" :key="teacher.id">
                <view class="teacher-card-swiper" @click="showTeacherDetail(teacher)">
                  <!-- 卡片背景装饰 -->
                  <view class="card-decoration">
                    <view class="decoration-circle circle-1"></view>
                    <view class="decoration-circle circle-2"></view>
                    <view class="decoration-circle circle-3"></view>
                  </view>
                  
                  <!-- 教师海报图片 -->
                  <view class="teacher-poster">
                    <image :src="teacher.poster || '/static/111.png'" mode="aspectFill" class="poster-image" />
                  </view>
                  
                  <!-- 教师基本信息卡片 -->
                  <view class="teacher-basic-card">
                    <view class="avatar-container">
                      <image :src="teacher.avatar" mode="aspectFill" class="teacher-avatar" />
                      <view class="avatar-border"></view>
                    </view>
                    <view class="teacher-basic-info">
                      <view class="teacher-name">{{ teacher.name }}</view>
                      <view class="teacher-title">{{ teacher.title }}</view>
                      <view class="teacher-experience">
                        <text class="experience-icon">📚</text>
                        <text>{{ teacher.experience }}年教龄</text>
                      </view>
                    </view>
                    <view class="subject-badge">{{ teacher.subject }}</view>
                  </view>
                  
                  <!-- 教师详细信息 -->
                  <view class="teacher-details-section">
                    <view class="detail-section">
                      <text class="card-section-title">教育背景</text>
                      <text class="card-section-content">{{ teacher.education }}</text>
                    </view>
                    <view class="detail-section">
                      <text class="card-section-title">专业特长</text>
                      <text class="card-section-content">{{ teacher.specialties }}</text>
                    </view>
                    <view class="detail-section">
                      <text class="card-section-title">教学成果</text>
                      <text class="card-section-content">{{ teacher.achievements }}</text>
                    </view>
                    <view class="detail-section">
                      <text class="card-section-title">教学理念</text>
                      <text class="card-section-content">{{ teacher.philosophy }}</text>
                    </view>
                  </view>
                  
                  <!-- 统计数据区域 -->
                  <view class="teacher-stats-section">
                    <view class="stat-card">
                      <view class="stat-icon">👥</view>
                      <view class="stat-content">
                        <text class="stat-number">带过{{ teacher.students }}位学生</text>
                      </view>
                    </view>
                    <view class="stat-card">
                      <view class="stat-icon">📈</view>
                      <view class="stat-content">
                        <text class="stat-number">{{ teacher.improvementRate || '12%' }}</text>
                        <text class="stat-label">平均提分率</text>
                      </view>
                    </view>
                  </view>
                  
                  <!-- 查看详情按钮 -->
                  <view class="detail-button">
                    <text class="detail-text">查看详情</text>
                    <text class="detail-arrow">→</text>
                  </view>
                </view>
              </swiper-item>
            </swiper>
          </view>
    
    <!-- 联系我们按钮 -->
    <view class="contact-section">
      <view class="contact-button" @click="contactUs">
        <view class="contact-icon">📞</view>
        <text class="contact-text">联系我们</text>
      </view>
    </view>
    
    <!-- 教师详情弹窗 -->
    <view class="modal-overlay" v-if="showModal" @click="closeModal">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <view class="modal-title-container">
            <text class="modal-title">教师详情</text>
          </view>
          <text class="modal-close" @click="closeModal">×</text>
        </view>
        <view class="modal-body" v-if="selectedTeacher">
          <!-- 教师基本信息卡片 -->
          <view class="teacher-info-card">
            <view class="detail-avatar">
              <image :src="selectedTeacher.avatar" mode="aspectFill" />
            </view>
            <view class="detail-info">
              <view class="detail-name">{{ selectedTeacher.name }}</view>
              <view class="detail-subject">{{ selectedTeacher.subject }}</view>
              <view class="detail-title">{{ selectedTeacher.title }}</view>
              <view class="detail-experience">
                <text class="experience-icon">📚</text>
                <text>{{ selectedTeacher.experience }}年教龄</text>
              </view>
            </view>
          </view>
          
          <!-- 教师详细信息 -->
          <view class="detail-description">
            <view class="detail-section">
              <text class="section-title">教育背景</text>
              <text class="section-content">{{ selectedTeacher.education }}</text>
            </view>
            <view class="detail-section">
              <text class="section-title">专业特长</text>
              <text class="section-content">{{ selectedTeacher.specialties }}</text>
            </view>
            <view class="detail-section">
              <text class="section-title">教学成果</text>
              <text class="section-content">{{ selectedTeacher.achievements }}</text>
            </view>
            <view class="detail-section">
              <text class="section-title">教学理念</text>
              <text class="section-content">{{ selectedTeacher.philosophy }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 在template合适位置添加自定义弹窗 -->
    <view v-if="showContactModal" class="custom-modal-mask">
      <view class="custom-modal">
        <view class="custom-modal-title">联系我们</view>
        <view class="custom-modal-content">
          <view class="contact-item" @click="copyText('18062119276')">电话：18062119276</view>
          <view class="contact-item" @click="copyText('18062119276')">微信：18062119276</view>
          <view class="contact-item" @click="copyText('18062119276@163.com')">邮箱：18062119276@163.com</view>
          <view class="contact-item" @click="copyText('江夏区当代国际城乐荟街2楼和3楼新欣火咨询')">地址：江夏区当代国际城乐荟街2楼和3楼新欣火咨询</view>
        </view>
        <view class="custom-modal-btn" @click="showContactModal=false">确定</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      searchText: '',
      activeFilter: 'all',
      showModal: false,
      selectedTeacher: null,
      teachers: [
        {
          id: 1,
          name: '张老师',
          subject: '数学',
          title: '高级教师',
          experience: 8,
          avatar: '/static/0.jpg',
          students: 156,
          improvementRate: '15%',
          poster: '',
          education: '北京师范大学数学系本科毕业，具有扎实的数学理论基础',
          specialties: '高中数学教学，奥数竞赛辅导，数学思维训练',
          achievements: '所教学生多次在市级数学竞赛中获奖，高考数学平均分135分',
          philosophy: '注重培养学生的数学思维，让数学变得有趣易懂'
        },
        {
          id: 2,
          name: '李老师',
          subject: '语文',
          title: '特级教师',
          experience: 15,
          avatar: '/static/0.jpg',
          students: 203,
          improvementRate: '18%',
          poster: '/static/0.jpg',
          education: '华东师范大学中文系硕士毕业，具有丰富的教学经验',
          specialties: '高中语文教学，作文指导，文学鉴赏',
          achievements: '多次获得市级优秀教师称号，学生作文多次在省级比赛中获奖',
          philosophy: '培养学生的文学素养，让语文学习充满诗意'
        },
        {
          id: 3,
          name: '王老师',
          subject: '英语',
          title: '高级教师',
          experience: 10,
          avatar: '/static/0.jpg',
          students: 178,
          improvementRate: '12%',
          poster: '/static/0.jpg',
          education: '北京外国语大学英语系毕业，具有海外留学经历',
          specialties: '高中英语教学，口语训练，英语写作',
          achievements: '学生英语口语水平显著提升，多人获得英语竞赛奖项',
          philosophy: '营造英语学习环境，让英语成为学生的第二语言'
        },
        {
          id: 4,
          name: '陈老师',
          subject: '物理',
          title: '高级教师',
          experience: 12,
          avatar: '/static/0.jpg',
          students: 134,
          improvementRate: '20%',
          poster: '/static/0.jpg',
          education: '清华大学物理系毕业，具有深厚的物理学科背景',
          specialties: '高中物理教学，实验教学，物理竞赛辅导',
          achievements: '学生物理成绩稳步提升，多人考入重点大学物理系',
          philosophy: '理论与实践相结合，让物理知识生动有趣'
        },
        {
          id: 5,
          name: '刘老师',
          subject: '化学',
          title: '高级教师',
          experience: 9,
          avatar: '/static/0.jpg',  
          students: 145,
          improvementRate: '16%',
          poster: '/static/0.jpg',
          education: '北京大学化学系毕业，具有丰富的实验教学经验',
          specialties: '高中化学教学，实验操作，化学竞赛',
          achievements: '学生化学实验能力突出，多人获得化学竞赛奖项',
          philosophy: '通过实验培养学生的科学探究精神'
        },
        
      ],
      filteredTeachers: [],
      showContactModal: false,
    }
  },
  created() {
    this.filteredTeachers = [...this.teachers];
  },
  methods: {
    filterTeachers() {
      let filtered = this.teachers;
      
      // 按专业筛选
      if (this.activeFilter !== 'all') {
        const subjectMap = {
          'math': '数学',
          'chinese': '语文',
          'english': '英语',
          'physics': '物理',
          'chemistry': '化学'
        };
        filtered = filtered.filter(teacher => teacher.subject === subjectMap[this.activeFilter]);
      }
      
      // 按搜索文本筛选
      if (this.searchText) {
        filtered = filtered.filter(teacher => 
          teacher.name.includes(this.searchText) || 
          teacher.subject.includes(this.searchText) ||
          teacher.specialties.includes(this.searchText)
        );
      }
      
      this.filteredTeachers = filtered;
    },
    setFilter(filter) {
      this.activeFilter = filter;
      this.filterTeachers();
    },
    showTeacherDetail(teacher) {
      this.selectedTeacher = teacher;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.selectedTeacher = null;
    },
            goBack() {
          uni.navigateBack({
            delta: 1
          });
        },
        contactUs() {
          this.showContactModal = true;
        },
        copyText(text) {
          uni.setClipboardData({
            data: text,
            success: function () {
              uni.showToast({
                title: '复制成功',
                icon: 'none'
              });
            },
            fail: function () {
              uni.showToast({
                title: '复制失败',
                icon: 'none'
              });
            }
          });
        }
  }
}
</script>

<style scoped>
.faculty-container {
  padding: 65rpx 20rpx 20rpx 20rpx;
  background: #f8f8f8;
  min-height: 100vh;
}

.top-nav {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 32rpx;
  padding-top: 20rpx;
}

.back-button {
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.back-button:active {
  transform: scale(0.95);
}

.back-icon-container {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;
}

.back-icon-container::before {
  content: '';
  position: absolute;
  top: -2rpx;
  left: -2rpx;
  right: -2rpx;
  bottom: -2rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  z-index: -1;
  opacity: 0.3;
  filter: blur(8rpx);
}

.back-icon-text {
  font-size: 32rpx;
  color: #fff;
}

.search-bar {
  display: flex;
  align-items: center;
  background: #e5ecef;
  border-radius: 32rpx;
  padding: 10rpx 20rpx;
  flex: 1;
}

.search-logo {
  width: 48rpx;
  height: 48rpx;
  margin-right: 16rpx;
  border-radius: 50%;
  background: #fff;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 28rpx;
  color: #333;
  height: 48rpx;
}

.search-placeholder {
  color: #bfc9d1;
  font-size: 28rpx;
}

.filter-tabs {
  display: flex;
  margin-bottom: 32rpx;
  background: #fff;
  border-radius: 16rpx;
  padding: 8rpx;
}

.filter-tab {
  flex: 1;
  text-align: center;
  padding: 16rpx 0;
  font-size: 28rpx;
  color: #666;
  border-radius: 12rpx;
  transition: all 0.3s;
}

.filter-tab.active {
  background: #1976D2;
  color: #fff;
}

.teacher-swiper-container {
  margin-top: 20rpx;
  height: 70vh;
}

.teacher-swiper {
  height: 100% !important;
  width: 100% !important;
}

.teacher-swiper .uni-swiper-item {
  height: 100% !important;
  width: 100% !important;
}

.teacher-card-swiper {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24rpx;
  padding: 40rpx;
  margin: 20rpx;
  height: 85%;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20rpx 40rpx rgba(102, 126, 234, 0.3);
  display: flex;
  flex-direction: column;
}

.card-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.circle-1 {
  width: 120rpx;
  height: 120rpx;
  top: -60rpx;
  right: -60rpx;
}

.circle-2 {
  width: 80rpx;
  height: 80rpx;
  bottom: 40rpx;
  left: -40rpx;
}

.circle-3 {
  width: 60rpx;
  height: 60rpx;
  top: 50%;
  right: 20rpx;
}

.teacher-poster {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  pointer-events: none;
}

.poster-image {
  width: 100%;
  height: 100%;
  border-radius: 24rpx;
  opacity: 0.15;
  object-fit: cover;
}

.teacher-basic-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 0 0 20rpx 20rpx;
  padding: 24rpx;
  margin-bottom: 0rpx;
  margin-top: 0;
  display: flex;
  align-items: center;
  gap: 20rpx;
  position: relative;
  z-index: 2;
  box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.2);
}

.avatar-container {
  position: relative;
}

.teacher-avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  border: 4rpx solid rgba(255, 255, 255, 0.3);
}

.avatar-border {
  position: absolute;
  top: -4rpx;
  left: -4rpx;
  right: -4rpx;
  bottom: -4rpx;
  border-radius: 60rpx;
  background: linear-gradient(45deg, #fff, transparent);
  opacity: 0.5;
}

.subject-badge {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 6rpx 12rpx;
  border-radius: 16rpx;
  font-size: 20rpx;
  font-weight: bold;
  backdrop-filter: blur(10rpx);
  flex-shrink: 0;
}

.teacher-basic-info {
  flex: 1;
  color: #fff;
}

.teacher-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #fff;
  margin-bottom: 6rpx;
}

.teacher-title {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 8rpx;
}

.teacher-experience {
  display: flex;
  align-items: center;
  gap: 6rpx;
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.8);
}

.experience-icon {
  font-size: 28rpx;
}

.teacher-details-section {
  margin-top: 0;
  padding-top: 0;
  margin-bottom: 20rpx;
  position: relative;
  z-index: 2;
}

.detail-section {
  background: transparent !important;
  background-color: transparent !important;
  border-radius: 16rpx;
  padding: 16rpx 20rpx;
  margin-bottom: 15rpx;
  transition: all 0.3s ease;
  border: none !important;
  box-shadow: none !important;
  backdrop-filter: none !important;
}

.detail-section:last-child {
  margin-bottom: 0;
}

.detail-section:hover {
  background: transparent !important;
  background-color: transparent !important;
  transform: translateY(-2rpx);
}

.card-section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #e53935;
  margin-bottom: 5rpx;
  display: block;
  letter-spacing: 1rpx;
  font-family: 'ZCOOL KuaiLe', 'Microsoft YaHei', sans-serif;
  text-shadow: 0 2rpx 6rpx rgba(0,0,0,0.18);
}

.card-section-content {
  font-size: 26rpx;
  color: #fff;
  font-weight: 600;
  line-height: 1.7;
  display: block;
  letter-spacing: 0.5rpx;
  font-family: 'ZCOOL QingKe HuangYou', 'Microsoft YaHei', sans-serif;
  text-shadow: 0 2rpx 6rpx rgba(0,0,0,0.7);
}

.teacher-stats-section {
  display: flex;
  gap: 20rpx;
  margin-bottom: 20rpx;
  margin-top: auto;
  flex-direction: row;
  justify-content: space-between;
  position: relative;
  z-index: 2;
}

.stat-card {
  flex: 1;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 16rpx;
  padding: 20rpx;
  display: flex;
  align-items: center;
  gap: 12rpx;
  backdrop-filter: blur(10rpx);
}

.stat-icon {
  font-size: 32rpx;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 28rpx;
  font-weight: bold;
  color: #fff;
  line-height: 1;
}

.stat-label {
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 4rpx;
}

.detail-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 25rpx;
  padding: 16rpx 24rpx;
  backdrop-filter: blur(10rpx);
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
}

.detail-button:active {
  transform: scale(0.95);
  background: rgba(255, 255, 255, 0.3);
}

.detail-text {
  font-size: 28rpx;
  color: #fff;
  font-weight: bold;
}

.detail-arrow {
  font-size: 24rpx;
  color: #fff;
  font-weight: bold;
}

.contact-section {
  margin-top: 40rpx;
  padding: 0 20rpx;
  display: flex;
  justify-content: center;
}

.contact-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50rpx;
  padding: 24rpx 150rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
  box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
  cursor: pointer;
}

.contact-button:active {
  transform: scale(0.95);
  box-shadow: 0 4rpx 12rpx rgba(76, 175, 80, 0.4);
}

.contact-icon {
  font-size: 32rpx;
}

.contact-text {
  font-size: 32rpx;
  color: #fff;
  font-weight: bold;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  border-radius: 28rpx;
  width: 92vw;
  max-width: 700rpx;
  overflow-y: auto;
  box-shadow: 0 12rpx 48rpx rgba(102, 126, 234, 0.15);
  padding-bottom: 32rpx;
}

.modal-header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 32rpx 32rpx 0 32rpx;
  border-bottom: 1rpx solid #f0f0f0;
  position: relative;
}

.modal-title-container {
  flex: 1;
  display: flex;
  justify-content: center;
}

.modal-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  letter-spacing: 2rpx;
  text-align: center;
}

.modal-close {
  font-size: 44rpx;
  color: #999;
  cursor: pointer;
  font-weight: bold;
  position: absolute;
  right: 32rpx;
  top: 32rpx;
}

.modal-body {
  padding: 0 32rpx 32rpx 32rpx;
}

.teacher-info-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20rpx;
  padding: 32rpx;
  margin: 24rpx 0;
  display: flex;
  align-items: center;
  gap: 24rpx;
  box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.2);
}

.detail-avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.detail-avatar image {
  width: 100%;
  height: 100%;
}

.detail-info {
  flex: 1;
  color: #fff;
}

.detail-name {
  font-size: 36rpx;
  font-weight: bold;
  color: #fff;
  margin-bottom: 8rpx;
  letter-spacing: 2rpx;
}

.detail-subject {
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  font-size: 24rpx;
  border-radius: 12rpx;
  padding: 4rpx 12rpx;
  margin-bottom: 8rpx;
  font-weight: 500;
  letter-spacing: 1rpx;
}

.detail-title {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 8rpx;
  font-weight: 500;
}

.detail-experience {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.detail-description {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
  margin-top: 16rpx;
}

.detail-section {
  background: #f8f8fc;
  border-radius: 18rpx;
  padding: 20rpx 24rpx;
  margin-bottom: 0;
  box-shadow: 0 2rpx 8rpx rgba(102, 126, 234, 0.06);
}

.section-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 8rpx;
  letter-spacing: 1rpx;
}

.section-content {
  font-size: 26rpx;
  color: #444;
  line-height: 1.7;
}

.custom-modal-mask {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.custom-modal {
  background: #fff;
  border-radius: 32rpx;
  width: 82vw;
  max-width: 600rpx;
  padding: 48rpx 32rpx 32rpx 32rpx;
  box-shadow: 0 12rpx 48rpx rgba(102, 126, 234, 0.15), 0 2rpx 8rpx rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: modalPop .25s;
}
@keyframes modalPop {
  0% { transform: scale(0.8); opacity: 0.5; }
  100% { transform: scale(1); opacity: 1; }
}
.custom-modal-title {
  font-size: 38rpx;
  font-weight: 700;
  color: #222;
  margin-bottom: 28rpx;
  text-align: center;
  letter-spacing: 2rpx;
}
.custom-modal-content view {
  font-size: 30rpx;
  color: #444;
  margin-bottom: 16rpx;
  text-align: left;
  line-height: 1.7;
  letter-spacing: 1rpx;
  user-select: text; /* Added for copyability */
}

.contact-item {
  font-size: 30rpx;
  color: #444;
  margin-bottom: 16rpx;
  text-align: left;
  line-height: 1.7;
  letter-spacing: 1rpx;
  user-select: text;
  cursor: pointer;
  padding: 8rpx 0;
  border-radius: 8rpx;
  transition: all 0.2s ease;
}

.contact-item:hover {
  background: rgba(102, 126, 234, 0.1);
}

.contact-item:active {
  background: rgba(102, 126, 234, 0.2);
}
.custom-modal-btn {
  margin-top: 36rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-size: 32rpx;
  border-radius: 32rpx;
  padding: 20rpx 0;
  width: 100%;
  text-align: center;
  font-weight: bold;
  box-shadow: 0 4rpx 16rpx rgba(102, 126, 234, 0.3);
  letter-spacing: 2rpx;
  transition: all 0.2s;
}
.custom-modal-btn:active {
  transform: scale(0.98);
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
}
</style> 