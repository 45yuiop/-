<template>
  <view class="search-page-container">
    <view class="search-header">
      <button class="search-cancel" @click="goBack">取消</button>
      <input class="search-input" v-model="searchText" placeholder="搜索" @confirm="onSearchConfirm" />
    </view>
    <view v-if="historyList.length" class="history-block">
      <view class="history-title-row">
        <text class="history-title">搜索历史</text>
        <image class="history-delete" src="/static/delete.png" @click="clearHistory" />
      </view>
      <view class="history-list">
        <view class="history-item" v-for="(item, idx) in historyList" :key="idx" @click="onHistoryClick(item)">{{ item }}</view>
      </view>
    </view>
    <view v-if="searchText && filteredList.length > 0">
      <view v-for="(item, idx) in filteredList" :key="idx" class="search-result-item" @click="goToFeature(item)">
        <image class="result-icon" :src="item.icon" mode="aspectFit" />
        <rich-text class="result-text" :nodes="highlightMatch(item.text)"></rich-text>
      </view>
    </view>
    <view v-else-if="searchText && filteredList.length === 0" class="search-empty">暂无相关功能</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      searchText: '',
      featureList: [
        { text: '注册账号', page: '/pages/register/register', icon: '/static/aaa.png' },
        { text: '账号管理', page: '/pages/account-manage/account-manage', icon: '/static/c.png' },
        { text: '教师排课', page: '/pages/teacher-schedule/teacher-schedule', icon: '/static/bb.png' },
        { text: '课时统计', page: '/pages/salary-statistics/salary-statistics', icon: '/static/b.png' },
        { text: '教师课程表', page: '/pages/admin-teacher-schedule/admin-teacher-schedule', icon: '/static/bbb.png' },
        { text: '我的课表', page: '/pages/teacher-courses/teacher-courses', icon: '/static/d.png' },
        { text: '学生课时', page: '/pages/student-hours-query/student-hours-query', icon: '/static/gg.png' },
        { text: '学生课时录入', page: '/pages/student-hours/student-hours', icon: '/static/gg.png' },
        { text: '班级管理', page: '/pages/class-management/class-management', icon: '/static/222.png' },
        { text: '学生录入', page: '/pages/student-input/student-input', icon: '/static/1234.png' },
        { text: '学生档案', page: '/pages/archive/archive', icon: '/static/教室.png' },
        { text: '权限分配', page: '/pages/permission-assign/index', icon: '/static/dd.png' },
        { text: '系统设置', page: '/pages/system-setting/system-setting', icon: '/static/cc.png' },
        { text: '成绩', page: '/pages/exam-scores/exam-scores', icon: '/static/1.png' },
        { text: '进步分析', page: '/pages/student-progress/student-progress', icon: '/static/ii.png' },
        { text: '教室', page: '/pages/classroom/classroom', icon: '/static/2.png' },
        { text: '试卷分析', page: '/pages/exam-analysis/exam-analysis', icon: '/static/22.png' }
      ],
      historyList: [],
      userId: ''
    }
  },
  computed: {
    filteredList() {
      const keyword = this.searchText.replace(/\s/g, '').toLowerCase();
      if (!keyword) return [];
      // 权限过滤：教务管理员不展示"我的课表"、"我的班级"和"进步分析"
      const userInfo = uni.getStorageSync('userInfo');
      const isAcademic = userInfo && (Array.isArray(userInfo.role) ? userInfo.role.includes('教务') : userInfo.role === '教务');
      return this.featureList.filter(f => {
        if (isAcademic && (f.text === '我的课表' || f.text === '我的班级' || f.text === '进步分析')) return false;
        const text = (f.text || '').replace(/\s/g, '').toLowerCase();
        return keyword.split('').every(k => text.includes(k)) || text.includes(keyword);
      });
    }
  },
  mounted() {
    const userInfo = uni.getStorageSync('userInfo');
    this.userId = userInfo ? (userInfo.uid || userInfo.username) : 'anonymous';
    const his = uni.getStorageSync('searchHistory_' + this.userId) || [];
    this.historyList = his;

    // 权限过滤功能列表
    if (userInfo) {
      const isSuperAdmin = userInfo.permission === 'superadmin';
      const isAdmin = userInfo.permission === '管理员' || isSuperAdmin || (Array.isArray(userInfo.role) && userInfo.role.includes('管理员'));
      const isTeacher = Array.isArray(userInfo.role) ? userInfo.role.includes('教师') : userInfo.role === '教师';
      const isParent = Array.isArray(userInfo.role) ? userInfo.role.includes('家长') : userInfo.role === '家长';
      const isAcademic = Array.isArray(userInfo.role) ? userInfo.role.includes('教务') : userInfo.role === '教务';
      const isAdminAcademic = isAcademic && userInfo.permission === '管理员';
      const featureMap = {
        '注册账号': 'register',
        '账号管理': 'user_manage',
        '教师排课': 'schedule',
        '课时统计': 'salary',
        '教师课程表': 'admin_teacher_schedule',
        '我的课表': 'teacher_courses',
        '权限分配': 'permission_assign',
        '系统设置': 'system_setting',
        '班级管理': 'class_management',
        '学生录入': 'student_input',
        '学生档案': 'archive',
        '试卷分析': 'exam_analysis'
      };
      this.featureList = this.featureList.filter(feature => {
        // 超级管理员不显示"我的课表"
        if (isSuperAdmin && feature.text === '我的课表') return false;
        // 管理员权限的教务不显示"课时统计"
        if (isAdminAcademic && feature.text === '课时统计') return false;
        if (isAdmin) {
          // 管理员不能看到"师资力量"功能
          if (feature.text === '师资力量') return false;
          return true;
        }
        if (isParent) {
          return feature.text === '教师课程表' || feature.text === '系统设置';
        }
        if (isTeacher) {
          // 教师账号强制有"我的课表"、"学生课时"、"我的班级"、"成绩"、"进步分析"、"试卷分析"
          // 教师课程表只对管理员和教务开放，普通教师不显示
          if (feature.text === '我的课表' || feature.text === '学生课时' || feature.text === '我的班级' || feature.text === '成绩' || feature.text === '进步分析' || feature.text === '试卷分析') return true;
          if (userInfo.featureList && Array.isArray(userInfo.featureList)) {
            const key = featureMap[feature.text] || feature.text;
            return userInfo.featureList.includes(key) || feature.text === '系统设置';
          }
          return feature.text === '系统设置';
        }
        if (isAcademic) {
          // 教务账号只能有“成绩”，不显示“进步分析”
          if (feature.text === '教师课程表') return true;
          if (feature.text === '学生档案') return true;
          if (feature.text === '调课审批') return false;
          if (feature.text === '我的课表') return false;
          if (feature.text === '学生课时') return true;
          if (feature.text === '成绩') return true;
          if (feature.text === '进步分析') return false;
          if (feature.text === '试卷分析') return false;
          if (userInfo.featureList && Array.isArray(userInfo.featureList)) {
            const key = featureMap[feature.text] || feature.text;
            return userInfo.featureList.includes(key) || feature.text === '系统设置';
          }
          return feature.text === '系统设置';
        }
        return feature.text === '系统设置';
      });
    }
  },
  methods: {
    highlightMatch(text) {
      if (!this.searchText) return text;
      const keyword = this.searchText.replace(/\s/g, '');
      let result = text;
      keyword.split('').forEach(k => {
        if (k) {
          const reg = new RegExp(`(${k})`, 'g');
          result = result.replace(reg, '<span style=\"color:#FFB300\">$1</span>');
        }
      });
      return result;
    },
    goToFeature(item) {
      const userInfo = uni.getStorageSync('userInfo');
      const isAcademic = userInfo && (Array.isArray(userInfo.role) ? userInfo.role.includes('教务') : userInfo.role === '教务');
      if (isAcademic && (item.text === '我的课表' || item.text === '我的班级' || item.text === '进步分析')) {
        uni.showToast({ title: '无权限访问', icon: 'none' });
        return;
      }
      const val = this.searchText.trim();
      if (val) {
        let his = this.historyList.filter(i => i !== val);
        his.unshift(val);
        if (his.length > 8) his = his.slice(0, 8);
        this.historyList = his;
        uni.setStorageSync('searchHistory_' + this.userId, his);
      }
      uni.navigateTo({ url: item.page });
    },
    goBack() {
      // 只要有输入就记录历史
      const val = this.searchText.trim();
      if (val) {
        let his = this.historyList.filter(i => i !== val);
        his.unshift(val);
        if (his.length > 8) his = his.slice(0, 8);
        this.historyList = his;
        uni.setStorageSync('searchHistory_' + this.userId, his);
      }
      uni.navigateBack();
    },
    onSearchConfirm(e) {
      const val = (e.detail && e.detail.value) ? e.detail.value.trim() : this.searchText.trim();
      if (!val) return;
      let his = this.historyList.filter(i => i !== val);
      his.unshift(val);
      if (his.length > 8) his = his.slice(0, 8);
      this.historyList = his;
      uni.setStorageSync('searchHistory_' + this.userId, his);
    },
    onHistoryClick(item) {
      this.searchText = item;
    },
    clearHistory() {
      this.historyList = [];
      uni.removeStorageSync('searchHistory_' + this.userId);
    }
  }
}
</script>

<style scoped>
.search-page-container {
  background: #f5f6fa;
  min-height: 100vh;
  padding-top: 50rpx;
}
.search-header {
  display: flex;
  align-items: center;
  padding: 40rpx 24rpx 24rpx 24rpx;
  background: #fff;
}
.search-cancel {
  margin-right: 24rpx;
  color: #e67c4a;
  font-size: 30rpx;
  background: transparent;
  border: none;
  padding: 0 12rpx;
  height: 64rpx;
  line-height: 64rpx;
}
.search-input {
  flex: 1;
  height: 64rpx;
  background: #f1f3f6;
  border-radius: 32rpx;
  padding-left: 32rpx;
  font-size: 30rpx;
  color: #333;
  border: none;
}
.history-block {
  background: #fff;
  margin: 0 0 18rpx 0;
  padding: 0 24rpx 18rpx 24rpx;
  border-radius: 0 0 24rpx 24rpx;
}
.history-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 0 12rpx 0;
}
.history-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #222;
}
.history-delete {
  width: 36rpx;
  height: 36rpx;
}
.history-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx 18rpx;
}
.history-item {
  background: #f1f3f6;
  color: #666;
  border-radius: 24rpx;
  padding: 8rpx 28rpx;
  font-size: 26rpx;
  margin-right: 0;
  margin-bottom: 0;
  max-width: 32%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.search-result-item {
  background: #fff;
  margin: 0 24rpx 18rpx 24rpx;
  padding: 24rpx 24rpx;
  border-radius: 18rpx;
  font-size: 32rpx;
  color: #222;
  display: flex;
  align-items: center;
}
.result-icon {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  background: #f5f6fa;
  margin-right: 24rpx;
  object-fit: cover;
}
.result-text {
  flex: 1;
  font-size: 32rpx;
  color: #222;
  word-break: break-all;
}
.search-empty {
  text-align: center;
  color: #bbb;
  margin-top: 80rpx;
  font-size: 28rpx;
}
</style> 