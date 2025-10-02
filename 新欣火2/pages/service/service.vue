<template>
  <view class="service-container">
    <view class="search-bar" @click="goToSearch">
      <image class="search-logo" src="/static/b3318194914f809af324de8884bd906(1).png" mode="aspectFit" />
      <input class="search-input-real" :disabled="true" placeholder="大家都在搜：我的课表" placeholder-class="search-placeholder" />
    </view>
    <!-- 分类标签栏 -->
    <scroll-view class="category-tabs" scroll-x>
      <view
        class="category-tab"
        :class="{active: showAllGroups}"
        @click="showAllGroupsMode"
      >
        全部
        <view v-if="showAllGroups" class="tab-underline"></view>
      </view>
      <view
        v-for="cat in filteredCategories"
        :key="cat.key"
        class="category-tab"
        :class="{active: !showAllGroups && activeCategory === cat.key}"
        @click="switchCategory(cat.key)"
      >
        {{ cat.name }}
        <view v-if="!showAllGroups && activeCategory === cat.key" class="tab-underline"></view>
      </view>
    </scroll-view>
    <!-- 全部分组常驻模式 -->
    <view v-if="showAllGroups">
      <view v-if="filteredRecentFeatures.length" class="recent-grid">
        <view
          v-for="(feature, idx) in filteredRecentFeatures"
          :key="'recent-' + idx"
          class="service-card"
          @click="goToFeatureByIndex(idx, true)"
        >
          <view
            class="service-icon-bg"
            :style="{ background: getLightColor(feature.color, feature.bgAlpha || 0.15) }"
          >
            <image class="service-icon" :src="feature.icon" mode="aspectFit"></image>
          </view>
          <text class="service-text">{{ feature.text }}</text>
        </view>
      </view>
      <view
        v-for="cat in filteredCategories.filter(c => c.key !== 'recent')"
        :key="cat.key"
        :id="'cat-' + cat.key"
        class="group"
      >
        <view class="group-title">
          <view class="group-bar" :class="cat.key === 'pre' ? 'bar-pre' : 'bar-daily'" />
          <text>{{ cat.name }}</text>
        </view>
        <view class="group-grid">
          <view
            v-for="(feature, idx) in getCategoryFeatures(cat.key)"
            :key="cat.key + '-' + idx"
            class="service-card"
            @click="goToFeatureByIndex(getCategoryIndexes(cat.key)[idx], false)"
          >
            <view
              class="service-icon-bg"
              :style="{ background: getLightColor(feature.color, feature.bgAlpha || 0.15) }"
            >
              <image class="service-icon" :src="feature.icon" mode="aspectFit"></image>
            </view>
            <text class="service-text">{{ feature.text }}</text>
          </view>
        </view>
      </view>
    </view>
    <!-- 分组聚焦模式 -->
    <view v-else>
      <view v-if="activeCategory === 'recent' && filteredRecentFeatures.length" class="recent-grid">
        <view
          v-for="(feature, idx) in filteredRecentFeatures"
          :key="'recent-' + idx"
          class="service-card"
          @click="goToFeatureByIndex(idx, true)"
        >
          <view
            class="service-icon-bg"
            :style="{ background: getLightColor(feature.color, feature.bgAlpha || 0.15) }"
          >
            <image class="service-icon" :src="feature.icon" mode="aspectFit"></image>
          </view>
          <text class="service-text">{{ feature.text }}</text>
        </view>
      </view>
      <view v-else class="group">
        <view class="group-title">
          <view class="group-bar" :class="activeCategory === 'pre' ? 'bar-pre' : 'bar-daily'" />
          <text>{{ getCategoryName(activeCategory) }}</text>
        </view>
        <view class="group-grid">
          <view
            v-for="(feature, idx) in getCategoryFeatures(activeCategory)"
            :key="activeCategory + '-' + idx"
            class="service-card"
            @click="goToFeatureByIndex(getCategoryIndexes(activeCategory)[idx], false)"
          >
            <view
              class="service-icon-bg"
              :style="{ background: getLightColor(feature.color, feature.bgAlpha || 0.15) }"
            >
              <image class="service-icon" :src="feature.icon" mode="aspectFit"></image>
            </view>
            <text class="service-text">{{ feature.text }}</text>
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
      searchText: '',
      featureList: [
        {
          text: '注册账号',
          icon: '/static/aaa.png',
          page: '/pages/register/register',
          color: '#4FC3F7'
        },
        {
          text: '账号管理',
          icon: '/static/c.png',
          page: '/pages/account-manage/account-manage',
          color: '#FFD600'
        },
        {
          text: '教师排课',
          icon: '/static/bb.png',
          page: '/pages/teacher-schedule/teacher-schedule',
          color: '#7C4DFF'
        },
        {
          text: '课时统计',
          icon: '/static/b.png',
          page: '/pages/salary-statistics/salary-statistics',
          color: '#FF8A65'
        },
        {
          text: '教师课程表',
          icon: '/static/bbb.png',
          page: '/pages/admin-teacher-schedule/admin-teacher-schedule',
          color: '#64B5F6',
          category: 'pre'
        },
        {
          text: '我的课表',
          icon: '/static/d.png',
          page: '/pages/teacher-courses/teacher-courses',
          color: '#FFF3CD',
          bgAlpha: 0.8,
          category: 'pre'
        },
        {
          text: '调课审批',
          icon: '/static/e.png',
          page: '/pages/course-change-approval/course-change-approval',
          color: '#FFB300'
        },
        {
          text: '权限分配',
          icon: '/static/dd.png',
          page: '/pages/permission-assign/index',
          color: '#BA68C8',
          bgAlpha: 1
        },

        {
          text: '系统设置',
          icon: '/static/cc.png',
          page: '/pages/system-setting/system-setting',
          color: '#42A5F7'
        },
        {
          text: '我的班级',
          icon: '/static/教室.png',
          page: '/pages/my-class/my-class',
          color: '#9C27B0',
          category: 'student-input'
        },
        {
          text: '班级管理',
          icon: '/static/222.png',
          page: '/pages/class-management/class-management',
          color: '#9C27B0',
          category: 'student-input'
        },
        {
          text: '学生录入',
          icon: '/static/1234.png',
          page: '/pages/student-input/student-input',
          color: '#4FC3F7',
          category: 'student-input'
        },
        {
          text: '学生档案',
          icon: '/static/gongju.png',
          page: '/pages/archive/archive',
          color: '#42A5F5',
          category: 'student-input'
        },
        {
          text: '成绩',
          icon: '/static/1.png',
          page: '/pages/exam-scores/exam-scores',
          color: '#FF6B6B',
          category: 'score' // 只属于成绩管理
        },
        {
          text: '进步分析',
          icon: '/static/ii.png',
          page: '/pages/student-progress/student-progress',
          color: '#4ECDC4',
          category: 'score' // 只属于成绩管理
        },
        {
          text: '教室',
          icon: '/static/2.png',
          page: '/pages/classroom/classroom',
          color: '#1976D2',
          category: 'pre'
        },
        {
          text: '师资力量',
          icon: '/static/user.png',
          page: '/pages/faculty-strength/faculty-strength',
          color: '#FF9800',
          category: 'faculty'
        },
        {
          text: '试卷分析',
          icon: '/static/22.png',
          page: '/pages/exam-analysis/exam-analysis',
          color: '#E91E63',
          category: 'score'
        }
      ],
      recentFeatures: [],
      activeCategory: 'recent',
      allCategories: [
        { key: 'recent', name: '最近使用' },
        { key: 'pre', name: '课前准备' },
        { key: 'account', name: '账号管理' },
        { key: 'schedule', name: '排课管理' },
        { key: 'score', name: '成绩管理' },
        { key: 'approval', name: '审批' },
        { key: 'student-input', name: '学生管理' },
        { key: 'faculty', name: '师资力量' },
        { key: 'daily', name: '设置' }
      ],
      showAllGroups: true
    }
  },
  computed: {
    isAcademic() {
      const userInfo = uni.getStorageSync('userInfo');
      return userInfo && (Array.isArray(userInfo.role) ? userInfo.role.includes('教务') : userInfo.role === '教务');
    },
    // 根据用户权限过滤功能列表
    filteredFeatures() {
      const userInfo = uni.getStorageSync('userInfo');
      if (!userInfo) return [];
      const isSuperAdmin = userInfo.permission === 'superadmin';
      const isAdmin = userInfo.permission === '管理员' || isSuperAdmin || (Array.isArray(userInfo.role) && userInfo.role.includes('管理员'));
      const isTeacher = Array.isArray(userInfo.role) ? userInfo.role.includes('教师') : userInfo.role === '教师';
      const isParent = Array.isArray(userInfo.role) ? userInfo.role.includes('家长') : userInfo.role === 'parent';
      const isAcademic = this.isAcademic;
      const isAdminAcademic = isAcademic && userInfo.permission === '管理员';
      const isTeacherAndAdmin = isTeacher && isAdmin;
      let features = this.featureList.filter(feature => {
        if (isTeacherAndAdmin && feature.text === '学生课时录入') return false;
        if (isAcademic && feature.text === '调课审批') return false;
        if (isSuperAdmin && feature.text === '我的课表') return false;
        if (isAdminAcademic && feature.text === '课时统计') return false;
        if (isAdmin) {
          // 管理员不能看到"师资力量"功能
          if (feature.text === '师资力量') return false;
          return true;
        }
        if (isParent) {
          return feature.text === '教师课程表' || feature.text === '系统设置' || feature.text === '师资力量';
        }
        if (isTeacher) {
          // 教师服务页和搜索都显示"成绩""进步分析""试卷分析"
          if (
            feature.text === '我的课表' ||
            feature.text === '学生课时' ||
            feature.text === '我的班级' ||
            feature.text === '课时统计' ||
            feature.text === '成绩' ||
            feature.text === '进步分析' ||
            feature.text === '试卷分析' ||
            feature.text === '教室' // 新增
          ) return true;
          if (userInfo.featureList && Array.isArray(userInfo.featureList)) {
            const featureKey = this.getFeatureKey(feature.text);
            return userInfo.featureList.includes(featureKey) || feature.text === '系统设置';
          }
          return feature.text === '系统设置';
        }
        if (isAcademic) {
          // 教务账号服务页和搜索都显示"成绩"，不显示"进步分析"
          if (
            feature.text === '教师课程表' ||
            feature.text === '学生课时' ||
            feature.text === '学生课时录入' ||
            feature.text === '学生档案' ||
            feature.text === '学生录入' || // 新增学生录入功能
            feature.text === '班级管理' || // 新增班级管理功能
            feature.text === '成绩' ||
            feature.text === '教室' // 新增教室功能
          ) return true;
          if (feature.text === '我的课表' || feature.text === '我的班级' || feature.text === '进步分析' || feature.text === '试卷分析') return false;
          if (userInfo.featureList && Array.isArray(userInfo.featureList)) {
            const featureKey = this.getFeatureKey(feature.text);
            return userInfo.featureList.includes(featureKey) || feature.text === '系统设置';
          }
          return feature.text === '系统设置';
        }
        return feature.text === '系统设置';
      });
      // 其他原有搜索过滤逻辑
      if (isAcademic && this.searchText) {
        features = features.filter(f => f.text !== '我的课表' && f.text !== '我的班级' && f.text !== '进步分析' && f.text !== '试卷分析');
      }
      if (isAcademic) {
        features = features.filter(f => f.text !== '我的课表' && f.text !== '我的班级' && f.text !== '进步分析' && f.text !== '试卷分析');
      }
      if (this.searchText) {
        features = features.filter(f => f.text && f.text.toLowerCase().includes(this.searchText.toLowerCase()));
      }
      return features;
    },
    // 过滤后的分类，只显示有功能的分类
    filteredCategories() {
      const userInfo = uni.getStorageSync('userInfo');
      const isAcademic = userInfo && (Array.isArray(userInfo.role) ? userInfo.role.includes('教务') : userInfo.role === '教务');
      const categories = [];
      for (const cat of this.allCategories) {
        if (isAcademic && cat.key === 'approval') continue;
        if (this.getCategoryFeatures(cat.key).length > 0) {
          categories.push(cat);
        }
      }
      return categories;
    },
    preClassFeatures() {
      // 只包含"我的课表"和"教师课程表"
      return this.filteredFeatures.filter(f => f.text === '我的课表' || f.text === '教师课程表');
    },
    preClassIndexes() {
      // 返回在filteredFeatures中的索引
      return this.filteredFeatures.map((f, i) => (f.text === '我的课表' || f.text === '教师课程表') ? i : -1).filter(i => i !== -1);
    },
    dailyFeatures() {
      // 除去"我的课表"和"教师课程表"
      return this.filteredFeatures.filter(f => f.text !== '我的课表' && f.text !== '教师课程表');
    },
    dailyIndexes() {
      return this.filteredFeatures.map((f, i) => (f.text !== '我的课表' && f.text !== '教师课程表') ? i : -1).filter(i => i !== -1);
    },
    filteredRecentFeatures() {
      // 最近使用也要做权限过滤
      const userInfo = uni.getStorageSync('userInfo');
      const isAcademic = userInfo && (Array.isArray(userInfo.role) ? userInfo.role.includes('教务') : userInfo.role === '教务');
      return this.recentFeatures.filter(f => {
        if (isAcademic && (f.text === '我的课表' || f.text === '调课审批' || f.text === '进步分析')) return false;
        return this.filteredFeatures.some(ff => ff.text === f.text);
      });
    }
  },
  created() {
    // 获取当前用户信息
    const userInfo = uni.getStorageSync('userInfo');
    const userId = userInfo ? userInfo.uid || userInfo.username : 'anonymous';
    
    // 基于用户ID获取最近使用记录
    const recent = uni.getStorageSync(`recentFeatures_${userId}`) || [];
    this.recentFeatures = recent;
  },
  onShow() {
    // 每次显示页面时重新获取当前用户的最近使用记录
    const userInfo = uni.getStorageSync('userInfo');
    const userId = userInfo ? userInfo.uid || userInfo.username : 'anonymous';
    
    const recent = uni.getStorageSync(`recentFeatures_${userId}`) || [];
    this.recentFeatures = recent;
  },
  methods: {
    goToFeatureByIndex(idx, isRecent) {
      const feature = isRecent ? this.recentFeatures[idx] : this.filteredFeatures[idx];
      this.goToFeature(feature, isRecent);
    },
    goToFeature(feature, isRecent = false) {
      // 获取当前用户信息
      const userInfo = uni.getStorageSync('userInfo');
      const isAcademic = userInfo && (Array.isArray(userInfo.role) ? userInfo.role.includes('教务') : userInfo.role === '教务');
      if (isAcademic && (feature.text === '我的课表' || feature.text === '调课审批' || feature.text === '进步分析')) {
        uni.showToast({ title: '无权限访问', icon: 'none' });
        return;
      }
      const userId = userInfo ? userInfo.uid || userInfo.username : 'anonymous';
      
      const idx = this.recentFeatures.findIndex(f => f.text === feature.text);
      if (idx !== 0) {
        if (idx > 0) this.recentFeatures.splice(idx, 1);
        this.recentFeatures.unshift(feature);
        if (this.recentFeatures.length > 8) this.recentFeatures.pop();
        // 基于用户ID存储最近使用记录
        uni.setStorageSync(`recentFeatures_${userId}`, this.recentFeatures);
      }
      if (feature.page.startsWith('/pages/schedule-tab')) {
        uni.switchTab({ url: feature.page });
      } else {
        uni.navigateTo({ url: feature.page });
      }
    },
    getLightColor(color, alpha = 0.15) {
      if (!color) return `rgba(200,200,200,${alpha})`;
      const hex = color.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return `rgba(${r},${g},${b},${alpha})`;
    },
    getCategoryFeatures(key) {
      const userInfo = uni.getStorageSync('userInfo');
      const isAcademic = userInfo && (Array.isArray(userInfo.role) ? userInfo.role.includes('教务') : userInfo.role === '教务');
      if (isAcademic && key === 'approval') return [];
      const featuresByCategory = this.filteredFeatures.filter(f => f.category === key);
      if (featuresByCategory.length > 0) return featuresByCategory;
      if (key === 'pre') return this.filteredFeatures.filter(f => f.category === 'pre');
      if (key === 'account') return this.filteredFeatures.filter(f => f.text === '注册账号' || f.text === '账号管理');
      if (key === 'schedule') return this.filteredFeatures.filter(f => f.text === '教师排课' || f.text === '课时统计');
      if (key === 'approval') return this.filteredFeatures.filter(f => f.text === '调课审批');
      if (key === 'daily') return this.filteredFeatures.filter(f =>
        f.text !== '我的课表' &&
        f.text !== '教师课程表' &&
        f.text !== '注册账号' &&
        f.text !== '账号管理' &&
        f.text !== '教师排课' &&
        f.text !== '课时统计' &&
        f.text !== '调课审批' &&
        f.text !== '教室' &&
        f.category !== 'student-input' &&
        f.category !== 'score' &&
        f.category !== 'pre'
      );
      return [];
    },
    getCategoryIndexes(key) {
      // 优先用 category 字段分组
      const indexesByCategory = this.filteredFeatures
        .map((f, i) => (f.category === key ? i : -1))
        .filter(i => i !== -1);
      if (indexesByCategory.length > 0) return indexesByCategory;
      // 兼容原有分组逻辑
      if (key === 'pre') return this.filteredFeatures.map((f, i) => (f.text === '教师课程表') ? i : -1).filter(i => i !== -1);
      if (key === 'account') return this.filteredFeatures.map((f, i) => (f.text === '注册账号' || f.text === '账号管理') ? i : -1).filter(i => i !== -1);
      if (key === 'schedule') return this.filteredFeatures.map((f, i) => (f.text === '教师排课' || f.text === '课时统计') ? i : -1).filter(i => i !== -1);
      if (key === 'approval') return this.filteredFeatures.map((f, i) => (f.text === '调课审批') ? i : -1).filter(i => i !== -1);
      if (key === 'daily') return this.filteredFeatures.map((f, i) => (
        f.text !== '我的课表' &&
        f.text !== '教师课程表' &&
        f.text !== '注册账号' &&
        f.text !== '账号管理' &&
        f.text !== '教师排课' &&
        f.text !== '课时统计' &&
        f.text !== '调课审批' &&
        f.category !== 'student-input' &&
        f.category !== 'score'
        // 移除教室的排除，让教室功能正常显示
      ) ? i : -1).filter(i => i !== -1);
      return [];
    },
    getCategoryName(key) {
      const cat = this.filteredCategories.find(c => c.key === key);
      return cat ? cat.name : '';
    },
    // 根据功能名称获取功能键
    getFeatureKey(featureText) {
      const featureMap = {
        '注册账号': 'register',
        '账号管理': 'user_manage',
        '教师排课': 'schedule',
        '课时统计': 'salary',
        '教师课程表': 'admin_teacher_schedule',
        '我的课表': 'teacher_courses',
        '权限分配': 'permission_assign',
        '系统设置': 'system_setting',
        '学生课时': 'student_hours',
        '学生档案': 'archive',
        '班级管理': 'class_management',
        '学生录入': 'student_input',
        				'师资力量': 'faculty_strength',
				'试卷分析': 'exam_analysis'
			};
			return featureMap[featureText] || featureText;
    },
    switchCategory(key) {
      this.activeCategory = key;
      this.showAllGroups = false;
    },
    showAllGroupsMode() {
      this.showAllGroups = true;
    },
    goToSearch() {
      uni.navigateTo({ url: '/pages/search-page/search-page' });
    }
  }
}
</script>

<style scoped>
.service-container {
  padding: 90rpx 20rpx 20rpx 20rpx;
  background: #f8f8f8;
  min-height: 100vh;
}
.service-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #1976D2;
  margin-bottom: 30rpx;
  text-align: left;
}
.service-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.service-card {
  width: 25%;
  box-sizing: border-box;
  padding: 30rpx 0 13rpx 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 8rpx;
}
.service-icon-bg {
  width: 90rpx;
  height: 90rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8rpx;
}
.service-icon {
  width: 60rpx;
  height: 60rpx;
}
.service-text {
  font-size: 28rpx;
  color: #333;
  margin-top: 6rpx;
  text-align: center;
}
.search-bar {
  display: flex;
  align-items: center;
  background: #e5ecef;
  border-radius: 32rpx;
  padding: 10rpx 20rpx;
  margin-bottom: 32rpx;
  margin-top: 0;
}
.search-logo {
  width: 48rpx;
  height: 48rpx;
  margin-right: 16rpx;
  border-radius: 50%;
  background: #fff;
}
.search-input-real {
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
.recent-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #1976D2;
  margin-bottom: 10rpx;
  margin-top: 0;
  text-align: left;
}
.recent-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin-bottom: 20rpx;
}
.recent-grid .service-card {
  width: 25%;
  box-sizing: border-box;
  padding: 40rpx 0 18rpx 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 0;
}
.group {
  margin-bottom: 35rpx;
}
.group-title {
  display: flex;
  align-items: center;
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 13rpx;
  margin-top: 18rpx;
}
.group-bar {
  width: 8rpx;
  height: 32rpx;
  border-radius: 6rpx;
  margin-right: 16rpx;
}
.bar-pre {
  background: #FF7043;
}
.bar-daily {
  background: #1976D2;
}
.group-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.group-grid .service-card {
  width: 25%;
  box-sizing: border-box;
  padding: 40rpx 0 18rpx 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 0;
}
.category-tabs {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 10rpx;
  margin-bottom: 18rpx;
  background: #fff;
  overflow-x: auto;
  white-space: nowrap;
  border-bottom: 1rpx solid #f0f0f0;
}
.category-tab {
  display: inline-flex;
  align-items: center;
  font-size: 32rpx;
  color: #666;
  margin-right: 36rpx;
  position: relative;
  padding: 12rpx 0;
  font-weight: 500;
  cursor: pointer;
}
.category-tab.active {
  color: #222;
  font-weight: bold;
}
.tab-underline {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 4rpx;
  background: #FF7043;
  border-radius: 2rpx;
}
</style> 